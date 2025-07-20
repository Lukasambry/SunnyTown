<template>
    <div class="space-y-6 p-6">
        <div class="pixel-border pixel-border-stone mb-6 px-4 py-2">
            <h1 class="font-mono text-3xl text-black">Forums</h1>
        </div>

        <div v-for="category in categories" :key="category.id" class="pixel-border pixel-border-stone dark:pixel-border-dark-dirt space-y-4 p-4">
            <div class="flex items-center justify-between">
                <h2 class="font-mono text-2xl text-black">{{ category.name }}</h2>
                <Link 
                    :href="route('forums.categories.show', { category: category.id })" 
                    class="font-mono text-sm text-black underline"
                    @click="trackCategoryAllThreadsClick(category)"
                >
                    Voir tous les threads
                </Link>
            </div>

            <ul class="space-y-2">
                <li v-for="thread in category.threads" :key="thread.id" class="flex items-center justify-between">
                    <Link
                        :href="route('forums.threads.show', { category: category.id, thread: thread.id })"
                        class="font-mono text-black hover:underline"
                        @click="trackThreadClick(thread, category)"
                    >
                        {{ thread.title }}
                    </Link>
                    <span class="font-mono text-xs text-gray-500" @click="trackUserProfileClick(thread.user)"> 
                        par {{ thread.user.name }} 
                    </span>
                </li>
            </ul>

            <div class="mt-4">
                <Link
                    :href="route('forums.threads.create', { category: category.id })"
                    class="pixel-border pixel-border-gold inline-block px-3 py-1 font-mono text-sm text-black"
                    @click="trackNewThreadClick(category)"
                >
                    + Nouveau thread
                </Link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Link } from '@inertiajs/vue3';
import { onMounted, onUnmounted } from 'vue';
import { useMatomo } from '../../composables/useMatomo';

interface Thread {
    id: number;
    title: string;
    user: { name: string };
}

interface Category {
    id: number;
    name: string;
    threads: Thread[];
}

defineProps<{
    categories: Category[];
}>();

const matomo = useMatomo();
let startTime: number;
let categoryViewTimes: Record<string, number> = {};

const trackCategoryView = (category: Category) => {
    matomo.trackEvent('Forum', 'Category_View', category.name);
    matomo.trackUserAction('View', 'forum_category', category.name);
    categoryViewTimes[category.name] = Date.now();
};

const trackThreadClick = (thread: Thread, category: Category) => {
    matomo.trackEvent('Forum', 'Thread_Click', thread.title);
    matomo.trackNavigation(`thread_${thread.id}`);
    matomo.trackUserAction('Click', 'forum_thread', `${category.name}_${thread.title}`);
    
    // Track thread engagement metrics
    matomo.trackEvent('Forum', 'Thread_Engagement', 'from_index');
};

const trackCategoryAllThreadsClick = (category: Category) => {
    matomo.trackEvent('Forum', 'Category_All_Threads', category.name);
    matomo.trackNavigation(`category_${category.id}`);
    matomo.trackUserAction('View_All', 'forum_category', category.name);
};

const trackNewThreadClick = (category: Category) => {
    matomo.trackEvent('Forum', 'New_Thread_Click', category.name);
    matomo.trackCTA('forum_new_thread');
    matomo.trackUserAction('Create', 'forum_thread', category.name);
};

const trackUserProfileClick = (user: { name: string }) => {
    matomo.trackEvent('Forum', 'User_Profile_Click', user.name);
    matomo.trackUserAction('Profile_View', 'forum', user.name);
};

const trackTimeSpent = () => {
    if (startTime) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        matomo.trackEvent('Forum', 'Time_Spent', 'index', timeSpent);
        matomo.trackEngagement('Time_On_Page', timeSpent);
        
        Object.entries(categoryViewTimes).forEach(([categoryName, viewTime]) => {
            const categoryTime = Math.round((Date.now() - viewTime) / 1000);
            if (categoryTime > 2) {
                matomo.trackEvent('Forum', 'Category_Time', categoryName, categoryTime);
            }
        });
    }
};

const trackScrollDepth = () => {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent >= 25) {
        matomo.trackEvent('Forum', 'Scroll_Depth', '25%');
    }
    if (scrollPercent >= 50) {
        matomo.trackEvent('Forum', 'Scroll_Depth', '50%');
    }
    if (scrollPercent >= 75) {
        matomo.trackEvent('Forum', 'Scroll_Depth', '75%');
    }
    if (scrollPercent >= 100) {
        matomo.trackEvent('Forum', 'Scroll_Depth', '100%');
    }
};

let scrollDepthTracked = { 25: false, 50: false, 75: false, 100: false };
const handleScroll = () => {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent >= 25 && !scrollDepthTracked[25]) {
        scrollDepthTracked[25] = true;
        matomo.trackEvent('Forum', 'Scroll_Depth', '25%');
    }
    if (scrollPercent >= 50 && !scrollDepthTracked[50]) {
        scrollDepthTracked[50] = true;
        matomo.trackEvent('Forum', 'Scroll_Depth', '50%');
    }
    if (scrollPercent >= 75 && !scrollDepthTracked[75]) {
        scrollDepthTracked[75] = true;
        matomo.trackEvent('Forum', 'Scroll_Depth', '75%');
    }
    if (scrollPercent >= 100 && !scrollDepthTracked[100]) {
        scrollDepthTracked[100] = true;
        matomo.trackEvent('Forum', 'Scroll_Depth', '100%');
    }
};

onMounted(() => {
    startTime = Date.now();
    
    matomo.trackForumPage('index');
    matomo.initPageTracking('Forum', 'User');
    
    const referrer = document.referrer;
    if (referrer) {
        const referrerUrl = new URL(referrer);
        if (referrerUrl.pathname === '/') {
            matomo.trackEvent('Forum', 'Entry_Point', 'landing_page');
        } else if (referrerUrl.pathname.includes('dashboard')) {
            matomo.trackEvent('Forum', 'Entry_Point', 'dashboard');
        } else {
            matomo.trackEvent('Forum', 'Entry_Point', 'other');
        }
    }
    
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        matomo.trackEvent('Technical', 'Page_Load_Time', 'forum_index', Math.round(loadTime));
    });
    
    window.addEventListener('scroll', handleScroll);
    
    matomo.trackEvent('Forum', 'Session_Start', 'index');
    
    const categories = document.querySelectorAll('[class*="pixel-border-stone"]').length - 1; // Minus header
    matomo.trackEvent('Forum', 'Categories_Displayed', 'count', categories);
});

onUnmounted(() => {
    trackTimeSpent();
    matomo.trackEvent('Forum', 'Session_End', 'index');
    
    window.removeEventListener('scroll', handleScroll);
});
</script>