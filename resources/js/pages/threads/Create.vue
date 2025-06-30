<script lang="ts" setup>

import { useForm } from '@inertiajs/vue3';

const props = defineProps({
    category: Object
});

const form = useForm({
    title: '',
    content: ''
});

function submit() {
    form.post(route('forums.threads.store', props.category?.id), {
        onSuccess: () => {
        }
    });
}
</script>

<template>
    <Head>
        <title>Créer un thread dans {{ category.name }}</title>
    </Head>

    <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Nouveau thread dans « {{ category.name }} »</h1>
            <Link
                :href="route('forums.categories.show', {category: category.id})"
                class="text-blue-600 hover:underline"
            >
                ← Retour
            </Link>
        </div>

        <form @submit.prevent="submit" class="space-y-4">
            <div>
                <label class="block font-semibold mb-1">Titre</label>
                <input
                    v-model="form.title"
                    type="text"
                    class="w-full border rounded px-3 py-2"
                />
                <div v-if="form.errors.title" class="text-red-600 text-sm mt-1">
                    {{ form.errors.title }}
                </div>
            </div>

            <div>
                <label class="block font-semibold mb-1">Contenu</label>
                <textarea
                    v-model="form.content"
                    rows="6"
                    class="w-full border rounded px-3 py-2"
                ></textarea>
                <div v-if="form.errors.content" class="text-red-600 text-sm mt-1">
                    {{ form.errors.content }}
                </div>
            </div>

            <button
                type="submit"
                :disabled="form.processing"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                Créer le thread
            </button>
        </form>
    </div>
</template>
