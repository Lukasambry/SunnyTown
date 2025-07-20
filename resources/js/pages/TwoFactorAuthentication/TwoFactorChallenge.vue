<template>
    <Head title="Authentification à deux facteurs" />

    <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a]">
        <div class="absolute inset-0 before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-repeat before:bg-[length:80px] before:opacity-[0.03] before:mix-blend-overlay before:content-['']"></div>

        <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
            <div class="w-full max-w-md">
                <div class="relative rounded-2xl overflow-hidden backdrop-blur-md border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-2xl">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>

                    <div class="relative border-b border-black/5 dark:border-white/5">
                        <div class="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-400/5 to-orange-600/10"></div>
                        <div class="relative px-8 py-12 text-center">
                            <h1 class="text-3xl font-semibold tracking-tighter text-black dark:text-white mb-2">
                                Authentification à deux facteurs
                            </h1>
                            <p class="text-sm text-black/60 dark:text-white/60">
                                <span v-if="!recoveryCodeMode">
                                    Entrez le code généré par votre application d'authentification
                                </span>
                                <span v-else>
                                    Entrez un de vos codes de récupération
                                </span>
                            </p>
                        </div>
                    </div>

                    <div class="relative p-8">
                        <form @submit.prevent="submitChallenge" class="space-y-6">
                            <div class="space-y-2">
                                <label for="code" class="block text-sm font-semibold text-black dark:text-white">
                                    {{ recoveryCodeMode ? 'Code de récupération' : 'Code d\'authentification' }}
                                    <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input
                                        id="code"
                                        v-model="code"
                                        type="text"
                                        required
                                        autofocus
                                        :inputmode="recoveryCodeMode ? 'text' : 'numeric'"
                                        autocomplete="one-time-code"
                                        :placeholder="recoveryCodeMode ? 'abc123-def456' : '123456'"
                                        :maxlength="recoveryCodeMode ? 20 : 6"
                                        class="w-full px-4 py-3 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 text-center font-mono tracking-widest"
                                        :class="{
                                            'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': hasError,
                                            'tracking-normal': recoveryCodeMode
                                        }"
                                    />
                                </div>

                                <div v-if="hasError" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" x2="12" y1="8" y2="12"/>
                                        <line x1="12" x2="12.01" y1="16" y2="16"/>
                                    </svg>
                                    {{ errorMessage }}
                                </div>
                            </div>

                            <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                <div class="flex items-start gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 16v-4"/>
                                        <path d="M12 8h.01"/>
                                    </svg>
                                    <div>
                                        <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">
                                            {{ recoveryCodeMode ? 'Code de récupération' : 'Code d\'authentification' }}
                                        </h3>
                                        <div class="text-xs text-amber-700 dark:text-amber-300">
                                            <p v-if="!recoveryCodeMode">
                                                Ouvrez votre application d'authentification et entrez le code à 6 chiffres affiché.
                                            </p>
                                            <p v-else>
                                                Utilisez un des codes de récupération que vous avez sauvegardés lors de la configuration.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div class="rounded-xl p-1 border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300" :class="{ 'opacity-50': isSubmitting }">
                                    <button
                                        type="submit"
                                        :disabled="isSubmitting || !code.trim()"
                                        class="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium text-base hover:from-amber-600 hover:to-orange-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <div v-if="isSubmitting" class="flex items-center gap-2">
                                            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Vérification...
                                        </div>
                                        <div v-else class="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                                                <polyline points="10,17 15,12 10,7"/>
                                                <line x1="15" x2="3" y1="12" y2="12"/>
                                            </svg>
                                            Se connecter
                                        </div>
                                    </button>
                                </div>

                                <div class="text-center">
                                    <button
                                        type="button"
                                        @click="toggleRecoveryMode"
                                        class="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-300"
                                    >
                                        {{ recoveryCodeMode ? 'Utiliser un code d\'authentification' : 'Utiliser un code de récupération' }}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <div class="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 mb-6">
                        <h3 class="text-sm font-semibold text-black dark:text-white mb-2">Problème d'accès ?</h3>
                        <p class="text-xs text-black/60 dark:text-white/60 leading-relaxed">
                            Si vous n'avez plus accès à votre appareil d'authentification, utilisez un code de récupération.
                            En cas de perte complète d'accès, contactez le support.
                        </p>
                    </div>

                    <div class="flex items-center justify-center gap-6 text-sm">
                        <Link
                            :href="route('login')"
                            class="text-black/60 dark:text-white/60 hover:text-amber-500 dark:hover:text-amber-400 transition-colors duration-300 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14"/>
                                <path d="m5 12 6-6"/>
                                <path d="m5 12 6 6"/>
                            </svg>
                            Retour à la connexion
                        </Link>
                        <span class="text-black/20 dark:text-white/20">•</span>
                        <a
                            href="#"
                            class="text-black/60 dark:text-white/60 hover:text-amber-500 dark:hover:text-amber-400 transition-colors duration-300"
                        >
                            Aide
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, Link, router, usePage } from '@inertiajs/vue3';

const page = usePage();

const code = ref('');
const recoveryCodeMode = ref(false);
const isSubmitting = ref(false);

const errors = computed(() => {
    return page.props?.value?.errors || page.props?.errors || {};
});

const hasError = computed(() => {
    return !!(errors.value?.code || errors.value?.recovery_code);
});

const errorMessage = computed(() => {
    return errors.value?.code || errors.value?.recovery_code || '';
});

const submitChallenge = async () => {
    if (isSubmitting.value || !code.value.trim()) return;

    isSubmitting.value = true;

    try {
        const fieldName = recoveryCodeMode.value ? 'recovery_code' : 'code';

        await router.post('/two-factor-challenge', {
            [fieldName]: code.value.trim(),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                code.value = '';
            },
            onError: (errors) => {
                console.log('2FA Challenge errors:', errors);
            },
            onFinish: () => {
                isSubmitting.value = false;
            }
        });
    } catch (error) {
        console.error('2FA Challenge submission error:', error);
        isSubmitting.value = false;
    }
};

const toggleRecoveryMode = () => {
    recoveryCodeMode.value = !recoveryCodeMode.value;
    code.value = '';
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

form {
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

.info-box {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(251, 146, 60, 0.05));
    border: 1px solid rgba(245, 158, 11, 0.2);
}

.dark .info-box {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 146, 60, 0.1));
    border: 1px solid rgba(245, 158, 11, 0.3);
}

input[inputmode="numeric"] {
    letter-spacing: 0.2em;
}

input[inputmode="text"].recovery-mode {
    letter-spacing: normal;
}

input:focus {
    animation: gentlePulse 0.3s ease-in-out;
}

@keyframes gentlePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1.01); }
}

.challenge-mode-normal {
    font-variant-numeric: tabular-nums;
}

.challenge-mode-recovery {
    font-variant-numeric: normal;
}

.main-container {
    animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
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
</style>
