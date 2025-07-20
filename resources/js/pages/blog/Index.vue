<script lang="ts" setup>
import { Head } from '@inertiajs/vue3';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useMatomo } from '../../composables/useMatomo';

interface BlogPost {
    id: number;
    title: string;
    author: string;
    published_at: string;
    content: string;
}

const props = defineProps<{
    blogPosts?: BlogPost[];
}>();

const matomo = useMatomo();
const startTime = ref<number>(0);
const articlesViewed = ref<Set<number>>(new Set());
const readingTimes = ref<Record<number, number>>({});

const sortedBlogPosts = computed(() => {
    if (!props.blogPosts) return [];
    return [...props.blogPosts].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
});

const trackArticleView = (post: BlogPost) => {
    if (!articlesViewed.value.has(post.id)) {
        articlesViewed.value.add(post.id);
        matomo.trackEvent('Blog', 'Article_View', post.title);
        matomo.trackUserAction('View', 'blog_article', post.title);
        
        readingTimes.value[post.id] = Date.now();
        
        const wordCount = post.content.split(' ').length;
        matomo.trackEvent('Blog', 'Article_Length', 'words', wordCount);
        
        const readingTimeEstimate = Math.ceil(wordCount / 200); // 200 words per minute
        matomo.trackEvent('Blog', 'Estimated_Reading_Time', post.title, readingTimeEstimate);
    }
};

const trackAuthorClick = (author: string) => {
    matomo.trackEvent('Blog', 'Author_Click', author);
    matomo.trackUserAction('Author_View', 'blog', author);
};

const trackArticleEngagement = (post: BlogPost, engagementType: string) => {
    matomo.trackEvent('Blog', 'Article_Engagement', `${post.title}_${engagementType}`);
    matomo.trackEngagement('Article_Interaction', `${engagementType}_${post.id}`);
};

const trackReadingProgress = (postId: number) => {
    if (readingTimes.value[postId]) {
        const readingTime = Math.round((Date.now() - readingTimes.value[postId]) / 1000);
        if (readingTime > 10) {
            matomo.trackEvent('Blog', 'Reading_Time', 'seconds', readingTime);
            matomo.trackEngagement('Reading_Duration', readingTime);
        }
    }
};

const trackScrollBehavior = () => {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent >= 25) {
        matomo.trackEvent('Blog', 'Scroll_Depth', '25%');
    }
    if (scrollPercent >= 50) {
        matomo.trackEvent('Blog', 'Scroll_Depth', '50%');
    }
    if (scrollPercent >= 75) {
        matomo.trackEvent('Blog', 'Scroll_Depth', '75%');
    }
    if (scrollPercent >= 100) {
        matomo.trackEvent('Blog', 'Scroll_Depth', '100%');
    }
};

let scrollDepthTracked = { 25: false, 50: false, 75: false, 100: false };
const handleScroll = () => {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent >= 25 && !scrollDepthTracked[25]) {
        scrollDepthTracked[25] = true;
        matomo.trackEvent('Blog', 'Scroll_Depth', '25%');
    }
    if (scrollPercent >= 50 && !scrollDepthTracked[50]) {
        scrollDepthTracked[50] = true;
        matomo.trackEvent('Blog', 'Scroll_Depth', '50%');
    }
    if (scrollPercent >= 75 && !scrollDepthTracked[75]) {
        scrollDepthTracked[75] = true;
        matomo.trackEvent('Blog', 'Scroll_Depth', '75%');
    }
    if (scrollPercent >= 100 && !scrollDepthTracked[100]) {
        scrollDepthTracked[100] = true;
        matomo.trackEvent('Blog', 'Scroll_Depth', '100%');
    }
};

let observer: IntersectionObserver | null = null;

const setupArticleTracking = () => {
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const postId = parseInt(entry.target.getAttribute('data-post-id') || '0');
                const post = sortedBlogPosts.value.find(p => p.id === postId);
                if (post) {
                    trackArticleView(post);
                }
            }
        });
    }, {
        threshold: 0.5, 
        rootMargin: '0px'
    });
    
    setTimeout(() => {
        document.querySelectorAll('[data-post-id]').forEach(el => {
            if (observer) observer.observe(el);
        });
    }, 100);
};

onMounted(() => {
    startTime.value = Date.now();
    
    matomo.trackBlogPage('index');
    matomo.initPageTracking('Blog', 'User');
    
    const referrer = document.referrer;
    if (referrer) {
        const referrerUrl = new URL(referrer);
        if (referrerUrl.pathname === '/') {
            matomo.trackEvent('Blog', 'Entry_Point', 'landing_page');
        } else if (referrerUrl.pathname.includes('dashboard')) {
            matomo.trackEvent('Blog', 'Entry_Point', 'dashboard');
        } else if (referrerUrl.pathname.includes('forum')) {
            matomo.trackEvent('Blog', 'Entry_Point', 'forum');
        } else {
            matomo.trackEvent('Blog', 'Entry_Point', 'other');
        }
    }
    
    if (props.blogPosts) {
        matomo.trackEvent('Blog', 'Articles_Available', 'count', props.blogPosts.length);
        
        const authors = new Set(props.blogPosts.map(post => post.author));
        matomo.trackEvent('Blog', 'Authors_Count', 'unique', authors.size);
        
        const latestPost = props.blogPosts[0];
        if (latestPost) {
            const daysSinceLatest = Math.floor((Date.now() - new Date(latestPost.published_at).getTime()) / (1000 * 60 * 60 * 24));
            matomo.trackEvent('Blog', 'Latest_Post_Age', 'days', daysSinceLatest);
        }
    } else {
        matomo.trackEvent('Blog', 'No_Articles', 'empty_state');
    }
    
    setupArticleTracking();
    
    window.addEventListener('scroll', handleScroll);
    
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        matomo.trackEvent('Technical', 'Page_Load_Time', 'blog_index', Math.round(loadTime));
    });
    
    matomo.trackEvent('Blog', 'Session_Start', 'index');
});

