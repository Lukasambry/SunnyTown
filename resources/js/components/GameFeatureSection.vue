<template>
  <section 
    ref="elementRef"
    class="relative w-full min-h-[70vh] md:min-h-[80vh] xl:min-h-screen flex items-center overflow-hidden bg-black border-t border-b border-amber-400/10"
  >
    <!-- Background Image with Parallax -->
    <div class="absolute inset-0 w-full h-full overflow-hidden">
      <img
        :src="imageUrl || '/placeholder.svg?width=1280&height=720'"
        :alt="imageAlt"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out"
        :style="{ transform: `translateY(${parallaxY}px)` }"
      />
      <!-- Dark overlay for better contrast -->
      <div class="absolute inset-0 bg-black/50"></div> <!-- Slightly darker overlay -->
    </div>

    <!-- Content Container -->
    <div
      :class="[
        'relative z-10 flex w-full h-full items-center', // Added items-center for vertical alignment
        isTextLeft ? 'flex-row' : 'flex-row-reverse md:flex-row-reverse',
      ]"
    >
      <!-- Text Panel -->
      <div
        :class="[
          'w-full md:w-3/5 lg:w-1/2 p-6 sm:p-10 md:p-16 lg:p-24 flex flex-col justify-center',
          isTextLeft
            ? 'bg-gradient-to-r from-black via-black/80 to-transparent'
            : 'bg-gradient-to-l from-black via-black/80 to-transparent md:text-right', // Ensure text-right on md for right-aligned
        ]"
      >
        <h2
          :class="[
            'text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-300 mb-4 uppercase drop-shadow-lg',
            // Removed !isTextLeft && 'md:text-right' as it's handled by parent div class
          ]"
          style="font-family: 'Georgia', 'Times New Roman', serif"
        >
          {{ title }}
        </h2>
        <!-- Decorative Separator -->
        <hr :class="['w-24 h-0.5 border-0 bg-amber-400/50 mb-6', !isTextLeft && 'md:ml-auto']" />
        
        <p
          :class="[
            'text-gray-200 text-base sm:text-lg leading-relaxed whitespace-pre-line drop-shadow-md',
             // Removed !isTextLeft && 'md:text-right'
          ]"
        >
          {{ text }}
        </p>
      </div>

      <!-- Spacer for the opposite side on larger screens -->
      <div class="hidden md:block md:w-2/5 lg:w-1/2"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineProps } from 'vue';

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
  
  // Calculate how much of the element is visible or has been scrolled past
  const scrollPositionInElement = props.scrollY + window.innerHeight - offsetTop.value;
  const elementVisibleRange = window.innerHeight + elementHeight.value;
  
  // Normalize the scroll position within the element's visibility range (0 to 1)
  let scrollFactor = scrollPositionInElement / elementVisibleRange;
  scrollFactor = Math.max(0, Math.min(1, scrollFactor)); // Clamp between 0 and 1

  // Apply parallax: image moves from -X to +X as element scrolls through viewport
  // Adjust the '30' to control the total parallax movement distance (e.g., 30px up and 30px down)
  const parallaxRange = 40; // Total pixels the image will move
  return (scrollFactor - 0.5) * parallaxRange * -1; // -0.5 to center, * -1 to move against scroll
});

const isTextLeft = computed(() => props.align === 'left');
</script>

<style scoped>
/* Component-specific styles can go here if needed */
/* For example, ensuring text readability if background images are too bright */
</style>
