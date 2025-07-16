import { ResourceType } from '@/game/types/ResourceSystemTypes';

export interface SaveGameData {
    version: string;
    timestamp: number;
    player: {
        level: number;
        currentExperience: number;
        nextLevelExperience: number;
        gold: number;
        health: {
            current: number;
            max: number;
        };
        avatar: string;
    };
    resources: Record<string, number>;
    buildings: Array<{ type: string; x: number; y: number }>;
    unlockedZones: string[];
}

export class SaveGameManager {
    private static instance: SaveGameManager;
    readonly STORAGE_KEY = 'sunnytown_savegame';
    private readonly VERSION = '1.0.0';

    public static getInstance(): SaveGameManager {
        if (!SaveGameManager.instance) {
            SaveGameManager.instance = new SaveGameManager();
        }
        return SaveGameManager.instance;
    }

    public collectGameData(): SaveGameData {
        const gameStore = this.getGameStore();
        if (!gameStore) {
            console.error('[SaveGameManager] gameStore non trouvé');
            return this.createDefaultSaveData();
        }

        // Collecte des données joueur (fonctionne déjà)
        const playerData = {
            level: gameStore.playerLevel || 1,
            currentExperience: gameStore.playerExperience?.current || 0,
            nextLevelExperience: gameStore.playerExperience?.nextLevel || 100,
            gold: gameStore.playerGold || 0,
            health: {
                current: gameStore.playerHealth?.current || 100,
                max: gameStore.playerHealth?.max || 100
            },
            avatar: gameStore.playerAvatar || 'default'
        };

        // AMÉLIORATION: Collecte des ressources
        let resourcesData: Record<string, number> = {};
        try {
            if (typeof gameStore.getResourceAmount === 'function') {
                const knownResourceTypes = ['wood', 'stone', 'iron', 'food', 'coal', 'water', 'fiber', 'meat'];
                knownResourceTypes.forEach(resourceType => {
                    const amount = gameStore.getResourceAmount(resourceType);
                    if (amount > 0) {
                        resourcesData[resourceType] = amount;
                    }
                });
            }

            // Fallback vers le ResourceManager
            if (Object.keys(resourcesData).length === 0) {
                const resourceManager = (window as any).gameManager?.resourceManager ||
                    (window as any).mainScene?.resourceManager;
                if (resourceManager?.saveGlobalInventory) {
                    resourcesData = resourceManager.saveGlobalInventory();
                }
            }
        } catch (error) {
            console.error('[SaveGameManager] Erreur lors de la collecte des ressources:', error);
        }

        // CORRECTION: Collecte des bâtiments depuis BuildingManager
        let buildingsData: Array<{ type: string; x: number; y: number }> = [];
        try {
            // Méthode 1: Via gameStore si disponible
            if (gameStore.state?.buildings && Array.isArray(gameStore.state.buildings)) {
                buildingsData = gameStore.state.buildings.map(b => ({
                    type: b.type || b.getType?.(),
                    x: b.x || b.getPosition?.().x,
                    y: b.y || b.getPosition?.().y
                })).filter(b => b.type && typeof b.x === 'number' && typeof b.y === 'number');
            }

            // Méthode 2: Via MainScene.buildingManager
            if (buildingsData.length === 0) {
                const mainScene = this.getMainScene();
                if (mainScene?.buildingManager) {
                    const buildings = mainScene.buildingManager.getAllBuildings();
                    if (Array.isArray(buildings) && buildings.length > 0) {
                        buildingsData = buildings;
                        console.log(`[SaveGameManager] Bâtiments collectés depuis MainScene: ${buildings.length}`);
                    }
                }
            }

            // Méthode 3: Via window.buildingManager (fallback)
            if (buildingsData.length === 0) {
                const windowBuildingManager = (window as any).buildingManager;
                if (windowBuildingManager?.getAllBuildings) {
                    const buildings = windowBuildingManager.getAllBuildings();
                    if (Array.isArray(buildings) && buildings.length > 0) {
                        buildingsData = buildings;
                        console.log(`[SaveGameManager] Bâtiments collectés depuis window.buildingManager: ${buildings.length}`);
                    }
                }
            }

            // Méthode 4: Via localStorage existant (dernière chance)
            if (buildingsData.length === 0) {
                const existingSave = localStorage.getItem(this.STORAGE_KEY);
                if (existingSave) {
                    try {
                        const parsed = JSON.parse(existingSave);
                        if (parsed.buildings && Array.isArray(parsed.buildings)) {
                            buildingsData = parsed.buildings;
                            console.log(`[SaveGameManager] Bâtiments récupérés depuis localStorage: ${buildingsData.length}`);
                        }
                    } catch (e) {
                        console.warn('[SaveGameManager] Erreur parsing localStorage pour bâtiments');
                    }
                }
            }

        } catch (error) {
            console.error('[SaveGameManager] Erreur collecte bâtiments:', error);
        }

        // CORRECTION: Collecte des zones débloquées
        let zonesData: string[] = [];
        try {
            // Méthode 1: Via gameStore
            if (gameStore.state?.unlockedZones && Array.isArray(gameStore.state.unlockedZones)) {
                zonesData = [...gameStore.state.unlockedZones];
                console.log(`[SaveGameManager] Zones collectées depuis gameStore: ${zonesData.length}`);
            }

            // Méthode 2: Via MainScene.zoneBlockerService
            if (zonesData.length === 0) {
                const mainScene = this.getMainScene();
                if (mainScene?.zoneBlockerService) {
                    // Ajouter une méthode pour récupérer les zones débloquées
                    const unlockedZones = this.getUnlockedZonesFromBlockerService(mainScene.zoneBlockerService);
                    if (unlockedZones.length > 0) {
                        zonesData = unlockedZones;
                        console.log(`[SaveGameManager] Zones collectées depuis ZoneBlockerService: ${zonesData.length}`);
                    }
                }
            }

            // Méthode 3: Via window globals (fallback)
            if (zonesData.length === 0) {
                if ((window as any).unlockedZones && Array.isArray((window as any).unlockedZones)) {
                    zonesData = [...(window as any).unlockedZones];
                } else if ((window as any).gameState?.unlockedZones) {
                    zonesData = [...(window as any).gameState.unlockedZones];
                }
            }

            // Méthode 4: Déduction depuis les bâtiments (fallback intelligent)
            if (zonesData.length === 0 && buildingsData.length > 0) {
                const detectedZones = new Set<string>();
                buildingsData.forEach(building => {
                    // Logique pour détecter les zones basée sur les positions
                    if (building.x < 500 && building.y < 500) {
                        detectedZones.add('starter_zone');
                    }
                    if (building.x > 1000 || building.y > 1000) {
                        detectedZones.add('expansion_zone');
                    }
                    // Ajouter d'autres règles selon votre carte
                });
                zonesData = Array.from(detectedZones);
                console.log(`[SaveGameManager] Zones déduites depuis bâtiments: ${zonesData.length}`);
            }

        } catch (error) {
            console.error('[SaveGameManager] Erreur collecte zones débloquées:', error);
        }

        const finalData = {
            version: this.VERSION,
            timestamp: Date.now(),
            player: playerData,
            resources: resourcesData,
            buildings: buildingsData,
            unlockedZones: zonesData
        };

        console.log('[SaveGameManager] Données finales collectées:', {
            player: Object.keys(playerData),
            resourcesCount: Object.keys(resourcesData).length,
            buildingsCount: buildingsData.length,
            zonesCount: zonesData.length
        });

        return finalData;
    }

