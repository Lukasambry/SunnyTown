import { Scene } from 'phaser';
import type { Position } from '../types';
import { CameraService } from './CameraService';
import { ZoneBlockerRegistry } from './ZoneBlockerRegistry';

interface BlockerObject {
    x: number;
    y: number;
    width?: number;
    height?: number;
    type?: string;
}

interface BlockerCenterPoint {
    readonly x: number;
    readonly y: number;
    readonly type: string;
}

interface BlockerCornerPoint {
    readonly position: Position;
    readonly type: string;
}

interface ZoneBlocker {
    readonly name: string;
    readonly group: Phaser.Tilemaps.ObjectLayer;
    readonly layers: Phaser.Tilemaps.TilemapLayer[];
    readonly interactionZone: Phaser.GameObjects.Zone;
    readonly centerPoint: BlockerCenterPoint | null;
    readonly cornerPoints: BlockerCornerPoint[];
}

export class ZoneBlockerService {
    private readonly scene: Scene;
    private readonly cameraService: CameraService;
    private readonly registry: ZoneBlockerRegistry;
    private readonly blockers = new Map<string, ZoneBlocker>();
    private selectedBlocker: ZoneBlocker | null = null;
    private cornerSprites: Phaser.GameObjects.Sprite[] = [];
    private hoverCornerSprites: Phaser.GameObjects.Sprite[] = [];
    private currentMap: Phaser.Tilemaps.Tilemap | null = null;

    constructor(scene: Scene, cameraService: CameraService) {
        this.scene = scene;
        this.cameraService = cameraService;
        this.registry = ZoneBlockerRegistry.getInstance();
        this.setupInputHandlers();
    }

    public initialize(map: Phaser.Tilemaps.Tilemap): void {
        this.loadBlockersFromMap(map);
        this.currentMap = map;
    }

    public selectBlocker(blockerName: string): void {
        const blocker = this.blockers.get(blockerName);
        if (!blocker || this.selectedBlocker === blocker) return;

        this.deselectCurrentBlocker();
        this.selectedBlocker = blocker;

        if (blocker.centerPoint) {
            this.centerCameraOnBlocker(blocker);
        }

        this.showBlockerCorners(blocker);
        this.showBlockerUI(blocker);
    }

    public deselectBlocker(): void {
        this.deselectCurrentBlocker();
        this.hideBlockerUI();
    }

    public getSelectedBlocker(): ZoneBlocker | null {
        return this.selectedBlocker;
    }

    private loadBlockersFromMap(map: Phaser.Tilemaps.Tilemap): void {
        // Parcourir tous les groupes de la map pour trouver les blockers
        if (map.objects) {
            map.objects.forEach(objectLayer => {
                if (this.isBlockerGroup(objectLayer.name)) {
                    const blockerName = this.extractBlockerName(objectLayer.name);
                    const blocker = this.createZoneBlocker(map, objectLayer, blockerName);

                    if (blocker) {
                        this.blockers.set(blockerName, blocker);

                        // Créer et enregistrer la configuration du blocker basée sur les propriétés du groupe
                        const blockerConfig = this.createBlockerConfigFromTiledGroup(map, objectLayer, blockerName);
                        this.registry.registerBlocker(blockerConfig);

                        console.log(`Registered blocker: ${blockerName}`, blockerConfig);
                    }
                }
            });
        }
    }

