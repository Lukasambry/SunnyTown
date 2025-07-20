<template>
    <form @submit.prevent="submit" class="space-y-6">
        <!-- Textarea container -->
        <div class="relative">
            <textarea
                v-model="form.content"
                placeholder="Écrivez votre message..."
                rows="6"
                class="w-full resize-none px-4 py-4 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                :class="{ 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.content }"
            ></textarea>

            <!-- Character counter -->
            <div class="absolute bottom-3 right-3 text-xs text-black/50 dark:text-white/50 font-medium">
                {{ form.content.length }}/1000
            </div>

            <!-- Error message -->
            <div v-if="form.errors.content" class="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" x2="12" y1="8" y2="12"/>
                    <line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
                {{ form.errors.content }}
            </div>
        </div>

        <!-- Form actions -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-black/5 dark:border-white/5">
            <!-- Form tools -->
            <div class="flex items-center gap-3">
                <button
                    type="button"
                    class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                        <rect width="18" height="18" x="3" y="3" rx="2"/>
                        <path d="m9 9 6 6"/>
                        <path d="m15 9-6 6"/>
                    </svg>
                    Fichier
                </button>

                <button
                    type="button"
                    class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        <line x1="12" x2="12" y1="19" y2="22"/>
                        <line x1="8" x2="16" y1="22" y2="22"/>
                    </svg>
                    Emoji
                </button>

                <div class="text-xs text-black/50 dark:text-white/50 hidden sm:block">
                    <span class="font-medium">Astuce:</span> Utilisez Ctrl+Entrée pour envoyer
                </div>
            </div>

            <!-- Submit actions -->
            <div class="flex items-center gap-3">
                <button
                    type="button"
                    @click="form.reset('content')"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300"
                    :disabled="form.processing"
                >
                    Annuler
                </button>

                <div class="rounded-xl p-1 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300" :class="{ 'opacity-50': !canSubmit || form.processing }">
                    <button
                        type="submit"
                        :disabled="!canSubmit || form.processing"
                        class="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium text-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div v-if="form.processing" class="flex items-center gap-2">
                            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Envoi en cours...
                        </div>
                        <div v-else class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 duration-300">
                                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                                <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                                <path d="m2 2 7.586 7.586"/>
                                <circle cx="11" cy="11" r="2"/>
                            </svg>
                            Envoyer le message
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Success message -->
        <div v-if="showSuccess" class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-800 dark:text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="m9 12 2 2 4-4"/>
            </svg>
            <span class="text-sm font-medium">Message envoyé avec succès !</span>
        </div>
    </form>
</template>

<script lang="ts" setup>
import { useForm } from '@inertiajs/vue3';
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
    threadId: number | string;
}>();

const form = useForm({
    thread_id: props.threadId,
    content: '',
});

const showSuccess = ref(false);

// Computed properties
const canSubmit = computed(() => {
    return form.content.trim().length > 0 && form.content.length <= 1000;
});

// Methods
function submit() {
    if (!canSubmit.value || form.processing) return;

    form.post(route('messages.store'), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset('content');
            showSuccess.value = true;
            setTimeout(() => {
                showSuccess.value = false;
            }, 3000);
        },
        onError: () => {
            // Error handling is done through form.errors
        }
    });
}

// Keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        submit();
    }
};

// Lifecycle
onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
/* Custom spinner animation */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Focus styles */
textarea:focus {
    transform: scale(1.01);
}

/* Button hover effects */
.group:hover .group-hover\:translate-x-1 {
    transform: translateX(4px);
}

.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

* {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.success-enter-active {
    animation: slideIn 0.3s ease-out;
}
</style>
