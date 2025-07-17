import Phaser from 'phaser';
type Scene = typeof Phaser.Scene;

import { BuildingInfoUI } from '../ui/BuildingInfoUI';
import {
    ResourceType,
    type ResourceStorage,
    createResourceStorage,
    type BuildingPosition,
    type BuildingDimensions, WorkerType
} from '../types';
import { ResourceManager } from '@/game/services/ResourceManager';
import { BuildingRegistry } from '@/game/services';
import { GlobalWorkerStorage } from '@/game/stores/GlobalWorkerStorage';

interface BuildingZone {
    readonly zone: Phaser.GameObjects.Zone;
    readonly layersToHide: readonly string[];
    readonly depthChanges: Readonly<Record<string, number>>;
}

interface LayerState {
    baseDepth: number;
    currentDepth: number;
    currentAlpha: number;
    readonly activeZones: Set<BuildingZone>;
}

interface BuildingInteractionConfig {
    readonly playerStationaryTime: number;
    readonly movementTolerance: number;
    readonly interactionCooldown: number;
}

export class TiledBuilding {
    private readonly scene: Scene;
    private readonly buildingType: string;
    private readonly position: BuildingPosition;
    private readonly resourceManager: ResourceManager;
    private readonly config: BuildingInteractionConfig;
    private readonly buildingRegistry: BuildingRegistry;

    private readonly layers: Phaser.Tilemaps.TilemapLayer[] = [];
    private readonly map: Phaser.Tilemaps.Tilemap;
    private readonly tileset: Phaser.Tilemaps.Tileset;
    private readonly collisionBodies: Phaser.Physics.Arcade.Body[] = [];
    private readonly interactiveZones: BuildingZone[] = [];
    private readonly layerStates = new Map<string, LayerState>();

    private cornerPoints: { position: Position, type: string }[] = [];
    private cornerSprites: Phaser.GameObjects.Sprite[] = [];
    private hoverCornerSprites: Phaser.GameObjects.Sprite[] = [];
    private isSelected: boolean = false;
    private isHovered: boolean = false;
    private static readonly CORNER_TYPES = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

    private maxWorkers: number = 0;
    private buildingId: string = '';

    private playerInside: boolean = false;
    private lastInteractionTime: number = 0;
    private playerStationaryTimer: Phaser.Time.TimerEvent | null = null;
    private lastPlayerPosition: BuildingPosition | null = null;

    private readonly resourceStorage: ResourceStorage;

    constructor(scene: Scene, x: number, y: number, templateKey: string, buildingType: string) {
        this.scene = scene;
        this.position = { x, y };
        this.buildingType = buildingType;

        this.buildingRegistry = BuildingRegistry.getInstance();

        this.resourceManager = ResourceManager.getInstance();
        this.maxWorkers = this.getMaxWorkersForBuilding();
        this.buildingId = this.generateBuildingId();

        this.config = {
            playerStationaryTime: 500,
            movementTolerance: 8,
            interactionCooldown: 1000
        };

        try {
            this.map = scene.make.tilemap({ key: templateKey });
            this.tileset = this.initializeTileset();
            this.resourceStorage = this.initializeStorage();

            this.createLayers(x, y);
            this.setupInteractiveZones(x, y);

        } catch (error) {
            console.error('Erreur lors de la création du bâtiment:', error);
            throw error;
        }

        this.loadCornerPoints();
        this.setupInteractionEvents();
    }

    private generateBuildingId(): string {
        if (!this.buildingType || this.buildingType.trim() === '') {
            console.error('Building type is empty or undefined!');
            return `unknown_${Math.round(this.position.x)}_${Math.round(this.position.y)}_${Date.now()}`;
        }

        const x = this.position.x;
        const y = this.position.y;

        if (isNaN(x) || isNaN(y)) {
            console.error('Position contains NaN values!', this.position);
            return `${this.buildingType}_invalid_position_${Date.now()}`;
        }

        return `${this.buildingType.trim()}_${Math.round(x)}_${Math.round(y)}`;
    }

