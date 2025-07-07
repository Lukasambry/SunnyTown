<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};
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
                                    :class="{ 'bg-red-50': form.errors.name }"
                                />
                            </div>
                            <div v-if="form.errors.name" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2">
                                <span class="font-mono text-sm text-red-800">{{ form.errors.name }}</span>
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
                                    :class="{ 'bg-red-50': form.errors.email }"
                                />
                            </div>
                            <div v-if="form.errors.email" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2">
                                <span class="font-mono text-sm text-red-800">{{ form.errors.email }}</span>
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
                                    :class="{ 'bg-red-50': form.errors.password }"
                                />
                            </div>
                            <div v-if="form.errors.password" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2">
                                <span class="font-mono text-sm text-red-800">{{ form.errors.password }}</span>
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
                                    :class="{ 'bg-red-50': form.errors.password_confirmation }"
                                />
                            </div>
                            <div v-if="form.errors.password_confirmation" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2">
                                <span class="font-mono text-sm text-red-800">{{ form.errors.password_confirmation }}</span>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <button
                                type="submit"
                                :disabled="form.processing"
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
                        <a :href="route('login')" class="pixel-border pixel-border-gold ml-2 inline-block px-2 py-1 duration-200">
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