    private createBlockerConfigFromTiledGroup(map: Phaser.Tilemaps.Tilemap, objectLayer: Phaser.Tilemaps.ObjectLayer, blockerName: string): any {
        // Essayer de récupérer les propriétés du groupe depuis différentes sources
        let groupProperties: Record<string, any> = {};

        // Méthode 1: Propriétés directement sur l'object layer
        if (objectLayer.properties) {
            groupProperties = this.extractLayerProperties(objectLayer);
            console.log(`Found properties on object layer for ${blockerName}:`, groupProperties);
        }

        // Méthode 2: Chercher dans les groupes de la map si disponible
        if (map.data && map.data.layers) {
            const groupLayer = map.data.layers.find((layer: any) =>
                layer.name === `Blocker_${blockerName}` && layer.type === 'group'
            );

            if (groupLayer && groupLayer.properties) {
                const groupProps = this.extractPropertiesFromArray(groupLayer.properties);
                groupProperties = { ...groupProperties, ...groupProps };
                console.log(`Found properties on group layer for ${blockerName}:`, groupProps);
            }
        }

        // Méthode 3: Chercher dans les layers de la map
        if (map.layers) {
            map.layers.forEach(layer => {
                if (layer.name === `Blocker_${blockerName}` && layer.properties) {
                    const layerProps = this.extractLayerProperties(layer);
                    groupProperties = { ...groupProperties, ...layerProps };
                    console.log(`Found properties on map layer for ${blockerName}:`, layerProps);
                }
            });
        }

        console.log(`Final properties for ${blockerName}:`, groupProperties);

        // Créer les requirements basés sur les propriétés trouvées
        const unlockRequirements: any = {};

        if (groupProperties.minLevel) {
            unlockRequirements.level = groupProperties.minLevel;
        }

        if (groupProperties.resourcesNeeded) {
            // Parse resourcesNeeded format: "wood:50,stone:25"
            const resourcesNeeded: Record<string, number> = {};
            const resourcePairs = groupProperties.resourcesNeeded.split(',');

            resourcePairs.forEach((pair: string) => {
                const [resource, amount] = pair.split(':');
                if (resource && amount) {
                    resourcesNeeded[resource.trim()] = parseInt(amount.trim(), 10);
                }
            });

            if (Object.keys(resourcesNeeded).length > 0) {
                unlockRequirements.resources = resourcesNeeded;
            }
        }

        if (groupProperties.buildingsNeeded) {
            // Parse buildingsNeeded format: "sawmill,house"
            const buildingsNeeded = groupProperties.buildingsNeeded.split(',').map((b: string) => b.trim());
            unlockRequirements.buildings = buildingsNeeded;
        }

        const config = {
            name: blockerName,
            displayName: groupProperties.displayName || this.capitalizeFirstLetter(blockerName),
            description: groupProperties.description || `Zone de ${blockerName}`,
            unlocked: false, // Par défaut, toutes les zones sont bloquées
            unlockRequirements: Object.keys(unlockRequirements).length > 0 ? unlockRequirements : undefined
        };

        console.log(`Created config for ${blockerName}:`, config);
        return config;
    }

    private extractPropertiesFromArray(propertiesArray: any[]): Record<string, any> {
        const properties: Record<string, any> = {};

        if (Array.isArray(propertiesArray)) {
            propertiesArray.forEach(prop => {
                if (prop.name && prop.value !== undefined) {
                    properties[prop.name] = prop.value;
                }
            });
        }

        return properties;
    }

    private extractLayerProperties(objectLayer: Phaser.Tilemaps.ObjectLayer): Record<string, any> {
        const properties: Record<string, any> = {};

        if (objectLayer.properties && Array.isArray(objectLayer.properties)) {
            objectLayer.properties.forEach(prop => {
                properties[prop.name] = prop.value;
            });
        }

        return properties;
    }

    private capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    private isBlockerGroup(layerName: string): boolean {
        return layerName.startsWith('Blocker_');
    }

    private extractBlockerName(layerName: string): string {
        // Améliorer l'extraction pour gérer les noms complexes
        const match = layerName.match(/^Blocker_(.+)$/);
        if (match) {
            return match[1];
        }
        // Fallback: supprimer juste le préfixe "Blocker_"
        return layerName.replace('Blocker_', '');
    }

    private createZoneBlocker(
        map: Phaser.Tilemaps.Tilemap,
        objectLayer: Phaser.Tilemaps.ObjectLayer,
        blockerName: string
    ): ZoneBlocker | null {
        // Récupérer la zone d'interaction
        const interactionZone = this.createInteractionZone(objectLayer);
        if (!interactionZone) return null;

        // Récupérer le point centre
        const centerPoint = this.findCenterPoint(objectLayer);

        // Récupérer les points de coin
        const cornerPoints = this.findCornerPoints(objectLayer);

        // Récupérer les layers du groupe (pour le moment, nous ne les utilisons pas mais ils sont disponibles)
        const layers = this.findBlockerLayers(map, blockerName);

        return {
            name: blockerName,
            group: objectLayer,
            layers,
            interactionZone,
            centerPoint,
            cornerPoints
        };
    }

    private createInteractionZone(objectLayer: Phaser.Tilemaps.ObjectLayer): Phaser.GameObjects.Zone | null {
        const interactionObject = objectLayer.objects?.find(obj =>
            obj.rectangle && (!obj.type || obj.type === 'interaction')
        );

        if (!interactionObject) return null;

        const zone = this.scene.add.zone(
            interactionObject.x! + interactionObject.width! / 2,
            interactionObject.y! + interactionObject.height! / 2,
            interactionObject.width!,
            interactionObject.height!
        );

        zone.setInteractive();
        zone.setData('blockerName', this.extractBlockerNameFromLayer(objectLayer.name));

        // Ajouter les événements de survol
        zone.on('pointerover', () => {
            const blockerName = zone.getData('blockerName');
            this.showHoverCorners(blockerName);
        });

        zone.on('pointerout', () => {
            this.hideHoverCorners();
        });

        return zone;
    }

