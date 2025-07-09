import { Scene } from 'phaser';
import type { TiledBuilding } from '../objects/TiledBuilding';
import { CameraService } from './CameraService';
import { CameraMode } from '../types/CameraTypes';
import type { Position } from '../types';

interface BuildingCenterPoint {
    readonly x: number;
    readonly y: number;
    readonly type: string;
}

export class BuildingSelectionService {
    private readonly scene: Scene;
    private readonly cameraService: CameraService;

    private selectedBuilding: TiledBuilding | null = null;
    private lastCameraMode: CameraMode = CameraMode.FOLLOW_PLAYER;

    constructor(scene: Scene, cameraService: CameraService) {
        this.scene = scene;
        this.cameraService = cameraService;
        this.setupInputHandlers();
    }

    public selectBuilding(building: TiledBuilding): void {
        if (this.selectedBuilding === building) return;

        this.deselectCurrentBuilding();
        this.selectedBuilding = building;

        building.setSelected(true);
        this.lastCameraMode = this.cameraService.getCurrentMode();

        const centerPosition = this.getBuildingCenterPosition(building);
        this.cameraService.focusOnPosition(centerPosition, () => {
            this.showBuildingUI(building);
        });
    }

    public deselectBuilding(): void {
        this.deselectCurrentBuilding();
        this.restoreCameraMode();
    }

    public getSelectedBuilding(): TiledBuilding | null {
        return this.selectedBuilding;
    }

    private deselectCurrentBuilding(): void {
        if (this.selectedBuilding) {
            this.selectedBuilding.setSelected(false);
            this.hideBuildingUI();
            this.selectedBuilding = null;
        }
    }

    private restoreCameraMode(): void {
        switch (this.lastCameraMode) {
            case CameraMode.FOLLOW_PLAYER:
                this.cameraService.returnToPlayer();
                break;

            case CameraMode.FREE_CAMERA:
                this.cameraService.enableFreeCamera();
                break;
        }
    }

    private getBuildingCenterPosition(building: TiledBuilding): Position {
        const definedCenter = this.findDefinedCenterPoint(building);
        if (definedCenter) {
            const buildingPosition = building.getPosition();
            return {
                x: buildingPosition.x + definedCenter.x,
                y: buildingPosition.y + definedCenter.y
            };
        }

        return this.calculateAutomaticCenter(building);
    }

    private findDefinedCenterPoint(building: TiledBuilding): BuildingCenterPoint | null {
        const map = building.getMap();
        const pointsLayer = map.getObjectLayer('Points');

        if (!pointsLayer?.objects) return null;

        for (const obj of pointsLayer.objects) {
            if (this.isCenterPoint(obj)) {
                return {
                    x: obj.x || 0,
                    y: obj.y || 0,
                    type: this.getCenterPointType(obj)
                };
            }
        }

        return null;
    }

    private isCenterPoint(obj: any): boolean {
        if (!obj.properties || !Array.isArray(obj.properties)) return false;

        return obj.properties.some((prop: any) =>
            prop.name === 'type' &&
            (prop.value === 'center' || prop.value === 'building_center')
        );
    }

    private getCenterPointType(obj: any): string {
        if (!obj.properties || !Array.isArray(obj.properties)) return 'center';

        const typeProperty = obj.properties.find((prop: any) => prop.name === 'type');
        return typeProperty?.value || 'center';
    }

    private calculateAutomaticCenter(building: TiledBuilding): Position {
        const position = building.getPosition();
        const dimensions = building.getDimensions();

        return {
            x: position.x + (dimensions.tilesWidth * 16) / 2,
            y: position.y + (dimensions.tilesHeight * 16) / 2
        };
    }

    private showBuildingUI(building: TiledBuilding): void {
        window.dispatchEvent(new CustomEvent('game:buildingSelected', {
            detail: {
                building,
                buildingId: building.getBuildingId?.() || '',
                buildingType: building.getType(),
                buildingName: building.getBuildingName(),
                position: building.getPosition()
            }
        }));
    }

    private hideBuildingUI(): void {
        window.dispatchEvent(new CustomEvent('game:buildingDeselected'));
    }

    private setupInputHandlers(): void {
        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.handlePointerDown(pointer);
        });

        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            this.handlePointerMove(pointer);
        });
    }

    private handlePointerMove(pointer: Phaser.Input.Pointer): void {
        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const hoveredBuilding = this.getBuildingAt(worldPoint.x, worldPoint.y);

        const buildingManager = (this.scene as any).buildingManager;
        if (buildingManager && buildingManager.getBuildings) {
            const allBuildings = buildingManager.getBuildings();

            allBuildings.forEach((building: TiledBuilding) => {
                if (building === hoveredBuilding && !building.getIsSelected()) {
                    building.setHovered(true);
                } else if (building !== hoveredBuilding && !building.getIsSelected()) {
                    building.setHovered(false);
                }
            });
        }
    }

    private handlePointerDown(pointer: Phaser.Input.Pointer): void {
        if (pointer.rightButtonDown()) return;

        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const clickedBuilding = this.getBuildingAt(worldPoint.x, worldPoint.y);

        if (clickedBuilding) {
            this.selectBuilding(clickedBuilding);
        } else {
            this.handleClickOutside();
        }
    }

    private getBuildingAt(x: number, y: number): TiledBuilding | null {
        const buildingManager = (this.scene as any).buildingManager;
        if (!buildingManager || typeof buildingManager.getBuildingAt !== 'function') {
            return null;
        }

        return buildingManager.getBuildingAt(x, y);
    }

    private handleClickOutside(): void {
        if (this.selectedBuilding) {
            this.deselectBuilding();
        }
    }
}
