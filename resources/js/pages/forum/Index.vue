<template>
    <div class="p-6 space-y-6">
        <h1 class="text-3xl font-pixel">Forums</h1>
        <div v-for="category in categories" :key="category.id" class="border rounded-lg p-4">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-pixel">{{ category.name }}</h2>
                <Link
                    :href="route('forums.categories.show', { category: category.id })"
                    class="text-sm font-pixel underline"
                >
                    Voir tous les threads
                </Link>
            </div>
            <ul class="space-y-2">
                <li
                    v-for="thread in category.threads"
                    :key="thread.id"
                    class="flex justify-between items-center"
                >
                    <Link
                        :href="route('forums.threads.show', { category: category.id, thread: thread.id })"
                        class="font-sans hover:underline"
                    >
                        {{ thread.title }}
                    </Link>
                    <span class="text-xs font-sans text-gray-500">
            par {{ thread.user.name }}
          </span>
                </li>
            </ul>
            <Link
                :href="route('forums.threads.create',{ category: category.id })"
                class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
                + Nouveau thread
            </Link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Link } from '@inertiajs/vue3'
    defineProps({
        categories: Array
    });
</script>
