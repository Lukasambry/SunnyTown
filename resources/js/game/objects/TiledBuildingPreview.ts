import Phaser from 'phaser';
import type { BuildingDimensions, Position } from '../types';

interface LayerConfig {
    readonly layer: Phaser.Tilemaps.TilemapLayer;
    readonly hasCollision: boolean;
    readonly isAbovePlayer: boolean;
}

interface PreviewConfig {
    readonly validTint: number;
    readonly invalidTint: number;
    readonly previewAlpha: number;
    readonly previewDepthOffset: number;
}

interface CollisionObject {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class TiledBuildingPreview {
    private readonly scene: Phaser.Scene;
    private readonly layers: Phaser.Tilemaps.TilemapLayer[] = [];
    private readonly map: Phaser.Tilemaps.Tilemap;
    private readonly tileset: Phaser.Tilemaps.Tileset;
    private readonly config: PreviewConfig;
    private readonly collisionObjects: CollisionObject[] = [];
    private collisionVisuals: Phaser.GameObjects.Rectangle[] = [];

    private isValid: boolean = true;
    private currentPosition: Position = { x: 0, y: 0 };
    private isDragging: boolean = false;
    private dragOffset: Position = { x: 0, y: 0 };
    private initialPosition: Position = { x: 0, y: 0 };

    private cornerPoints: {position: Position, type: string}[] = [];
    private cornerSprites: Phaser.GameObjects.Sprite[] = [];
    private static readonly CORNER_TYPES = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

    private confirmButton: Phaser.GameObjects.Image | null = null;
    private cancelButton: Phaser.GameObjects.Image | null = null;
    private buttonPadding: number = 3;

    constructor(scene: Scene, templateKey: string) {
        this.scene = scene;

        this.config = {
            validTint: 0xffffff,
            invalidTint: 0xF6757A,
            previewAlpha: 0.6,
            previewDepthOffset: 100
        };

        try {
            this.map = scene.make.tilemap({ key: templateKey });
            this.tileset = this.initializeTileset(templateKey);
            this.createPreviewLayers();
            this.loadCollisionObjects();
            this.loadCornerPoints();
            this.createActionButtons();
            this.setupDragEvents();
        } catch (error) {
            console.error(`Erreur lors de la création du preview pour ${templateKey}:`, error);
            throw error;
        }
    }

    private initializeTileset(templateKey: string): Phaser.Tilemaps.Tileset {
        const tilesetName = this.map.tilesets[0]?.name;
        if (!tilesetName) {
            throw new Error(`Aucun tileset trouvé dans le template ${templateKey}`);
        }

        const tileset = this.map.addTilesetImage(tilesetName, 'tiles');
        if (!tileset) {
            throw new Error(`Impossible d'ajouter le tileset ${tilesetName} pour le preview`);
        }

        return tileset;
    }

    private createPreviewLayers(): void {
        this.map.layers.forEach(layerData => {
            const layer = this.map.createLayer(layerData.name, this.tileset, 100, 100);

            if (layer) {
                this.setupPreviewLayer(layer, layerData);
                this.layers.push(layer);
            }
        });
    }

    private loadCollisionObjects(): void {
        // Chercher le layer d'objets "Collision"
        const collisionLayer = this.map.getObjectLayer('Collision');

        if (collisionLayer && collisionLayer.objects) {
            // Parcourir tous les objets de collision définis
            collisionLayer.objects.forEach(obj => {
                // Stocker les informations de collision
                this.collisionObjects.push({
                    x: obj.x,
                    y: obj.y,
                    width: obj.width || 0,
                    height: obj.height || 0
                });

                /*
                if (process.env.NODE_ENV === 'development') {
                    const rect = this.scene.add.rectangle(
                        this.currentPosition.x + obj.x + (obj.width || 0) / 2,
                        this.currentPosition.y + obj.y + (obj.height || 0) / 2,
                        obj.width || 0,
                        obj.height || 0,
                        0xff0000,
                        0.3
                    );
                    rect.setOrigin(0.5, 0.5);
                    rect.setDepth(1000);  // Mettre au premier plan
                    this.collisionVisuals.push(rect);
                }
                */
            });
        }
    }

