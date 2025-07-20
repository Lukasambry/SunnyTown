<template>
    <Teleport to="body">
        <Transition name="building-selection-fade">
            <div v-if="isVisible" class="building-selection-overlay pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
                <div class="p-4 -translate-y-1/1">
                    <div class="relative flex w-fit gap-4 pointer-events-auto">
                        <div class="relative ml-6 flex h-8">
                            <div class="pixel-border pixel-border-stone flex h-full items-center px-2 pl-10 text-xl/1 !text-slate-700">
                                {{ buildingName }}
                            </div>
                            <div class="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/30">
                                <img src="/assets/game/ui/itemdisc.png" class="pixelated h-16" alt="item_disc" />
                                <img
                                    src="/assets/game/ui/axe.png"
                                    class="pixelated absolute top-1/2 left-1/2 h-11 -translate-x-1/2 -translate-y-1/2"
                                    alt="Axe"
                                />
                            </div>
                        </div>
                        <button class="pixel-border pixel-border-gold group h-8 w-12 cursor-pointer" @click="handleManage">
                            <img
                                src="/assets/game/ui/arrow_up.png"
                                class="pixelated absolute top-1/2 left-1/2 h-10 w-auto -translate-x-1/2 -translate-y-3 transition duration-150 ease-in-out group-hover:-translate-y-3.5"
                                alt="ArrowUp"
                            />
                        </button>
                        <img
                            src="/assets/game/ui/indicator.png"
                            class="pixelated absolute top-1/1 left-1/2 h-6 -translate-x-1/2 -translate-y-1.5 rotate-90"
                            alt="Indicator"
                        />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import type { TiledBuilding } from '@/game/objects/TiledBuilding';
import { useGameStore } from '@/game/stores/gameStore';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const gameStore = useGameStore();

const isVisible = ref(false);
const selectedBuilding = ref<TiledBuilding | null>(null);
const buildingData = ref<any>(null);

const buildingName = computed(() => buildingData.value?.getBuildingName() || '');

const handleBuildingSelected = (event: CustomEvent) => {
    const { building } = event.detail;

    selectedBuilding.value = building;
    buildingData.value = building;
    isVisible.value = true;
};

const handleBuildingDeselected = () => {
    isVisible.value = false;
    selectedBuilding.value = null;
    buildingData.value = null;
};

const handleClose = () => {
    window.dispatchEvent(new CustomEvent('game:deselectBuilding'));
};

const handleManage = () => {
    if (buildingData.value) {
        gameStore.showBuildingInfo(buildingData.value);
    }
    handleClose();
};

onMounted(() => {
    window.addEventListener('game:buildingSelected', handleBuildingSelected);
    window.addEventListener('game:buildingDeselected', handleBuildingDeselected);
});

onUnmounted(() => {
    window.removeEventListener('game:buildingSelected', handleBuildingSelected);
    window.removeEventListener('game:buildingDeselected', handleBuildingDeselected);
});
</script>

<style scoped>
@keyframes building-selection-slide-in {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>
