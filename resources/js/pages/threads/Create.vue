<template>
    <Head :title="`Créer un thread dans ${category.name}`" />
    <header class="fixed top-0 right-0 left-0 z-50 backdrop-blur-md">
        <Navbar />
    </header>

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
                        <Link
                            :href="route('forums.categories.show', { category: category.id })"
                            class="text-black/60 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 font-medium"
                        >
                            {{ category.name }}
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/40 dark:text-white/40">
                            <path d="m9 18 6-6-6-6"/>
                        </svg>
                        <span class="text-black dark:text-white font-medium">Nouveau thread</span>
                    </div>
                </nav>

                <!-- Page Header -->
                <div class="relative mb-12 rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-lg">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>
                    <div class="relative p-8 sm:p-12">
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div class="flex items-center gap-4">
                                <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400/20 to-orange-600/20 border border-orange-400/30 flex items-center justify-center backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
                                        <path d="M12 20h9"/>
                                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h1 class="text-3xl sm:text-4xl font-semibold tracking-tighter text-black dark:text-white mb-2">
                                        Créer un nouveau thread
                                    </h1>
                                    <p class="text-base text-black/70 dark:text-white/70 tracking-tight">
                                        dans <span class="font-medium text-orange-500">{{ category.name }}</span>
                                    </p>
                                    <div class="h-0.5 w-24 bg-orange-400/70 mt-3"></div>
                                </div>
                            </div>

                            <!-- Back button -->
                            <Link
                                :href="route('forums.categories.show', { category: category.id })"
                                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:-translate-x-1 duration-300">
                                    <path d="M5 12h14"/>
                                    <path d="m5 12 6-6"/>
                                    <path d="m5 12 6 6"/>
                                </svg>
                                Retour
                            </Link>
                        </div>
                    </div>
                </div>

                <!-- Create Thread Form -->
                <div class="relative rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-lg">
                    <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>
                    <div class="relative p-8 sm:p-12">
                        <!-- Form header -->
                        <div class="flex items-center gap-4 mb-8">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                    <path d="M12 7v6"/>
                                    <path d="M9 10h6"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-xl font-semibold text-black dark:text-white tracking-tight">Détails du thread</h2>
                                <p class="text-sm text-black/60 dark:text-white/60">Donnez un titre accrocheur et décrivez votre sujet</p>
                            </div>
                        </div>

                        <form @submit.prevent="submit" class="space-y-8">
                            <!-- Title field -->
                            <div class="space-y-3">
                                <label for="title" class="block text-sm font-semibold text-black dark:text-white">
                                    Titre du thread
                                    <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input
                                        id="title"
                                        v-model="form.title"
                                        type="text"
                                        placeholder="Ex: Comment optimiser les performances de mon application ?"
                                        class="w-full px-4 py-4 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                                        :class="{ 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.title }"
                                        maxlength="255"
                                    />

                                    <!-- Character counter for title -->
                                    <div class="absolute bottom-3 right-3 text-xs text-black/50 dark:text-white/50 font-medium">
                                        {{ form.title.length }}/255
                                    </div>
                                </div>

                                <!-- Error message -->
                                <div v-if="form.errors.title" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" x2="12" y1="8" y2="12"/>
                                        <line x1="12" x2="12.01" y1="16" y2="16"/>
                                    </svg>
                                    {{ form.errors.title }}
                                </div>

                                <!-- Help text -->
                                <p class="text-xs text-black/60 dark:text-white/60">
                                    Choisissez un titre clair et descriptif qui résume votre question ou sujet.
                                </p>
                            </div>

                            <!-- Content field -->
                            <div class="space-y-3">
                                <label for="content" class="block text-sm font-semibold text-black dark:text-white">
                                    Contenu du message
                                    <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                <textarea
                                    id="content"
                                    v-model="form.content"
                                    rows="12"
                                    placeholder="Décrivez votre question, problème ou sujet en détail. Plus vous fournirez d'informations, plus la communauté pourra vous aider efficacement..."
                                    class="w-full resize-none px-4 py-4 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                                    :class="{ 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.content }"
                                ></textarea>

                                    <!-- Character counter for content -->
                                    <div class="absolute bottom-3 right-3 text-xs text-black/50 dark:text-white/50 font-medium">
                                        {{ form.content.length }} caractères
                                    </div>
                                </div>

                                <!-- Error message -->
                                <div v-if="form.errors.content" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" x2="12" y1="8" y2="12"/>
                                        <line x1="12" x2="12.01" y1="16" y2="16"/>
                                    </svg>
                                    {{ form.errors.content }}
                                </div>

                                <!-- Help text -->
                                <p class="text-xs text-black/60 dark:text-white/60">
                                    Utilisez un langage clair et professionnel. Vous pouvez structurer votre message avec des paragraphes.
                                </p>
                            </div>

                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-black/5 dark:border-white/5">
                                <div class="flex items-center gap-3">
                                    <!--
                                    <button
                                        type="button"
                                        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                        Prévisualiser
                                    </button>

                                    <button
                                        type="button"
                                        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                            <polyline points="17,21 17,13 7,13 7,21"/>
                                            <polyline points="7,3 7,8 15,8"/>
                                        </svg>
                                        Brouillon
                                    </button>
                                    -->
                                </div>

                                <div class="flex items-center gap-3">
                                    <Link
                                        :href="route('forums.categories.show', { category: category.id })"
                                        class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300"
                                    >
                                        Annuler
                                    </Link>

                                    <div class="rounded-xl p-1 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300" :class="{ 'opacity-50': !canSubmit || form.processing }">
                                        <button
                                            type="submit"
                                            :disabled="!canSubmit || form.processing"
                                            class="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium text-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div v-if="form.processing" class="flex items-center gap-2">
                                                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Création en cours...
                                            </div>
                                            <div v-else class="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                                    <path d="M12 7v6"/>
                                                    <path d="M9 10h6"/>
                                                </svg>
                                                Créer le thread
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1 duration-300">
                                                    <path d="M5 12h14"/>
                                                    <path d="m12 5 7 7-7 7"/>
                                                </svg>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="mt-8 relative rounded-xl overflow-hidden backdrop-blur-sm border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
                    <div class="p-6">
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                    <path d="M12 17h.01"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-black dark:text-white mb-2">Conseils pour un bon thread</h3>
                                <ul class="text-xs text-black/70 dark:text-white/70 space-y-1">
                                    <li>• Utilisez un titre descriptif et spécifique</li>
                                    <li>• Fournissez le contexte nécessaire dans votre message</li>
                                    <li>• Restez courtois et respectueux envers la communauté</li>
                                    <li>• Relisez votre message avant de l'envoyer</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </SiteLayout>