    private initializeTileset(): Phaser.Tilemaps.Tileset {
        const tilesetName = this.map.tilesets[0]?.name;
        if (!tilesetName) {
            throw new Error(`Aucun tileset trouvé dans le template ${this.buildingType}`);
        }

        const tileset = this.map.addTilesetImage(tilesetName, 'tiles');
        if (!tileset) {
            throw new Error(`Impossible d'ajouter le tileset ${tilesetName}`);
        }

        return tileset;
    }

    public getMaxWorkersForBuilding(): number {
        const config = this.buildingRegistry.getBuildingConfig(this.buildingType);
        return config?.maxWorkers || 0;
    }

    public getMaxWorkers(): number {
        return this.maxWorkers;
    }

    public canAssignWorker(): boolean {
        return this.getAssignedWorkerCount() < this.maxWorkers;
    }

    public clearAllWorkers(): void {
        const previousCount = this.getAssignedWorkerCount();
        GlobalWorkerStorage.clearBuildingWorkers(this.buildingId);

        console.log(`Cleared all workers from building. Previous count: ${previousCount}`);

        window.dispatchEvent(new CustomEvent('game:buildingWorkersCleared', {
            detail: {
                buildingId: this.buildingId,
                previousCount,
                newCount: 0
            }
        }));
    }

    public getWorkerAssignmentInfo(): {
        assigned: number;
        max: number;
        canAssign: boolean;
        workerIds: string[];
    } {
        return {
            assigned: this.getAssignedWorkerCount(),
            max: this.maxWorkers,
            canAssign: this.canAssignWorker(),
            workerIds: this.getAssignedWorkerIds() as string[]
        };
    }

    public assignWorker(workerId: string): boolean {
        console.log(`\n=== TiledBuilding.assignWorker (GLOBAL) ===`);
        console.log(`WorkerId: "${workerId}"`);
        console.log(`Building type: "${this.buildingType}"`);
        console.log(`Building ID: "${this.buildingId}"`);

        if (!workerId || workerId.trim() === '') {
            console.error('Invalid worker ID provided');
            return false;
        }

        if (!this.canAssignWorker()) {
            console.error('Cannot assign worker - building at capacity');
            return false;
        }

        // Utiliser le stockage global
        const success = GlobalWorkerStorage.assignWorkerToBuilding(workerId, this.buildingId, this.maxWorkers);

        if (success) {
            // Vérification immédiate après assignation
            const newCount = this.getAssignedWorkerCount();
            console.log(`Post-assignment verification: ${newCount} workers`);

            // Déclencher l'événement avec les bonnes données
            window.dispatchEvent(new CustomEvent('game:workerAssignedToBuilding', {
                detail: {
                    buildingId: this.buildingId,
                    workerId,
                    assignedCount: newCount,
                    maxWorkers: this.maxWorkers
                }
            }));

            console.log(`Worker assigned successfully. Event sent with count: ${newCount}`);
        } else {
            console.error('Global assignment failed');
        }

        console.log(`=== END assignWorker ===\n`);
        return success;
    }

    public getAssignedWorkerCount(): number {
        const count = GlobalWorkerStorage.getWorkerCount(this.buildingId);
        console.log(`getAssignedWorkerCount: ${count} workers assigned`);
        return count;
    }

    public debugWorkerAssignment(): void {
        console.log('\n=== BUILDING WORKER DEBUG (GLOBAL) ===');
        console.log('Building type:', this.buildingType);
        console.log('Building ID:', this.buildingId);
        console.log('Position:', this.position);
        console.log('Global worker count:', GlobalWorkerStorage.getWorkerCount(this.buildingId));
        console.log('Global worker IDs:', GlobalWorkerStorage.getWorkersForBuilding(this.buildingId));
        console.log('Max workers:', this.maxWorkers);
        console.log('Worker type for building:', this.getWorkerType());
        console.log('Can assign worker:', this.canAssignWorker());

        // Debug du stockage global
        GlobalWorkerStorage.debugStorage();

        console.log('=== END BUILDING DEBUG ===\n');
    }

