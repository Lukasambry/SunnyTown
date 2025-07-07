<template>
    <form @submit.prevent="submit" class="space-y-4 mt-6">
        <div>
      <textarea
          v-model="form.content"
          placeholder="Votre message…"
          rows="4"
          class="w-full pixel-border placeholder:text-black text-black pixel-border-stone dark:pixel-border-dark-dirt p-2 font-mono resize-none"
      ></textarea>
            <div v-if="form.errors.content" class="text-red-600 text-sm mt-1 font-mono">
                {{ form.errors.content }}
            </div>
        </div>

        <button
            type="submit"
            :disabled="form.processing"
            class="px-4 py-2 pixel-border pixel-border-gold font-mono text-black inline-block disabled:opacity-50"
        >
            <span v-if="form.processing">Envoi en cours…</span>
            <span v-else>Envoyer</span>
        </button>
    </form>
</template>

<script lang="ts" setup>
import { useForm } from '@inertiajs/vue3'

const props = defineProps<{
    threadId: number | string
}>()

const form = useForm({
    thread_id: props.threadId,
    content: '',
})

function submit() {
    form.post(route('messages.store'), {
        preserveScroll: true,
        onSuccess: () => form.reset('content'),
    })
}
</script>
