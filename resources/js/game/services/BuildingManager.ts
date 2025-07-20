import { Scene } from 'phaser';
type Scene = typeof Scene;

import { TiledBuilding } from '../objects/TiledBuilding';
import type { BuildingPosition } from '../types';
import { BuildingRegistry } from './BuildingRegistry';

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
    private readonly buildings: TiledBuilding[] = [];
    private readonly eventCallbacks = new Map<keyof BuildingManagerEvents, Set<Function>>();
    private readonly buildingRegistry: BuildingRegistry;

    constructor(scene: Scene) {
        this.scene = scene;
        this.buildingRegistry = BuildingRegistry.getInstance();

        (window as any).__BUILDING_MANAGER__ = this;
    }

    public placeBuilding(type: string, x: number, y: number): TiledBuilding {
        const buildingConfig = this.buildingRegistry.getBuildingConfig(type);
        if (!buildingConfig) {
            throw new Error(`Aucun config trouvé pour le bâtiment ${type}`);
        }
        const templateKey = buildingConfig.template;
        const building = new TiledBuilding(this.scene, x, y, templateKey, type);

        this.buildings.push(building);

        this.notifyBuildingChange();
        this.rebuildPathfindingGrid();

        this.emit('buildingPlaced', building);
        return building;
    }

    public removeBuilding(building: TiledBuilding): boolean {
        const index = this.buildings.indexOf(building);
        if (index === -1) return false;

        this.buildings.splice(index, 1);
        building.destroy();

        this.notifyBuildingChange();
        this.rebuildPathfindingGrid();

        this.emit('buildingDestroyed', building);
        return true;
    }
    private notifyBuildingChange(): void {
        try {
            window.dispatchEvent(new CustomEvent('game:buildingsChanged', {
                detail: {
                    buildingCount: this.buildings.length,
                    buildings: this.getAllBuildings()
                }
            }));
        } catch (error) {
            console.error('Erreur notification changement bâtiments:', error);
        }
    }

    public getAllBuildings(): StoredBuilding[] {
        return this.buildings.map(building => {
            const position = building.getPosition();
            return {
                type: building.getType(),
                x: position.x,
                y: position.y
            };
        });
    }

    public loadState(): void {
        console.log('BuildingManager: loadState() deprecated - using unified save system');
    }

    public loadFromSaveData(buildings: StoredBuilding[]): void {
        console.log(`🏠 Chargement de ${buildings.length} bâtiments depuis sauvegarde unifiée`);

        this.clearAll();

        buildings.forEach(data => {
            if (this.isValidBuildingData(data)) {
                try {
                    this.placeBuilding(data.type, data.x, data.y);
                } catch (error) {
                    console.error(`Erreur chargement bâtiment ${data.type}:`, error);
                }
            }
        });

        console.log(`✅ ${this.buildings.length} bâtiments chargés`);
    }

    private isValidBuildingData(data: any): data is StoredBuilding {
        return data &&
            typeof data.type === 'string' &&
            typeof data.x === 'number' &&
            typeof data.y === 'number' &&
            !isNaN(data.x) &&
            !isNaN(data.y);
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
                    (callback as Function)(...args);
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

        // Nettoyer la référence globale
        if ((window as any).__BUILDING_MANAGER__ === this) {
            delete (window as any).__BUILDING_MANAGER__;
        }
    }
}
