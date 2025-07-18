import EasyStar from 'easystarjs';
import Phaser from 'phaser';
import { Building } from '@/game/objects/Building';
import { BuildingPreview } from '@/game/objects/BuildingPreview';
import { Player } from '@/game/objects/Player';
import type { TiledBuilding } from '@/game/objects/TiledBuilding';
import { TiledBuildingPreview } from '@/game/objects/TiledBuildingPreview';
import { Worker } from '@/game/objects/workers';
import { AnimationRegistry } from '@/game/services/AnimationRegistry';
import { BuildingManager } from '@/game/services/BuildingManager';
import { BuildingRegistry } from '@/game/services/BuildingRegistry';
import { DialogService } from '@/game/services/DialogService';
import { ResourceEntityManager } from '@/game/services/ResourceEntityManager';
import { ResourceManager } from '@/game/services/ResourceManager';
import { WorkerManager } from '@/game/services/WorkerManager';
import type { ResourceStack, WorkerPosition } from '@/game/types';
import { WorkerType } from '@/game/types';
import { ResourceType } from '@/game/types/ResourceSystemTypes';
import { AnimationUtils } from '@/game/utils/AnimationUtils';
import { WorkerRegistry } from '@/game/services';
import { WorkerPathfinder } from '@/game/services/WorkerPathfinder';
import { CameraService } from '../services/CameraService';
import { BuildingSelectionService } from '../services/BuildingSelectionService';
import { PlayerLevelSystem } from '../services/PlayerLevelSystem';
import { ZoneBlockerService } from '../services/ZoneBlockerService';

interface LayerConfig {
    layer: Phaser.Tilemaps.TilemapLayer;
    hasCollision: boolean;
    isAbovePlayer: boolean;
}

export class MainScene extends Phaser.Scene {
    private GAME_ASSETS_BASE_URL = '/assets/game/';
    private STORAGE_KEY = 'BUILDINGS_STORAGE';
    private player!: Player;
    private map!: Phaser.Tilemaps.Tilemap;
    private mapLayers: Map<string, LayerConfig> = new Map();
    private woodCount: number = 0;
    private woodText!: Phaser.GameObjects.Text;
    private dialogService!: DialogService;
    private targetWood: number = 5;
    private hasShownCompletionDialog: boolean = false;
    private buildingPreview: BuildingPreview | null = null;
    private selectedBuildingType: string | null = null;
    private lastSyncCheck: number = 0;
    private buildings: Building[] = [];
    private buildingManager!: BuildingManager;
    private resources = {
        wood: 0,
    };
    private easyStar: EasyStar.js;
    private tileWidth: number = 16;
    private tileHeight: number = 16;
    private buildingRegistry!: BuildingRegistry;
    private animationRegistry!: AnimationRegistry;
    private resourceEntityManager!: ResourceEntityManager;
    public resourceManager!: ResourceManager;
    public baseGrid: number[][] = [];
    public currentHarvestTarget: any = null;

    private workerManager!: WorkerManager;
    private cameraService!: CameraService;
    private buildingSelectionService!: BuildingSelectionService;
    private zoneBlockerService!: ZoneBlockerService;

    private isCameraFollowingPlayer: boolean = true;
    private isDraggingCamera: boolean = false;
    private lastPointerPosition: { x: number; y: number } | null = null;
    private targetIndicator: Phaser.GameObjects.Image | null = null;
    private targetIndicatorTween: Phaser.Tweens.Tween | null = null;
    private playerLevelSystem!: PlayerLevelSystem;
    private pathDotsGroup: Phaser.GameObjects.Group | null = null;

    constructor() {
        super({ key: 'MainScene' });
        this.easyStar = new EasyStar.js();
    }

    preload() {
        this.load.setBaseURL(this.GAME_ASSETS_BASE_URL);

        this.animationRegistry = AnimationRegistry.getInstance();

        this.resourceManager = ResourceManager.getInstance();
        this.resourceManager.prepareSceneLoading(this);

        const characterFrameConfig = { frameWidth: 96, frameHeight: 64, };

        this.load.spritesheet('player-walk', 'sprites/player-walk.png', characterFrameConfig);
        this.load.spritesheet('player-idle', 'sprites/player-idle.png', characterFrameConfig);
        this.load.spritesheet('player-chop', 'sprites/player-chop.png', characterFrameConfig);

        this.load.spritesheet('worker-idle', 'sprites/workers/spr_idle_strip9.png', characterFrameConfig);
        this.load.spritesheet('worker-walk', 'sprites/workers/spr_walk_strip8.png', characterFrameConfig);
        this.load.spritesheet('worker-chop', 'sprites/workers/spr_axe_strip10.png', characterFrameConfig);
        this.load.spritesheet('worker-mining', 'sprites/workers/spr_mining_strip10.png', characterFrameConfig);
        this.load.spritesheet('worker-carry', 'sprites/workers/spr_carry_strip8.png', characterFrameConfig);
        this.load.spritesheet('worker-doing', 'sprites/workers/spr_doing_strip8.png', characterFrameConfig);

        this.load.spritesheet('leaves-hit', 'sprites/leaves-hit.png', {
            frameWidth: 64,
            frameHeight: 32,
        });
        this.load.spritesheet('tree', 'sprites/tree.png', {
            frameWidth: 32,
            frameHeight: 34,
        });
        this.load.spritesheet('rock', 'sprites/rock.png', {
            frameWidth: 26,
            frameHeight: 25,
        });
        this.load.spritesheet('coal_vein', 'sprites/coal_vein.png', {
            frameWidth: 26,
            frameHeight: 25,
        });
        this.load.spritesheet('health-bar', 'ui/health-bar.png', {
            frameWidth: 21,
            frameHeight: 13,
        });
        this.load.image('tiles', 'tilesets/tileset.png');
        this.load.tilemapTiledJSON('map', 'maps/map.json');
        this.load.image('action-button', 'ui/action-button.png');

        // Cursors
        this.load.image('cursor', 'ui/cursor.png');
        this.load.image('cursor-chopping', 'ui/cursor-chopping.png');
        this.load.image('cursor-grab', 'ui/cursor-grab.png');
        this.load.image('cursor-grabbing', 'ui/cursor-grabbing.png');

        // Corners
        this.load.image('corner-top-left', 'ui/corner-top-left.png');
        this.load.image('corner-top-right', 'ui/corner-top-right.png');
        this.load.image('corner-bottom-left', 'ui/corner-bottom-left.png');
        this.load.image('corner-bottom-right', 'ui/corner-bottom-right.png');

        // Validation/Invalidation buttons
        this.load.image('building-confirm-button', 'ui/building-confirm-button.png');
        this.load.image('building-cancel-button', 'ui/building-cancel-button.png');

        // Housing
        this.load.image('house', 'buildings/house.png');
        this.load.image('sawmill', 'buildings/sawmill.png');

        this.load.tilemapTiledJSON('house-template', 'buildings/templates/house-template.json');
        this.load.tilemapTiledJSON('sawmill-template', 'buildings/templates/sawmill-template.json');

        // Utilities
        this.load.image('select_dots', 'ui/select_dots.png');
        this.load.image('select_dots_large', 'ui/select_dots_large.png');

        // Load icons for UI
        this.load.image('house-icon', 'ui/icons/house.png');
        this.load.image('sawmill-icon', 'ui/icons/sawmill.png');
        this.load.image('target-indicator', 'ui/sm-arrow-down.png');

        this.load.image('resource_wood', 'ui/resources/wood.png');
        this.load.image('resource_stone', 'ui/resources/stone.png');
        this.load.image('resource_unknown', 'ui/resources/unknown.png');
    }

