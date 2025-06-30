<template>
    <form @submit.prevent="submit" class="space-y-4 mt-6">
        <div>
            <textarea
                v-model="form.content"
                placeholder="Votre message…"
                class="w-full border rounded p-2 font-sans"
                rows="4"
            ></textarea>
            <div v-if="form.errors.content" class="text-red-600 text-sm">
                {{ form.errors.content }}
            </div>
        </div>
        <button
            type="submit"
            :disabled="form.processing"
            class="px-4 py-2 bg-blue-600 text-white font-pixel rounded hover:bg-blue-700 disabled:opacity-50"
        >
            <span v-if="form.processing">Envoi en cours...</span>
            <span v-else>Envoyer</span>
        </button>
    </form>
</template>

<script lang="ts" setup>
import { useForm } from '@inertiajs/vue3';

const props = defineProps({
    threadId: {
        type: [String, Number],
        required: true
    }
});

const form = useForm({
    thread_id: props.threadId,
    content: '',
});

function submit() {
    form.post(route('messages.store'), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset('content');
        }
    });
}
</script>
