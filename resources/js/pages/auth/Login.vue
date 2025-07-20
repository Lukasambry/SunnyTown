<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { onMounted, ref } from 'vue';
import { useMatomo, MATOMO_GOALS } from '@/composables/useMatomo';

defineProps<{
    status?: string;
    canResetPassword: boolean;
}>();

const matomo = useMatomo();
const formSubmitted = ref(false);
const formErrors = ref<string[]>([]);

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const trackFormInteraction = (field: string) => {
    matomo.trackEvent('Form', 'Focus', `login_${field}`);
    matomo.trackUserAction('Form_Interaction', 'login', field);
};

const trackFormValidation = (field: string, isValid: boolean) => {
    matomo.trackEvent('Form', 'Validation', `login_${field}_${isValid ? 'valid' : 'invalid'}`);
};

const trackPasswordReset = () => {
    matomo.trackEvent('Auth', 'Password_Reset', 'click');
    matomo.trackUserAction('Password_Reset', 'login');
};

const trackRememberMe = (checked: boolean) => {
    matomo.trackEvent('Auth', 'Remember_Me', checked ? 'enabled' : 'disabled');
};

const submit = () => {
    formSubmitted.value = true;
    formErrors.value = [];
    
    matomo.trackEvent('Form', 'Submit_Attempt', 'login');
    
    const errors: string[] = [];
    
    if (!form.email) {
        errors.push('email_required');
        trackFormValidation('email', false);
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.push('email_invalid');
        trackFormValidation('email', false);
    } else {
        trackFormValidation('email', true);
    }
    
    if (!form.password) {
        errors.push('password_required');
        trackFormValidation('password', false);
    } else if (form.password.length < 6) {
        errors.push('password_too_short');
        trackFormValidation('password', false);
    } else {
        trackFormValidation('password', true);
    }
    
    if (errors.length > 0) {
        formErrors.value = errors;
        matomo.trackFormSubmission('login', false, errors.join(','));
        return;
    }
    
    form.post(route('login'), {
        onSuccess: () => {
            matomo.trackFormSubmission('login', true);
            matomo.trackGoal(MATOMO_GOALS.LOGIN_SUCCESS);
            matomo.trackEvent('Auth', 'Login_Success', 'form');
            matomo.trackUserAction('Login', 'success');
        },
        onError: (errors) => {
            const errorTypes = Object.keys(errors);
            matomo.trackFormSubmission('login', false, errorTypes.join(','));
            
            if (errors.email) {
                matomo.trackError('Login_Error', 'email', errors.email);
            }
            if (errors.password) {
                matomo.trackError('Login_Error', 'password', errors.password);
            }
            
            matomo.trackEvent('Auth', 'Login_Failed', errorTypes.join(','));
        },
        onFinish: () => {
            form.reset('password');
            formSubmitted.value = false;
        },
    });
};

onMounted(() => {
    matomo.trackAuthPage('login');
    matomo.initPageTracking('Auth', 'Guest');
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset')) {
        matomo.trackEvent('Auth', 'Arrived_From', 'password_reset');
    }
    
    matomo.trackEvent('Auth', 'Session_Start', 'login_page');
});
</script>

