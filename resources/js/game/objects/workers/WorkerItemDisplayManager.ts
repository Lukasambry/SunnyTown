import Phaser from 'phaser'
import { WorkerAnimationItemConfig } from '@/game/types/WorkerConfigTypes';

export class WorkerItemDisplayManager {
    private worker: any;
    private currentItemSprite: Phaser.GameObjects.Sprite | null = null;
    private scene: Phaser.Scene;
    private lastAnimationState: string = '';
    private lastPosition: { x: number, y: number } = { x: 0, y: 0 };

    constructor(worker: any, scene: Phaser.Scene) {
        this.worker = worker;
        this.scene = scene;
        this.lastPosition = { x: worker.x, y: worker.y };
    }

    public updateItemDisplay(animationState: string): void {
        if (this.lastAnimationState !== animationState) {
            this.clearCurrentItem();
            
            const animationConfig = this.worker.config.animations[animationState];
            if (animationConfig?.item) {
                this.displayItem(animationConfig.item, animationState);
            }
            
            this.lastAnimationState = animationState;
        } else {
            this.updateItemPosition();
        }
    }

    private displayItem(itemConfig: WorkerAnimationItemConfig, animationState: string): void {
        const imageKey = this.resolveImageKey(itemConfig.img, animationState);
        if (!imageKey) return;

        if (!this.scene.textures.exists(imageKey)) {
            console.warn(`Texture '${imageKey}' not found for worker item`);
            return;
        }

        const itemX = this.worker.x + (itemConfig.posX || 0);
        const itemY = this.worker.y + (itemConfig.posY || 0);

        this.currentItemSprite = this.scene.add.sprite(itemX, itemY, imageKey);
        
        this.lastPosition.x = this.worker.x;
        this.lastPosition.y = this.worker.y;

        this.applyItemProperties(itemConfig, animationState);

        const depth = itemConfig.depth !== undefined ? itemConfig.depth : this.worker.depth + 1;
        this.currentItemSprite.setDepth(depth);
    }

    private resolveImageKey(img: string | ((data?: any) => string | null) | undefined, animationState: string): string | null {
        if (!img) return null;

        if (typeof img === 'string') {
            return img;
        }

        if (typeof img === 'function') {
            // Récupérer les données contextuelles selon l'état
            const contextData = this.getContextData(animationState);
            return img(...contextData);
        }

        return null;
    }

    private getContextData(animationState: string): any[] {
        switch (animationState) {
            case 'carrying':
                const carriedResource = this.getCarriedResource();
                const currentCount = this.worker.getTotalInventory();
                const maxCapacity = this.worker.config.carryCapacity;
                return [carriedResource, currentCount, maxCapacity];
    
            case 'depositing':
                const currentCount2 = this.worker.getTotalInventory();
                const maxCapacity2 = this.worker.config.carryCapacity;
                return [currentCount2, maxCapacity2];
    
            case 'working':
                const target = this.worker.currentTarget;
                return [target];
    
            default:
                return [];
        }
    }

    private getCarriedResource(): any {
        // Trouver la première ressource dans l'inventaire avec une quantité > 0
        for (const [resourceType, quantity] of this.worker.inventory.entries()) {
            if (quantity > 0) {
                return { type: resourceType, quantity };
            }
        }
        return null;
    }

    private applyItemProperties(itemConfig: WorkerAnimationItemConfig, animationState: string): void {
        if (!this.currentItemSprite) return;

        // Appliquer l'échelle
        if (itemConfig.scale !== undefined) {
            const scale = this.resolveProperty(itemConfig.scale, animationState);
            this.currentItemSprite.setScale(scale);
        }

        // Appliquer l'alpha
        if (itemConfig.alpha !== undefined) {
            const alpha = this.resolveProperty(itemConfig.alpha, animationState);
            this.currentItemSprite.setAlpha(alpha);
        }

        // Appliquer la rotation
        if (itemConfig.rotation !== undefined) {
            const rotation = this.resolveProperty(itemConfig.rotation, animationState);
            this.currentItemSprite.setRotation(rotation);
        }

        // Appliquer la visibilité
        if (itemConfig.visible !== undefined) {
            const visible = this.resolveProperty(itemConfig.visible, animationState);
            this.currentItemSprite.setVisible(visible);
        }
    }

    private resolveProperty(property: any, animationState: string): any {
        if (typeof property === 'function') {
            const contextData = this.getContextData(animationState);
            return property(...contextData);
        }
        return property;
    }

    public updateItemPosition(): void {
        if (!this.currentItemSprite) return;

        const workerMoved = this.lastPosition.x !== this.worker.x || this.lastPosition.y !== this.worker.y;
        
        if (workerMoved) {
            const animationState = this.getCurrentAnimationState();
            const animationConfig = this.worker.config.animations[animationState];
            
            if (animationConfig?.item) {
                const itemConfig = animationConfig.item;
                const newX = this.worker.x + (itemConfig.posX || 0);
                const newY = this.worker.y + (itemConfig.posY || 0);
                
                this.currentItemSprite.setPosition(newX, newY);
                
                this.lastPosition.x = this.worker.x;
                this.lastPosition.y = this.worker.y;
            }
        }
    }

    private getCurrentAnimationState(): string {
        if (typeof this.worker.getAnimationStateKey === 'function') {
            return this.worker.getAnimationStateKey();
        }

        switch (this.worker.state) {
            case 'IDLE': return 'idle';
            case 'MOVING_TO_HARVEST':
            case 'MOVING_TO_DEPOSIT': 
                return this.worker.getTotalInventory() > 0 ? 'carrying' : 'walking';
            case 'HARVESTING': return 'working';
            case 'DEPOSITING': return 'depositing';
            default:
                return this.worker.getTotalInventory() > 0 ? 'carrying' : 'idle';
        }
    }

    public clearCurrentItem(): void {
        if (this.currentItemSprite) {
            this.currentItemSprite.destroy();
            this.currentItemSprite = null;
        }
        this.lastAnimationState = '';
    }

    public destroy(): void {
        this.clearCurrentItem();
    }
}