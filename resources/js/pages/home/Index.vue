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
                                <span class="font-semibold text-orange-400">{{ gameStats.total_players }}+ joueurs</span>
                                créent déjà leur monde parfait.
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-col items-center justify-center gap-6 sm:flex-row">
                        <Link
                            :href="ctaButtons.primary.url"
                            class="group relative rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
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
                            class="group relative rounded-xl border border-black/10 bg-gradient-to-br from-black/[0.02] to-black/[0.05] p-6 transition-all duration-300 hover:border-orange-400/30 dark:border-white/10 dark:from-white/[0.02] dark:to-white/[0.05]"
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
                                >
                                    Voir tous les articles
                                </Link>
                            </div>

                            <div class="space-y-6">
                                <article v-for="post in blogPosts" :key="post.id" class="group cursor-pointer">
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
                                >
                                    Voir toutes les discussions
                                </Link>
                            </div>

                            <div class="space-y-4">
                                <div v-for="thread in forumThreads" :key="thread.id" class="group">
                                    <Link
                                        :href="thread.url"
                                        class="block rounded-lg border border-black/10 p-4 transition-all duration-300 hover:border-orange-400/30 dark:border-white/10"
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
                                                    <span class="rounded bg-black/5 px-1.5 py-0.5 text-xs dark:bg-white/5">{{
                                                        thread.category
                                                    }}</span>
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
                            class="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-orange-300 dark:border-gray-700/30 dark:bg-black/30 dark:hover:border-orange-600/50"
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
                            >
                                <h3 class="mb-2 font-semibold text-black dark:text-white">📱 SunnyTown est-il gratuit ?</h3>
                                <p class="text-sm text-black/70 dark:text-white/70">
                                    Oui ! SunnyTown est entièrement gratuit avec des achats optionnels pour personnaliser votre expérience.
                                </p>
                            </div>

                            <div
                                class="rounded-lg border border-black/10 bg-gradient-to-br from-black/[0.02] to-black/[0.05] p-4 dark:border-white/10 dark:from-white/[0.02] dark:to-white/[0.05]"
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
                            >
                                <h3 class="mb-2 font-semibold text-black dark:text-white">👥 Comment rejoindre la communauté ?</h3>
                                <p class="text-sm text-black/70 dark:text-white/70">
                                    Créez un compte et accédez immédiatement au forum et aux discussions avec d'autres joueurs.
                                </p>
                            </div>

                            <div
                                class="rounded-lg border border-black/10 bg-gradient-to-br from-black/[0.02] to-black/[0.05] p-4 dark:border-white/10 dark:from-white/[0.02] dark:to-white/[0.05]"
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
