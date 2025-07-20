<template>
    <Head :title="`Thread: ${thread.title}`" />

    <SiteLayout :auth="$page.props.auth">
        <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a]">
            <div class="absolute inset-0 before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-repeat before:bg-[length:80px] before:opacity-[0.03] before:mix-blend-overlay before:content-['']"></div>

            <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div class="pb-8 border-b border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link
                        :href="route('forums.categories.show', { category: category.id })"
                        class="inline-flex items-center gap-2 text-black/70 dark:text-white/70 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:-translate-x-1 duration-300">
                            <path d="M5 12h14"/>
                            <path d="m5 12 6-6"/>
                            <path d="m5 12 6 6"/>
                        </svg>
                        Retour à {{ category.name }}
                    </Link>

                    <div class="flex items-center gap-3">
                        <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z"/>
                            </svg>
                            Favoris
                        </button>

                        <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                <polyline points="16,6 12,2 8,6"/>
                                <line x1="12" x2="12" y1="2" y2="15"/>
                            </svg>
                            Partager
                        </button>
                    </div>
                </div>

                <nav class="mb-8 mt-8" aria-label="Breadcrumb">
                    <div class="flex items-center gap-2 text-sm">
                        <Link
                            :href="route('forums.index')"
                            class="text-black/60 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 font-medium"
                        >
                            Forum
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/40 dark:text-white/40">
                            <path d="m9 18 6-6-6-6"/>
                        </svg>
                        <Link
                            :href="route('forums.categories.show', { category: category.id })"
                            class="text-black/60 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 font-medium"
                        >
                            {{ category.name }}
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/40 dark:text-white/40">
                            <path d="m9 18 6-6-6-6"/>
                        </svg>
                        <span class="text-black dark:text-white font-medium line-clamp-1">{{ thread.title }}</span>
                    </div>
                </nav>

                <div class="relative mb-12 rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-lg">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>
                    <div class="relative p-8 sm:p-12">
                        <div class="flex items-start gap-6">
                            <!-- Thread author avatar -->
                            <div class="flex-shrink-0">
                                <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    {{ thread.user?.name.charAt(0).toUpperCase() || 'U' }}
                                </div>
                            </div>

                            <!-- Thread info -->
                            <div class="flex-1 min-w-0">
                                <h1 class="text-3xl sm:text-4xl font-semibold tracking-tighter text-black dark:text-white mb-4 line-clamp-3">
                                    {{ thread.title }}
                                </h1>

                                <div class="flex flex-wrap items-center gap-4 text-sm">
                                    <div class="flex items-center gap-2">
                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span class="text-black/70 dark:text-white/70 font-medium">
                                        Créé par <span class="text-black dark:text-white">{{ thread.user?.name || 'Utilisateur' }}</span>
                                    </span>
                                    </div>

                                    <div class="w-px h-4 bg-black/20 dark:bg-white/20"></div>

                                    <div class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/50 dark:text-white/50">
                                            <path d="M8 2v4"/>
                                            <path d="M16 2v4"/>
                                            <rect width="18" height="18" x="3" y="4" rx="2"/>
                                            <path d="M3 10h18"/>
                                        </svg>
                                        <time class="text-black/60 dark:text-white/60 font-medium">
                                            {{ formatDate(thread.created_at) }}
                                        </time>
                                    </div>

                                    <div class="w-px h-4 bg-black/20 dark:bg-white/20"></div>

                                    <div class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/50 dark:text-white/50">
                                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                                        </svg>
                                        <span class="text-black/60 dark:text-white/60 font-medium">
                                        {{ thread.messages?.length || 0 }} message{{ (thread.messages?.length || 0) > 1 ? 's' : '' }}
                                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-6 mb-12">
                    <div
                        v-for="(message, index) in thread.messages"
                        :key="message.id"
                        class="group relative rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/15 dark:hover:border-white/15 transition-all duration-300"
                        :style="{ 'animation-delay': `${index * 0.1}s` }"
                    >
                        <div class="absolute inset-0 bg-gradient-to-br from-black/[0.01] via-transparent to-black/[0.01] dark:from-white/[0.01] dark:to-white/[0.01] group-hover:from-black/[0.02] dark:group-hover:from-white/[0.02] transition-all duration-300"></div>

                        <!-- Message content -->
                        <div class="relative p-6 sm:p-8">
                            <div class="flex items-start gap-4">
                                <!-- User avatar -->
                                <div class="flex-shrink-0">
                                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                                        {{ message.user?.name.charAt(0).toUpperCase() || 'U' }}
                                    </div>
                                </div>

                                <!-- Message details -->
                                <div class="flex-1 min-w-0">
                                    <!-- Message header -->
                                    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                                        <div class="flex items-center gap-3">
                                            <h3 class="text-lg font-semibold text-black dark:text-white tracking-tight">
                                                {{ message.user?.name || 'Utilisateur' }}
                                            </h3>

                                            <div class="flex items-center gap-2">
                                                <div class="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                                <span class="text-xs text-black/60 dark:text-white/60 font-medium">
                                                {{ getMessagePosition(index) }}
                                            </span>
                                            </div>
                                        </div>

                                        <time class="text-xs text-black/60 dark:text-white/60 font-medium bg-black/5 dark:bg-white/5 px-3 py-1 rounded-lg">
                                            {{ formatMessageDate(message.created_at) }}
                                        </time>
                                    </div>

                                    <!-- Message content -->
                                    <div class="prose prose-sm max-w-none">
                                        <div class="text-black dark:text-white leading-relaxed whitespace-pre-line">
                                            {{ message.content }}
                                        </div>
                                    </div>

                                    <!-- Message actions -->
                                    <div class="flex items-center gap-3 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                                        <button class="inline-flex items-center gap-2 text-xs text-black/60 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 group/action">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover/action:scale-110 duration-300">
                                                <path d="M7 10v12"/>
                                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
                                            </svg>
                                            Réagir
                                        </button>

                                        <button class="inline-flex items-center gap-2 text-xs text-black/60 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 group/action">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover/action:scale-110 duration-300">
                                                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                                            </svg>
                                            Répondre
                                        </button>

                                        <button class="inline-flex items-center gap-2 text-xs text-black/60 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 group/action">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover/action:scale-110 duration-300">
                                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                                <polyline points="16,6 12,2 8,6"/>
                                                <line x1="12" x2="12" y1="2" y2="15"/>
                                            </svg>
                                            Partager
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty state for no messages -->
                    <div v-if="!thread.messages || thread.messages.length === 0" class="text-center py-16">
                        <div class="w-24 h-24 mx-auto rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/40 dark:text-white/40">
                                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-black dark:text-white mb-2 tracking-tight">Aucun message pour le moment</h3>
                        <p class="text-black/60 dark:text-white/60">Soyez le premier à répondre à cette discussion.</p>
                    </div>
                </div>

                <div v-if="thread && thread.id" class="relative rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-lg">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>
                    <div class="relative p-6 sm:p-8">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                                    <path d="M12 20h9"/>
                                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-xl font-semibold text-black dark:text-white tracking-tight">Répondre à la discussion</h3>
                                <p class="text-sm text-black/60 dark:text-white/60">Partagez vos idées et contribuez à la conversation</p>
                            </div>
                        </div>

                        <ModernMessageForm :thread-id="thread.id" />
                    </div>
                </div>

                <div class="mt-12 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link
                        :href="route('forums.categories.show', { category: category.id })"
                        class="inline-flex items-center gap-2 text-black/70 dark:text-white/70 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:-translate-x-1 duration-300">
                            <path d="M5 12h14"/>
                            <path d="m5 12 6-6"/>
                            <path d="m5 12 6 6"/>
                        </svg>
                        Retour à {{ category.name }}
                    </Link>

                    <div class="flex items-center gap-3">
                        <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z"/>
                            </svg>
                            Favoris
                        </button>

                        <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                <polyline points="16,6 12,2 8,6"/>
                                <line x1="12" x2="12" y1="2" y2="15"/>
                            </svg>
                            Partager
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </SiteLayout>
</template>

<script lang="ts" setup>
import { Head, Link } from '@inertiajs/vue3';
import ModernMessageForm from '@/components/form/ModernMessageForm.vue';
import SiteLayout from '@/layouts/SiteLayout.vue';

const props = defineProps<{
    category: {
        id: number;
        name: string;
    };
    thread: {
        id: number;
        title: string;
        created_at: string;
        user?: {
            name: string;
        };
        messages?: Array<{
            id: number;
            content: string;
            created_at: string;
            user?: {
                name: string;
            };
        }>;
    };
}>();

// Utility functions
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        return 'Hier à ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
        return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
        return date.toLocaleDateString('fr-FR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

const getMessagePosition = (index: number) => {
    const total = props.thread.messages?.length || 0;
    if (index === 0) return 'Premier message';
    if (index === total - 1) return 'Dernier message';
    return `Message #${index + 1}`;
};
</script>

<style scoped>
/* Custom animations for message items */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.space-y-6 > div {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
}

/* Line clamp utility */
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Prose styling for message content */
.prose {
    line-height: 1.7;
}

.prose p {
    margin-bottom: 1rem;
}

.prose p:last-child {
    margin-bottom: 0;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

/* Smooth transitions for all interactive elements */
* {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
}
</style>