    public unassignWorker(workerId: string): boolean {
        console.log(`\n=== TiledBuilding.unassignWorker (GLOBAL) ===`);
        console.log(`WorkerId: "${workerId}"`);
        console.log(`Building ID: "${this.buildingId}"`);

        if (!workerId || workerId.trim() === '') {
            console.error('Invalid worker ID provided');
            return false;
        }

        const success = GlobalWorkerStorage.unassignWorkerFromBuilding(workerId);

        if (success) {
            const newCount = this.getAssignedWorkerCount();

            window.dispatchEvent(new CustomEvent('game:workerUnassignedFromBuilding', {
                detail: {
                    buildingId: this.buildingId,
                    workerId,
                    assignedCount: newCount,
                    maxWorkers: this.maxWorkers
                }
            }));
            console.log(`Worker unassigned successfully. New count: ${newCount}`);
        } else {
            console.warn('Global unassignment failed');
        }

        console.log(`=== END unassignWorker ===\n`);
        return success;
    }


    public getAssignedWorkerIds(): readonly string[] {
        const workers = GlobalWorkerStorage.getWorkersForBuilding(this.buildingId);
        console.log(`getAssignedWorkerIds: [${workers.join(', ')}]`);
        return workers;
    }

    public isWorkerAssigned(workerId: string): boolean {
        const assignedBuildingId = GlobalWorkerStorage.getBuildingForWorker(workerId);
        return assignedBuildingId === this.buildingId;
    }


    public getBuildingId(): string {
        return this.buildingId;
    }

    public getWorkerType(): WorkerType {
        const config = this.buildingRegistry.getBuildingConfig(this.buildingType);
        return config?.workerType || WorkerType.NEUTRAL;
    }

    private handlePointerOver(): void {
        if (this.scene.uiScene) {
            this.scene.uiScene.defaultCursor.setVisible(false);
            this.scene.uiScene.hoverCursor.setVisible(true);
        }

        this.setAlpha(0.8);
    }

    private handlePointerDown(): void {
        window.dispatchEvent(new CustomEvent('game:buildingSelected', {
            detail: {
                building: this,
                type: this.buildingType,
                position: this.position
            }
        }));
    }


    public setAlpha(alpha: number): void {
        const clampedAlpha = Phaser.Math.Clamp(alpha, 0, 1);
        this.layers.forEach(layer => {
            layer.setAlpha(clampedAlpha);
        });
    }

    private handlePointerOut(): void {
        // Rétablir le curseur par défaut
        if (this.scene.uiScene) {
            this.scene.uiScene.defaultCursor.setVisible(true);
            this.scene.uiScene.hoverCursor.setVisible(false);
        }

        // Annuler la surbrillance
        this.setAlpha(1);
    }

    private initializeStorage(): ResourceStorage {
        const storageConfig = this.getStorageConfig();
        return createResourceStorage(storageConfig);
    }

    private getStorageConfig(): Record<ResourceType, number> {
        const config = this.buildingRegistry.getBuildingConfig(this.buildingType);
        const raw = config?.storageCapacities || {};
        // Filtrer les undefined pour respecter Record<ResourceType, number>
        const filtered: Record<ResourceType, number> = {};
        for (const key in raw) {
            const value = raw[key as ResourceType];
            if (typeof value === 'number') {
                filtered[key as ResourceType] = value;
            }
        }
        return filtered;
    }

    public getAllBuildingResourceCapacities(): ReadonlyMap<ResourceType, number> {
        return new Map(this.resourceStorage.capacity);
    }

