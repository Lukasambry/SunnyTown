<template>
    <Head title="Connexion" />


<SiteLayout :auth="$page.props.auth">

    <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a]">
        <div class="absolute inset-0 before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-repeat before:bg-[length:80px] before:opacity-[0.03] before:mix-blend-overlay before:content-['']"></div>

        <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
            <div class="w-full max-w-md">
                <div class="relative rounded-2xl overflow-hidden backdrop-blur-md border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-2xl">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>

                    <div class="relative border-b border-black/5 dark:border-white/5">
                        <div class="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-orange-600/10"></div>
                        <div class="relative px-8 py-12 text-center">
                            <h1 class="text-3xl font-semibold tracking-tighter text-black dark:text-white mb-2">
                                Bienvenue
                            </h1>
                            <p class="text-sm text-black/60 dark:text-white/60">
                                Connectez-vous à votre compte pour continuer
                            </p>
                        </div>
                    </div>

                    <div v-if="status" class="mx-8 mt-6">
                        <div class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-800 dark:text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                                <path d="m9 12 2 2 4-4"/>
                            </svg>
                            <span class="text-sm font-medium">{{ status }}</span>
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
                                        required
                                        autofocus
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
                                <div class="flex items-center justify-between">
                                    <label for="password" class="block text-sm font-semibold text-black dark:text-white">
                                        Mot de passe
                                    </label>
                                    <Link
                                        v-if="canResetPassword"
                                        :href="route('password.request')"
                                        class="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300 font-medium"
                                        @click="trackForgotPasswordClick"
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                                <div class="relative">
                                    <input
                                        id="password"
                                        v-model="form.password"
                                        :type="showPassword ? 'text' : 'password'"
                                        required
                                        autocomplete="current-password"
                                        placeholder="Votre mot de passe"
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

                                <div v-if="form.errors.password" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" x2="12" y1="8" y2="12"/>
                                        <line x1="12" x2="12.01" y1="16" y2="16"/>
                                    </svg>
                                    {{ form.errors.password }}
                                </div>
                            </div>

                            <div class="flex items-center gap-3">
                                <input
                                    id="remember"
                                    v-model="form.remember"
                                    type="checkbox"
                                    class="w-4 h-4 rounded border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-orange-500 focus:ring-orange-500/50 focus:ring-2"
                                    @change="trackRememberMeToggle"
                                />
                                <label for="remember" class="text-sm text-black/70 dark:text-white/70 cursor-pointer">
                                    Se souvenir de moi
                                </label>
                            </div>

                            <div class="space-y-4">
                                <div class="rounded-xl p-1 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300" :class="{ 'opacity-50': form.processing }">
                                    <button
                                        type="submit"
                                        :disabled="form.processing"
                                        class="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium text-base hover:from-orange-600 hover:to-orange-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        @click="trackSubmitAttempt"
                                    >
                                        <div v-if="form.processing" class="flex items-center gap-2">
                                            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Connexion en cours...
                                        </div>
                                        <div v-else class="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 duration-300">
                                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                                                <polyline points="10,17 15,12 10,7"/>
                                                <line x1="15" x2="3" y1="12" y2="12"/>
                                            </svg>
                                            Se connecter
                                        </div>
                                    </button>
                                </div>
                                <div class="rounded-xl p-1 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300" :class="{ 'opacity-50': form.processing }">
                                    <button
                                        type="button"
                                        class="w-full px-6 py-3 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg font-medium text-base hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
                                        @click="loginWithGoogle"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 128 128">
                                            <path fill="#fff" d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.3 74.3 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.2 36.2 0 0 1-13.93 5.5a41.3 41.3 0 0 1-15.1 0A37.2 37.2 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.3 38.3 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.3 34.3 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.2 61.2 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38"/><path fill="#e33629" d="M44.59 4.21a64 64 0 0 1 42.61.37a61.2 61.2 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.3 34.3 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21"/><path fill="#f8bd00" d="M3.26 51.5a63 63 0 0 1 5.5-15.9l20.73 16.09a38.3 38.3 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9"/><path fill="#587dbd" d="M65.27 52.15h59.52a74.3 74.3 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68"/><path fill="#319f43" d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.2 37.2 0 0 0 14.08 6.08a41.3 41.3 0 0 0 15.1 0a36.2 36.2 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.7 63.7 0 0 1 8.75 92.4"/>
                                        </svg>
                                        Connexion avec Google
                                    </button>
                                </div>


                                <div class="text-center">
                                    <p class="text-sm text-black/60 dark:text-white/60">
                                        Pas encore de compte ?
                                        <Link
                                            :href="route('register')"
                                            class="font-medium text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300 ml-1"
                                            @click="trackRegisterLinkClick"
                                        >
                                            Créer un compte
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useMatomo } from '@/composables/useMatomo';
import SiteLayout from '@/layouts/SiteLayout.vue';

defineProps<{
    status?: string;
    canResetPassword: boolean;
}>();

const matomo = useMatomo();
const showPassword = ref(false);

let formStartTime: number;
let emailFocusTime: number;
let passwordFocusTime: number;
let pageStartTime: number;
let loginAttempts = 0;

const form = useForm({
    email: '',
    password: '',
    remember: false,
});


const trackFieldFocus = (field: string) => {
    matomo.trackEvent('Form', 'Field_Focus', `login_${field}`);

    if (field === 'email') {
        emailFocusTime = Date.now();
    } else if (field === 'password') {
        passwordFocusTime = Date.now();
    }
};