    private setupPreviewLayer(layer: Phaser.Tilemaps.TilemapLayer, layerData: Phaser.Tilemaps.LayerData): void {
        const baseDepth = this.extractLayerDepth(layerData);

        layer.setDepth(baseDepth + this.config.previewDepthOffset);
        layer.setAlpha(this.config.previewAlpha);
        layer.setTint(this.config.validTint);

        layer.setInteractive(new Phaser.Geom.Rectangle(0, 0, layer.width, layer.height),
            Phaser.Geom.Rectangle.Contains);

        layer.on('pointerover', () => {
            this.showGrabCursor();
        });

        layer.on('pointerout', () => {
            if (!this.isDragging && this.scene.uiScene) {
                this.scene.uiScene.defaultCursor.setVisible(true);
                this.scene.uiScene.grabCursor.setVisible(false);
                this.scene.uiScene.grabbingCursor.setVisible(false);
            }
        });
    }

    private setupDragEvents(): void {
        this.layers.forEach(layer => {
            this.scene.input.setDraggable(layer);

            layer.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
                this.startDragging(pointer);
                this.showGrabbingCursor();
            });
        });

        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isDragging) {
                this.updateDragPosition(pointer);
            }
        });

        this.scene.input.on('pointerup', () => {
            if (this.isDragging) {
                this.stopDragging();
                this.showGrabCursor();
            }
        });
    }

    private loadCornerPoints(): void {
        // Chercher le layer d'objets "Corners"
        const cornersLayer = this.map.getObjectLayer('Corners');

        if (cornersLayer && cornersLayer.objects) {
            // Parcourir tous les objets de points de coin définis
            cornersLayer.objects.forEach(obj => {
                // Récupérer le type de coin depuis les propriétés de l'objet
                let cornerType = 'top-left'; // Type par défaut

                if (obj.properties && Array.isArray(obj.properties)) {
                    const typeProperty = obj.properties.find(p => p.name === 'type');
                    if (typeProperty && TiledBuildingPreview.CORNER_TYPES.includes(typeProperty.value)) {
                        cornerType = typeProperty.value;
                    }
                }

                this.cornerPoints.push({
                    position: { x: obj.x, y: obj.y },
                    type: cornerType
                });

                this.createCornerSprite(obj.x, obj.y, cornerType);
            });
        }
    }

    private createCornerSprite(x: number, y: number, type: string): void {
        const sprite = this.scene.add.sprite(
            this.currentPosition.x + x,
            this.currentPosition.y + y,
            `corner-${type}`
        );

        sprite.setOrigin(0.5, 0.5);
        sprite.setDepth(2000);
        sprite.setScale(1);

        this.createCornerAnimation(sprite, type);
        this.cornerSprites.push(sprite);
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

    private createActionButtons(): void {
        const bounds = this.getWorldBounds();

        this.confirmButton = this.scene.add.image(
            bounds.right,
            bounds.bottom + this.buttonPadding,
            'building-confirm-button'
        );
        this.confirmButton.setOrigin(1, 0);
        this.confirmButton.setInteractive({ useHandCursor: false });
        this.confirmButton.setDepth(2000);

        this.confirmButton.on('pointerover', () => {
            this.confirmButton?.setScale(1.1);
        });
        this.confirmButton.on('pointerout', () => {
            this.confirmButton?.setScale(1.0);
        });

        this.confirmButton.on('pointerdown', () => {
            if (this.isValid) {
                const event = new CustomEvent('game:confirmBuildingPlacement', {
                    detail: {
                        position: this.currentPosition,
                        isValid: this.isValid
                    }
                });
                window.dispatchEvent(event);
            } else {
                this.flashInvalid();
            }
        });

        // Créer le bouton d'annulation
        this.cancelButton = this.scene.add.image(
            bounds.right - this.confirmButton.width - this.buttonPadding,
            bounds.bottom + this.buttonPadding,
            'building-cancel-button'
        );
        this.cancelButton.setOrigin(1, 0);
        this.cancelButton.setInteractive({ useHandCursor: false });
        this.cancelButton.setDepth(2000);

        this.cancelButton.on('pointerover', () => {
            this.cancelButton?.setScale(1.1);
        });
        this.cancelButton.on('pointerout', () => {
            this.cancelButton?.setScale(1.0);
        });

        this.cancelButton.on('pointerdown', () => {
            window.dispatchEvent(new CustomEvent('game:cancelBuildingPlacement'));
        });
    }


    private startDragging(pointer: Phaser.Input.Pointer): void {
        this.isDragging = true;

        // Calculer l'offset pour maintenir la position relative lors du drag
        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        this.dragOffset = {
            x: this.currentPosition.x - worldPoint.x,
            y: this.currentPosition.y - worldPoint.y
        };
    }

    private updateDragPosition(pointer: Phaser.Input.Pointer): void {
        if (!this.isDragging) return;

        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);

        // Appliquer l'offset pour maintenir la position relative
        const targetX = worldPoint.x + this.dragOffset.x;
        const targetY = worldPoint.y + this.dragOffset.y;

        // Mettre à jour la position en utilisant le système de grille
        this.updatePosition(targetX, targetY);
    }

    private stopDragging(): void {
        this.isDragging = false;
    }

    private extractLayerDepth(layerData: Phaser.Tilemaps.LayerData): number {
        const properties = layerData.properties;
        if (properties && Array.isArray(properties)) {
            const depthProperty = properties.find(p => p.name === 'depth');
            return depthProperty?.value ?? 0;
        }
        return 0;
    }

    public checkPlacementValidity(
        map: Phaser.Tilemaps.Tilemap,
        mapLayers: Map<string, LayerConfig>
    ): boolean {
        const tilePosition = this.worldToTilePosition(this.currentPosition);
        const dimensions = this.getDimensions();

        return this.isWithinMapBounds(map, tilePosition, dimensions) &&
            this.hasNoCollisions(mapLayers, tilePosition, dimensions) &&
            this.hasNoBuildingCollisions() &&
            this.hasNoResourceEntityCollisions();
    }

    private hasNoBuildingCollisions(): boolean {
    const buildingManager = (this.scene as any).buildingManager;
    if (!buildingManager || typeof buildingManager.getBuildings !== 'function') {
        return true;
    }

    const existingBuildings = buildingManager.getBuildings();

    for (const building of existingBuildings) {
        const existingBuildingCollisionZones = building.getCollisionZones();
        
        if (this.collisionObjects.length > 0) {
            for (const previewCollisionObj of this.collisionObjects) {
                const previewCollisionBounds = new Phaser.Geom.Rectangle(
                    this.currentPosition.x + previewCollisionObj.x,
                    this.currentPosition.y + previewCollisionObj.y,
                    previewCollisionObj.width,
                    previewCollisionObj.height
                );

                for (const existingCollisionZone of existingBuildingCollisionZones) {
                    if (Phaser.Geom.Intersects.RectangleToRectangle(previewCollisionBounds, existingCollisionZone)) {
                        return false;
                    }
                }
            }
        } else {
            const previewBounds = this.getWorldBounds();
            
            for (const existingCollisionZone of existingBuildingCollisionZones) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(previewBounds, existingCollisionZone)) {
                    return false;
                }
            }
        }
    }

    return true;
}

    private hasNoResourceEntityCollisions(): boolean {
        const resourceEntityManager = (this.scene as any).resourceEntityManager;
        if (!resourceEntityManager || typeof resourceEntityManager.getAllEntities !== 'function') {
            return true; 
        }

        const allEntities = resourceEntityManager.getAllEntities();

        for (const entity of allEntities) {
            if (entity.isDestroyed()) {
                continue; 
            }

            const entityBounds = entity.getBounds();
            
            if (this.collisionObjects.length > 0) {
                for (const collisionObj of this.collisionObjects) {
                    const collisionBounds = new Phaser.Geom.Rectangle(
                        this.currentPosition.x + collisionObj.x,
                        this.currentPosition.y + collisionObj.y,
                        collisionObj.width,
                        collisionObj.height
                    );

                    if (Phaser.Geom.Intersects.RectangleToRectangle(collisionBounds, entityBounds)) {
                        return false;
                    }
                }
            } else {
                const previewBounds = this.getWorldBounds();
                if (Phaser.Geom.Intersects.RectangleToRectangle(previewBounds, entityBounds)) {
                    return false;
                }
            }
        }

        return true;
    }

    private worldToTilePosition(worldPos: Position): Position {
        return {
            x: Math.floor(worldPos.x / 16),
            y: Math.floor(worldPos.y / 16)
        };
    }

    private isWithinMapBounds(
        map: Phaser.Tilemaps.Tilemap,
        tilePos: Position,
        dimensions: BuildingDimensions
    ): boolean {
        return tilePos.x >= 0 &&
            tilePos.y >= 0 &&
            tilePos.x + dimensions.tilesWidth <= map.width &&
            tilePos.y + dimensions.tilesHeight <= map.height;
    }

    private hasNoCollisions(
        mapLayers: Map<string, LayerConfig>,
        tilePos: Position,
        dimensions: BuildingDimensions
    ): boolean {
        // Si on a des objets de collision définis, utiliser cette méthode
        if (this.collisionObjects.length > 0) {
            return this.hasNoObjectCollisions(mapLayers);
        }

        // Sinon, utiliser la méthode actuelle basée sur les tiles
        for (let x = 0; x < dimensions.tilesWidth; x++) {
            for (let y = 0; y < dimensions.tilesHeight; y++) {
                const checkPos = {
                    x: tilePos.x + x,
                    y: tilePos.y + y
                };

                if (this.hasCollisionAtPosition(mapLayers, checkPos)) {
                    return false;
                }
            }
        }
        return true;
    }

    private hasNoObjectCollisions(mapLayers: Map<string, LayerConfig>): boolean {
        // Pour chaque objet de collision défini dans le bâtiment
        for (const obj of this.collisionObjects) {
            // Convertir la position de l'objet en position mondiale
            const worldX = this.currentPosition.x + obj.x;
            const worldY = this.currentPosition.y + obj.y;

            // Convertir en position de tuile
            const tileStartX = Math.floor(worldX / 16);
            const tileStartY = Math.floor(worldY / 16);
            const tileEndX = Math.floor((worldX + obj.width) / 16);
            const tileEndY = Math.floor((worldY + obj.height) / 16);

            // Vérifier toutes les tuiles dans la zone de l'objet de collision
            for (let tx = tileStartX; tx <= tileEndX; tx++) {
                for (let ty = tileStartY; ty <= tileEndY; ty++) {
                    const checkPos = { x: tx, y: ty };
                    if (this.hasCollisionAtPosition(mapLayers, checkPos)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private hasCollisionAtPosition(mapLayers: Map<string, LayerConfig>, pos: Position): boolean {
        for (const [_, config] of mapLayers.entries()) {
            if (!config.hasCollision) continue;

            const tile = config.layer.getTileAt(pos.x, pos.y);
            if (!tile) continue;

            if (this.tileHasCollision(tile)) {
                return true;
            }
        }
        return false;
    }

    private tileHasCollision(tile: Phaser.Tilemaps.Tile): boolean {
        if (tile.properties?.collides) {
            return true;
        }

        if (tile.tileset) {
            const collisionData = tile.tileset.getTileData(tile.index);
            if (collisionData?.objectgroup?.objects?.length > 0) {
                return true;
            }
        }

        return false;
    }

    public updatePosition(x: number, y: number): void {
        const snappedPosition = this.snapToGrid({ x, y });

        if (this.positionChanged(snappedPosition)) {
            this.currentPosition = snappedPosition;
            this.updateLayerPositions();
        }
    }

    private snapToGrid(position: Position): Position {
        return {
            x: Math.floor(position.x / 16) * 16,
            y: Math.floor(position.y / 16) * 16
        };
    }

    private positionChanged(newPosition: Position): boolean {
        return this.currentPosition.x !== newPosition.x ||
            this.currentPosition.y !== newPosition.y;
    }

    private updateLayerPositions(): void {
        this.layers.forEach(layer => {
            layer.setPosition(this.currentPosition.x, this.currentPosition.y);
        });

        // Mettre à jour les visualisations de collision
        if (this.collisionVisuals && this.collisionVisuals.length > 0) {
            for (let i = 0; i < this.collisionVisuals.length; i++) {
                if (i < this.collisionObjects.length) {
                    const obj = this.collisionObjects[i];
                    this.collisionVisuals[i].setPosition(
                        this.currentPosition.x + obj.x + obj.width / 2,
                        this.currentPosition.y + obj.y + obj.height / 2
                    );
                }
            }
        }

        // Mettre à jour la position des sprites de coin
        if (this.cornerSprites.length > 0) {
            for (let i = 0; i < this.cornerSprites.length; i++) {
                if (i < this.cornerPoints.length) {
                    const point = this.cornerPoints[i];

                    // Arrêter l'animation existante
                    this.scene.tweens.killTweensOf(this.cornerSprites[i]);

                    // Repositionner le sprite
                    this.cornerSprites[i].setPosition(
                        this.currentPosition.x + point.position.x,
                        this.currentPosition.y + point.position.y
                    );

                    // Recréer l'animation
                    this.createCornerAnimation(this.cornerSprites[i], point.type);
                }
            }
        }

        // Mettre à jour la position des boutons d'action
        if (this.confirmButton && this.cancelButton) {
            const bounds = this.getWorldBounds();

            this.confirmButton.setPosition(
                bounds.right,
                bounds.bottom + this.buttonPadding
            );

            this.cancelButton.setPosition(
                bounds.right - this.confirmButton.width - this.buttonPadding,
                bounds.bottom + this.buttonPadding
            );
        }
    }


    public setValidPlacement(isValid: boolean): void {
        if (this.isValid === isValid) return;

        this.isValid = isValid;
        const tint = isValid ? this.config.validTint : this.config.invalidTint;

        this.layers.forEach(layer => {
            layer.setTint(tint);
        });
    }

    public isValidPlacement(): boolean {
        return this.isValid;
    }

    public getDimensions(): BuildingDimensions {
        return {
            tilesWidth: this.map.width,
            tilesHeight: this.map.height
        };
    }

    public getPosition(): Position {
        return { ...this.currentPosition };
    }

    public getWorldBounds(): Phaser.Geom.Rectangle {
        const dimensions = this.getDimensions();
        return new Phaser.Geom.Rectangle(
            this.currentPosition.x,
            this.currentPosition.y,
            dimensions.tilesWidth * 16,
            dimensions.tilesHeight * 16
        );
    }

    public setVisible(visible: boolean): void {
        this.layers.forEach(layer => {
            layer.setVisible(visible);
        });

        // Mettre à jour aussi la visibilité des visualisations de collision
        this.collisionVisuals.forEach(visual => {
            visual.setVisible(visible);
        });

        // Mettre à jour la visibilité des sprites de coin
        this.cornerSprites.forEach(sprite => {
            sprite.setVisible(visible);
        });

        // Mettre à jour la visibilité des boutons d'action
        if (this.confirmButton) this.confirmButton.setVisible(visible);
        if (this.cancelButton) this.cancelButton.setVisible(visible);
    }

    public setAlpha(alpha: number): void {
        const clampedAlpha = Phaser.Math.Clamp(alpha, 0, 1);
        this.layers.forEach(layer => {
            layer.setAlpha(clampedAlpha);
        });
    }

    public flashInvalid(): void {
        this.scene.tweens.add({
            targets: this.layers,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.layers.forEach(layer => {
                    layer.setAlpha(this.config.previewAlpha);
                });
            }
        });
    }

    private showGrabCursor(): void {
        if (this.scene.uiScene) {
            this.scene.uiScene.defaultCursor.setVisible(false);
            this.scene.uiScene.hoverCursor.setVisible(false);
            this.scene.uiScene.grabCursor.setVisible(true);
            this.scene.uiScene.grabbingCursor.setVisible(false);
        }
    }

    private showGrabbingCursor(): void {
        if (this.scene.uiScene) {
            this.scene.uiScene.defaultCursor.setVisible(false);
            this.scene.uiScene.hoverCursor.setVisible(false);
            this.scene.uiScene.grabCursor.setVisible(false);
            this.scene.uiScene.grabbingCursor.setVisible(true);
        }
    }

    public setInitialPosition(x: number, y: number): void {
        const snappedPosition = this.snapToGrid({ x, y });
        this.initialPosition = snappedPosition;
        this.updatePosition(snappedPosition.x, snappedPosition.y);
    }

    public resetToInitialPosition(): void {
        this.updatePosition(this.initialPosition.x, this.initialPosition.y);
    }

    public isDraggingActive(): boolean {
        return this.isDragging;
    }

    public destroy(): void {
        if (this.scene.uiScene) {
            this.scene.uiScene.defaultCursor.setVisible(true);
            this.scene.uiScene.hoverCursor.setVisible(false);
            this.scene.uiScene.grabCursor.setVisible(false);
            this.scene.uiScene.grabbingCursor.setVisible(false);
        }

        this.layers.forEach(layer => {
            layer.removeAllListeners();
            try {
                layer.destroy();
            } catch (error) {
                console.error('Erreur lors de la destruction d\'une layer de preview:', error);
            }
        });

        // Détruire les visualisations de collision
        this.collisionVisuals.forEach(visual => {
            visual.destroy();
        });
        this.collisionVisuals = [];

        // Arrêter les animations et détruire les sprites de coin
        this.cornerSprites.forEach(sprite => {
            this.scene.tweens.killTweensOf(sprite);
            sprite.destroy();
        });
        this.cornerSprites = [];

        // Détruire les boutons d'action
        if (this.confirmButton) {
            this.confirmButton.removeAllListeners();
            this.confirmButton.destroy();
            this.confirmButton = null;
        }

        if (this.cancelButton) {
            this.cancelButton.removeAllListeners();
            this.cancelButton.destroy();
            this.cancelButton = null;
        }

        this.scene.input.off('pointermove');
        this.scene.input.off('pointerup');

        this.layers.length = 0;
    }
}
