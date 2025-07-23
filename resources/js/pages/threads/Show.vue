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
                        @click="trackBackToCategoryClick"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:-translate-x-1 duration-300">
                            <path d="M5 12h14"/>
                            <path d="m5 12 6-6"/>
                            <path d="m5 12 6 6"/>
                        </svg>
                        Retour à {{ category.name }}
                    </Link>

                    <div class="flex items-center gap-3">
                        <button 
                            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group"
                            @click="trackFavoriteClick"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z"/>
                            </svg>
                            Favoris
                        </button>

                        <button 
                            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group"
                            @click="trackShareClick"
                        >
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
                            @click="trackBreadcrumbClick('forum_index')"
                        >
                            Forum
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/40 dark:text-white/40">
                            <path d="m9 18 6-6-6-6"/>
                        </svg>
                        <Link
                            :href="route('forums.categories.show', { category: category.id })"
                            class="text-black/60 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 font-medium"
                            @click="trackBreadcrumbClick('category_view')"
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
                            <div class="flex-shrink-0" @click="trackAuthorAvatarClick(thread.user?.name || 'Unknown')">
                                <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300">
                                    {{ thread.user?.name.charAt(0).toUpperCase() || 'U' }}
                                </div>
                            </div>

                            <div class="flex-1 min-w-0">
                                <h1 class="text-3xl sm:text-4xl font-semibold tracking-tighter text-black dark:text-white mb-4 line-clamp-3">
                                    {{ thread.title }}
                                </h1>

                                <div class="flex flex-wrap items-center gap-4 text-sm">
                                    <div class="flex items-center gap-2">
                                        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span class="text-black/70 dark:text-white/70 font-medium">
                                            Créé par <span 
                                                class="text-black dark:text-white cursor-pointer hover:text-orange-500 transition-colors"
                                                @click="trackAuthorNameClick(thread.user?.name || 'Unknown')"
                                            >{{ thread.user?.name || 'Utilisateur' }}</span>
                                        </span>
                                    </div>

                                    <div class="w-px h-4 bg-black/20 dark:bg-white/20"></div>

                                    <div class="flex items-center gap-2" @click="trackThreadDateClick">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/50 dark:text-white/50">
                                            <path d="M8 2v4"/>
                                            <path d="M16 2v4"/>
                                            <rect width="18" height="18" x="3" y="4" rx="2"/>
                                            <path d="M3 10h18"/>
                                        </svg>
                                        <time class="text-black/60 dark:text-white/60 font-medium cursor-pointer hover:text-orange-500 transition-colors">
                                            {{ formatDate(thread.created_at) }}
                                        </time>
                                    </div>

                                    <div class="w-px h-4 bg-black/20 dark:bg-white/20"></div>

                                    <div class="flex items-center gap-2" @click="trackMessagesCountClick">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/50 dark:text-white/50">
                                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                                        </svg>
                                        <span class="text-black/60 dark:text-white/60 font-medium cursor-pointer hover:text-orange-500 transition-colors">
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
                        :data-message-id="message.id"
                        :data-message-author="message.user?.name"
                        class="group relative rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/15 dark:hover:border-white/15 transition-all duration-300"
                        :style="{ 'animation-delay': `${index * 0.1}s` }"
                        @mouseenter="trackMessageHover(message.id, message.user?.name || 'Unknown', index + 1)"
                    >
                        <div class="absolute inset-0 bg-gradient-to-br from-black/[0.01] via-transparent to-black/[0.01] dark:from-white/[0.01] dark:to-white/[0.01] group-hover:from-black/[0.02] dark:group-hover:from-white/[0.02] transition-all duration-300"></div>

                        <div class="relative p-6 sm:p-8">
                            <div class="flex items-start gap-4">
                                <div class="flex-shrink-0" @click="trackMessageAuthorAvatarClick(message.user?.name || 'Unknown', index + 1)">
                                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-lg shadow-md cursor-pointer hover:scale-105 transition-transform duration-300">
                                        {{ message.user?.name.charAt(0).toUpperCase() || 'U' }}
                                    </div>
                                </div>

                                <div class="flex-1 min-w-0">
                                    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                                        <div class="flex items-center gap-3">
                                            <h3 
                                                class="text-lg font-semibold text-black dark:text-white tracking-tight cursor-pointer hover:text-orange-500 transition-colors"
                                                @click="trackMessageAuthorNameClick(message.user?.name || 'Unknown', index + 1)"
                                            >
                                                {{ message.user?.name || 'Utilisateur' }}
                                            </h3>

                                            <div class="flex items-center gap-2">
                                                <div class="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                                <span class="text-xs text-black/60 dark:text-white/60 font-medium">
                                                    {{ getMessagePosition(index) }}
                                                </span>
                                            </div>
                                        </div>

                                        <time 
                                            class="text-xs text-black/60 dark:text-white/60 font-medium bg-black/5 dark:bg-white/5 px-3 py-1 rounded-lg cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                                            @click="trackMessageDateClick(message.id, formatMessageDate(message.created_at))"
                                        >
                                            {{ formatMessageDate(message.created_at) }}
                                        </time>
                                    </div>

                                    <div class="prose prose-sm max-w-none" @click="trackMessageContentClick(message.id)">
                                        <div class="text-black dark:text-white leading-relaxed whitespace-pre-line">
                                            {{ message.content }}
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-3 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                                        <button 
                                            class="inline-flex items-center gap-2 text-xs text-black/60 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 group/action"
                                            @click="trackMessageAction('react', message.id, message.user?.name || 'Unknown')"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover/action:scale-110 duration-300">
                                                <path d="M7 10v12"/>
                                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
                                            </svg>
                                            Réagir
                                        </button>

                                        <button 
                                            class="inline-flex items-center gap-2 text-xs text-black/60 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 group/action"
                                            @click="trackMessageAction('reply', message.id, message.user?.name || 'Unknown')"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover/action:scale-110 duration-300">
                                                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                                            </svg>
                                            Répondre
                                        </button>

                                        <button 
                                            class="inline-flex items-center gap-2 text-xs text-black/60 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 group/action"
                                            @click="trackMessageAction('share', message.id, message.user?.name || 'Unknown')"
                                        >
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
                        <div class="flex items-center gap-4 mb-6" @click="trackReplyFormHeaderClick">
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

                        <ModernMessageForm :thread-id="thread.id" @form-submit="trackReplyFormSubmit" />
                    </div>
                </div>

                <div class="mt-12 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link
                        :href="route('forums.categories.show', { category: category.id })"
                        class="inline-flex items-center gap-2 text-black/70 dark:text-white/70 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 group"
                        @click="trackFooterBackToCategoryClick"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:-translate-x-1 duration-300">
                            <path d="M5 12h14"/>
                            <path d="m5 12 6-6"/>
                            <path d="m5 12 6 6"/>
                        </svg>
                        Retour à {{ category.name }}
                    </Link>

                    <div class="flex items-center gap-3">
                        <button 
                            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group"
                            @click="trackFooterFavoriteClick"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z"/>
                            </svg>
                            Favoris
                        </button>

                        <button 
                            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group"
                            @click="trackFooterShareClick"
                        >
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
import { onMounted, onUnmounted } from 'vue';
import ModernMessageForm from '@/components/form/ModernMessageForm.vue';
import SiteLayout from '@/layouts/SiteLayout.vue';
import { useMatomo } from '@/composables/useMatomo';

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

