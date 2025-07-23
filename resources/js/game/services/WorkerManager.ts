import Phaser from 'phaser';
type Scene = typeof Phaser.Scene;

import { Worker } from '../objects/workers';
import { WorkerRegistry } from './WorkerRegistry';
import { WorkerType, type WorkerPosition } from '../types';
import { TiledBuilding } from '@/game/objects/TiledBuilding';
import { GameDataService } from '@/game/services/GameDataService';

export class WorkerManager {
    private readonly scene: Scene;
    private readonly registry: WorkerRegistry;
    private readonly workers = new Map<string, Worker>();
    private nextWorkerId: number = 1;
    private workerIdMap = new Map<string, string>();

    constructor(scene: Scene) {
        this.scene = scene;
        this.registry = WorkerRegistry.getInstance();
        (window as any).__WORKER_MANAGER__ = this;
    }

    public createWorker(type: WorkerType, x: number, y: number, depositPoint?: WorkerPosition): Worker | null {
        try {
            const worker = this.registry.createWorker(type, this.scene, x, y, depositPoint);
            if (!worker) {
                console.error(`WorkerManager: Registry failed to create worker ${type}`);
                return null;
            }

            const internalId = `worker_${type}_${this.nextWorkerId++}`;
            const workerId = worker.getWorkerId();

            this.workers.set(internalId, worker);
            this.workerIdMap.set(workerId, internalId);

            this.notifyWorkerCountChange();
            return worker;

        } catch (error) {
            console.error(`WorkerManager: Error creating worker ${type}:`, error);
            return null;
        }
    }

    public getTotalWorkerCount(): number {
        return this.getAllWorkers().length;
    }

    private notifyWorkerCountChange(): void {
        setTimeout(() => {
            const gameDataService = GameDataService.getInstance();
            gameDataService.saveGameData();
        }, 100);
    }

    public removeWorker(workerId: string): boolean {
        const worker = this.workers.get(workerId);
        if (!worker) {
            console.warn(`WorkerManager: Worker ${workerId} not found`);
            return false;
        }

        try {
            worker.destroy();
            this.workers.delete(workerId);
            console.log(`WorkerManager: Removed worker ${workerId}`);

            window.dispatchEvent(new CustomEvent('game:workerRemoved', {
                detail: { id: workerId }
            }));

            this.notifyWorkerCountChange();
            return true;
        } catch (error) {
            console.error(`WorkerManager: Error removing worker ${workerId}:`, error);
            return false;
        }
    }

    public getWorker(workerId: string): Worker | null {
        let worker = this.workers.get(workerId);
        if (worker) return worker;

        const internalId = this.workerIdMap.get(workerId);
        if (internalId) {
            worker = this.workers.get(internalId);
            if (worker) return worker;
        }

        for (const w of this.workers.values()) {
            if (w.getWorkerId() === workerId) {
                return w;
            }
        }
        return null;
    }

    public getAllWorkers(): readonly Worker[] {
        return Array.from(this.workers.values());
    }

    public getWorkersByType(type: WorkerType): readonly Worker[] {
        return Array.from(this.workers.values()).filter(worker =>
            worker.getConfig().id === type
        );
    }

    public getWorkerCount(type?: WorkerType): number {
        if (type) {
            return this.getWorkersByType(type).length;
        }
        return this.workers.size;
    }

    public findNearestDepositPoint(workerType: WorkerType, position: WorkerPosition): WorkerPosition | null {
        try {
            const config = this.registry.getWorkerConfig(workerType);
            if (!config) return null;

            const buildingManager = (this.scene as any).buildingManager;
            if (!buildingManager) {
                console.log(`WorkerManager: No buildingManager available`);
                return null;
            }

            let bestPosition: WorkerPosition | null = null;
            let bestDistance = Infinity;

            config.depositTargets.forEach(target => {
                target.targetTypes.forEach(buildingType => {
                    const buildings = buildingManager.getBuildingsByType(buildingType);
                    buildings.forEach((building: any) => {
                        const buildingPos = building.getPosition();
                        const distance = Phaser.Math.Distance.Between(
                            position.x, position.y,
                            buildingPos.x, buildingPos.y
                        );

                        if (distance < bestDistance) {
                            bestDistance = distance;
                            bestPosition = buildingPos;
                        }
                    });
                });
            });

            return bestPosition;

        } catch (error) {
            console.error('WorkerManager: Error finding deposit point:', error);
            return null;
        }
    }

    public pauseAllWorkers(): void {
        this.workers.forEach(worker => {
            worker.forceIdle();
        });
        console.log('WorkerManager: Paused all workers');
    }

