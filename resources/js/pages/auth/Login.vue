<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';

defineProps<{
    status?: string;
    canResetPassword: boolean;
}>();

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const submit = () => {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    });
};
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
                                    :class="{ 'bg-red-50': form.errors.email }"
                                />
                            </div>
                            <div v-if="form.errors.email" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2">
                                <span class="font-mono text-sm text-red-800">{{ form.errors.email }}</span>
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
                                    :class="{ 'bg-red-50': form.errors.password }"
                                />
                            </div>
                            <div v-if="form.errors.password" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2">
                                <span class="font-mono text-sm text-red-800">{{ form.errors.password }}</span>
                            </div>
                        </div>

                        <div class="px-4 py-3">
                            <label class="flex cursor-pointer items-center space-x-3 font-mono text-sm text-white dark:text-black">
                                <div class="pixel-border pixel-border-dirt pixel-checkbox" :class="{ 'pixel-checkbox-checked': form.remember }">
                                    <input id="remember" type="checkbox" v-model="form.remember" :tabindex="3" class="sr-only" />
                                    <div v-if="form.remember" class="pixel-checkmark">✓</div>
                                </div>
                                <span>Se souvenir de moi</span>
                            </label>
                        </div>

                        <div class="space-y-3">
                            <button
                                type="submit"
                                :tabindex="4"
                                :disabled="form.processing"
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
                        <a :href="route('register')" :tabindex="5" class="pixel-border pixel-border-gold ml-2 inline-block px-2 py-1 duration-200">
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
