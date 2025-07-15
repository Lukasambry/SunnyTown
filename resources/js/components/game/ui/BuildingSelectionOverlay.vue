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

                <!--
                <div class="building-selection-content pointer-events-auto">
                    <div class="building-card min-w-96 rounded-xl border border-gray-700/50 bg-gray-900/95 p-6 shadow-2xl backdrop-blur-md">
                        <div class="mb-4 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20">
                                    <BuildingIcon :building-type="buildingType" :size="24" />
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold text-white">{{ buildingName }}</h3>
                                    <p class="text-sm text-gray-400">{{ buildingType }}</p>
                                </div>
                            </div>

                            <button
                                class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 transition-colors hover:bg-gray-600/50 hover:text-white"
                                @click="handleClose"
                            >
                                ✕
                            </button>
                        </div>

                        <div v-if="hasResources" class="mb-4">
                            <h4 class="mb-2 text-sm font-medium text-gray-300">Ressources stockées</h4>
                            <div class="grid grid-cols-2 gap-2">
                                <div
                                    v-for="[resourceType, amount] in storedResources"
                                    :key="resourceType"
                                    class="flex items-center gap-2 rounded bg-gray-800/50 p-2"
                                >
                                    {{ resourceType }}
                                    <span class="text-sm text-white">{{ amount }}</span>
                                </div>
                            </div>
                        </div>

                        <div v-if="workerCount !== undefined" class="mb-4">
                            <h4 class="mb-2 text-sm font-medium text-gray-300">Ouvriers</h4>
                            <div class="flex items-center gap-2 rounded bg-gray-800/50 p-2">
                                WorkerIcon
                                <span class="text-sm text-white">{{ workerCount }} / {{ maxWorkers }}</span>
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <ActionButton label="Gérer" icon="settings" variant="primary" size="sm" @click="handleManage" />

                            <ActionButton v-if="canCollect" label="Collecter" icon="plus" variant="success" size="sm" @click="handleCollect" />
                        </div>
                    </div>
                </div>
                -->
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import type { TiledBuilding } from '@/game/objects/TiledBuilding';
import { useGameStore } from '@/game/stores/gameStore';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import ActionButton from './ActionButton.vue';
import BuildingIcon from './BuildingIcon.vue';

const gameStore = useGameStore();

const isVisible = ref(false);
const selectedBuilding = ref<TiledBuilding | null>(null);
const buildingData = ref<any>(null);

const buildingType = computed(() => buildingData.value?.getType() || '');
const buildingName = computed(() => buildingData.value?.getBuildingName() || '');

const storedResources = computed(() => {
    if (!buildingData.value) return [];

    const resources = buildingData.value.getAllBuildingResources();
    return Array.from(resources.entries()).filter(([_, amount]) => amount > 0);
});

const hasResources = computed(() => storedResources.value.length > 0);

const workerCount = computed(() => {
    if (!buildingData.value || typeof buildingData.value.getWorkerCount !== 'function') {
        return undefined;
    }
    return buildingData.value.getWorkerCount();
});

const maxWorkers = computed(() => {
    if (!buildingData.value || typeof buildingData.value.getMaxWorkers !== 'function') {
        return 0;
    }
    return buildingData.value.getMaxWorkers();
});

const canCollect = computed(() => {
    return hasResources.value && ['sawmill', 'mine', 'farm'].includes(buildingType.value);
});

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

const handleCollect = () => {
    if (!buildingData.value) return;

    const building = buildingData.value;
    let totalCollected = 0;

    storedResources.value.forEach(([resourceType, amount]) => {
        if (amount > 0) {
            const removed = building.removeResourceFromBuilding(resourceType, amount);
            gameStore.addResource(resourceType, removed);
            totalCollected += removed;
        }
    });

    if (totalCollected > 0) {
        window.dispatchEvent(
            new CustomEvent('game:resourcesCollected', {
                detail: { building, totalCollected },
            }),
        );
    }
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
.building-selection-fade-enter-active,
.building-selection-fade-leave-active {
    transition: opacity 0.3s ease;
}

.building-selection-fade-enter-from,
.building-selection-fade-leave-to {
    opacity: 0;
}

.building-card {
    animation: building-selection-slide-in 0.3s ease-out;
}

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
