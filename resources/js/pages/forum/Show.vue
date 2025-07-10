<template>
    <div class="space-y-6 p-6">
        <div class="pixel-border pixel-border-stone mb-6 px-4 py-2">
            <h1 class="font-mono text-3xl text-black">{{ category.name }}</h1>
        </div>

        <div class="space-y-4">
            <div
                v-for="thread in threads"
                :key="thread.id"
                class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt flex justify-between p-4"
            >
                <div>
                    <Link
                        :href="route('forums.threads.show', { category: category.id, thread: thread.id })"
                        class="font-mono text-xl text-black hover:underline"
                    >
                        {{ thread.title }}
                    </Link>
                    <p class="mt-1 font-mono text-sm text-gray-500">par {{ thread.user.name }}</p>
                </div>
                <div class="font-mono text-xs text-gray-600">
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
import { Link } from '@inertiajs/vue3';

defineProps<{
    category: { id: number; name: string };
    threads: Array<{
        id: number;
        title: string;
        user: { name: string };
        created_at: string;
    }>;
}>();
</script>