const trackFieldBlur = (field: string) => {
    let focusTime = 0;

    if (field === 'email' && emailFocusTime) {
        focusTime = Math.floor((Date.now() - emailFocusTime) / 1000);
    } else if (field === 'password' && passwordFocusTime) {
        focusTime = Math.floor((Date.now() - passwordFocusTime) / 1000);
    }

    if (focusTime > 0) {
        matomo.trackEvent('Form', 'Field_Time', `login_${field}`, focusTime);

        if (focusTime > 5) {
            matomo.trackEvent('Form', 'Field_Engaged', `login_${field}`);
        }
    }
};

const trackEmailValidation = () => {
    if (form.email && form.email.includes('@') && form.email.includes('.')) {
        matomo.trackEvent('Form', 'Valid_Email_Format', 'login');
    }
};

const trackForgotPasswordClick = () => {
    matomo.trackEvent('Auth', 'Forgot_Password_Click', 'login_page');
    matomo.trackNavigation('forgot_password_from_login');
};

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
    matomo.trackEvent('Form', 'Password_Visibility_Toggle', showPassword.value ? 'show' : 'hide');
};

const trackRememberMeToggle = () => {
    matomo.trackEvent('Form', 'Remember_Me_Toggle', form.remember ? 'enabled' : 'disabled');
};

const trackSubmitAttempt = () => {
    loginAttempts++;
    matomo.trackEvent('Form', 'Submit_Attempt', 'login', loginAttempts);

    // Track form completion metrics
    const completionTime = Math.floor((Date.now() - formStartTime) / 1000);
    matomo.trackEvent('Form', 'Completion_Time', 'login', completionTime);
};

const trackRegisterLinkClick = () => {
    matomo.trackEvent('Navigation', 'Register_Link_Click', 'from_login');
    matomo.trackNavigation('register_from_login');
};

const trackBackToHomeClick = () => {
    matomo.trackEvent('Navigation', 'Back_To_Home', 'from_login');
    matomo.trackNavigation('home_from_login');
};

const trackHelpClick = () => {
    matomo.trackEvent('Navigation', 'Help_Click', 'from_login');
    matomo.trackNavigation('help_from_login');
};

const submit = () => {
    matomo.trackEvent('Form', 'Submit_Processing', 'login');

    form.post(route('login'), {
        onFinish: () => {
            form.reset('password');
        },
        onSuccess: () => {
            // Track successful login
            matomo.trackFormSubmission('login', true);

            // Track session metrics
            const sessionTime = Math.floor((Date.now() - pageStartTime) / 1000);
            matomo.trackEvent('Auth', 'Login_Success_Time', 'login', sessionTime);
            matomo.trackEvent('Auth', 'Login_Attempts', 'success', loginAttempts);

            // Track user preferences
            if (form.remember) {
                matomo.trackEvent('Auth', 'Remember_Me_Used', 'login');
            }
        },
        onError: (errors) => {
            // Track login error
            const errorType = errors.email ? 'invalid_email' :
                             errors.password ? 'invalid_password' :
                             'validation_error';

            matomo.trackFormSubmission('login', false, errorType);
            matomo.trackEvent('Auth', 'Login_Attempts', 'failed', loginAttempts);

            // Track specific error details
            if (errors.email) {
                matomo.trackEvent('Form', 'Error_Email', errors.email);
            }
            if (errors.password) {
                matomo.trackEvent('Form', 'Error_Password', 'invalid_credentials');
            }
        }
    });
};

const loginWithGoogle = () => {
    window.location.href = '/auth/google/redirect';
};

// Lifecycle hooks
onMounted(() => {
    pageStartTime = Date.now();
    formStartTime = Date.now();

    matomo.trackAuthPage('login');

    matomo.setCustomVariable(1, 'Page Type', 'Auth', 'page');
    matomo.setCustomVariable(2, 'Auth Flow', 'Login', 'page');
    matomo.setCustomVariable(3, 'User Type', 'Returning', 'page');

    const trackEngagement = () => {
        const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
        if (timeOnPage > 0 && timeOnPage % 30 === 0) {
            matomo.trackEngagement('time_on_page', timeOnPage);
        }
    };

    const engagementInterval = setInterval(trackEngagement, 30000);

    const trackScrollDepth = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (docHeight > 0) {
            const scrollDepth = Math.round((scrollTop / docHeight) * 100);
            if (scrollDepth > 50) {
                matomo.trackEvent('Page', 'Scroll_Depth', 'login_page', scrollDepth);
                window.removeEventListener('scroll', trackScrollDepth);
            }
        }
    };

    window.addEventListener('scroll', trackScrollDepth);

    onUnmounted(() => {
        clearInterval(engagementInterval);
        window.removeEventListener('scroll', trackScrollDepth);

        const totalTime = Math.floor((Date.now() - pageStartTime) / 1000);
        matomo.trackEvent('Page', 'Exit_Time', 'login', totalTime);

        if (loginAttempts === 0) {
            matomo.trackEvent('Page', 'Exit_Without_Attempt', 'login');
        }
    });
});

watch(() => form.email, (newEmail) => {
    if (newEmail && newEmail.includes('@')) {
        matomo.trackEvent('Form', 'Email_Valid_Format', 'login');
    }
});

watch(() => form.password, (newPassword) => {
    if (newPassword && newPassword.length >= 8) {
        matomo.trackEvent('Form', 'Password_Length_Valid', 'login');
    }
});

watch([() => form.email, () => form.password], () => {
    const fieldsCompleted = [form.email, form.password].filter(field => field && field.length > 0).length;
    const completionPercentage = Math.round((fieldsCompleted / 2) * 100);

    if (completionPercentage === 50) {
        matomo.trackEvent('Form', 'Half_Complete', 'login');
    } else if (completionPercentage === 100) {
        matomo.trackEvent('Form', 'Complete', 'login');
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

input:focus {
    transform: scale(1.01);
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
</style>
