<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { usePage, useForm, router } from '@inertiajs/vue3';
import { useMatomo } from '../../composables/useMatomo';

const props = defineProps({
    twoFactorEnabled: {
        type: Boolean,
        required: true,
    },
    qrCodeSvg: {
        type: String,
        default: null,
    },
    twoFactorSecret: {
        type: String,
        default: null,
    },
    recoveryCodes: {
        type: Array,
        default: () => [],
    },
});

const page = usePage();
const matomo = useMatomo();

// Reactive state
const enabling = ref(false);
const confirming = ref(false);
const disabling = ref(false);
const generating = ref(false);
const showingRecoveryCodes = ref(false);
const confirmingTwoFactorAuthentication = ref(false);

// Tracking variables
const startTime = ref(Date.now());
const qrCodeViewed = ref(false);
const secretCopied = ref(false);
const recoveryCodesViewed = ref(false);

const confirmationForm = useForm({
    code: '',
});

const requiresConfirmation = computed(() => {
    return props.twoFactorSecret && !props.twoFactorEnabled;
});

const trackPageLoad = () => {
    const userStatus = props.twoFactorEnabled ? 'enabled' : 'disabled';
    matomo.initPageTracking('2fa_setup', userStatus);
    matomo.trackAuthPage('2fa_setup');
    matomo.setCustomVariable(3, '2FA_Status', userStatus, 'page');
    matomo.trackEvent('2FA', 'Page_Load', userStatus);
};

const trackUserAction = (action: string, context: string = '') => {
    matomo.trackUserAction(action, `2fa_${context}`);
};

const trackFormSubmission = (formType: string, success: boolean, errorType?: string) => {
    matomo.trackFormSubmission(`2fa_${formType}`, success, errorType);
};

const trackEngagement = (type: string, value: string | number) => {
    matomo.trackEngagement(`2fa_${type}`, value);
};

const trackTimeSpent = () => {
    const timeSpent = Math.round((Date.now() - startTime.value) / 1000);
    trackEngagement('time_spent', timeSpent);
};

const trackQRCodeView = () => {
    if (!qrCodeViewed.value) {
        qrCodeViewed.value = true;
        trackUserAction('qr_code_viewed', 'setup');
        trackEngagement('qr_code_engagement', 'viewed');
    }
};

const trackSecretCopy = () => {
    if (!secretCopied.value) {
        secretCopied.value = true;
        trackUserAction('secret_copied', 'setup');
        trackEngagement('secret_engagement', 'copied');
    }
};

const trackRecoveryCodesView = () => {
    if (!recoveryCodesViewed.value) {
        recoveryCodesViewed.value = true;
        trackUserAction('recovery_codes_viewed', 'management');
        trackEngagement('recovery_codes_engagement', 'viewed');
    }
};

const trackError = (errorType: string, context: string = '') => {
    matomo.trackError(`2fa_${errorType}`, context);
};

// Watch for changes
watch(requiresConfirmation, (newVal) => {
    if (newVal) {
        confirmingTwoFactorAuthentication.value = true;
        showingRecoveryCodes.value = true;
        trackUserAction('confirmation_required', 'setup');
    } else {
        confirmingTwoFactorAuthentication.value = false;
        showingRecoveryCodes.value = false;
    }
});

watch(showingRecoveryCodes, (newVal) => {
    if (newVal) {
        trackRecoveryCodesView();
    }
});

const enableTwoFactorAuthentication = () => {
    trackUserAction('enable_attempt', 'setup');
    trackTimeSpent();
    
    enabling.value = true;
    router.post(route('two-factor.enable'), {}, {
        preserveScroll: true,
        onSuccess: () => {
            trackFormSubmission('enable', true);
            trackUserAction('enable_success', 'setup');
            trackEngagement('setup_completed', 'enabled');
        },
        onError: (errors) => {
            trackFormSubmission('enable', false, 'server_error');
            trackError('enable_failed', JSON.stringify(errors));
        },
        onFinish: () => {
            enabling.value = false;
        },
    });
};

const confirmTwoFactorAuthentication = () => {
    if (!confirmationForm.code) {
        trackError('empty_code', 'confirmation');
        return;
    }

    trackUserAction('confirm_attempt', 'setup');
    trackTimeSpent();
    
    confirming.value = true;
    confirmationForm.post(route('two-factor.confirm'), {
        preserveScroll: true,
        onSuccess: () => {
            trackFormSubmission('confirm', true);
            trackUserAction('confirm_success', 'setup');
            trackEngagement('setup_completed', 'confirmed');
            confirmationForm.reset('code');
        },
        onError: (errors) => {
            const errorType = errors.code ? 'invalid_code' : 'server_error';
            trackFormSubmission('confirm', false, errorType);
            trackError('confirm_failed', JSON.stringify(errors));
        },
        onFinish: () => {
            confirming.value = false;
        },
    });
};

