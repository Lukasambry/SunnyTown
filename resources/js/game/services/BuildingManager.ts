import { Scene } from 'phaser';
type Scene = typeof Scene;

import { TiledBuilding } from '../objects/TiledBuilding';
import type { BuildingConfig, BuildingPosition } from '../types';
import { BuildingRegistry } from './BuildingRegistry';
import { GameData, GameDataService } from '@/game/services/GameDataService';
import { WorkerType } from '../types';

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    private readonly eventCallbacks = new Map<keyof BuildingManagerEvents, Set<Function>>();
    private readonly STORAGE_KEY = 'BUILDINGS_STORAGE';
    private readonly buildingRegistry: BuildingRegistry;
    private readonly gameDataService: GameDataService;

    constructor(scene: Scene) {
        this.scene = scene;
        this.buildingRegistry = BuildingRegistry.getInstance();
        this.gameDataService = GameDataService.getInstance();

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

        // ✅ SUPPRIMÉ: Plus de création automatique de workers lors du placement manuel
        // Les players devront manuellement assigner des workers aux nouveaux bâtiments

        console.log(`Bâtiment ${type} placé à (${x}, ${y}) SANS workers automatiques. Total: ${this.buildings.length}`);
        this.saveState();
        this.rebuildPathfindingGrid();

        this.emit('buildingPlaced', building);
        return building;
    }

    public getBuildingWorkerStats(): { [buildingId: string]: { assigned: number, max: number, type: WorkerType } } {
        const stats: { [buildingId: string]: { assigned: number, max: number, type: WorkerType } } = {};

        this.buildings.forEach(building => {
            const buildingId = this.getBuildingId(building);
            const buildingConfig = this.buildingRegistry.getBuildingConfig(building.getType());

            if (buildingConfig) {
                stats[buildingId] = {
                    assigned: building.getAssignedWorkerCount(),
                    max: buildingConfig.maxWorkers || 0,
                    type: buildingConfig.workerType || WorkerType.NEUTRAL
                };
            }
        });

        return stats;
    }

    private getBuildingId(building: TiledBuilding): string {
        const pos = building.getPosition();
        return `${building.getType()}_${Math.round(pos.x)}_${Math.round(pos.y)}`;
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

            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
            setTimeout(() => {
                this.gameDataService.saveGameData();
            }, 50);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des bâtiments:', error);
        }
    }


    public forceSave(): void {
        this.saveState();
    }

    public loadState(): void {
        try {
            const stored = sessionStorage.getItem(this.STORAGE_KEY);
            if (!stored) {
                console.log('No buildings data in sessionStorage');
                return;
            }

            const state: StoredBuilding[] = JSON.parse(stored);
            const validBuildings = state.filter(data =>
                typeof data.type === 'string' &&
                typeof data.x === 'number' &&
                typeof data.y === 'number' &&
                !isNaN(data.x) &&
                !isNaN(data.y)
            );

            validBuildings.forEach(data => {
                this.placeBuilding(data.type, data.x, data.y);
            });
        } catch (error) {
            console.error('Erreur chargement bâtiments:', error);
            sessionStorage.removeItem(this.STORAGE_KEY);
        }
    }

    public getCurrentBuildingsData(): StoredBuilding[] {
        return this.buildings.map(building => {
            const position = building.getPosition();
            return {
                type: building.getType(),
                x: position.x,
                y: position.y
            };
        });
    }

    public restoreBuildingsFromGameData(buildingsData: StoredBuilding[], workersData: GameData['workers']): void {
        console.log('Restoring buildings from game data:', buildingsData);
        console.log('Workers data:', workersData);

        // Nettoyer les bâtiments existants
        this.clearAll();

        // Première étape : Créer tous les bâtiments sans workers
        const createdBuildings: TiledBuilding[] = [];
        buildingsData.forEach(data => {
            if (typeof data.type === 'string' &&
                typeof data.x === 'number' &&
                typeof data.y === 'number' &&
                !isNaN(data.x) && !isNaN(data.y)) {

                const buildingConfig = this.buildingRegistry.getBuildingConfig(data.type);
                if (buildingConfig) {
                    const templateKey = buildingConfig.template;
                    const building = new TiledBuilding(this.scene, data.x, data.y, templateKey, data.type);
                    this.buildings.push(building);
                    createdBuildings.push(building);
                }
            }
        });

        // ✅ NOUVEAU: Attendre que les bâtiments soient initialisés puis créer les workers selon les données sauvegardées
        setTimeout(() => {
            this.restoreWorkersForBuildings(createdBuildings, workersData);
        }, 100);

        // Sauvegarder l'état final dans sessionStorage
        const state: StoredBuilding[] = this.buildings.map(building => {
            const position = building.getPosition();
            return {
                type: building.getType(),
                x: position.x,
                y: position.y
            };
        });
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));

        this.rebuildPathfindingGrid();
        console.log(`Restored ${this.buildings.length} buildings`);
    }

    private restoreWorkersForBuildings(buildings: TiledBuilding[], workersData: GameData['workers']): void {
        console.log('Restoring workers for buildings with saved assignments:', workersData.assignments);

        const { buildingWorkers } = workersData.assignments;

        // Pour chaque bâtiment, créer le nombre exact de workers selon les données sauvegardées
        buildings.forEach(building => {
            const buildingId = this.getBuildingId(building);
            const assignedWorkerIds = buildingWorkers[buildingId] || [];
            const workerCount = assignedWorkerIds.length;

            console.log(`Building ${building.getType()} (${buildingId}): restoring ${workerCount} workers`);

            if (workerCount > 0) {
                this.createSpecificNumberOfWorkersForBuilding(building, workerCount);
            }
        });

        console.log('Workers restoration completed');
    }

    private createSpecificNumberOfWorkersForBuilding(building: TiledBuilding, workerCount: number): void {
        try {
            const buildingConfig = this.buildingRegistry.getBuildingConfig(building.getType());
            if (!buildingConfig ||
                !buildingConfig.workerType ||
                buildingConfig.workerType === WorkerType.NEUTRAL) {
                console.log(`Building ${building.getType()} does not require specific workers`);
                return;
            }

            const workerType = buildingConfig.workerType;
            const buildingPosition = building.getPosition();

            console.log(`Creating ${workerCount} workers of type ${workerType} for building at (${buildingPosition.x}, ${buildingPosition.y})`);

            // Obtenir le WorkerManager depuis la scène
            const workerManager = (this.scene as any).workerManager;
            if (!workerManager) {
                console.error('WorkerManager not available in scene');
                return;
            }

            // Créer exactement le nombre de workers sauvegardés
            for (let i = 0; i < workerCount; i++) {
                // Calculer une position légèrement décalée pour chaque worker
                const workerX = buildingPosition.x + (i * 20) + 10;
                const workerY = buildingPosition.y + 30;

                // Créer d'abord un worker neutre
                const neutralWorker = workerManager.createWorker(
                    WorkerType.NEUTRAL,
                    workerX,
                    workerY
                );

                if (neutralWorker) {
                    console.log(`Created neutral worker ${i + 1}/${workerCount} for building ${building.getType()}`);

                    // Assigner et spécialiser le worker au bâtiment
                    const workerId = neutralWorker.getWorkerId();
                    const assignmentSuccess = workerManager.assignWorkerToBuilding(workerId, building);

                    if (assignmentSuccess) {
                        console.log(`Successfully assigned and specialized worker ${workerId} to building ${building.getType()}`);
                    } else {
                        console.warn(`Failed to assign worker ${workerId} to building ${building.getType()}`);
                        // Si l'assignation échoue, détruire le worker pour éviter les workers orphelins
                        neutralWorker.destroy();
                    }
                } else {
                    console.error(`Failed to create neutral worker ${i + 1}/${workerCount} for building ${building.getType()}`);
                }
            }

            console.log(`Finished creating ${workerCount} workers for building ${building.getType()}`);

        } catch (error) {
            console.error(`Error creating workers for building ${building.getType()}:`, error);
        }
    }

    private createWorkersForBuilding(building: TiledBuilding, buildingConfig: BuildingConfig): void {
        try {
            console.log(`Creating workers for building: ${building.getType()}`);

            // Vérifier si le bâtiment a un type de worker et un nombre maximum
            if (!buildingConfig.workerType ||
                buildingConfig.workerType === WorkerType.NEUTRAL ||
                !buildingConfig.maxWorkers ||
                buildingConfig.maxWorkers <= 0) {
                console.log(`Building ${building.getType()} does not require specific workers`);
                return;
            }

            const workerType = buildingConfig.workerType;
            const maxWorkers = buildingConfig.maxWorkers;
            const buildingPosition = building.getPosition();

            console.log(`Creating ${maxWorkers} workers of type ${workerType} for building at (${buildingPosition.x}, ${buildingPosition.y})`);

            // Obtenir le WorkerManager depuis la scène
            const workerManager = (this.scene as any).workerManager;
            if (!workerManager) {
                console.error('WorkerManager not available in scene');
                return;
            }

            // Créer le nombre maximal de workers pour ce bâtiment
            for (let i = 0; i < maxWorkers; i++) {
                // Calculer une position légèrement décalée pour chaque worker
                const workerX = buildingPosition.x + (i * 20) + 10; // Décalage horizontal
                const workerY = buildingPosition.y + 30; // Légèrement en dessous du bâtiment

                // Créer d'abord un worker neutre
                const neutralWorker = workerManager.createWorker(
                    WorkerType.NEUTRAL,
                    workerX,
                    workerY
                );

                if (neutralWorker) {
                    console.log(`Created neutral worker ${i + 1} for building ${building.getType()}`);

                    // Assigner et spécialiser le worker au bâtiment
                    const workerId = neutralWorker.getWorkerId();
                    const assignmentSuccess = workerManager.assignWorkerToBuilding(workerId, building);

                    if (assignmentSuccess) {
                        console.log(`Successfully assigned and specialized worker ${workerId} to building ${building.getType()}`);
                    } else {
                        console.warn(`Failed to assign worker ${workerId} to building ${building.getType()}`);
                        // Si l'assignation échoue, détruire le worker pour éviter les workers orphelins
                        neutralWorker.destroy();
                    }
                } else {
                    console.error(`Failed to create neutral worker ${i + 1} for building ${building.getType()}`);
                }
            }

            console.log(`Finished creating workers for building ${building.getType()}`);

        } catch (error) {
            console.error(`Error creating workers for building ${building.getType()}:`, error);
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
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
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
    }
}
