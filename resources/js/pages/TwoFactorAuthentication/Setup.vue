<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { usePage, useForm } from '@inertiajs/vue3';

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

const enabling = ref(false);
const confirming = ref(false);
const disabling = ref(false);
const generating = ref(false);
const showingRecoveryCodes = ref(false);
const confirmingTwoFactorAuthentication = ref(false);

const confirmationForm = useForm({
    code: '',
});

const requiresConfirmation = computed(() => {
    return props.twoFactorSecret && !props.twoFactorEnabled;
});

watch(requiresConfirmation, (newVal) => {
    if (newVal) {
        confirmingTwoFactorAuthentication.value = true;
        showingRecoveryCodes.value = true;
    } else {
        confirmingTwoFactorAuthentication.value = false;
        showingRecoveryCodes.value = false;
    }
});

const enableTwoFactorAuthentication = () => {
    enabling.value = true;
    page.post(route('two-factor.enable'), {}, {
        preserveScroll: true,
        onFinish: () => {
            enabling.value = false;
        },
    });
};

const confirmTwoFactorAuthentication = () => {
    confirming.value = true;
    confirmationForm.post(route('two-factor.confirm'), {
        preserveScroll: true,
        onSuccess: () => {
            confirmationForm.reset('code');
        },
        onFinish: () => {
            confirming.value = false;
        },
    });
};

const disableTwoFactorAuthentication = () => {
    disabling.value = true;
    page.delete(route('two-factor.disable'), {
        preserveScroll: true,
        onFinish: () => {
            disabling.value = false;
        },
    });
};

const generateRecoveryCodes = () => {
    generating.value = true;
    page.post(route('two-factor.recovery-codes'), {}, {
        preserveScroll: true,
        onFinish: () => {
            generating.value = false;
            showingRecoveryCodes.value = true;
        },
    });
};

const showRecoveryCodes = () => {
    showingRecoveryCodes.value = !showingRecoveryCodes.value;
    if (!showingRecoveryCodes.value && requiresConfirmation.value) {
        confirmingTwoFactorAuthentication.value = true;
    }
};
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

                    <div v-if="page.props.flash?.success || page.props.flash?.error" class="pixel-border pixel-border-stone mb-4 px-3 py-2 text-center">
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
                                <li v-for="code in recoveryCodes" :key="code?.code" class="pixel-border pixel-border-gold bg-white px-2 py-1 text-center select-all">
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
                            <div v-html="qrCodeSvg" class="flex justify-center my-4"></div>
                            <div class="font-mono text-xs text-black mb-4 text-center overflow-x-auto">
                                Clé de configuration : <strong>{{ twoFactorSecret }}</strong>
                            </div>

                            <div v-if="showingRecoveryCodes">
                                <p class="mt-3 font-mono text-sm text-white dark:text-black">
                                    Stockez ces codes de récupération d'urgence dans un endroit sûr.
                                </p>
                                <ul class="grid grid-cols-2 gap-2 font-mono text-base text-black custom-codes-list mt-4 mb-2">
                                    <li v-for="code in recoveryCodes" :key="code?.code" class="pixel-border pixel-border-gold bg-white px-2 py-1 text-center select-all">
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
                                            type="text"
                                            inputmode="numeric"
                                            autocomplete="one-time-code"
                                            required
                                            placeholder="123 456"
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
.pixel-border {
    /* ...pixel-border styles déjà présents dans le projet... */
}
.custom-codes-list li {
    letter-spacing: 0.05em;
    font-size: 1rem;
    user-select: all;
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
</style>