    private findCenterPoint(objectLayer: Phaser.Tilemaps.ObjectLayer): BlockerCenterPoint | null {
        const centerObject = objectLayer.objects?.find(obj =>
            obj.point && this.isObjectType(obj, 'center')
        );

        if (!centerObject) return null;

        return {
            x: centerObject.x || 0,
            y: centerObject.y || 0,
            type: this.getObjectType(centerObject) || 'center'
        };
    }

    private findCornerPoints(objectLayer: Phaser.Tilemaps.ObjectLayer): BlockerCornerPoint[] {
        const cornerObjects = objectLayer.objects?.filter(obj =>
            obj.point && this.isCornerPoint(obj)
        ) || [];

        return cornerObjects.map(obj => ({
            position: { x: obj.x || 0, y: obj.y || 0 },
            type: this.getObjectType(obj) || 'corner'
        }));
    }

    private findBlockerLayers(map: Phaser.Tilemaps.Tilemap, blockerName: string): Phaser.Tilemaps.TilemapLayer[] {
        // Pour le moment, retourner un tableau vide
        // Dans une implémentation complète, on chercherait les layers du groupe
        return [];
    }

    private isObjectType(obj: any, type: string): boolean {
        return this.getObjectType(obj) === type;
    }

    private isCornerPoint(obj: any): boolean {
        const type = this.getObjectType(obj);
        return type && ['corner', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(type);
    }

    private getObjectType(obj: any): string | null {
        if (!obj.properties || !Array.isArray(obj.properties)) return null;

        const typeProperty = obj.properties.find((prop: any) => prop.name === 'type');
        return typeProperty?.value || null;
    }

    private extractBlockerNameFromLayer(layerName: string): string {
        // Utiliser la même méthode d'extraction améliorée
        return this.extractBlockerName(layerName);
    }

    private centerCameraOnBlocker(blocker: ZoneBlocker): void {
        if (!blocker.centerPoint) return;

        const centerPosition: Position = {
            x: blocker.centerPoint.x,
            y: blocker.centerPoint.y
        };

        this.cameraService.focusOnPosition(centerPosition);
    }

    private showBlockerCorners(blocker: ZoneBlocker): void {
        this.hideCornerSprites();
        this.hideHoverCorners();

        blocker.cornerPoints.forEach(cornerPoint => {
            const spriteKey = this.getCornerSpriteKey(cornerPoint.type);
            const sprite = this.scene.add.sprite(
                cornerPoint.position.x,
                cornerPoint.position.y,
                spriteKey
            );

            sprite.setOrigin(0.5, 0.5);
            sprite.setDepth(1000);
            sprite.setAlpha(1.0);

            this.createCornerAnimation(sprite, cornerPoint.type);
            this.cornerSprites.push(sprite);
        });
    }

    private showHoverCorners(blockerName: string): void {
        // Ne pas montrer les coins de survol si le blocker est déjà sélectionné
        if (this.selectedBlocker && this.selectedBlocker.name === blockerName) return;

        this.hideHoverCorners();

        const blocker = this.blockers.get(blockerName);
        if (!blocker) return;

        blocker.cornerPoints.forEach(cornerPoint => {
            const spriteKey = this.getCornerSpriteKey(cornerPoint.type);
            const sprite = this.scene.add.sprite(
                cornerPoint.position.x,
                cornerPoint.position.y,
                spriteKey
            );

            sprite.setOrigin(0.5, 0.5);
            sprite.setDepth(999);
            sprite.setAlpha(0.5); // Opacité réduite pour le survol

            this.createCornerAnimation(sprite, cornerPoint.type);
            this.hoverCornerSprites.push(sprite);
        });
    }

    private hideHoverCorners(): void {
        this.hoverCornerSprites.forEach(sprite => {
            this.scene.tweens.killTweensOf(sprite);
            sprite.destroy();
        });
        this.hoverCornerSprites = [];
    }

    private createCornerAnimation(sprite: Phaser.GameObjects.Sprite, type: string): void {
        // Définir le déplacement en fonction du type de coin
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

        // Créer l'animation de va-et-vient
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
                return 'corner-top-left'; // Fallback
        }
    }

    private hideCornerSprites(): void {
        this.cornerSprites.forEach(sprite => {
            this.scene.tweens.killTweensOf(sprite);
            sprite.destroy();
        });
        this.cornerSprites = [];
    }

