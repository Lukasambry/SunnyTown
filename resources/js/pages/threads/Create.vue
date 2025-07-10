<script lang="ts" setup>
import { Head, Link, useForm } from '@inertiajs/vue3';

const props = defineProps<{
    category: {
        id: number;
        name: string;
    };
}>();

const form = useForm({
    title: '',
    content: '',
});

function submit() {
    form.post(route('forums.threads.store', props.category.id), {
        onSuccess: () => {},
    });
}
</script>

<template>
    <Head>
        <title>Créer un thread dans {{ props.category.name }}</title>
    </Head>

    <div class="container mx-auto space-y-6 px-4 py-6">
        <div class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt flex items-center justify-between px-4 py-2">
            <h1 class="font-mono text-2xl">Nouveau thread dans « {{ props.category.name }} »</h1>
            <Link :href="route('forums.categories.show', { category: props.category.id })" class="font-mono text-black hover:underline">
                ← Retour
            </Link>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
            <div>
                <label class="mb-1 block font-mono font-semibold">Titre</label>
                <input
                    v-model="form.title"
                    type="text"
                    placeholder="Entrez un titre…"
                    class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt w-full px-3 py-2 font-mono"
                />
                <p v-if="form.errors.title" class="mt-1 font-mono text-sm text-red-600">
                    {{ form.errors.title }}
                </p>
            </div>

            <div>
                <label class="mb-1 block font-mono font-semibold">Contenu</label>
                <textarea
                    v-model="form.content"
                    rows="6"
                    placeholder="Écrivez votre message…"
                    class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt w-full resize-none px-3 py-2 font-mono"
                ></textarea>
                <p v-if="form.errors.content" class="mt-1 font-mono text-sm text-red-600">
                    {{ form.errors.content }}
                </p>
            </div>

            <button
                type="submit"
                :disabled="form.processing"
                class="pixel-border pixel-border-gold px-4 py-2 font-mono text-black disabled:opacity-50"
            >
                <span v-if="form.processing">Création en cours…</span>
                <span v-else>Créer le thread</span>
            </button>
        </form>
    </div>
</template>
