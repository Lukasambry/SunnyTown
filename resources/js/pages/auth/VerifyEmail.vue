<template>
    <Head title="Vérification d'email" />
    <header class="fixed top-0 right-0 left-0 z-50 backdrop-blur-md">
        <Navbar />
    </header>
    <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a]">
        <div class="absolute inset-0 before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-repeat before:bg-[length:80px] before:opacity-[0.03] before:mix-blend-overlay before:content-['']"></div>

        <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
            <div class="w-full max-w-md">
                <div class="relative rounded-2xl overflow-hidden backdrop-blur-md border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-2xl">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>

                    <div class="relative border-b border-black/5 dark:border-white/5">
                        <div class="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-400/5 to-teal-600/10"></div>
                        <div class="relative px-8 py-12 text-center">
                            <h1 class="text-3xl font-semibold tracking-tighter text-black dark:text-white mb-2">
                                Vérifiez votre email
                            </h1>
                            <p class="text-sm text-black/60 dark:text-white/60">
                                Nous avons envoyé un lien de vérification à votre adresse email. Veuillez cliquer sur le lien pour activer votre compte.
                            </p>
                        </div>
                    </div>

                    <div v-if="status === 'verification-link-sent'" class="mx-8 mt-6">
                        <div class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-800 dark:text-green-400 success-animation">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                                <path d="m9 12 2 2 4-4"/>
                            </svg>
                            <div>
                                <div class="font-medium text-sm">Email envoyé avec succès !</div>
                                <div class="text-xs mt-1 opacity-80">Un nouveau lien de vérification a été envoyé à votre adresse email</div>
                            </div>
                        </div>
                    </div>

                    <div class="relative p-8">
                        <div class="space-y-6">
                            <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                <div class="flex items-start gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 16v-4"/>
                                        <path d="M12 8h.01"/>
                                    </svg>
                                    <div>
                                        <h3 class="text-sm font-semibold text-green-800 dark:text-green-400 mb-1">Que faire maintenant ?</h3>
                                        <ul class="text-xs text-green-700 dark:text-green-300 space-y-1">
                                            <li>• Vérifiez votre boîte de réception email</li>
                                            <li>• Consultez également votre dossier spam/courriers indésirables</li>
                                            <li>• Cliquez sur le lien de vérification dans l'email</li>
                                            <li>• Si vous ne recevez rien, utilisez le bouton ci-dessous</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div class="rounded-xl p-1 border border-green-400/30 hover:border-green-400/50 transition-all duration-300" :class="{ 'opacity-50': form.processing }">
                                    <button
                                        @click="submit"
                                        :disabled="form.processing"
                                        class="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-medium text-base hover:from-green-600 hover:to-teal-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <div v-if="form.processing" class="flex items-center gap-2">
                                            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Envoi en cours...
                                        </div>
                                        <div v-else class="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                                <polyline points="22,6 12,13 2,6"/>
                                            </svg>
                                            Renvoyer l'email de vérification
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 duration-300">
                                                <path d="M5 12h14"/>
                                                <path d="m12 5 7 7-7 7"/>
                                            </svg>
                                        </div>
                                    </button>
                                </div>

                                <div class="text-center">
                                    <p class="text-sm text-black/60 dark:text-white/60">
                                        Vous voulez utiliser une autre adresse email ?
                                        <Link
                                            :href="route('logout')"
                                            method="post"
                                            as="button"
                                            class="font-medium text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-300 ml-1"
                                        >
                                            Déconnexion
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <div class="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 mb-6">
                        <h3 class="text-sm font-semibold text-black dark:text-white mb-2">Problème avec l'email ?</h3>
                        <p class="text-xs text-black/60 dark:text-white/60 leading-relaxed">
                            Si vous ne recevez pas l'email dans les 5 minutes, vérifiez votre dossier spam et les filtres de votre messagerie.
                            Certains fournisseurs d'email peuvent retarder la livraison.
                        </p>
                    </div>

                    <div class="flex items-center justify-center gap-6 text-sm">
                        <Link
                            :href="route('home')"
                            class="text-black/60 dark:text-white/60 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
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
                            class="text-black/60 dark:text-white/60 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-300"
                        >
                            Contacter le support
                        </a>
                    </div>

                    <div class="mt-6 p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
                        <div class="flex items-center justify-center gap-2 text-xs text-black/60 dark:text-white/60">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                                <circle cx="12" cy="16" r="1"/>
                                <path d="m7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <span>Votre email est protégé et ne sera jamais partagé</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import Navbar from '@/components/home/Navbar.vue';

defineProps<{
    status?: string;
}>();

const form = useForm({});

const submit = () => {
    if (form.processing) return;

    form.post(route('verification.send'));
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

button:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.dark button:hover {
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

.email-info {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(20, 184, 166, 0.05));
    border: 1px solid rgba(34, 197, 94, 0.2);
}

.dark .email-info {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.1));
    border: 1px solid rgba(34, 197, 94, 0.3);
}

.bg-gradient-green {
    background: linear-gradient(135deg, #10b981, #14b8a6);
}

.hover\:bg-gradient-green-dark:hover {
    background: linear-gradient(135deg, #059669, #0f766e);
}

.email-icon {
    filter: drop-shadow(0 2px 4px rgba(34, 197, 94, 0.2));
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}

.email-waiting {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.info-box {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.05));
    backdrop-filter: blur(8px);
}

.dark .info-box {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05));
}

@keyframes gentleFloat {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-2px);
    }
}

.floating-element {
    animation: gentleFloat 3s ease-in-out infinite;
}

.privacy-note {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06));
}

.dark .privacy-note {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06));
}

.main-container {
    animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.email-icon-container {
    animation: subtlePulse 4s ease-in-out infinite;
}

@keyframes subtlePulse {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 8px 25px rgba(34, 197, 94, 0.2);
    }
    50% {
        transform: scale(1.05);
        box-shadow: 0 12px 35px rgba(34, 197, 94, 0.3);
    }
}
</style>
