<template>
    <Head title="Créer un compte" />
   
<SiteLayout :auth="$page.props.auth">

    <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a]">
        <div class="absolute inset-0 before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-repeat before:bg-[length:80px] before:opacity-[0.03] before:mix-blend-overlay before:content-['']"></div>

        <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 mt-20">
            <div class="w-full max-w-lg">
                <div class="relative rounded-2xl overflow-hidden backdrop-blur-md border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-2xl">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>

                    <div class="relative border-b border-black/5 dark:border-white/5">
                        <div class="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-orange-600/10"></div>
                        <div class="relative px-8 py-12 text-center">
                            <h1 class="text-3xl font-semibold tracking-tighter text-black dark:text-white mb-2">
                                Rejoignez-nous
                            </h1>
                            <p class="text-sm text-black/60 dark:text-white/60">
                                Créez votre compte et découvrez l'avenir de l'IA
                            </p>
                        </div>
                    </div>

                    <div class="relative p-8">
                        <form @submit.prevent="submit" class="space-y-6">
                            <div class="space-y-2">
                                <label for="name" class="block text-sm font-semibold text-black dark:text-white">
                                    Nom complet
                                    <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input
                                        id="name"
                                        v-model="form.name"
                                        type="text"
                                        required
                                        autofocus
                                        autocomplete="name"
                                        placeholder="Votre nom complet"
                                        class="w-full px-4 py-3 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                                        :class="{ 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.name }"
                                        @focus="trackFieldFocus('name')"
                                        @blur="trackFieldBlur('name')"
                                        @input="trackNameValidation"
                                    />

                                    <div class="absolute right-3 top-1/2 -translate-y-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/40 dark:text-white/40">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                    </div>
                                </div>

                                <div v-if="form.errors.name" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" x2="12" y1="8" y2="12"/>
                                        <line x1="12" x2="12.01" y1="16" y2="16"/>
                                    </svg>
                                    {{ form.errors.name }}
                                </div>
                            </div>

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
                                        autocomplete="email"
                                        placeholder="votre@email.com"
                                        class="w-full px-4 py-3 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                                        :class="{ 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.email }"
                                        @focus="trackFieldFocus('email')"
                                        @blur="trackFieldBlur('email')"
                                        @input="trackEmailValidation"
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
                                    Mot de passe
                                    <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input
                                        id="password"
                                        v-model="form.password"
                                        :type="showPassword ? 'text' : 'password'"
                                        required
                                        autocomplete="new-password"
                                        placeholder="Créez un mot de passe sécurisé"
                                        class="w-full px-4 py-3 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                                        :class="{ 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.password }"
                                        @focus="trackFieldFocus('password')"
                                        @blur="trackFieldBlur('password')"
                                    />

                                    <button
                                        type="button"
                                        @click="togglePasswordVisibility"
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
                                    Confirmer le mot de passe
                                    <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input
                                        id="password_confirmation"
                                        v-model="form.password_confirmation"
                                        :type="showPasswordConfirm ? 'text' : 'password'"
                                        required
                                        autocomplete="new-password"
                                        placeholder="Confirmez votre mot de passe"
                                        class="w-full px-4 py-3 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                                        :class="{
                                            'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.password_confirmation,
                                            'border-green-500/50 focus:ring-green-500/50 focus:border-green-500/50': passwordsMatch && form.password_confirmation.length > 0
                                        }"
                                        @focus="trackFieldFocus('password_confirmation')"
                                        @blur="trackFieldBlur('password_confirmation')"
                                    />

                                    <button
                                        type="button"
                                        @click="togglePasswordConfirmVisibility"
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

                            <div class="flex items-start gap-3 p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
                                <input
                                    id="terms"
                                    v-model="acceptTerms"
                                    type="checkbox"
                                    class="w-4 h-4 mt-0.5 rounded border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-orange-500 focus:ring-orange-500/50 focus:ring-2"
                                    @change="trackTermsAcceptance"
                                />
                                <label for="terms" class="text-sm text-black/70 dark:text-white/70 cursor-pointer leading-relaxed">
                                    J'accepte les
                                    <a href="#" class="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium transition-colors duration-300" @click="trackTermsClick">
                                        conditions d'utilisation
                                    </a> et la
                                    <a href="#" class="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium transition-colors duration-300" @click="trackPrivacyClick">
                                        politique de confidentialité
                                    </a>
                                </label>
                            </div>

                            <div class="space-y-4">
                                <div class="rounded-xl p-1 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300" :class="{ 'opacity-50': !canSubmit || form.processing }">
                                    <button
                                        type="submit"
                                        :disabled="!canSubmit || form.processing"
                                        class="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium text-base hover:from-orange-600 hover:to-orange-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        @click="trackSubmitAttempt"
                                    >
                                        <div v-if="form.processing" class="flex items-center gap-2">
                                            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Création du compte...
                                        </div>
                                        <div v-else class="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                                <circle cx="9" cy="7" r="4"/>
                                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                            </svg>
                                            Créer mon compte
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 duration-300">
                                                <path d="M5 12h14"/>
                                                <path d="m12 5 7 7-7 7"/>
                                            </svg>
                                        </div>
                                    </button>
                                </div>

                                <div class="text-center">
                                    <p class="text-sm text-black/60 dark:text-white/60">
                                        Vous avez déjà un compte ?
                                        <Link
                                            :href="route('login')"
                                            class="font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300 ml-1"
                                            @click="trackLoginLinkClick"
                                        >
                                            Se connecter
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
                            class="text-black/60 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"
                            @click="trackBackToHomeClick"
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
                            class="text-black/60 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300"
                            @click="trackHelpClick"
                        >
                            Aide
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </SiteLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import SiteLayout from '@/layouts/SiteLayout.vue';
import { useMatomo } from '@/composables/useMatomo';