const disableTwoFactorAuthentication = () => {
    trackUserAction('disable_attempt', 'management');
    trackTimeSpent();
    
    disabling.value = true;
    router.delete(route('two-factor.disable'), {
        preserveScroll: true,
        onSuccess: () => {
            trackFormSubmission('disable', true);
            trackUserAction('disable_success', 'management');
            trackEngagement('security_changed', 'disabled');
        },
        onError: (errors) => {
            trackFormSubmission('disable', false, 'server_error');
            trackError('disable_failed', JSON.stringify(errors));
        },
        onFinish: () => {
            disabling.value = false;
        },
    });
};

const generateRecoveryCodes = () => {
    trackUserAction('generate_codes_attempt', 'management');
    
    generating.value = true;
    router.post(route('two-factor.recovery-codes'), {}, {
        preserveScroll: true,
        onSuccess: () => {
            trackFormSubmission('generate_codes', true);
            trackUserAction('generate_codes_success', 'management');
            trackEngagement('security_action', 'codes_regenerated');
            showingRecoveryCodes.value = true;
        },
        onError: (errors) => {
            trackFormSubmission('generate_codes', false, 'server_error');
            trackError('generate_codes_failed', JSON.stringify(errors));
        },
        onFinish: () => {
            generating.value = false;
        },
    });
};

const showRecoveryCodes = () => {
    const action = showingRecoveryCodes.value ? 'hide' : 'show';
    trackUserAction(`recovery_codes_${action}`, 'management');
    
    showingRecoveryCodes.value = !showingRecoveryCodes.value;
    if (!showingRecoveryCodes.value && requiresConfirmation.value) {
        confirmingTwoFactorAuthentication.value = true;
    }
};

const handleCodeInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const code = target.value;
    
    if (code.length === 6) {
        trackEngagement('code_entered', 'complete');
    } else if (code.length > 0) {
        trackEngagement('code_entered', 'partial');
    }
};

const handleSecretClick = () => {
    trackSecretCopy();
    if (props.twoFactorSecret && navigator.clipboard) {
        navigator.clipboard.writeText(props.twoFactorSecret);
        trackUserAction('secret_copied_clipboard', 'setup');
    }
};

onMounted(() => {
    trackPageLoad();
    
    if (props.qrCodeSvg) {
        setTimeout(() => {
            trackQRCodeView();
        }, 1000);
    }
    
    setTimeout(() => {
        trackEngagement('time_milestone', '30s');
    }, 30000);
    
    setTimeout(() => {
        trackEngagement('time_milestone', '60s');
    }, 60000);
    
    setTimeout(() => {
        trackEngagement('time_milestone', '180s');
        trackUserAction('extended_session', 'difficulty_indicator');
    }, 180000);
});

onUnmounted(() => {
    trackTimeSpent();
});
</script>

