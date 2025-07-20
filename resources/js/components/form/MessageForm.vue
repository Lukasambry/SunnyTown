<template>
    <form @submit.prevent="submit" class="mt-6 space-y-4">
        <div>
            <textarea
                v-model="form.content"
                placeholder="Votre message…"
                rows="4"
                class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt w-full resize-none p-2 font-mono text-black placeholder:text-black"
            ></textarea>
            <div v-if="form.errors.content" class="mt-1 font-mono text-sm text-red-600">
                {{ form.errors.content }}
            </div>
        </div>

        <button
            type="submit"
            :disabled="form.processing"
            class="pixel-border pixel-border-gold inline-block px-4 py-2 font-mono text-black disabled:opacity-50"
        >
            <span v-if="form.processing">Envoi en cours…</span>
            <span v-else>Envoyer</span>
        </button>
    </form>
</template>

<script lang="ts" setup>
import { useForm } from '@inertiajs/vue3';

const props = defineProps<{
    threadId: number | string;
}>();

const form = useForm({
    thread_id: props.threadId,
    content: '',
});

function submit() {
    form.post(route('messages.store'), {
        preserveScroll: true,
        onSuccess: () => form.reset('content'),
    });
}
</script>