onUnmounted(() => {
    articlesViewed.value.forEach(postId => {
        trackReadingProgress(postId);
    });
    
    const timeSpent = Math.round((Date.now() - startTime.value) / 1000);
    matomo.trackEvent('Blog', 'Time_Spent', 'index', timeSpent);
    matomo.trackEngagement('Session_Duration', timeSpent);
    
    matomo.trackEvent('Blog', 'Articles_Viewed', 'count', articlesViewed.value.size);
    matomo.trackEvent('Blog', 'Session_End', 'index');
    
    // Clean up
    if (observer) {
        observer.disconnect();
    }
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <Head title="Blog" />

    <template>
        <div class="pixel-border pixel-border-stone mb-6 px-4 py-2">
            <h2 class="font-mono text-xl leading-tight font-semibold">Blog</h2>
        </div>
    </template>

    <div v-if="!blogPosts || blogPosts.length <= 0" class="py-12">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="pixel-border pixel-border-dirt">
                <div class="pixel-border pixel-border-dark-dirt p-6">
                    <p class="font-mono text-white">Aucun article trouvé.</p>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="py-12 pb-12">
        <div class="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
            <article 
                v-for="post in sortedBlogPosts" 
                :key="post.id" 
                :data-post-id="post.id"
                class="pixel-border pixel-border-dirt dark:pixel-border-dark-dirt"
                @mouseenter="trackArticleEngagement(post, 'hover')"
                @click="trackArticleEngagement(post, 'click')"
            >
                <div class="pixel-border pixel-border-dark-dirt p-6 dark:!bg-transparent dark:!shadow-none">
                    <header class="mb-4">
                        <div class="flex flex-col gap-2 md:flex-row md:items-center">
                            <div class="pixel-border pixel-border-gold inline-block w-full px-4 py-2 md:max-w-[70%]">
                                <h2 
                                    class="overflow-hidden font-mono text-xl font-bold text-black cursor-pointer hover:underline" 
                                    :title="post.title"
                                    @click="trackArticleEngagement(post, 'title_click')"
                                >
                                    {{ post.title }}
                                </h2>
                            </div>

                            <div class="pixel-border pixel-border-stone inline-block px-3 py-1 max-sm:mt-2 md:ml-4">
                                <p class="font-mono text-sm text-black">
                                    Par 
                                    <span 
                                        class="cursor-pointer hover:underline font-semibold"
                                        @click="trackAuthorClick(post.author)"
                                    >
                                        {{ post.author }}
                                    </span> 
                                    - {{ new Date(post.published_at).toLocaleDateString('fr-FR') }}
                                </p>
                            </div>
                        </div>
                    </header>

                    <div class="pixel-border pixel-border-dirt">
                        <div 
                            class="bg-white/90 p-4 text-black cursor-pointer"
                            @click="trackArticleEngagement(post, 'content_click')"
                        >
                            <div
                                class="prose prose-sm prose-headings:text-black prose-p:text-black prose-strong:text-black prose-em:text-black max-w-none font-mono text-black"
                                v-html="post.content"
                            ></div>
                        </div>
                    </div>

                    <footer class="mt-4 flex justify-end">
                        <div class="pixel-border pixel-border-stone px-3 py-1">
                            <span class="font-mono text-xs text-black">Article #{{ post.id }}</span>
                        </div>
                    </footer>
                </div>
            </article>
        </div>
    </div>
</template>

<style scoped>
.prose :where(h1, h2, h3, h4, h5, h6):not(:where([class~='not-prose'] *)) {
    font-family: '04b03', monospace;
    font-weight: bold;
}

.prose :where(p):not(:where([class~='not-prose'] *)) {
    font-family: '04b03', monospace;
    line-height: 1.6;
}

.prose :where(strong):not(:where([class~='not-prose'] *)) {
    font-weight: bold;
}

.prose :where(em):not(:where([class~='not-prose'] *)) {
    font-style: italic;
}

.pixel-border:hover {
    transform: translateY(-1px);
    transition: transform 0.1s ease-in-out;
}

@keyframes pixel-glow {
    0%,
    100% {
        filter: brightness(1);
    }
    50% {
        filter: brightness(1.1);
    }
}

.pixel-border-gold:hover {
    animation: pixel-glow 0.5s ease-in-out;
}
</style>