    private createDefaultSaveData(): SaveGameData {
        return {
            version: this.VERSION,
            timestamp: Date.now(),
            player: {
                level: 1,
                currentExperience: 0,
                nextLevelExperience: 100,
                gold: 0,
                health: { current: 100, max: 100 },
                avatar: 'default'
            },
            resources: {},
            buildings: [],
            unlockedZones: []
        };
    }

    private getMainScene(): any {
        // Plusieurs façons de récupérer MainScene
        if ((window as any).gameInstance?.scene) {
            return (window as any).gameInstance.scene.getScene('MainScene');
        }
        if ((window as any).mainScene) {
            return (window as any).mainScene;
        }
        if ((window as any).game?.scene) {
            return (window as any).game.scene.getScene('MainScene');
        }
        return null;
    }

    private getUnlockedZonesFromBlockerService(zoneBlockerService: any): string[] {
        try {
            // Cette méthode devra être ajoutée au ZoneBlockerService
            if (typeof zoneBlockerService.getUnlockedZones === 'function') {
                return zoneBlockerService.getUnlockedZones();
            }

            // Fallback: essayer d'accéder directement aux données
            if (zoneBlockerService.blockerConfigs) {
                const unlockedZones: string[] = [];
                zoneBlockerService.blockerConfigs.forEach((config: any, zoneName: string) => {
                    if (config.unlocked) {
                        unlockedZones.push(zoneName);
                    }
                });
                return unlockedZones;
            }
        } catch (error) {
            console.error('Erreur récupération zones depuis ZoneBlockerService:', error);
        }
        return [];
    }

