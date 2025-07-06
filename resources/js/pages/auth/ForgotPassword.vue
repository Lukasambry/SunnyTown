<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';

defineProps<{
    status?: string;
}>();

const form = useForm({
    email: '',
});

const submit = () => {
    form.post(route('password.email'));
};
</script>

<template>
    <Head title="Forgot password" />

    <div class="min-h-screen flex items-center justify-center p-6">
        <div class="w-full max-w-md">

            <div class="pixel-border pixel-border-dirt mb-6">
                <div class="pixel-border pixel-border-dark-dirt dark:!bg-transparent dark:!shadow-none p-8">

                    <div class="pixel-border pixel-border-stone mb-6 px-4 py-3 text-center">
                        <h1 class="font-mono font-bold text-xl text-black">
                            Mot de passe oublié
                        </h1>
                        <p class="font-mono text-sm text-black mt-2">
                            Entrez votre email pour recevoir un lien de réinitialisation
                        </p>
                    </div>

                    <div v-if="status" class="pixel-border pixel-border-stone mb-4 px-3 py-2 text-center">
                        <span class="font-mono text-sm text-green-800">{{ status }}</span>
                    </div>

                    <form @submit.prevent="submit" class="space-y-6">

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
                                    name="email"
                                    required
                                    autofocus
                                    autocomplete="email"
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

                        <div class="space-y-3">
                            <button
                                type="submit"
                                :disabled="form.processing"
                                class="w-full pixel-border hover:bg-yellow-50
                                       disabled:opacity-70 disabled:cursor-not-allowed
                                       transition-colors duration-200"
                                :class="{ 'animate-pulse': form.processing }"
                            >
                                <div class="pixel-border px-6 py-3 flex items-center justify-center gap-3">
                                    <div v-if="form.processing" class="animate-spin">
                                        <div class="pixel-border pixel-border-dirt w-4 h-4"></div>
                                    </div>
                                    <span class="font-mono font-bold text-white dark:text-black">
                                        {{ form.processing ? 'Envoi en cours...' : 'Envoyer le lien' }}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </form>
                    <div class="px-4 py-3 text-center mt-6">
                        <span class="font-mono text-sm text-white dark:text-black">
                            Ou retourner à la
                        </span>
                        <a
                            :href="route('login')"
                            class="duration-200 inline-block ml-2 pixel-border pixel-border-gold px-2 py-1"
                        >
                            <span class="font-mono text-sm font-bold text-white dark:text-black">Connexion</span>
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
    50% { opacity: 0.8; }
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
