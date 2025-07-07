<template>
    <div class="p-6 space-y-6">
        <div class="pixel-border pixel-border-stone mb-6 px-4 py-2">
            <h1 class="font-mono text-3xl text-black">Forums</h1>
        </div>

        <div
            v-for="category in categories"
            :key="category.id"
            class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt p-4 space-y-4"
        >
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-mono text-black">{{ category.name }}</h2>
                <Link
                    :href="route('forums.categories.show', { category: category.id })"
                    class="text-sm font-mono underline text-black"
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
                        class="font-mono text-black hover:underline"
                    >
                        {{ thread.title }}
                    </Link>
                    <span class="text-xs font-mono text-gray-500">
            par {{ thread.user.name }}
          </span>
                </li>
            </ul>

            <div class="mt-4">
                <Link
                    :href="route('forums.threads.create', { category: category.id })"
                    class="pixel-border pixel-border-gold px-3 py-1 inline-block font-mono text-sm text-black"
                >
                    + Nouveau thread
                </Link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Link } from '@inertiajs/vue3'

defineProps<{
    categories: Array<{
        id: number
        name: string
        threads: Array<{
            id: number
            title: string
            user: { name: string }
        }>
    }>
}>()
</script>