const matomo = useMatomo();

const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const acceptTerms = ref(false);

let formStartTime: number;
let fieldFocusTimes: Record<string, number> = {};
let pageStartTime: number;
let registrationAttempts = 0;
let passwordStrengthHistory: number[] = [];

const form = useForm({
    name: '',
    email: '',
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
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
});

const passwordStrengthTextClass = computed(() => {
    const strength = passwordStrength.value;
    if (strength <= 2) return 'text-red-600 dark:text-red-400';
    if (strength <= 3) return 'text-yellow-600 dark:text-yellow-400';
    if (strength <= 4) return 'text-blue-600 dark:text-blue-400';
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
    return form.name.trim().length > 0 &&
        form.email.trim().length > 0 &&
        form.password.length >= 8 &&
        passwordsMatch.value &&
        acceptTerms.value;
});


const trackFieldFocus = (field: string) => {
    matomo.trackEvent('Form', 'Field_Focus', `register_${field}`);
    fieldFocusTimes[field] = Date.now();
};

const trackFieldBlur = (field: string) => {
    if (fieldFocusTimes[field]) {
        const focusTime = Math.floor((Date.now() - fieldFocusTimes[field]) / 1000);
        matomo.trackEvent('Form', 'Field_Time', `register_${field}`, focusTime);
        
        if (focusTime > 5) {
            matomo.trackEvent('Form', 'Field_Engaged', `register_${field}`);
        }
    }
};

const trackNameValidation = () => {
    if (form.name.trim().length >= 2) {
        matomo.trackEvent('Form', 'Valid_Name_Length', 'register');
    }
};

const trackEmailValidation = () => {
    if (form.email && form.email.includes('@') && form.email.includes('.')) {
        matomo.trackEvent('Form', 'Valid_Email_Format', 'register');
    }
};

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
    matomo.trackEvent('Form', 'Password_Visibility_Toggle', showPassword.value ? 'show' : 'hide');
};

const togglePasswordConfirmVisibility = () => {
    showPasswordConfirm.value = !showPasswordConfirm.value;
    matomo.trackEvent('Form', 'Password_Confirm_Visibility_Toggle', showPasswordConfirm.value ? 'show' : 'hide');
};

const trackTermsAcceptance = () => {
    matomo.trackEvent('Form', 'Terms_Acceptance', acceptTerms.value ? 'accepted' : 'declined');
    
    if (acceptTerms.value) {
        matomo.trackEvent('Legal', 'Terms_Accepted', 'register_flow');
    }
};