<template>
    <div class="flex min-h-screen items-center justify-center p-6">
        <div class="w-full max-w-xl">
            <div class="pixel-border pixel-border-dirt mb-6">
                <div class="pixel-border pixel-border-dark-dirt p-8 dark:!bg-transparent dark:!shadow-none">
                    <div class="pixel-border pixel-border-stone mb-6 px-4 py-3 text-center">
                        <h1 class="font-mono text-xl font-bold text-white dark:text-black">Authentification à deux facteurs</h1>
                        <p class="mt-2 font-mono text-sm text-white dark:text-black">
                            Ajoutez une couche de sécurité supplémentaire à votre compte.
                        </p>
                    </div>

                    <div v-if="page.props.flash?.success || page.props.flash?.error" 
                         class="pixel-border pixel-border-stone mb-4 px-3 py-2 text-center"
                         @click="trackUserAction('flash_message_clicked', 'info')">
                        <span class="font-mono text-sm" :class="page.props.flash?.success ? 'text-green-800' : 'text-red-800'">
                            {{ page.props.flash?.success || page.props.flash?.error }}
                        </span>
                    </div>

                    <div v-if="props.twoFactorEnabled">
                        <div class="pixel-border pixel-border-stone mb-4 px-3 py-2 text-center">
                            <span class="font-mono text-sm text-green-800">La 2FA est ACTIVÉE.</span>
                        </div>

                        <div v-if="showingRecoveryCodes">
                            <p class="mt-3 font-mono text-sm text-white dark:text-black">
                                Stockez ces codes de récupération dans un endroit sûr.
                            </p>
                            <ul class="grid grid-cols-2 gap-2 font-mono text-base text-black custom-codes-list mt-4 mb-2">
                                <li v-for="code in recoveryCodes" 
                                    :key="code?.code" 
                                    @click="trackUserAction('recovery_code_clicked', 'copy')"
                                    class="pixel-border pixel-border-gold bg-white px-2 py-1 text-center select-all cursor-pointer hover:bg-yellow-50">
                                    {{ code?.code }}
                                </li>
                            </ul>
                            <button
                                @click="generateRecoveryCodes"
                                :disabled="generating"
                                class="pixel-border w-full mb-4 transition-colors duration-200 hover:bg-yellow-100 font-mono font-bold text-yellow-800 dark:text-black py-2"
                            >
                                <span v-if="generating">Génération...</span>
                                <span v-else>Générer de nouveaux codes de récupération</span>
                            </button>
                        </div>

                        <div class="flex flex-col gap-3 mt-4">
                            <button
                                v-if="!showingRecoveryCodes"
                                @click="showRecoveryCodes"
                                class="pixel-border w-full transition-colors duration-200 hover:bg-stone-100 font-mono font-bold text-stone-800 dark:text-black py-2"
                            >
                                Afficher les codes de récupération
                            </button>
                            <button
                                v-if="showingRecoveryCodes"
                                @click="showRecoveryCodes"
                                class="pixel-border w-full transition-colors duration-200 hover:bg-stone-100 font-mono font-bold text-stone-800 dark:text-black py-2"
                            >
                                Cacher les codes de récupération
                            </button>
                            <button
                                @click="disableTwoFactorAuthentication"
                                :disabled="disabling"
                                class="pixel-border w-full transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70 font-mono font-bold text-red-800 dark:text-black py-2"
                            >
                                <span v-if="disabling">Désactivation...</span>
                                <span v-else>Désactiver la 2FA</span>
                            </button>
                        </div>
                    </div>

                    <div v-else>
                        <div class="pixel-border pixel-border-stone mb-4 px-3 py-2 text-center">
                            <span class="font-mono text-sm text-red-800">La 2FA est DÉSACTIVÉE.</span>
                        </div>

                        <div v-if="requiresConfirmation">
                            <p class="mt-3 font-mono text-sm text-white dark:text-black">
                                Scannez ce QR code avec votre application d'authentification ou saisissez la clé manuellement, puis entrez le code généré.
                            </p>
                            <div v-html="qrCodeSvg" 
                                 @click="trackQRCodeView"
                                 class="flex justify-center my-4 cursor-pointer"></div>
                            <div class="font-mono text-xs text-black mb-4 text-center overflow-x-auto">
                                Clé de configuration : 
                                <strong @click="handleSecretClick" 
                                        class="cursor-pointer hover:bg-yellow-200 px-1 py-0.5 rounded"
                                        title="Cliquer pour copier">
                                    {{ twoFactorSecret }}
                                </strong>
                            </div>

                            <div v-if="showingRecoveryCodes">
                                <p class="mt-3 font-mono text-sm text-white dark:text-black">
                                    Stockez ces codes de récupération d'urgence dans un endroit sûr.
                                </p>
                                <ul class="grid grid-cols-2 gap-2 font-mono text-base text-black custom-codes-list mt-4 mb-2">
                                    <li v-for="code in recoveryCodes" 
                                        :key="code?.code" 
                                        @click="trackUserAction('recovery_code_clicked', 'initial_setup')"
                                        class="pixel-border pixel-border-gold bg-white px-2 py-1 text-center select-all cursor-pointer hover:bg-yellow-50">
                                        {{ code?.code }}
                                    </li>
                                </ul>
                            </div>

                            <form @submit.prevent="confirmTwoFactorAuthentication" class="space-y-4 mt-6">
                                <div>
                                    <label for="code" class="font-mono text-sm font-bold text-white dark:text-black">Code de l'application :</label>
                                    <div class="pixel-border pixel-border-stone mt-2">
                                        <input
                                            id="code"
                                            v-model="confirmationForm.code"
                                            @input="handleCodeInput"
                                            @focus="trackUserAction('code_input_focused', 'setup')"
                                            @blur="trackUserAction('code_input_blurred', 'setup')"
                                            type="text"
                                            inputmode="numeric"
                                            autocomplete="one-time-code"
                                            required
                                            placeholder="123 456"
                                            maxlength="6"
                                            class="w-full border-none bg-white p-3 font-mono text-black outline-none"
                                        />
                                    </div>
                                    <div v-if="confirmationForm.errors.code" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2 mt-2">
                                        <span class="font-mono text-sm text-red-800">{{ confirmationForm.errors.code }}</span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    :disabled="confirming || confirmationForm.processing"
                                    class="pixel-border w-full transition-colors duration-200 hover:bg-green-50 font-mono font-bold text-green-800 dark:text-black py-2"
                                >
                                    <span v-if="confirming || confirmationForm.processing">Confirmation...</span>
                                    <span v-else>Confirmer</span>
                                </button>
                            </form>
                        </div>

                        <div v-else class="mt-5">
                            <button
                                @click="enableTwoFactorAuthentication"
                                :disabled="enabling"
                                class="pixel-border w-full transition-colors duration-200 hover:bg-green-50 font-mono font-bold text-green-800 dark:text-black py-2"
                            >
                                <span v-if="enabling">Activation...</span>
                                <span v-else>Activer la 2FA</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-codes-list li {
    letter-spacing: 0.05em;
    font-size: 1rem;
    user-select: all;
    transition: all 0.2s ease;
}

.custom-codes-list li:hover {
    transform: scale(1.02);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

input:focus {
    box-shadow: inset 0 0 0 2px var(--color-gold-primary);
}

button:focus {
    box-shadow: 0 0 0 2px var(--color-gold-primary);
}

.pixel-border:hover {
    transform: translateY(-1px);
    transition: transform 0.1s ease-in-out;
}

button:hover:not(:disabled) {
    transform: translateY(-2px);
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Animation pour les états de chargement */
button:disabled {
    position: relative;
}

button:disabled::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    margin: auto;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>