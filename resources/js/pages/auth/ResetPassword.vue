<template>
    <Head title="Réinitialiser le mot de passe" />
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
                        <div class="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-400/5 to-orange-600/10"></div>
                        <div class="relative px-8 py-12 text-center">
                            <h1 class="text-3xl font-semibold tracking-tighter text-black dark:text-white mb-2">
                                Nouveau mot de passe
                            </h1>
                            <p class="text-sm text-black/60 dark:text-white/60">
                                Créez un nouveau mot de passe sécurisé pour votre compte
                            </p>
                        </div>
                    </div>

                    <div class="relative p-8">
                        <form @submit.prevent="submit" class="space-y-6">
                            <div class="space-y-2">
                                <label for="email" class="block text-sm font-semibold text-black dark:text-white">
                                    Adresse email
                                </label>
                                <div class="relative">
                                    <input
                                        id="email"
                                        v-model="form.email"
                                        type="email"
                                        readonly
                                        class="w-full px-4 py-3 text-base bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 rounded-xl text-black/60 dark:text-white/60 cursor-not-allowed"
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
                            </div>

                            <div class="space-y-2">
                                <label for="password" class="block text-sm font-semibold text-black dark:text-white">
                                    Nouveau mot de passe
                                    <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input
                                        id="password"
                                        v-model="form.password"
                                        :type="showPassword ? 'text' : 'password'"
                                        required
                                        autofocus
                                        autocomplete="new-password"
                                        placeholder="Créez un mot de passe sécurisé"
                                        class="w-full px-4 py-3 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
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

                                <div class="mt-2">
                                    <div class="flex items-center gap-2">
                                        <div class="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                class="h-full transition-all duration-300 rounded-full"
                                                :class="passwordStrengthClass"
                                                :style="{ width: passwordStrengthWidth }"
                                            ></div>
                                        </div>
                                        <span class="text-xs font-medium" :class="passwordStrengthTextClass">
                                            {{ passwordStrengthText }}
                                        </span>
                                    </div>
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

                            <div class="space-y-2">
                                <label for="password_confirmation" class="block text-sm font-semibold text-black dark:text-white">
                                    Confirmer le nouveau mot de passe
                                    <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input
                                        id="password_confirmation"
                                        v-model="form.password_confirmation"
                                        :type="showPasswordConfirm ? 'text' : 'password'"
                                        required
                                        autocomplete="new-password"
                                        placeholder="Confirmez votre nouveau mot de passe"
                                        class="w-full px-4 py-3 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
                                        :class="{
                                            'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.password_confirmation,
                                            'border-green-500/50 focus:ring-green-500/50 focus:border-green-500/50': passwordsMatch && form.password_confirmation.length > 0
                                        }"
                                    />

                                    <button
                                        type="button"
                                        @click="showPasswordConfirm = !showPasswordConfirm"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 transition-colors duration-300"
                                    >
                                        <svg v-if="showPasswordConfirm" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

                                <div v-if="form.password_confirmation.length > 0" class="flex items-center gap-2 text-sm">
                                    <svg v-if="passwordsMatch" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500">
                                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                                        <path d="m9 12 2 2 4-4"/>
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="15" x2="9" y1="9" y2="15"/>
                                        <line x1="9" x2="15" y1="9" y2="15"/>
                                    </svg>
                                    <span :class="passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                                        {{ passwordsMatch ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas' }}
                                    </span>
                                </div>

                                <div v-if="form.errors.password_confirmation" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" x2="12" y1="8" y2="12"/>
                                        <line x1="12" x2="12.01" y1="16" y2="16"/>
                                    </svg>
                                    {{ form.errors.password_confirmation }}
                                </div>
                            </div>

                            <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                <div class="flex items-start gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                                        <path d="m9 12 2 2 4-4"/>
                                        <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"/>
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7"/>
                                    </svg>
                                    <div>
                                        <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">Conseils de sécurité</h3>
                                        <ul class="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                                            <li>• Utilisez au moins 8 caractères</li>
                                            <li>• Mélangez majuscules, minuscules et chiffres</li>
                                            <li>• Ajoutez des caractères spéciaux</li>
                                            <li>• Évitez les informations personnelles</li>
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
                                            Réinitialisation en cours...
                                        </div>
                                        <div v-else class="flex items-center gap-2">
                                            Réinitialiser le mot de passe
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 duration-300">
                                                <path d="M5 12h14"/>
                                                <path d="m12 5 7 7-7 7"/>
                                            </svg>
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
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import Navbar from '@/components/home/Navbar.vue';

