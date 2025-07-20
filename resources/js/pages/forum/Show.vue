<template>
    <Head :title="`Forum: ${category.name}`" />

    <SiteLayout :auth="$page.props.auth">
        <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a]">
        <div class="absolute inset-0 before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-repeat before:bg-[length:80px] before:opacity-[0.03] before:mix-blend-overlay before:content-['']"></div>

        <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <nav class="mb-8" aria-label="Breadcrumb">
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
                    <span class="text-black dark:text-white font-medium">{{ category.name }}</span>
                </div>
            </nav>

            <div class="relative mb-12 rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-lg">
                <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>
                <div class="relative p-8 sm:p-12">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400/20 to-orange-600/20 border border-orange-400/30 flex items-center justify-center backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
                                    <path d="M8 2v4"/>
                                    <path d="M16 2v4"/>
                                    <rect width="18" height="18" x="3" y="4" rx="2"/>
                                    <path d="M3 10h18"/>
                                    <path d="M8 14h.01"/>
                                    <path d="M12 14h.01"/>
                                    <path d="M16 14h.01"/>
                                    <path d="M8 18h.01"/>
                                    <path d="M12 18h.01"/>
                                </svg>
                            </div>
                            <div>
                                <h1 class="text-4xl sm:text-5xl font-semibold tracking-tighter text-black dark:text-white mb-2">
                                    {{ category.name }}
                                </h1>
                                <div class="h-0.5 w-24 bg-orange-400/70"></div>
                            </div>
                        </div>

                        <div class="flex items-center gap-6">
                            <div class="text-center">
                                <div class="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tighter">{{ threads.length }}</div>
                                <div class="text-xs text-black/60 dark:text-white/60 tracking-tight">{{ threads.length > 1 ? 'Discussions' : 'Discussion' }}</div>
                            </div>
                            <div class="w-px h-12 bg-black/10 dark:bg-white/10"></div>
                            <div class="text-center">
                                <div class="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tighter">{{ uniqueUsers }}</div>
                                <div class="text-xs text-black/60 dark:text-white/60 tracking-tight">{{ uniqueUsers > 1 ? 'Membres' : 'Membre' }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-8 flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="text-sm text-black/70 dark:text-white/70 font-medium">
                        {{ threads.length }} thread{{ threads.length > 1 ? 's' : '' }} disponible{{ threads.length > 1 ? 's' : '' }}
                    </span>
                </div>

                <div class="rounded-xl p-1 border border-black/20 dark:border-white/20 hover:border-orange-400/50 dark:hover:border-orange-400/50 transition-all duration-300">
                    <Link
                        :href="route('forums.threads.create', { category: category.id })"
                        class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium text-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-300 group tracking-tight shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:rotate-90 duration-300">
                            <path d="M5 12h14"/>
                            <path d="M12 5v14"/>
                        </svg>
                        Nouveau thread
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 duration-300">
                            <path d="M5 12h14"/>
                            <path d="m12 5 7 7-7 7"/>
                        </svg>
                    </Link>
                </div>
            </div>

            <div class="space-y-4">
                <div
                    v-for="(thread, index) in threads"
                    :key="thread.id"
                    class="group relative rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                    :style="{ 'animation-delay': `${index * 0.1}s` }"
                >
                    <div class="absolute inset-0 bg-gradient-to-br from-black/[0.01] via-transparent to-orange/[0.01] dark:from-white/[0.01] dark:to-orange/[0.01] group-hover:from-orange-500/[0.02] group-hover:to-orange-600/[0.02] transition-all duration-300"></div>

                    <div class="relative p-6 sm:p-8">
                        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-start gap-4">
                                    <div class="flex-shrink-0">
                                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                            {{ thread.user.name.charAt(0).toUpperCase() }}
                                        </div>
                                    </div>

                                    <div class="flex-1 min-w-0">
                                        <Link
                                            :href="route('forums.threads.show', { category: category.id, thread: thread.id })"
                                            class="block group/link"
                                        >
                                            <h3 class="text-xl sm:text-2xl font-semibold text-black dark:text-white group-hover/link:text-orange-500 dark:group-hover/link:text-orange-400 transition-colors duration-300 tracking-tight line-clamp-2">
                                                {{ thread.title }}
                                            </h3>
                                        </Link>

                                        <div class="flex items-center gap-4 mt-3">
                                            <div class="flex items-center gap-2">
                                                <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span class="text-sm font-medium text-black/70 dark:text-white/70">
                                                    par <span class="text-black dark:text-white">{{ thread.user.name }}</span>
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
                                                <time class="text-xs text-black/60 dark:text-white/60 font-medium tracking-tight">
                                                    {{ formatDate(thread.created_at) }}
                                                </time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex-shrink-0 flex items-center gap-3">
                                <Link
                                    :href="route('forums.threads.show', { category: category.id, thread: thread.id })"
                                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group/action"
                                >
                                    Lire
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover/action:translate-x-1 duration-300">
                                        <path d="M5 12h14"/>
                                        <path d="m12 5 7 7-7 7"/>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="threads.length === 0" class="text-center py-16">
                    <div class="relative max-w-md mx-auto">
                        <div class="w-24 h-24 mx-auto rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/40 dark:text-white/40">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                <path d="M12 7v6"/>
                                <path d="M9 10h6"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-black dark:text-white mb-2 tracking-tight">Aucun thread pour le moment</h3>
                        <p class="text-black/60 dark:text-white/60 mb-6">Soyez le premier à démarrer une conversation dans cette catégorie.</p>

                        <div class="rounded-xl p-1 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300 w-fit mx-auto">
                            <Link
                                :href="route('forums.threads.create', { category: category.id })"
                                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M5 12h14"/>
                                    <path d="M12 5v14"/>
                                </svg>
                                Créer le premier thread
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 duration-300">
                                    <path d="M5 12h14"/>
                                    <path d="m12 5 7 7-7 7"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-12 pt-8 border-t border-black/5 dark:border-white/5">
                <Link
                    :href="route('forums.index')"
                    class="inline-flex items-center gap-2 text-black/70 dark:text-white/70 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:-translate-x-1 duration-300">
                        <path d="M5 12h14"/>
                        <path d="m5 12 6-6"/>
                        <path d="m5 12 6 6"/>
                    </svg>
                    Retour au forum
                </Link>
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
    category: {
        id: number;
        name: string;
    };
    threads: Array<{
        id: number;
        title: string;
        user: { name: string };
        created_at: string;
    }>;
}>();

const uniqueUsers = computed(() => {
    const users = new Set(props.threads.map(thread => thread.user.name));
    return users.size;
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

.space-y-4 > div {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.group:hover .group-hover\:scale-\[1\.02\] {
    transform: scale(1.02);
}

@keyframes pulse-custom {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse-custom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

* {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
