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
                        @click="handleThreadClick(thread)"
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
                @click="handleNewThreadClick"
            >
                + Nouveau thread
            </Link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Link, usePage } from '@inertiajs/vue3';
import { onMounted, onUnmounted } from 'vue';
import { useMatomo } from '../../composables/useMatomo';

const props = defineProps<{
    category: { id: number; name: string };
    threads: Array<{
        id: number;
        title: string;
        user: { name: string };
        created_at: string;
    }>;
}>();

const page = usePage();
const matomo = useMatomo();

let pageLoadTime: number;
let threadViewCount = 0;
let timeOnPage = 0;

onMounted(() => {
    pageLoadTime = Date.now();
    
    initializePageTracking();
    
    setupEngagementTracking();
    
    matomo.enableHeartBeatTimer(15);
});

onUnmounted(() => {
    timeOnPage = Math.round((Date.now() - pageLoadTime) / 1000);
    
    trackPageEngagement();
    
    matomo.disableHeartBeatTimer();
});

const initializePageTracking = () => {
    const userStatus = page.props.auth?.user ? 'Authenticated' : 'Guest';
    
    matomo.trackForumPage('category', props.category.name);
    
    matomo.setCustomVariable(3, 'Category ID', props.category.id.toString(), 'page');
    matomo.setCustomVariable(4, 'Thread Count', props.threads.length.toString(), 'page');
    matomo.setCustomVariable(5, 'Category Name', props.category.name, 'page');
    
    matomo.initPageTracking('Forum_Category', userStatus);
    
    matomo.trackEvent('Forum', 'Category_View', props.category.name);
    matomo.trackEvent('Forum', 'Thread_Count', props.category.name, props.threads.length);
    
    if (page.props.auth?.user) {
        matomo.setUserId(page.props.auth.user.id.toString());
        matomo.trackEvent('User', 'Forum_Access', 'Category_Page');
    }
    
    console.log('🔍 Forum Category Page Tracking initialized', {
        category: props.category.name,
        threadCount: props.threads.length,
        userStatus
    });
};

const setupEngagementTracking = () => {
    let maxScroll = 0;
    const handleScroll = () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            if (scrollPercent >= 25 && scrollPercent < 50) {
                matomo.trackEvent('Engagement', 'Scroll', 'forum_category_25%');
            } else if (scrollPercent >= 50 && scrollPercent < 75) {
                matomo.trackEvent('Engagement', 'Scroll', 'forum_category_50%');
            } else if (scrollPercent >= 75 && scrollPercent < 100) {
                matomo.trackEvent('Engagement', 'Scroll', 'forum_category_75%');
            } else if (scrollPercent >= 100) {
                matomo.trackEvent('Engagement', 'Scroll', 'forum_category_100%');
            }
        }
    };
    
    const handleMouseMove = () => {
        matomo.trackEvent('Engagement', 'Mouse_Activity', 'forum_category');
    };
    
    let isPageFocused = true;
    const handleVisibilityChange = () => {
        if (document.hidden) {
            isPageFocused = false;
            matomo.trackEvent('Engagement', 'Page_Blur', 'forum_category');
        } else {
            isPageFocused = true;
            matomo.trackEvent('Engagement', 'Page_Focus', 'forum_category');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true, once: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
};

const handleThreadClick = (thread: any) => {
    threadViewCount++;
    
    matomo.trackEvent('Forum', 'Thread_Click', thread.title);
    matomo.trackEvent('Forum', 'Thread_Navigation', `${props.category.name}_to_${thread.id}`);
    
    matomo.trackEngagement('Thread_Interest', thread.title);
    
    matomo.setCustomVariable(6, 'Last Thread Clicked', thread.id.toString(), 'visit');
    
    console.log('🔍 Thread clicked', {
        threadId: thread.id,
        threadTitle: thread.title,
        category: props.category.name,
        clickCount: threadViewCount
    });
};

const handleNewThreadClick = () => {
    matomo.trackEvent('Forum', 'New_Thread_Click', props.category.name);
    matomo.trackEvent('CTA', 'Create_Thread', props.category.name);
    
    if (page.props.auth?.user) {
        matomo.trackEvent('User', 'Content_Creation_Intent', 'forum_thread');
        matomo.trackEngagement('Creation_Intent', 'thread');
    } else {
        matomo.trackEvent('Guest', 'Auth_Required_Action', 'create_thread');
    }
    
    console.log('🔍 New thread button clicked', {
        category: props.category.name,
        userAuthenticated: !!page.props.auth?.user
    });
};

const trackPageEngagement = () => {
    matomo.trackEvent('Engagement', 'Time_On_Page', 'forum_category', timeOnPage);
    matomo.trackEvent('Engagement', 'Thread_Views', props.category.name, threadViewCount);
    
    const engagementRate = props.threads.length > 0 ? (threadViewCount / props.threads.length) * 100 : 0;
    matomo.trackEvent('Engagement', 'Engagement_Rate', 'forum_category', Math.round(engagementRate));
    
    let sessionType = 'Unknown';
    if (timeOnPage < 10) {
        sessionType = 'Bounce';
    } else if (timeOnPage < 60) {
        sessionType = 'Quick_Browse';
    } else if (timeOnPage < 300) {
        sessionType = 'Normal_Browse';
    } else {
        sessionType = 'Deep_Engagement';
    }
    
    matomo.trackEvent('Session', 'Type', sessionType);
    matomo.trackEvent('Session', 'Forum_Category_Session', `${props.category.name}_${sessionType}`);
    
    console.log('🔍 Page engagement tracked', {
        timeOnPage,
        threadViewCount,
        engagementRate,
        sessionType
    });
};

const trackError = (error: Error, context: string) => {
    matomo.trackError('Forum_Category_Error', context, error.message);
    console.error('🔍 Forum error tracked', { error, context });
};

defineExpose({
    trackError
});
</script>