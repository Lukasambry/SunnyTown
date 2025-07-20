<template>
    <Head title="Blog" />

    <SiteLayout :auth="$page.props.auth">
        <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a]">
            <div class="absolute inset-0 before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-repeat before:bg-[length:80px] before:opacity-[0.03] before:mix-blend-overlay before:content-['']"></div>

            <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div class="relative mb-12 rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-lg">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>
                    <div class="relative p-8 sm:p-12">
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div class="flex items-center gap-4">
                                <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400/20 to-orange-600/20 border border-orange-400/30 flex items-center justify-center backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h1 class="text-4xl sm:text-5xl font-semibold tracking-tighter text-black dark:text-white">
                                        Blog
                                    </h1>
                                    <div class="h-0.5 w-20 bg-orange-400/70 mt-3"></div>
                                </div>
                            </div>

                            <div class="flex items-center gap-6">
                                <div class="text-center">
                                    <div class="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tighter">{{ blogPosts?.length || 0 }}</div>
                                    <div class="text-xs text-black/60 dark:text-white/60 tracking-tight">{{ (blogPosts?.length || 0) > 1 ? 'Articles' : 'Article' }}</div>
                                </div>
                                <div class="w-px h-12 bg-black/10 dark:bg-white/10"></div>
                                <div class="text-center">
                                    <div class="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tighter">{{ uniqueAuthors }}</div>
                                    <div class="text-xs text-black/60 dark:text-white/60 tracking-tight">{{ uniqueAuthors > 1 ? 'Auteurs' : 'Auteur' }}</div>
                                </div>
                            </div>
                        </div>

                        <p class="text-base sm:text-lg text-black/70 dark:text-white/70 max-w-2xl tracking-tight mt-6">
                            Découvrez nos derniers articles sur SunnyTown et nos nouvelles fonctionnalités !
                        </p>
                    </div>
                </div>

                <div v-if="canCreatePost" class="mb-8 flex justify-end">
                    <div class="rounded-xl p-1 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300">
                        <Link
                            :href="route('blog.create')"
                            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium text-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-300 group tracking-tight shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:rotate-90 duration-300">
                                <path d="M5 12h14"/>
                                <path d="M12 5v14"/>
                            </svg>
                            Nouvel article
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 duration-300">
                                <path d="M5 12h14"/>
                                <path d="m12 5 7 7-7 7"/>
                            </svg>
                        </Link>
                    </div>
                </div>

                <div v-if="!blogPosts || blogPosts.length === 0" class="text-center py-16">
                    <div class="relative max-w-md mx-auto">
                        <div class="w-24 h-24 mx-auto rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/40 dark:text-white/40">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-black dark:text-white mb-2 tracking-tight">Aucun article pour le moment</h3>
                        <p class="text-black/60 dark:text-white/60 mb-6">Les premiers articles arrivent bientôt. Restez connectés !</p>

                        <div v-if="canCreatePost" class="rounded-xl p-1 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300 w-fit mx-auto">
                            <Link
                                :href="route('blog.create')"
                                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M5 12h14"/>
                                    <path d="M12 5v14"/>
                                </svg>
                                Écrire le premier article
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 duration-300">
                                    <path d="M5 12h14"/>
                                    <path d="m12 5 7 7-7 7"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                <div v-else class="space-y-8">
                    <article
                        v-for="(post, index) in sortedBlogPosts"
                        :key="post.id"
                        class="group relative rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
                        :style="{ 'animation-delay': `${index * 0.1}s` }"
                    >
                        <div class="absolute inset-0 bg-gradient-to-br from-black/[0.01] via-transparent to-orange/[0.01] dark:from-white/[0.01] dark:to-orange/[0.01] group-hover:from-orange-500/[0.02] group-hover:to-orange-600/[0.02] transition-all duration-300"></div>

                        <div class="relative">
                            <div class="p-8 sm:p-12 !pb-0">
                                <div class="flex items-start justify-between gap-6 mb-6">
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center gap-3 mb-4">
                                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                                {{ post.author.charAt(0).toUpperCase() }}
                                            </div>
                                            <div>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-sm font-medium text-black dark:text-white">{{ post.author }}</span>
                                                    <div class="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                                    <time class="text-xs text-black/60 dark:text-white/60 font-medium">
                                                        {{ formatDate(post.published_at) }}
                                                    </time>
                                                </div>
                                                <div class="flex items-center gap-2 mt-1">
                                                    <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                                    <span class="text-xs text-black/60 dark:text-white/60">Publié</span>
                                                </div>
                                            </div>
                                        </div>

                                        <h2 class="text-2xl sm:text-3xl font-semibold text-black dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-300 tracking-tight line-clamp-2 mb-4">
                                            {{ post.title }}
                                        </h2>
                                    </div>

                                    <div class="flex-shrink-0 px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                                        <span class="text-xs font-medium text-black/60 dark:text-white/60">#{{ post.id }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="px-8 sm:px-12 pb-8">
                                <div class="relative rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 overflow-hidden">
                                    <div class="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/50 dark:from-black/50 dark:to-black/50"></div>
                                    <div class="relative">
                                        <div
                                            class="prose prose-sm max-w-none text-black dark:text-white line-clamp-4"
                                            v-html="getContentPreview(post.content)"
                                        ></div>

                                        <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/5 dark:from-white/5 to-transparent pointer-events-none"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="px-8 sm:px-12 pb-8">
                                <div class="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
                                    <div class="flex items-center gap-4">
                                        <div class="flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                            <span>{{ getReadingTime(post.content) }} min de lecture</span>
                                        </div>

                                        <div class="flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                                            </svg>
                                            <span>{{ getWordCount(post.content) }} mots</span>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-3">
                                        <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group/action">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover/action:scale-110 duration-300">
                                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z"/>
                                            </svg>
                                            Sauvegarder
                                        </button>

                                        <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group/action">
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
                    </article>
                </div>

                <!--
                <div v-if="blogPosts && blogPosts.length > 0" class="mt-16 text-center">
                    <button class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-base font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:rotate-180 duration-300">
                            <path d="M12 5v14"/>
                            <path d="m19 12-7 7-7-7"/>
                        </svg>
                        Charger plus d'articles
                    </button>
                </div>
                -->
            </div>
        </div>
    </SiteLayout>
