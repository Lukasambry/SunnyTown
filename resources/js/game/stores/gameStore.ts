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

    // Main initialization action
    const setGameLoaded = (loaded: boolean) => {
        state.value.isGameLoaded = loaded;

        if (loaded) {
            if (initializeManagers()) {
                initializeResourceSync();

                // Initialiser le système de sauvegarde unifié
                setTimeout(() => {
                    gameSaveService.initializeGame();
                    setupGameSaveEvents();
                }, 500);

                console.log('GameStore chargé - système unifié actif');
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
            console.log('📥 Chargement état depuis système unifié:', gameState);

            // Appliquer les données du joueur
            if (gameState.player) {
                updatePlayerLevel(gameState.player.level);
                updatePlayerGold(gameState.player.gold);
                updatePlayerExperience(gameState.player.experience);
                updatePlayerHealth(gameState.player.health);
                updatePlayerAvatar(gameState.player.avatar || 'default');
            }

            // Appliquer les ressources
            if (gameState.resources) {
                Object.entries(gameState.resources).forEach(([type, amount]) => {
                    updateResource(type.toUpperCase() as ResourceType, amount as number);
                });
                forceResourceUpdate();
            }

            // Appliquer les bâtiments
            if (gameState.buildings && gameState.buildings.length > 0) {
                clearBuildings();
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('game:loadBuildings', {
                        detail: { buildings: gameState.buildings, source: 'gameSave' }
                    }));
                }, 100);
            }

            // Appliquer les zones débloquées
            if (gameState.unlockedZones && gameState.unlockedZones.length > 0) {
                state.value.unlockedZones = [...gameState.unlockedZones];
                gameState.unlockedZones.forEach((zoneName: string) => {
                    setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('game:unlockZone', {
                            detail: { zoneName, fromLoad: true }
                        }));
                    }, 200);
                });
            }

            window.addEventListener('game:clearAllBuildings', () => {
                console.log('🏠 Nettoyage forcé des bâtiments');
                clearBuildings();
                // Nettoyer aussi via le building manager si disponible
                const buildingManager = (window as any).__BUILDING_MANAGER__;
                if (buildingManager) {
                    buildingManager.clearAll();
                }
            });

            window.addEventListener('game:forceReset', () => {
                console.log('🔄 Reset forcé du gameStore');
                // Reset toutes les données
                updatePlayerLevel(1);
                updatePlayerGold(0);
                updatePlayerExperience({ current: 0, nextLevel: 100 });
                updatePlayerHealth({ current: 100, max: 100 });
                updatePlayerAvatar('default');

                // Vider les ressources
                resourcesMap.value.clear();
                resourceUpdateTrigger.value++;

                state.value.unlockedZones = [];
            });

            console.log('✅ État du jeu appliqué depuis système unifié');
        });
    };

    // Save/Load methods (unified)
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

    // Window exposure for external access
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

        // Save system (unified)
        saveProgress,
        loadProgress,
        setAutoSave,
        getPlayerId,
        setupGameSaveEvents,

        // UI methods
        manualSave: () => gameSaveService.manualSave(),
        resetGame: () => gameSaveService.resetGame(),

        exportSave: () => {
            const gameState = gameSaveService.getCurrentGameState();
            if (gameState) {
                const blob = new Blob([JSON.stringify(gameState, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sunnytown-save-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
            }
        },
        resetGameState: (): void => {
            gameSaveService.resetGame();
        },

        // Nouvelle méthode pour nouvelle partie rapide (sans confirmation)
        startNewGame: async (): Promise<void> => {
            try {
                await gameSaveService.startNewGame();
            } catch (error) {
                console.error('Erreur nouvelle partie:', error);
            }
        },

        // Méthode import modifiée pour recharger la page
        importSave: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        try {
                            const gameState = JSON.parse(e.target?.result as string);

                            // 1. Nettoyer AVANT d'importer
                            localStorage.clear();
                            sessionStorage.clear();

                            // 2. Appliquer l'état immédiatement
                            localStorage.setItem('sunnytown_save_data', JSON.stringify(gameState));

                            // 3. Notifier et recharger IMMÉDIATEMENT
                            window.dispatchEvent(new CustomEvent('game:notification', {
                                detail: {
                                    type: 'success',
                                    message: 'Import réussi, rechargement...'
                                }
                            }));

                            // Rechargement plus rapide
                            setTimeout(() => {
                                window.location.reload();
                            }, 300);

                        } catch (error) {
                            console.error('Erreur import:', error);
                            window.dispatchEvent(new CustomEvent('game:notification', {
                                detail: {
                                    type: 'error',
                                    message: 'Fichier de sauvegarde invalide'
                                }
                            }));
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        },
    };
});
