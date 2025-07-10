import Phaser from 'phaser';

import { AnimationType } from '@/game/types/AnimationTypes';
import { AnimationUtils } from '@/game/utils/AnimationUtils';
import { type ResourceEntityConfig, type ResourceEntitySpawnData } from '@/game/types/ResourceEntityTypes';
import { ResourceType } from '@/game/types/ResourceSystemTypes';
import { ResourceManager } from '@/game/services/ResourceManager';
import { useGameStore } from '@/game/stores/gameStore';

interface ResourceEntityState {
    isDestroyed: boolean;
    isBeingHarvested: boolean;
    currentHealth: number;
    currentHarvester: any;
    isBlocking: boolean;
}

export class ResourceEntity extends Phaser.Physics.Arcade.Sprite {
    private readonly config: ResourceEntityConfig;
    private readonly spawnData: ResourceEntitySpawnData;
    private _state: ResourceEntityState;
    private animationHandler: ReturnType<typeof AnimationUtils.createAnimationHandler> = {} as any;
    private readonly resourceManager: ResourceManager;

    private detectionZone?: Phaser.GameObjects.Zone;
    private stump?: Phaser.GameObjects.Sprite;
    private healthBar?: Phaser.GameObjects.Sprite;

    private healingTimer?: Phaser.Time.TimerEvent;
    private cornerSprites: Phaser.GameObjects.Sprite[] = [];
    private static readonly CORNER_TYPES = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    private isPlayerApproaching: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, config: ResourceEntityConfig, spawnData: ResourceEntitySpawnData) {
        super(scene, x, y, config.texture);

        this.config = config;
        this.spawnData = spawnData;

        this.resourceManager = ResourceManager.getInstance();

        this._state = {
            isDestroyed: false,
            isBeingHarvested: false,
            currentHealth: config.health,
            currentHarvester: null,
            isBlocking: config.blockingPath
        };

        this.initializeEntity();
        this.setupAnimations();
        this.applyCustomProperties();
    }

    public static create(
        scene: Phaser.Scene,
        x: number,
        y: number,
        config: ResourceEntityConfig,
        spawnData: ResourceEntitySpawnData
    ): ResourceEntity | null {
        try {
            const entity = new ResourceEntity(scene, x, y, config, spawnData);

            if (!entity.validateResources()) {
                entity.destroy();
                return null;
            }

            return entity;
        } catch (error) {
            return null;
        }
    }

    private initializeEntity(): void {
        this.setInteractive();
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this, true);

        this.createDetectionZone();
        this.createStump();
        this.createHealthBar();
        this.setupCursorEvents();

        this.setDepth(10);
        this.setScale(this.config.scale);
    }

    private setupAnimations(): void {
        AnimationUtils.initializeEntityAnimations(this, 'tree');
        this.animationHandler = AnimationUtils.createAnimationHandler(this);
        this.animationHandler.idle(this.config.animations.idle as AnimationType);
    }

    private applyCustomProperties(): void {
        if (!this.spawnData.properties) return;

        Object.entries(this.spawnData.properties).forEach(([key, value]) => {
            const propertyConfig = this.config.customProperties[key];
            if (!propertyConfig) return;

            switch (key) {
                case 'respawnTime':
                    if (typeof value === 'number') {
                        (this.config as any).respawnTime = Math.max(
                            propertyConfig.min || 0,
                            Math.min(propertyConfig.max || Number.MAX_SAFE_INTEGER, value)
                        );
                    }
                    break;
                case 'woodValue':
                    if (typeof value === 'number') {
                        (this.config as any).resources[0].amount = Math.max(
                            propertyConfig.min || 1,
                            Math.min(propertyConfig.max || 100, value)
                        );
                    }
                    break;
                case 'scale':
                    if (typeof value === 'number') {
                        this.setScale(Math.max(
                            propertyConfig.min || 0.1,
                            Math.min(propertyConfig.max || 5.0, value)
                        ));
                    }
                    break;
            }
        });
    }

    private createDetectionZone(): void {
        this.detectionZone = this.scene.add.zone(this.x, this.y, this.config.interactionRadius, this.config.interactionRadius);
        this.scene.physics.add.existing(this.detectionZone, true);
    }

    private createStump(): void {
        this.stump = this.scene.add.sprite(this.x, this.y, this.config.texture, 5).setVisible(false);
    }

    private createHealthBar(): void {
        this.healthBar = this.scene.add.sprite(this.x, this.y - 20, 'health-bar')
            .setVisible(false)
            .setDepth(1000);
    }

    private setupCursorEvents(): void {
        this.on('pointerover', () => {
            this.handlePointerOver();
            this.showHoverCorners();
        });
        this.on('pointerout', () => {
            this.handlePointerOut();
            if (!this.isPlayerApproaching) {
                this.hideHoverCorners();
            }
        });
        this.on('pointerdown', this.handlePointerDown.bind(this));
    }

    private handlePointerOver(): void {
        if (!this._state.isDestroyed && (this.scene as any).uiScene) {
            (this.scene as any).uiScene.defaultCursor.setVisible(false);
            (this.scene as any).uiScene.hoverCursor.setVisible(true);
        }
    }

    private handlePointerOut(): void {
        if ((this.scene as any).uiScene) {
            (this.scene as any).uiScene.defaultCursor.setVisible(true);
            (this.scene as any).uiScene.hoverCursor.setVisible(false);
        }
    }

    private handlePointerDown(): void {
        if (!this._state.isDestroyed && !this._state.isBeingHarvested) {
            const player = (this.scene as any).player;
            if (player) {
                // Ajout d'un paramètre pour permettre à MainScene de gérer la cible
                this.startPlayerHarvesting(player, false);
            }
        }
    }

    public setupPlayerCollision(player: any): void {
        if (this.detectionZone) {
            this.scene.physics.add.overlap(
                player,
                this.detectionZone,
                this.handlePlayerOverlap.bind(this),
                undefined,
                this
            );
        }
    }

    private handlePlayerOverlap(): void {
        if (!this._state.isDestroyed && !this._state.isBeingHarvested) {
            this.updateCursorBasedOnFacing();
        }
    }

    private updateCursorBasedOnFacing(): void {
        const player = (this.scene as any).player;
        if (!player || !(this.scene as any).uiScene) return;

        const isFacingEntity = player.isFacingObject(this.x, this.y);
        const mousePointer = this.scene.input.mousePointer;
        const worldPoint = this.scene.cameras.main.getWorldPoint(mousePointer.x, mousePointer.y);
        const bounds = this.getBounds();

        if (isFacingEntity && bounds.contains(worldPoint.x, worldPoint.y)) {
            (this.scene as any).uiScene.defaultCursor.setVisible(false);
            (this.scene as any).uiScene.hoverCursor.setVisible(true);
        } else {
            (this.scene as any).uiScene.defaultCursor.setVisible(true);
            (this.scene as any).uiScene.hoverCursor.setVisible(false);
        }
    }

    public startPlayerHarvesting(player: any, manageTarget: boolean = true): void {
        if (this._state.isBeingHarvested || this._state.isDestroyed) return;

        if (manageTarget) {
            // Gestion par défaut (clic direct sur l'entité)
            const mainScene = this.scene as any;
            if (mainScene && mainScene.currentHarvestTarget && mainScene.currentHarvestTarget !== this) {
                mainScene.currentHarvestTarget.hideHoverCorners();
                mainScene.currentHarvestTarget.isPlayerApproaching = false;
            }
            if (mainScene) {
                mainScene.currentHarvestTarget = this;
            }
        }

        this.isPlayerApproaching = true;
        this.showHoverCorners();

        const interactionPoint = this.findNearestInteractionPoint(player.x, player.y);
        const mainScene = this.scene as any;

        const playerTilePos = this.worldToTile(player.x, player.y);
        const targetTilePos = this.worldToTile(interactionPoint.x, interactionPoint.y);

        mainScene.easyStar.findPath(
            playerTilePos.x, playerTilePos.y,
            targetTilePos.x, targetTilePos.y,
            (path: { x: number; y: number }[] | null) => {
                if (!path) {
                    return;
                }

                player.setPath(path);
                // Afficher les dots du chemin pour la récolte
                if (mainScene.showPathDots) {
                    mainScene.showPathDots(path);
                }
                this.waitForPlayerArrival(player, interactionPoint);
            }
        );

        mainScene.easyStar.calculate();
    }

    private waitForPlayerArrival(player: any, interactionPoint: { x: number; y: number }): void {
        const mainScene = this.scene as any;
        let stableCount = 0;
        let lastPosition = { x: player.x, y: player.y };

        const checkInterval = mainScene.time.addEvent({
            delay: 100,
            callback: () => {
                const distance = Phaser.Math.Distance.Between(
                    player.x, player.y,
                    interactionPoint.x, interactionPoint.y
                );

                const hasNotMoved = lastPosition.x === player.x && lastPosition.y === player.y;
                lastPosition = { x: player.x, y: player.y };

                if (distance < 20 && hasNotMoved) {
                    stableCount++;
                    if (stableCount >= 1) {
                        checkInterval.destroy();
                        this.hideHoverCorners();
                        this.isPlayerApproaching = false;
                        // Réinitialiser la cible courante dans MainScene
                        if (mainScene && mainScene.currentHarvestTarget === this) {
                            mainScene.currentHarvestTarget = null;
                        }
                        if (!this._state.isDestroyed) {
                            player.setFlipX(this.x <= player.x);
                            this.startAutoHarvesting().catch(console.error);
                        }
                    }
                } else {
                    stableCount = 0;
                }
            },
            loop: true
        });
    }

    private async startAutoHarvesting(isWorker: boolean = false): Promise<void> {
        if (!isWorker && this._state.isBeingHarvested) return;

        this._state.isBeingHarvested = true;
        this.setDepth(0);

        let isSequenceCancelled = false;

        while (this._state.currentHealth > 0 && !this._state.isDestroyed && !isSequenceCancelled) {
            if (!isWorker && this.isPlayerMoving()) {
                this.stopHarvesting();
                isSequenceCancelled = true;
                break;
            }

            this._state.currentHealth -= this.config.damagePerHit;
            await this.performHit(isWorker);

            if (this._state.currentHealth <= 0) break;
        }

        if (!isSequenceCancelled && this._state.currentHealth <= 0) {
            this.destroyEntity(isWorker);
        }

        this._state.isBeingHarvested = false;
    }

    private isPlayerMoving(): boolean {
        const player = (this.scene as any).player;
        return !!(player && (
            player.cursors.left.isDown ||
            player.cursors.right.isDown ||
            player.cursors.up.isDown ||
            player.cursors.down.isDown
        ));
    }

    private async performHit(isWorker: boolean = false): Promise<void> {
        if (!isWorker) {
            const player = (this.scene as any).player;
            if (player) {
                player.playChopAnimation(() => {
                    this.updateHealthBar(true);
                    this.spawnParticles();
                });
            }
        } else {
            this.updateHealthBar(true);
            this.spawnParticles();
            if (this._state.currentHarvester) {
                this.scene.events.emit('worker_harvesting', this._state.currentHarvester);
            }
        }

        await this.animationHandler.action(this.config.animations.hit as AnimationType);

        if (!isWorker) {
            const player = (this.scene as any).player;
            if (player) {
                await this.waitForPlayerAnimation(player);
            }
        } else {
            await this.delay(500);
        }
    }

    private destroyEntity(isWorker: boolean): void {
        this.animationHandler.action(this.config.animations.destroy as AnimationType);

        if (!isWorker) {
            this.dropResourcesForPlayer();
        }

        this._state.isDestroyed = true;
        this._state.isBlocking = false;
        this.cleanup();
    }

    private dropResourcesForPlayer(): void {
        this.config.resources.forEach(resource => {
            if (Math.random() <= resource.chance) {
                try {
                    // ÉTAPE 1: Ajouter au ResourceManager
                    const added = this.resourceManager.addResource(
                        resource.type as ResourceType,
                        resource.amount,
                        'resource_entity_harvest'
                    );

                    if (added > 0) {
                        // ÉTAPE 2: Donner l'expérience au joueur via sa propre classe
                        const player = (this.scene as any).player;
                        if (player && typeof player.gainExperienceFromResource === 'function') {
                            player.gainExperienceFromResource(
                                resource.type as ResourceType,
                                added,
                                'resource_harvest'
                            );
                        }

                        window.dispatchEvent(new CustomEvent('game:resourceHarvested', {
                            detail: {
                                type: resource.type,
                                amount: added,
                                source: 'resource_entity_harvest',
                                entityType: this.config.type,
                                timestamp: Date.now()
                            }
                        }));
                    }
                } catch (error) {
                    console.error(`ResourceEntity: Error adding resource ${resource.type}:`, error);
                }
            }
        });
    }

    private stopHarvesting(): void {
        this._state.isBeingHarvested = false;
        const player = (this.scene as any).player;
        if (player) {
            player.stopChopAnimation();
            this.animationHandler.idle(this.config.animations.idle as AnimationType);
        }
        this.startHealingTimer();
    }

    private updateHealthBar(forceShow: boolean = false): void {
        if (!this.healthBar) return;

        const healthPercent = this._state.currentHealth / this.config.health;
        const frame = Math.floor(healthPercent * 6);

        this.healthBar.setFrame(frame);
        this.healthBar.setPosition(this.x, this.y - 20);
        this.healthBar.setVisible(forceShow || this._state.currentHealth < this.config.health);
    }

    private spawnParticles(): void {
        const particle = this.scene.add.sprite(this.x, this.y, 'leaves-hit')
            .setDepth(this.depth + 1);

        AnimationUtils.playAnimation(particle, AnimationType.LEAVES_FALL);

        this.scene.tweens.add({
            targets: particle,
            y: particle.y - 5,
            duration: 1000,
            ease: 'Power1',
            onComplete: () => particle.destroy()
        });
    }

    private startHealingTimer(): void {
        this.healingTimer?.destroy();
        this.healingTimer = this.scene.time.delayedCall(10000, () => {
            this._state.currentHealth = this.config.health;
            this.updateHealthBar();
        });
    }

    private cleanup(): void {
        this.setVisible(false);
        this.stump?.setVisible(true);

        if (this._state.currentHarvester) {
            this.releaseHarvester();
        }

        this.healthBar?.setVisible(false);
        this._state.isBlocking = false;

        const mainScene = this.scene as any;
        if (mainScene.rebuildPathfindingGrid) {
            mainScene.rebuildPathfindingGrid();
        }

        this.scene.time.delayedCall(this.config.respawnTime, () => this.respawn(), [], this);
    }

    private respawn(): void {
        this.stump?.setVisible(false);

        this._state.isDestroyed = false;
        this._state.isBeingHarvested = false;
        this._state.isBlocking = this.config.blockingPath;
        this.setVisible(true);
        this.animationHandler.idle(this.config.animations.idle as AnimationType);
        this.setDepth(10);

        this._state.currentHealth = this.config.health;
        this.updateHealthBar();

        const mainScene = this.scene as any;
        if (mainScene.rebuildPathfindingGrid) {
            mainScene.rebuildPathfindingGrid();
        }
    }

    private worldToTile(x: number, y: number): { x: number; y: number } {
        return {
            x: Math.floor(x / 16),
            y: Math.floor(y / 16)
        };
    }

    private async waitForPlayerAnimation(player: any): Promise<void> {
        return new Promise((resolve) => {
            if (player) {
                player.once('animationcomplete', () => resolve());
            } else {
                resolve();
            }
        });
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => {
            this.scene.time.delayedCall(ms, resolve);
        });
    }

    public isAvailableForHarvest(harvester: any): boolean {
        return !this._state.isDestroyed && (
                this._state.currentHarvester === null
                || this._state.currentHarvester === harvester
            );
    }

    public setHarvester(harvester: any): boolean {
        if (this.isAvailableForHarvest(harvester)) {
            this._state.currentHarvester = harvester;
            return true;
        }
        return false;
    }

    public releaseHarvester(): void {
        this._state.currentHarvester = null;
    }

    public findNearestInteractionPoint(workerX: number, workerY: number): { x: number; y: number } {
        const tileSize = 16;
        const entityTileX = Math.floor(this.x / tileSize);
        const entityTileY = Math.floor(this.y / tileSize);

        // Points à gauche et à droite
        const left = { x: (entityTileX - 1) * tileSize, y: entityTileY * tileSize };
        const right = { x: (entityTileX + 1) * tileSize, y: entityTileY * tileSize };

        // Accès à la grille de pathfinding
        const mainScene = this.scene as any;
        const baseGrid = mainScene.baseGrid as number[][];
        const mapWidth = baseGrid[0]?.length || 0;
        const mapHeight = baseGrid.length;

        function isWalkable(pos: { x: number; y: number }) {
            const tx = Math.floor(pos.x / tileSize);
            const ty = Math.floor(pos.y / tileSize);
            return (
                tx >= 0 && tx < mapWidth && ty >= 0 && ty < mapHeight && baseGrid[ty][tx] === 0
            );
        }

        const leftWalkable = isWalkable(left);
        const rightWalkable = isWalkable(right);

        // Cas 1 : les deux sont atteignables, on prend le plus proche
        if (leftWalkable && rightWalkable) {
            const distLeft = Phaser.Math.Distance.Between(workerX, workerY, left.x, left.y);
            const distRight = Phaser.Math.Distance.Between(workerX, workerY, right.x, right.y);
            return distLeft <= distRight ? left : right;
        }
        // Cas 2 : un seul est atteignable
        if (leftWalkable) return left;
        if (rightWalkable) return right;
        // Cas 3 : aucun n'est atteignable, fallback sur la position de l'entité
        return { x: entityTileX * tileSize, y: entityTileY * tileSize };
    }

    public async workerHarvest(worker: any): Promise<boolean> {
        if (this._state.isDestroyed) {
            return false;
        }

        this._state.currentHarvester = worker;
        this._state.currentHealth -= this.config.damagePerHit;

        this.updateHealthBar(true);
        this.spawnParticles();

        try {
            await this.animationHandler.action(this.config.animations.hit as AnimationType);
        } catch (error) {
            console.error(`ResourceEntity: Error playing hit animation:`, error);
        }

        if (this._state.currentHealth <= 0) {
            try {
                this.animationHandler.action(this.config.animations.destroy as AnimationType);
            } catch (error) {
                console.error(`ResourceEntity: Error playing destroy animation:`, error);
            }

            this.giveResourcesToWorker(worker);

            this._state.isDestroyed = true;
            this._state.isBlocking = false;

            this.cleanup();
            return true;
        }

        return true;
    }

    private giveResourcesToWorker(worker: any): void {
        if (!worker || typeof worker.addToInventory !== 'function') {
            console.warn('ResourceEntity: Worker does not have addToInventory method');
            return;
        }

        this.config.resources.forEach(resource => {
            if (Math.random() <= resource.chance) {
                try {
                    const added = worker.addToInventory(resource.type, resource.amount);

                    if (added > 0) {
                        window.dispatchEvent(new CustomEvent('game:workerResourceHarvested', {
                            detail: {
                                workerType: worker.constructor.name.toLowerCase(),
                                resourceType: resource.type,
                                amount: added,
                                entityType: this.config.type,
                                timestamp: Date.now()
                            }
                        }));
                    }
                } catch (error) {
                    console.error(`ResourceEntity: Error giving resource to worker:`, error);
                }
            }
        });
    }

    public getResourceNames(): string[] {
        try {
            return this.config.resources.map(resource =>
                this.resourceManager.getName(resource.type as ResourceType)
            );
        } catch (error) {
            console.error('ResourceEntity: Error getting resource names:', error);
            return this.config.resources.map(r => r.type);
        }
    }

    private validateResources(): boolean {
        try {
            const validResources = this.config.resources.filter(resource => {
                const isValidType = Object.values(ResourceType).includes(resource.type as ResourceType);
                if (!isValidType) {
                    console.warn(`ResourceEntity: Invalid resource type: ${resource.type}`);
                }
                return isValidType;
            });

            if (validResources.length !== this.config.resources.length) {
                console.warn(`ResourceEntity: Some resources were invalid and filtered out`);
            }

            return validResources.length > 0;
        } catch (error) {
            console.error('ResourceEntity: Error validating resources:', error);
            return false;
        }
    }

    public getResourceValue(): number {
        try {
            let totalValue = 0;
            this.config.resources.forEach(resource => {
                const baseValue = this.resourceManager.getRegistry().getBaseValue(resource.type as ResourceType);
                totalValue += resource.amount * resource.chance * baseValue;
            });
            return totalValue;
        } catch (error) {
            console.error('ResourceEntity: Error calculating resource value:', error);
            return 0;
        }
    }

    // #region Getter

    public getConfig(): ResourceEntityConfig {
        return this.config;
    }

    public getEntityTilePosition(): { x: number; y: number } {
        return this.worldToTile(this.x, this.y);
    }

    public isBlockingPath(): boolean {
        return this._state.isBlocking;
    }

    public isDestroyed(): boolean {
        return this._state.isDestroyed;
    }

    public getResourceDrops(): readonly { type: string; amount: number; chance: number }[] {
        return this.config.resources;
    }

    // #endregion

    // #region Cleanup

    destroy(fromScene?: boolean): void {
        this.hideHoverCorners();
        this.healthBar?.destroy();
        this.detectionZone?.destroy();
        this.stump?.destroy();
        this.healingTimer?.destroy();
        super.destroy(fromScene);
    }

    update(): void {
        if (this._state.isDestroyed || !this.detectionZone) return;

        const player = (this.scene as any).player;
        if (!player) return;

        const isOverlapping = this.scene.physics.overlap(player, this.detectionZone);

        if (isOverlapping) {
            this.updateCursorBasedOnFacing();
        } else if (this._state.isBeingHarvested) {
            this.stopHarvesting();
        }
    }

    // #endregion

    private showHoverCorners(): void {
        this.hideHoverCorners();
        const tileSize = 16;
        const half = tileSize / 2;
        const offset = 3;
        const xOffset = 0;
        const yOffset = 6;
        const positions = {
            'top-left': { x: this.x - half - offset + xOffset, y: this.y - half - offset + yOffset},
            'top-right': { x: this.x + half + offset + xOffset, y: this.y - half - offset + yOffset},
            'bottom-left': { x: this.x - half - offset + xOffset, y: this.y + half + offset + yOffset},
            'bottom-right': { x: this.x + half + offset + xOffset, y: this.y + half + offset + yOffset},
        };
        for (const type of ResourceEntity.CORNER_TYPES) {
            const spriteKey = this.getCornerSpriteKey(type);
            const pos = positions[type as keyof typeof positions];
            const sprite = this.scene.add.sprite(pos.x, pos.y, spriteKey);
            sprite.setOrigin(0.5, 0.5);
            sprite.setAlpha(1);
            if (type === 'top-left' || type === 'top-right') {
                sprite.setDepth(this.depth - 1); // derrière l'entité
            } else {
                sprite.setDepth(this.depth + 1000); // devant l'entité
            }
            this.createCornerAnimation(sprite, type);
            this.cornerSprites.push(sprite);
        }
    }

    private hideHoverCorners(): void {
        this.cornerSprites.forEach(sprite => {
            this.scene.tweens && this.scene.tweens.killTweensOf(sprite);
            sprite.destroy();
        });
        this.cornerSprites = [];
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
                xMove = 3; yMove = 3; break;
            case 'top-right':
                xMove = -3; yMove = 3; break;
            case 'bottom-left':
                xMove = 3; yMove = -3; break;
            case 'bottom-right':
                xMove = -3; yMove = -3; break;
        }
        this.scene.tweens && this.scene.tweens.add({
            targets: sprite,
            x: sprite.x + xMove,
            y: sprite.y + yMove,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}
