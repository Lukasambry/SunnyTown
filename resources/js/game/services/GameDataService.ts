// resources/js/game/services/GameDataService.ts (version mise à jour)
import { GlobalWorkerStorage } from '../stores/GlobalWorkerStorage';
import { WorkerCounterService } from './WorkerCounterService';

export interface PlayerData {
    level: number;
    currentExperience: number;
    nextLevelExperience: number;
    health: {
        current: number;
        max: number;
    };
    gold: number;
    avatar: string;
}

export interface GameData {
    player: PlayerData;
    buildings: StoredBuilding[];
    resources: Record<string, number>;
    workers: {
        totalCount: number;
        assignments: {
            buildingWorkers: Record<string, string[]>;
            workerBuildings: Record<string, string>;
        };
        stats: {
            assignedCount: number;
            unassignedCount: number;
            workersByType: Record<string, number>;
        };
    };
    unlockedZones: {
        blockerIds: string[];
        blockerNames: string[];
        unlockedAt: Record<string, number>;
    };
    lastSaved: number;
    gameVersion: string;
}

interface StoredBuilding {
    readonly type: string;
    readonly x: number;
    readonly y: number;
    readonly resources?: Record<string, number>;
}

/*
interface BuildingWithWorkers extends StoredBuilding {
    workers?: {
        count: number;
        type: WorkerType;
    };
}
*/

export class GameDataService {
    private static instance: GameDataService;
    private readonly STORAGE_KEY = 'GAME_SAVE_DATA';
    private readonly VERSION = '1.1.0';
    private workerCounterService: WorkerCounterService;

    public static getInstance(): GameDataService {
        if (!GameDataService.instance) {
            GameDataService.instance = new GameDataService();
        }
        return GameDataService.instance;
    }

    constructor() {
        this.workerCounterService = WorkerCounterService.getInstance();
        (window as any).__GAME_DATA_SERVICE__ = this;
    }

    private getDefaultGameData(): GameData {
        return {
            player: {
                level: 1,
                currentExperience: 0,
                nextLevelExperience: 100,
                health: { current: 100, max: 100 },
                gold: 0,
                avatar: ''
            },
            buildings: [],
            resources: {},
            workers: {
                totalCount: 0,
                assignments: {
                    buildingWorkers: {},
                    workerBuildings: {}
                },
                stats: {
                    assignedCount: 0,
                    unassignedCount: 0,
                    workersByType: {}
                }
            },
            unlockedZones: {
                blockerIds: [],
                blockerNames: [],
                unlockedAt: {}
            },
            lastSaved: Date.now(),
            gameVersion: this.VERSION
        };
    }

    public saveGameData(): boolean {
        try {
            console.log('=== DÉBUT SAUVEGARDE AVEC ZONES DÉBLOQUÉES ===');

            const playerData = this.getCurrentPlayerData();
            const buildingsData = this.getCurrentBuildingsData();
            const resourcesData = this.getCurrentResourcesData();
            const workersData = this.getCurrentWorkersData();
            const unlockedZonesData = this.getCurrentUnlockedZonesData();

            console.log('Data to save:', {
                player: playerData,
                buildings: buildingsData.length,
                resources: Object.keys(resourcesData).length,
                workers: workersData.totalCount,
                unlockedZones: {
                    blockerIds: unlockedZonesData.blockerIds.length,
                    blockerNames: unlockedZonesData.blockerNames.length
                }
            });

            const gameData: GameData = {
                player: playerData,
                buildings: buildingsData,
                resources: resourcesData,
                workers: workersData,
                unlockedZones: unlockedZonesData,
                lastSaved: Date.now(),
                gameVersion: this.VERSION
            };

            const dataToSave = {
                version: this.VERSION,
                data: gameData
            };

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
            console.log('Game data with unlocked zones saved successfully to localStorage');
            console.log('=== FIN SAUVEGARDE ===');

            // Émettre un événement de sauvegarde
            window.dispatchEvent(new CustomEvent('game:dataSaved', {
                detail: {
                    timestamp: gameData.lastSaved,
                    summary: {
                        level: gameData.player.level,
                        gold: gameData.player.gold,
                        buildings: gameData.buildings.length,
                        workers: gameData.workers.totalCount,
                        unlockedZones: gameData.unlockedZones.blockerIds.length
                    }
                }
            }));

            return true;
        } catch (error) {
            console.error('Error saving game data with unlocked zones:', error);
            return false;
        }
    }