    private notifyResourceChange(type: ResourceType, oldAmount: number, newAmount: number): void {
        window.dispatchEvent(new CustomEvent('game:buildingResourceChanged', {
            detail: {
                building: this,
                buildingId: this.buildingId,
                resourceType: type,
                oldAmount,
                newAmount,
                capacity: this.getBuildingResourceCapacity(type)
            }
        }));
    }

    public getBuildingResourceInfo(type: ResourceType): { current: number, capacity: number, percentage: number } {
        const current = this.getBuildingResource(type);
        const capacity = this.getBuildingResourceCapacity(type);
        const percentage = capacity > 0 ? (current / capacity) * 100 : 0;

        return { current, capacity, percentage };
    }

    public getStorageUtilization(): { total: number, used: number, percentage: number } {
        const total = Array.from(this.resourceStorage.capacity.values()).reduce((sum, cap) => sum + cap, 0);
        const used = Array.from(this.resourceStorage.stored.values()).reduce((sum, amount) => sum + amount, 0);
        const percentage = total > 0 ? (used / total) * 100 : 0;

        return { total, used, percentage };
    }

    private createLayers(x: number, y: number): void {
        this.map.layers.forEach(layerData => {
            const layer = this.map.createLayer(layerData.name, this.tileset, x, y);

            if (layer) {
                const properties = this.extractLayerProperties(layerData);
                const baseDepth = properties.depth ?? 0;

                layer.setDepth(baseDepth);

                this.layerStates.set(layerData.name, {
                    baseDepth,
                    currentDepth: baseDepth,
                    currentAlpha: 1,
                    activeZones: new Set()
                });

                this.layers.push(layer);
                this.setupTileCollisions(layer, x, y);
            }
        });
    }

    private extractLayerProperties(layerData: Phaser.Tilemaps.LayerData): Record<string, any> {
        const properties: Record<string, any> = {};

        if (layerData.properties && Array.isArray(layerData.properties)) {
            layerData.properties.forEach(prop => {
                properties[prop.name] = prop.value;
            });
        }

        return properties;
    }

    private setupInteractiveZones(x: number, y: number): void {
        const objectLayer = this.map.getObjectLayer('Zones');
        if (!objectLayer) return;

        objectLayer.objects.forEach(obj => {
            if (obj.type === 'entrance') {
                const zone = this.createZone(obj, x, y);
                const buildingZone = this.createBuildingZone(obj, zone);

                this.interactiveZones.push(buildingZone);
                this.setupZoneDebugVisual(zone, obj);
            }
        });
    }

    private createZone(obj: any, x: number, y: number): Phaser.GameObjects.Zone {
        const zone = this.scene.add.zone(
            x + obj.x! + obj.width! / 2,
            y + obj.y! + obj.height! / 2,
            obj.width,
            obj.height
        );

        this.scene.physics.world.enable(zone);
        const body = zone.body as Phaser.Physics.Arcade.Body;
        body.setAllowGravity(false);
        body.moves = false;

        return zone;
    }

    private createBuildingZone(obj: any, zone: Phaser.GameObjects.Zone): BuildingZone {
        const depthChanges = this.parseDepthChanges(obj);
        const layersToHide = this.parseLayersToHide(obj);

        return {
            zone,
            layersToHide,
            depthChanges
        };
    }

    private parseDepthChanges(obj: any): Record<string, number> {
        const depthChanges: Record<string, number> = {};
        const depthChangesProp = obj.properties?.find(p => p.name === 'depthChanges')?.value;

        if (depthChangesProp) {
            depthChangesProp.split(',').forEach((change: string) => {
                const [layerName, depth] = change.split(':');
                const layerKey = layerName.trim();
                const depthValue = parseInt(depth);

                if (!isNaN(depthValue)) {
                    depthChanges[layerKey] = depthValue;
                }
            });
        }

        return depthChanges;
    }

    private parseLayersToHide(obj: any): string[] {
        return obj.properties?.find(p => p.name === 'hideLayerNames')?.value?.split(',')?.map((name: string) => name.trim()) || [];
    }

