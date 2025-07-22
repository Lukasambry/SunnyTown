<template>
    <Head title="Forum" />

    <SiteLayout :auth="$page.props.auth">
        <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a]">
            <div class="absolute inset-0 before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-repeat before:bg-[length:80px] before:opacity-[0.03] before:mix-blend-overlay before:content-['']"></div>

            <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div class="relative mb-12 rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-lg">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>
                    <div class="relative p-8 sm:p-12">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400/20 to-orange-600/20 border border-orange-400/30 flex items-center justify-center backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle h-6 w-6 text-orange-500">
                                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                                </svg>
                            </div>
                            <div>
                                <h1 class="text-4xl sm:text-5xl font-semibold tracking-tighter text-black dark:text-white">
                                    Forum
                                    <span class="bg-gradient-to-r from-black to-black/70 dark:from-white dark:to-white/70 bg-clip-text text-transparent">Community</span>
                                </h1>
                                <div class="h-0.5 w-20 bg-orange-400/70 mt-3"></div>
                            </div>
                        </div>
                        <p class="text-base sm:text-lg text-black/70 dark:text-white/70 max-w-2xl tracking-tight">
                            Rejoignez notre communauté et participez aux discussions sur SunnyTown, les nouvelles fonctionnalités et bien plus encore.
                        </p>
                    </div>
                </div>

                <div class="space-y-8">
                    <div
                        v-for="(category, categoryIndex) in categories"
                        :key="category.id"
                        :data-category="category.name"
                        class="group relative rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl"
                        @mouseenter="trackCategoryHover(category.name)"
                    >
                        <div class="relative p-6 sm:p-8 border-b border-black/5 dark:border-white/5">
                            <div class="absolute inset-0 bg-gradient-to-br from-black/[0.02] via-transparent to-black/[0.02] dark:from-white/[0.02] dark:to-white/[0.02]"></div>
                            <div class="relative flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400/10 to-orange-600/10 border border-orange-400/20 flex items-center justify-center">
                                        <div class="w-4 h-4 bg-orange-400 rounded-sm"></div>
                                    </div>
                                    <h2 class="text-2xl sm:text-3xl font-semibold tracking-tighter text-black dark:text-white">
                                        {{ category.name }}
                                    </h2>
                                </div>
                                <Link
                                    :href="route('forums.categories.show', { category: category.id })"
                                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group"
                                    @click="trackCategoryViewAllClick(category.name)"
                                >
                                    Voir tous les threads
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right transition-transform group-hover:translate-x-1">
                                        <path d="M5 12h14"/>
                                        <path d="m12 5 7 7-7 7"/>
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        <div class="p-6 sm:p-8">
                            <div class="space-y-4 mb-6">
                                <div
                                    v-for="(thread, threadIndex) in category.threads"
                                    :key="thread.id"
                                    :data-thread="thread.title"
                                    :data-thread-id="thread.id"
                                    class="group/thread relative p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] hover:border-black/10 dark:hover:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all duration-300"
                                    @mouseenter="trackThreadHover(thread.title, category.name)"
                                >
                                    <div class="flex items-center justify-between">
                                        <Link
                                            :href="route('forums.threads.show', { category: category.id, thread: thread.id })"
                                            class="flex-1 text-base sm:text-lg font-medium text-black dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 tracking-tight"
                                            @click="trackThreadClick(thread.title, category.name, threadIndex + 1)"
                                        >
                                            {{ thread.title }}
                                        </Link>
                                        <div class="flex items-center gap-3 ml-4">
                                            <div class="flex items-center gap-2">
                                                <div class="w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
                                                <span class="text-xs font-medium text-black/60 dark:text-white/60 tracking-tight">
                                                    par {{ thread.user.name }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="!category.threads || category.threads.length === 0" class="text-center py-8">
                                    <div class="w-16 h-16 mx-auto rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-plus h-6 w-6 text-black/40 dark:text-white/40">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                            <path d="M12 7v6"/>
                                            <path d="M9 10h6"/>
                                        </svg>
                                    </div>
                                    <p class="text-sm text-black/60 dark:text-white/60">Aucun thread dans cette catégorie</p>
                                </div>
                            </div>

                            <div class="pt-4 border-t border-black/5 dark:border-white/5">
                                <div class="rounded-xl p-1 border border-black/20 dark:border-white/20 hover:border-black/30 dark:hover:border-white/30 transition-all duration-300 w-fit">
                                    <Link
                                        :href="route('forums.threads.create', { category: category.id })"
                                        class="inline-flex items-center gap-2 px-5 py-2.5 bg-black/95 dark:bg-white/95 text-white dark:text-black rounded-lg font-medium text-sm hover:bg-black dark:hover:bg-white transition-all duration-300 group tracking-tight"
                                        @click="trackNewThreadClick(category.name)"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus">
                                            <path d="M5 12h14"/>
                                            <path d="M12 5v14"/>
                                        </svg>
                                        Nouveau thread
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right transition-transform group-hover:translate-x-1">
                                            <path d="M5 12h14"/>
                                            <path d="m12 5 7 7-7 7"/>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        v-for="(stat, index) in stats"
                        :key="index"
                        :data-stat="stat.label"
                        class="relative p-6 rounded-xl backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20 transition-all duration-300"
                        :style="{ 'animation-delay': `${index * 0.1}s` }"
                        @mouseenter="trackStatHover(stat.label, stat.value)"
                    >
                        <div class="absolute inset-0 bg-gradient-to-br from-black/[0.02] via-transparent to-black/[0.02] dark:from-white/[0.02] dark:to-white/[0.02] rounded-xl"></div>
                        <div class="relative">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-8 h-8 rounded-lg bg-orange-400/20 border border-orange-400/30 flex items-center justify-center">
                                    <component :is="stat.icon" class="h-4 w-4 text-orange-500" />
                                </div>
                                <h3 class="font-semibold text-black dark:text-white text-lg tracking-tight">{{ stat.value }}</h3>
                            </div>
                            <p class="text-sm text-black/60 dark:text-white/60">{{ stat.label }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </SiteLayout>
</template>

<script lang="ts" setup>
import { Head, Link } from '@inertiajs/vue3';
import { computed, onMounted, onUnmounted } from 'vue';
import SiteLayout from '@/layouts/SiteLayout.vue';
import { useMatomo } from '@/composables/useMatomo';


const props = defineProps<{
    categories: Array<{
        id: number;
        name: string;
        threads: Array<{
            id: number;
            title: string;
            user: { name: string };
        }>;
    }>;
}>();

const matomo = useMatomo();

let pageStartTime: number;
let categoryInteractions: Record<string, number> = {};
let threadInteractions: Record<string, number> = {};
let scrollDepth = 0;

const stats = computed(() => {
    const totalThreads = props.categories.reduce((acc, cat) => acc + (cat.threads?.length || 0), 0);
    const totalCategories = props.categories.length;
    const activeUsers = new Set(
        props.categories.flatMap(cat => cat.threads?.map(thread => thread.user.name) || [])
    ).size;

    return [
        {
            value: totalCategories.toString(),
            label: 'Catégories actives',
            icon: 'FolderIcon'
        },
        {
            value: totalThreads.toString(),
            label: 'Discussions en cours',
            icon: 'MessageSquareIcon'
        },
        {
            value: activeUsers.toString(),
            label: 'Membres actifs',
            icon: 'UsersIcon'
        }
    ];
});

// Fonctions de tracking

const trackCategoryHover = (categoryName: string) => {
    categoryInteractions[categoryName] = (categoryInteractions[categoryName] || 0) + 1;
    
    if (categoryInteractions[categoryName] === 1) {
        matomo.trackEvent('Forum', 'Category_Hover', categoryName);
    }
};

const trackCategoryViewAllClick = (categoryName: string) => {
    matomo.trackEvent('Forum', 'Category_View_All', categoryName);
    matomo.trackNavigation(`forum_category_${categoryName.toLowerCase().replace(/\s+/g, '_')}`);
    matomo.trackUserAction('category_explore', 'forum', categoryName);
};

const trackThreadHover = (threadTitle: string, categoryName: string) => {
    const threadKey = `${categoryName}:${threadTitle}`;
    threadInteractions[threadKey] = (threadInteractions[threadKey] || 0) + 1;
    
    if (threadInteractions[threadKey] === 1) {
        matomo.trackEvent('Forum', 'Thread_Hover', `${categoryName}_${threadTitle}`);
    }
};

const trackThreadClick = (threadTitle: string, categoryName: string, position: number) => {
    matomo.trackEvent('Forum', 'Thread_Click', threadTitle);
    matomo.trackEvent('Forum', 'Thread_Position_Click', `${categoryName}_position_${position}`);
    matomo.trackNavigation(`forum_thread_${threadTitle.toLowerCase().replace(/\s+/g, '_')}`);
    matomo.trackUserAction('thread_view', 'forum', `${categoryName}:${threadTitle}`);
    
    if (position <= 3) {
        matomo.trackEvent('Forum', 'High_Visibility_Thread_Click', threadTitle);
    }
};

const trackNewThreadClick = (categoryName: string) => {
    matomo.trackEvent('Forum', 'New_Thread_Click', categoryName);
    matomo.trackCTA('forum_new_thread', matomo.MATOMO_GOALS?.FORUM_THREAD_CREATE);
    matomo.trackNavigation(`forum_new_thread_${categoryName.toLowerCase().replace(/\s+/g, '_')}`);
    matomo.trackUserAction('thread_create_intent', 'forum', categoryName);
};

const trackStatHover = (statLabel: string, statValue: string) => {
    matomo.trackEvent('Forum', 'Stat_Hover', `${statLabel}_${statValue}`);
    matomo.trackEngagement('stats_interest', statLabel);
};

const trackScrollBehavior = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (docHeight > 0) {
        const currentDepth = Math.round((scrollTop / docHeight) * 100);
        
        if (currentDepth > scrollDepth && currentDepth % 25 === 0) {
            scrollDepth = currentDepth;
            matomo.trackEvent('Forum', 'Scroll_Depth', 'forum_index', scrollDepth);
            
            if (scrollDepth >= 75) {
                matomo.trackEvent('Forum', 'Deep_Scroll', 'forum_index');
            }
        }
    }
};

const trackCategoryEngagement = () => {
    const sortedCategories = Object.entries(categoryInteractions)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);
    
    sortedCategories.forEach(([category, interactions], index) => {
        matomo.trackEvent('Forum', 'Popular_Category', `${category}_rank_${index + 1}`, interactions);
    });
};