    private getCurrentUnlockedZonesData(): GameData['unlockedZones'] {
        try {
            const zoneBlockerService = (window as any).__ZONE_BLOCKER_SERVICE__;
            if (zoneBlockerService && typeof zoneBlockerService.getUnlockedZonesData === 'function') {
                const data = zoneBlockerService.getUnlockedZonesData();
                return data;
            }

            console.warn('ZoneBlockerService not available, using default unlocked zones data');
            return {
                blockerIds: [],
                blockerNames: [],
                unlockedAt: {}
            };
        } catch (error) {
            console.error('Error getting current unlocked zones data:', error);
            return {
                blockerIds: [],
                blockerNames: [],
                unlockedAt: {}
            };
        }
    }

    public loadGameData(): GameData | null {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) {
                console.log('No saved game data found');
                return null;
            }

            const parsedData = JSON.parse(stored);

            if (parsedData.version !== this.VERSION) {
                console.warn(`Version mismatch: saved=${parsedData.version}, current=${this.VERSION}`);
                parsedData.data = this.migrateGameData(parsedData.data, parsedData.version);
            }

            if (!this.isValidGameData(parsedData.data)) {
                console.error('Invalid game data structure');
                return null;
            }

            const gameData = parsedData.data as GameData;

            if (!gameData.player || typeof gameData.player.level !== 'number') {
                console.error('Invalid player data detected');
                gameData.player = this.getDefaultGameData().player;
            }

            if (!gameData.resources || typeof gameData.resources !== 'object') {
                console.error('Invalid resources data detected');
                gameData.resources = {};
            }

            console.log('Game data loaded successfully', {
                saveDate: new Date(gameData.lastSaved).toLocaleString(),
                level: gameData.player.level,
                buildings: gameData.buildings.length,
                workers: gameData.workers.totalCount,
                resourceTypes: Object.keys(gameData.resources).length
            });

