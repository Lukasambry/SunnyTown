import { TiledBuilding } from '../objects/TiledBuilding';
import type { BuildingPosition } from '../types';

interface StoredBuilding {
    readonly type: string;
    readonly x: number;
    readonly y: number;
}

interface BuildingManagerEvents {
    'buildingPlaced': (building: TiledBuilding) => void;
    'buildingDestroyed': (building: TiledBuilding) => void;
    'allBuildingsCleared': () => void;
}

export class BuildingManager {
    private readonly scene: Scene;
    private buildings: TiledBuilding[] = [];
    private readonly eventCallbacks = new Map<keyof BuildingManagerEvents, Set<Function>>();
    private readonly STORAGE_KEY = 'sunnytown_buildings';

    constructor(scene: any) {
        this.scene = scene;
    }

    public placeBuilding(type: string, x: number, y: number): TiledBuilding {
        const templateKey = `${type}-template`;
        const building = new TiledBuilding(this.scene, x, y, templateKey);

        const player = (this.scene as any).player;
        if (player) {
            building.setupCollisions(player);
        }

        this.buildings.push(building);
        this.saveState();
        this.rebuildPathfindingGrid();

        this.emit('buildingPlaced', building);
        return building;
    }

    public removeBuilding(building: TiledBuilding): boolean {
        const index = this.buildings.indexOf(building);
        if (index === -1) return false;

        this.buildings.splice(index, 1);
        building.destroy();
        this.saveState();
        this.rebuildPathfindingGrid();

        this.emit('buildingDestroyed', building);

        return true;
    }

    public getBuildingAt(x: number, y: number): TiledBuilding | null {
        for (const building of this.buildings) {
            const position = building.getPosition();
            const dimensions = building.getDimensions();

            const buildingBounds = {
                left: position.x,
                right: position.x + (dimensions.tilesWidth * 16),
                top: position.y,
                bottom: position.y + (dimensions.tilesHeight * 16)
            };

            if (x >= buildingBounds.left && x <= buildingBounds.right &&
                y >= buildingBounds.top && y <= buildingBounds.bottom) {
                return building;
            }
        }

        return null;
    }

    public getBuildingsByType(type: string): readonly TiledBuilding[] {
        return this.buildings.filter(building => building.getType() === type);
    }

    public getClosestBuilding(position: BuildingPosition, type?: string): TiledBuilding | null {
        let candidates = this.buildings;

        if (type) {
            candidates = this.buildings.filter(building => building.getType() === type);
        }

        if (candidates.length === 0) return null;

        return candidates.reduce((closest, current) => {
            const closestPos = closest.getPosition();
            const currentPos = current.getPosition();

            const closestDist = Phaser.Math.Distance.Between(
                position.x, position.y,
                closestPos.x, closestPos.y
            );

            const currentDist = Phaser.Math.Distance.Between(
                position.x, position.y,
                currentPos.x, currentPos.y
            );

            return currentDist < closestDist ? current : closest;
        });
    }

    private saveState(): void {
        try {
            const state: StoredBuilding[] = this.buildings.map(building => {
                const position = building.getPosition();
                return {
                    type: building.getType(),
                    x: position.x,
                    y: position.y
                };
            });

            // IMPORTANT: Synchroniser avec la sauvegarde principale
            this.updateMainSaveFile(state);

            console.log('[BuildingManager] Bâtiments sauvegardés:', state);

            // Émettre l'événement pour notifier les autres systèmes
            window.dispatchEvent(new CustomEvent('game:buildingChanged', {
                detail: { buildings: state }
            }));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des bâtiments:', error);
        }
    }


    private updateMainSaveFile(buildings: StoredBuilding[]): void {
        try {
            // Lire la sauvegarde principale existante
            const mainSaveRaw = localStorage.getItem('sunnytown_savegame');
            let mainSave: any = {};

            if (mainSaveRaw) {
                try {
                    mainSave = JSON.parse(mainSaveRaw);
                } catch (e) {
                    console.warn('Erreur parsing sauvegarde principale, création d\'une nouvelle');
                    mainSave = {};
                }
            }

            // Mettre à jour les bâtiments
            mainSave.buildings = buildings;
            mainSave.timestamp = Date.now();

            // Sauvegarder
            localStorage.setItem('sunnytown_savegame', JSON.stringify(mainSave));

            console.log('[BuildingManager] Sauvegarde principale mise à jour avec', buildings.length, 'bâtiments');
        } catch (error) {
            console.error('[BuildingManager] Erreur mise à jour sauvegarde principale:', error);
        }
    }

