<template>
    <div class="worker-assignment space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                Ouvriers assignés
            </h3>
            <div class="text-xs text-gray-400">
                {{ assignedWorkerCount }}/{{ maxWorkers }}
            </div>
        </div>

        <div class="bg-gray-800/50 rounded-lg p-4 space-y-3">
            <div class="flex items-center justify-between">
                <span class="text-sm text-gray-300">{{ workerTypeName }}</span>
                <div class="flex items-center gap-2">
                    <button
                        @click="decrementWorker"
                        :disabled="!canDecrement"
                        class="w-8 h-8 rounded-lg bg-red-600/20 hover:bg-red-600/30 disabled:bg-gray-700/50 disabled:opacity-50 flex items-center justify-center text-red-400 disabled:text-gray-500 transition-colors"
                    >
                        -
                    </button>

                    <span class="min-w-[2rem] text-center text-white font-medium">
                        {{ assignedWorkerCount }}
                    </span>

                    <button
                        @click="incrementWorker"
                        :disabled="!canIncrement"
                        class="w-8 h-8 rounded-lg bg-green-600/20 hover:bg-green-600/30 disabled:bg-gray-700/50 disabled:opacity-50 flex items-center justify-center text-green-400 disabled:text-gray-500 transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            <div class="w-full bg-gray-700 rounded-full h-2">
                <div
                    class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${progressPercentage}%` }"
                ></div>
            </div>

            <div class="text-xs text-gray-400">
                Ouvriers disponibles: {{ availableNeutralWorkers }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useGameStore } from '@/game/stores/gameStore'
import { WorkerRegistry } from '@/game/services/WorkerRegistry'
import { BuildingRegistry } from '@/game/services/BuildingRegistry'
import { WorkerType } from '@/game/types/WorkerConfigTypes'
import type { TiledBuilding } from '@/game/objects/TiledBuilding'

interface Props {
    building: TiledBuilding
}


let pollingInterval: number | null = null;
const props = defineProps<Props>()

const assignedWorkerCount = ref(0)
const maxWorkers = ref(0)
const availableNeutralWorkers = ref(0)

const workerTypeName = computed(() => {
    try {
        const buildingType = props.building.getType()
        const buildingConfig = BuildingRegistry.getInstance().getBuildingConfig(buildingType)

        if (!buildingConfig || buildingConfig.workerType === WorkerType.NEUTRAL) {
            return 'Aucun ouvrier'
        }

        return WorkerRegistry.getInstance().getWorkerName(buildingConfig.workerType)
    } catch (error) {
        console.error('Error getting worker type name:', error)
        return 'Ouvrier'
    }
})

const canIncrement = computed(() => {
    return assignedWorkerCount.value < maxWorkers.value && availableNeutralWorkers.value > 0
})

const canDecrement = computed(() => {
    return assignedWorkerCount.value > 0
})

const progressPercentage = computed(() => {
    if (maxWorkers.value === 0) return 0
    return (assignedWorkerCount.value / maxWorkers.value) * 100
})

// FIX 1: Améliorer updateWorkerData avec une meilleure synchronisation
const updateWorkerData = async () => {
    try {
        const buildingType = props.building.getType();
        console.log(`Updating worker data for building type: ${buildingType}`);

        const buildingConfig = BuildingRegistry.getInstance().getBuildingConfig(buildingType);
        if (buildingConfig) {
            maxWorkers.value = buildingConfig.maxWorkers || 0;
            console.log(`Max workers set to: ${maxWorkers.value}`);
        }

        // FIX 2: Forcer une synchronisation directe avec le bâtiment
        const currentAssigned = props.building.getAssignedWorkerCount();
        console.log(`Current assigned from building: ${currentAssigned}`);

        // Mettre à jour immédiatement la valeur reactive
        assignedWorkerCount.value = currentAssigned;

        console.log(`Building ${buildingType}: ${assignedWorkerCount.value}/${maxWorkers.value} workers`);
        console.log('Assigned worker IDs:', props.building.getAssignedWorkerIds());

        // Attendre la prochaine tick pour s'assurer que la réactivité est mise à jour
        await nextTick();
        console.log(`After nextTick - assignedWorkerCount: ${assignedWorkerCount.value}`);

    } catch (error) {
        console.error('Error updating worker data:', error);
        assignedWorkerCount.value = 0;
        maxWorkers.value = 0;
    }
}

const updateAvailableWorkers = () => {
    console.log('Requesting available workers...');
    window.dispatchEvent(new CustomEvent('game:requestAvailableWorkers'));
}

const incrementWorker = () => {
    if (!canIncrement.value) return

    console.log('Incrementing worker - current count:', assignedWorkerCount.value);

    window.dispatchEvent(new CustomEvent('game:assignWorkerToBuilding', {
        detail: { building: props.building }
    }))
}

const decrementWorker = () => {
    if (!canDecrement.value) return

    console.log('Decrementing worker - current count:', assignedWorkerCount.value);

    window.dispatchEvent(new CustomEvent('game:unassignWorkerFromBuilding', {
        detail: { building: props.building }
    }))
}

// FIX 3: Améliorer la gestion des événements d'assignation
const handleWorkerAssigned = async (event: CustomEvent) => {
    console.log('Worker assigned event received:', event.detail);

    const currentBuildingId = props.building.getBuildingId();
    const eventBuildingId = event.detail.buildingId;

    console.log(`Current building ID: "${currentBuildingId}"`);
    console.log(`Event building ID: "${eventBuildingId}"`);

    // FIX 4: Améliorer la comparaison des IDs
    const idsMatch = currentBuildingId && eventBuildingId && currentBuildingId === eventBuildingId;

    if (idsMatch) {
        console.log('Event matches current building, updating data');

        // Utiliser la valeur du détail de l'événement comme source de vérité
        const newCount = event.detail.assignedCount || 0;
        assignedWorkerCount.value = newCount;

        console.log(`Updated assignedWorkerCount to: ${assignedWorkerCount.value}`);

        // Mettre à jour les données et les workers disponibles
        await updateWorkerData();
        updateAvailableWorkers();

        // Forcer une mise à jour de la réactivité
        await nextTick();
    } else {
        console.log('Event does not match current building - ignoring');
        console.log('Match check details:', { idsMatch, currentBuildingId, eventBuildingId });
    }
}

const handleWorkerUnassigned = async (event: CustomEvent) => {
    console.log('Worker unassigned event received:', event.detail);

    const currentBuildingId = props.building.getBuildingId();
    const eventBuildingId = event.detail.buildingId;

    if (currentBuildingId && eventBuildingId && currentBuildingId === eventBuildingId) {
        console.log('Unassignment event matches current building');

        const newCount = event.detail.assignedCount || 0;
        assignedWorkerCount.value = newCount;

        await updateWorkerData();
        updateAvailableWorkers();

        await nextTick();
    }
}

const handleAvailableWorkersUpdate = (event: CustomEvent) => {
    console.log('Received available workers update:', event.detail);
    availableNeutralWorkers.value = event.detail.count || 0;
    console.log('Updated availableNeutralWorkers to:', availableNeutralWorkers.value);
}

// FIX 5: Améliorer l'initialisation du composant
onMounted(async () => {
    console.log('=== WorkerAssignmentUI MOUNTED DEBUG ===');
    console.log('Building object:', props.building);
    console.log('Building type:', props.building.getType());
    console.log('Building ID:', props.building.getBuildingId());
    console.log('Building assigned worker count:', props.building.getAssignedWorkerCount());
    console.log('Building max workers:', props.building.getMaxWorkers());
    console.log('=== END MOUNTED DEBUG ===');

    pollingInterval = setInterval(async () => {
        await updateWorkerData();
        updateAvailableWorkers();
    }, 2000);

    // Setup des event listeners
    window.addEventListener('game:workerAssignedToBuilding', handleWorkerAssigned)
    window.addEventListener('game:workerUnassignedFromBuilding', handleWorkerUnassigned)
    window.addEventListener('game:availableWorkersUpdate', handleAvailableWorkersUpdate)

    console.log('WorkerAssignmentUI mounted and initialized');
})

onUnmounted(() => {
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }

    window.removeEventListener('game:workerAssignedToBuilding', handleWorkerAssigned)
    window.removeEventListener('game:workerUnassignedFromBuilding', handleWorkerUnassigned)
    window.removeEventListener('game:availableWorkersUpdate', handleAvailableWorkersUpdate)

    console.log('WorkerAssignmentUI unmounted');
})

// FIX 6: Améliorer le watcher pour une meilleure réactivité
watch(() => props.building.getAssignedWorkerCount(), async (newCount) => {
    console.log('Detected change in assigned worker count:', newCount);

    if (newCount !== assignedWorkerCount.value) {
        assignedWorkerCount.value = newCount;
        await nextTick();
        console.log('Worker count synchronized:', assignedWorkerCount.value);
    }
}, { immediate: true });

// FIX 7: Watcher supplémentaire pour détecter les changements d'ID de bâtiment
watch(() => props.building.getBuildingId(), async (newId) => {
    console.log('Building ID changed to:', newId);
    if (newId) {
        await updateWorkerData();
        updateAvailableWorkers();
    }
}, { immediate: true });
</script>
