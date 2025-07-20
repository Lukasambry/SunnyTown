<template>
    <Head title="Mot de passe oublié" />

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
                                Mot de passe oublié ?
                            </h1>
                            <p class="text-sm text-black/60 dark:text-white/60">
                                Pas de problème ! Entrez votre email et nous vous enverrons un lien de réinitialisation
                            </p>
                        </div>
                    </div>

                    <div v-if="status" class="mx-8 mt-6">
                        <div class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-800 dark:text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                                <path d="m9 12 2 2 4-4"/>
                            </svg>
                            <div>
                                <div class="font-medium text-sm">{{ status }}</div>
                                <div class="text-xs mt-1 opacity-80">Vérifiez également votre dossier spam</div>
                            </div>
                        </div>
                    </div>

                    <div class="relative p-8">
                        <form @submit.prevent="submit" class="space-y-6">
                            <div class="space-y-2">
                                <label for="email" class="block text-sm font-semibold text-black dark:text-white">
                                    Adresse email
                                    <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input
                                        id="email"
                                        v-model="form.email"
                                        type="email"
                                        required
                                        autofocus
                                        autocomplete="email"
                                        placeholder="votre@email.com"
                                        class="w-full px-4 py-3 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
                                        :class="{ 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.email }"
                                    />

                                    <div class="absolute right-3 top-1/2 -translate-y-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/40 dark:text-white/40">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                    </div>
                                </div>

                                <div v-if="form.errors.email" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" x2="12" y1="8" y2="12"/>
                                        <line x1="12" x2="12.01" y1="16" y2="16"/>
                                    </svg>
                                    {{ form.errors.email }}
                                </div>

                                <p class="text-xs text-black/60 dark:text-white/60">
                                    Nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe
                                </p>
                            </div>

                            <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                <div class="flex items-start gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 16v-4"/>
                                        <path d="M12 8h.01"/>
                                    </svg>
                                    <div>
                                        <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">Comment ça fonctionne</h3>
                                        <ul class="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                                            <li>• Nous envoyons un email avec un lien sécurisé</li>
                                            <li>• Le lien expire dans 60 minutes</li>
                                            <li>• Cliquez sur le lien pour créer un nouveau mot de passe</li>
                                            <li>• Votre ancien mot de passe sera automatiquement désactivé</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div class="rounded-xl p-1 border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300" :class="{ 'opacity-50': !canSubmit || form.processing }">
                                    <button
                                        type="submit"
                                        :disabled="!canSubmit || form.processing"
                                        class="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium text-base hover:from-amber-600 hover:to-orange-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <div v-if="form.processing" class="flex items-center gap-2">
                                            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Envoi en cours...
                                        </div>
                                        <div v-else class="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 duration-300">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                                <polyline points="22,6 12,13 2,6"/>
                                            </svg>
                                            Envoyer le lien de réinitialisation
                                        </div>
                                    </button>
                                </div>

                                <div class="text-center">
                                    <p class="text-sm text-black/60 dark:text-white/60">
                                        Vous vous souvenez de votre mot de passe ?
                                        <Link
                                            :href="route('login')"
                                            class="font-medium text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors duration-300 ml-1"
                                        >
                                            Retour à la connexion
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <div class="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 mb-6">
                        <h3 class="text-sm font-semibold text-black dark:text-white mb-2">Problème avec votre email ?</h3>
                        <p class="text-xs text-black/60 dark:text-white/60 leading-relaxed">
                            Si vous ne recevez pas l'email dans les 5 minutes, vérifiez votre dossier spam ou contactez notre support.
                        </p>
                    </div>

                    <div class="flex items-center justify-center gap-6 text-sm">
                        <Link
                            :href="route('home')"
                            class="text-black/60 dark:text-white/60 hover:text-amber-500 dark:hover:text-amber-400 transition-colors duration-300 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14"/>
                                <path d="m5 12 6-6"/>
                                <path d="m5 12 6 6"/>
                            </svg>
                            Retour à l'accueil
                        </Link>
                        <span class="text-black/20 dark:text-white/20">•</span>
                        <a
                            href="mailto:support@glasses.ai"
                            class="text-black/60 dark:text-white/60 hover:text-amber-500 dark:hover:text-amber-400 transition-colors duration-300"
                        >
                            Contacter le support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { computed } from 'vue';

defineProps<{
    status?: string;
}>();

const form = useForm({
    email: '',
});

const canSubmit = computed(() => {
    return form.email.trim().length > 0 &&
        form.email.includes('@') &&
        form.email.includes('.');
});

const submit = () => {
    if (!canSubmit.value || form.processing) return;

    form.post(route('password.email'));
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

.success-message {
    animation: slideInDown 0.5s ease-out;
}

.bg-gradient-amber {
    background: linear-gradient(135deg, #f59e0b, #fb923c);
}

.hover\:bg-gradient-amber-dark:hover {
    background: linear-gradient(135deg, #d97706, #ea580c);
}

input:focus-within {
    animation: gentlePulse 0.3s ease-in-out;
}

@keyframes gentlePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1.01); }
}
</style>