    private setupZoneDebugVisual(zone: Phaser.GameObjects.Zone, obj: any): void {
        if (process.env.NODE_ENV === 'development') {
            this.scene.add.rectangle(
                zone.x,
                zone.y,
                zone.width,
                zone.height,
                0xff0000,
                0.2
            ).setOrigin(0.5, 0.5);
        }
    }

    private setupTileCollisions(layer: Phaser.Tilemaps.TilemapLayer, offsetX: number, offsetY: number): void {
        for (let y = 0; y < layer.layer.height; y++) {
            for (let x = 0; x < layer.layer.width; x++) {
                const tile = layer.getTileAt(x, y);
                if (!tile) continue;

                const collisionData = this.tileset.getTileCollisionGroup(tile.index);
                this.processTileCollisions(collisionData, tile, x, y, offsetX, offsetY);
            }
        }
    }

    private processTileCollisions(
        collisionData: any,
        tile: Phaser.Tilemaps.Tile,
        tileX: number,
        tileY: number,
        offsetX: number,
        offsetY: number
    ): void {
        if (!collisionData?.objects?.length) return;

        collisionData.objects.forEach((collisionObject: any) => {
            const collisionX = offsetX + tileX * this.map.tileWidth + collisionObject.x;
            const collisionY = offsetY + tileY * this.map.tileHeight + collisionObject.y;

            const collisionBody = this.createCollisionBody(collisionObject, collisionX, collisionY);
            if (collisionBody) {
                this.collisionBodies.push(collisionBody);
            }
        });
    }

    private createCollisionBody(collisionObject: any, x: number, y: number): Phaser.Physics.Arcade.Body | null {
        let gameObject: Phaser.GameObjects.GameObject | null = null;

        if (collisionObject.rectangle) {
            gameObject = this.scene.add.rectangle(
                x + collisionObject.width / 2,
                y + collisionObject.height / 2,
                collisionObject.width,
                collisionObject.height
            );
        } else if (collisionObject.polygon) {
            const points = collisionObject.polygon.map((point: any) =>
                new Phaser.Geom.Point(point.x, point.y)
            );
            gameObject = this.scene.add.polygon(x, y, points, 0x000000, 0);
        }

        if (gameObject) {
            this.scene.physics.add.existing(gameObject, true);
            return gameObject.body as Phaser.Physics.Arcade.Body;
        }

        return null;
    }

    public update(player: Phaser.Physics.Arcade.Sprite): void {
        this.resetActiveZones();

        const playerCurrentlyInside = this.checkPlayerInZones(player);
        this.updatePlayerInteraction(player, playerCurrentlyInside);
        this.updateLayerEffects();
    }

    private resetActiveZones(): void {
        this.layerStates.forEach(state => {
            state.activeZones.clear();
        });
    }

    private checkPlayerInZones(player: Phaser.Physics.Arcade.Sprite): boolean {
        let playerInside = false;

        this.interactiveZones.forEach(zone => {
            const isOverlapping = this.scene.physics.overlap(player, zone.zone);

            if (isOverlapping) {
                playerInside = true;
                this.activateZoneEffects(zone);

                if (!this.playerInside && zone.layersToHide.length > 0) {
                    this.onPlayerEnter(player);
                }

                this.checkPlayerStationary(player);
            }
        });

        return playerInside;
    }

    private activateZoneEffects(zone: BuildingZone): void {
        this.layers.forEach(layer => {
            const layerState = this.layerStates.get(layer.layer.name);
            if (layerState) {
                layerState.activeZones.add(zone);
            }
        });
    }

    private updatePlayerInteraction(player: Phaser.Physics.Arcade.Sprite, playerCurrentlyInside: boolean): void {
        if (!playerCurrentlyInside && this.playerInside) {
            this.onPlayerExit();
        }

        this.playerInside = playerCurrentlyInside;
    }