    public loadState(): void {
        try {
            console.log('🏠 Chargement bâtiments depuis sauvegarde principale...');

            // Lire depuis la sauvegarde principale
            const mainSave = localStorage.getItem('sunnytown_savegame');
            let buildings: StoredBuilding[] = [];

            if (mainSave) {
                try {
                    const saveData = JSON.parse(mainSave);
                    if (saveData.buildings && Array.isArray(saveData.buildings)) {
                        buildings = saveData.buildings;
                        console.log(`✅ ${buildings.length} bâtiments trouvés dans sauvegarde principale`);
                    }
                } catch (error) {
                    console.warn('Erreur lecture sauvegarde principale:', error);
                }
            }

            // Valider et placer les bâtiments
            const validBuildings = buildings.filter(data =>
                typeof data.type === 'string' &&
                typeof data.x === 'number' &&
                typeof data.y === 'number' &&
                !isNaN(data.x) &&
                !isNaN(data.y)
            );

            // Nettoyer les anciens bâtiments avant de placer les nouveaux
            this.buildings.forEach(building => building.destroy());
            this.buildings = [];

            validBuildings.forEach(data => {
                this.placeBuilding(data.type, data.x, data.y);
            });

            console.log(`✅ ${validBuildings.length} bâtiments chargés`);

        } catch (error) {
            console.error('❌ Erreur chargement bâtiments:', error);
        }
    }

    public loadFromData(buildingsData: Array<{type: string, x: number, y: number}>): void {
        try {
            this.buildings.forEach(building => building.destroy());
            this.buildings = [];

            buildingsData.forEach(data => {
                if (data.type && typeof data.x === 'number' && typeof data.y === 'number') {
                    this.placeBuilding(data.type, data.x, data.y);
                }
            });

            console.log(`Chargés ${buildingsData.length} b��timents depuis les données externes`);
        } catch (error) {
            console.error('Erreur lors du chargement des bâtiments:', error);
        }
    }

    public updateBuildings(player: Phaser.Physics.Arcade.Sprite): void {
        this.buildings.forEach(building => {
            try {
                building.update(player);
            } catch (error) {
                console.error('Erreur lors de la mise à jour du bâtiment:', error);
            }
        });
    }

    public getBuildings(): readonly TiledBuilding[] {
        return [...this.buildings];
    }

    public getAllBuildings(): Array<{type: string, x: number, y: number}> {
        return this.buildings.map(building => {
            const position = building.getPosition();
            return {
                type: building.getType(),
                x: position.x,
                y: position.y
            };
        });
    }

    public clearAll(): void {
        const buildingsToDestroy = [...this.buildings];

        buildingsToDestroy.forEach(building => {
            try {
                building.destroy();
            } catch (error) {
                console.error('Erreur lors de la destruction du bâtiment:', error);
            }
        });

        this.buildings.length = 0;

        try {
            sessionStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.error('Erreur lors du nettoyage du storage:', error);
        }

        this.rebuildPathfindingGrid();
        this.emit('allBuildingsCleared');
    }

    private rebuildPathfindingGrid(): void {
        try {
            const mainScene = this.scene as any;
            if (mainScene.rebuildPathfindingGrid) {
                mainScene.rebuildPathfindingGrid();
            }
        } catch (error) {
            console.error('Erreur lors de la reconstruction de la grille de pathfinding:', error);
        }
    }

    public on<K extends keyof BuildingManagerEvents>(
        event: K,
        callback: BuildingManagerEvents[K]
    ): void {
        if (!this.eventCallbacks.has(event)) {
            this.eventCallbacks.set(event, new Set());
        }
        this.eventCallbacks.get(event)!.add(callback);
    }

    public off<K extends keyof BuildingManagerEvents>(
        event: K,
        callback: BuildingManagerEvents[K]
    ): void {
        const callbacks = this.eventCallbacks.get(event);
        if (callbacks) {
            callbacks.delete(callback);
        }
    }

    private emit<K extends keyof BuildingManagerEvents>(
        event: K,
        ...args: Parameters<BuildingManagerEvents[K]>
    ): void {
        const callbacks = this.eventCallbacks.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    (callback as (...args: any[]) => void)(...args);
                } catch (error) {
                    console.error(`Erreur dans le callback ${event}:`, error);
                }
            });
        }
    }

    public getBuildingCount(): number {
        return this.buildings.length;
    }

    public getBuildingCountByType(type: string): number {
        return this.buildings.filter(building => building.getType() === type).length;
    }

    public hasBuildings(): boolean {
        return this.buildings.length > 0;
    }

    public canPlaceBuildingAt(x: number, y: number, width: number, height: number): boolean {
        return !this.buildings.some(building => {
            const pos = building.getPosition();
            const dim = building.getDimensions();

            return !(x >= pos.x + (dim.tilesWidth * 16) ||
                    x + (width * 16) <= pos.x ||
                    y >= pos.y + (dim.tilesHeight * 16) ||
                    y + (height * 16) <= pos.y);
        });
    }

    public destroy(): void {
        this.clearAll();
        this.eventCallbacks.clear();
    }
}