</template>

<script lang="ts" setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import { computed } from 'vue';
import SiteLayout from '@/layouts/SiteLayout.vue';

const props = defineProps<{
    category: {
        id: number;
        name: string;
    };
}>();

const form = useForm({
    title: '',
    content: '',
});

// Computed properties
const canSubmit = computed(() => {
    return form.title.trim().length > 0 &&
        form.content.trim().length > 0 &&
        form.title.length <= 255;
});

// Methods
function submit() {
    if (!canSubmit.value || form.processing) return;

    form.post(route('forums.threads.store', props.category.id), {
        onSuccess: () => {
            // Redirect is handled by the backend
        },
        onError: () => {
            // Error handling is done through form.errors
        }
    });
}
</script>

<style scoped>
/* Custom spinner animation */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Focus styles */
input:focus,
textarea:focus {
    transform: scale(1.01);
}

/* Button hover effects */
.group:hover .group-hover\:translate-x-1 {
    transform: translateX(4px);
}

.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

.group:hover .group-hover\:-translate-x-1 {
    transform: translateX(-4px);
}

* {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

textarea {
    resize: vertical;
    min-height: 200px;
}

textarea::-webkit-scrollbar {
    width: 6px;
}

textarea::-webkit-scrollbar-track {
    background: transparent;
}

textarea::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

.dark textarea::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
}
</style>