    private updateLayerEffects(): void {
        this.layers.forEach(layer => {
            const layerState = this.layerStates.get(layer.layer.name);
            if (!layerState) return;

            this.updateLayerVisibility(layer, layerState);
            this.updateLayerDepth(layer, layerState);
        });
    }

    private updateLayerVisibility(layer: Phaser.Tilemaps.TilemapLayer, layerState: LayerState): void {
        const shouldBeHidden = Array.from(layerState.activeZones).some(zone =>
            zone.layersToHide.includes(layer.layer.name)
        );

        const targetAlpha = shouldBeHidden ? 0 : 1;

        if (layerState.currentAlpha !== targetAlpha) {
            this.scene.tweens.add({
                targets: layer,
                alpha: targetAlpha,
                duration: 150,
                onUpdate: () => {
                    layerState.currentAlpha = layer.alpha;
                }
            });
        }
    }

    private updateLayerDepth(layer: Phaser.Tilemaps.TilemapLayer, layerState: LayerState): void {
        let highestDepthChange = layerState.baseDepth;

        layerState.activeZones.forEach(zone => {
            const depthChange = zone.depthChanges[layer.layer.name];
            if (depthChange !== undefined) {
                highestDepthChange = Math.max(highestDepthChange, depthChange);
            }
        });

        if (layerState.currentDepth !== highestDepthChange) {
            layer.setDepth(highestDepthChange);
            layerState.currentDepth = highestDepthChange;
        }
    }

    private onPlayerEnter(player: Phaser.Physics.Arcade.Sprite): void {
        this.lastPlayerPosition = { x: player.x, y: player.y };
    }

    private onPlayerExit(): void {
        this.scene.time.delayedCall(200, () => {
            if (!this.isPlayerStillInside()) {
                this.cleanupPlayerInteraction();
                this.closeBuildingInterface();
            }
        });
    }

    private isPlayerStillInside(): boolean {
        const player = (this.scene as any).player;
        if (!player) return false;

        return this.interactiveZones.some(zone =>
            this.scene.physics.overlap(player, zone.zone)
        );
    }

    private cleanupPlayerInteraction(): void {
        this.playerStationaryTimer?.destroy();
        this.playerStationaryTimer = null;
        this.lastPlayerPosition = null;
    }

    private closeBuildingInterface(): void {
        window.dispatchEvent(new CustomEvent('game:hideBuildingInfo'));
    }

    private checkPlayerStationary(player: Phaser.Physics.Arcade.Sprite): void {
        if (!this.lastPlayerPosition) {
            this.lastPlayerPosition = { x: player.x, y: player.y };
            return;
        }

        const distance = Phaser.Math.Distance.Between(
            this.lastPlayerPosition.x,
            this.lastPlayerPosition.y,
            player.x,
            player.y
        );

        if (distance > this.config.movementTolerance) {
            this.lastPlayerPosition = { x: player.x, y: player.y };
            this.resetStationaryTimer();
        } else if (!this.playerStationaryTimer) {
            this.startStationaryTimer();
        }
    }

    private resetStationaryTimer(): void {
        this.playerStationaryTimer?.destroy();
        this.playerStationaryTimer = null;
    }

    private startStationaryTimer(): void {
        return;
        /*
        this.playerStationaryTimer = this.scene.time.delayedCall(
            this.config.playerStationaryTime,
            () => this.openBuildingInterface()
        );
        */
    }

    private openBuildingInterface(): void {
        const currentTime = Date.now();
        if (currentTime - this.lastInteractionTime < this.config.interactionCooldown) {
            return;
        }

        this.lastInteractionTime = currentTime;

        window.dispatchEvent(new CustomEvent('game:buildingInfo', {
            detail: { building: this }
        }));
    }

    private createBuildingUIScene(): void {
        this.scene.scene.add('BuildingInfoUI', BuildingInfoUI, true);

        this.scene.time.delayedCall(100, () => {
            const newBuildingUI = this.scene.scene.get('BuildingInfoUI') as BuildingInfoUI;
            newBuildingUI?.showBuildingInfo(this);
        });
    }

