<template>
    <div class="space-y-6 p-6">
        <div class="pixel-border pixel-border-stone mb-6 px-4 py-2">
            <h1 class="font-mono text-3xl text-black">{{ thread.title }}</h1>
        </div>

        <div class="space-y-4">
            <div v-for="msg in thread.messages" :key="msg.id" class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt p-4">
                <div class="mb-2 flex items-center space-x-2">
                    <span class="font-mono text-black">{{ msg.user.name }}</span>
                    <span class="font-mono text-xs text-gray-500">
                        {{ new Date(msg.created_at).toLocaleString('fr-FR') }}
                    </span>
                </div>
                <div class="font-mono text-black">
                    {{ msg.content }}
                </div>
            </div>
        </div>

        <div v-if="thread && thread.id" class="mt-6">
            <message-form :thread-id="thread.id" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import MessageForm from '@/Components/form/MessageForm.vue';

defineProps<{
    thread: {
        id: number;
        title: string;
        messages: Array<{
            id: number;
            content: string;
            created_at: string;
            user: { name: string };
        }>;
    };
}>();
</script>
