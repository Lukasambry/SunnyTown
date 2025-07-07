<template>
    <section
        ref="elementRef"
        class="relative flex min-h-[70vh] w-full items-center overflow-hidden border-t border-b border-amber-400/10 bg-black md:min-h-[80vh] xl:min-h-screen"
    >
        <div class="absolute inset-0 h-full w-full overflow-hidden">
            <img
                :src="imageUrl || '/placeholder.svg?width=1280&height=720'"
                :alt="imageAlt"
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-out"
                :style="{ transform: `translateY(${parallaxY}px)` }"
            />
            <div class="absolute inset-0 bg-black/50"></div>
        </div>

        <div :class="['relative z-10 flex h-full w-full items-center', isTextLeft ? 'flex-row' : 'flex-row-reverse md:flex-row-reverse']">
            <div
                :class="[
                    'flex w-full flex-col justify-center p-6 sm:p-10 md:w-3/5 md:p-16 lg:w-1/2 lg:p-24',
                    isTextLeft
                        ? 'bg-gradient-to-r from-black via-black/80 to-transparent'
                        : 'bg-gradient-to-l from-black via-black/80 to-transparent md:text-right', // Ensure text-right on md for right-aligned
                ]"
            >
                <h2
                    :class="['mb-4 text-3xl font-bold text-amber-300 uppercase drop-shadow-lg sm:text-4xl lg:text-5xl']"
                    style="font-family: 'Georgia', 'Times New Roman', serif"
                >
                    {{ title }}
                </h2>

                <hr :class="['mb-6 h-0.5 w-24 border-0 bg-amber-400/50', !isTextLeft && 'md:ml-auto']" />

                <p :class="['text-base leading-relaxed whitespace-pre-line text-gray-200 drop-shadow-md sm:text-lg']">
                    {{ text }}
                </p>
            </div>

            <div class="hidden md:block md:w-2/5 lg:w-1/2"></div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, defineProps, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
    title: { type: String, required: true },
    text: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imageAlt: { type: String, default: 'Feature image' },
    align: { type: String, default: 'left' },
    scrollY: { type: Number, default: 0 }, // Receive scroll position from parent
});

const elementRef = ref(null);
const offsetTop = ref(0);
const elementHeight = ref(0); // To make parallax effect relative to viewport visibility

const updateElementMetrics = () => {
    if (elementRef.value) {
        offsetTop.value = elementRef.value.offsetTop;
        elementHeight.value = elementRef.value.offsetHeight;
    }
};

onMounted(() => {
    // We need a short delay to ensure the DOM is fully rendered and positions are correct
    setTimeout(updateElementMetrics, 100);
    window.addEventListener('resize', updateElementMetrics);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateElementMetrics);
});

const parallaxY = computed(() => {
    if (!elementRef.value) return 0;

    const scrollPositionInElement = props.scrollY + window.innerHeight - offsetTop.value;
    const elementVisibleRange = window.innerHeight + elementHeight.value;

    let scrollFactor = scrollPositionInElement / elementVisibleRange;
    scrollFactor = Math.max(0, Math.min(1, scrollFactor));

    const parallaxRange = 40;
    return (scrollFactor - 0.5) * parallaxRange * -1;
});

const isTextLeft = computed(() => props.align === 'left');
</script>

<style scoped></style>
