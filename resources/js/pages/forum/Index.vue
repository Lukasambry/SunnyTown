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
                        v-for="category in categories"
                        :key="category.id"
                        class="group relative rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl"
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
                                    v-for="thread in category.threads"
                                    :key="thread.id"
                                    class="group/thread relative p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] hover:border-black/10 dark:hover:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all duration-300"
                                >
                                    <div class="flex items-center justify-between">
                                        <Link
                                            :href="route('forums.threads.show', { category: category.id, thread: thread.id })"
                                            class="flex-1 text-base sm:text-lg font-medium text-black dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 tracking-tight"
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
                        class="relative p-6 rounded-xl backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20 transition-all duration-300"
                        :style="{ 'animation-delay': `${index * 0.1}s` }"
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
import { computed } from 'vue';
import SiteLayout from '@/layouts/SiteLayout.vue';

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
