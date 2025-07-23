import { defineStore } from 'pinia';
import { ref, computed, readonly, type Ref, nextTick } from 'vue';
import { ResourceType, type ResourceStack } from '@/game/types/ResourceSystemTypes';
import { ResourceManager } from '@/game/services/ResourceManager';
import { BuildingRegistry } from '@/game/services/BuildingRegistry';
import type { TiledBuilding } from '@/game/objects/TiledBuilding';
import type { Worker } from '@/game/objects/workers/Worker';
import { gameSaveService } from '@/game/services/GameSaveService';

interface GameState {
    isGameLoaded: boolean;
    selectedBuilding: string | null;
    hoveredBuilding: TiledBuilding | null;
    buildings: TiledBuilding[];
    workers: Worker[];
    showBuildingPreview: boolean;
    showBuildingInfo: boolean;
    currentBuildingInfo: TiledBuilding | null;
    unlockedZones: string[];
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
        unlockedZones: [],
    });

    // Player data
    const playerAvatar = ref<string>('');
    const playerLevel = ref<number>(1);
    const playerGold = ref<number>(0);
    const playerHealth = ref<{ current: number, max: number }>({ current: 100, max: 100 });
    const playerExperience = ref<{ current: number, nextLevel: number }>({ current: 0, nextLevel: 100 });

    // Player data getters
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

    // Resources
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

    const initializeResourceSync = () => {
        if (!initializeManagers() || !resourceManager) {
            console.error('ResourceManager not available for sync');
            return;
        }

        try {
            resourceManager.getGlobalInventory().on('change', (event: any) => {
                resourcesMap.value.set(event.type, event.newAmount);
                resourcesMap.value = new Map(resourcesMap.value);
                resourceUpdateTrigger.value++;

                nextTick(() => {
                    console.log('Vue reactivity updated for resource change');
                });
            });

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

    // Computed properties
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

    // Resource Manager getters
    const getResourceManager = () => {
        if (!initializeManagers() || !resourceManager) {
            console.error('ResourceManager not available');
            return null;
        }
        return resourceManager;
    };

    const getBuildingRegistry = () => {
        if (!initializeManagers() || !buildingRegistry) {
            console.error('BuildingRegistry not available');
            return null;
        }
        return buildingRegistry;
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

    const setGameLoaded = (loaded: boolean) => {
        state.value.isGameLoaded = loaded;

        if (loaded) {
            if (initializeManagers()) {
                initializeResourceSync();

                setTimeout(() => {
                    gameSaveService.initializeGame();
                    setupGameSaveEvents();
                }, 500);

                console.log('GameStore chargé - système unifié actif (AUCUNE ressource initiale)');
            }
        }
    };

    // Resource actions
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

    // Building actions
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

    // Save system integration
    const setupGameSaveEvents = (): void => {
        window.addEventListener('game:loadGameState', (event: CustomEvent) => {
            const { gameState } = event.detail;
            console.log('📥 Chargement état :', gameState);

            if (gameState.player) {
                updatePlayerLevel(gameState.player.level);
                updatePlayerGold(gameState.player.gold);
                updatePlayerExperience(gameState.player.experience);
                updatePlayerHealth(gameState.player.health);
                updatePlayerAvatar(gameState.player.avatar || 'default');
            }

            if (gameState.resources) {
                Object.entries(gameState.resources).forEach(([type, amount]) => {
                    updateResource(type.toUpperCase() as ResourceType, amount as number);
                });
                forceResourceUpdate();
            }

            if (gameState.buildings && gameState.buildings.length > 0) {
                console.log(`🏠 Chargement de ${gameState.buildings.length} bâtiments...`);
                clearBuildings();

                setTimeout(() => {
                    const buildingManager = (window as any).__BUILDING_MANAGER__;
                    if (buildingManager && typeof buildingManager.loadFromSaveData === 'function') {
                        buildingManager.loadFromSaveData(gameState.buildings);
                        console.log('✅ Bâtiments chargés via BuildingManager');
                    } else {
                        console.warn('⚠️ BuildingManager non disponible pour le chargement');
                        window.dispatchEvent(new CustomEvent('game:loadBuildings', {
                            detail: { buildings: gameState.buildings, source: 'gameSave' }
                        }));
                    }
                }, 100);
            }

            if (gameState.unlockedZones && gameState.unlockedZones.length > 0) {
                console.log(`🗺️ Chargement de ${gameState.unlockedZones.length} zones débloquées...`);
                state.value.unlockedZones = [...gameState.unlockedZones];

                gameState.unlockedZones.forEach((zoneName: string, index: number) => {
                    setTimeout(() => {
                        console.log(`🔓 Déblocage zone: ${zoneName}`);
                        window.dispatchEvent(new CustomEvent('game:unlockZoneBlocker', {
                            detail: { blockerName: zoneName, fromLoad: true }
                        }));
                    }, 200 + (index * 100));
                });
            }

            console.log('✅ État du jeu appliqué depuis système unifié');
        });

        window.addEventListener('game:buildingsChanged', () => {
            clearTimeout((window as any).__BUILDING_SAVE_TIMEOUT__);
            (window as any).__BUILDING_SAVE_TIMEOUT__ = setTimeout(() => {
                if (autoSaveEnabled) {
                    gameSaveService.save('auto').catch(error => {
                        console.warn('Échec sauvegarde auto après changement bâtiments:', error);
                    });
                }
            }, 2000);
        });

        window.addEventListener('game:zoneUnlocked', (event: CustomEvent) => {
            const { blockerName } = event.detail;
            if (blockerName && !state.value.unlockedZones.includes(blockerName)) {
                state.value.unlockedZones.push(blockerName);
                console.log(`🗺️ Zone ajoutée aux zones débloquées: ${blockerName}`);

                setTimeout(() => {
                    gameSaveService.save('auto').catch(error => {
                        console.warn('Échec sauvegarde auto après déblocage zone:', error);
                    });
                }, 1000);
            }
        });

        window.addEventListener('game:clearAllBuildings', () => {
            console.log('🏠 Nettoyage forcé des bâtiments');
            clearBuildings();
            const buildingManager = (window as any).__BUILDING_MANAGER__;
            if (buildingManager) {
                buildingManager.clearAll();
            }
        });

        window.addEventListener('game:clearAllZones', () => {
            console.log('🗺️ Nettoyage forcé des zones débloquées');
            state.value.unlockedZones = [];

            const zoneRegistry = (window as any).__ZONE_BLOCKER_REGISTRY__;
            if (zoneRegistry && typeof zoneRegistry.resetAllBlockers === 'function') {
                zoneRegistry.resetAllBlockers();
                console.log('✅ ZoneBlockerRegistry réinitialisé');
            }
        });

        window.addEventListener('game:forceReset', () => {
            console.log('🔄 Reset forcé du gameStore');

            updatePlayerLevel(1);
            updatePlayerGold(0);
            updatePlayerExperience({ current: 0, nextLevel: 100 });
            updatePlayerHealth({ current: 100, max: 100 });
            updatePlayerAvatar('default');

            if (resourceManager) {
                try {
                    const inventory = resourceManager.getGlobalInventory();
                    if (inventory && typeof inventory.clear === 'function') {
                        inventory.clear();
                        console.log('🗑️ Inventaire global vidé');
                    }
                } catch (error) {
                    console.error('Erreur vidage inventaire:', error);
                }
            }

            resourcesMap.value.clear();
            resourceUpdateTrigger.value++;

            state.value.unlockedZones = [];

            clearBuildings();
            console.log('✅ GameStore complètement réinitialisé');
        });

        window.addEventListener('game:resetComplete', () => {
            console.log('🎯 Reset complet terminé');

            nextTick(() => {
                resourceUpdateTrigger.value++;
                console.log('🔄 Réactivité Vue mise à jour après reset');
            });
        });

    };

    const saveProgress = async (saveName: string = 'manual'): Promise<boolean> => {
        try {
            const result = await gameSaveService.save(saveName);
            return result.success;
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            return false;
        }
    };

    const loadProgress = async (): Promise<boolean> => {
        try {
            await gameSaveService.initializeGame();
            return true;
        } catch (error) {
            console.error('Erreur chargement:', error);
            return false;
        }
    };

    const setAutoSave = (enabled: boolean): void => {
        gameSaveService.setAutoSave(enabled);
    };

    const getPlayerId = (): string | null => {
        return gameSaveService.getPlayerId();
    };

    if (typeof window !== 'undefined') {
        (window as any).gameStore = {
            get playerLevel() { return playerLevel.value; },
            get playerGold() { return playerGold.value; },
            get playerHealth() { return { ...playerHealth.value }; },
            get playerExperience() { return { ...playerExperience.value }; },
            get playerAvatar() { return playerAvatar.value; },
            get state() { return state.value; },

            updatePlayerLevel,
            updatePlayerGold,
            updatePlayerHealth,
            updatePlayerExperience,
            updatePlayerAvatar,
            updateResource,
            addResource,
            removeResource,

            getResourceManager: () => {
                if (!initializeManagers() || !resourceManager) {
                    return null;
                }
                return resourceManager;
            },

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
        };

        console.log('✅ GameStore exposé sur window.gameStore');
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
        getResourceManager,
        getBuildingRegistry,
        getPlayerInventorySpace,
        getStackSize,

        // Actions
        setGameLoaded,
        updateResource,
        addResource,
        removeResource,
        updatePlayerAvatar,
        updatePlayerLevel,
        updatePlayerGold,
        updatePlayerHealth,
        updatePlayerExperience,
        forceResourceUpdate,
        syncResourcesFromManager,

        // Building actions
        purchaseBuilding,
        getBuildingAffordability,
        selectBuilding,
        showBuildingInfo,
        hideBuildingInfo,
        addBuilding,
        removeBuilding,
        clearBuildings,
        addWorker,
        removeWorker,

        // Save system
        saveProgress,
        loadProgress,
        setAutoSave,
        getPlayerId,
        setupGameSaveEvents,
        manualSave: () => gameSaveService.manualSave(),
        resetGame: () => gameSaveService.resetGame(),
        resetGameState: (): void => {
            gameSaveService.resetGame();
        },
        startNewGame: async (): Promise<void> => {
            try {
                await gameSaveService.startNewGame();
            } catch (error) {
                console.error('Erreur nouvelle partie:', error);
            }
        },
    };
});