const matomo = useMatomo();

let pageStartTime: number;
let readingStartTime: number;
const messageInteractions: Record<string, number> = {};
const authorInteractions: Record<string, number> = {};
let scrollDepth = 0;
let readingProgress = 0;
const messagesViewed = new Set<number>();

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


const trackBackToCategoryClick = () => {
    matomo.trackEvent('Thread', 'Back_To_Category_Click', props.category.name);
    matomo.trackNavigation(`category_${props.category.name.toLowerCase().replace(/\s+/g, '_')}_from_thread`);
};

const trackFavoriteClick = () => {
    matomo.trackEvent('Thread', 'Favorite_Click', props.thread.title);
    matomo.trackUserAction('thread_favorite', 'forum', `${props.category.name}:${props.thread.title}`);
};

const trackShareClick = () => {
    matomo.trackEvent('Thread', 'Share_Click', props.thread.title);
    matomo.trackUserAction('thread_share', 'forum', `${props.category.name}:${props.thread.title}`);
    matomo.trackEngagement('content_viral', 'thread_share');
};

const trackBreadcrumbClick = (action: string) => {
    matomo.trackEvent('Thread', 'Breadcrumb_Click', action);
    matomo.trackNavigation(`breadcrumb_${action}_from_thread`);
};

const trackAuthorAvatarClick = (authorName: string) => {
    matomo.trackEvent('Thread', 'Author_Avatar_Click', authorName);
    matomo.trackUserAction('author_interest', 'thread', authorName);
    authorInteractions[authorName] = (authorInteractions[authorName] || 0) + 1;
};

