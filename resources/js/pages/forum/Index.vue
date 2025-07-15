<template>
    <div class="space-y-6 p-6">
        <div class="pixel-border pixel-border-stone mb-6 px-4 py-2">
            <h1 class="font-mono text-3xl text-black">Forums</h1>
        </div>

        <div v-for="category in categories" :key="category.id" class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt space-y-4 p-4">
            <div class="flex items-center justify-between">
                <h2 class="font-mono text-2xl text-black">{{ category.name }}</h2>
                <Link :href="route('forums.categories.show', { category: category.id })" class="font-mono text-sm text-black underline">
                    Voir tous les threads
                </Link>
            </div>

            <ul class="space-y-2">
                <li v-for="thread in category.threads" :key="thread.id" class="flex items-center justify-between">
                    <Link
                        :href="route('forums.threads.show', { category: category.id, thread: thread.id })"
                        class="font-mono text-black hover:underline"
                    >
                        {{ thread.title }}
                    </Link>
                    <span class="font-mono text-xs text-gray-500"> par {{ thread.user.name }} </span>
                </li>
            </ul>

            <div class="mt-4">
                <Link
                    :href="route('forums.threads.create', { category: category.id })"
                    class="pixel-border pixel-border-gold inline-block px-3 py-1 font-mono text-sm text-black"
                >
                    + Nouveau thread
                </Link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Link } from '@inertiajs/vue3';

defineProps<{
    categories: Array<{
        id: number;
        name: string;
        threads: Array<{
            id: number;
            title: string;
            user: { name: string };
        }>;
    }>;
}>();
</script>