    private deselectCurrentBlocker(): void {
        if (this.selectedBlocker) {
            this.hideCornerSprites();
            this.hideHoverCorners();
            this.selectedBlocker = null;
        }
    }

    public unlockBlocker(blockerName: string): void {
        const blocker = this.blockers.get(blockerName);
        const blockerConfig = this.registry.getBlocker(blockerName);

        if (!blocker || !blockerConfig) {
            console.error(`Blocker ${blockerName} not found`);
            return;
        }

        if (blockerConfig.unlocked) {
            console.log(`Blocker ${blockerName} is already unlocked`);
            return;
        }

        // Marquer comme débloqué
        blockerConfig.unlocked = true;

        // Supprimer le groupe de layers de la map
        this.removeBlockerFromMap(blockerName);

        // Nettoyer les références locales
        this.cleanupBlocker(blocker);
        this.blockers.delete(blockerName);

        // Reconstruire la grid du pathfinder après suppression des layers
        this.rebuildPathfindingGrid();

        console.log(`Zone blocker ${blockerName} unlocked and removed from map!`);
    }

    private removeBlockerFromMap(blockerName: string): void {
        if (!this.currentMap) return;

        console.log(`Removing blocker: ${blockerName}`);

        // Trouver le layer d'objets du groupe et récupérer son blockerId
        const groupName = `Blocker_${blockerName}`;
        const objectLayerIndex = this.currentMap.objects.findIndex(layer => layer.name === groupName);

        let blockerId = blockerName; // Fallback par défaut

        if (objectLayerIndex !== -1) {
            const objectLayer = this.currentMap.objects[objectLayerIndex];

            // Récupérer le blockerId depuis les propriétés du layer object
            const layerProperties = this.extractLayerProperties(objectLayer);
            if (layerProperties.blockerId) {
                blockerId = layerProperties.blockerId;
                console.log(`Found blockerId from object layer: ${blockerId}`);
            } else {
                console.warn(`No blockerId found in object layer ${groupName}, using fallback: ${blockerId}`);
            }

            // Supprimer le layer d'objets
            this.currentMap.objects.splice(objectLayerIndex, 1);
            console.log(`Removed object layer: ${groupName}`);
        } else {
            console.warn(`Object layer not found: ${groupName}`);
        }

        // Maintenant utiliser le blockerId pour trouver et masquer tous les layers associés
        this.hideLayersByBlockerId(blockerId);
    }

    private hideLayersByBlockerId(blockerId: string): void {
        if (!this.currentMap) return;

        console.log(`Looking for layers with blockerId: ${blockerId}`);

        const layersToDestroy: string[] = [];

        // Parcourir tous les layers de la map
        this.currentMap.layers.forEach((layerData, index) => {
            const layerProperties = this.extractLayerProperties(layerData);

            if (layerProperties.blockerId === blockerId) {
                console.log(`Found layer with matching blockerId: ${layerData.name}`);
                layersToDestroy.push(layerData.name);
            }
        });

        // Supprimer les layers trouvés
        layersToDestroy.forEach(layerName => {
            this.destroyLayer(layerName);
        });

        console.log(`Destroyed ${layersToDestroy.length} layers with blockerId: ${blockerId}`);
    }

    private destroyLayer(layerName: string): void {
        if (!this.currentMap) return;

        // Récupérer le layer Phaser correspondant
        const tilemapLayer = this.currentMap.getLayer(layerName);
        if (tilemapLayer?.tilemapLayer) {
            console.log(`Destroying layer: ${layerName}`);

            // Supprimer les collisions de ce layer de la baseGrid AVANT de détruire le layer
            this.removeLayerCollisionsFromBaseGrid(tilemapLayer.tilemapLayer);

            // Supprimer complètement le layer
            tilemapLayer.tilemapLayer.destroy();

            // Retirer le layer de la map
            const layerIndex = this.currentMap.layers.findIndex(layer => layer.name === layerName);
            if (layerIndex !== -1) {
                this.currentMap.layers.splice(layerIndex, 1);
                console.log(`Removed layer from map layers array: ${layerName}`);
            }
        } else {
            console.warn(`Could not find tilemap layer for: ${layerName}`);
        }
    }

