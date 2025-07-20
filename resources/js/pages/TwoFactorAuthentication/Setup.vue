<template>
    <Head title="Authentification à deux facteurs" />

    <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a]">
        <div class="absolute inset-0 before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-repeat before:bg-[length:80px] before:opacity-[0.03] before:mix-blend-overlay before:content-['']"></div>

        <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
            <div class="w-full max-w-2xl">
                <div class="relative rounded-2xl overflow-hidden backdrop-blur-md border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-2xl">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>

                    <div class="relative border-b border-black/5 dark:border-white/5">
                        <div class="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-400/5 to-orange-600/10"></div>
                        <div class="relative px-8 py-12 text-center">
                            <h1 class="text-3xl font-semibold tracking-tighter text-black dark:text-white mb-2">
                                Authentification à deux facteurs
                            </h1>
                            <p class="text-sm text-black/60 dark:text-white/60">
                                Ajoutez une couche de sécurité supplémentaire à votre compte
                            </p>
                        </div>
                    </div>

                    <!-- Message de statut -->
                    <div v-if="page.props.flash?.success" class="mx-8 mt-6">
                        <div class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-800 dark:text-green-400 success-animation">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                                <path d="m9 12 2 2 4-4"/>
                            </svg>
                            <div>
                                <div class="font-medium text-sm">{{ page.props.flash.success }}</div>
                            </div>
                        </div>
                    </div>

                    <div v-if="page.props.flash?.error" class="mx-8 mt-6">
                        <div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-400 error-animation">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" x2="9" y1="9" y2="15"/>
                                <line x1="9" x2="15" y1="9" y2="15"/>
                            </svg>
                            <div>
                                <div class="font-medium text-sm">{{ page.props.flash.error }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="relative p-8">
                        <!-- 2FA Activée -->
                        <div v-if="twoFactorEnabled" class="space-y-6">
                            <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                <div class="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 dark:text-green-400">
                                        <path d="M9 12l2 2 4-4"/>
                                        <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"/>
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7"/>
                                    </svg>
                                    <div>
                                        <h3 class="text-sm font-semibold text-green-800 dark:text-green-400">2FA Activée ✅</h3>
                                        <p class="text-xs text-green-700 dark:text-green-300 mt-1">Votre compte est protégé par l'authentification à deux facteurs</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Codes de récupération -->
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <h3 class="text-lg font-semibold text-black dark:text-white">Codes de récupération</h3>
                                    <button
                                        @click="showRecoveryCodes"
                                        class="px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-300"
                                    >
                                        {{ showingRecoveryCodes ? 'Masquer' : 'Afficher' }}
                                    </button>
                                </div>

                                <div v-if="showingRecoveryCodes" class="space-y-4">
                                    <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                        <div class="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                                                <path d="M12 9v4"/>
                                                <path d="M12 17h.01"/>
                                            </svg>
                                            <div>
                                                <h4 class="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">Important !</h4>
                                                <p class="text-xs text-amber-700 dark:text-amber-300">
                                                    Stockez ces codes de récupération dans un endroit sûr. Ils peuvent être utilisés pour accéder à votre compte si vous perdez votre appareil d'authentification.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-3">
                                        <div v-for="code in recoveryCodes" :key="code?.code" class="relative group">
                                            <div class="p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg font-mono text-sm text-center select-all cursor-pointer transition-all duration-300 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-900/10">
                                                {{ code?.code }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="rounded-xl p-1 border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300">
                                        <button
                                            @click="generateRecoveryCodes"
                                            :disabled="generating"
                                            class="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium text-sm hover:from-amber-600 hover:to-orange-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <div v-if="generating" class="flex items-center gap-2">
                                                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Génération...
                                            </div>
                                            <div v-else class="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                                                </svg>
                                                Générer de nouveaux codes
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Bouton désactiver -->
                            <div class="rounded-xl p-1 border border-red-400/30 hover:border-red-400/50 transition-all duration-300">
                                <button
                                    @click="disableTwoFactorAuthentication"
                                    :disabled="disabling"
                                    class="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium text-base hover:from-red-600 hover:to-red-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <div v-if="disabling" class="flex items-center gap-2">
                                        <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Désactivation...
                                    </div>
                                    <div v-else class="flex items-center gap-2">
                                        Désactiver la 2FA
                                    </div>
                                </button>
                            </div>
                        </div>

                        <!-- 2FA Désactivée ou en cours de configuration -->
                        <div v-else class="space-y-6">
                            <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                <div class="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 dark:text-red-400">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="15" x2="9" y1="9" y2="15"/>
                                        <line x1="9" x2="15" y1="9" y2="15"/>
                                    </svg>
                                    <div>
                                        <h3 class="text-sm font-semibold text-red-800 dark:text-red-400">2FA Désactivée ⚠️</h3>
                                        <p class="text-xs text-red-700 dark:text-red-300 mt-1">Votre compte n'est pas protégé par l'authentification à deux facteurs</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Configuration en cours -->
                            <div v-if="requiresConfirmation" class="space-y-6">
                                <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                    <div class="flex items-start gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                                            <circle cx="12" cy="12" r="10"/>
                                            <path d="M12 16v-4"/>
                                            <path d="M12 8h.01"/>
                                        </svg>
                                        <div>
                                            <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">Configuration de la 2FA</h3>
                                            <div class="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                                                <p>1. Scannez le QR code avec votre application d'authentification</p>
                                                <p>2. Ou saisissez manuellement la clé de configuration</p>
                                                <p>3. Entrez le code généré pour confirmer</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- QR Code -->
                                <div class="text-center space-y-4">
                                    <div class="inline-block p-4 bg-white rounded-xl border border-black/10 dark:border-white/10 shadow-lg">
                                        <div v-html="qrCodeSvg"></div>
                                    </div>

                                    <div class="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
                                        <p class="text-xs text-black/60 dark:text-white/60 mb-2">Clé de configuration manuelle :</p>
                                        <code class="font-mono text-sm text-black dark:text-white select-all break-all">{{ twoFactorSecret }}</code>
                                    </div>
                                </div>

                                <!-- Codes de récupération pendant la configuration -->
                                <div v-if="showingRecoveryCodes" class="space-y-4">
                                    <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                        <div class="flex items-start gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                                                <path d="M12 9v4"/>
                                                <path d="M12 17h.01"/>
                                            </svg>
                                            <div>
                                                <h4 class="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">Codes de récupération d'urgence</h4>
                                                <p class="text-xs text-amber-700 dark:text-amber-300">
                                                    Stockez ces codes dans un endroit sûr. Ils peuvent être utilisés pour accéder à votre compte si vous perdez votre appareil.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-3">
                                        <div v-for="code in recoveryCodes" :key="code?.code" class="relative group">
                                            <div class="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg font-mono text-sm text-center select-all cursor-pointer transition-all duration-300 hover:border-amber-500/70 hover:bg-amber-100/50 dark:hover:bg-amber-900/30">
                                                {{ code?.code }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Formulaire de confirmation -->
                                <form @submit.prevent="confirmTwoFactorAuthentication" class="space-y-4">
                                    <div class="space-y-2">
                                        <label for="code" class="block text-sm font-semibold text-black dark:text-white">
                                            Code de vérification
                                            <span class="text-red-500">*</span>
                                        </label>
                                        <div class="relative">
                                            <input
                                                id="code"
                                                v-model="confirmationForm.code"
                                                type="text"
                                                inputmode="numeric"
                                                autocomplete="one-time-code"
                                                required
                                                placeholder="123456"
                                                maxlength="6"
                                                class="w-full px-4 py-3 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 text-center font-mono tracking-widest"
                                                :class="{ 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': confirmationForm.errors.code }"
                                            />
                                        </div>

                                        <div v-if="confirmationForm.errors.code" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="12" x2="12" y1="8" y2="12"/>
                                                <line x1="12" x2="12.01" y1="16" y2="16"/>
                                            </svg>
                                            {{ confirmationForm.errors.code }}
                                        </div>
                                    </div>

                                    <div class="rounded-xl p-1 border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300">
                                        <button
                                            type="submit"
                                            :disabled="confirming || confirmationForm.processing"
                                            class="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium text-base hover:from-amber-600 hover:to-orange-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <div v-if="confirming || confirmationForm.processing" class="flex items-center gap-2">
                                                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Confirmation...
                                            </div>
                                            <div v-else class="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                                                    <path d="M9 12l2 2 4-4"/>
                                                </svg>
                                                Confirmer la 2FA
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Activation initiale -->
                            <div v-else class="space-y-6">
                                <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                    <div class="flex items-start gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                                            <circle cx="12" cy="12" r="10"/>
                                            <path d="M12 16v-4"/>
                                            <path d="M12 8h.01"/>
                                        </svg>
                                        <div>
                                            <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">Pourquoi activer la 2FA ?</h3>
                                            <ul class="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                                                <li>• Protection contre le piratage de compte</li>
                                                <li>• Sécurité renforcée même si votre mot de passe est compromis</li>
                                                <li>• Conformité aux meilleures pratiques de sécurité</li>
                                                <li>• Accès sécurisé depuis n'importe quel appareil</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="rounded-xl p-1 border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300">
                                    <button
                                        @click="enableTwoFactorAuthentication"
                                        :disabled="enabling"
                                        class="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium text-base hover:from-amber-600 hover:to-orange-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <div v-if="enabling" class="flex items-center gap-2">
                                            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Activation...
                                        </div>
                                        <div v-else class="flex items-center gap-2">
                                            Activer la 2FA
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 duration-300">
                                                <path d="M5 12h14"/>
                                                <path d="m12 5 7 7-7 7"/>
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <div class="flex items-center justify-center gap-6 text-sm">
                        <Link
                            :href="route('dashboard')"
                            class="text-black/60 dark:text-white/60 hover:text-amber-500 dark:hover:text-amber-400 transition-colors duration-300 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14"/>
                                <path d="m5 12 6-6"/>
                                <path d="m5 12 6 6"/>
                            </svg>
                            Retour au tableau de bord
                        </Link>
                        <span class="text-black/20 dark:text-white/20">•</span>
                        <a
                            href="#"
                            class="text-black/60 dark:text-white/60 hover:text-amber-500 dark:hover:text-amber-400 transition-colors duration-300"
                        >
                            Aide sécurité
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Head, Link, usePage, useForm, router } from '@inertiajs/vue3';

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
    router.post(route('two-factor.enable'), {}, {
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
    router.delete(route('two-factor.disable'), {
        preserveScroll: true,
        onFinish: () => {
            disabling.value = false;
        },
    });
};

const generateRecoveryCodes = () => {
    generating.value = true;
    router.post(route('two-factor.recovery-codes'), {}, {
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

<style scoped>
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

.group:hover .group-hover\:translate-x-1 {
    transform: translateX(4px);
}

.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

* {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

input:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.dark input:hover {
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
}

.relative {
    animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

button:active {
    transform: scale(0.98);
}

a:hover {
    text-decoration: none;
}

.backdrop-blur-md {
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
}

::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
}

.success-animation {
    animation: slideInDown 0.5s ease-out;
}

.error-animation {
    animation: slideInDown 0.5s ease-out;
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.qr-code-container {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(251, 146, 60, 0.05));
    border: 1px solid rgba(245, 158, 11, 0.2);
}

.dark .qr-code-container {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 146, 60, 0.1));
    border: 1px solid rgba(245, 158, 11, 0.3);
}

.recovery-code {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(251, 146, 60, 0.05));
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.recovery-code:hover {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 146, 60, 0.1));
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
}

.dark .recovery-code {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 146, 60, 0.1));
}

.dark .recovery-code:hover {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 146, 60, 0.15));
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.info-box {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(251, 146, 60, 0.05));
    border: 1px solid rgba(245, 158, 11, 0.2);
}

