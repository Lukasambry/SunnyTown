<template>
    <SiteLayout :auth="$page.props.auth">
        <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a] -mt-12">
            <section class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
                <div class="absolute inset-0 opacity-10">
                    <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cpath%20d%3D%22M0%2050a50%2050%200%200%200%20100%200%2050%2050%200%200%200-100%200%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fsvg%3E')] bg-[length:40px_40px] bg-repeat"></div>
                </div>

                <div class="relative z-10 mx-auto max-w-6xl px-4 text-center">
                    <div class="mb-12 space-y-8">
                        <div class="space-y-4">
                            <div
                                class="inline-block rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400 backdrop-blur-sm"
                                @click="trackVersionBadgeClick"
                            >
                                ✨ Nouvelle version 2.0 disponible
                            </div>

                            <h1 class="text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl">
                                <span class="mb-2 block text-white">Construisez votre</span>
                                <span class="block bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                    SunnyTown
                                </span>
                            </h1>

                            <p class="mx-auto max-w-3xl text-xl leading-relaxed text-white/70 sm:text-2xl">
                                Une expérience de construction de ville révolutionnaire.
                                <span class="font-semibold text-orange-400" @click="trackStatsClick('players')">{{ gameStats.total_players }}+ joueurs</span>
                                créent déjà leur monde parfait.
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-col items-center justify-center gap-6 sm:flex-row">
                        <Link
                            :href="ctaButtons.primary.url"
                            class="group relative rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
                            @click="trackPrimaryCTAClick"
                        >
                            <span class="flex items-center gap-2">
                                {{ ctaButtons.primary.text }}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="transition-transform group-hover:translate-x-1"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </span>
                        </Link>

                        <Link
                            :href="ctaButtons.secondary.url"
                            class="group rounded-2xl border-2 border-white/20 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/5"
                            @click="trackSecondaryCTAClick"
                        >
                            <span class="flex items-center gap-2">{{ ctaButtons.secondary.text }} </span>
                        </Link>
                    </div>
                </div>
            </section>

            <section class="mx-2 my-4 rounded-xl border border-black/10 bg-white py-20 sm:mx-4 sm:py-32 dark:border-white/10 dark:bg-[#0a0a0a]">
                <div class="mx-auto max-w-6xl px-4">
                    <div class="mb-16 space-y-4 text-center">
                        <h2 class="text-4xl font-semibold tracking-tighter text-black sm:text-5xl dark:text-white">
                            Fonctionnalités
                            <span class="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">principales</span>
                        </h2>
                        <p class="mx-auto max-w-2xl text-base text-black/70 sm:text-lg dark:text-white/70">
                            Découvrez tout ce que SunnyTown a à offrir pour créer votre ville parfaite.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div
                            v-for="(feature, index) in gameFeatures"
                            :key="index"
                            :data-feature="feature.title"
                            class="group relative rounded-xl border border-black/10 bg-gradient-to-br from-black/[0.02] to-black/[0.05] p-6 transition-all duration-300 hover:border-orange-400/30 dark:border-white/10 dark:from-white/[0.02] dark:to-white/[0.05]"
                            @mouseenter="trackFeatureHover(feature.title, index + 1)"
                            @click="trackFeatureClick(feature.title, index + 1)"
                        >
                            <div class="flex items-start gap-4">
                                <div class="text-4xl">{{ feature.icon }}</div>
                                <div class="flex-1">
                                    <h3 class="mb-2 text-xl font-semibold text-black dark:text-white">{{ feature.title }}</h3>
                                    <p class="mb-3 text-black/70 dark:text-white/70">{{ feature.description }}</p>
                                    <div class="text-sm font-medium text-orange-500">{{ feature.stats }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="mx-2 mb-4 rounded-xl bg-white py-20 sm:mx-4 sm:py-32 dark:bg-[#0a0a0a]">
                <div class="mx-auto max-w-6xl px-4">
                    <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        <div>
                            <div class="mb-8 flex items-center justify-between">
                                <h2 class="text-3xl font-semibold tracking-tighter text-black dark:text-white">Blog</h2>
                                <Link
                                    :href="route('blog.index')"
                                    class="text-sm font-medium text-orange-500 transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                                    @click="trackSectionNavigationClick('blog', 'view_all')"
                                >
                                    Voir tous les articles
                                </Link>
                            </div>

                            <div class="space-y-6">
                                <article 
                                    v-for="(post, index) in blogPosts" 
                                    :key="post.id" 
                                    :data-blog-post="post.title"
                                    class="group cursor-pointer"
                                    @mouseenter="trackBlogPostHover(post.title, post.author, index + 1)"
                                    @click="trackBlogPostClick(post.title, post.author, index + 1)"
                                >
                                    <div
                                        class="rounded-lg border border-black/10 p-4 transition-all duration-300 hover:border-orange-400/30 dark:border-white/10"
                                    >
                                        <div class="flex items-start gap-4">
                                            <div
                                                class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400/20 to-orange-600/20 text-xl"
                                            >
                                                📝
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <h3
                                                    class="line-clamp-2 font-semibold text-black transition-colors group-hover:text-orange-500 dark:text-white dark:group-hover:text-orange-400"
                                                >
                                                    {{ post.title }}
                                                </h3>
                                                <p class="mt-1 line-clamp-2 text-sm text-black/70 dark:text-white/70">
                                                    {{ post.excerpt }}
                                                </p>
                                                <div class="mt-2 flex items-center gap-3 text-xs text-black/60 dark:text-white/60">
                                                    <span>{{ post.author }}</span>
                                                    <span>•</span>
                                                    <span>{{ post.published_at }}</span>
                                                    <span>•</span>
                                                    <span>{{ post.read_time }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>

                        <div>
                            <div class="mb-8 flex items-center justify-between">
                                <h2 class="text-3xl font-semibold tracking-tighter text-black dark:text-white">Forum</h2>
                                <Link
                                    :href="route('forums.index')"
                                    class="text-sm font-medium text-orange-500 transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                                    @click="trackSectionNavigationClick('forum', 'view_all')"
                                >
                                    Voir toutes les discussions
                                </Link>
                            </div>

                            <div class="space-y-4">
                                <div 
                                    v-for="(thread, index) in forumThreads" 
                                    :key="thread.id" 
                                    :data-forum-thread="thread.title"
                                    class="group"
                                    @mouseenter="trackForumThreadHover(thread.title, thread.category, index + 1)"
                                >
                                    <Link
                                        :href="thread.url"
                                        class="block rounded-lg border border-black/10 p-4 transition-all duration-300 hover:border-orange-400/30 dark:border-white/10"
                                        @click="trackForumThreadClick(thread.title, thread.category, index + 1)"
                                    >
                                        <div class="flex items-start gap-3">
                                            <div
                                                class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 text-sm"
                                            >
                                                💬
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <h4
                                                    class="line-clamp-1 font-medium text-black transition-colors group-hover:text-orange-500 dark:text-white dark:group-hover:text-orange-400"
                                                >
                                                    {{ thread.title }}
                                                </h4>
                                                <div class="mt-1 flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
                                                    <span>{{ thread.author }}</span>
                                                    <span>•</span>
                                                    <span 
                                                        class="rounded bg-black/5 px-1.5 py-0.5 text-xs dark:bg-white/5"
                                                        @click.stop="trackCategoryTagClick(thread.category)"
                                                    >
                                                        {{ thread.category }}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{{ thread.created_at }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                class="mx-2 mb-4 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 py-20 sm:mx-4 sm:py-32 dark:border-gray-700/30 dark:from-gray-900/20 dark:to-gray-800/20"
            >
                <div class="mx-auto max-w-6xl px-4">
                    <div class="mb-16 space-y-4 text-center">
                        <h2 class="text-3xl font-semibold tracking-tighter text-black sm:text-4xl dark:text-white">
                            Ce que disent nos
                            <span class="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">joueurs</span>
                        </h2>
                        <p class="mx-auto max-w-2xl text-black/70 dark:text-white/70">Découvrez pourquoi des milliers de joueurs adorent SunnyTown</p>
                    </div>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div
                            v-for="(testimonial, index) in playerTestimonials"
                            :key="index"
                            :data-testimonial="testimonial.name"
                            class="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-orange-300 dark:border-gray-700/30 dark:bg-black/30 dark:hover:border-orange-600/50"
                            @mouseenter="trackTestimonialHover(testimonial.name, testimonial.level, index + 1)"
                            @click="trackTestimonialClick(testimonial.name, testimonial.rating, index + 1)"
                        >
                            <div class="mb-4 flex items-center gap-3">
                                <div
                                    class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400/20 to-orange-600/20 text-xl"
                                >
                                    {{ testimonial.avatar }}
                                </div>
                                <div>
                                    <div class="font-semibold text-black dark:text-white">{{ testimonial.name }}</div>
                                    <div class="text-sm text-black/60 dark:text-white/60">Niveau {{ testimonial.level }}</div>
                                </div>
                            </div>

                            <div class="mb-3 flex items-center gap-1">
                                <span v-for="star in testimonial.rating" :key="star" class="text-sm text-yellow-400">⭐</span>
                            </div>

                            <p class="text-black/70 italic dark:text-white/70">"{{ testimonial.comment }}"</p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                class="relative mx-2 mb-4 overflow-hidden rounded-xl bg-[#0a0a0a] py-20 before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-[length:80px] before:bg-repeat before:opacity-[0.45] before:mix-blend-hard-light before:content-[''] sm:mx-4 sm:py-32"
            >
                <div class="absolute inset-0 bg-gradient-to-br from-black/20 via-zinc-900/20 to-black/20"></div>

                <div class="relative z-10 mx-auto max-w-4xl px-4 text-center">
                    <div class="space-y-8">
                        <div class="space-y-4">
                            <h2 class="text-4xl font-semibold tracking-tighter text-white sm:text-5xl">
                                Prêt à construire votre
                                <span class="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">ville de rêve</span>
                                ?
                            </h2>
                            <p class="mx-auto max-w-2xl text-lg text-white/70">
                                Rejoignez des milliers de joueurs et commencez votre aventure SunnyTown dès aujourd'hui. C'est gratuit !
                            </p>
                        </div>

                        <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <div class="rounded-xl border border-white/30 p-1 transition-all duration-300 hover:border-white/50">
                                <Link
                                    :href="ctaButtons.primary.url"
                                    class="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white/95 px-8 text-sm font-medium tracking-tight whitespace-nowrap text-black transition-all duration-300 hover:bg-white"
                                    @click="trackBottomCTAClick('primary', 'start_playing')"
                                >
                                    🎮 Commencer à jouer
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="ml-2 transition-transform group-hover:translate-x-1"
                                    >
                                        <path d="M5 12h14" />
                                        <path d="m12 5 7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>

                            <Link
                                :href="route('forums.index')"
                                class="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/30 px-8 text-sm font-medium whitespace-nowrap text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
                                @click="trackBottomCTAClick('secondary', 'join_community')"
                            >
                                💬 Rejoindre la communauté
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section class="mx-2 mb-4 rounded-xl border border-black/10 bg-white py-16 sm:mx-4 sm:py-24 dark:border-white/10 dark:bg-[#0a0a0a]">
                <div class="mx-auto max-w-4xl px-4">
                    <div class="mb-12 space-y-4 text-center">
                        <h2 class="text-3xl font-semibold tracking-tighter text-black sm:text-4xl dark:text-white">Questions fréquentes</h2>
                        <p class="text-black/70 dark:text-white/70">Tout ce que vous devez savoir sur SunnyTown</p>
                    </div>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div class="space-y-4">
                            <div
                                class="rounded-lg border border-black/10 bg-gradient-to-br from-black/[0.02] to-black/[0.05] p-4 dark:border-white/10 dark:from-white/[0.02] dark:to-white/[0.05]"
                                @click="trackFAQClick('free_game', 1)"
                            >
                                <h3 class="mb-2 font-semibold text-black dark:text-white">📱 SunnyTown est-il gratuit ?</h3>
                                <p class="text-sm text-black/70 dark:text-white/70">
                                    Oui ! SunnyTown est entièrement gratuit avec des achats optionnels pour personnaliser votre expérience.
                                </p>
                            </div>

                            <div
                                class="rounded-lg border border-black/10 bg-gradient-to-br from-black/[0.02] to-black/[0.05] p-4 dark:border-white/10 dark:from-white/[0.02] dark:to-white/[0.05]"
                                @click="trackFAQClick('platforms', 2)"
                            >
                                <h3 class="mb-2 font-semibold text-black dark:text-white">🎮 Sur quelles plateformes ?</h3>
                                <p class="text-sm text-black/70 dark:text-white/70">
                                    Disponible sur navigateur web, avec bientôt des versions mobiles iOS et Android.
                                </p>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div
                                class="rounded-lg border border-black/10 bg-gradient-to-br from-black/[0.02] to-black/[0.05] p-4 dark:border-white/10 dark:from-white/[0.02] dark:to-white/[0.05]"
                                @click="trackFAQClick('community', 3)"
                            >
                                <h3 class="mb-2 font-semibold text-black dark:text-white">👥 Comment rejoindre la communauté ?</h3>
                                <p class="text-sm text-black/70 dark:text-white/70">
                                    Créez un compte et accédez immédiatement au forum et aux discussions avec d'autres joueurs.
                                </p>
                            </div>

                            <div
                                class="rounded-lg border border-black/10 bg-gradient-to-br from-black/[0.02] to-black/[0.05] p-4 dark:border-white/10 dark:from-white/[0.02] dark:to-white/[0.05]"
                                @click="trackFAQClick('updates', 4)"
                            >
                                <h3 class="mb-2 font-semibold text-black dark:text-white">⚡ À quelle fréquence les mises à jour ?</h3>
                                <p class="text-sm text-black/70 dark:text-white/70">
                                    Nous publions de nouvelles fonctionnalités et contenus chaque mois avec des correctifs réguliers.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </SiteLayout>
</template>

<script setup lang="ts">
import SiteLayout from '@/layouts/SiteLayout.vue';
import { Link } from '@inertiajs/vue3';
import { onMounted, onUnmounted } from 'vue';
import { useMatomo } from '@/composables/useMatomo';

defineProps({
    pageData: Object,
    gameStats: Object,
    gameFeatures: Array,
    latestNews: Array,
    blogPosts: Array,
    forumThreads: Array,
    forumCategories: Array,
    playerTestimonials: Array,
    socialLinks: Object,
    ctaButtons: Object,
});

const matomo = useMatomo();

// Variables de tracking
let pageStartTime: number;
const sectionViews: Set<string> = new Set();
let scrollDepth = 0;
const engagementMetrics: Record<string, number> = {};

// Fonctions de tracking

const trackVersionBadgeClick = () => {
    matomo.trackEvent('Home', 'Version_Badge_Click', 'v2.0');
    matomo.trackCTA('version_announcement');
};

const trackStatsClick = (statType: string) => {
    matomo.trackEvent('Home', 'Stats_Click', statType);
    matomo.trackEngagement('stats_interest', statType);
};

const trackPrimaryCTAClick = () => {
    matomo.trackEvent('Home', 'Primary_CTA_Click', 'hero_section');
    matomo.trackCTA('play_now', matomo.MATOMO_GOALS?.PLAY_NOW);
    matomo.trackNavigation('game_start_from_home');
};

const trackSecondaryCTAClick = () => {
    matomo.trackEvent('Home', 'Secondary_CTA_Click', 'hero_section');
    matomo.trackNavigation('secondary_cta_from_home');
};

const trackFeatureHover = (featureTitle: string, position: number) => {
    const key = `feature_${featureTitle}`;
    engagementMetrics[key] = (engagementMetrics[key] || 0) + 1;
    
    if (engagementMetrics[key] === 1) {
        matomo.trackEvent('Home', 'Feature_Hover', featureTitle);
        matomo.trackEvent('Home', 'Feature_Position_Hover', `position_${position}`);
    }
};

const trackFeatureClick = (featureTitle: string, position: number) => {
    matomo.trackEvent('Home', 'Feature_Click', featureTitle);
    matomo.trackEvent('Home', 'Feature_Position_Click', `position_${position}`);
    matomo.trackUserAction('feature_interest', 'home', featureTitle);
    
    if (position <= 2) {
        matomo.trackEvent('Home', 'Top_Feature_Click', featureTitle);
    }
};

const trackSectionNavigationClick = (section: string, action: string) => {
    matomo.trackEvent('Home', 'Section_Navigation', `${section}_${action}`);
    matomo.trackNavigation(`${section}_${action}_from_home`);
};

const trackBlogPostHover = (title: string, author: string, position: number) => {
    const key = `blog_${title}`;
    engagementMetrics[key] = (engagementMetrics[key] || 0) + 1;
    
    if (engagementMetrics[key] === 1) {
        matomo.trackEvent('Home', 'Blog_Post_Hover', title);
        matomo.trackEvent('Home', 'Blog_Position_Hover', `position_${position}`);
    }
};

const trackBlogPostClick = (title: string, author: string, position: number) => {
    matomo.trackEvent('Home', 'Blog_Post_Click', title);
    matomo.trackEvent('Home', 'Blog_Position_Click', `position_${position}`);
    matomo.trackEvent('Home', 'Blog_Author_Click', author);
    matomo.trackNavigation(`blog_post_${title.toLowerCase().replace(/\s+/g, '_')}_from_home`);
};

const trackForumThreadHover = (title: string, category: string, position: number) => {
    const key = `forum_${title}`;
    engagementMetrics[key] = (engagementMetrics[key] || 0) + 1;
    
    if (engagementMetrics[key] === 1) {
        matomo.trackEvent('Home', 'Forum_Thread_Hover', title);
        matomo.trackEvent('Home', 'Forum_Position_Hover', `position_${position}`);
    }
};

const trackForumThreadClick = (title: string, category: string, position: number) => {
    matomo.trackEvent('Home', 'Forum_Thread_Click', title);
    matomo.trackEvent('Home', 'Forum_Position_Click', `position_${position}`);
    matomo.trackEvent('Home', 'Forum_Category_Click', category);
    matomo.trackNavigation(`forum_thread_${title.toLowerCase().replace(/\s+/g, '_')}_from_home`);
};

const trackCategoryTagClick = (category: string) => {
    matomo.trackEvent('Home', 'Category_Tag_Click', category);
    matomo.trackNavigation(`forum_category_${category.toLowerCase().replace(/\s+/g, '_')}_from_home`);
};

const trackTestimonialHover = (name: string, level: string, position: number) => {
    const key = `testimonial_${name}`;
    engagementMetrics[key] = (engagementMetrics[key] || 0) + 1;
    
    if (engagementMetrics[key] === 1) {
        matomo.trackEvent('Home', 'Testimonial_Hover', name);
        matomo.trackEvent('Home', 'Testimonial_Position_Hover', `position_${position}`);
        matomo.trackEvent('Home', 'Player_Level_Interest', `level_${level}`);
    }
};

const trackTestimonialClick = (name: string, rating: number, position: number) => {
    matomo.trackEvent('Home', 'Testimonial_Click', name);
    matomo.trackEvent('Home', 'Testimonial_Rating_Click', `rating_${rating}`);
    matomo.trackEvent('Home', 'Testimonial_Position_Click', `position_${position}`);
    matomo.trackEngagement('social_proof', `${name}_${rating}stars`);
};

const trackBottomCTAClick = (type: 'primary' | 'secondary', action: string) => {
    matomo.trackEvent('Home', 'Bottom_CTA_Click', `${type}_${action}`);
    
    if (type === 'primary') {
        matomo.trackCTA('play_now_bottom', matomo.MATOMO_GOALS?.PLAY_NOW);
    } else {
        matomo.trackNavigation('community_from_bottom_cta');
    }
    
    // Track CTA performance by position
    matomo.trackEvent('Home', 'CTA_Performance', `bottom_section_${type}`);
};

const trackFAQClick = (faqType: string, position: number) => {
    matomo.trackEvent('Home', 'FAQ_Click', faqType);
    matomo.trackEvent('Home', 'FAQ_Position_Click', `position_${position}`);
    matomo.trackUserAction('faq_interest', 'home', faqType);
    
    const faqInteractions = (engagementMetrics[`faq_${faqType}`] || 0) + 1;
    engagementMetrics[`faq_${faqType}`] = faqInteractions;
    
    if (faqInteractions >= 3) {
        matomo.trackEvent('Home', 'Popular_FAQ', faqType);
    }
};

const trackScrollBehavior = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (docHeight > 0) {
        const currentDepth = Math.round((scrollTop / docHeight) * 100);
        
        if (currentDepth > scrollDepth && currentDepth % 25 === 0) {
            scrollDepth = currentDepth;
            matomo.trackEvent('Home', 'Scroll_Depth', 'home_page', scrollDepth);
        }
        
        // Track section views based on scroll position
        const sectionsViewed = Math.floor(currentDepth / 16.67); // Assuming ~6 sections
        const sectionNames = ['hero', 'features', 'content', 'testimonials', 'cta', 'faq'];
        
        for (let i = 0; i <= sectionsViewed && i < sectionNames.length; i++) {
            if (!sectionViews.has(sectionNames[i])) {
                sectionViews.add(sectionNames[i]);
                matomo.trackEvent('Home', 'Section_View', sectionNames[i]);
            }
        }
    }
};

const trackUserEngagementPatterns = () => {
    const totalInteractions = Object.values(engagementMetrics).reduce((a, b) => a + b, 0);
    const uniqueInteractions = Object.keys(engagementMetrics).length;
    
    let engagementLevel = 'passive';
    if (totalInteractions > 15) engagementLevel = 'high';
    else if (totalInteractions > 8) engagementLevel = 'moderate';
    else if (totalInteractions > 3) engagementLevel = 'light';
    
    matomo.trackEvent('Home', 'User_Engagement_Level', engagementLevel);
    matomo.trackEvent('Home', 'Total_Interactions', 'home_page', totalInteractions);
    matomo.trackEvent('Home', 'Unique_Elements_Interacted', 'home_page', uniqueInteractions);
    
    const mostEngagingElement = Object.entries(engagementMetrics)
        .sort(([,a], [,b]) => b - a)[0];
    
    if (mostEngagingElement) {
        matomo.trackEvent('Home', 'Most_Engaging_Element', mostEngagingElement[0], mostEngagingElement[1]);
    }
};

const trackConversionFunnel = () => {
    const funnelSteps = {
        hero_viewed: sectionViews.has('hero'),
        features_viewed: sectionViews.has('features'),
        content_viewed: sectionViews.has('content'),
        testimonials_viewed: sectionViews.has('testimonials'),
        cta_viewed: sectionViews.has('cta')
    };
    
    let funnelProgress = 0;
    Object.values(funnelSteps).forEach(viewed => {
        if (viewed) funnelProgress++;
    });
    
    const funnelPercentage = Math.round((funnelProgress / 5) * 100);
    matomo.trackEvent('Home', 'Funnel_Progress', 'home_page', funnelPercentage);
    
    if (funnelProgress > 0 && funnelProgress < 5) {
        const lastStep = Object.entries(funnelSteps).findIndex(([, viewed]) => !viewed);
        if (lastStep !== -1) {
            const stepNames = ['hero', 'features', 'content', 'testimonials', 'cta'];
            matomo.trackEvent('Home', 'Funnel_Dropoff', stepNames[lastStep]);
        }
    }
};

const trackDeviceAndPerformance = () => {
    const viewportWidth = window.innerWidth;
    let deviceCategory = 'desktop';
    if (viewportWidth < 768) deviceCategory = 'mobile';
    else if (viewportWidth < 1024) deviceCategory = 'tablet';
    
    matomo.trackEvent('Home', 'Device_Category', deviceCategory);
    matomo.trackEvent('Home', 'Viewport_Width', 'home_page', viewportWidth);
    
    if ('performance' in window && performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        if (loadTime > 0) {
            matomo.trackEvent('Home', 'Page_Load_Time', 'milliseconds', Math.round(loadTime));
            
            if (loadTime > 5000) matomo.trackEvent('Home', 'Performance', 'slow');
            else if (loadTime > 3000) matomo.trackEvent('Home', 'Performance', 'moderate');
            else matomo.trackEvent('Home', 'Performance', 'fast');
        }
    }
};

onMounted(() => {
    pageStartTime = Date.now();
    
    matomo.trackHomePage();
    
    matomo.setCustomVariable(1, 'Page Type', 'Home', 'page');
    matomo.setCustomVariable(2, 'Landing Section', 'Hero', 'page');
    matomo.setCustomVariable(3, 'User Type', 'Visitor', 'page');
    
    trackDeviceAndPerformance();
    
    sectionViews.add('hero');
    matomo.trackEvent('Home', 'Section_View', 'hero');
    
    window.addEventListener('scroll', trackScrollBehavior);
    
    const engagementInterval = setInterval(() => {
        const timeOnPage = Math.floor((Date.now() - pageStartTime) / 1000);
        if (timeOnPage > 0 && timeOnPage % 30 === 0) {
            matomo.trackEngagement('time_on_home', timeOnPage);
            trackUserEngagementPatterns();
            trackConversionFunnel();
        }
    }, 30000);
    
    // Track user activity detection
    let userActive = true;
    let inactiveTime = 0;
    
    const resetInactiveTime = () => {
        inactiveTime = 0;
        if (!userActive) {
            userActive = true;
            matomo.trackEvent('Home', 'User_Activity', 'resumed');
        }
    };
    
    const checkInactivity = setInterval(() => {
        inactiveTime++;
        if (inactiveTime >= 30 && userActive) {
            userActive = false;
            matomo.trackEvent('Home', 'User_Activity', 'inactive');
        }
    }, 1000);
    
    document.addEventListener('mousemove', resetInactiveTime);
    document.addEventListener('keypress', resetInactiveTime);
    document.addEventListener('click', resetInactiveTime);
    document.addEventListener('scroll', resetInactiveTime);
    
    onUnmounted(() => {
        clearInterval(engagementInterval);
        clearInterval(checkInactivity);
        window.removeEventListener('scroll', trackScrollBehavior);
        document.removeEventListener('mousemove', resetInactiveTime);
        document.removeEventListener('keypress', resetInactiveTime);
        document.removeEventListener('click', resetInactiveTime);
        document.removeEventListener('scroll', resetInactiveTime);
        
        const sessionTime = Math.floor((Date.now() - pageStartTime) / 1000);
        matomo.trackEvent('Home', 'Session_Duration', 'home_page', sessionTime);
        
        trackUserEngagementPatterns();
        trackConversionFunnel();
        
        matomo.trackEvent('Home', 'Exit_Metrics', 'scroll_depth', scrollDepth);
        matomo.trackEvent('Home', 'Exit_Metrics', 'sections_viewed', sectionViews.size);
        matomo.trackEvent('Home', 'Exit_Metrics', 'total_interactions', Object.values(engagementMetrics).reduce((a, b) => a + b, 0));
        
        const totalInteractions = Object.values(engagementMetrics).reduce((a, b) => a + b, 0);
        if (totalInteractions === 0 && sessionTime < 10) {
            matomo.trackEvent('Home', 'Session_Type', 'bounce');
        } else if (totalInteractions > 5 || sessionTime > 120) {
            matomo.trackEvent('Home', 'Session_Type', 'highly_engaged');
        } else if (totalInteractions > 0 || sessionTime > 30) {
            matomo.trackEvent('Home', 'Session_Type', 'engaged');
        }
    });
});
</script>

<style scoped>
.line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

@keyframes countUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>