<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-vue3';
import { useMatomo } from '../../composables/useMatomo';

const page = usePage();
const matomo = useMatomo();

const code = ref('');
const recoveryCodeMode = ref(false);
const isSubmitting = ref(false);

const startTime = ref(Date.now());
const attemptCount = ref(0);
const codeInputStartTime = ref(null);
const hasInteractedWithToggle = ref(false);
const hasUsedRecoveryMode = ref(false);

const errors = computed(() => page.props.value.errors);

const trackPageLoad = () => {
    matomo.initPageTracking('2fa_challenge', 'authenticating');
    matomo.trackAuthPage('2fa_challenge');
    matomo.setCustomVariable(3, 'Auth_Step', '2fa_challenge', 'page');
    matomo.trackEvent('2FA', 'Challenge_Started', 'authentication');
};

const trackUserAction = (action: string, context: string = '') => {
    matomo.trackUserAction(action, `2fa_challenge_${context}`);
};

const trackFormSubmission = (formType: string, success: boolean, errorType?: string) => {
    matomo.trackFormSubmission(`2fa_${formType}`, success, errorType);
};

const trackEngagement = (type: string, value: string | number) => {
    matomo.trackEngagement(`2fa_challenge_${type}`, value);
};

const trackError = (errorType: string, context: string = '') => {
    matomo.trackError(`2fa_challenge_${errorType}`, context);
};

const trackTimeSpent = () => {
    const timeSpent = Math.round((Date.now() - startTime.value) / 1000);
    trackEngagement('total_time_spent', timeSpent);
};

const trackInputTime = () => {
    if (codeInputStartTime.value) {
        const inputTime = Math.round((Date.now() - codeInputStartTime.value) / 1000);
        trackEngagement('input_time', inputTime);
        codeInputStartTime.value = null;
    }
};

const submitChallenge = async () => {
    attemptCount.value++;
    const currentMode = recoveryCodeMode.value ? 'recovery' : 'authenticator';
    
    trackUserAction('submit_attempt', currentMode);
    trackEngagement('attempt_number', attemptCount.value);
    trackInputTime();
    trackTimeSpent();
    
    if (!code.value.trim()) {
        trackError('empty_code', currentMode);
        return;
    }
    
    isSubmitting.value = true;
    
    try {
        await Inertia.post('/two-factor-challenge', {
            [recoveryCodeMode.value ? 'recovery_code' : 'code']: code.value,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                trackFormSubmission(`challenge_${currentMode}`, true);
                trackUserAction('authentication_success', currentMode);
                trackEngagement('success_attempt_number', attemptCount.value);
                
                const timeToSuccess = Math.round((Date.now() - startTime.value) / 1000);
                trackEngagement('time_to_success', timeToSuccess);
                
                if (recoveryCodeMode.value) {
                    trackUserAction('recovery_code_success', 'authentication');
                }
                
                code.value = '';
            },
            onError: (errors) => {
                const errorType = errors.code || errors.recovery_code ? 'invalid_code' : 'server_error';
                trackFormSubmission(`challenge_${currentMode}`, false, errorType);
                trackError('authentication_failed', `${currentMode}_${errorType}`);
                
                if (attemptCount.value >= 3) {
                    trackUserAction('multiple_failures', `${attemptCount.value}_attempts`);
                }
                
                if (errors.code) {
                    trackError('authenticator_code_invalid', 'user_input');
                } else if (errors.recovery_code) {
                    trackError('recovery_code_invalid', 'user_input');
                }
                
                console.log(errors);
            }
        });
    } catch (error) {
        trackError('submission_error', error.message);
        console.error('Submission error:', error);
    } finally {
        isSubmitting.value = false;
    }
};

const toggleRecoveryMode = () => {
    const newMode = !recoveryCodeMode.value;
    const modeText = newMode ? 'recovery' : 'authenticator';
    
    trackUserAction('mode_toggle', `to_${modeText}`);
    
    if (!hasInteractedWithToggle.value) {
        hasInteractedWithToggle.value = true;
        trackEngagement('first_mode_toggle', modeText);
    }
    
    if (newMode && !hasUsedRecoveryMode.value) {
        hasUsedRecoveryMode.value = true;
        trackUserAction('recovery_mode_first_use', 'fallback');
        trackEngagement('fallback_usage', 'recovery_codes');
    }
    
    recoveryCodeMode.value = newMode;
    code.value = '';
    
    codeInputStartTime.value = null;
};

const handleCodeInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const inputValue = target.value;
    
    if (!codeInputStartTime.value && inputValue.length > 0) {
        codeInputStartTime.value = Date.now();
        trackUserAction('code_input_started', recoveryCodeMode.value ? 'recovery' : 'authenticator');
    }
    
    if (recoveryCodeMode.value) {
        if (inputValue.length >= 8) {
            trackEngagement('recovery_code_length', 'complete');
        }
    } else {
        if (inputValue.length === 6) {
            trackEngagement('authenticator_code_length', 'complete');
        }
    }
    
    if (inputValue.includes(' ') || inputValue.includes('-')) {
        trackUserAction('formatted_input_detected', 'user_behavior');
    }
};

const handleInputFocus = () => {
    const mode = recoveryCodeMode.value ? 'recovery' : 'authenticator';
    trackUserAction('input_focused', mode);
};

const handleInputBlur = () => {
    const mode = recoveryCodeMode.value ? 'recovery' : 'authenticator';
    trackUserAction('input_blurred', mode);
    trackInputTime();
};

const handlePaste = (event: ClipboardEvent) => {
    const mode = recoveryCodeMode.value ? 'recovery' : 'authenticator';
    trackUserAction('code_pasted', mode);
    trackEngagement('input_method', 'paste');
};

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        trackUserAction('enter_key_submit', recoveryCodeMode.value ? 'recovery' : 'authenticator');
    } else if (event.key === 'Tab') {
        trackUserAction('tab_navigation', 'keyboard');
    }
};

onMounted(() => {
    trackPageLoad();
    
    setTimeout(() => {
        trackEngagement('time_milestone', '30s');
    }, 30000);
    
    setTimeout(() => {
        trackEngagement('time_milestone', '60s');
    }, 60000);
    
    setTimeout(() => {
        trackEngagement('time_milestone', '120s');
        trackUserAction('extended_session', 'potential_difficulty');
    }, 120000);
    
    setTimeout(() => {
        if (attemptCount.value === 0) {
            trackUserAction('potential_abandonment', 'no_attempts');
        }
    }, 300000);
    
    if (navigator.userAgent.includes('Mobile')) {
        trackEngagement('device_type', 'mobile');
    } else {
        trackEngagement('device_type', 'desktop');
    }
    
    if (navigator.userAgent.includes('Android') || navigator.userAgent.includes('iPhone')) {
        trackEngagement('likely_has_auth_app', 'mobile_device');
    }
});

onUnmounted(() => {
    trackTimeSpent();
    
    if (attemptCount.value === 0) {
        trackUserAction('page_exit_no_attempt', 'abandonment');
    } else if (errors.value && Object.keys(errors.value).length > 0) {
        trackUserAction('page_exit_with_errors', 'abandonment_after_failure');
    }
});
</script>

