<script setup lang="ts">
import { ref, computed } from 'vue';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-vue3';

const page = usePage();

const code = ref('');
const recoveryCodeMode = ref(false);

const errors = computed(() => page.props.value.errors);
const submitChallenge = async () => {
    try {
        await Inertia.post('/two-factor-challenge', {
            [recoveryCodeMode.value ? 'recovery_code' : 'code']: code.value,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Gestion du succès
                code.value = '';
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    } catch (error) {
        console.error('Submission error:', error);
    }
};

const toggleRecoveryMode = () => {
    recoveryCodeMode.value = !recoveryCodeMode.value;
    code.value = '';
};

</script>

<template>
    <div class="flex min-h-screen items-center justify-center p-6">
        <div class="w-full max-w-md">
            <div class="pixel-border pixel-border-dirt mb-6">
                <div class="pixel-border pixel-border-dark-dirt p-8 dark:!bg-transparent dark:!shadow-none">
                    <div class="pixel-border pixel-border-stone mb-6 px-4 py-3 text-center">
                        <h1 class="font-mono text-xl font-bold text-white dark:text-black">Authentification à Deux Facteurs</h1>
                        <p class="mt-2 font-mono text-sm text-white dark:text-black">
                            <span v-if="!recoveryCodeMode">
                                Entrez le code généré par votre application d'authentification.
                            </span>
                            <span v-else>
                                Entrez un code de récupération.
                            </span>
                        </p>
                    </div>

                    <form @submit.prevent="submitChallenge" class="space-y-6">
                        <div class="space-y-2">
                            <div class="inline-block px-3 py-1">
                                <label for="code" class="font-mono text-sm font-bold text-white dark:text-black">
                                    {{ recoveryCodeMode ? 'Code de récupération' : 'Code d\'authentification' }}
                                </label>
                            </div>
                            <div class="pixel-border pixel-border-stone mt-2">
                                <input
                                    id="code"
                                    type="text"
                                    v-model="code"
                                    required
                                    autofocus
                                    :inputmode="recoveryCodeMode ? 'text' : 'numeric'"
                                    autocomplete="one-time-code"
                                    placeholder="Votre code"
                                    class="w-full border-none bg-white p-3 font-mono text-black outline-none"
                                    :class="{ 'bg-red-50': errors?.code || errors?.recovery_code }"
                                />
                            </div>
                            <div v-if="errors?.code || errors?.recovery_code" class="pixel-border pixel-border-destructive bg-red-100 px-3 py-2">
                                <span class="font-mono text-sm text-red-800">
                                    {{ errors?.code || errors?.recovery_code }}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <button
                                type="submit"
                                class="pixel-border w-full transition-colors duration-200 hover:bg-yellow-50 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <div class="pixel-border flex items-center justify-center gap-3 px-6 py-3">
                                    <span class="font-mono font-bold text-white dark:text-black">
                                        Se connecter
                                    </span>
                                </div>
                            </button>
                        </div>
                    </form>

                    <div class="mt-6 px-4 py-3 text-center">
                        <button
                            type="button"
                            @click="toggleRecoveryMode"
                            class="pixel-border pixel-border-gold ml-2 inline-block px-2 py-1 duration-200"
                        >
                            <span class="font-mono text-sm font-bold text-white dark:text-black">
                                {{ recoveryCodeMode ? 'Utiliser un code d\'authentification' : 'Utiliser un code de récupération' }}
                            </span>
                        </button>
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
.pixel-border:hover {
    transform: translateY(-1px);
    transition: transform 0.1s ease-in-out;
}
button:hover:not(:disabled) {
    transform: translateY(-2px);
}
a:hover .pixel-border, button.pixel-border-gold:hover {
    background-color: var(--color-gold-secondary);
}
</style>