const trackTermsClick = () => {
    matomo.trackEvent('Legal', 'Terms_Link_Click', 'register_page');
    matomo.trackNavigation('terms_from_register');
};

const trackPrivacyClick = () => {
    matomo.trackEvent('Legal', 'Privacy_Link_Click', 'register_page');
    matomo.trackNavigation('privacy_from_register');
};

const trackSubmitAttempt = () => {
    registrationAttempts++;
    matomo.trackEvent('Form', 'Submit_Attempt', 'register', registrationAttempts);
    
    const completionTime = Math.floor((Date.now() - formStartTime) / 1000);
    matomo.trackEvent('Form', 'Completion_Time', 'register', completionTime);
    
    matomo.trackEvent('Form', 'Password_Strength_Final', 'register', passwordStrength.value);
};

const trackLoginLinkClick = () => {
    matomo.trackEvent('Navigation', 'Login_Link_Click', 'from_register');
    matomo.trackNavigation('login_from_register');
};

const trackBackToHomeClick = () => {
    matomo.trackEvent('Navigation', 'Back_To_Home', 'from_register');
    matomo.trackNavigation('home_from_register');
};

const trackHelpClick = () => {
    matomo.trackEvent('Navigation', 'Help_Click', 'from_register');
    matomo.trackNavigation('help_from_register');
};

const submit = () => {
    if (!canSubmit.value || form.processing) return;

    matomo.trackEvent('Form', 'Submit_Processing', 'register');

    form.post(route('register'), {
        onFinish: () => {
            form.reset('password', 'password_confirmation');
        },
        onSuccess: () => {
            matomo.trackFormSubmission('register', true);
            
            const sessionTime = Math.floor((Date.now() - pageStartTime) / 1000);
            matomo.trackEvent('Auth', 'Register_Success_Time', 'register', sessionTime);
            matomo.trackEvent('Auth', 'Register_Attempts', 'success', registrationAttempts);
            
            matomo.trackEvent('User', 'Registration_Source', 'direct_signup');
            matomo.trackEvent('User', 'Password_Strength_Success', 'register', passwordStrength.value);
            
            
            const avgPasswordStrength = passwordStrengthHistory.length > 0 ? 
                Math.round(passwordStrengthHistory.reduce((a, b) => a + b, 0) / passwordStrengthHistory.length) : 0;
            matomo.trackEvent('User', 'Avg_Password_Strength', 'register', avgPasswordStrength);
        },
        onError: (errors) => {
            const errorTypes = Object.keys(errors);
            const primaryError = errorTypes[0] || 'unknown';
            
            matomo.trackFormSubmission('register', false, primaryError);
            matomo.trackEvent('Auth', 'Register_Attempts', 'failed', registrationAttempts);
            
            errorTypes.forEach(errorType => {
                matomo.trackEvent('Form', 'Error_Field', `register_${errorType}`);
                matomo.trackEvent('Form', 'Error_Message', errors[errorType]);
            });
            
            const formCompleteness = calculateFormCompleteness();
            matomo.trackEvent('Form', 'Error_Form_Completeness', 'register', formCompleteness);
        }
    });
};

const calculateFormCompleteness = () => {
    const fields = [form.name, form.email, form.password, form.password_confirmation];
    const completedFields = fields.filter(field => field && field.length > 0).length;
    return Math.round((completedFields / 4) * 100);
};

