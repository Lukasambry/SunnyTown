<script lang="ts" setup>
import { Head, useForm } from '@inertiajs/vue3';
import { toast } from "vue-sonner";
import { ref } from "vue";

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
                title: "Article publié",
                description: "Votre article a été publié avec succès"
            });
        },
        onFinish: () => {
            isSubmitting.value = false;
        }
    });
};
</script>

<template>
    <Head title="Créer un article" />

    <div>
        <div class="pixel-border pixel-border-gold mb-6 px-4 py-3">
            <h2 class="font-mono font-bold text-xl text-black leading-tight">
                Créer un article
            </h2>
        </div>

        <div class="py-8">
            <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div class="pixel-border pixel-border-dirt">
                    <div class="pixel-border pixel-border-dark-dirt dark:!bg-transparent dark:!shadow-none p-8">


                        <form @submit.prevent="onSubmit" class="space-y-6">

                            <div class="space-y-2">
                                <div class="pixel-border pixel-border-stone px-3 py-1 inline-block">
                                    <label for="title" class="font-mono font-bold text-black text-sm">
                                        Titre *
                                    </label>
                                </div>
                                <div class="pixel-border pixel-border-dirt mt-2">
                                    <input
                                        id="title"
                                        v-model="form.title"
                                        type="text"
                                        placeholder="Entrez le titre de l'article (max 140 caractères)"
                                        required
                                        class="w-full p-3 bg-white font-mono text-black placeholder-gray-500 border-0 outline-none"
                                        :class="{ 'bg-red-50': form.errors.title }"
                                    />
                                </div>
                                <div v-if="form.errors.title" class="pixel-border pixel-border-destructive px-3 py-1">
                                    <p class="font-mono text-sm text-white">{{ form.errors.title }}</p>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <div class="pixel-border pixel-border-stone px-3 py-1 inline-block">
                                    <label for="author" class="font-mono font-bold text-black text-sm">
                                        Auteur *
                                    </label>
                                </div>
                                <div class="pixel-border pixel-border-dirt mt-2">
                                    <input
                                        id="author"
                                        v-model="form.author"
                                        type="text"
                                        placeholder="Nom de l'auteur"
                                        required
                                        class="w-full p-3 bg-white font-mono text-black placeholder-gray-500 border-0 outline-none"
                                        :class="{ 'bg-red-50': form.errors.author }"
                                    />
                                </div>
                                <div v-if="form.errors.author" class="pixel-border pixel-border-destructive px-3 py-1">
                                    <p class="font-mono text-sm text-white">{{ form.errors.author }}</p>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <div class="pixel-border pixel-border-stone px-3 py-1 inline-block">
                                    <label for="published_at" class="font-mono font-bold text-black text-sm">
                                        Date de publication
                                    </label>
                                </div>
                                <div class="pixel-border pixel-border-dirt mt-2">
                                    <input
                                        id="published_at"
                                        v-model="form.published_at"
                                        type="date"
                                        class="w-full p-3 bg-white font-mono text-black border-0 outline-none"
                                        :class="{ 'bg-red-50': form.errors.published_at }"
                                    />
                                </div>
                                <div v-if="form.errors.published_at" class="pixel-border pixel-border-destructive px-3 py-1">
                                    <p class="font-mono text-sm text-white">{{ form.errors.published_at }}</p>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <div class="pixel-border pixel-border-stone px-3 py-1 inline-block">
                                    <label for="content" class="font-mono font-bold text-black text-sm">
                                        Contenu *
                                    </label>
                                </div>
                                <div class="pixel-border pixel-border-dirt mt-2">
                                    <textarea
                                        id="content"
                                        v-model="form.content"
                                        placeholder="Contenu de l'article"
                                        rows="12"
                                        required
                                        class="w-full p-3 bg-white font-mono text-black placeholder-gray-500 border-0 outline-none resize-none"
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
                                            ? 'pixel-border-stone brightness-75 cursor-not-allowed'
                                            : 'pixel-border-gold hover:brightness-110'
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
input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
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
