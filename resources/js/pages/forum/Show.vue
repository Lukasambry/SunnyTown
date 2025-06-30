<template>
    <div class="p-6">
        <h1 class="text-3xl font-pixel">{{ category.name }}</h1>

        <div class="mt-6 space-y-4">
            <div
                v-for="thread in threads.data"
                :key="thread.id"
                class="border rounded p-4 flex justify-between"
            >
                <div>
                    <Link
                        :href="route('threads.show', thread.id)"
                        class="text-xl font-sans hover:underline"
                    >
                        {{ thread.title }}
                    </Link>
                    <p class="text-sm text-gray-500">
                        par {{ thread.user.username }}
                    </p>
                </div>
                <div class="text-xs text-gray-600">
                    {{ thread.created_at }}
                </div>
            </div>
        </div>

        <div class="mt-6">
        </div>
    </div>
</template>

<script lang="ts" setup>

import { Link } from '@inertiajs/vue3';

const { category, threads } = defineProps({
    category: Object,
    threads: Object,
});
</script>