    public debugGameStore(): void {
        const gameStore = this.getGameStore();
        if (!gameStore) {
            console.error('[SaveGameManager] gameStore non trouvé');
            return;
        }
    }

    public saveGame(): void {
        const saveData = this.collectGameData();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saveData));
        window.dispatchEvent(new CustomEvent('game:saved', { detail: { timestamp: saveData.timestamp } }));
    }

    public loadGame(): SaveGameData | null {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (err) {
            console.error('[SaveGameManager] Erreur parsing sauvegarde:', err);
            return null;
        }
    }

    public applyLoadedData(data: SaveGameData): void {
        const gameStore = this.getGameStore();
        if (!gameStore || !data) {
            console.error('[SaveGameManager] Impossible d\'appliquer les données, gameStore ou data manquant');
            return;
        }

        gameStore.updatePlayerLevel(data.player.level);
        gameStore.updatePlayerGold(data.player.gold);
        gameStore.updatePlayerHealth(data.player.health);
        gameStore.updatePlayerExperience({
            current: data.player.currentExperience,
            nextLevel: data.player.nextLevelExperience
        });
        gameStore.updatePlayerAvatar(data.player.avatar);

        Object.entries(data.resources).forEach(([type, amount]) => {
            if (gameStore.updateResource) {
                gameStore.updateResource(type, amount);
            }
        });
        if (gameStore.forceResourceUpdate) {
            setTimeout(() => gameStore.forceResourceUpdate(), 100);
        }

        window.dispatchEvent(new CustomEvent('game:buildingsUpdated', {
            detail: { buildings: data.buildings, source: 'load' }
        }));

        if (Array.isArray(data.unlockedZones)) {
            if (gameStore.state && Array.isArray(gameStore.state.unlockedZones)) {
                gameStore.state.unlockedZones = [...data.unlockedZones];
            }
            data.unlockedZones.forEach((zoneName: string) => {
                window.dispatchEvent(new CustomEvent('game:zoneUnlocked', {
                    detail: { zoneName, fromLoad: true }
                }));
            });
        }

        window.dispatchEvent(new CustomEvent('game:loaded', { detail: { success: true } }));
    }

    public exportSave(): string | null {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        return raw ? raw : null;
    }

    public importSave(jsonData: string): boolean {
        try {
            const data: SaveGameData = JSON.parse(jsonData);
            if (!data.version || !data.player) throw new Error('Format de sauvegarde invalide');
            localStorage.setItem(this.STORAGE_KEY, jsonData);
            window.dispatchEvent(new CustomEvent('game:notification', {
                detail: {
                    type: 'success',
                    title: 'Import réussi',
                    message: 'La sauvegarde a été importée. Rechargez la page pour appliquer les changements.',
                    duration: 4000
                }
            }));
            return true;
        } catch (error: any) {
            window.dispatchEvent(new CustomEvent('game:notification', {
                detail: {
                    type: 'error',
                    title: 'Erreur d\'import',
                    message: `Erreur: ${error.message}`,
                    duration: 5000
                }
            }));
            return false;
        }
    }

    private getGameStore(): any {
        return typeof window !== 'undefined' ? (window as any).gameStore : null;
    }
}

export const saveGameManager = SaveGameManager.getInstance();
