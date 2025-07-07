<template>
    <div class="p-6 space-y-6">
        <div class="pixel-border pixel-border-stone mb-6 px-4 py-2">
            <h1 class="font-mono text-3xl text-black">{{ category.name }}</h1>
        </div>

        <div class="space-y-4">
            <div
                v-for="thread in threads"
                :key="thread.id"
                class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt p-4 flex justify-between"
            >
                <div>
                    <Link
                        :href="route('forums.threads.show', { category: category.id, thread: thread.id })"
                        class="text-xl font-mono text-black hover:underline"
                    >
                        {{ thread.title }}
                    </Link>
                    <p class="text-sm font-mono text-gray-500 mt-1">
                        par {{ thread.user.name }}
                    </p>
                </div>
                <div class="text-xs font-mono text-gray-600">
                    {{ new Date(thread.created_at).toLocaleDateString('fr-FR') }}
                </div>
            </div>
        </div>

        <div class="mt-6">
            <Link
              :href="route('forums.threads.create', { category: category.id })"
              class="pixel-border pixel-border-gold px-3 py-1 font-mono text-sm text-black"
            >
              + Nouveau thread
            </Link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Link } from '@inertiajs/vue3'

defineProps<{
    category: { id: number; name: string }
    threads: Array<{
        id: number
        title: string
        user: { name: string }
        created_at: string
    }>
}>()

</script>
