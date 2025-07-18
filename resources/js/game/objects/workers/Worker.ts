import Phaser from 'phaser';
import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;

import {
    type WorkerConfig,
    WorkerState,
    type WorkerPosition,
    WorkerActionType, WorkerType
} from '@/game/types/WorkerConfigTypes';
import { ResourceType } from '@/game/types/ResourceSystemTypes';
import { ResourceEntity } from '../ResourceEntity';
import { TiledBuilding } from '../TiledBuilding';
import { AnimationUtils } from '@/game/utils/AnimationUtils';
import { WorkerRegistry } from '@/game/services';
import { GlobalWorkerStorage } from '@/game/stores/GlobalWorkerStorage';
import { WorkerPathfinder } from '@/game/services/WorkerPathfinder';
import { WorkerItemDisplayManager } from './WorkerItemDisplayManager';

export class Worker extends Sprite {
    // private assignedBuildingId: string | null = null;
    private itemDisplayManager: WorkerItemDisplayManager;
    private itemUpdateTimer: Phaser.Time.TimerEvent | null = null;
    private workerId: string = '';

    protected config: WorkerConfig;
    protected inventory = new Map<ResourceType, number>();
    protected currentTarget: ResourceEntity | TiledBuilding | null = null;
    protected depositPoint: WorkerPosition | null = null;
    protected resourceEntityManager: any;
    protected buildingManager: any;
    protected isMoving: boolean = false;
    protected actionTimer: Phaser.Time.TimerEvent | null = null;
    protected idleTimer: Phaser.Time.TimerEvent | null = null;
    protected mainLoopTimer: Phaser.Time.TimerEvent | null = null;
    protected blacklistedTargets = new Set<string>();
    protected lastBlacklistCleanup: number = 0;

    public state: WorkerState = WorkerState.IDLE;