const trackUserBehaviorPattern = () => {
    const totalInteractions = Object.values(categoryInteractions).reduce((a, b) => a + b, 0) +
                             Object.values(threadInteractions).reduce((a, b) => a + b, 0);
    
    if (totalInteractions === 0) {
        matomo.trackEvent('Forum', 'User_Behavior', 'passive_browsing');
    } else if (totalInteractions < 5) {
        matomo.trackEvent('Forum', 'User_Behavior', 'light_engagement');
    } else if (totalInteractions < 15) {
        matomo.trackEvent('Forum', 'User_Behavior', 'moderate_engagement');
    } else {
        matomo.trackEvent('Forum', 'User_Behavior', 'high_engagement');
    }
    
    matomo.trackEvent('Forum', 'Total_Interactions', 'forum_index', totalInteractions);
};

onMounted(() => {
    pageStartTime = Date.now();
    
    matomo.trackForumPage('index');
    
    matomo.setCustomVariable(1, 'Page Type', 'Forum', 'page');
    matomo.setCustomVariable(2, 'Forum Section', 'Index', 'page');
    matomo.setCustomVariable(3, 'Categories Count', props.categories.length.toString(), 'page');
    matomo.setCustomVariable(4, 'Total Threads', stats.value[1].value, 'page');
    
    const totalThreads = parseInt(stats.value[1].value);
    const totalCategories = parseInt(stats.value[0].value);
    const activeUsers = parseInt(stats.value[2].value);
    
    matomo.trackEvent('Forum', 'Page_Stats', 'categories', totalCategories);
    matomo.trackEvent('Forum', 'Page_Stats', 'threads', totalThreads);
    matomo.trackEvent('Forum', 'Page_Stats', 'active_users', activeUsers);
    
    const avgThreadsPerCategory = totalCategories > 0 ? Math.round(totalThreads / totalCategories) : 0;
    matomo.trackEvent('Forum', 'Forum_Health', 'avg_threads_per_category', avgThreadsPerCategory);
    
    const engagementInterval = setInterval(() => {
        const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
        if (timeOnPage > 0 && timeOnPage % 30 === 0) {
            matomo.trackEngagement('time_on_forum_index', timeOnPage);
            trackCategoryEngagement();
        }
    }, 30000);
    
    window.addEventListener('scroll', trackScrollBehavior);
    
    const emptyCategories = props.categories.filter(cat => !cat.threads || cat.threads.length === 0);
    if (emptyCategories.length > 0) {
        matomo.trackEvent('Forum', 'Empty_Categories', 'count', emptyCategories.length);
        emptyCategories.forEach(cat => {
            matomo.trackEvent('Forum', 'Empty_Category', cat.name);
        });
    }
    
    const categoryThreadCounts = props.categories.map(cat => ({
        name: cat.name,
        threadCount: cat.threads?.length || 0
    })).sort((a, b) => b.threadCount - a.threadCount);
    
    if (categoryThreadCounts.length > 0) {
        const mostActiveCategory = categoryThreadCounts[0];
        matomo.trackEvent('Forum', 'Most_Active_Category', mostActiveCategory.name, mostActiveCategory.threadCount);
    }
    
    onUnmounted(() => {
        clearInterval(engagementInterval);
        window.removeEventListener('scroll', trackScrollBehavior);
        
        const sessionTime = Math.floor((Date.now() - pageStartTime) / 1000);
        matomo.trackEvent('Forum', 'Session_Duration', 'forum_index', sessionTime);
        
        trackUserBehaviorPattern();
        
        matomo.trackEvent('Forum', 'Exit_Metrics', 'scroll_depth', scrollDepth);
        matomo.trackEvent('Forum', 'Exit_Metrics', 'category_interactions', Object.keys(categoryInteractions).length);
        matomo.trackEvent('Forum', 'Exit_Metrics', 'thread_interactions', Object.keys(threadInteractions).length);
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

.group:hover .group-hover\:translate-x-1 {
    transform: translateX(4px);
}

.space-y-8 > * {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
}

.space-y-8 > *:nth-child(1) { animation-delay: 0.1s; }
.space-y-8 > *:nth-child(2) { animation-delay: 0.2s; }
.space-y-8 > *:nth-child(3) { animation-delay: 0.3s; }
.space-y-8 > *:nth-child(4) { animation-delay: 0.4s; }
.space-y-8 > *:nth-child(5) { animation-delay: 0.5s; }
</style>