<template>
    <div class="worker-fab-container fixed bottom-32 right-8 z-40">
        <button
            class="fab-button group relative rounded-full transition-all duration-300 flex items-center justify-center text-white"
            @click="toggleModal">
            <div class="transition-transform duration-300 group-hover:scale-110">
                <img src="/assets/game/ui/playercount.png"
                     :style="{ imageRendering: 'pixelated'}"
                     alt="Open worker purchase modal"
                     class="w-16">
            </div>

            <div v-if="workerCount > 0"
                 class="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {{ workerCount > 9 ? '9+' : workerCount }}
            </div>
        </button>

        <WorkerPurchaseModal ref="workerModal" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/game/stores/gameStore'
import WorkerPurchaseModal from './WorkerPurchaseModal.vue'

const gameStore = useGameStore()
const workerModal = ref<InstanceType<typeof WorkerPurchaseModal>>()

const workerCount = computed(() => gameStore.workerCount)

const toggleModal = () => {
    if (workerModal.value) {
        workerModal.value.show()
    }
}
</script>

<style scoped>
.fab-button:hover {
    transform: translateY(-2px);
}

.fab-button:active {
    transform: translateY(0);
}

/* Floating animation */
@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-4px);
    }
}

.fab-button {
    animation: float 3s ease-in-out infinite;
}

.fab-button:hover {
    animation: none;
}
</style>