            return gameData;
        } catch (error) {
            console.error('Error loading game data:', error);
            return null;
        }
    }

    public forceResourceSave(): boolean {
        try {
            const resourceManager = (window as any).__RESOURCE_MANAGER__;
            if (resourceManager && resourceManager.saveGlobalInventory) {
                resourceManager.saveGlobalInventory();
                return this.saveGameData();
            }
            return false;
        } catch (error) {
            console.error('Error force saving resources:', error);
            return false;
        }
    }

    private getCurrentWorkersData(): GameData['workers'] {
        const stats = this.workerCounterService.getWorkerStats();
        const assignments = GlobalWorkerStorage.getAllAssignments();

        return {
            totalCount: stats.totalWorkers,
            assignments: {
                buildingWorkers: { ...assignments.buildingWorkers },
                workerBuildings: { ...assignments.workerBuildings }
            },
            stats: {
                assignedCount: stats.assignedWorkers,
                unassignedCount: stats.unassignedWorkers,
                workersByType: { ...stats.workersByType }
            }
        };
    }

    private getCurrentPlayerData(): PlayerData {
        const gameStore = (window as any).__GAME_STORE__;

        console.log('getCurrentPlayerData - __GAME_STORE__:', gameStore);

        if (gameStore) {
            const playerData = {
                level: gameStore.getPlayerLevel || 1,
                currentExperience: gameStore.getPlayerCurrentExperience || 0,
                nextLevelExperience: gameStore.getPlayerNextLevelExperience || 100,
                health: {
                    current: gameStore.getPlayerCurrentHealth || 100,
                    max: gameStore.getPlayerMaxHealth || 100
                },
                gold: gameStore.getPlayerGold || 0,
                avatar: gameStore.getPlayerAvatar || ''
            };

            console.log('getCurrentPlayerData result:', playerData);
            return playerData;
        }

        console.log('No __GAME_STORE__ found, using default data');
        const defaultData = this.getDefaultGameData().player;
        console.log('Default player data:', defaultData);
        return defaultData;
    }

    private getCurrentBuildingsData(): StoredBuilding[] {
        try {
            const buildingManager = (window as any).__BUILDING_MANAGER__;
            if (buildingManager && typeof buildingManager.getCurrentBuildingsData === 'function') {
                const buildings = buildingManager.getCurrentBuildingsData();
                console.log('getCurrentBuildingsData with resources from BuildingManager:', buildings);
                return buildings;
            }

            // Fallback vers sessionStorage (sans ressources)
            console.warn('BuildingManager not available, falling back to sessionStorage');
            const stored = sessionStorage.getItem('BUILDINGS_STORAGE');
            if (stored) {
                const buildings = JSON.parse(stored);
                const validBuildings = Array.isArray(buildings) ? buildings : [];
                console.log('getCurrentBuildingsData from sessionStorage (no resources):', validBuildings);
                return validBuildings;
            }

            console.log('No buildings data found');
            return [];
        } catch (error) {
            console.error('Error getting current buildings data:', error);
            return [];
        }
    }

    public forceSynchronization(): boolean {
        try {
            const resourceManager = (window as any).__RESOURCE_MANAGER__;
            if (resourceManager && resourceManager.saveGlobalInventory) {
                resourceManager.saveGlobalInventory();
            }

            const buildingManager = (window as any).__BUILDING_MANAGER__;
            if (buildingManager && buildingManager.forceSave) {
                buildingManager.forceSave();
            }

            const success = this.saveGameData();
            return success;
        } catch (error) {
            console.error('Erreur lors de la synchronisation:', error);
            return false;
        }
    }

    private getCurrentResourcesData(): Record<string, number> {
        try {
            const resourceManager = (window as any).__RESOURCE_MANAGER__;
            if (resourceManager && resourceManager.saveGlobalInventory) {
                const resourcesData = resourceManager.saveGlobalInventory();
                console.log('Resources data retrieved:', resourcesData);
                return resourcesData;
            }
        } catch (error) {
            console.error('Error getting resources data:', error);
        }
        return {};
    }

    private migrateGameData(data: any, fromVersion: string): GameData {
        if (fromVersion === '1.0.0') {
            if (!data.workers || typeof data.workers.totalCount === 'undefined') {
                data.workers = {
                    totalCount: data.totalWorkers || 0,
                    assignments: data.workerAssignments || {
                        buildingWorkers: {},
                        workerBuildings: {}
                    },
                    stats: {
                        assignedCount: 0,
                        unassignedCount: 0,
                        workersByType: {}
                    }
                };

                delete data.totalWorkers;
                delete data.workerAssignments;
            }
        }
        return data;
    }

    private isValidGameData(data: any): boolean {
        if (!data || typeof data !== 'object') return false;

        const requiredProps = ['player', 'buildings', 'resources', 'workers', 'lastSaved'];
        for (const prop of requiredProps) {
            if (!(prop in data)) {
                console.error(`Missing required property: ${prop}`);
                return false;
            }
        }

        const player = data.player;
        if (!player || typeof player !== 'object') return false;

        const playerRequiredProps = ['level', 'currentExperience', 'nextLevelExperience', 'health', 'gold'];
        for (const prop of playerRequiredProps) {
            if (!(prop in player)) {
                console.error(`Missing player property: ${prop}`);
                return false;
            }
        }

        const workers = data.workers;
        if (!workers || typeof workers !== 'object') return false;

        if (typeof workers.totalCount !== 'number') return false;
        if (!workers.assignments || typeof workers.assignments !== 'object') return false;
        return true;
    }

    public restoreGameData(gameData: GameData): void {
        try {
            console.log('Restoring game data with unlocked zones...', gameData);

            // Restaurer d'abord les données workers dans le GlobalWorkerStorage
            this.restoreWorkerData(gameData.workers);

            // Restaurer les zones débloquées AVANT les bâtiments
            this.restoreUnlockedZonesData(gameData.unlockedZones);

            // Restaurer les bâtiments avec leurs workers
            const buildingManager = (window as any).__BUILDING_MANAGER__;
            if (buildingManager && typeof buildingManager.restoreBuildingsFromGameData === 'function') {
                buildingManager.restoreBuildingsFromGameData(gameData.buildings, gameData.workers);
            } else {
                console.warn('BuildingManager not available for buildings restoration');
            }

            console.log('Game data restoration completed');
        } catch (error) {
            console.error('Error restoring game data:', error);
        }
    }

    private restoreUnlockedZonesData(unlockedZonesData: GameData['unlockedZones']): void {
        try {
            console.log('Restoring unlocked zones:', unlockedZonesData);

            const zoneBlockerService = (window as any).__ZONE_BLOCKER_SERVICE__;
            if (zoneBlockerService && typeof zoneBlockerService.restoreUnlockedZones === 'function') {
                zoneBlockerService.restoreUnlockedZones(unlockedZonesData);
                console.log('Unlocked zones restored successfully');
            } else {
                console.warn('ZoneBlockerService not available for zones restoration');
            }
        } catch (error) {
            console.error('Error restoring unlocked zones:', error);
        }
    }

    private restorePlayerData(playerData: PlayerData): void {
        window.dispatchEvent(new CustomEvent('game:restorePlayerData', {
            detail: playerData
        }));
    }

    private restoreResourcesData(resources: Record<string, number>): void {
        try {
            const resourceManager = (window as any).__RESOURCE_MANAGER__;
            if (resourceManager && resourceManager.loadGlobalInventory) {
                console.log('Restoring resources:', resources);
                resourceManager.loadGlobalInventory(resources);
                console.log('Resources restored successfully');
            } else {
                console.warn('ResourceManager not available for restoration');
                Object.entries(resources).forEach(([type, amount]) => {
                    window.dispatchEvent(new CustomEvent('game:restoreResource', {
                        detail: { type, amount }
                    }));
                });
            }
        } catch (error) {
            console.error('Error restoring resources:', error);
        }
    }

    private restoreWorkerData(workersData: GameData['workers']): void {
        try {
            console.log('Restoring worker assignments:', workersData.assignments);

            // S'assurer que le storage est initialisé
            if (!window.__WORKER_BUILDING_STORAGE__) {
                window.__WORKER_BUILDING_STORAGE__ = {
                    buildingWorkers: {},
                    workerBuildings: {},
                    initialized: true
                };
            }

            // Restaurer les assignations
            window.__WORKER_BUILDING_STORAGE__.buildingWorkers = { ...workersData.assignments.buildingWorkers };
            window.__WORKER_BUILDING_STORAGE__.workerBuildings = { ...workersData.assignments.workerBuildings };

            console.log('Worker data restored:', {
                buildingWorkers: Object.keys(workersData.assignments.buildingWorkers).length,
                workerBuildings: Object.keys(workersData.assignments.workerBuildings).length
            });

        } catch (error) {
            console.error('Error restoring worker data:', error);
        }
    }

    public hasExistingSave(): boolean {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return !!stored;
        } catch (error) {
            console.error('Error checking for existing save:', error);
            return false;
        }
    }

    public deleteSaveData(): boolean {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            window.dispatchEvent(new CustomEvent('game:saveDeleted', {
                detail: { timestamp: Date.now() }
            }));

            return true;
        } catch (error) {
            console.error('Error deleting save data:', error);
            return false;
        }
    }

    public getSaveInfo(): { lastSaved: Date; version: string; summary: any } | null {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) return null;

            const parsedData = JSON.parse(stored);
            const data = parsedData.data;

            return {
                lastSaved: new Date(data.lastSaved),
                version: parsedData.version,
                summary: {
                    playerLevel: data.player.level,
                    playerGold: data.player.gold,
                    buildingCount: data.buildings.length,
                    workerCount: data.workers.totalCount,
                    resourceTypes: Object.keys(data.resources).length
                }
            };
        } catch (error) {
            console.error('Error getting save info:', error);
            return null;
        }
    }

    public setupAutoSave(intervalMinutes: number = 5): void {
        const intervalMs = intervalMinutes * 60 * 1000;

        const autoSaveInterval = setInterval(() => {
            const success = this.saveGameData();
            if (success) {
                console.log(`Auto-save completed at ${new Date().toLocaleTimeString()}`);
            }
        }, intervalMs);

        window.addEventListener('beforeunload', () => {
            this.saveGameData();
        });

        window.addEventListener('blur', () => {
            this.saveGameData();
        });

        window.addEventListener('beforeunload', () => {
            clearInterval(autoSaveInterval);
        });
    }
}
