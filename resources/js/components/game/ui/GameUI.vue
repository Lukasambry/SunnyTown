<template>
    <div class="game-ui-overlay">
        <div class="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 gap-2">
            <ActionButton
                :icon="isCameraFollowingPlayer ? 'info' : 'settings'"
                :label="isCameraFollowingPlayer ? 'Suivi joueur' : 'Caméra libre'"
                variant="primary"
                size="md"
                @click="toggleCameraMode"
            />
        </div>
        <!-- Resource Display -->
        <ResourceDisplay :show-resource-list="true" :max-visible-resources="8" />

        <!-- Building UI -->
        <BuildingUI />

        <!-- Save Game Button -->
        <SaveGameButton />

        <!-- Building FAB Button -->
        <BuildingFabButton />

        <!-- Building Info Modal -->
        <BuildingInfoModal />
        <BuildingSelectionOverlay />

        <!-- Zone Overlay -->
        <ZoneBlockerOverlay />

        <!-- Notification System -->
        <NotificationSystem />

        <Level
            :avatar="gameStore.playerAvatar"
            :level="gameStore.playerLevel"
            :gold="gameStore.playerGold"
            :health="gameStore.playerHealth"
            :experience="gameStore.playerExperience"
        />

        <!-- Debug Panel (Development only) -->
        <DebugPanel v-if="isDevelopment" />

        <!-- Debug resource info -->
        <!--
        <div v-if="isDevelopment" class="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs">
          Resources: {{ totalResources }} | Updates: {{ resourceUpdateCount }}
        </div>
        -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useGameStore } from '@game/stores/gameStore.ts'
import { ResourceType } from '@game/types/ResourceSystemTypes.ts'
import ResourceDisplay from './ResourceDisplay.vue'
import BuildingUI from './BuildingUI.vue'
import BuildingFabButton from './BuildingFabButton.vue'
import BuildingInfoModal from './BuildingInfoModal.vue'
import BuildingSelectionOverlay from './BuildingSelectionOverlay.vue'
import ZoneBlockerOverlay from './ZoneBlockerOverlay.vue'
import NotificationSystem from './NotificationSystem.vue'
import DebugPanel from './DebugPanel.vue'
import ActionButton from './ActionButton.vue'
import Level from '@/components/game/ui/Level.vue';
import SaveGameButton from '@/components/game/ui/SaveGameButton.vue';

const gameStore = useGameStore();

const isDevelopment = import.meta.env.DEV;

const resourceUpdateCount = ref(0);
const totalResources = ref(0);
const isCameraFollowingPlayer = ref(true);