.dark .info-box {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 146, 60, 0.1));
    border: 1px solid rgba(245, 158, 11, 0.3);
}

.security-icon-container {
    animation: subtlePulse 4s ease-in-out infinite;
}

@keyframes subtlePulse {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
    }
    50% {
        transform: scale(1.05);
        box-shadow: 0 12px 35px rgba(245, 158, 11, 0.3);
    }
}

.submit-button {
    position: relative;
    overflow: hidden;
}

.submit-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.submit-button:hover::before {
    left: 100%;
}

input[inputmode="numeric"] {
    letter-spacing: 0.2em;
}

input[inputmode="numeric"]:focus {
    animation: gentlePulse 0.3s ease-in-out;
}

@keyframes gentlePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1.01); }
}

.recovery-codes-grid {
    animation: staggeredFadeIn 0.8s ease-out;
}

@keyframes staggeredFadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.info-section {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-section:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.dark .info-section:hover {
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
}

.qr-code {
    animation: zoomIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes zoomIn {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.validation-success {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.1));
    border-color: rgba(34, 197, 94, 0.3);
    animation: successPulse 0.6s ease-out;
}

.validation-error {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
    border-color: rgba(239, 68, 68, 0.3);
    animation: errorShake 0.6s ease-out;
}

@keyframes successPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

@keyframes errorShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
</style>