    create() {
        console.log('MainScene create called');
        this.pathDotsGroup = this.add.group();
        
        this.setupAnimations();
        this.setupVueResourceSync();

        this.map = this.make.tilemap({ key: 'map' });
        const tileset = this.map.addTilesetImage('tileset', 'tiles');

        if (!tileset) {
            console.error('Failed to load tileset');
            return;
        }

        this.uiScene = this.scene.add(
            'UIScene',
            {
                create: function () {
                    this.defaultCursor = this.add.image(0, 0, 'cursor').setDepth(100000).setScale(2.5).setOrigin(0, 0);

                    this.hoverCursor = this.add.image(0, 0, 'cursor-chopping').setDepth(100000).setScale(2.5).setVisible(false).setOrigin(0, 0);

                    this.grabCursor = this.add.image(0, 0, 'cursor-grab').setDepth(100000).setScale(2.5).setVisible(false).setOrigin(0, 0);

                    this.grabbingCursor = this.add.image(0, 0, 'cursor-grabbing').setDepth(100000).setScale(2.5).setVisible(false).setOrigin(0, 0);

                    this.input.on('pointermove', (pointer) => {
                        this.defaultCursor.setPosition(pointer.x, pointer.y);
                        this.hoverCursor.setPosition(pointer.x, pointer.y);

                        this.grabCursor.setPosition(pointer.x, pointer.y);
                        this.grabbingCursor.setPosition(pointer.x, pointer.y);
                    });
                },
            },
            true,
        );
        this.input.setDefaultCursor('none');

        
        this.player = new Player(this, 830, 700);
        this.player.setScale(1);

        this.playerLevelSystem = PlayerLevelSystem.getInstance();

        this.cameraService = new CameraService(this);
        this.cameraService.setPlayer(this.player);

        this.resourceManager = ResourceManager.getInstance();
        this.resourceManager.prepareSceneLoading(this);

        this.buildingSelectionService = new BuildingSelectionService(this, this.cameraService);
        this.buildingRegistry = BuildingRegistry.getInstance();


        const allLayers = this.map.layers;
        allLayers.forEach((layerData) => {
            const layer = this.map.createLayer(layerData.name, tileset, 0, 0);
            if (!layer) return;

            const properties = this.getTiledProperties(layerData);
            const hasCollision = properties.hasCollision ?? false;
            const isAbovePlayer = properties.isAbovePlayer ?? false;

            if (hasCollision) {
                // SetCollisionByProperty => Activate collision on these tiles
                layer.setCollisionByProperty({ collides: true });
                //this.physics.add.collider(this.player, layer);
            }

            if (isAbovePlayer) {
                layer.setDepth(10);
            }

            this.mapLayers.set(layerData.name, {
                layer,
                hasCollision,
                isAbovePlayer,
            });
        });

        this.zoneBlockerService = new ZoneBlockerService(this, this.cameraService);
        this.zoneBlockerService.initialize(this.map);

        window.addEventListener('game:unlockZoneBlocker', (event: CustomEvent) => {
            const { blockerName } = event.detail;
            this.zoneBlockerService.unlockBlocker(blockerName);
        });

        this.player.setDepth(1);

        this.cameras.main.startFollow(this.player);
        this.isCameraFollowingPlayer = true;
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        const minDimension = Math.min(window.innerWidth, window.innerHeight);
        const zoomLevel = minDimension / 250;
        this.cameras.main.setZoom(Math.min(3.5, zoomLevel));

        this.physics.world.bounds.width = this.map.widthInPixels;
        this.physics.world.bounds.height = this.map.heightInPixels;

        this.resourceEntityManager = new ResourceEntityManager(this);
        this.resourceEntityManager.spawnFromMap(this.map);


        this.game.events.on('clearBuildings', () => {
            this.buildingManager.clearAll();
        });

        this.initializeBuildingSystem();

        this.buildingManager = new BuildingManager(this);

        this.workerManager = new WorkerManager(this);
        this.setupWorkerAssignmentListeners();

        this.buildingManager.loadState();
        this.rebuildPathfindingGrid();

        this.baseGrid = Array.from({ length: this.map.height }, () => Array(this.map.width).fill(0));

        this.mapLayers.forEach((layerConfig) => {
            if (!layerConfig.hasCollision) return; // Ignore those without collision
            const layer = layerConfig.layer;
            for (let y = 0; y < this.map.height; y++) {
                for (let x = 0; x < this.map.width; x++) {
                    const tile = layer.getTileAt(x, y);
                    if (!tile) continue;

                    const hasCollidesProp = !!(tile.properties && tile.properties.collides);

                    const tileData = tile.tileset.getTileData(tile.index);
                    const hasCollisionShapes =
                        tileData && tileData.objectgroup && tileData.objectgroup.objects && tileData.objectgroup.objects.length > 0;

                    if (hasCollidesProp || hasCollisionShapes) {
                        this.baseGrid[y][x] = 1;
                    }
                }
            }
        });

        const fullGrid = this.copyGrid(this.baseGrid);
        this.easyStar.setGrid(fullGrid);
        this.easyStar.setAcceptableTiles([0]);
        this.easyStar.enableDiagonals();
        this.easyStar.setIterationsPerCalculation(1000);
        this.easyStar.disableCornerCutting();

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            console.log('pointerdown event triggered');
            if ((this.buildingPreview && this.buildingPreview.isDraggingActive()) || pointer.event.defaultPrevented) {
                return;
            }

            const objects = this.input.hitTestPointer(pointer);
            const isResourceEntity = objects.some(obj => obj.constructor && obj.constructor.name === 'ResourceEntity');
            if (!isResourceEntity && this.currentHarvestTarget) {
                this.currentHarvestTarget.hideHoverCorners();
                this.currentHarvestTarget.isPlayerApproaching = false;
                this.currentHarvestTarget = null;
            }

            if (pointer.leftButtonDown() && !pointer.rightButtonDown()) {
                const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
                let targetTileX = Math.floor(worldPoint.x / this.tileWidth);
                let targetTileY = Math.floor(worldPoint.y / this.tileHeight);

                const playerTileX = Math.floor(this.player.x / this.tileWidth);
                const playerTileY = Math.floor(this.player.y / this.tileHeight);

                if (this.baseGrid[targetTileY][targetTileX] === 1) {
                    const nearestTile = this.findNearestWalkableTile(targetTileX, targetTileY);
                    if (nearestTile) {
                        targetTileX = nearestTile.x;
                        targetTileY = nearestTile.y;
                    } else {
                        console.log('No accessible tile found nearby');
                        return;
                    }
                }

                this.easyStar.findPath(playerTileX, playerTileY, targetTileX, targetTileY, (path) => {
                    console.log('findPath callback called, path:', path);
                    if (path === null) {
                        console.log('No path found!');
                    } else {
                        this.player.setPath(path);
                        this.createTargetIndicator(path);
                        this.showPathDots(path); // Afficher les points du chemin
                    }
                });

                this.easyStar.calculate();
            }
        });

        this.rebuildPathfindingGrid();
        this.setupVueEventListeners();

        window.addEventListener('game:confirmBuildingPlacement', this.onConfirmBuildingPlacement.bind(this));
        window.addEventListener('game:cancelBuildingPlacement', this.onCancelBuildingPlacement.bind(this));

        /* TODO: Test a supprimer: */
        this.time.delayedCall(2000, () => {
            this.testWorkerSystem();
        });
        /* ----------------------- */

        // Ajout d'un listener global pour pointerdown sur les ResourceEntity
        this.input.on('gameobjectdown', (pointer: Phaser.Input.Pointer, gameObject: any) => {
            if (gameObject instanceof Phaser.GameObjects.Sprite && gameObject.constructor.name === 'ResourceEntity') {
                // Si une autre entité était ciblée, désactive ses coins
                if (this.currentHarvestTarget && this.currentHarvestTarget !== gameObject) {
                    this.currentHarvestTarget.hideHoverCorners();
                    this.currentHarvestTarget.isPlayerApproaching = false;
                }
                this.currentHarvestTarget = gameObject;
                // Lance la récolte en mode "gestion MainScene"
                const player = this.player;
                if (player) {
                    gameObject.startPlayerHarvesting(player, false);
                }
            }
        });

        // Helper to show/hide custom cursors
        const setCustomCursor = (type: 'default' | 'grabbing' | 'none') => {
            if (this.uiScene) {
                this.uiScene.defaultCursor.setVisible(type === 'default');
                this.uiScene.grabCursor.setVisible(false); // never show grab in free camera mode
                this.uiScene.grabbingCursor.setVisible(type === 'grabbing');
                this.uiScene.hoverCursor.setVisible(false);
            }
        };
        // Always hide system cursor
        this.input.setDefaultCursor('none');

        // Camera drag logic for free camera mode (right mouse button)
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (!this.isCameraFollowingPlayer && pointer.rightButtonDown()) {
                this.isDraggingCamera = true;
                this.lastPointerPosition = { x: pointer.x, y: pointer.y };
                setCustomCursor('grabbing');
            } else if (!this.isCameraFollowingPlayer) {
                setCustomCursor('default');
            }
        });
        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if (!this.isCameraFollowingPlayer) {
                this.isDraggingCamera = false;
                this.lastPointerPosition = null;
                setCustomCursor('default');
            }
        });
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!this.isCameraFollowingPlayer && this.isDraggingCamera && this.lastPointerPosition) {
                const dx = pointer.x - this.lastPointerPosition.x;
                const dy = pointer.y - this.lastPointerPosition.y;
                this.cameras.main.scrollX -= dx / this.cameras.main.zoom;
                this.cameras.main.scrollY -= dy / this.cameras.main.zoom;
                this.lastPointerPosition = { x: pointer.x, y: pointer.y };
                setCustomCursor('grabbing'); // Always show grabbing while dragging
            } else if (!this.isCameraFollowingPlayer && !this.isDraggingCamera) {
                setCustomCursor('default');
            }
        });
        // Handle pointer leaving the game area
        this.input.on('pointerout', () => {
            if (!this.isCameraFollowingPlayer) {
                this.isDraggingCamera = false;
                this.lastPointerPosition = null;
                setCustomCursor('default');
            }
        });
        this.input.on('pointerleave', () => {
            if (!this.isCameraFollowingPlayer) {
                this.isDraggingCamera = false;
                this.lastPointerPosition = null;
                setCustomCursor('default');
            }
        });
        // On camera mode toggle, update cursor state
        window.addEventListener('game:toggleCameraMode', () => {
            const currentMode = this.cameraService.getCurrentMode();

            if (currentMode === CameraMode.FOLLOW_PLAYER) {
                this.cameraService.enableFreeCamera();
            } else {
                this.cameraService.returnToPlayer();
            }

            this.input.setDefaultCursor('none');
        });
        // Listen for path completion
        this.events.on('player_path_complete', () => {
            if (this.targetIndicator) {
                this.targetIndicator.destroy();
                this.targetIndicator = null;
            }
            if (this.targetIndicatorTween) {
                this.targetIndicatorTween.stop();
                this.targetIndicatorTween = null;
            }
            this.clearPathDots(); // Nettoyer les points à l'arrivée
        });

        // Supprimer le dot de test manuel (ligne avec this.add.image(500, 500, 'select_dots'))
    }

    private setupVueResourceSync(): void {
        try {
            this.resourceManager.getGlobalInventory().on('change', (event: any) => {
                this.notifyVueResourceChange(event);
            });

            this.notifyGameReady();

            console.log('Vue resource sync configured successfully');
        } catch (error) {
            console.error('Error setting up Vue resource sync:', error);
        }
    }

    public getPlayer(): Player {
        return this.player;
    }

    public getZoneBlockerService(): ZoneBlockerService {
        return this.zoneBlockerService;
    }

    private onConfirmBuildingPlacement(event: CustomEvent): void {
        if (!this.buildingPreview || !this.selectedBuildingType) return;

        const position = event.detail.position;
        const isValid = event.detail.isValid;

        if (isValid) {
            if (!this.canAffordBuilding(this.selectedBuildingType)) {
                console.log('Cannot afford building anymore');

                window.dispatchEvent(
                    new CustomEvent('game:notification', {
                        detail: {
                            type: 'error',
                            title: 'Ressources insuffisantes',
                            message: "Vous n'avez plus assez de ressources pour ce bâtiment",
                        },
                    }),
                );

                this.onBuildingDeselectedFromVue();
                return;
            }

            const building = this.buildingManager.placeBuilding(
                this.selectedBuildingType,
                position.x,
                position.y
            );

            this.deductBuildingCost(this.selectedBuildingType);
            this.onBuildingDeselectedFromVue();

            window.dispatchEvent(
                new CustomEvent('game:notification', {
                    detail: {
                        type: 'success',
                        title: 'Bâtiment placé',
                        message: `${this.selectedBuildingType} a été placé avec succès !`,
                    },
                }),
            );
        } else {
            this.buildingPreview.flashInvalid();

            window.dispatchEvent(
                new CustomEvent('game:notification', {
                    detail: {
                        type: 'error',
                        title: 'Placement invalide',
                        message: 'Impossible de placer le bâtiment à cet endroit',
                    },
                }),
            );
        }
    }

    private onCancelBuildingPlacement(): void {
        this.onBuildingDeselectedFromVue();

        window.dispatchEvent(
            new CustomEvent('game:notification', {
                detail: {
                    type: 'info',
                    title: 'Placement annulé',
                    message: 'Placement du bâtiment annulé',
                },
            }),
        );
    }

    private notifyVueResourceChange(event: any): void {
        try {
            window.dispatchEvent(
                new CustomEvent('game:resourceUpdate', {
                    detail: {
                        type: event.type,
                        amount: event.newAmount,
                        change: event.change,
                        source: 'resource_manager',
                    },
                }),
            );

            console.log('Resource change notified to Vue:', event.type, event.newAmount);
        } catch (error) {
            console.error('Error notifying Vue of resource change:', error);
        }
    }

    public addResource(type: ResourceType, amount: number, source?: string): number {
        return this.resourceManager.addResource(type, amount, source || 'scene');
    }

    public removeResource(type: ResourceType, amount: number, target?: string): number {
        return this.resourceManager.removeResource(type, amount, target || 'scene');
    }

    public canAffordCost(cost: Partial<Record<ResourceType, number>>): boolean {
        return this.resourceManager.canAfford(cost);
    }

    private setupAnimations(): void {
        const entityTypes: Array<'player' | 'worker' | 'tree' | 'effects'> = ['player', 'worker', 'tree', 'effects'];
        AnimationUtils.preloadSceneAnimations(this, entityTypes);

        const validation = this.animationRegistry.validateTextures(this);
        if (!validation.isValid) {
            console.warn('Missing textures for animations:', validation.missingTextures);
        }

        if (process.env.NODE_ENV === 'development') {
            AnimationUtils.logAnimationStats();
        }
    }

    public getResourceAmount(type: ResourceType): number {
        return this.resourceManager.getResource(type);
    }

    public getAllResources(): ResourceStack[] {
        return this.resourceManager.getGlobalInventory().getNonZeroResources();
    }

    private notifyGameReady(): void {
        try {
            window.dispatchEvent(
                new CustomEvent('game:ready', {
                    detail: {
                        resourceManager: this.resourceManager,
                        totalResources: this.resourceManager.getGlobalInventory().getTotalItems(),
                        allResources: Object.fromEntries(this.resourceManager.getGlobalInventory().getAllResources()),
                    },
                }),
            );

            this.triggerInitialResourceSync();

            console.log('Game ready notification sent to Vue with resources');
        } catch (error) {
            console.error('Error notifying game ready to Vue:', error);
        }
    }

    private triggerInitialResourceSync(): void {
        try {
            const inventory = this.resourceManager.getGlobalInventory();
            const allResources = inventory.getAllResources();

            allResources.forEach((amount, type) => {
                if (amount > 0) {
                    window.dispatchEvent(
                        new CustomEvent('game:resourceUpdate', {
                            detail: {
                                type,
                                amount,
                                change: amount,
                                source: 'initial_sync',
                            },
                        }),
                    );
                }
            });

            console.log('Initial resource sync completed');
        } catch (error) {
            console.error('Error in initial resource sync:', error);
        }
    }

    private setupVueEventListeners(): void {
        const handleBuildingSelection = (event: CustomEvent) => {
            const buildingType = event.detail;
            this.onBuildingSelectedFromVue(buildingType);
        };

        const handleBuildingDeselection = () => {
            this.onBuildingDeselectedFromVue();
        };

        const handleWorkerCreation = (event: CustomEvent) => {
            const { type, positionHint } = event.detail;
            this.onWorkerCreationFromVue(type, positionHint);
        };

        window.addEventListener('game:selectBuilding', handleBuildingSelection);
        window.addEventListener('game:deselectBuilding', () => {
            this.buildingSelectionService.deselectBuilding();
        });
        window.addEventListener('game:createWorkerCommand', handleWorkerCreation);
    }

    private setupWorkerAssignmentListeners(): void {
        window.addEventListener('game:assignWorkerToBuilding', this.handleAssignWorker.bind(this))
        window.addEventListener('game:unassignWorkerFromBuilding', this.handleUnassignWorker.bind(this))
        window.addEventListener('game:requestAvailableWorkers', this.handleAvailableWorkersRequest.bind(this))
    }

    private testBuildingSetFunctionality(building: TiledBuilding): void {
        console.log('\n=== TESTING SET FUNCTIONALITY ===');

        // Test direct du Set
        const testSet = new Set<string>();
        console.log('New Set size:', testSet.size);
        testSet.add('test1');
        console.log('After adding test1:', testSet.size);
        testSet.add('test2');
        console.log('After adding test2:', testSet.size);
        console.log('Set contents:', Array.from(testSet));

        // Test sur le bâtiment
        console.log('\nTesting building Set...');
        const buildingSet = (building as any).assignedWorkers;
        console.log('Building Set type:', typeof buildingSet);
        console.log('Building Set constructor:', buildingSet?.constructor?.name);
        console.log('Has add method:', typeof buildingSet?.add === 'function');

        console.log('=== END SET TEST ===\n');
    }

    private handleAssignWorker(event: CustomEvent): void {
        console.log('=== ASSIGN WORKER EVENT ===');
        const { building } = event.detail;

        if (!this.workerManager) {
            console.error('WorkerManager not available');
            return;
        }

        const buildingId = building.getBuildingId();
        if (!buildingId || buildingId.trim() === '') {
            console.error('Building ID is invalid:', buildingId);
            return;
        }

        console.log(`Building ID: "${buildingId}"`);
        console.log(`Building type: "${building.getType()}"`);

        building.debugWorkerAssignment();

        if (!building.canAssignWorker()) {
            console.warn('Building cannot accept more workers');
            return;
        }

        const availableWorkers = this.workerManager.getAllWorkers().filter(worker => {
            const isNeutral = worker.getConfig().id === WorkerType.NEUTRAL;
            const isUnassigned = !worker.isAssignedToBuilding();
            return isNeutral && isUnassigned;
        });

        console.log(`Available workers for assignment: ${availableWorkers.length}`);

        if (availableWorkers.length === 0) {
            console.warn('No available workers to assign');
            return;
        }

        const worker = availableWorkers[0];
        const workerId = worker.getWorkerId();

        console.log(`Attempting assignment with worker ID: "${workerId}"`);

        try {
            // Étape 1: Vérifier les prérequis
            if (worker.getConfig().id !== WorkerType.NEUTRAL) {
                throw new Error(`Worker is not neutral type, current type: ${worker.getConfig().id}`);
            }

            if (worker.isAssignedToBuilding()) {
                throw new Error(`Worker is already assigned to building: ${worker.getAssignedBuildingId()}`);
            }

            // Étape 2: Obtenir la configuration du type de worker cible
            const targetWorkerType = building.getWorkerType();
            const newConfig = WorkerRegistry.getInstance().getWorkerConfig(targetWorkerType);

            if (!newConfig) {
                throw new Error(`No config found for worker type ${targetWorkerType}`);
            }

            // Étape 3: Essayer l'assignation normale, puis fallback si échec
            console.log('=== STEP 3: Trying normal assignment ===');
            let assignmentResult = building.assignWorker(workerId);

            if (!assignmentResult) {
                console.log('=== Normal assignment failed, trying fallback ===');

                // Vérifier si la méthode fallback existe
                if (typeof building.assignWorkerFallback === 'function') {
                    assignmentResult = building.assignWorkerFallback(workerId);
                    console.log(`Fallback assignment result: ${assignmentResult}`);
                } else {
                    throw new Error('Both normal and fallback assignment methods failed');
                }
            }

            if (!assignmentResult) {
                throw new Error('All assignment methods failed');
            }

            // Étape 4: Convertir le worker
            console.log('=== STEP 4: Converting worker ===');

            try {
                worker.convertToSpecializedWorker(newConfig, buildingId);
                console.log(`Worker converted to ${targetWorkerType}`);

                if (worker.getConfig().id !== targetWorkerType) {
                    throw new Error(`Worker conversion failed: expected ${targetWorkerType}, got ${worker.getConfig().id}`);
                }

                if (worker.getAssignedBuildingId() !== buildingId) {
                    throw new Error(`Worker building assignment failed: expected ${buildingId}, got ${worker.getAssignedBuildingId()}`);
                }

            } catch (conversionError) {
                console.error('Worker conversion failed:', conversionError);
                // Rollback l'assignation
                building.unassignWorker(workerId);
                throw conversionError;
            }

            // Étape 5: Configurer le point de dépôt
            console.log('=== STEP 5: Setting deposit point ===');
            const pos = building.getPosition();
            const dim = building.getDimensions();

            const depositPoint = {
                x: pos.x + (dim.tilesWidth * 16) / 2,
                y: pos.y + dim.tilesHeight * 16 + 16
            };

            worker.setDepositPoint(depositPoint);

            // Étape 6: Diagnostiquer l'état final
            console.log('=== STEP 6: Final state verification ===');
            building.debugWorkerAssignment();

            // Obtenir le count selon la méthode utilisée
            let finalAssignedCount;
            if (typeof building.getAssignedWorkerCountFallback === 'function') {
                // Vérifier si on utilise le fallback
                const normalCount = building.getAssignedWorkerCount();
                const fallbackCount = building.getAssignedWorkerCountFallback();

                console.log(`Normal count: ${normalCount}, Fallback count: ${fallbackCount}`);

                // Utiliser le count le plus élevé (celui qui fonctionne)
                finalAssignedCount = Math.max(normalCount, fallbackCount);
            } else {
                finalAssignedCount = building.getAssignedWorkerCount();
            }

            console.log(`Final assigned count: ${finalAssignedCount}`);

            // Étape 7: Mettre à jour et notifier
            this.handleAvailableWorkersRequest();

            window.dispatchEvent(new CustomEvent('game:workerAssignedToBuilding', {
                detail: {
                    buildingId,
                    buildingType: building.getType(),
                    workerId,
                    workerType: targetWorkerType,
                    assignedCount: finalAssignedCount,
                    maxWorkers: building.getMaxWorkers(),
                    success: true,
                    timestamp: Date.now()
                }
            }));

            window.dispatchEvent(new CustomEvent('game:notification', {
                detail: {
                    type: 'success',
                    title: 'Ouvrier assigné',
                    message: `Un ${newConfig.name} a été assigné à la ${building.getBuildingName()}`,
                    duration: 3000
                }
            }));

            console.log('Worker assignment completed successfully');

        } catch (error) {
            console.error('Error during worker assignment:', error);

            // Rollback complet
            try {
                building.unassignWorker(workerId);
                if (worker.convertToNeutral) {
                    worker.convertToNeutral();
                }
                if (worker.setDepositPoint) {
                    worker.setDepositPoint(null);
                }
                console.log('Rollback completed successfully');
            } catch (rollbackError) {
                console.error('Rollback failed:', rollbackError);
            }

            // Notifier l'échec
            window.dispatchEvent(new CustomEvent('game:workerAssignmentFailed', {
                detail: {
                    buildingId,
                    buildingType: building.getType(),
                    workerId,
                    reason: 'assignment_error',
                    error: error.message,
                    assignedCount: building.getAssignedWorkerCount(),
                    maxWorkers: building.getMaxWorkers(),
                    timestamp: Date.now()
                }
            }));

            window.dispatchEvent(new CustomEvent('game:notification', {
                detail: {
                    type: 'error',
                    title: 'Échec d\'assignation',
                    message: `Impossible d'assigner l'ouvrier: ${error.message}`,
                    duration: 5000
                }
            }));

            this.handleAvailableWorkersRequest();
        }

        console.log('=== END ASSIGN WORKER EVENT ===');
    }


    private handleAvailableWorkersRequest(): void {
        console.log('=== HANDLING AVAILABLE WORKERS REQUEST ===');

        if (!this.workerManager) {
            console.warn('WorkerManager not available');
            window.dispatchEvent(new CustomEvent('game:availableWorkersUpdate', {
                detail: { count: 0 }
            }));
            return;
        }

        try {
            const allWorkers = this.workerManager.getAllWorkers();
            console.log(`Total workers in manager: ${allWorkers.length}`);

            // Diagnostiquer tous les workers
            allWorkers.forEach((worker, index) => {
                const config = worker.getConfig();
                const isAssigned = worker.isAssignedToBuilding?.() || false;
                const assignedBuildingId = worker.getAssignedBuildingId?.() || 'none';

                console.log(`Worker ${index}: id=${worker.getWorkerId()}, type=${config.id}, assigned=${isAssigned}, buildingId=${assignedBuildingId}`);
            });

            // Filtrer les workers neutres non assignés
            const neutralWorkers = allWorkers.filter(worker => {
                const isNeutral = worker.getConfig().id === WorkerType.NEUTRAL;
                const isAssigned = worker.isAssignedToBuilding?.() || false;

                console.log(`Worker ${worker.getWorkerId()}: neutral=${isNeutral}, assigned=${isAssigned}`);
                return isNeutral && !isAssigned;
            });

            console.log(`Available neutral workers: ${neutralWorkers.length}`);

            // Notifier l'UI
            window.dispatchEvent(new CustomEvent('game:availableWorkersUpdate', {
                detail: {
                    count: neutralWorkers.length,
                    totalWorkers: allWorkers.length,
                    neutralWorkers: neutralWorkers.length
                }
            }));

        } catch (error) {
            console.error('Error in handleAvailableWorkersRequest:', error);
            window.dispatchEvent(new CustomEvent('game:availableWorkersUpdate', {
                detail: { count: 0, error: error.message }
            }));
        }

        console.log('=== END AVAILABLE WORKERS REQUEST ===');
    }

    private handleUnassignWorker(event: CustomEvent): void {
        console.log('=== UNASSIGN WORKER EVENT ===');
        const { building } = event.detail;

        if (!this.workerManager) {
            console.error('WorkerManager not available');
            return;
        }

        const buildingId = building.getBuildingId();
        if (!buildingId || buildingId.trim() === '') {
            console.error('Building ID is invalid for unassignment');
            return;
        }

        console.log(`Building ID: "${buildingId}"`);
        console.log(`Building type: "${building.getType()}"`);

        // Diagnostiquer l'état avant désassignation
        console.log('=== BUILDING STATE BEFORE UNASSIGNMENT ===');
        building.debugWorkerAssignment();

        // Récupérer les workers assignés à ce bâtiment
        const assignedWorkerIds = building.getAssignedWorkerIds();
        console.log(`Workers assigned to building: [${assignedWorkerIds.join(', ')}]`);

        if (assignedWorkerIds.length === 0) {
            console.warn('No workers assigned to this building');
            return;
        }

        // Prendre le premier worker assigné pour le désassigner
        const workerIdToUnassign = assignedWorkerIds[0];
        const worker = this.workerManager.getWorker(workerIdToUnassign);

        if (!worker) {
            console.error(`Worker ${workerIdToUnassign} not found in manager`);
            // Nettoyer l'assignation du bâtiment même si le worker n'existe plus
            building.unassignWorker(workerIdToUnassign);
            return;
        }

        console.log(`Attempting to unassign worker ${workerIdToUnassign}`);

        try {
            // Étape 1: Désassigner du bâtiment
            const unassignResult = building.unassignWorker(workerIdToUnassign);
            console.log(`Unassignment from building result: ${unassignResult}`);

            if (unassignResult) {
                // Étape 2: Convertir le worker en neutre
                worker.convertToNeutral();
                worker.setDepositPoint(null);

                console.log(`Worker ${workerIdToUnassign} converted back to NEUTRAL`);

                // Étape 3: Diagnostiquer l'état final
                console.log('=== BUILDING STATE AFTER UNASSIGNMENT ===');
                building.debugWorkerAssignment();

                // Étape 4: Mettre à jour les compteurs
                this.handleAvailableWorkersRequest();

                // Notifier le succès
                window.dispatchEvent(new CustomEvent('game:workerUnassignedFromBuilding', {
                    detail: {
                        buildingId,
                        workerId: workerIdToUnassign,
                        assignedCount: building.getAssignedWorkerCount(),
                        maxWorkers: building.getMaxWorkers(),
                        success: true
                    }
                }));

                console.log('Worker unassignment completed successfully');

            } else {
                console.error('Failed to unassign worker from building');
            }

        } catch (error) {
            console.error('Error during worker unassignment:', error);

            // Notifier l'échec
            window.dispatchEvent(new CustomEvent('game:workerUnassignmentFailed', {
                detail: {
                    buildingId,
                    workerId: workerIdToUnassign,
                    reason: 'unassignment_error',
                    error: error.message
                }
            }));
        }

        console.log('=== END UNASSIGN WORKER EVENT ===');
    }


    private unassignWorkerFromBuilding(workerId: string): boolean {
        const worker = this.workerManager.getWorker(workerId);
        if (!worker) {
            console.warn(`Worker ${workerId} not found`);
            return false;
        }

        const buildingId = worker.getAssignedBuildingId();
        if (!buildingId) {
            console.warn('Worker is not assigned to any building');
            return false;
        }

        const building = this.findBuildingById(buildingId);
        if (building && building.unassignWorker(workerId)) {
            worker.convertToNeutral();
            worker.setDepositPoint(null);

            console.log(`Worker ${workerId} unassigned and converted to NEUTRAL`);
            return true;
        }

        return false;
    }

    private findBuildingById(buildingId: string): TiledBuilding | null {
        if (!this.buildingManager || !buildingId || buildingId.trim() === '') {
            return null;
        }

        try {
            const buildings = this.buildingManager.getBuildings();
            console.log(`Searching for building ID "${buildingId}" among ${buildings.length} buildings`);

            for (const building of buildings) {
                const currentBuildingId = building.getBuildingId();
                console.log(`Checking building: "${currentBuildingId}" vs "${buildingId}"`);

                if (currentBuildingId === buildingId) {
                    console.log('Building found!');
                    return building;
                }
            }

            console.log('Building not found');
            return null;

        } catch (error) {
            console.error('Error finding building by ID:', error);
            return null;
        }
    }


    private assignWorkerToBuilding(worker: Worker, building: TiledBuilding): boolean {
        const workerId = worker.getWorkerId();
        console.log(`=== ASSIGNING WORKER ${workerId} ===`);

        console.log(`Worker found: ${workerId}, type: ${worker.getConfig().id}`);

        if (!building.canAssignWorker()) {
            console.error('Building cannot accept more workers');
            return false;
        }

        if (worker.getConfig().id !== WorkerType.NEUTRAL) {
            console.error(`Worker is not neutral type, current type: ${worker.getConfig().id}`);
            return false;
        }

        const targetWorkerType = building.getWorkerType();
        const newConfig = WorkerRegistry.getInstance().getWorkerConfig(targetWorkerType);

        if (!newConfig) {
            console.error(`No config found for worker type ${targetWorkerType}`);
            return false;
        }

        const buildingId = building.getBuildingId();
        console.log(`Building ID: ${buildingId}`);
        console.log(`Assigning worker ${workerId} to building...`);

        // Assigner le worker au bâtiment AVANT la conversion
        if (building.assignWorker(workerId)) {
            console.log('Worker assigned to building successfully');

            // Convertir le worker après l'assignment
            worker.convertToSpecializedWorker(newConfig, buildingId);
            const pos = building.getPosition();
            worker.setDepositPoint({ x: pos.x, y: pos.y });

            console.log(`Worker ${workerId} converted to ${targetWorkerType}`);

            return true;
        } else {
            console.error('Building failed to assign worker');
            return false;
        }
    }

    private getBuildingId(building: TiledBuilding): string {
        return building.getBuildingId();
    }

    private onBuildingSelectedFromVue(buildingType: string): void {
        console.log('Building selected from Vue:', buildingType);

        this.selectedBuildingType = buildingType;

        if (this.buildingPreview) {
            this.buildingPreview.destroy();
            this.buildingPreview = null;
        }

        // Correction : utiliser le template du config
        const buildingConfig = this.buildingRegistry.getBuildingConfig(buildingType);
        if (!buildingConfig) {
            console.error('Aucun config trouvé pour le bâtiment', buildingType);
            return;
        }
        const templateKey = buildingConfig.template;
        this.buildingPreview = new TiledBuildingPreview(this, templateKey);
        this.buildingPreview.setInitialPosition(this.player.x, this.player.y);

        if (this.uiScene) {
            this.uiScene.defaultCursor.setVisible(false);
            this.uiScene.hoverCursor.setVisible(false);
        }

        console.log('Building preview activated for:', buildingType);
    }

    private onBuildingDeselectedFromVue(): void {
        if (this.buildingPreview) {
            this.buildingPreview.destroy();
            this.buildingPreview = null;
        }

        this.selectedBuildingType = null;

        if (this.uiScene) {
            this.uiScene.defaultCursor.setVisible(true);
            this.uiScene.hoverCursor.setVisible(false);
        }
    }

    private onWorkerCreationFromVue(workerType: string, positionHint?: string | { x: number; y: number }): void {
        console.log('Worker creation requested from Vue:', workerType, positionHint);

        let spawnPosition = { x: 100, y: 100 };

        if (positionHint === 'near_player' && this.player) {
            spawnPosition = {
                x: this.player.x + 32 + Math.random() * 64 - 32,
                y: this.player.y + 32 + Math.random() * 64 - 32,
            };
        } else if (typeof positionHint === 'object' && positionHint.x && positionHint.y) {
            spawnPosition = positionHint;
        } else if (this.player) {
            spawnPosition = {
                x: this.player.x + 64,
                y: this.player.y,
            };
        }

        let depositPoint: { x: number; y: number } | undefined = undefined;

        if (this.buildingManager) {
            const buildings = this.buildingManager.getBuildings();
            const sawmills = buildings.filter((building) => building.getType() === 'sawmill');

            if (sawmills.length > 0) {
                let closestSawmill = sawmills[0];
                let closestDistance = Phaser.Math.Distance.Between(
                    spawnPosition.x,
                    spawnPosition.y,
                    closestSawmill.getPosition().x,
                    closestSawmill.getPosition().y,
                );

                for (let i = 1; i < sawmills.length; i++) {
                    const distance = Phaser.Math.Distance.Between(
                        spawnPosition.x,
                        spawnPosition.y,
                        sawmills[i].getPosition().x,
                        sawmills[i].getPosition().y,
                    );
                    if (distance < closestDistance) {
                        closestSawmill = sawmills[i];
                        closestDistance = distance;
                    }
                }

                const pos = closestSawmill.getPosition();
                const dim = closestSawmill.getDimensions();

                depositPoint = {
                    x: pos.x + (dim.tilesWidth * 16) / 2,
                    y: pos.y + dim.tilesHeight * 16 + 16,
                };

                console.log('Deposit point configured at sawmill:', depositPoint);
            }
        }

        const worker = this.createWorkerAtPosition(workerType, spawnPosition.x, spawnPosition.y, depositPoint);

        if (worker) {
            window.dispatchEvent(
                new CustomEvent('game:workerCreated', {
                    detail: {
                        worker,
                        type: workerType,
                        position: spawnPosition,
                        depositPoint,
                    },
                }),
            );

            console.log(`${workerType} created successfully at (${spawnPosition.x}, ${spawnPosition.y})`);
        } else {
            window.dispatchEvent(
                new CustomEvent('game:notification', {
                    detail: {
                        type: 'error',
                        title: 'Erreur',
                        message: `Impossible de créer ${workerType}`,
                    },
                }),
            );
        }
    }

    public createWorker(type: WorkerType, x?: number, y?: number): Worker | null {
        const spawnX = x || this.player.x + 32;
        const spawnY = y || this.player.y;

        console.log(`MainScene: Creating worker ${type} at (${spawnX}, ${spawnY})`);

        const depositPoint = this.findNearestDepositPoint(type, { x: spawnX, y: spawnY });
        const worker = this.workerManager.createWorker(type, spawnX, spawnY, depositPoint);

        if (worker) {
            console.log(`MainScene: Successfully created worker ${type}`);
        } else {
            console.error(`MainScene: Failed to create worker ${type}`);
        }

        return worker;
    }

    public testWorkerSystem(): void {
        console.log('=== TESTING WORKER SYSTEM ===');

        if (this.resourceEntityManager) {
            const trees = this.resourceEntityManager.getEntitiesByType('tree');
            console.log(`Found ${trees.length} trees`);
            trees.forEach((tree, index) => {
                console.log(`Tree ${index}: (${tree.x}, ${tree.y})`);
            });
        } else {
            console.error('ResourceEntityManager not available!');
        }

        if (this.buildingManager) {
            const sawmills = this.buildingManager.getBuildingsByType('sawmill');
            console.log(`Found ${sawmills.length} sawmills`);
        } else {
            console.error('BuildingManager not available!');
        }

        if (this.workerManager) {
            console.log('WorkerManager is available');

            for (let i = 0; i < 3; i++) {
                const worker = this.workerManager.createWorker(WorkerType.NEUTRAL, this.player.x + 50, this.player.y + (i * 16));
                if (worker) {
                    console.log(`Created NEUTRAL worker ${i+1}:`, worker.getConfig().id);
                } else {
                    console.error(`Failed to create NEUTRAL worker ${i+1}`);
                }
            }

            const allWorkers = this.workerManager.getAllWorkers();
            const neutralWorkers = this.workerManager.getWorkersByType(WorkerType.NEUTRAL);
            console.log(`Total workers created: ${allWorkers.length}`);
            console.log(`Neutral workers: ${neutralWorkers.length}`);

            const testWorker = this.createWorker(WorkerType.LUMBERJACK, this.player.x + 50, this.player.y);
            if (testWorker) {
                console.log('Test worker created successfully!');

                const config = testWorker.getConfig();
                console.log('Worker config:', config);
            } else {
                console.error('Failed to create test worker!');
            }
        } else {
            console.error('WorkerManager not available!');
        }

        console.log('=== END WORKER SYSTEM TEST ===');
    }

    private findNearestDepositPoint(workerType: WorkerType, position: WorkerPosition): WorkerPosition | undefined {
        // Pour l'instant, retourner une position par défaut
        // TODO: Améliorer avec la logique du BuildingManager
        return { x: position.x + 100, y: position.y };
    }

    private createWorkerAtPosition(
        workerType: string,
        x: number,
        y: number,
        depositPoint?: {
            x: number;
            y: number;
        },
    ): any {
        if (workerType === 'lumberjack') {
            return this.createLumberjack(x, y, depositPoint);
        }

        console.warn(`Worker type ${workerType} not implemented yet`);
        return null;
    }

    public createLumberjack(x?: number, y?: number, depositPoint?: WorkerPosition): Worker | null {
        return this.createWorker(WorkerType.LUMBERJACK, x, y);
    }

    /*
    public pauseAllWorkers(): void {
      this.workerManager.pauseAllWorkers();
    }

    public resumeAllWorkers(): void {
      this.workerManager.resumeAllWorkers();
    }

    public getWorkerStats(): any {
      return this.workerManager.getWorkerStats();
    }
    */

    private copyGrid(source: number[][]): number[][] {
        return source.map((row) => [...row]);
    }

    public getBaseGrid(): number[][] {
        return this.baseGrid;
    }

    public setBaseGridCell(x: number, y: number, value: number): void {
        if (y >= 0 && y < this.baseGrid.length && x >= 0 && x < this.baseGrid[0].length) {
            this.baseGrid[y][x] = value;
        }
    }

    public rebuildPathfindingGrid(): void {
        const fullGrid = this.copyGrid(this.baseGrid);

        this.buildingManager.getBuildings().forEach((building) => {
            const { x, y } = building.getPosition();
            const { tilesWidth, tilesHeight } = building.getDimensions();

            const tileX = Math.floor(x / this.tileWidth);
            const tileY = Math.floor(y / this.tileHeight);

            const buildingMap = building.getMap();

            buildingMap.layers.forEach((layerData) => {
                const layer = buildingMap.getLayer(layerData.name);
                if (!layer) return;

                for (let ty = 0; ty < layer.tilemapLayer.layer.height; ty++) {
                    for (let tx = 0; tx < layer.tilemapLayer.layer.width; tx++) {
                        const tile = layer.tilemapLayer.getTileAt(tx, ty);
                        if (!tile) continue;

                        const hasCollidesProp = !!tile.properties?.collides;
                        const tileData = tile.tileset.getTileData(tile.index);
                        const hasCollisionShapes =
                            tileData && tileData.objectgroup && tileData.objectgroup.objects && tileData.objectgroup.objects.length > 0;

                        if (hasCollidesProp || hasCollisionShapes) {
                            const gx = tileX + tx;
                            const gy = tileY + ty;

                            if (gy >= 0 && gy < fullGrid.length && gx >= 0 && gx < fullGrid[0].length) {
                                fullGrid[gy][gx] = 1;
                            }
                        }
                    }
                }
            });
        });

        this.resourceEntityManager.getAllEntities().forEach((entity) => {
            if (entity.isBlockingPath()) {
                const pos = entity.getEntityTilePosition();
                if (pos.y >= 0 && pos.y < fullGrid.length && pos.x >= 0 && pos.x < fullGrid[0].length) {
                    fullGrid[pos.y][pos.x] = 1;
                }
            }
        });

        const pathfinder = WorkerPathfinder.getInstance();
        pathfinder.initializeGrid(fullGrid);
        this.easyStar.setGrid(fullGrid);

        console.log('Pathfinding grid rebuilt');
    }

    public showResourceError(message: string = 'Insufficient resources!'): void {
        const text = this.add
            .text(this.cameras.main.centerX, 100, message, {
                fontSize: '24px',
                color: '#ff0000',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 },
            })
            .setScrollFactor(0)
            .setOrigin(0.5);

        this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy(),
        });
    }

    private initializeBuildingSystem(): void {
        this.game.events.on('selectBuilding', this.onBuildingSelected, this);

        window.addEventListener('game:deselectBuilding', this.onBuildingDeselected.bind(this));

        this.input.keyboard.on('keydown-ESC', () => {
            if (this.buildingPreview) {
                this.cancelBuildingPlacement();
            }
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.buildingPreview && this.buildingPreview.isValidPlacement()) {
                this.confirmBuildingPlacement();
            }
        });
    }

    private cancelBuildingPlacement(): void {
        window.dispatchEvent(new CustomEvent('game:buildingPlacementCancelled'));
        this.onBuildingDeselected();

        window.dispatchEvent(
            new CustomEvent('game:notification', {
                detail: {
                    type: 'info',
                    title: 'Construction annulée',
                    message: 'Mode construction désactivé',
                },
            }),
        );
    }

    private confirmBuildingPlacement(): void {
        if (!this.buildingPreview || !this.selectedBuildingType) return;

        if (this.buildingPreview.isValidPlacement()) {
            if (!this.canAffordBuilding(this.selectedBuildingType)) {
                console.log('Cannot afford building anymore');

                window.dispatchEvent(
                    new CustomEvent('game:notification', {
                        detail: {
                            type: 'error',
                            title: 'Ressources insuffisantes',
                            message: "Vous n'avez plus assez de ressources pour ce bâtiment",
                        },
                    }),
                );

                this.onBuildingDeselectedFromVue();
                window.dispatchEvent(new CustomEvent('game:buildingPlacementCancelled'));
                return;
            }

            const position = this.buildingPreview.getPosition();
            const cost = this.getBuildingCost(this.selectedBuildingType);

            this.deductBuildingCost(this.selectedBuildingType);

            const newBuilding = this.buildingManager.placeBuilding(this.selectedBuildingType, position.x, position.y);

            this.markBuildingCollisions(newBuilding);
            this.rebuildPathfindingGrid();

            this.buildingPreview.destroy();
            this.buildingPreview = null;
            this.selectedBuildingType = null;

            if (this.uiScene) {
                this.uiScene.defaultCursor.setVisible(true);
                this.uiScene.hoverCursor.setVisible(false);
                this.uiScene.grabCursor.setVisible(false);
                this.uiScene.grabbingCursor.setVisible(false);
            }

            console.log('Building placed and resources deducted:', cost);
        } else {
            console.log('Invalid building placement');
            this.buildingPreview.flashInvalid();

            window.dispatchEvent(
                new CustomEvent('game:notification', {
                    detail: {
                        type: 'error',
                        title: 'Placement invalide',
                        message: 'Impossible de placer le bâtiment à cet endroit',
                    },
                }),
            );
        }
    }

    private onBuildingDeselected(): void {
        if (this.buildingPreview) {
            this.buildingPreview.destroy();
            this.buildingPreview = null;
        }

        this.selectedBuildingType = null;

        if (this.uiScene) {
            this.uiScene.defaultCursor.setVisible(true);
            this.uiScene.hoverCursor.setVisible(false);
            this.uiScene.grabCursor.setVisible(false);
            this.uiScene.grabbingCursor.setVisible(false);
        }
    }

    private markBuildingCollisions(building: TiledBuilding) {
        const buildingMap = building.getMap();
        const offsetX = Math.floor(building.getPosition().x / this.tileWidth);
        const offsetY = Math.floor(building.getPosition().y / this.tileHeight);

        buildingMap.layers.forEach((layerData) => {
            const layer = buildingMap.getLayer(layerData.name);
            if (!layer) return;

            for (let ty = 0; ty < layer.tilemapLayer.layer.height; ty++) {
                for (let tx = 0; tx < layer.tilemapLayer.layer.width; tx++) {
                    const tile = layer.tilemapLayer.getTileAt(tx, ty);
                    if (!tile) continue;

                    const hasCollidesProp = !!(tile.properties && tile.properties.collides);
                    const tileData = tile.tileset.getTileData(tile.index);
                    const hasCollisionShapes =
                        tileData && tileData.objectgroup && tileData.objectgroup.objects && tileData.objectgroup.objects.length > 0;

                    if (hasCollidesProp || hasCollisionShapes) {
                        const gx = offsetX + tx;
                        const gy = offsetY + ty;

                        if (gy >= 0 && gy < this.baseGrid.length && gx >= 0 && gx < this.baseGrid[0].length) {
                            this.baseGrid[gy][gx] = 1;
                        }
                    }
                }
            }
        });
    }

    private checkPlacementValidity(worldPoint: Phaser.Math.Vector2): void {
        if (!this.buildingPreview || !this.map) return;

        const isValid = this.buildingPreview.checkPlacementValidity(this.map, this.mapLayers);
        this.buildingPreview.setValidPlacement(isValid);
    }

    private onBuildingSelected(buildingType: string): void {
        this.selectedBuildingType = buildingType;

        if (this.buildingPreview) {
            this.buildingPreview.destroy();
        }

        const templateKey = `${buildingType}-template`;
        this.buildingPreview = new TiledBuildingPreview(this, templateKey);

        const playerPosition = {
            x: this.player.x,
            y: this.player.y,
        };

        this.buildingPreview.setInitialPosition(playerPosition.x, playerPosition.y);

        this.checkPlacementValidity(playerPosition);

        //this.showFloatingMessage('Déplacez le bâtiment avec la souris, appuyez sur ENTRÉE pour confirmer ou ESC pour annuler');

        if (this.uiScene) {
            this.uiScene.defaultCursor.setVisible(false);
            this.uiScene.hoverCursor.setVisible(false);
            this.uiScene.grabCursor.setVisible(true);
            this.uiScene.grabbingCursor.setVisible(false);
        }
    }

    private placeBuilding(pointer: Phaser.Input.Pointer): void {
        if (!this.buildingPreview || !this.selectedBuildingType) return;

        if (this.buildingPreview.isValidPlacement()) {
            if (!this.canAffordBuilding(this.selectedBuildingType)) {
                console.log('Cannot afford building anymore');

                window.dispatchEvent(
                    new CustomEvent('game:notification', {
                        detail: {
                            type: 'error',
                            title: 'Ressources insuffisantes',
                            message: "Vous n'avez plus assez de ressources pour ce bâtiment",
                        },
                    }),
                );

                this.onBuildingDeselectedFromVue();
                window.dispatchEvent(new CustomEvent('game:buildingPlacementCancelled'));
                return;
            }

            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const snappedX = Math.floor(worldPoint.x / 16) * 16;
            const snappedY = Math.floor(worldPoint.y / 16) * 16;

            const cost = this.getBuildingCost(this.selectedBuildingType);

            this.deductBuildingCost(this.selectedBuildingType);

            const newBuilding = this.buildingManager.placeBuilding(this.selectedBuildingType, snappedX, snappedY);

            this.markBuildingCollisions(newBuilding);
            this.rebuildPathfindingGrid();

            window.dispatchEvent(
                new CustomEvent('game:buildingPlaced', {
                    detail: {
                        building: newBuilding,
                        type: this.selectedBuildingType,
                        cost: cost,
                        position: { x: snappedX, y: snappedY },
                    },
                }),
            );

            window.dispatchEvent(
                new CustomEvent('game:buildingPlacementComplete', {
                    detail: {
                        buildingType: this.selectedBuildingType,
                        resourcesDeducted: cost,
                    },
                }),
            );

            this.buildingPreview.destroy();
            this.buildingPreview = null;
            this.selectedBuildingType = null;

            if (this.uiScene) {
                this.uiScene.defaultCursor.setVisible(true);
            }

            console.log('Building placed and resources deducted:', cost);
        } else {
            console.log('Invalid building placement');

            if (this.buildingPreview) {
                this.buildingPreview.flashInvalid();
            }
        }
    }

    public forceSyncWithVue(): void {
        try {
            this.triggerInitialResourceSync();
        } catch (error) {
            console.error('Error forcing sync with Vue:', error);
        }
    }

    public getResourcesSnapshot(): Record<string, number> {
        try {
            const inventory = this.resourceManager.getGlobalInventory();
            const resources: Record<string, number> = {};

            inventory.getAllResources().forEach((amount, type) => {
                resources[type] = amount;
            });

            return resources;
        } catch (error) {
            console.error('Error getting resources snapshot:', error);
            return {};
        }
    }

    private canAffordBuilding(buildingType: string): boolean {
        const buildingRegistry = BuildingRegistry.getInstance();
        const cost = buildingRegistry.getBuildingCost(buildingType);
        return this.resourceManager.canAfford(cost);
    }

    private deductBuildingCost(buildingType: string): void {
        const buildingRegistry = BuildingRegistry.getInstance();
        const cost = buildingRegistry.getBuildingCost(buildingType);
        this.resourceManager.deductCost(cost, 'building_construction');
    }

    public deductCost(cost: Partial<Record<ResourceType, number>>, source?: string): boolean {
        return this.resourceManager.deductCost(cost, source || 'building_purchase');
    }

    private getBuildingCost(buildingType: string): Record<string, number> {
        return this.buildingRegistry.getBuildingCost(buildingType);
    }

    private findNearestWalkableTile(targetX: number, targetY: number): { x: number; y: number } | null {
        const maxSearchDistance = 5;

        for (let d = 1; d <= maxSearchDistance; d++) {
            for (let offsetY = -d; offsetY <= d; offsetY++) {
                for (let offsetX = -d; offsetX <= d; offsetX++) {
                    if (Math.abs(offsetX) === d || Math.abs(offsetY) === d) {
                        const checkX = targetX + offsetX;
                        const checkY = targetY + offsetY;

                        if (checkX >= 0 && checkX < this.map.width && checkY >= 0 && checkY < this.map.height) {
                            if (this.baseGrid[checkY][checkX] === 0) {
                                return { x: checkX, y: checkY };
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

    private addWood(amount: number): void {
        this.woodCount += amount;
        const newText = `Bois: ${this.woodCount}`;
        this.uiScene.woodText.setText(newText);

        if (this.woodCount >= this.targetWood && !this.hasShownCompletionDialog) {
            this.hasShownCompletionDialog = true;
            this.dialogService.showDialog({
                text: 'Excellent travail! Vous avez collecté suffisamment de bois.',
                duration: 3000,
            });
        }
    }

    private getTiledProperties(layerData: Phaser.Tilemaps.LayerData): Record<string, any> {
        const properties: Record<string, any> = {};
        if (layerData.properties && Array.isArray(layerData.properties)) {
            layerData.properties.forEach((prop) => {
                properties[prop.name] = prop.value;
            });
        }
        return properties;
    }

    getLayer(name: string): Phaser.Tilemaps.TilemapLayer | undefined {
        return this.mapLayers.get(name)?.layer;
    }

    destroy(): void {
        window.removeEventListener('game:confirmBuildingPlacement', this.onConfirmBuildingPlacement.bind(this));
        window.removeEventListener('game:cancelBuildingPlacement', this.onCancelBuildingPlacement.bind(this));

        this.animationRegistry.cleanupSceneAnimations(this);
        super.destroy();
    }

    update() {
        this.player.update();
        this.resourceEntityManager.updateEntities();
        this.buildingManager.updateBuildings(this.player);
        this.workerManager.update();

        // Supprimer les dots déjà franchis par le joueur
        if (this.pathDotsGroup && this.pathDotsGroup.getLength() > 0) {
            const playerTileX = Math.floor(this.player.x / this.tileWidth);
            const playerTileY = Math.floor(this.player.y / this.tileHeight);
            this.pathDotsGroup.getChildren().forEach((dot: any) => {
                if (dot.getData('tileX') === playerTileX && dot.getData('tileY') === playerTileY) {
                    dot.destroy();
                }
            });
        }

        if (process.env.NODE_ENV === 'development') {
            this.debugResourceSync();
        }
        if (this.buildingPreview) {
            const worldPoint = new Phaser.Math.Vector2(this.buildingPreview.getPosition().x, this.buildingPreview.getPosition().y);
            this.checkPlacementValidity(worldPoint);
        }
    }

    private debugResourceSync(): void {
        if (!this.lastSyncCheck) {
            this.lastSyncCheck = Date.now();
        }

        if (Date.now() - this.lastSyncCheck > 5000) {
            this.lastSyncCheck = Date.now();

            try {
                const totalResources = this.resourceManager.getGlobalInventory().getTotalItems();
                console.log('Current total resources:', totalResources);

                window.dispatchEvent(
                    new CustomEvent('game:resourceDebug', {
                        detail: {
                            totalResources,
                            snapshot: this.getResourcesSnapshot(),
                        },
                    }),
                );
            } catch (error) {
                console.error('Error in resource sync debug:', error);
            }
        }
    }

    private createTargetIndicator(path: { x: number; y: number }[]): void {
        if (!path || path.length === 0) {
            return;
        }
        if (this.targetIndicator) {
            this.targetIndicator.destroy();
        }
        if (this.targetIndicatorTween) {
            this.targetIndicatorTween.stop();
        }

        const lastTile = path[path.length - 1];
        const targetX = lastTile.x * this.tileWidth + this.tileWidth / 2;
        const targetY = lastTile.y * this.tileHeight; // top of the tile

        this.targetIndicator = this.add.image(targetX, targetY, 'target-indicator');
        this.targetIndicator.setDepth(9999);

        this.targetIndicatorTween = this.tweens.add({
            targets: this.targetIndicator,
            y: targetY - 8,
            duration: 400,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });
    }

    /**
     * Affiche des points "select_dots" espacés le long du chemin du pathfinder
     */
    private showPathDots(path: { x: number; y: number }[]): void {
        this.clearPathDots();
        if (!path || path.length === 0 || !this.pathDotsGroup) return;
        console.log('showPathDots called, path:', path);

        // Afficher les dots normaux sur les tuiles intermédiaires
        for (let i = 1; i < path.length - 1; i++) {
            const tile = path[i];
            const dotX = tile.x * this.tileWidth + this.tileWidth / 2;
            const dotY = tile.y * this.tileHeight + this.tileHeight / 2;
            const dot = this.add.image(dotX, dotY, 'select_dots');
            dot.setDepth(0); // Sous le joueur
            dot.setAlpha(1);
            dot.setScale(1);
            dot.setData('tileX', tile.x);
            dot.setData('tileY', tile.y);
            this.pathDotsGroup.add(dot);
            // Animation de pulsation
            this.tweens.add({
                targets: dot,
                scale: { from: 1, to: 1.4 },
                yoyo: true,
                repeat: -1,
                duration: 500,
                ease: 'Sine.easeInOut'
            });
        }

        // Afficher un dot large sur la destination (dernière tuile)
        if (path.length > 1) {
            const destinationTile = path[path.length - 1];
            const destX = destinationTile.x * this.tileWidth + this.tileWidth / 2;
            const destY = destinationTile.y * this.tileHeight + this.tileHeight / 2;
            const destDot = this.add.image(destX, destY, 'select_dots_large');
            destDot.setDepth(0); // Sous le joueur
            destDot.setAlpha(1);
            destDot.setScale(1);
            destDot.setData('tileX', destinationTile.x);
            destDot.setData('tileY', destinationTile.y);
            destDot.setData('isDestination', true);
            this.pathDotsGroup.add(destDot);
            // Animation de pulsation pour la destination
            this.tweens.add({
                targets: destDot,
                scale: { from: 1, to: 1.6 },
                yoyo: true,
                repeat: -1,
                duration: 600,
                ease: 'Sine.easeInOut'
            });
        }
    }

    /**
     * Supprime tous les points du chemin
     */
    private clearPathDots(): void {
        if (this.pathDotsGroup) {
            this.pathDotsGroup.clear(true, true);
        }
    }
}