</template>

<script lang="ts" setup>
import { Head, Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import SiteLayout from '@/layouts/SiteLayout.vue';

interface BlogPost {
    id: number;
    title: string;
    author: string;
    published_at: string;
    content: string;
}

const props = defineProps<{
    blogPosts?: BlogPost[];
    canCreatePost?: boolean;
}>();

const sortedBlogPosts = computed(() => {
    if (!props.blogPosts) return [];
    return [...props.blogPosts].sort((a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
});

const uniqueAuthors = computed(() => {
    if (!props.blogPosts) return 0;
    const authors = new Set(props.blogPosts.map(post => post.author));
    return authors.size;
});

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        return 'Hier';
    } else if (diffDays < 7) {
        return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    } else {
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

const getContentPreview = (content: string) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > 200 ? textContent.substring(0, 200) + '...' : textContent;
};

const getReadingTime = (content: string) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordsPerMinute = 200;
    const wordCount = textContent.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
};

const getWordCount = (content: string) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.split(/\s+/).filter(word => word.length > 0).length;
};
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

.space-y-8 > article {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.group:hover .group-hover\:scale-\[1\.01\] {
    transform: scale(1.01);
}

.group:hover .group-hover\:rotate-180 {
    transform: rotate(180deg);
}

.prose {
    line-height: 1.6;
}

.prose p {
    margin-bottom: 0.75rem;
}

.prose p:last-child {
    margin-bottom: 0;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.prose strong {
    font-weight: 600;
}

.prose em {
    font-style: italic;
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