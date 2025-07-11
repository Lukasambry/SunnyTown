<script setup lang="ts">
import { ref } from 'vue';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-vue3';

const page = usePage();

const code = ref('');
const recoveryCodeMode = ref(false);
const password = ref('');

const errors = page.props.errors;

const submitChallenge = async () => {
    Inertia.post('/two-factor-challenge', {
        code: code.value,
    }, {
        onFinish: () => {
            code.value = '';
        }
    });
};

const toggleRecoveryMode = () => {
    recoveryCodeMode.value = !recoveryCodeMode.value;
    code.value = '';
};

const useRecoveryCode = () => {
    submitChallenge();
};
</script>

<template>
    <div>
        <h1>Challenge d'Authentification à Deux Facteurs</h1>

        <p v-if="!recoveryCodeMode">
            Veuillez entrer le code à usage unique généré par votre application d'authentification.
        </p>
        <p v-else>
            Veuillez entrer un de vos codes de récupération.
        </p>

        <form @submit.prevent="submitChallenge">
            <div>
                <label for="code">Code :</label>
                <input
                    id="code"
                    type="text"
                    v-model="code"
                    required
                    autofocus
                    inputmode="numeric"
                    autocomplete="one-time-code"
                >
                <div v-if="errors.code" class="text-red-500 text-sm">{{ errors.code }}</div>
            </div>
        </form>

        <hr>

        <button @click="toggleRecoveryMode">
            {{ recoveryCodeMode ? 'Utiliser un code d\'authentification' : 'Utiliser un code de récupération' }}
        </button>
    </div>
</template>

<style scoped>
.text-red-500 { color: red; }
</style>