const handleGameEvents = () => {
    const handleResourceUpdate = (event: CustomEvent) => {
        const { type, amount } = event.detail;

        try {
            gameStore.updateResource(type as ResourceType, amount);
            resourceUpdateCount.value++;
            totalResources.value = gameStore.totalResources;
        } catch (error) {
            console.error('Error updating resource in GameUI:', error);
        }
    };

    const handleResourceHarvested = (event: CustomEvent) => {
        const { type, amount } = event.detail;
        gameStore.forceResourceUpdate();

        window.dispatchEvent(
            new CustomEvent('game:notification', {
                detail: {
                    type: 'success',
                    title: 'Ressource récoltée',
                    message: `+${amount} ${getResourceName(type)}`,
                    duration: 2000,
                },
            }),
        );
    };

    const handleResourceDebug = (event: CustomEvent) => {
        if (isDevelopment) {
            const { totalResources: total } = event.detail;
            totalResources.value = total;
        }
    };

    // Building events
    const handleBuildingPlaced = (event: CustomEvent) => {
        const { building } = event.detail;

        gameStore.addBuilding(building);
        gameStore.forceResourceUpdate();
    };

    const handleBuildingDestroyed = (event: CustomEvent) => {
        const { building } = event.detail;
        gameStore.removeBuilding(building);
    };

    const handleBuildingInfo = (event: CustomEvent) => {
        const { building } = event.detail;
        gameStore.showBuildingInfo(building);
    };

    const handleWorkerCreated = (event: CustomEvent) => {
        const { worker } = event.detail;
        gameStore.addWorker(worker);
    };

    const handleWorkerRemoved = (event: CustomEvent) => {
        const { worker } = event.detail;
        gameStore.removeWorker(worker);
    };

    const handleGameReady = (event: CustomEvent) => {
        gameStore.setGameLoaded(true);

        if (event.detail.allResources) {
            Object.entries(event.detail.allResources).forEach(([type, amount]) => {
                gameStore.updateResource(type as ResourceType, amount as number);
            });
        }

        totalResources.value = event.detail.totalResources || 0;
    };

    const handleBuildingPlacementComplete = (event: CustomEvent) => {
        const { buildingType } = event.detail;

        gameStore.forceResourceUpdate();

        window.dispatchEvent(
            new CustomEvent('game:notification', {
                detail: {
                    type: 'success',
                    title: 'Bâtiment construit',
                    message: `${getBuildingName(buildingType)} placé avec succès`,
                    duration: 3000,
                },
            }),
        );
    };

    const handleBuildingPlacementCancelled = () => {
        gameStore.selectBuilding(null);
    };

    //Player events
    const handlePlayerAvatarUpdate = (event: CustomEvent) => {
        const { avatar } = event.detail;
        gameStore.updatePlayerAvatar(avatar);
    };

    const handlePlayerLevelUpdate = (event: CustomEvent) => {
        const { level } = event.detail;
        gameStore.updatePlayerLevel(level);
    };

    const handlePlayerGoldUpdate = (event: CustomEvent) => {
        const { gold } = event.detail;
        gameStore.updatePlayerGold(gold);
    };

    const handlePlayerHealthUpdate = (event: CustomEvent) => {
        const { health } = event.detail;
        gameStore.updatePlayerHealth(health);
    };

    const handlePlayerExperienceUpdate = (event: CustomEvent) => {
        const { experience } = event.detail;
        gameStore.updatePlayerExperience(experience);
    };

    // Fonction helper pour obtenir le nom d'une ressource
    const getResourceName = (type: string): string => {
        try {
            const resourceManager = gameStore.getResourceManager();
            return resourceManager?.getName(type as ResourceType) || type;
        } catch (error) {
            return type;
        }
    };

    // Fonction helper pour obtenir le nom d'un bâtiment
    const getBuildingName = (type: string): string => {
        try {
            const buildingRegistry = gameStore.getBuildingRegistry();
            return buildingRegistry?.getBuildingName(type) || type;
        } catch (error) {
            return type;
        }
    };

    window.addEventListener('game:resourceUpdate', handleResourceUpdate);
    window.addEventListener('game:resourceHarvested', handleResourceHarvested);
    window.addEventListener('game:resourceDebug', handleResourceDebug);
    window.addEventListener('game:buildingPlaced', handleBuildingPlaced);
    window.addEventListener('game:buildingDestroyed', handleBuildingDestroyed);
    window.addEventListener('game:buildingInfo', handleBuildingInfo);
    window.addEventListener('game:buildingPlacementComplete', handleBuildingPlacementComplete);
    window.addEventListener('game:buildingPlacementCancelled', handleBuildingPlacementCancelled);
    window.addEventListener('game:workerCreated', handleWorkerCreated);
    window.addEventListener('game:workerRemoved', handleWorkerRemoved);
    window.addEventListener('game:playerAvatarUpdate', handlePlayerAvatarUpdate);
    window.addEventListener('game:playerLevelUpdate', handlePlayerLevelUpdate);
    window.addEventListener('game:playerGoldUpdate', handlePlayerGoldUpdate);
    window.addEventListener('game:playerHealthUpdate', handlePlayerHealthUpdate);
    window.addEventListener('game:playerExperienceUpdate', handlePlayerExperienceUpdate);
    window.addEventListener('game:ready', handleGameReady);

    return () => {
        window.removeEventListener('game:resourceUpdate', handleResourceUpdate);
        window.removeEventListener('game:resourceHarvested', handleResourceHarvested);
        window.removeEventListener('game:resourceDebug', handleResourceDebug);
        window.removeEventListener('game:buildingPlaced', handleBuildingPlaced);
        window.removeEventListener('game:buildingDestroyed', handleBuildingDestroyed);
        window.removeEventListener('game:buildingInfo', handleBuildingInfo);
        window.removeEventListener('game:buildingPlacementComplete', handleBuildingPlacementComplete);
        window.removeEventListener('game:buildingPlacementCancelled', handleBuildingPlacementCancelled);
        window.removeEventListener('game:workerCreated', handleWorkerCreated);
        window.removeEventListener('game:workerRemoved', handleWorkerRemoved);
        window.removeEventListener('game:playerAvatarUpdate', handlePlayerAvatarUpdate);
        window.removeEventListener('game:playerLevelUpdate', handlePlayerLevelUpdate);
        window.removeEventListener('game:playerGoldUpdate', handlePlayerGoldUpdate);
        window.removeEventListener('game:playerHealthUpdate', handlePlayerHealthUpdate);
        window.removeEventListener('game:playerExperienceUpdate', handlePlayerExperienceUpdate);
        window.removeEventListener('game:ready', handleGameReady);
    };
};

const setupStoreWatchers = () => {
    watch(
        () => gameStore.totalResources,
        (newTotal) => {
            totalResources.value = newTotal;
        },
        { immediate: true },
    );

    watch(
        () => gameStore.resourceList,
        (newList) => {
            resourceUpdateCount.value++;
        },
        { deep: true, immediate: true },
    );

    watch(
        () => gameStore.isGameReady,
        (isReady) => {
            if (isReady) {
                gameStore.forceResourceUpdate();
            }
        },
    );
};

function toggleCameraMode() {
    isCameraFollowingPlayer.value = !isCameraFollowingPlayer.value;
    window.dispatchEvent(new CustomEvent('game:toggleCameraMode'));
}

// Lifecycle
onMounted(() => {
    const cleanup = handleGameEvents();
    setupStoreWatchers();

    onUnmounted(() => {
        cleanup();
    });
});
</script>

<style scoped>
.game-ui-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1000;
}

.game-ui-overlay > * {
    pointer-events: auto;
}
</style>
