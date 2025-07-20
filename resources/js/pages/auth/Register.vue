<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { onMounted, ref } from 'vue';
import { useMatomo, MATOMO_GOALS } from '@/composables/useMatomo';

const matomo = useMatomo();
const formSubmitted = ref(false);
const formErrors = ref<string[]>([]);

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const trackFormInteraction = (field: string) => {
    matomo.trackEvent('Form', 'Focus', `register_${field}`);
    matomo.trackUserAction('Form_Interaction', 'register', field);
};

const trackFormValidation = (field: string, isValid: boolean, errorType?: string) => {
    matomo.trackEvent('Form', 'Validation', `register_${field}_${isValid ? 'valid' : 'invalid'}`);
    if (!isValid && errorType) {
        matomo.trackEvent('Form', 'Validation_Error', `register_${field}_${errorType}`);
    }
};

const trackPasswordStrength = (strength: 'weak' | 'medium' | 'strong') => {
    matomo.trackEvent('Form', 'Password_Strength', strength);
    matomo.trackUserAction('Password_Analysis', 'register', strength);
};

const validatePassword = (password: string) => {
    if (password.length < 8) return 'weak';
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'strong';
    return 'medium';
};

const submit = () => {
    formSubmitted.value = true;
    formErrors.value = [];
    
    matomo.trackEvent('Form', 'Submit_Attempt', 'register');
    
    const errors: string[] = [];
    
    if (!form.name) {
        errors.push('name_required');
        trackFormValidation('name', false, 'required');
    } else if (form.name.length < 2) {
        errors.push('name_too_short');
        trackFormValidation('name', false, 'too_short');
    } else {
        trackFormValidation('name', true);
    }
    
    if (!form.email) {
        errors.push('email_required');
        trackFormValidation('email', false, 'required');
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.push('email_invalid');
        trackFormValidation('email', false, 'invalid_format');
    } else {
        trackFormValidation('email', true);
    }
    
    if (!form.password) {
        errors.push('password_required');
        trackFormValidation('password', false, 'required');
    } else if (form.password.length < 8) {
        errors.push('password_too_short');
        trackFormValidation('password', false, 'too_short');
    } else {
        trackFormValidation('password', true);
        trackPasswordStrength(validatePassword(form.password));
    }
    
    if (!form.password_confirmation) {
        errors.push('password_confirmation_required');
        trackFormValidation('password_confirmation', false, 'required');
    } else if (form.password !== form.password_confirmation) {
        errors.push('password_confirmation_mismatch');
        trackFormValidation('password_confirmation', false, 'mismatch');
    } else {
        trackFormValidation('password_confirmation', true);
    }
    
    if (errors.length > 0) {
        formErrors.value = errors;
        matomo.trackFormSubmission('register', false, errors.join(','));
        return;
    }
    
    form.post(route('register'), {
        onSuccess: () => {
            matomo.trackFormSubmission('register', true);
            matomo.trackGoal(MATOMO_GOALS.REGISTER_SUCCESS);
            matomo.trackEvent('Auth', 'Register_Success', 'form');
            matomo.trackUserAction('Register', 'success');
            
            const referrer = document.referrer;
            if (referrer) {
                matomo.trackEvent('User_Acquisition', 'Source', new URL(referrer).hostname);
            }
        },
        onError: (errors) => {
            const errorTypes = Object.keys(errors);
            matomo.trackFormSubmission('register', false, errorTypes.join(','));
            
            errorTypes.forEach(field => {
                if (errors[field]) {
                    matomo.trackError('Register_Error', field, errors[field]);
                }
            });
            
            matomo.trackEvent('Auth', 'Register_Failed', errorTypes.join(','));
        },
        onFinish: () => {
            form.reset('password', 'password_confirmation');
            formSubmitted.value = false;
        },
    });
};

onMounted(() => {
    matomo.trackAuthPage('register');
    matomo.initPageTracking('Auth', 'Guest');
    
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source') || urlParams.get('utm_source');
    if (source) {
        matomo.trackEvent('User_Acquisition', 'Campaign_Source', source);
        matomo.setCustomVariable(5, 'Acquisition_Source', source, 'visit');
    }
    
    if (document.referrer) {
        const referrerDomain = new URL(document.referrer).hostname;
        matomo.trackEvent('User_Acquisition', 'Referrer', referrerDomain);
    }
    
    matomo.trackEvent('Auth', 'Session_Start', 'register_page');
});
</script>