    constructor(scene: Scene, x: number, y: number, config: WorkerConfig, depositPoint?: WorkerPosition) {
        super(scene, x, y, config.texture);

        this.config = config;
        this.depositPoint = depositPoint || null;
        this.workerId = `worker_${Math.floor(x)}_${Math.floor(y)}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        this.resourceEntityManager = (scene as any).resourceEntityManager;
        this.buildingManager = (scene as any).buildingManager;

        this.itemDisplayManager = new WorkerItemDisplayManager(this, scene);

        this.initializeWorker();
        this.setupAnimations();
        this.startMainLoop();
    }

    private getThisGameObject(): Phaser.GameObjects.GameObject {
        return this as any as Phaser.GameObjects.GameObject;
    }

    private initializeWorker(): void {
        this.scene.add.existing(this.getThisGameObject());
        this.scene.physics.add.existing(this.getThisGameObject());

        const body = this.body as Phaser.Physics.Arcade.Body;
        if (body) {
            body.setSize(12, 12);
            body.setOffset(2, 4);
        }

        this.setDepth(1);
        if (this.config.tint) this.setTint(this.config.tint);
        if (this.config.scale) this.setScale(this.config.scale);

        this.config.harvestTargets.forEach((target) => {
            target.resourceTypes.forEach((resourceType) => {
                this.inventory.set(resourceType, 0);
            });
        });
    }

    private setupAnimations(): void {
        try {
            AnimationUtils.initializeEntityAnimations(this as any as Sprite, 'player');
            this.play(this.config.animations.idle.type);
        } catch (error) {
            console.warn('Worker: Could not setup animations:', error);
        }
    }

    private startMainLoop(): void {
        this.mainLoopTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: this.updateWorker,
            callbackScope: this,
            loop: true,
        });

        this.scene.time.delayedCall(100, () => {
            this.updateWorker();
        });
    }

    private updateWorker(): void {
        try {
            this.cleanupBlacklistPeriodically();

            if (this.isMoving) {
                return;
            }

            switch (this.state) {
                case WorkerState.IDLE:
                    this.handleIdleState();
                    break;
                case WorkerState.WAITING:
                    this.handleWaitingState();
                    break;
                default:
                    break;
            }
        } catch (error) {
            this.setWorkerState(WorkerState.IDLE);
        }
    }

    private handleIdleState(): void {
        if (this.hasResourcesInInventory()) {
            this.findAndMoveToDepositTarget();
        } else {
            this.findAndMoveToHarvestTarget();
        }
    }

    private handleWaitingState(): void {
        if (!this.idleTimer) {
            this.idleTimer = this.scene.time.delayedCall(3000, () => {
                this.setWorkerState(WorkerState.IDLE);
                this.idleTimer = null;
            });
        }
    }

    private findAndMoveToHarvestTarget(): void {
        const target = this.findBestHarvestTarget();

        if (target) {
            this.currentTarget = target;
            this.moveToTarget(target, WorkerState.MOVING_TO_HARVEST);
        } else {
            this.setWorkerState(WorkerState.WAITING);
        }
    }

    private findAndMoveToDepositTarget(): void {
        let target: TiledBuilding | null = null;

        if (this.isAssignedToBuilding()) {
            const assignedBuildingId = this.getAssignedBuildingId();

            target = this.findBuildingById(assignedBuildingId);

            if (target) {
                this.currentTarget = target;
                this.moveToTarget(target, WorkerState.MOVING_TO_DEPOSIT);
                return;
            } else {
                console.warn(`Assigned building ${assignedBuildingId} not found, falling back to nearest`);
            }
        }

        target = this.findBestDepositTarget();

        if (target) {
            this.currentTarget = target;
            this.moveToTarget(target, WorkerState.MOVING_TO_DEPOSIT);
        } else if (this.depositPoint) {
            this.moveToPosition(this.depositPoint, WorkerState.MOVING_TO_DEPOSIT);
        } else {
            this.setWorkerState(WorkerState.WAITING);
        }
    }

    private findBuildingById(buildingId: string | null): TiledBuilding | null {
        if (!buildingId || !this.buildingManager) {
            return null;
        }

        try {
            const buildings = this.buildingManager.getBuildings();
            return buildings.find((building: TiledBuilding) =>
                building.getBuildingId() === buildingId
            ) || null;
        } catch (error) {
            console.error(`Error finding building by ID ${buildingId}:`, error);
            return null;
        }
    }

    private findBestHarvestTarget(): ResourceEntity | TiledBuilding | null {
        for (const harvestConfig of this.config.harvestTargets.sort((a, b) => a.priority - b.priority)) {
            const target = this.findTargetByConfig(harvestConfig);
            if (target) {
                return target;
            }
        }

        return null;
    }

    private findBestDepositTarget(): TiledBuilding | null {
        if (this.isAssignedToBuilding()) {
            const assignedBuilding = this.findBuildingById(this.getAssignedBuildingId());
            if (assignedBuilding && this.buildingCanAcceptWorkerResources(assignedBuilding)) {
                return assignedBuilding;
            }
        }

        for (const depositConfig of this.config.depositTargets.sort((a, b) => a.priority - b.priority)) {
            const target = this.findDepositTargetByConfig(depositConfig);
            if (target) {
                return target;
            }
        }

        return null;
    }

    private buildingCanAcceptWorkerResources(building: TiledBuilding): boolean {
        try {
            let canAccept = false;

            this.inventory.forEach((amount, resourceType) => {
                if (amount > 0) {
                    const capacity = building.getBuildingResourceCapacity(resourceType);
                    const current = building.getBuildingResource(resourceType);
                    if (capacity > current) {
                        canAccept = true;
                    }
                }
            });

            return canAccept;
        } catch (error) {
            console.error(`Error checking if building can accept resources:`, error);
            return false;
        }
    }

    private findTargetByConfig(config: any): ResourceEntity | TiledBuilding | null {
        if (config.actionType === WorkerActionType.HARVEST_RESOURCE_ENTITY) {
            return this.findNearestResourceEntity(config.targetTypes);
        } else if (config.actionType === WorkerActionType.HARVEST_BUILDING) {
            return this.findNearestBuildingWithResources(config.targetTypes, config.resourceTypes);
        }
        return null;
    }

    private findDepositTargetByConfig(config: any): TiledBuilding | null {
        return this.findNearestBuildingWithCapacity(config.targetTypes, config.resourceTypes);
    }

    private findNearestResourceEntity(targetTypes: string[]): ResourceEntity | null {
        if (!this.resourceEntityManager) {
            return null;
        }

        let bestTarget: ResourceEntity | null = null;
        let bestDistance = this.config.workRadius;

        targetTypes.forEach((targetType) => {
            const entities = this.resourceEntityManager.getEntitiesByType(targetType);

            entities.forEach((entity: ResourceEntity) => {
                if (this.isValidHarvestTarget(entity)) {
                    const distance = Phaser.Math.Distance.Between(this.x, this.y, entity.x, entity.y);

                    if (distance < bestDistance) {
                        bestDistance = distance;
                        bestTarget = entity;
                    }
                }
            });
        });

        return bestTarget;
    }

    private findNearestBuildingWithResources(buildingTypes: string[], resourceTypes: ResourceType[]): TiledBuilding | null {
        if (!this.buildingManager) {
            return null;
        }

        let bestTarget: TiledBuilding | null = null;
        let bestDistance = this.config.workRadius;

        buildingTypes.forEach((buildingType) => {
            const buildings = this.buildingManager.getBuildingsByType(buildingType);
            buildings.forEach((building: TiledBuilding) => {
                if (this.buildingHasResources(building, resourceTypes)) {
                    const pos = building.getPosition();
                    const distance = Phaser.Math.Distance.Between(this.x, this.y, pos.x, pos.y);
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        bestTarget = building;
                    }
                }
            });
        });

        return bestTarget;
    }

    private findNearestBuildingWithCapacity(buildingTypes: string[], resourceTypes: ResourceType[]): TiledBuilding | null {
        if (!this.buildingManager) {
            return null;
        }

        let bestTarget: TiledBuilding | null = null;
        let bestDistance = this.config.workRadius;

        buildingTypes.forEach((buildingType) => {
            const buildings = this.buildingManager.getBuildingsByType(buildingType);
            buildings.forEach((building: TiledBuilding) => {
                if (this.buildingCanAcceptResources(building, resourceTypes)) {
                    const pos = building.getPosition();
                    const distance = Phaser.Math.Distance.Between(this.x, this.y, pos.x, pos.y);
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        bestTarget = building;
                    }
                }
            });
        });

        return bestTarget;
    }

    private moveToTarget(target: ResourceEntity | TiledBuilding, newState: WorkerState): void {
        if (target instanceof ResourceEntity) {
            if (!target.setHarvester(this)) {
                this.blacklistTarget(target);
                this.setWorkerState(WorkerState.IDLE);
                return;
            }
        }

        let targetPos: { x: number, y: number };

        if (target instanceof ResourceEntity) {
            targetPos = { x: target.x, y: target.y };
        } else {
            if (newState === WorkerState.MOVING_TO_DEPOSIT || newState === WorkerState.MOVING_TO_HARVEST) {
                const depositPoint = target.getDepositPosition();
                if (depositPoint) {
                    targetPos = depositPoint;
                } else {
                    const pos = target.getPosition();
                    targetPos = { x: pos.x, y: pos.y };
                }
            } else {
                const pos = target.getPosition();
                targetPos = { x: pos.x, y: pos.y };
            }
        }

        this.moveToPosition(targetPos, newState);
    }

    private async moveToPosition(targetPos: WorkerPosition, newState: WorkerState): Promise<void> {
        this.setWorkerState(newState);
        this.isMoving = true;

        try {
            this.updateAnimation();
        } catch (error) {
            console.warn('Worker: Could not play walking animation:', error);
        }

        const pathfinder = WorkerPathfinder.getInstance();
        const path = await pathfinder.findPath(this.x, this.y, targetPos.x, targetPos.y);

        if (!path || path.length === 0) {
            const nearestWalkable = pathfinder.findNearestWalkableTile(targetPos.x, targetPos.y);
            if (nearestWalkable) {
                const fallbackPath = await pathfinder.findPath(this.x, this.y, nearestWalkable.x, nearestWalkable.y);
                if (fallbackPath && fallbackPath.length > 0) {
                    this.followPath(fallbackPath);
                    return;
                }
            }

            console.warn('Worker: No path found to target');
            this.setWorkerState(WorkerState.IDLE);
            this.isMoving = false;
            return;
        }

        this.followPath(path);
    }

    private followPath(path: { x: number; y: number }[]): void {
        if (path.length === 0) {
            this.onPathCompleted();
            return;
        }
    
        this.startItemUpdateTimer();
    
        let currentWaypointIndex = 0;
        const moveToNextWaypoint = () => {
            if (currentWaypointIndex >= path.length) {
                this.onPathCompleted();
                return;
            }
    
            const waypoint = path[currentWaypointIndex];
            const dx = waypoint.x - this.x;
            if (Math.abs(dx) > 1) {
                this.flipX = dx < 0;
            }
    
            this.scene.physics.moveTo(this.getThisGameObject(), waypoint.x, waypoint.y, this.config.moveSpeed);
    
            const distance = Phaser.Math.Distance.Between(this.x, this.y, waypoint.x, waypoint.y);
            const travelTime = (distance / this.config.moveSpeed) * 1000;
    
            this.scene.time.delayedCall(Math.max(travelTime, 100), () => {
                currentWaypointIndex++;
                moveToNextWaypoint();
            });
        };
    
        moveToNextWaypoint();
    }

    private startItemUpdateTimer(): void {
        this.stopItemUpdateTimer();
    
        this.itemUpdateTimer = this.scene.time.addEvent({
            delay: 16, // ~60 FPS
            callback: () => {
                if (this.isMoving) {
                    this.itemDisplayManager.updateItemPosition();
                }
            },
            callbackScope: this,
            loop: true
        });
    }
    
    private stopItemUpdateTimer(): void {
        if (this.itemUpdateTimer) {
            this.itemUpdateTimer.destroy();
            this.itemUpdateTimer = null;
        }
    }

    public refreshItemDisplay(): void {
        this.updateItemDisplay();
    }

    private onPathCompleted(): void {
        this.isMoving = false;
        (this.body as Phaser.Physics.Arcade.Body)?.stop();
    
        this.stopItemUpdateTimer();
        this.updateItemDisplay();
        
        if (this.state === WorkerState.MOVING_TO_HARVEST) {
            this.startHarvesting();
        } else if (this.state === WorkerState.MOVING_TO_DEPOSIT) {
            this.startDepositing();
        }
    }

    private startHarvesting(): void {
        if (!this.currentTarget) {
            this.setWorkerState(WorkerState.IDLE);
            return;
        }

        this.setWorkerState(WorkerState.HARVESTING);
        this.harvestAnimationCycle();
    }

    private harvestAnimationCycle(): void {
        if (!this.currentTarget || this.state !== WorkerState.HARVESTING) {
            this.setWorkerState(WorkerState.IDLE);
            return;
        }

        try {
            this.play(this.config.animations.working.type);
            this.once('animationcomplete', this.onHarvestAnimationComplete, this);
        } catch (error) {
            this.actionTimer = this.scene.time.delayedCall(this.config.harvestSpeed, () => {
                this.onHarvestAnimationComplete();
            });
        }
    }

    private onHarvestAnimationComplete(): void {
        this.performHarvestHit().then(() => {
            // Worker returns to idle after harvesting
        });
    }

    private async performHarvestHit(): Promise<void> {
        if (!this.currentTarget || this.state !== WorkerState.HARVESTING) {
            this.setWorkerState(WorkerState.IDLE);
            return;
        }

        try {
            let success = false;
            let targetDestroyed = false;

            if (this.currentTarget instanceof ResourceEntity) {
                if (typeof this.currentTarget.workerHarvest === 'function') {
                    success = await this.currentTarget.workerHarvest(this);

                    if (typeof this.currentTarget.isDestroyed === 'function') {
                        targetDestroyed = this.currentTarget.isDestroyed();
                    } else {
                        targetDestroyed = false;
                    }
                } else {
                    this.blacklistTarget(this.currentTarget);
                    success = false;
                    targetDestroyed = true;
                }
            } else {
                success = this.harvestFromBuilding(this.currentTarget);

                const harvestConfig = this.config.harvestTargets.find(target =>
                    target.actionType === WorkerActionType.HARVEST_BUILDING
                );

                if (harvestConfig) {
                    const hasResources = this.buildingHasResources(
                        this.currentTarget,
                        harvestConfig.resourceTypes
                    );

                    const availableSpace = this.config.carryCapacity - this.getTotalInventory();
                    targetDestroyed = !hasResources && availableSpace > 0;
                } else {
                    targetDestroyed = !this.buildingHasResources(
                        this.currentTarget,
                        this.config.harvestTargets.flatMap((t) => t.resourceTypes),
                    );
                }
            }

            if (!success || targetDestroyed) {
                if (!success) {
                    this.blacklistTarget(this.currentTarget);
                }

                if (this.currentTarget instanceof ResourceEntity) {
                    this.currentTarget.releaseHarvester();
                }

                this.currentTarget = null;
                this.setWorkerState(WorkerState.IDLE);
                return;
            }

            if (this.isInventoryFull()) {
                if (this.currentTarget instanceof ResourceEntity) {
                    this.currentTarget.releaseHarvester();
                }

                if (this.currentTarget instanceof ResourceEntity) {
                    this.currentTarget = null;
                }
                this.setWorkerState(WorkerState.IDLE);
                return;
            }

            this.scene.time.delayedCall(300, () => {
                if (this.state === WorkerState.HARVESTING && this.currentTarget) {
                    this.harvestAnimationCycle();
                }
            });
        } catch (error) {
            if (this.currentTarget) {
                this.blacklistTarget(this.currentTarget);
                if (this.currentTarget instanceof ResourceEntity) {
                    this.currentTarget.releaseHarvester();
                }
            }
            this.currentTarget = null;
            this.setWorkerState(WorkerState.IDLE);
        }
    }

    private startDepositing(): void {
        this.setWorkerState(WorkerState.DEPOSITING);

        try {
            this.play(this.config.animations.depositing.type);
        } catch (error) {
            console.warn('Worker: Could not play working animation:', error);
        }

        this.actionTimer = this.scene.time.delayedCall(1000, () => {
            this.completeDepositing();
        });
    }

    private completeDepositing(): void {
        try {
            if (this.currentTarget instanceof TiledBuilding) {
                this.depositToBuilding(this.currentTarget);
            } else if (this.depositPoint) {
                this.depositAllResources();
            }
        } catch (error) {
            console.error(`Worker ${this.config.name}: Error during depositing:`, error);
        }

        this.currentTarget = null;

        try {
            this.play(this.config.animations.idle.type);
        } catch (error) {
            console.warn('Worker: Could not play idle animation:', error);
        }

        this.setWorkerState(WorkerState.IDLE);
    }

    public addToInventory(resourceType: ResourceType, amount: number): number {
        const currentAmount = this.inventory.get(resourceType) || 0;
        const totalInventory = Array.from(this.inventory.values()).reduce((sum, val) => sum + val, 0);
        const availableSpace = this.config.carryCapacity - totalInventory;

        const actualAmount = Math.min(amount, availableSpace);

        if (actualAmount > 0) {
            this.inventory.set(resourceType, currentAmount + actualAmount);
        }

        return actualAmount;
    }

    public removeFromInventory(resourceType: ResourceType, amount: number): number {
        const currentAmount = this.inventory.get(resourceType) || 0;
        const actualAmount = Math.min(amount, currentAmount);

        if (actualAmount > 0) {
            this.inventory.set(resourceType, currentAmount - actualAmount);
        }

        return actualAmount;
    }

    public getInventoryAmount(resourceType: ResourceType): number {
        return this.inventory.get(resourceType) || 0;
    }

    public getTotalInventory(): number {
        return Array.from(this.inventory.values()).reduce((sum, val) => sum + val, 0);
    }

    public hasResourcesInInventory(): boolean {
        return this.getTotalInventory() > 0;
    }

    public isInventoryFull(): boolean {
        return this.getTotalInventory() >= this.config.carryCapacity;
    }

    private depositAllResources(): void {
        this.inventory.forEach((amount, resourceType) => {
            if (amount > 0) {
                const mainScene = this.scene as any;
                if (mainScene.addResource) {
                    mainScene.addResource(resourceType, amount);
                }
                this.inventory.set(resourceType, 0);
            }
        });
    }

    private harvestFromBuilding(building: TiledBuilding): boolean {
        try {
            let harvested = false;
            const availableSpace = this.config.carryCapacity - this.getTotalInventory();

            this.config.harvestTargets.forEach((target) => {
                if (availableSpace <= 0) return;

                target.resourceTypes.forEach((resourceType) => {
                    const buildingAmount = building.getBuildingResource(resourceType);
                    if (buildingAmount > 0) {
                        const toHarvest = Math.min(buildingAmount, availableSpace);
                        const removed = building.removeResourceFromBuilding(resourceType, toHarvest);
                        if (removed > 0) {
                            this.addToInventory(resourceType, removed);
                            harvested = true;
                        }
                    }
                });
            });

            return harvested;
        } catch (error) {
            console.error(`Worker ${this.config.name}: Error harvesting from building:`, error);
            return false;
        }
    }

    private depositToBuilding(building: TiledBuilding): boolean {
        try {
            let deposited = false;

            this.inventory.forEach((amount, resourceType) => {
                if (amount > 0) {
                    const added = building.addResourceToBuilding(resourceType, amount);
                    if (added > 0) {
                        this.removeFromInventory(resourceType, added);
                        deposited = true;
                    }
                }
            });

            return deposited;
        } catch (error) {
            console.error(`Worker ${this.config.name}: Error depositing to building:`, error);
            return false;
        }
    }

    private isValidHarvestTarget(entity: ResourceEntity): boolean {
        const entityKey = this.getEntityKey(entity);
        const isNotBlacklisted = !this.blacklistedTargets.has(entityKey);

        let isAvailable = false;
        if (typeof entity.isAvailableForHarvest === 'function') {
            isAvailable = entity.isAvailableForHarvest(this);
        } else {
            isAvailable = !(entity.isDestroyed && entity.isDestroyed());
        }

        return isNotBlacklisted && isAvailable;
    }

    private buildingHasResources(building: TiledBuilding, resourceTypes: ResourceType[]): boolean {
        try {
            return resourceTypes.some((resourceType) => {
                const amount = building.getBuildingResource(resourceType);
                return amount > 0;
            });
        } catch (error) {
            console.error(`Worker ${this.config.name}: Error checking building resources:`, error);
            return false;
        }
    }

    private buildingCanAcceptResources(building: TiledBuilding, resourceTypes: ResourceType[]): boolean {
        try {
            return resourceTypes.some((resourceType) => {
                const capacity = building.getBuildingResourceCapacity(resourceType);
                const current = building.getBuildingResource(resourceType);
                return capacity > current;
            });
        } catch (error) {
            console.error(`Worker ${this.config.name}: Error checking building capacity:`, error);
            return false;
        }
    }

    // #region Gestion d'état

    private setWorkerState(newState: WorkerState): void {
        this.state = newState;

        this.updateAnimation();
        this.updateItemDisplay();
    }

    private updateAnimation(): void {
        try {
            let animationKey: string;
            
            switch (this.state) {
                case WorkerState.IDLE:
                case WorkerState.WAITING:
                    animationKey = this.config.animations.idle.type;
                    break;
                case WorkerState.MOVING_TO_HARVEST:
                case WorkerState.MOVING_TO_DEPOSIT:
                    // Choisir entre walking et carrying selon l'inventaire
                    animationKey = this.getTotalInventory() > 0 
                        ? this.config.animations.carrying.type 
                        : this.config.animations.walking.type;
                    break;
                case WorkerState.HARVESTING:
                    animationKey = this.config.animations.working.type;
                    break;
                case WorkerState.DEPOSITING:
                    animationKey = this.config.animations.depositing.type;
                    break;
                default:
                    animationKey = this.config.animations.idle.type;
            }

            this.play(animationKey);
        } catch (error) {
            console.warn('Worker: Could not update animation:', error);
        }
    }

    private updateItemDisplay(): void {
        const animationState = this.getAnimationStateKey();
        this.itemDisplayManager.updateItemDisplay(animationState);
    }

    private getAnimationStateKey(): string {
        switch (this.state) {
            case WorkerState.IDLE:
            case WorkerState.WAITING:
                return 'idle';
            case WorkerState.MOVING_TO_HARVEST:
            case WorkerState.MOVING_TO_DEPOSIT:
                return this.getTotalInventory() > 0 ? 'carrying' : 'walking';
            case WorkerState.HARVESTING:
                return 'working';
            case WorkerState.DEPOSITING:
                return 'depositing';
            default:
                return 'idle';
        }
    }

    private blacklistTarget(target: ResourceEntity | TiledBuilding): void {
        const key = this.getEntityKey(target);
        this.blacklistedTargets.add(key);
    }

    private getEntityKey(entity: ResourceEntity | TiledBuilding): string {
        if (entity instanceof ResourceEntity) {
            return `ResourceEntity_${Math.round(entity.x)}_${Math.round(entity.y)}`;
        } else {
            const pos = entity.getPosition();
            return `TiledBuilding_${entity.getType()}_${Math.round(pos.x)}_${Math.round(pos.y)}`;
        }
    }

    private cleanupBlacklistPeriodically(): void {
        const now = Date.now();
        if (now - this.lastBlacklistCleanup > 30000) {
            this.blacklistedTargets.clear();
            this.lastBlacklistCleanup = now;
        }
    }

    private clearTimers(): void {
        if (this.actionTimer) {
            this.actionTimer.destroy();
            this.actionTimer = null;
        }
        if (this.idleTimer) {
            this.idleTimer.destroy();
            this.idleTimer = null;
        }
        
        this.stopItemUpdateTimer();
    }

    public getConfig(): WorkerConfig {
        return this.config;
    }

    public getState(): WorkerState {
        return this.state;
    }

    public getStats(): any {
        return {
            totalHarvested: 0,
            totalDeposited: 0,
            workingTime: 0,
            idleTime: 0,
            created: Date.now(),
        };
    }

    public getInventory(): ReadonlyMap<ResourceType, number> {
        return new Map(this.inventory);
    }

    public getCurrentTarget(): ResourceEntity | TiledBuilding | null {
        return this.currentTarget;
    }

    public forceIdle(): void {
        this.clearTimers();

        if (this.currentTarget instanceof ResourceEntity) {
            this.currentTarget.releaseHarvester();
        }

        this.currentTarget = null;
        this.isMoving = false;
        (this.body as Phaser.Physics.Arcade.Body)?.stop();
        this.setWorkerState(WorkerState.IDLE);
    }

    public getAssignedBuildingId(): string | null {
        return GlobalWorkerStorage.getBuildingForWorker(this.workerId);
    }

    public setAssignedBuilding(buildingId: string | null): void {
        console.warn('setAssignedBuilding is deprecated, use GlobalWorkerStorage instead');
    }

    public isAssignedToBuilding(): boolean {
        return GlobalWorkerStorage.isWorkerAssigned(this.workerId);
    }

    public convertToNeutral(): void {
        const neutralConfig = WorkerRegistry.getInstance().getWorkerConfig(WorkerType.NEUTRAL);
        if (neutralConfig) {
            this.config = neutralConfig;
        }

        this.clearTint();
    }

    public convertToSpecializedWorker(newConfig: WorkerConfig, buildingId: string): void {
        this.config = newConfig;

        if (newConfig.tint) {
            this.setTint(newConfig.tint);
        }
    }

    public setDepositPoint(point: WorkerPosition | null): void {
        this.depositPoint = point;
    }

    public getWorkerId(): string {
        if (!this.workerId) {
            this.workerId = `worker_${Math.floor(this.x)}_${Math.floor(this.y)}_${Date.now()}`;
        }
        return this.workerId;
    }

    public destroy(): void {
        this.clearTimers();
    
        if (this.itemDisplayManager) {
            this.itemDisplayManager.destroy();
        }
    
        if (this.currentTarget instanceof ResourceEntity) {
            this.currentTarget.releaseHarvester();
        }
    
        if (this.mainLoopTimer) {
            this.mainLoopTimer.destroy();
            this.mainLoopTimer = null;
        }
    
        super.destroy();
    }
}