    public resumeAllWorkers(): void {
        this.workers.forEach(worker => {
            worker.forceIdle(); // This will restart their main loop
        });
        console.log('WorkerManager: Resumed all workers');
    }

    public clearAllWorkers(): void {
        console.log('WorkerManager: Clearing all workers');

        this.workers.forEach((worker, id) => {
            try {
                worker.destroy();
            } catch (error) {
                console.error(`WorkerManager: Error destroying worker ${id}:`, error);
            }
        });

        this.workers.clear();
        this.nextWorkerId = 1;

        window.dispatchEvent(new CustomEvent('game:allWorkersCleared'));
    }

    public update(): void {
        const destroyedWorkers: string[] = [];
        this.workers.forEach((worker, id) => {
            if (!worker.scene || !worker.active) {
                destroyedWorkers.push(id);
            }
        });

        destroyedWorkers.forEach(id => {
            console.log(`WorkerManager: Cleaning up destroyed worker ${id}`);
            this.workers.delete(id);
        });
    }

    public destroy(): void {
        this.clearAllWorkers();
    }

    public createLumberjack(x: number, y: number, depositPoint?: WorkerPosition): Worker | null {
        return this.createWorker(WorkerType.LUMBERJACK, x, y, depositPoint);
    }

    public getWorkers(): readonly Worker[] {
        return this.getAllWorkers();
    }

    public getWorkersByType_Legacy(type: any): readonly Worker[] {
        if (typeof type === 'string') {
            return this.getWorkersByType(type as WorkerType);
        }
        return [];
    }

    public assignWorkerToBuilding(workerId: string, building: TiledBuilding): boolean {
        const worker = this.getWorker(workerId);
        if (!worker) {
            console.warn(`WorkerManager: Worker ${workerId} not found`);
            return false;
        }

        if (!building.canAssignWorker()) {
            console.warn(`WorkerManager: Building cannot accept more workers`);
            return false;
        }

        if (worker.getConfig().id !== WorkerType.NEUTRAL) {
            console.warn(`WorkerManager: Worker is not neutral type`);
            return false;
        }

        const targetWorkerType = building.getWorkerType();
        const newConfig = this.registry.getWorkerConfig(targetWorkerType);

        if (!newConfig) {
            console.warn(`WorkerManager: No config found for worker type ${targetWorkerType}`);
            return false;
        }

        const buildingId = this.getBuildingId(building);

        if (building.assignWorker(workerId) && worker.convertToSpecializedWorker) {
            worker.convertToSpecializedWorker(newConfig);

            const pos = building.getPosition();
            worker.setDepositPoint({ x: pos.x, y: pos.y });

            window.dispatchEvent(new CustomEvent('game:workerSpecialized', {
                detail: {
                    workerId,
                    oldType: WorkerType.NEUTRAL,
                    newType: targetWorkerType,
                    buildingId
                }
            }));

            return true;
        }

        return false;
    }

    public unassignWorkerFromBuilding(workerId: string): boolean {
        const worker = this.getWorker(workerId);
        if (!worker) {
            console.warn(`WorkerManager: Worker ${workerId} not found`);
            return false;
        }

        const buildingId = worker.getAssignedBuildingId();
        if (!buildingId) {
            console.warn(`WorkerManager: Worker is not assigned to any building`);
            return false;
        }

        const building = this.findBuildingById(buildingId);
        if (building && building.unassignWorker(workerId)) {
            const oldType = worker.getConfig().id;
            worker.convertToNeutral();
            worker.setDepositPoint(null);

            window.dispatchEvent(new CustomEvent('game:workerNeutralized', {
                detail: {
                    workerId,
                    oldType,
                    newType: WorkerType.NEUTRAL,
                    buildingId
                }
            }));

            return true;
        }

        return false;
    }

    public getAvailableNeutralWorkers(): readonly Worker[] {
        return this.getWorkersByType(WorkerType.NEUTRAL).filter(worker =>
            !worker.isAssignedToBuilding?.()
        );
    }

    public getWorkersAssignedToBuilding(buildingId: string): readonly Worker[] {
        return Array.from(this.workers.values()).filter(worker =>
            worker.getAssignedBuildingId() === buildingId
        );
    }

    private getBuildingId(building: TiledBuilding): string {
        const pos = building.getPosition();
        return `${building.getType()}_${Math.round(pos.x)}_${Math.round(pos.y)}`;
    }

    private findBuildingById(buildingId: string): TiledBuilding | null {
        if (!this.scene.buildingManager) return null;

        return this.scene.buildingManager.getBuildings().find((building: TiledBuilding) => {
            const pos = building.getPosition();
            const id = `${building.getType()}_${Math.round(pos.x)}_${Math.round(pos.y)}`;
            return id === buildingId;
        }) || null;
    }
}
