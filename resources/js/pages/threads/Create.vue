<script lang="ts" setup>
import { Head, Link } from '@inertiajs/vue3'
import { useForm } from '@inertiajs/vue3'

const props = defineProps<{
    category: {
        id: number
        name: string
    }
}>()

const form = useForm({
    title: '',
    content: ''
})

function submit() {
    form.post(route('forums.threads.store', props.category.id), {
        onSuccess: () => {
        }
    })
}
</script>

<template>
    <Head>
        <title>Créer un thread dans {{ props.category.name }}</title>
    </Head>

    <div class="container mx-auto px-4 py-6 space-y-6">
        <div class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt flex justify-between items-center px-4 py-2">
            <h1 class="font-mono text-2xl">Nouveau thread dans « {{ props.category.name }} »</h1>
            <Link
                :href="route('forums.categories.show', { category: props.category.id })"
                class="font-mono text-black hover:underline"
            >
                ← Retour
            </Link>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
            <div>
                <label class="block font-mono font-semibold mb-1">Titre</label>
                <input
                    v-model="form.title"
                    type="text"
                    placeholder="Entrez un titre…"
                    class="w-full pixel-border pixel-border-stone dark:pixel-border-dark-dirt px-3 py-2 font-mono"
                />
                <p v-if="form.errors.title" class="text-red-600 text-sm mt-1 font-mono">
                    {{ form.errors.title }}
                </p>
            </div>

            <div>
                <label class="block font-mono font-semibold mb-1">Contenu</label>
                <textarea
                    v-model="form.content"
                    rows="6"
                    placeholder="Écrivez votre message…"
                    class="w-full pixel-border pixel-border-stone dark:pixel-border-dark-dirt px-3 py-2 font-mono resize-none"
                ></textarea>
                <p v-if="form.errors.content" class="text-red-600 text-sm mt-1 font-mono">
                    {{ form.errors.content }}
                </p>
            </div>

            <button
                type="submit"
                :disabled="form.processing"
                class="px-4 py-2 pixel-border pixel-border-gold font-mono text-black disabled:opacity-50"
            >
                <span v-if="form.processing">Création en cours…</span>
                <span v-else>Créer le thread</span>
            </button>
        </form>
    </div>
</template>