<template>
    <div class="flex min-h-screen items-center justify-center p-6">
        <div class="w-full max-w-md">
            <div class="pixel-border pixel-border-dirt mb-6">
                <div class="pixel-border pixel-border-dark-dirt p-8 dark:!bg-transparent dark:!shadow-none">
                    <div class="pixel-border pixel-border-stone mb-6 px-4 py-3 text-center">
                        <h1 class="font-mono text-xl font-bold text-white dark:text-black">Authentification à Deux Facteurs</h1>
                        <p class="mt-2 font-mono text-sm text-white dark:text-black">
                            <span v-if="!recoveryCodeMode">
                                Entrez le code généré par votre application d'authentification.
                            </span>
                            <span v-else>
                                Entrez un code de récupération.
                            </span>
                        </p>
                    </div>

                    <form @submit.prevent="submitChallenge" class="space-y-6">
                        <div class="space-y-2">
                            <div class="inline-block px-3 py-1">
                                <label for="code" class="font-mono text-sm font-bold text-white dark:text-black">
                                    {{ recoveryCodeMode ? 'Code de récupération' : 'Code d\'authentification' }}
                                </label>
                            </div>
                            <div class="pixel-border pixel-border-stone mt-2">
                                <input
                                    id="code"
                                    type="text"
                                    v-model="code"
                                    @input="handleCodeInput"
                                    @focus="handleInputFocus"
                                    @blur="handleInputBlur"
                                    @paste="handlePaste"
                                    @keydown="handleKeyDown"
                                    required
                                    autofocus
                                    :inputmode="recoveryCodeMode ? 'text' : 'numeric'"
                                    autocomplete="one-time-code"
                                    :placeholder="recoveryCodeMode ? 'Votre code de récupération' : 'Votre code (123456)'"
                                    :maxlength="recoveryCodeMode ? 20 : 6"
                                    class="w-full border-none bg-white p-3 font-mono text-black outline-none"
                                    :class="{ 'bg-red-50': errors?.code || errors?.recovery_code }"
                                />
                            </div>
                            <div v-if="errors?.code || errors?.recovery_code" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2">
                                <span class="font-mono text-sm text-red-800">
                                    {{ errors?.code || errors?.recovery_code }}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <button
                                type="submit"
                                :disabled="isSubmitting || !code.trim()"
                                class="pixel-border w-full transition-colors duration-200 hover:bg-yellow-50 disabled:cursor-not-allowed disabled:opacity-70"
                                :class="{ 'animate-pulse': isSubmitting }"
                            >
                                <div class="pixel-border flex items-center justify-center gap-3 px-6 py-3">
                                    <div v-if="isSubmitting" class="animate-spin">
                                        <div class="pixel-border pixel-border-dirt h-4 w-4"></div>
                                    </div>
                                    <span class="font-mono font-bold text-white dark:text-black">
                                        {{ isSubmitting ? 'Vérification...' : 'Se connecter' }}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </form>

                    <div class="mt-6 px-4 py-3 text-center">
                        <button
                            type="button"
                            @click="toggleRecoveryMode"
                            class="pixel-border pixel-border-gold ml-2 inline-block px-2 py-1 duration-200 hover:bg-yellow-100"
                        >
                            <span class="font-mono text-sm font-bold text-white dark:text-black">
                                {{ recoveryCodeMode ? 'Utiliser un code d\'authentification' : 'Utiliser un code de récupération' }}
                            </span>
                        </button>
                    </div>

                    <!-- Help section -->
                    <div class="mt-6 px-4 py-3 text-center border-t border-gray-700/50">
                        <div class="space-y-2">
                            <p class="font-mono text-xs text-white dark:text-black opacity-70">
                                {{ recoveryCodeMode ? 'Utilisez un des codes de récupération sauvegardés' : 'Ouvrez votre app d\'authentification' }}
                            </p>
                            <div v-if="!recoveryCodeMode" class="flex justify-center space-x-2 text-xs">
                                <span @click="trackUserAction('help_click', 'auth_apps')" class="font-mono text-white dark:text-black opacity-50 hover:opacity-70 cursor-pointer">
                                    Google Authenticator
                                </span>
                                <span class="text-white dark:text-black opacity-30">•</span>
                                <span @click="trackUserAction('help_click', 'auth_apps')" class="font-mono text-white dark:text-black opacity-50 hover:opacity-70 cursor-pointer">
                                    Authy
                                </span>
                                <span class="text-white dark:text-black opacity-30">•</span>
                                <span @click="trackUserAction('help_click', 'auth_apps')" class="font-mono text-white dark:text-black opacity-50 hover:opacity-70 cursor-pointer">
                                    Microsoft Authenticator
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Attempt counter (only show after multiple attempts) -->
                    <div v-if="attemptCount >= 2" class="mt-4 px-4 py-2 text-center">
                        <p class="font-mono text-xs text-orange-600 dark:text-orange-800">
                            Tentative {{ attemptCount }} - Vérifiez que vous utilisez la bonne application
                        </p>
                    </div>

                    <!-- Security notice -->
                    <div class="mt-6 px-4 py-3 text-center">
                        <p class="font-mono text-xs text-white dark:text-black opacity-60">
                            🔒 Cette étape protège votre compte contre les accès non autorisés
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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

.animate-pulse {
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}

/* Input validation styles */
input.bg-red-50 {
    background-color: #fef2f2;
    border-color: #fca5a5;
}

input.bg-red-50:focus {
    box-shadow: inset 0 0 0 2px #ef4444;
}

/* Loading animation for submit button */
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* Help text hover effects */
.cursor-pointer:hover {
    text-decoration: underline;
}

/* Mode toggle button enhancement */
.pixel-border-gold:hover {
    background-color: var(--color-gold-secondary);
    transform: translateY(-1px);
}

/* Attempt counter animation */
.text-orange-600 {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Enhanced accessibility */
button:focus-visible {
    outline: 2px solid var(--color-gold-primary);
    outline-offset: 2px;
}

input:focus-visible {
    outline: 2px solid var(--color-gold-primary);
    outline-offset: 2px;
}

/* Responsive improvements */
@media (max-width: 640px) {
    .pixel-border {
        margin: 0.5rem;
    }
    
    input {
        font-size: 16px; /* Prevent zoom on iOS */
    }
}

/* Dark mode improvements */
@media (prefers-color-scheme: dark) {
    .bg-red-50 {
        background-color: #7f1d1d;
        color: #fef2f2;
    }
}
</style>