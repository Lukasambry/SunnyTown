<template>
    <Head title="Créer un article" />

    <SiteLayout :auth="$page.props.auth">
        <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a]">
            <div class="absolute inset-0 before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20600%22%3E%3Cfilter%20id%3D%22a%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%221.6%22%20numOctaves%3D%226%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23a%29%22%2F%3E%3C%2Fsvg%3E')] before:bg-repeat before:bg-[length:80px] before:opacity-[0.03] before:mix-blend-overlay before:content-['']"></div>

            <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <nav class="mb-8" aria-label="Breadcrumb">
                    <div class="flex items-center gap-2 text-sm">
                        <Link
                            :href="route('blog.index')"
                            class="text-black/60 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300 font-medium"
                        >
                            Blog
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black/40 dark:text-white/40">
                            <path d="m9 18 6-6-6-6"/>
                        </svg>
                        <span class="text-black dark:text-white font-medium">Nouvel article</span>
                    </div>
                </nav>

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
                                        Créer un nouvel article
                                    </h1>
                                    <p class="text-base text-black/70 dark:text-white/70 tracking-tight">
                                        Partagez vos idées et connaissances avec la communauté
                                    </p>
                                    <div class="h-0.5 w-24 bg-orange-400/70 mt-3"></div>
                                </div>
                            </div>

                            <Link
                                :href="route('blog.index')"
                                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:-translate-x-1 duration-300">
                                    <path d="M5 12h14"/>
                                    <path d="m5 12 6-6"/>
                                    <path d="m5 12 6 6"/>
                                </svg>
                                Retour au blog
                            </Link>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2">
                        <div class="relative rounded-2xl overflow-hidden backdrop-blur-sm border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] shadow-lg">
                            <div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5"></div>
                            <div class="relative p-8 sm:p-12">
                                <div class="flex items-center gap-4 mb-8">
                                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 class="text-xl font-semibold text-black dark:text-white tracking-tight">Rédaction de l'article</h2>
                                        <p class="text-sm text-black/60 dark:text-white/60">Créez du contenu de qualité pour votre audience</p>
                                    </div>
                                </div>

                                <form @submit.prevent="onSubmit" class="space-y-8">
                                    <div class="space-y-3">
                                        <label for="title" class="block text-sm font-semibold text-black dark:text-white">
                                            Titre de l'article
                                            <span class="text-red-500">*</span>
                                        </label>
                                        <div class="relative">
                                            <input
                                                id="title"
                                                v-model="form.title"
                                                type="text"
                                                placeholder="Ex: Les dernières avancées en intelligence artificielle..."
                                                class="w-full px-4 py-4 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                                                :class="{ 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.title }"
                                                maxlength="140"
                                            />

                                            <div class="absolute bottom-3 right-3 text-xs text-black/50 dark:text-white/50 font-medium">
                                                {{ form.title.length }}/140
                                            </div>
                                        </div>

                                        <div v-if="form.errors.title" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="12" x2="12" y1="8" y2="12"/>
                                                <line x1="12" x2="12.01" y1="16" y2="16"/>
                                            </svg>
                                            {{ form.errors.title }}
                                        </div>

                                        <p class="text-xs text-black/60 dark:text-white/60">
                                            Choisissez un titre accrocheur et descriptif qui résume votre article.
                                        </p>
                                    </div>

                                    <div class="space-y-3">
                                        <label for="author" class="block text-sm font-semibold text-black dark:text-white">
                                            Nom de l'auteur
                                            <span class="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="author"
                                            v-model="form.author"
                                            type="text"
                                            placeholder="Votre nom complet"
                                            class="w-full px-4 py-3 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                                            :class="{ 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.author }"
                                            maxlength="100"
                                        />

                                        <div v-if="form.errors.author" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="12" x2="12" y1="8" y2="12"/>
                                                <line x1="12" x2="12.01" y1="16" y2="16"/>
                                            </svg>
                                            {{ form.errors.author }}
                                        </div>
                                    </div>

                                    <div class="space-y-3">
                                        <label for="content" class="block text-sm font-semibold text-black dark:text-white">
                                            Contenu de l'article
                                            <span class="text-red-500">*</span>
                                        </label>
                                        <div class="relative">
                                            <textarea
                                                id="content"
                                                v-model="form.content"
                                                rows="16"
                                                placeholder="Rédigez votre article ici... Vous pouvez utiliser du HTML pour le formatage (balises <strong>, <em>, <p>, <h2>, <ul>, <li>, etc.)"
                                                class="w-full resize-none px-4 py-4 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 leading-relaxed"
                                                :class="{ 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.content }"
                                            ></textarea>

                                            <div class="absolute bottom-3 right-3 text-xs text-black/50 dark:text-white/50 font-medium">
                                                {{ getWordCount(form.content) }} mots
                                            </div>
                                        </div>

                                        <div v-if="form.errors.content" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="12" x2="12" y1="8" y2="12"/>
                                                <line x1="12" x2="12.01" y1="16" y2="16"/>
                                            </svg>
                                            {{ form.errors.content }}
                                        </div>

                                        <p class="text-xs text-black/60 dark:text-white/60">
                                            Rédigez un contenu riche et informatif. Vous pouvez utiliser du HTML pour le formatage.
                                        </p>
                                    </div>

                                    <div class="space-y-3">
                                        <label for="published_at" class="block text-sm font-semibold text-black dark:text-white">
                                            Date de publication
                                        </label>
                                        <input
                                            id="published_at"
                                            v-model="form.published_at"
                                            type="date"
                                            class="w-full px-4 py-3 text-base bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                                            :class="{ 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50': form.errors.published_at }"
                                        />

                                        <div v-if="form.errors.published_at" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="12" x2="12" y1="8" y2="12"/>
                                                <line x1="12" x2="12.01" y1="16" y2="16"/>
                                            </svg>
                                            {{ form.errors.published_at }}
                                        </div>

                                        <p class="text-xs text-black/60 dark:text-white/60">
                                            Choisissez quand publier votre article. Laissez vide pour une publication immédiate.
                                        </p>
                                    </div>

                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-black/5 dark:border-white/5">
                                        <div class="flex items-center gap-3">
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
                                                Sauvegarder en brouillon
                                            </button>
                                        </div>

                                        <div class="flex items-center gap-3">
                                            <Link
                                                :href="route('blog.index')"
                                                class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-all duration-300"
                                            >
                                                Annuler
                                            </Link>

                                            <div class="rounded-xl p-1 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300" :class="{ 'opacity-50': !canSubmit || isSubmitting }">
                                                <button
                                                    type="submit"
                                                    :disabled="!canSubmit || isSubmitting"
                                                    class="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium text-sm hover:from-orange-600 hover:to-orange-700 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <div v-if="isSubmitting" class="flex items-center gap-2">
                                                        <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        Publication en cours...
                                                    </div>
                                                    <div v-else class="flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:scale-110 duration-300">
                                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                                        </svg>
                                                        Publier l'article
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
                    </div>

                    <div class="lg:col-span-1 space-y-6">
                        <div class="relative rounded-xl overflow-hidden backdrop-blur-sm border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
                            <div class="p-6">
                                <div class="flex items-start gap-4">
                                    <div class="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500">
                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="text-sm font-semibold text-black dark:text-white mb-2">Conseils de rédaction</h3>
                                        <ul class="text-xs text-black/70 dark:text-white/70 space-y-1">
                                            <li>• Utilisez un titre accrocheur et descriptif</li>
                                            <li>• Structurez votre contenu avec des paragraphes</li>
                                            <li>• Utilisez du HTML pour le formatage (balises autorisées)</li>
                                            <li>• Relisez votre article avant publication</li>
                                            <li>• Visez 300-1000 mots pour un bon engagement</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="relative rounded-xl overflow-hidden backdrop-blur-sm border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
                            <div class="p-6">
                                <h3 class="text-sm font-semibold text-black dark:text-white mb-4">Statistiques de l'article</h3>
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs text-black/60 dark:text-white/60">Mots</span>
                                        <span class="text-sm font-medium text-black dark:text-white">{{ getWordCount(form.content) }}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs text-black/60 dark:text-white/60">Caractères</span>
                                        <span class="text-sm font-medium text-black dark:text-white">{{ form.content.length }}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs text-black/60 dark:text-white/60">Temps de lecture</span>
                                        <span class="text-sm font-medium text-black dark:text-white">{{ getReadingTime(form.content) }} min</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="relative rounded-xl overflow-hidden backdrop-blur-sm border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
                            <div class="p-6">
                                <h3 class="text-sm font-semibold text-black dark:text-white mb-3">Balises HTML autorisées</h3>
                                <div class="text-xs text-black/60 dark:text-white/60 space-y-1">
                                    <code class="bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded">&lt;strong&gt;</code> pour le gras<br>
                                    <code class="bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded">&lt;em&gt;</code> pour l'italique<br>
                                    <code class="bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded">&lt;p&gt;</code> pour les paragraphes<br>
                                    <code class="bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded">&lt;h2&gt;&lt;h3&gt;</code> pour les titres<br>
                                    <code class="bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded">&lt;ul&gt;&lt;li&gt;</code> pour les listes
                                </div>
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
import { ref, computed, onMounted } from 'vue';
import SiteLayout from '@/layouts/SiteLayout.vue';

const isSubmitting = ref(false);

// Vérification si l'utilisateur est autorisé
const checkAuthorization = () => {
    if (!$page.props.auth.user || !$page.props.auth.user.roles.some(role => role.name === 'admin')) {
        window.location = route('blog.index');
    }
};

onMounted(() => {
    checkAuthorization();
});

const today = new Date();
const formattedDate = today.toISOString().split('T')[0];

const form = useForm({
    title: '',
    content: '',
    author: '',
    published_at: formattedDate,
});

const canSubmit = computed(() => {
    return form.title.trim().length > 0 &&
        form.content.trim().length > 0 &&
        form.author.trim().length > 0 &&
        form.title.length <= 140 &&
        form.author.length <= 100;
});

const getWordCount = (content: string) => {
    if (!content) return 0;
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.split(/\s+/).filter(word => word.length > 0).length;
};

const getReadingTime = (content: string) => {
    const wordCount = getWordCount(content);
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute) || 1;
};

const onSubmit = () => {
    if (!canSubmit.value || isSubmitting.value) return;

    isSubmitting.value = true;
    form.post(route('blog.store'), {
        onSuccess: () => {
            // ...
        },
        onError: () => {
            // ...
        },
        onFinish: () => {
            isSubmitting.value = false;
        }
    });
};
</script>

<style scoped>
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

input:focus,
textarea:focus {
    transform: scale(1.01);
}

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
    min-height: 400px;
    font-family: inherit;
    line-height: 1.6;
}

code {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.75rem;
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

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.space-y-8 > div {
    animation: slideInUp 0.4s ease-out;
}

.space-y-6 > div {
    animation: slideInUp 0.6s ease-out;
}

button:hover,
input:hover,
textarea:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark button:hover,
.dark input:hover,
.dark textarea:hover {
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}
</style>