    public setupCollisions(player: Phaser.Physics.Arcade.Sprite): void {
        this.collisionBodies.forEach(body => {
            // this.scene.physics.add.collider(player, body);
        });
    }

    private loadCornerPoints(): void {
        const cornersLayer = this.map.getObjectLayer('Corners');

        if (cornersLayer && cornersLayer.objects) {
            cornersLayer.objects.forEach(obj => {
                let cornerType = 'top-left';

                if (obj.properties && Array.isArray(obj.properties)) {
                    const typeProperty = obj.properties.find(p => p.name === 'type');
                    if (typeProperty && TiledBuilding.CORNER_TYPES.includes(typeProperty.value)) {
                        cornerType = typeProperty.value;
                    }
                }

                this.cornerPoints.push({
                    position: { x: obj.x || 0, y: obj.y || 0 },
                    type: cornerType
                });
            });
        }
    }

    private setupInteractionEvents(): void {
        this.layers.forEach(layer => {
            layer.setInteractive();

            layer.on('pointerover', () => {
                if (!this.isSelected) {
                    this.setHovered(true);
                }
            });

            layer.on('pointerout', () => {
                if (!this.isSelected) {
                    this.setHovered(false);
                }
            });
        });
    }

    public setSelected(selected: boolean): void {
        if (this.isSelected === selected) return;

        this.isSelected = selected;

        if (selected) {
            this.setHovered(false);
            this.showSelectionCorners();
        } else {
            this.hideSelectionCorners();
        }
    }

    public setHovered(hovered: boolean): void {
        if (this.isHovered === hovered || this.isSelected) return;

        this.isHovered = hovered;

        if (hovered) {
            this.showHoverCorners();
        } else {
            this.hideHoverCorners();
        }
    }

    private showSelectionCorners(): void {
        this.hideHoverCorners();
        this.hideSelectionCorners();

        this.cornerPoints.forEach(cornerPoint => {
            const spriteKey = this.getCornerSpriteKey(cornerPoint.type);
            const sprite = this.scene.add.sprite(
                this.position.x + cornerPoint.position.x,
                this.position.y + cornerPoint.position.y,
                spriteKey
            );

            sprite.setOrigin(0.5, 0.5);
            sprite.setDepth(1000);
            sprite.setAlpha(1.0);

            this.createCornerAnimation(sprite, cornerPoint.type);
            this.cornerSprites.push(sprite);
        });
    }

    private showHoverCorners(): void {
        this.hideHoverCorners();

        this.cornerPoints.forEach(cornerPoint => {
            const spriteKey = this.getCornerSpriteKey(cornerPoint.type);
            const sprite = this.scene.add.sprite(
                this.position.x + cornerPoint.position.x,
                this.position.y + cornerPoint.position.y,
                spriteKey
            );

            sprite.setOrigin(0.5, 0.5);
            sprite.setDepth(2000);
            sprite.setAlpha(1);
            sprite.setScale(1);

            this.createCornerAnimation(sprite, cornerPoint.type);
            this.hoverCornerSprites.push(sprite);
        });
    }

    private hideSelectionCorners(): void {
        this.cornerSprites.forEach(sprite => {
            this.scene.tweens.killTweensOf(sprite);
            sprite.destroy();
        });
        this.cornerSprites = [];
    }


    private hideHoverCorners(): void {
        this.hoverCornerSprites.forEach(sprite => {
            this.scene.tweens.killTweensOf(sprite);
            sprite.destroy();
        });
        this.hoverCornerSprites = [];
    }


    private getCornerSpriteKey(cornerType: string): string {
        switch (cornerType) {
            case 'top-left':
                return 'corner-top-left';
            case 'top-right':
                return 'corner-top-right';
            case 'bottom-left':
                return 'corner-bottom-left';
            case 'bottom-right':
                return 'corner-bottom-right';
            default:
                return 'corner-top-left';
        }
    }