const trackAuthorNameClick = (authorName: string) => {
    matomo.trackEvent('Thread', 'Author_Name_Click', authorName);
    matomo.trackNavigation(`author_profile_${authorName.toLowerCase().replace(/\s+/g, '_')}`);
    authorInteractions[authorName] = (authorInteractions[authorName] || 0) + 1;
};

const trackThreadDateClick = () => {
    matomo.trackEvent('Thread', 'Thread_Date_Click', props.thread.title);
    matomo.trackUserAction('thread_metadata_interest', 'thread');
};

const trackMessagesCountClick = () => {
    matomo.trackEvent('Thread', 'Messages_Count_Click', props.thread.title);
    matomo.trackUserAction('thread_stats_interest', 'thread');
};

const trackMessageHover = (messageId: number, authorName: string, position: number) => {
    const key = `message_${messageId}`;
    messageInteractions[key] = (messageInteractions[key] || 0) + 1;
    
    if (messageInteractions[key] === 1) {
        matomo.trackEvent('Thread', 'Message_Hover', `${authorName}_position_${position}`);
        messagesViewed.add(messageId);
        
        const totalMessages = props.thread.messages?.length || 0;
        const progress = Math.round((position / totalMessages) * 100);
        if (progress > readingProgress) {
            readingProgress = progress;
            if (progress % 25 === 0) {
                matomo.trackEvent('Thread', 'Reading_Progress', props.thread.title, progress);
            }
        }
    }
};

const trackMessageAuthorAvatarClick = (authorName: string, position: number) => {
    matomo.trackEvent('Thread', 'Message_Author_Avatar_Click', `${authorName}_position_${position}`);
    matomo.trackUserAction('message_author_interest', 'thread', authorName);
    authorInteractions[authorName] = (authorInteractions[authorName] || 0) + 1;
};

const trackMessageAuthorNameClick = (authorName: string, position: number) => {
    matomo.trackEvent('Thread', 'Message_Author_Name_Click', `${authorName}_position_${position}`);
    matomo.trackNavigation(`author_profile_${authorName.toLowerCase().replace(/\s+/g, '_')}_from_message`);
    authorInteractions[authorName] = (authorInteractions[authorName] || 0) + 1;
};

const trackMessageDateClick = (messageId: number, date: string) => {
    matomo.trackEvent('Thread', 'Message_Date_Click', `message_${messageId}_${date}`);
    matomo.trackUserAction('message_metadata_interest', 'thread');
};

const trackMessageContentClick = (messageId: number) => {
    matomo.trackEvent('Thread', 'Message_Content_Click', `message_${messageId}`);
    matomo.trackUserAction('message_content_interest', 'thread');
};

