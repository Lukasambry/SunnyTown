<script lang="ts" setup>
import { Head } from '@inertiajs/vue3';
import { computed } from 'vue';

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

const sortedBlogPosts = computed(() => {
    if (!props.blogPosts) return [];
    return [...props.blogPosts].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
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
            <article v-for="post in sortedBlogPosts" :key="post.id" class="pixel-border pixel-border-dirt dark:pixel-border-dark-dirt">
                <div class="pixel-border pixel-border-dark-dirt p-6 dark:!bg-transparent dark:!shadow-none">
                    <header class="mb-4">
                        <div class="flex flex-col gap-2 md:flex-row md:items-center">
                            <div class="pixel-border pixel-border-gold inline-block w-full px-4 py-2 md:max-w-[70%]">
                                <h2 class="overflow-hidden font-mono text-xl font-bold text-black" :title="post.title">
                                    {{ post.title }}
                                </h2>
                            </div>

                            <div class="pixel-border pixel-border-stone inline-block px-3 py-1 max-sm:mt-2 md:ml-4">
                                <p class="font-mono text-sm text-black">
                                    Par {{ post.author }} - {{ new Date(post.published_at).toLocaleDateString('fr-FR') }}
                                </p>
                            </div>
                        </div>
                    </header>

                    <div class="pixel-border pixel-border-dirt">
                        <div class="bg-white/90 p-4 text-black">
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