    private createCornerAnimation(sprite: Phaser.GameObjects.Sprite, type: string): void {
        let xMove = 0;
        let yMove = 0;

        switch (type) {
            case 'top-left':
                xMove = 3;
                yMove = 3;
                break;
            case 'top-right':
                xMove = -3;
                yMove = 3;
                break;
            case 'bottom-left':
                xMove = 3;
                yMove = -3;
                break;
            case 'bottom-right':
                xMove = -3;
                yMove = -3;
                break;
        }

        this.scene.tweens.add({
            targets: sprite,
            x: sprite.x + xMove,
            y: sprite.y + yMove,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    // API publique pour les ressources
    public addResourceToBuilding(type: ResourceType, amount: number): number {
        const currentStored = this.resourceStorage.stored.get(type) || 0;
        const capacity = this.resourceStorage.capacity.get(type) || 0;
        const canAdd = Math.min(amount, capacity - currentStored);

        if (canAdd > 0) {
            const newAmount = currentStored + canAdd;
            this.resourceStorage.stored.set(type, newAmount);
            this.notifyResourceChange(type, currentStored, newAmount);
        }

        return canAdd;
    }
    
    public getCollisionZones(): Phaser.Geom.Rectangle[] {
        const zones: Phaser.Geom.Rectangle[] = [];
        const position = this.getPosition();

        const collisionLayer = this.map.getObjectLayer('Collision');
        
        if (collisionLayer && collisionLayer.objects) {
            collisionLayer.objects.forEach(obj => {
                zones.push(new Phaser.Geom.Rectangle(
                    position.x + obj.x!,
                    position.y + obj.y!,
                    obj.width || 0,
                    obj.height || 0
                ));
            });
        } else {
            const dimensions = this.getDimensions();
            zones.push(new Phaser.Geom.Rectangle(
                position.x,
                position.y,
                dimensions.tilesWidth * 16,
                dimensions.tilesHeight * 16
            ));
        }

        return zones;
    }

    public removeResourceFromBuilding(type: ResourceType, amount: number): number {
        const currentStored = this.resourceStorage.stored.get(type) || 0;
        const canRemove = Math.min(amount, currentStored);

        if (canRemove > 0) {
            const newAmount = currentStored - canRemove;
            this.resourceStorage.stored.set(type, newAmount);
            this.notifyResourceChange(type, currentStored, newAmount);
        }

        return canRemove;
    }

    public getBuildingResource(type: ResourceType): number {
        return this.resourceStorage.stored.get(type) || 0;
    }

    public getBuildingResourceCapacity(type: ResourceType): number {
        return this.resourceStorage.capacity.get(type) || 0;
    }

    public getAllBuildingResources(): ReadonlyMap<ResourceType, number> {
        return new Map(this.resourceStorage.stored);
    }

    public getMap(): Phaser.Tilemaps.Tilemap {
        return this.map;
    }

    public getPosition(): BuildingPosition {
        return { ...this.position };
    }

    public getType(): string {
        return this.buildingType;
    }

    public getDimensions(): BuildingDimensions {
        return {
            tilesWidth: this.map.width,
            tilesHeight: this.map.height
        };
    }

    public getIsSelected(): boolean {
        return this.isSelected;
    }

    public getIsHovered(): boolean {
        return this.isHovered;
    }

    public getBuildingName(): string {
        return this.buildingRegistry.getBuildingName(this.buildingType);
    }

    public destroy(): void {
        this.hideSelectionCorners();
        this.hideHoverCorners();

        this.layers.forEach(layer => layer.destroy());
        this.interactiveZones.forEach(zone => zone.zone.destroy());

        this.collisionBodies.forEach(body => {
            if (body.gameObject) {
                body.gameObject.destroy();
            }
        });

        this.cleanupPlayerInteraction();
        this.layerStates.clear();
    }
}