const trackMessageAction = (action: 'react' | 'reply' | 'share', messageId: number, authorName: string) => {
    matomo.trackEvent('Thread', 'Message_Action', `${action}_message_${messageId}`);
    matomo.trackEvent('Thread', 'Message_Action_Type', action);
    matomo.trackUserAction(`message_${action}`, 'thread', `${authorName}_message_${messageId}`);
    
    if (action === 'reply') {
        matomo.trackCTA('forum_reply', matomo.MATOMO_GOALS?.FORUM_MESSAGE_CREATE);
    } else if (action === 'share') {
        matomo.trackEngagement('content_viral', `message_${action}`);
    }
};

const trackReplyFormHeaderClick = () => {
    matomo.trackEvent('Thread', 'Reply_Form_Header_Click', props.thread.title);
    matomo.trackUserAction('reply_form_interest', 'thread');
};

const trackReplyFormSubmit = () => {
    matomo.trackEvent('Thread', 'Reply_Form_Submit', props.thread.title);
    matomo.trackFormSubmission('message_create', true);
    matomo.trackUserAction('message_created', 'thread', `${props.category.name}:${props.thread.title}`);
};

const trackFooterBackToCategoryClick = () => {
    matomo.trackEvent('Thread', 'Footer_Back_To_Category_Click', props.category.name);
    matomo.trackNavigation(`category_${props.category.name.toLowerCase().replace(/\s+/g, '_')}_from_thread_footer`);
};

const trackFooterFavoriteClick = () => {
    matomo.trackEvent('Thread', 'Footer_Favorite_Click', props.thread.title);
    matomo.trackUserAction('thread_favorite_footer', 'forum');
};

const trackFooterShareClick = () => {
    matomo.trackEvent('Thread', 'Footer_Share_Click', props.thread.title);
    matomo.trackUserAction('thread_share_footer', 'forum');
};

const trackScrollBehavior = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (docHeight > 0) {
        const currentDepth = Math.round((scrollTop / docHeight) * 100);
        
        if (currentDepth > scrollDepth && currentDepth % 25 === 0) {
            scrollDepth = currentDepth;
            matomo.trackEvent('Thread', 'Scroll_Depth', props.thread.title, scrollDepth);
            
            if (scrollDepth >= 75) {
                matomo.trackEvent('Thread', 'Deep_Read', props.thread.title);
            }
        }
    }
};

const trackReadingMetrics = () => {
    const readingTime = Math.floor((Date.now() - readingStartTime) / 1000);
    const messagesCount = props.thread.messages?.length || 0;
    const messagesViewedCount = messagesViewed.size;
    const readingCompletionRate = messagesCount > 0 ? Math.round((messagesViewedCount / messagesCount) * 100) : 0;
    
    matomo.trackEvent('Thread', 'Reading_Time', props.thread.title, readingTime);
    matomo.trackEvent('Thread', 'Messages_Viewed', props.thread.title, messagesViewedCount);
    matomo.trackEvent('Thread', 'Reading_Completion', props.thread.title, readingCompletionRate);
    
    if (messagesViewedCount > 0) {
        const avgTimePerMessage = readingTime / messagesViewedCount;
        matomo.trackEvent('Thread', 'Avg_Time_Per_Message', props.thread.title, Math.round(avgTimePerMessage));
    }
};

const trackEngagementPatterns = () => {
    const totalInteractions = Object.values(messageInteractions).reduce((a, b) => a + b, 0) +
                             Object.values(authorInteractions).reduce((a, b) => a + b, 0);
    
    let engagementLevel = 'passive';
    if (totalInteractions > 20) engagementLevel = 'high';
    else if (totalInteractions > 10) engagementLevel = 'moderate';
    else if (totalInteractions > 3) engagementLevel = 'light';
    
    matomo.trackEvent('Thread', 'Engagement_Level', engagementLevel);
    matomo.trackEvent('Thread', 'Total_Interactions', props.thread.title, totalInteractions);
    
    const mostEngagedAuthor = Object.entries(authorInteractions)
        .sort(([,a], [,b]) => b - a)[0];
    
    if (mostEngagedAuthor) {
        matomo.trackEvent('Thread', 'Most_Engaging_Author', mostEngagedAuthor[0], mostEngagedAuthor[1]);
    }
};