    private removeLayerCollisionsFromBaseGrid(layer: Phaser.Tilemaps.TilemapLayer): void {
        const mainScene = this.scene as any;
        if (!mainScene.baseGrid) {
            console.warn('baseGrid not found on scene');
            return;
        }

        console.log(`Removing collisions from baseGrid for layer: ${layer.layer.name}`);

        // Parcourir toutes les tuiles du layer
        for (let y = 0; y < layer.layer.height; y++) {
            for (let x = 0; x < layer.layer.width; x++) {
                const tile = layer.getTileAt(x, y);
                if (!tile) continue;

                // Vérifier si la tuile a des collisions
                const hasCollidesProp = !!(tile.properties && tile.properties.collides);
                const tileData = tile.tileset?.getTileData(tile.index);
                const hasCollisionShapes = tileData && tileData.objectgroup &&
                    tileData.objectgroup.objects && tileData.objectgroup.objects.length > 0;

                if (hasCollidesProp || hasCollisionShapes) {
                    // Calculer la position dans la baseGrid
                    const worldX = layer.x + (x * layer.layer.tileWidth);
                    const worldY = layer.y + (y * layer.layer.tileHeight);

                    const gridX = Math.floor(worldX / 16);
                    const gridY = Math.floor(worldY / 16);

                    // Supprimer la collision de la baseGrid
                    if (gridY >= 0 && gridY < mainScene.baseGrid.length &&
                        gridX >= 0 && gridX < mainScene.baseGrid[0].length) {
                        mainScene.baseGrid[gridY][gridX] = 0;
                        console.log(`Removed collision at grid position: (${gridX}, ${gridY})`);
                    }
                }
            }
        }
    }

    private rebuildPathfindingGrid(): void {
        try {
            const mainScene = this.scene as any;
            if (mainScene.rebuildPathfindingGrid && typeof mainScene.rebuildPathfindingGrid === 'function') {
                console.log('Rebuilding pathfinding grid after zone unlock...');
                console.log('BaseGrid state before rebuild:', this.getBaseGridSummary());
                mainScene.rebuildPathfindingGrid();
                console.log('Pathfinding grid rebuilt successfully');
                console.log('BaseGrid state after rebuild:', this.getBaseGridSummary());
            } else {
                console.warn('rebuildPathfindingGrid method not found on scene');
            }
        } catch (error) {
            console.error('Error rebuilding pathfinding grid:', error);
        }
    }

    private getBaseGridSummary(): string {
        const mainScene = this.scene as any;
        if (!mainScene.baseGrid) return 'BaseGrid not found';

        let totalCells = 0;
        let blockedCells = 0;

        for (let y = 0; y < mainScene.baseGrid.length; y++) {
            for (let x = 0; x < mainScene.baseGrid[y].length; x++) {
                totalCells++;
                if (mainScene.baseGrid[y][x] === 1) {
                    blockedCells++;
                }
            }
        }

        return `Total: ${totalCells}, Blocked: ${blockedCells}, Free: ${totalCells - blockedCells}`;
    }

    private cleanupBlocker(blocker: ZoneBlocker): void {
        // Détruire la zone d'interaction
        if (blocker.interactionZone) {
            blocker.interactionZone.destroy();
        }

        // Si ce blocker était sélectionné, le désélectionner
        if (this.selectedBlocker === blocker) {
            this.deselectCurrentBlocker();
        }
    }

    private showBlockerUI(blocker: ZoneBlocker): void {
        const blockerConfig = this.registry.getBlocker(blocker.name);

        window.dispatchEvent(new CustomEvent('game:zoneBlockerSelected', {
            detail: {
                blockerName: blocker.name,
                config: blockerConfig,
                position: blocker.centerPoint
            }
        }));
    }

    private hideBlockerUI(): void {
        window.dispatchEvent(new CustomEvent('game:zoneBlockerDeselected'));
    }

    private setupInputHandlers(): void {
        this.scene.input.on('gameobjectdown', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
            if (gameObject instanceof Phaser.GameObjects.Zone) {
                const blockerName = gameObject.getData('blockerName');
                if (blockerName) {
                    this.selectBlocker(blockerName);
                }
            }
        });

        // Gérer les clics en dehors des zones d'interaction pour recentrer sur le joueur
        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) return;

            // Vérifier si le clic n'a touché aucune zone d'interaction
            const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const clickedZone = this.getInteractionZoneAt(worldPoint.x, worldPoint.y);

            if (!clickedZone && this.selectedBlocker) {
                this.deselectBlocker();
                this.cameraService.returnToPlayer();
            }
        });

        // Écouter l'événement de désélection depuis l'UI
        window.addEventListener('game:deselectZoneBlocker', () => {
            this.deselectBlocker();
            this.cameraService.returnToPlayer();
        });
    }

    private getInteractionZoneAt(x: number, y: number): Phaser.GameObjects.Zone | null {
        for (const blocker of this.blockers.values()) {
            const zone = blocker.interactionZone;
            const bounds = zone.getBounds();

            if (bounds.contains(x, y)) {
                return zone;
            }
        }
        return null;
    }
}
