<template>
    <div ref="scrollContainer" class="scroll-container">
        <div ref="scrollContent" class="scroll-content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrollContainer = ref(null)
const scrollContent = ref(null)

let currentScroll = 0
let targetScroll = 0
const ease = 0.1

const updateScroll = () => {
    currentScroll += (targetScroll - currentScroll) * ease

    if (scrollContent.value) {
        scrollContent.value.style.transform = `translateY(-${currentScroll}px)`
    }

    updateParallax(currentScroll)
    requestAnimationFrame(updateScroll)
}

const updateParallax = (scrollPos) => {
    const parallaxElements = document.querySelectorAll('[data-parallax]')

    parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed'))

        if (scrollPos < window.innerHeight / 1.8) {
            el.style.transform = `translateY(-${scrollPos * speed}px)`
        }
    })
}

const handleWheel = (e) => {
    e.preventDefault()

    const delta = e.deltaY * 1.2
    targetScroll += delta

    const maxScroll = scrollContent.value.offsetHeight - window.innerHeight
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll))
}

onMounted(() => {
    updateScroll()

    window.addEventListener('wheel', handleWheel, { passive: false })
    document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
    window.removeEventListener('wheel', handleWheel)
    document.body.style.overflow = 'auto'
})
</script>

<style scoped>
.scroll-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.scroll-content {
    will-change: transform;
}
</style>