onMounted(() => {
    pageStartTime = Date.now();
    readingStartTime = Date.now();
    
    matomo.trackThreadsPage('show', props.thread.title);
    
    matomo.setCustomVariable(1, 'Page Type', 'Thread', 'page');
    matomo.setCustomVariable(2, 'Thread Category', props.category.name, 'page');
    matomo.setCustomVariable(3, 'Thread Author', props.thread.user?.name || 'Unknown', 'page');
    matomo.setCustomVariable(4, 'Messages Count', (props.thread.messages?.length || 0).toString(), 'page');
    
    const messagesCount = props.thread.messages?.length || 0;
    matomo.trackEvent('Thread', 'Thread_View', props.thread.title);
    matomo.trackEvent('Thread', 'Category_Thread_View', props.category.name);
    matomo.trackEvent('Thread', 'Messages_Count_View', props.thread.title, messagesCount);
    
    const threadAge = Math.floor((Date.now() - new Date(props.thread.created_at).getTime()) / (1000 * 60 * 60 * 24));
    matomo.trackEvent('Thread', 'Thread_Age_Days', props.thread.title, threadAge);
    
    if (threadAge < 1) matomo.trackEvent('Thread', 'Fresh_Thread_View', props.thread.title);
    else if (threadAge < 7) matomo.trackEvent('Thread', 'Recent_Thread_View', props.thread.title);
    else matomo.trackEvent('Thread', 'Old_Thread_View', props.thread.title);
    
    window.addEventListener('scroll', trackScrollBehavior);
    
    const engagementInterval = setInterval(() => {
        const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
        if (timeOnPage > 0 && timeOnPage % 30 === 0) {
            matomo.trackEngagement('time_on_thread', timeOnPage);
            trackReadingMetrics();
            trackEngagementPatterns();
        }
    }, 30000);
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                matomo.trackEvent('Thread', 'Reply_Form_Viewed', props.thread.title);
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    const replyForm = document.querySelector('.relative.rounded-2xl.overflow-hidden.backdrop-blur-sm');
    if (replyForm) {
        observer.observe(replyForm);
    }
    
    onUnmounted(() => {
        clearInterval(engagementInterval);
        window.removeEventListener('scroll', trackScrollBehavior);
        observer?.disconnect();
        
        const sessionTime = Math.floor((Date.now() - pageStartTime) / 1000);
        matomo.trackEvent('Thread', 'Session_Duration', props.thread.title, sessionTime);
        
        trackReadingMetrics();
        trackEngagementPatterns();
        
        matomo.trackEvent('Thread', 'Exit_Metrics', 'scroll_depth', scrollDepth);
        matomo.trackEvent('Thread', 'Exit_Metrics', 'reading_progress', readingProgress);
        matomo.trackEvent('Thread', 'Exit_Metrics', 'messages_viewed', messagesViewed.size);
        
        const totalInteractions = Object.values(messageInteractions).reduce((a, b) => a + b, 0) +
                                 Object.values(authorInteractions).reduce((a, b) => a + b, 0);
        
        if (totalInteractions === 0 && sessionTime < 30) {
            matomo.trackEvent('Thread', 'Session_Quality', 'bounce');
        } else if (readingProgress >= 75 || totalInteractions > 10) {
            matomo.trackEvent('Thread', 'Session_Quality', 'highly_engaged');
        } else if (readingProgress >= 25 || totalInteractions > 3) {
            matomo.trackEvent('Thread', 'Session_Quality', 'engaged');
        } else {
            matomo.trackEvent('Thread', 'Session_Quality', 'low_engagement');
        }
    });
});
</script>

<style scoped>
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

.prose {
    line-height: 1.7;
}

.prose p {
    margin-bottom: 1rem;
}

.prose p:last-child {
    margin-bottom: 0;
}

.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

* {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

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