<template>
    <Head title="Log in" />

    <div class="flex min-h-screen items-center justify-center p-6">
        <div class="w-full max-w-md">
            <div class="pixel-border pixel-border-dirt mb-6">
                <div class="pixel-border pixel-border-dark-dirt p-8 dark:!bg-transparent dark:!shadow-none">
                    <div class="pixel-border pixel-border-stone mb-6 px-4 py-3 text-center">
                        <h1 class="font-mono text-xl font-bold text-white dark:text-black">Connexion</h1>
                        <p class="mt-2 font-mono text-sm text-white dark:text-black">Entrez vos identifiants pour vous connecter</p>
                    </div>

                    <div v-if="status" class="pixel-border pixel-border-stone mb-4 px-3 py-2 text-center">
                        <span class="font-mono text-sm text-green-800">{{ status }}</span>
                    </div>

                    <form @submit.prevent="submit" class="space-y-6">
                        <div class="space-y-2">
                            <div class="inline-block px-3 py-1">
                                <label for="email" class="font-mono text-sm font-bold text-white dark:text-black"> Adresse email </label>
                            </div>
                            <div class="pixel-border pixel-border-stone mt-2">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autofocus
                                    :tabindex="1"
                                    autocomplete="email"
                                    v-model="form.email"
                                    placeholder="email@exemple.com"
                                    class="w-full border-none bg-white p-3 font-mono text-black outline-none"
                                    :class="{ 'bg-red-50': form.errors.email || formErrors.includes('email_required') || formErrors.includes('email_invalid') }"
                                    @focus="trackFormInteraction('email')"
                                    @blur="trackFormValidation('email', !!form.email && /\S+@\S+\.\S+/.test(form.email))"
                                />
                            </div>
                            <div v-if="form.errors.email || formErrors.includes('email_required') || formErrors.includes('email_invalid')" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2">
                                <span class="font-mono text-sm text-red-800">
                                    {{ form.errors.email || (formErrors.includes('email_required') ? 'Email requis' : 'Email invalide') }}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <div class="inline-block px-3 py-1">
                                    <label for="password" class="font-mono text-sm font-bold text-white dark:text-black"> Mot de passe </label>
                                </div>

                                <a
                                    v-if="canResetPassword"
                                    :href="route('password.request')"
                                    :tabindex="5"
                                    class="px-2 py-1 transition-colors duration-200 hover:bg-stone-100"
                                    @click="trackPasswordReset"
                                >
                                    <span class="font-mono text-xs text-white underline dark:text-black">Mot de passe oublié ?</span>
                                </a>
                            </div>

                            <div class="pixel-border pixel-border-stone mt-2">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    :tabindex="2"
                                    autocomplete="current-password"
                                    v-model="form.password"
                                    placeholder="Votre mot de passe"
                                    class="w-full border-none bg-white p-3 font-mono text-black outline-none"
                                    :class="{ 'bg-red-50': form.errors.password || formErrors.includes('password_required') || formErrors.includes('password_too_short') }"
                                    @focus="trackFormInteraction('password')"
                                    @blur="trackFormValidation('password', !!form.password && form.password.length >= 6)"
                                />
                            </div>
                            <div v-if="form.errors.password || formErrors.includes('password_required') || formErrors.includes('password_too_short')" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2">
                                <span class="font-mono text-sm text-red-800">
                                    {{ form.errors.password || (formErrors.includes('password_required') ? 'Mot de passe requis' : 'Mot de passe trop court') }}
                                </span>
                            </div>
                        </div>

                        <div class="px-4 py-3">
                            <label class="flex cursor-pointer items-center space-x-3 font-mono text-sm text-white dark:text-black">
                                <div class="pixel-border pixel-border-dirt pixel-checkbox" :class="{ 'pixel-checkbox-checked': form.remember }">
                                    <input 
                                        id="remember" 
                                        type="checkbox" 
                                        v-model="form.remember" 
                                        :tabindex="3" 
                                        class="sr-only"
                                        @change="trackRememberMe(form.remember)"
                                    />
                                    <div v-if="form.remember" class="pixel-checkmark">✓</div>
                                </div>
                                <span>Se souvenir de moi</span>
                            </label>
                        </div>

                        <div class="space-y-3">
                            <button
                                type="submit"
                                :tabindex="4"
                                :disabled="form.processing || formSubmitted"
                                class="pixel-border w-full transition-colors duration-200 hover:bg-yellow-50 disabled:cursor-not-allowed disabled:opacity-70"
                                :class="{ 'animate-pulse': form.processing }"
                            >
                                <div class="pixel-border flex items-center justify-center gap-3 px-6 py-3">
                                    <div v-if="form.processing" class="animate-spin">
                                        <div class="pixel-border pixel-border-dirt h-4 w-4"></div>
                                    </div>
                                    <span class="font-mono font-bold text-white dark:text-black">
                                        {{ form.processing ? 'Connexion...' : 'Se connecter' }}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </form>

                    <div class="mt-6 px-4 py-3 text-center">
                        <span class="font-mono text-sm text-white dark:text-black"> Pas encore de compte ? </span>
                        <a :href="route('register')" :tabindex="5" class="pixel-border pixel-border-gold ml-2 inline-block px-2 py-1 duration-200" @click="matomo.trackNavigation('register_from_login')">
                            <span class="font-mono text-sm font-bold text-white dark:text-black">S'inscrire</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pixel-checkbox {
    width: 20px;
    height: 20px;
    background-color: white;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pixel-checkbox-checked {
    background-color: var(--color-gold-secondary);
}

.pixel-checkmark {
    font-family: monospace;
    font-weight: bold;
    font-size: 14px;
    color: black;
}

input:focus {
    box-shadow: inset 0 0 0 2px var(--color-gold-primary);
}

button:focus {
    box-shadow: 0 0 0 2px var(--color-gold-primary);
}

@keyframes pixel-pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}

.pixel-border:hover {
    transform: translateY(-1px);
    transition: transform 0.1s ease-in-out;
}

button:hover:not(:disabled) {
    transform: translateY(-2px);
}

a:hover .pixel-border {
    background-color: var(--color-gold-secondary);
}
</style>