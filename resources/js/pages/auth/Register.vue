<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3'

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
})

const submit = () => {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation')
    })
}
</script>

<template>
    <Head title="S'inscrire" />

    <div class="min-h-screen flex items-center justify-center p-6">
        <div class="w-full max-w-md">
            <div class="pixel-border pixel-border-dirt mb-6">
                <div class="pixel-border pixel-border-dark-dirt dark:!bg-transparent dark:!shadow-none p-8">

                    <div class="pixel-border pixel-border-stone mb-6 px-4 py-3 text-center">
                        <h1 class="font-mono font-bold text-xl text-white dark:text-black">S'inscrire</h1>
                        <p class="font-mono text-sm text-white dark:text-black mt-2">
                            Créez votre compte pour rejoindre la discussion
                        </p>
                    </div>

                    <form @submit.prevent="submit" class="space-y-6">

                        <div class="space-y-2">
                            <div class="px-3 py-1 inline-block">
                                <label for="name" class="font-mono font-bold text-white dark:text-black text-sm">
                                    Nom
                                </label>
                            </div>
                            <div class="pixel-border pixel-border-stone mt-2">
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    autofocus
                                    v-model="form.name"
                                    placeholder="Votre nom"
                                    class="w-full p-3 font-mono text-black bg-white border-none outline-none"
                                    :class="{ 'bg-red-50': form.errors.name }"
                                />
                            </div>
                            <div v-if="form.errors.name" class="pixel-border pixel-border-destructive px-3 py-2 bg-red-100">
                                <span class="font-mono text-sm text-red-800">{{ form.errors.name }}</span>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div class="px-3 py-1 inline-block">
                                <label for="email" class="font-mono font-bold text-white dark:text-black text-sm">
                                    Adresse email
                                </label>
                            </div>
                            <div class="pixel-border pixel-border-stone mt-2">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    v-model="form.email"
                                    placeholder="email@exemple.com"
                                    class="w-full p-3 font-mono text-black bg-white border-none outline-none"
                                    :class="{ 'bg-red-50': form.errors.email }"
                                />
                            </div>
                            <div v-if="form.errors.email" class="pixel-border pixel-border-destructive px-3 py-2 bg-red-100">
                                <span class="font-mono text-sm text-red-800">{{ form.errors.email }}</span>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div class="px-3 py-1 inline-block">
                                <label for="password" class="font-mono font-bold text-white dark:text-black text-sm">
                                    Mot de passe
                                </label>
                            </div>
                            <div class="pixel-border pixel-border-stone mt-2">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    v-model="form.password"
                                    placeholder="Votre mot de passe"
                                    class="w-full p-3 font-mono text-black bg-white border-none outline-none"
                                    :class="{ 'bg-red-50': form.errors.password }"
                                />
                            </div>
                            <div v-if="form.errors.password" class="pixel-border pixel-border-destructive px-3 py-2 bg-red-100">
                                <span class="font-mono text-sm text-red-800">{{ form.errors.password }}</span>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div class="px-3 py-1 inline-block">
                                <label for="password_confirmation" class="font-mono font-bold text-white dark:text-black text-sm">
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
                                    class="w-full p-3 font-mono text-black bg-white border-none outline-none"
                                    :class="{ 'bg-red-50': form.errors.password_confirmation }"
                                />
                            </div>
                            <div v-if="form.errors.password_confirmation" class="pixel-border pixel-border-destructive px-3 py-2 bg-red-100">
                                <span class="font-mono text-sm text-red-800">{{ form.errors.password_confirmation }}</span>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <button
                                type="submit"
                                :disabled="form.processing"
                                class="w-full pixel-border hover:bg-yellow-50 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
                                :class="{ 'animate-pulse': form.processing }"
                            >
                                <div class="pixel-border px-6 py-3 flex items-center justify-center gap-3">
                                    <div v-if="form.processing" class="animate-spin">
                                        <div class="pixel-border pixel-border-dirt w-4 h-4"></div>
                                    </div>
                                    <span class="font-mono font-bold text-white dark:text-black">
                    {{ form.processing ? 'Inscription...' : "S'inscrire" }}
                  </span>
                                </div>
                            </button>
                        </div>
                    </form>

                    <div class="px-4 py-3 text-center mt-6 space-y-6">
                        <span class="font-mono text-sm text-white dark:text-black">Vous avez déjà un compte ?</span>
                        <a
                            :href="route('login')"
                            class="duration-200 inline-block ml-2 pixel-border pixel-border-gold px-2 py-1"
                        >
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
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.8; }
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