// Props
interface Props {
    token: string;
    email: string;
}

const props = defineProps<Props>();

const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const form = useForm({
    token: props.token,
    email: props.email,
    password: '',
    password_confirmation: '',
});

const passwordsMatch = computed(() => {
    return form.password === form.password_confirmation && form.password_confirmation.length > 0;
});

const passwordStrength = computed(() => {
    const password = form.password;
    if (password.length === 0) return 0;

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return Math.min(score, 5);
});

const passwordStrengthWidth = computed(() => {
    return `${(passwordStrength.value / 5) * 100}%`;
});

const passwordStrengthClass = computed(() => {
    const strength = passwordStrength.value;
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-amber-500';
    return 'bg-green-500';
});

const passwordStrengthTextClass = computed(() => {
    const strength = passwordStrength.value;
    if (strength <= 2) return 'text-red-600 dark:text-red-400';
    if (strength <= 3) return 'text-yellow-600 dark:text-yellow-400';
    if (strength <= 4) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
});

const passwordStrengthText = computed(() => {
    const strength = passwordStrength.value;
    if (form.password.length === 0) return '';
    if (strength <= 2) return 'Faible';
    if (strength <= 3) return 'Moyen';
    if (strength <= 4) return 'Fort';
    return 'Très fort';
});

const canSubmit = computed(() => {
    return form.password.length >= 8 &&
        passwordsMatch.value;
});

const submit = () => {
    if (!canSubmit.value || form.processing) return;

    form.post(route('password.store'), {
        onFinish: () => {
            form.reset('password', 'password_confirmation');
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

.group:hover .group-hover\:translate-x-1 {
    transform: translateX(4px);
}

.group:hover .group-hover\:rotate-90 {
    transform: rotate(90deg);
}

* {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

input:hover:not([readonly]) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.dark input:hover:not([readonly]) {
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
}

input[readonly] {
    cursor: not-allowed;
    opacity: 0.7;
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

.h-2 > div {
    transition: width 0.3s ease-in-out, background-color 0.3s ease-in-out;
}

.border-green-500\/50 {
    border-color: rgba(34, 197, 94, 0.5);
    box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.1);
}

.focus\:ring-green-500\/50:focus {
    --tw-ring-color: rgba(34, 197, 94, 0.5);
}

.focus\:border-green-500\/50:focus {
    border-color: rgba(34, 197, 94, 0.5);
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

.security-tips {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(251, 146, 60, 0.05));
    border: 1px solid rgba(245, 158, 11, 0.2);
}

.dark .security-tips {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 146, 60, 0.1));
    border: 1px solid rgba(245, 158, 11, 0.3);
}

input:focus-within:not([readonly]) {
    animation: gentlePulse 0.3s ease-in-out;
}

@keyframes gentlePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1.01); }
}

.password-strength {
    border-radius: 9999px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.password-strength-bar {
    height: 100%;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease;
    border-radius: 9999px;
}

.bg-gradient-amber {
    background: linear-gradient(135deg, #f59e0b, #fb923c);
}

.hover\:bg-gradient-amber-dark:hover {
    background: linear-gradient(135deg, #d97706, #ea580c);
}

input[readonly] {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.1));
    color: rgba(0, 0, 0, 0.6);
}

.dark input[readonly] {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1));
    color: rgba(255, 255, 255, 0.6);
}

.icon-lock {
    filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.2));
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

.success-animation {
    animation: slideInDown 0.5s ease-out;
}

.info-box {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(251, 146, 60, 0.05));
    border: 1px solid rgba(245, 158, 11, 0.2);
}

.dark .info-box {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 146, 60, 0.1));
    border: 1px solid rgba(245, 158, 11, 0.3);
}

/* Animation d'entrée pour le conteneur principal */
.main-container {
    animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Effet de pulsation subtile pour l'icône de sécurité */
.lock-icon-container {
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

/* Transitions fluides pour les états de validation */
.validation-success {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.1));
    border-color: rgba(34, 197, 94, 0.3);
    transition: all 0.3s ease;
}

.validation-error {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
    border-color: rgba(239, 68, 68, 0.3);
    transition: all 0.3s ease;
}

/* Animation pour la barre de force du mot de passe */
.strength-bar {
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

/* Effet de brillance sur le bouton principal */
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
</style>