<template>
    <Head title="S'inscrire" />

    <div class="flex min-h-screen items-center justify-center p-6">
        <div class="w-full max-w-md">
            <div class="pixel-border pixel-border-dirt mb-6">
                <div class="pixel-border pixel-border-dark-dirt p-8 dark:!bg-transparent dark:!shadow-none">
                    <div class="pixel-border pixel-border-stone mb-6 px-4 py-3 text-center">
                        <h1 class="font-mono text-xl font-bold text-white dark:text-black">S'inscrire</h1>
                        <p class="mt-2 font-mono text-sm text-white dark:text-black">Créez votre compte pour rejoindre la discussion</p>
                    </div>

                    <form @submit.prevent="submit" class="space-y-6">
                        <div class="space-y-2">
                            <div class="inline-block px-3 py-1">
                                <label for="name" class="font-mono text-sm font-bold text-white dark:text-black"> Nom </label>
                            </div>
                            <div class="pixel-border pixel-border-stone mt-2">
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    autofocus
                                    v-model="form.name"
                                    placeholder="Votre nom"
                                    class="w-full border-none bg-white p-3 font-mono text-black outline-none"
                                    :class="{ 'bg-red-50': form.errors.name || formErrors.includes('name_required') || formErrors.includes('name_too_short') }"
                                    @focus="trackFormInteraction('name')"
                                    @blur="trackFormValidation('name', !!form.name && form.name.length >= 2)"
                                />
                            </div>
                            <div v-if="form.errors.name || formErrors.includes('name_required') || formErrors.includes('name_too_short')" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2">
                                <span class="font-mono text-sm text-red-800">
                                    {{ form.errors.name || (formErrors.includes('name_required') ? 'Nom requis' : 'Nom trop court') }}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div class="inline-block px-3 py-1">
                                <label for="email" class="font-mono text-sm font-bold text-white dark:text-black"> Adresse email </label>
                            </div>
                            <div class="pixel-border pixel-border-stone mt-2">
                                <input
                                    id="email"
                                    type="email"
                                    required
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
                            <div class="inline-block px-3 py-1">
                                <label for="password" class="font-mono text-sm font-bold text-white dark:text-black"> Mot de passe </label>
                            </div>
                            <div class="pixel-border pixel-border-stone mt-2">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    v-model="form.password"
                                    placeholder="Votre mot de passe"
                                    class="w-full border-none bg-white p-3 font-mono text-black outline-none"
                                    :class="{ 'bg-red-50': form.errors.password || formErrors.includes('password_required') || formErrors.includes('password_too_short') }"
                                    @focus="trackFormInteraction('password')"
                                    @blur="trackFormValidation('password', !!form.password && form.password.length >= 8)"
                                    @input="form.password.length >= 4 && trackPasswordStrength(validatePassword(form.password))"
                                />
                            </div>
                            
                            <div v-if="form.password.length >= 4" class="pixel-border pixel-border-stone mt-1 px-2 py-1">
                                <div class="flex items-center space-x-2">
                                    <span class="font-mono text-xs text-black">Force:</span>
                                    <div class="flex space-x-1">
                                        <div class="h-1 w-4 rounded" :class="form.password.length >= 1 ? 'bg-red-400' : 'bg-gray-300'"></div>
                                        <div class="h-1 w-4 rounded" :class="form.password.length >= 6 ? 'bg-yellow-400' : 'bg-gray-300'"></div>
                                        <div class="h-1 w-4 rounded" :class="validatePassword(form.password) === 'strong' ? 'bg-green-400' : 'bg-gray-300'"></div>
                                    </div>
                                    <span class="font-mono text-xs text-black">{{ validatePassword(form.password) === 'strong' ? 'Fort' : validatePassword(form.password) === 'medium' ? 'Moyen' : 'Faible' }}</span>
                                </div>
                            </div>
                            
                            <div v-if="form.errors.password || formErrors.includes('password_required') || formErrors.includes('password_too_short')" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2">
                                <span class="font-mono text-sm text-red-800">
                                    {{ form.errors.password || (formErrors.includes('password_required') ? 'Mot de passe requis' : 'Mot de passe trop court (min. 8 caractères)') }}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div class="inline-block px-3 py-1">
                                <label for="password_confirmation" class="font-mono text-sm font-bold text-white dark:text-black">
                                    Confirmation du mot de passe
                                </label>
                            </div>
                            <div class="pixel-border pixel-border-stone mt-2">
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    v-model="form.password_confirmation"
                                    placeholder="Confirmez votre mot de passe"
                                    class="w-full border-none bg-white p-3 font-mono text-black outline-none"
                                    :class="{ 'bg-red-50': form.errors.password_confirmation || formErrors.includes('password_confirmation_required') || formErrors.includes('password_confirmation_mismatch') }"
                                    @focus="trackFormInteraction('password_confirmation')"
                                    @blur="trackFormValidation('password_confirmation', form.password === form.password_confirmation)"
                                />
                            </div>
                            <div v-if="form.errors.password_confirmation || formErrors.includes('password_confirmation_required') || formErrors.includes('password_confirmation_mismatch')" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2">
                                <span class="font-mono text-sm text-red-800">
                                    {{ form.errors.password_confirmation || (formErrors.includes('password_confirmation_required') ? 'Confirmation requise' : 'Les mots de passe ne correspondent pas') }}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <button
                                type="submit"
                                :disabled="form.processing || formSubmitted"
                                class="pixel-border w-full transition-colors duration-200 hover:bg-yellow-50 disabled:cursor-not-allowed disabled:opacity-70"
                                :class="{ 'animate-pulse': form.processing }"
                            >
                                <div class="pixel-border flex items-center justify-center gap-3 px-6 py-3">
                                    <div v-if="form.processing" class="animate-spin">
                                        <div class="pixel-border pixel-border-dirt h-4 w-4"></div>
                                    </div>
                                    <span class="font-mono font-bold text-white dark:text-black">
                                        {{ form.processing ? 'Inscription...' : "S'inscrire" }}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </form>

                    <div class="mt-6 space-y-6 px-4 py-3 text-center">
                        <span class="font-mono text-sm text-white dark:text-black">Vous avez déjà un compte ?</span>
                        <a :href="route('login')" class="pixel-border pixel-border-gold ml-2 inline-block px-2 py-1 duration-200" @click="matomo.trackNavigation('login_from_register')">
                            <span class="font-mono text-sm font-bold text-white dark:text-black">Se connecter</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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