onMounted(() => {
    pageStartTime = Date.now();
    formStartTime = Date.now();
    
    matomo.trackAuthPage('register');
    
    matomo.setCustomVariable(1, 'Page Type', 'Auth', 'page');
    matomo.setCustomVariable(2, 'Auth Flow', 'Register', 'page');
    matomo.setCustomVariable(3, 'User Type', 'New', 'page');
    
    const trackEngagement = () => {
        const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
        if (timeOnPage > 0 && timeOnPage % 30 === 0) {
            matomo.trackEngagement('time_on_page', timeOnPage);
        }
    };
    
    const engagementInterval = setInterval(trackEngagement, 30000);
    
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (docHeight > 0) {
            const scrollDepth = Math.round((scrollTop / docHeight) * 100);
            if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) {
                maxScrollDepth = scrollDepth;
                matomo.trackEvent('Page', 'Scroll_Depth', 'register_page', scrollDepth);
            }
        }
    };
    
    window.addEventListener('scroll', trackScrollDepth);
    
    const trackFormAbandonment = () => {
        if (registrationAttempts === 0) {
            const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);
            const formCompleteness = calculateFormCompleteness();
            
            if (formCompleteness > 0) {
                matomo.trackEvent('Form', 'Abandonment', `register_${formCompleteness}%`, timeSpent);
            } else {
                matomo.trackEvent('Page', 'Exit_Without_Interaction', 'register');
            }
        }
    };
    
    onUnmounted(() => {
        clearInterval(engagementInterval);
        window.removeEventListener('scroll', trackScrollDepth);
        
        trackFormAbandonment();
        
        const totalTime = Math.floor((Date.now() - pageStartTime) / 1000);
        matomo.trackEvent('Page', 'Exit_Time', 'register', totalTime);
    });
});


watch(() => form.name, (newName) => {
    if (newName && newName.trim().length >= 2) {
        matomo.trackEvent('Form', 'Name_Valid_Length', 'register');
    }
});

watch(() => form.email, (newEmail) => {
    if (newEmail && newEmail.includes('@') && newEmail.includes('.')) {
        matomo.trackEvent('Form', 'Email_Valid_Format', 'register');
    }
});

watch(() => form.password, (newPassword) => {
    if (newPassword.length > 0) {
        passwordStrengthHistory.push(passwordStrength.value);
        
        if (passwordStrengthHistory.length > 1) {
            const prevStrength = passwordStrengthHistory[passwordStrengthHistory.length - 2];
            if (passwordStrength.value > prevStrength) {
                matomo.trackEvent('Form', 'Password_Strength_Improved', 'register', passwordStrength.value);
            }
        }
        
        if (newPassword.length >= 8) {
            matomo.trackEvent('Form', 'Password_Length_Valid', 'register');
        }
        if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) {
            matomo.trackEvent('Form', 'Password_Case_Mix', 'register');
        }
        if (/[0-9]/.test(newPassword)) {
            matomo.trackEvent('Form', 'Password_Numbers', 'register');
        }
        if (/[^A-Za-z0-9]/.test(newPassword)) {
            matomo.trackEvent('Form', 'Password_Special_Chars', 'register');
        }
    }
});

watch(() => passwordsMatch, (matches) => {
    if (matches && form.password_confirmation.length > 0) {
        matomo.trackEvent('Form', 'Passwords_Match', 'register');
    }
});

watch(() => acceptTerms.value, (accepted) => {
    if (accepted) {
        matomo.trackEvent('Form', 'Terms_Accepted_Watch', 'register');
    }
});

watch([() => form.name, () => form.email, () => form.password, () => form.password_confirmation], () => {
    const completeness = calculateFormCompleteness();
    
    if (completeness === 25) {
        matomo.trackEvent('Form', 'Quarter_Complete', 'register');
    } else if (completeness === 50) {
        matomo.trackEvent('Form', 'Half_Complete', 'register');
    } else if (completeness === 75) {
        matomo.trackEvent('Form', 'Three_Quarter_Complete', 'register');
    } else if (completeness === 100) {
        matomo.trackEvent('Form', 'Complete', 'register');
    }
});

watch(() => canSubmit.value, (canNowSubmit) => {
    if (canNowSubmit) {
        const timeToSubmittable = Math.floor((Date.now() - formStartTime) / 1000);
        matomo.trackEvent('Form', 'Ready_To_Submit', 'register', timeToSubmittable);
    }
});
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

input[type="checkbox"]:checked {
    background-color: #f97316;
    border-color: #f97316;
}

input[type="checkbox"]:focus {
    ring-color: rgba(249, 115, 22, 0.5);
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

.h-2 > div {
    transition: width 0.3s ease-in-out, background-color 0.3s ease-in-out;
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

input:focus-within {
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
</style>