<template>
    <div class="building-fab-container fixed bottom-6 right-6 z-40">
        <button
            class="fab-button group relative rounded-full transition-all duration-300 flex items-center justify-center text-white"
            @click="toggleModal">
            <div class="transition-transform duration-300 group-hover:scale-110">
                <img src="/assets/game/ui/buttons/buildings.png"
                     :style="{ imageRendering: 'pixelated'}"
                     alt="Open building modal"
                     class="w-20">
            </div>

            <div v-if="buildingCount > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {{ buildingCount > 9 ? '9+' : buildingCount }}
            </div>
        </button>

        <BuildingListModal ref="buildingModal" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/game/stores/gameStore'
import BuildingListModal from './BuildingListModal.vue'


const gameStore = useGameStore()
const buildingModal = ref<InstanceType<typeof BuildingListModal>>()

const buildingCount = computed(() => gameStore.buildingCount)

const toggleModal = () => {
    if (buildingModal.value) {
        buildingModal.value.show()
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

@keyframes float {

    0%,
    100% {
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
