<template>
  <Teleport to="body">
    <Transition name="building-selection-fade">
      <div 
        v-if="isVisible" 
        class="building-selection-overlay fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
      >
        <div class="building-selection-content pointer-events-auto">
          <div class="building-card bg-gray-900/95 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl p-6 min-w-96">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <BuildingIcon :building-type="buildingType" :size="24" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">{{ buildingName }}</h3>
                  <p class="text-sm text-gray-400">{{ buildingType }}</p>
                </div>
              </div>
              
              <button
                class="w-8 h-8 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                @click="handleClose"
              >
                ✕
              </button>
            </div>

            <!-- Resources Section -->
            <div v-if="hasResources" class="mb-4">
              <h4 class="text-sm font-medium text-gray-300 mb-2">Ressources stockées</h4>
              <div class="grid grid-cols-2 gap-2">
                <div 
                  v-for="[resourceType, amount] in storedResources" 
                  :key="resourceType"
                  class="flex items-center gap-2 p-2 bg-gray-800/50 rounded"
                >
                  {{ resourceType }}
                  <span class="text-white text-sm">{{ amount }}</span>
                </div>
              </div>
            </div>

            <!-- Workers Section -->
            <div v-if="workerCount !== undefined" class="mb-4">
              <h4 class="text-sm font-medium text-gray-300 mb-2">Ouvriers</h4>
              <div class="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                WorkerIcon
                <span class="text-white text-sm">{{ workerCount }} / {{ maxWorkers }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <ActionButton
                label="Gérer"
                icon="settings"
                variant="primary"
                size="sm"
                @click="handleManage"
              />
              
              <ActionButton
                v-if="canCollect"
                label="Collecter"
                icon="plus"
                variant="success"
                size="sm"
                @click="handleCollect"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useGameStore } from '@/game/stores/gameStore';
import type { TiledBuilding } from '@/game/objects/TiledBuilding';
import type { ResourceType } from '@/game/types/ResourceSystemTypes';
import BuildingIcon from './BuildingIcon.vue';
import ActionButton from './ActionButton.vue';

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
  const { building, buildingName: name } = event.detail;
  
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
    window.dispatchEvent(new CustomEvent('game:resourcesCollected', {
      detail: { building, totalCollected }
    }));
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