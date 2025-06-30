<template>
    <div class="p-6 space-y-6">
        <h1 class="text-3xl font-pixel">{{ thread.title }}</h1>
        <div v-for="msg in thread.messages" :key="msg.id" class="border-b pb-4 mb-4">
            <div class="flex items-center space-x-2 mb-2">
                <span class="font-pixel">{{ msg.user.username }}</span>
                <span class="text-xs text-gray-500">{{ msg.created_at }}</span>
            </div>
            <p class="font-sans">{{ msg.content }}</p>
            <div v-if="msg.images.length" class="mt-2 flex space-x-2">
                <img
                    v-for="img in msg.images"
                    :key="img.id"
                    :src="`/storage/${img.path}`"
                    class="w-24 h-24 object-cover border"
                />
            </div>
        </div>

        <message-form v-if="thread && thread.id" :thread-id="thread.id"/>
    </div>
</template>

<script lang="ts" setup>
import MessageForm from '@/Components/form/MessageForm.vue';

const { thread } = defineProps({ thread: Object });

</script>
