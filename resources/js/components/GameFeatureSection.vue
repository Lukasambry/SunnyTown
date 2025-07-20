<template>
    <section
        ref="elementRef"
        class="relative flex h-[100vh] w-full items-center overflow-hidden"
    >
        <div class="absolute inset-0 h-full w-full overflow-hidden">
            <img
                :src="imageUrl || '/placeholder.svg?width=1280&height=720'"
                :alt="imageAlt"
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-out"
            />
            <!-- Overlay sombre avec effet de profondeur -->
            <div class="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/60 to-gray-900/95"></div>
        </div>

        <div :class="['relative z-10 flex h-full w-full items-center', isTextLeft ? 'flex-row' : 'flex-row-reverse md:flex-row-reverse']">
            <div
                :class="[
                    'flex w-full h-full flex-col justify-center p-6 sm:p-10 md:w-3/5 md:p-16 lg:w-1/2 lg:p-24',
                ]"
            >
                <!-- Conteneur avec style de la modal -->
                <div class="bg-gray-900/95 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl p-8">
                    <!-- En-tête avec icône -->
                    <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700/50">
                        <div class="w-12 h-12 rounded-lg bg-amber-600/20 flex items-center justify-center">
                            <!-- Icône décorative - peut être remplacée par une icône spécifique -->
                            <div class="w-6 h-6 bg-amber-400 rounded-sm"></div>
                        </div>
                        <div>
                            <h2
                                :class="['text-2xl font-bold text-white uppercase drop-shadow-lg sm:text-3xl lg:text-4xl']"
                                style="font-family: 'Georgia', 'Times New Roman', serif"
                            >
                                {{ title }}
                            </h2>
                            <div class="h-0.5 w-16 bg-amber-400/70 mt-2"></div>
                        </div>
                    </div>

                    <!-- Contenu principal -->
                    <div class="space-y-4">
                        <p :class="['text-base leading-relaxed whitespace-pre-line text-gray-200 drop-shadow-md sm:text-lg']">
                            {{ text }}
                        </p>

                        <!-- Statistiques ou éléments décoratifs optionnels -->
                        <div class="mt-6 pt-4 border-t border-gray-700/50">
                            <div class="flex items-center gap-4 text-sm text-gray-400">
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>Fonctionnalité active</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span>Mise à jour récente</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="hidden md:block md:w-2/5 lg:w-1/2"></div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue';

const props = defineProps({
    title: { type: String, required: true },
    text: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imageAlt: { type: String, default: 'Feature image' },
    align: { type: String, default: 'left' },
    scrollY: { type: Number, default: 0 },
});

const elementRef = ref(null);
const isTextLeft = computed(() => props.align === 'left');
</script>

<style scoped></style>
