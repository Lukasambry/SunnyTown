<script lang="ts" setup>
import { Head, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

const isSubmitting = ref(false);

const today = new Date();
const formattedDate = today.toISOString().split('T')[0];

const form = useForm({
    title: '',
    content: '',
    author: '',
    published_at: formattedDate,
});

const onSubmit = () => {
    isSubmitting.value = true;
    form.post(route('blog.store'), {
        onSuccess: () => {
            toast({
                title: 'Article publié',
                description: 'Votre article a été publié avec succès',
            });
        },
        onFinish: () => {
            isSubmitting.value = false;
        },
    });
};
</script>

<template>
    <Head title="Créer un article" />

    <div>
        <div class="pixel-border pixel-border-gold mb-6 px-4 py-3">
            <h2 class="font-mono text-xl leading-tight font-bold text-black">Créer un article</h2>
        </div>

        <div class="py-8">
            <div class="mx-auto max-w-4xl sm:px-6 lg:px-8">
                <div class="pixel-border pixel-border-dirt">
                    <div class="pixel-border pixel-border-dark-dirt p-8 dark:!bg-transparent dark:!shadow-none">
                        <form @submit.prevent="onSubmit" class="space-y-6">
                            <div class="space-y-2">
                                <div class="pixel-border pixel-border-stone inline-block px-3 py-1">
                                    <label for="title" class="font-mono text-sm font-bold text-black"> Titre * </label>
                                </div>
                                <div class="pixel-border pixel-border-dirt mt-2">
                                    <input
                                        id="title"
                                        v-model="form.title"
                                        type="text"
                                        placeholder="Entrez le titre de l'article (max 140 caractères)"
                                        required
                                        class="w-full border-0 bg-white p-3 font-mono text-black placeholder-gray-500 outline-none"
                                        :class="{ 'bg-red-50': form.errors.title }"
                                    />
                                </div>
                                <div v-if="form.errors.title" class="pixel-border pixel-border-destructive px-3 py-1">
                                    <p class="font-mono text-sm text-white">{{ form.errors.title }}</p>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <div class="pixel-border pixel-border-stone inline-block px-3 py-1">
                                    <label for="author" class="font-mono text-sm font-bold text-black"> Auteur * </label>
                                </div>
                                <div class="pixel-border pixel-border-dirt mt-2">
                                    <input
                                        id="author"
                                        v-model="form.author"
                                        type="text"
                                        placeholder="Nom de l'auteur"
                                        required
                                        class="w-full border-0 bg-white p-3 font-mono text-black placeholder-gray-500 outline-none"
                                        :class="{ 'bg-red-50': form.errors.author }"
                                    />
                                </div>
                                <div v-if="form.errors.author" class="pixel-border pixel-border-destructive px-3 py-1">
                                    <p class="font-mono text-sm text-white">{{ form.errors.author }}</p>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <div class="pixel-border pixel-border-stone inline-block px-3 py-1">
                                    <label for="published_at" class="font-mono text-sm font-bold text-black"> Date de publication </label>
                                </div>
                                <div class="pixel-border pixel-border-dirt mt-2">
                                    <input
                                        id="published_at"
                                        v-model="form.published_at"
                                        type="date"
                                        class="w-full border-0 bg-white p-3 font-mono text-black outline-none"
                                        :class="{ 'bg-red-50': form.errors.published_at }"
                                    />
                                </div>
                                <div v-if="form.errors.published_at" class="pixel-border pixel-border-destructive px-3 py-1">
                                    <p class="font-mono text-sm text-white">{{ form.errors.published_at }}</p>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <div class="pixel-border pixel-border-stone inline-block px-3 py-1">
                                    <label for="content" class="font-mono text-sm font-bold text-black"> Contenu * </label>
                                </div>
                                <div class="pixel-border pixel-border-dirt mt-2">
                                    <textarea
                                        id="content"
                                        v-model="form.content"
                                        placeholder="Contenu de l'article"
                                        rows="12"
                                        required
                                        class="w-full resize-none border-0 bg-white p-3 font-mono text-black placeholder-gray-500 outline-none"
                                        :class="{ 'bg-red-50': form.errors.content }"
                                    ></textarea>
                                </div>
                                <div v-if="form.errors.content" class="pixel-border pixel-border-destructive px-3 py-1">
                                    <p class="font-mono text-sm text-white">{{ form.errors.content }}</p>
                                </div>
                            </div>

                            <div class="flex items-center justify-end space-x-4 pt-6">
                                <button
                                    type="submit"
                                    :disabled="isSubmitting"
                                    class="pixel-border px-6 py-3 transition-all"
                                    :class="[
                                        isSubmitting
                                            ? 'pixel-border-stone cursor-not-allowed brightness-75'
                                            : 'pixel-border-gold hover:brightness-110',
                                    ]"
                                >
                                    <span class="font-mono font-bold text-black">
                                        <span v-if="isSubmitting">Publication en cours...</span>
                                        <span v-else>Publier l'article</span>
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
input[type='date']::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
}

input[type='date']::-webkit-calendar-picker-indicator:hover {
    filter: invert(0.8);
}

textarea::-webkit-scrollbar {
    width: 8px;
}

textarea::-webkit-scrollbar-track {
    background: var(--color-dirt-secondary);
}

textarea::-webkit-scrollbar-thumb {
    background: var(--color-dirt-primary);
    border-radius: 0;
}

textarea::-webkit-scrollbar-thumb:hover {
    background: var(--color-dark-dirt-primary);
}

input:focus,
textarea:focus {
    box-shadow: inset 0 0 0 2px var(--color-gold-primary);
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}
</style>
