<template>
        <Head title="Confirmer le mot de passe" />
        <header class="fixed top-0 right-0 left-0 z-50 backdrop-blur-md">
            <Navbar />
        </header>

        <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
            <div class="w-full max-w-md">
                <div class="relative rounded-2xl overflow-hidden backdrop-blur-md border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-2xl">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>

                    <div class="relative border-b border-black/5 dark:border-white/5">
                        <div class="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-400/5 to-pink-600/10"></div>
                        <div class="relative px-8 py-12 text-center">
                            <h1 class="text-3xl font-semibold tracking-tighter text-black dark:text-white mb-2">
                                Zone sécurisée
                            </h1>
                            <p class="text-sm text-black/60 dark:text-white/60">
                                Veuillez confirmer votre mot de passe pour accéder à cette section sécurisée
                            </p>
                        </div>
                    </div>

                    <div class="relative p-8">
                        <form @submit.prevent="submit" class="space-y-6">
                            <div class="space-y-2">
                                <label for="password" class="block text-sm font-semibold text-black dark:text-white">
                                    Mot de passe actuel
                                    <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input
                                        id="password"
                                        v-model="form.password"
                                        :type="showPassword ? 'text' : 'password'"
                                        required
                                        autofocus
                                        autocomplete="current-password"
                                        placeholder="Entrez votre mot de passe actuel"
                                        class="w-full px-4 py-3 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                                        :class="{ 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.password }"
                                    />

                                    <button
                                        type="button"
                                        @click="showPassword = !showPassword"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 transition-colors duration-300"
                                    >
                                        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
                                            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
                                            <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
                                            <path d="m2 2 20 20"/>
                                        </svg>
                                    </button>
                                </div>

                                <div v-if="form.errors.password" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" x2="12" y1="8" y2="12"/>
                                        <line x1="12" x2="12.01" y1="16" y2="16"/>
                                    </svg>
                                    {{ form.errors.password }}
                                </div>
                            </div>

                            <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                <div class="flex items-start gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5">
                                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                                        <path d="M12 9v4"/>
                                        <path d="M12 17h.01"/>
                                    </svg>
                                    <div>
                                        <h3 class="text-sm font-semibold text-red-800 dark:text-red-400 mb-1">Confirmation de sécurité requise</h3>
                                        <p class="text-xs text-red-700 dark:text-red-300">
                                            Cette action nécessite une confirmation de votre mot de passe actuel pour des raisons de sécurité.
                                            Votre mot de passe ne sera pas stocké et cette confirmation expirera automatiquement.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div class="rounded-xl p-1 border border-red-400/30 hover:border-red-400/50 transition-all duration-300" :class="{ 'opacity-50': form.processing }">
                                    <button
                                        type="submit"
                                        :disabled="form.processing"
                                        class="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-medium text-base hover:from-red-600 hover:to-pink-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <div v-if="form.processing" class="flex items-center gap-2">
                                            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Confirmation en cours...
                                        </div>
                                        <div v-else class="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                                                <path d="M9 12l2 2 4-4"/>
                                                <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"/>
                                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7"/>
                                            </svg>
                                            Confirmer le mot de passe
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 duration-300">
                                                <path d="M5 12h14"/>
                                                <path d="m12 5 7 7-7 7"/>
                                            </svg>
                                        </div>
                                    </button>
                                </div>

                                <div class="text-center">
                                    <p class="text-sm text-black/60 dark:text-white/60">
                                        Problème avec votre mot de passe ?
                                        <Link
                                            :href="route('password.request')"
                                            class="font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300 ml-1"
                                        >
                                            Réinitialiser
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <div class="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 mb-6">
                        <h3 class="text-sm font-semibold text-black dark:text-white mb-2">Pourquoi cette confirmation ?</h3>
                        <p class="text-xs text-black/60 dark:text-white/60 leading-relaxed">
                            Cette mesure de sécurité protège vos données sensibles en s'assurant que vous êtes bien le propriétaire du compte.
                        </p>
                    </div>

                    <div class="flex items-center justify-center gap-6 text-sm">
                        <Link
                            :href="route('dashboard')"
                            class="text-black/60 dark:text-white/60 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300 flex items-center gap-2"
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
                            class="text-black/60 dark:text-white/60 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
                        >
                            Aide
                        </a>
                    </div>
                </div>
            </div>
        </div>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import Navbar from '@/components/home/Navbar.vue';

const showPassword = ref(false);

const form = useForm({
    password: '',
});

const submit = () => {
    if (form.processing) return;

    form.post(route('password.confirm'), {
        onFinish: () => {
            form.reset();
        },
    });
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

input:focus {
    transform: scale(1.01);
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

.security-warning {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(236, 72, 153, 0.05));
    border: 1px solid rgba(239, 68, 68, 0.2);
}

.dark .security-warning {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(236, 72, 153, 0.1));
    border: 1px solid rgba(239, 68, 68, 0.3);
}

input:focus-within {
    animation: gentlePulse 0.3s ease-in-out;
}

@keyframes gentlePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1.01); }
}

.bg-gradient-red {
    background: linear-gradient(135deg, #ef4444, #ec4899);
}

.hover\:bg-gradient-red-dark:hover {
    background: linear-gradient(135deg, #dc2626, #db2777);
}

.icon-warning {
    filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.2));
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

.security-info {
    animation: slideInDown 0.5s ease-out;
}
</style>
