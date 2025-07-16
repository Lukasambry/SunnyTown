import { defineStore } from 'pinia';
import { ref, computed, readonly, type Ref, nextTick } from 'vue';
import { ResourceType, type ResourceStack } from '@/game/types/ResourceSystemTypes';
import { ResourceManager } from '@/game/services/ResourceManager';
import { BuildingRegistry } from '@/game/services/BuildingRegistry';
import type { TiledBuilding } from '@/game/objects/TiledBuilding';
import type { Worker } from '@/game/objects/workers/Worker';

interface GameState {
    isGameLoaded: boolean;
    selectedBuilding: string | null;
    hoveredBuilding: TiledBuilding | null;
    buildings: TiledBuilding[];
    workers: Worker[];
    showBuildingPreview: boolean;
    showBuildingInfo: boolean;
    currentBuildingInfo: TiledBuilding | null;
    unlockedZones: string[]; // AJOUT pour la sauvegarde
}

export const useGameStore = defineStore('game', () => {
    // State
    const state: Ref<GameState> = ref({
        isGameLoaded: false,
        selectedBuilding: null,
        hoveredBuilding: null,
        buildings: [],
        workers: [],
        showBuildingPreview: false,
        showBuildingInfo: false,
        currentBuildingInfo: null,
        unlockedZones: [], // AJOUT pour la sauvegarde
    });

    // Player data
    const playerAvatar = ref<string>('');
    const playerLevel = ref<number>(1);
    const playerGold = ref<number>(0);
    const playerHealth = ref<{ current: number, max: number }>({ current: 100, max: 100 });
    const playerExperience = ref<{ current: number, nextLevel: number }>({ current: 0, nextLevel: 100 });

    // Player data
    const getPlayerAvatar = computed(() => playerAvatar.value);
    const getPlayerLevel = computed(() => playerLevel.value);
    const getPlayerGold = computed(() => playerGold.value);
    const getPlayerCurrentExperience = computed(() => playerExperience.value.current);
    const getPlayerNextLevelExperience = computed(() => playerExperience.value.nextLevel);
    const getPlayerCurrentHealth = computed(() => playerHealth.value.current);
    const getPlayerMaxHealth = computed(() => playerHealth.value.max);

    // Player actions
    const updatePlayerAvatar = (avatar: string) => {
        playerAvatar.value = avatar;
    };

    const updatePlayerLevel = (level: number) => {
        const oldLevel = playerLevel.value;
        playerLevel.value = level;

        if (oldLevel !== level && level > oldLevel) {
            window.dispatchEvent(new CustomEvent('game:levelUp', {
                detail: { oldLevel, newLevel: level }
            }));
        }
    };

    const updatePlayerGold = (gold: number) => {
        playerGold.value = gold;

        window.dispatchEvent(new CustomEvent('game:goldChanged', {
            detail: { gold }
        }));
    };

    const updatePlayerHealth = (health: { current: number, max: number }) => {
        playerHealth.value = {...health};
    };

    const updatePlayerExperience = (experience: { current: number, nextLevel: number }) => {
        playerExperience.value = {...experience};
    };

    const resourcesMap = ref<Map<ResourceType, number>>(new Map());
    const resourceUpdateTrigger = ref(0);

    let resourceManager: ResourceManager | null = null;
    let buildingRegistry: BuildingRegistry | null = null;

    const initializeManagers = () => {
        try {
            if (!resourceManager) {
                resourceManager = ResourceManager.getInstance();
            }
            if (!buildingRegistry) {
                buildingRegistry = BuildingRegistry.getInstance();
            }
            return true;
        } catch (error) {
            console.error('Error initializing game store managers:', error);
            return false;
        }
    };

    // AMÉLIORATION: Synchronisation bidirectionnelle avec ResourceManager
    const initializeResourceSync = () => {
        if (!initializeManagers() || !resourceManager) {
            console.error('ResourceManager not available for sync');
            return;
        }

        try {
            // NOUVEAU: Setup listener pour les changements ResourceManager
            resourceManager.getGlobalInventory().on('change', (event: any) => {
                resourcesMap.value.set(event.type, event.newAmount);
                resourcesMap.value = new Map(resourcesMap.value);
                resourceUpdateTrigger.value++;

                nextTick(() => {
                    console.log('Vue reactivity updated for resource change');
                });
            });

            // Sync initial depuis ResourceManager vers Vue
            Object.values(ResourceType).forEach((resourceType) => {
                try {
                    const amount = resourceManager?.getResource(resourceType);
                    resourcesMap.value.set(resourceType, amount ?? 0);
                } catch (error) {
                    console.warn(`Failed to sync ${resourceType}:`, error);
                }
            });

            resourcesMap.value = new Map(resourcesMap.value);
            resourceUpdateTrigger.value++;

            console.log('Resource sync initialized successfully');
        } catch (error) {
            console.error('Failed to initialize resource sync:', error);
        }
    };

    const syncResourcesFromManager = () => {
        if (!resourceManager) return;

        try {
            const allResources = resourceManager.getGlobalInventory().getAllResources();
            resourcesMap.value = new Map(allResources);
            resourceUpdateTrigger.value++;
        } catch (error) {
            console.error('Error syncing resources from manager:', error);
        }
    };

    const forceResourceUpdate = () => {
        if (!resourceManager) return;

        try {
            syncResourcesFromManager();
        } catch (error) {
            console.error('Error forcing resource update:', error);
        }
    };

    const isGameReady = computed(() => state.value.isGameLoaded);

    const resourceList = computed((): ResourceStack[] => {
        void resourceUpdateTrigger.value;

        if (!resourceManager) return [];

        try {
            return resourceManager.getGlobalInventory().getNonZeroResources();
        } catch (error) {
            console.error('Error getting resource list:', error);
            return [];
        }
    });

    const totalResources = computed(() => {
        void resourceUpdateTrigger.value;

        if (!resourceManager) return 0;

        try {
            return resourceManager.getGlobalInventory().getTotalItems();
        } catch (error) {
            console.error('Error getting total resources:', error);
            return 0;
        }
    });

    const buildingCount = computed(() => state.value.buildings.length);
    const workerCount = computed(() => state.value.workers.length);

    const canAffordBuilding = computed(() => (buildingType: string, cost?: Record<string, number>) => {
        void resourceUpdateTrigger.value;

        if (!initializeManagers() || !resourceManager || !buildingRegistry) {
            return false;
        }

        try {
            if (cost) {
                const typedCost: Partial<Record<ResourceType, number>> = {};
                Object.entries(cost).forEach(([resource, amount]) => {
                    if (Object.values(ResourceType).includes(resource as ResourceType)) {
                        typedCost[resource as ResourceType] = amount;
                    }
                });
                return resourceManager.canAfford(typedCost);
            } else {
                return buildingRegistry.canAffordBuilding(buildingType);
            }
        } catch (error) {
            console.error('Error checking if can afford building:', error);
            return false;
        }
    });

    const getResourceAmount = computed(() => (type: ResourceType): number => {
        void resourceUpdateTrigger.value;

        if (!resourceManager) return 0;

        try {
            return resourceManager.getResource(type);
        } catch (error) {
            console.error(`Error getting resource ${type}:`, error);
            return 0;
        }
    });

    // Getters robustes
    const getResourceManager = () => {
        if (!initializeManagers() || !resourceManager) {
            console.error('ResourceManager not available');
            return null;
        }
        return resourceManager;
    };

    const getPlayerInventorySpace = (resourceType: ResourceType): number => {
        const resourceManager = getResourceManager();
        if (!resourceManager) return 0;

        try {
            const inventory = resourceManager.getGlobalInventory();
            const currentAmount = inventory.getResource(resourceType);
            const maxStack = resourceManager.getStackSize(resourceType);
            return maxStack - currentAmount;
        } catch (error) {
            console.error('Error getting player inventory space:', error);
            return 0;
        }
    };

    const getStackSize = (resourceType: ResourceType): number => {
        if (!initializeManagers() || !resourceManager) {
            return 0;
        }

        try {
            return resourceManager.getStackSize(resourceType);
        } catch (error) {
            console.error('Error getting stack size:', error);
            return 0;
        }
    };

    const getBuildingRegistry = () => {
        if (!initializeManagers() || !buildingRegistry) {
            console.error('BuildingRegistry not available');
            return null;
        }
        return buildingRegistry;
    };

    // Actions
    const setGameLoaded = (loaded: boolean) => {
        state.value.isGameLoaded = loaded;

        if (loaded) {
            if (initializeManagers()) {
                initializeResourceSync();

                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('game:initializeSaveSystem'));
                }, 100);

                // SUPPRIMER l'ajout automatique de ressources ici
                // (maintenant géré par le système unifié qui vérifie s'il y a déjà des données)
                console.log('GameStore chargé - système unifié actif');
            }
        }
    };

    // AMÉLIORÉ: Actions avec vérifications de réactivité
    const updateResource = (type: ResourceType, amount: number) => {
        if (!resourceManager) {
            console.error('ResourceManager not available for updateResource');
            return;
        }

        try {
            const current = resourceManager.getResource(type);
            if (current !== amount) {
                if (amount > current) {
                    resourceManager.addResource(type, amount - current, 'vue_sync');
                } else {
                    resourceManager.removeResource(type, current - amount, 'vue_sync');
                }
            }

            // Force la mise à jour de la réactivité Vue
            resourcesMap.value.set(type, amount);
            resourcesMap.value = new Map(resourcesMap.value);
            resourceUpdateTrigger.value++;
        } catch (error) {
            console.error('Error updating resource:', error);
        }
    };

    const addResource = (type: ResourceType, amount: number): number => {
        if (!resourceManager) {
            console.error('ResourceManager not available for addResource');
            return 0;
        }
        try {
            window.dispatchEvent(new CustomEvent('game:resourceChanged', {
                detail: { type, amount: amount, action: 'add' }
            }));

            return resourceManager.addResource(type, amount, 'game_store');
        } catch (error) {
            console.error('Error adding resource:', error);
            return 0;
        }
    };

    const removeResource = (type: ResourceType, amount: number): number => {
        if (!resourceManager) {
            console.error('ResourceManager not available for removeResource');
            return 0;
        }
        try {
            window.dispatchEvent(new CustomEvent('game:resourceChanged', {
                detail: { type, amount: amount, action: 'remove' }
            }));
            return resourceManager.removeResource(type, amount, 'game_store');
        } catch (error) {
            console.error('Error removing resource:', error);
            return 0;
        }
    };

    // Actions pour les bâtiments
    const purchaseBuilding = (buildingType: string): boolean => {
        if (!initializeManagers() || !buildingRegistry) {
            console.error('BuildingRegistry not available for purchase');
            return false;
        }

        try {
            const canAfford = buildingRegistry.canAffordBuilding(buildingType);
            if (!canAfford) {
                console.log(`Cannot afford building: ${buildingType}`);
                return false;
            }

            const success = buildingRegistry.deductBuildingCost(buildingType, 'building_purchase');
            if (success) {
                console.log(`Successfully purchased building: ${buildingType}`);
            }
            return success;
        } catch (error) {
            console.error(`Error purchasing building ${buildingType}:`, error);
            return false;
        }
    };

    const getBuildingAffordability = (buildingType: string) => {
        if (!initializeManagers() || !buildingRegistry) {
            return { canAfford: false, missing: [] };
        }

        try {
            return buildingRegistry.getAffordabilityDetails(buildingType);
        } catch (error) {
            console.error(`Error getting affordability for ${buildingType}:`, error);
            return { canAfford: false, missing: [] };
        }
    };

    // Actions existantes...
    const selectBuilding = (buildingType: string | null) => {
        state.value.selectedBuilding = buildingType;
        state.value.showBuildingPreview = buildingType !== null;
    };

    const showBuildingInfo = (building: TiledBuilding) => {
        state.value.currentBuildingInfo = building;
        state.value.showBuildingInfo = true;
    };

    const hideBuildingInfo = () => {
        state.value.currentBuildingInfo = null;
        state.value.showBuildingInfo = false;
    };

    const addBuilding = (building: TiledBuilding) => {
        state.value.buildings.push(building);
    };

    const removeBuilding = (building: TiledBuilding) => {
        const index = state.value.buildings.indexOf(building);
        if (index !== -1) {
            state.value.buildings.splice(index, 1);
        }
    };

    const clearBuildings = () => {
        state.value.buildings = [];
    };

    const addWorker = (worker: Worker) => {
        state.value.workers.push(worker);
    };

    const removeWorker = (worker: Worker) => {
        const index = state.value.workers.indexOf(worker);
        if (index !== -1) {
            state.value.workers.splice(index, 1);
        }
    };

    const resetGameState = () => {
        state.value = {
            isGameLoaded: false,
            selectedBuilding: null,
            hoveredBuilding: null,
            buildings: [],
            workers: [],
            showBuildingPreview: false,
            showBuildingInfo: false,
            currentBuildingInfo: null,
            unlockedZones: [] // Réinitialisation des zones débloquées
        };

        if (resourceManager) {
            try {
                resourceManager.getGlobalInventory().clear();
            } catch (error) {
                console.error('Error clearing resource manager:', error);
            }
        }

        resourcesMap.value.clear();
        resourceUpdateTrigger.value++;
    };

    const manualSave = () => {
        try {
            window.dispatchEvent(new CustomEvent('game:requestManualSave'));
        } catch (error) {
            console.error('Erreur sauvegarde manuelle:', error);
        }
    };

    const resetGame = () => {
        try {
            if (confirm('Êtes-vous sûr de vouloir recommencer une nouvelle partie ? Toutes vos données seront perdues.')) {
                window.dispatchEvent(new CustomEvent('game:requestGameReset'));
            }
        } catch (error) {
            console.error('Erreur réinitialisation:', error);
        }
    };

    const exportSave = () => {
        try {
            window.dispatchEvent(new CustomEvent('game:requestExportSave'));
        } catch (error) {
            console.error('Erreur export:', error);
        }
    };

    const importSave = () => {
        try {
            window.dispatchEvent(new CustomEvent('game:requestImportSave'));
        } catch (error) {
            console.error('Erreur import:', error);
        }
    };

    // Méthode pour appliquer toutes les données d'une sauvegarde
    const applySaveData = (saveData: any) => {
        if (!saveData) return;

        console.log('[GameStore] Application des données de sauvegarde:', saveData);

        // Player data (fonctionne déjà)
        if (saveData.player) {
            updatePlayerLevel(saveData.player.level ?? 1);
            updatePlayerGold(saveData.player.gold ?? 0);
            updatePlayerHealth(saveData.player.health ?? { current: 100, max: 100 });
            updatePlayerExperience({
                current: saveData.player.currentExperience ?? 0,
                nextLevel: saveData.player.nextLevelExperience ?? 100
            });
            updatePlayerAvatar(saveData.player.avatar ?? 'default');
        }

        // Resources (fonctionne déjà)
        if (saveData.resources) {
            Object.entries(saveData.resources).forEach(([type, amount]) => {
                updateResource(type as ResourceType, amount as number);
            });
            forceResourceUpdate();
            console.log('[GameStore] Ressources appliquées:', saveData.resources);
        }

        // CORRECTION: Bâtiments
        if (Array.isArray(saveData.buildings)) {
            console.log('[GameStore] Application de', saveData.buildings.length, 'bâtiments');

            // Nettoyer les bâtiments existants
            clearBuildings();

            // Dispatcher l'événement pour que MainScene.buildingManager les charge
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('game:loadBuildings', {
                    detail: { buildings: saveData.buildings, source: 'saveData' }
                }));
            }, 100);
        }

        // CORRECTION: Zones débloquées
        if (Array.isArray(saveData.unlockedZones)) {
            console.log('[GameStore] Application de', saveData.unlockedZones.length, 'zones débloquées');

            // Mettre à jour l'état local
            state.value.unlockedZones = [...saveData.unlockedZones];

            // Dispatcher les événements pour que ZoneBlockerService les applique
            saveData.unlockedZones.forEach((zoneName: string) => {
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('game:unlockZone', {
                        detail: { zoneName, fromLoad: true }
                    }));
                }, 200);
            });

            console.log('[GameStore] Zones débloquées appliquées:', state.value.unlockedZones);
        }
    };

    /*
    if (process.env.NODE_ENV === 'development') {
      watch(resourceUpdateTrigger, (newVal) => {
        console.log('Resource update trigger changed:', newVal);
      });

      watch(resourcesMap, (newMap) => {
        console.log('Resources map updated:', Object.fromEntries(newMap));
      }, { deep: true });
    }
    */

    const applyLoadedData = (loadedData: any) => {
        if (!loadedData) {
            console.warn('[GameStore] Aucune donnée à appliquer');
            return;
        }

        playerLevel.value = loadedData.player.level ?? playerLevel.value;
        playerExperience.value.current = loadedData.player.currentExperience ?? playerExperience.value.current;
        playerExperience.value.nextLevel = loadedData.player.nextLevelExperience ?? playerExperience.value.nextLevel;
        playerGold.value = loadedData.player.gold ?? playerGold.value;
        playerHealth.value = loadedData.player.health ?? playerHealth.value;
        playerAvatar.value = loadedData.player.avatar ?? playerAvatar.value;


        resourcesMap.value = new Map(
            Object.entries(loadedData.resources ?? {}).map(([key, value]) => [key as ResourceType, value as number])
        );
        state.value.buildings = loadedData.buildings ?? [];
        state.value.unlockedZones = loadedData.unlockedZones ?? [];

        console.log('[GameStore] Données appliquées:', {
            playerLevel: playerLevel.value,
            playerGold: playerGold.value,
            playerHealth: playerHealth.value,
            playerAvatar: playerAvatar.value,
            resources: resourcesMap.value,
            buildings: state.value.buildings,
            unlockedZones: state.value.unlockedZones
        });
    };


    if (typeof window !== 'undefined') {
        (window as any).gameStore = {
            get playerLevel() { return playerLevel.value; },
            get playerGold() { return playerGold.value; },
            get playerHealth() { return { ...playerHealth.value }; },
            get playerExperience() { return { ...playerExperience.value }; },
            get playerAvatar() { return playerAvatar.value; },

            updatePlayerLevel,
            updatePlayerGold,
            updatePlayerHealth,
            updatePlayerExperience,
            updatePlayerAvatar,
            updateResource,
            addResource,
            removeResource,

           getResourceAmount: (type: ResourceType): number => {
                try {
                    if (!initializeManagers() || !resourceManager) {
                        return 0;
                    }
                    return resourceManager.getResource(type) || 0;
                } catch (error) {
                    console.warn(`Erreur récupération ressource ${type}:`, error);
                    return 0;
                }
            },

           manualSave,
            resetGame,
            exportSave,
            importSave,
            applySaveData,
            applyLoadedData,
        };
    }

    return {
        // State
        state: readonly(state),
        resourcesMap: readonly(resourcesMap),
        playerAvatar: readonly(playerAvatar),
        playerLevel: readonly(playerLevel),
        playerGold: readonly(playerGold),
        playerHealth: readonly(playerHealth),
        playerExperience: readonly(playerExperience),

        // Getters
        isGameReady,
        resourceList,
        totalResources,
        buildingCount,
        workerCount,
        canAffordBuilding,
        getResourceAmount,
        getPlayerAvatar,
        getPlayerLevel,
        getPlayerGold,
        getPlayerCurrentExperience,
        getPlayerNextLevelExperience,
        getPlayerCurrentHealth,
        getPlayerMaxHealth,

        // Actions
        setGameLoaded,
        updateResource,
        addResource,
        removeResource,
        purchaseBuilding,
        getBuildingAffordability,
        forceResourceUpdate, // NOUVEAU
        selectBuilding,
        showBuildingInfo,
        hideBuildingInfo,
        addBuilding,
        removeBuilding,
        clearBuildings,
        addWorker,
        removeWorker,
        resetGameState,
        syncResourcesFromManager,
        updatePlayerAvatar,
        updatePlayerLevel,
        updatePlayerGold,
        updatePlayerHealth,
        updatePlayerExperience,
        manualSave,
        resetGame,
        exportSave,
        importSave,


        // Resource Manager access
        getResourceManager,
        getBuildingRegistry,
        applySaveData,
        applyLoadedData,
    };
});
