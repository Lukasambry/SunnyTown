import { Scene } from 'phaser';
import { CameraMode, type CameraConfig, type CameraTransition } from '../types/CameraTypes';
import type { Position } from '../types';

export class CameraService {
    private readonly scene: Scene;
    private readonly camera: Phaser.Cameras.Scene2D.Camera;
    private readonly config: CameraConfig;
    
    private currentMode: CameraMode = CameraMode.FOLLOW_PLAYER;
    private player: Phaser.GameObjects.GameObject | null = null;
    private currentTransition: Phaser.Tweens.Tween | null = null;

    constructor(scene: Scene) {
        this.scene = scene;
        this.camera = scene.cameras.main;
        this.config = {
            transitionDuration: 300,
            zoomLevel: 1,
            smoothingFactor: 0.1
        };
    }

    public setPlayer(player: Phaser.GameObjects.GameObject): void {
        this.player = player;
        if (this.currentMode === CameraMode.FOLLOW_PLAYER) {
            this.camera.startFollow(player);
        }
    }

    public setMode(mode: CameraMode): void {
        if (this.currentMode === mode) return;

        const previousMode = this.currentMode;
        this.currentMode = mode;

        this.handleModeTransition(previousMode, mode);
    }

    public getCurrentMode(): CameraMode {
        return this.currentMode;
    }

    public focusOnPosition(position: Position, onComplete?: () => void): void {
        this.stopCurrentTransition();
        
        if (this.currentMode === CameraMode.FOLLOW_PLAYER) {
            this.camera.stopFollow();
        }

        this.setMode(CameraMode.FOCUSED_BUILDING);

        this.currentTransition = this.scene.tweens.add({
            targets: this.camera,
            scrollX: position.x - this.camera.width / 2,
            scrollY: position.y - this.camera.height / 2,
            duration: this.config.transitionDuration,
            ease: 'Power3.easeOut',
            onComplete: () => {
                this.currentTransition = null;
                onComplete?.();
            }
        });
    }

    public focusOnBuilding(building: { getPosition(): Position; getDimensions(): { tilesWidth: number; tilesHeight: number } }): void {
        const centerPosition = this.calculateBuildingCenter(building);
        this.focusOnPosition(centerPosition);
    }

    public returnToPlayer(): void {
        if (!this.player) return;
        
        this.setMode(CameraMode.FOLLOW_PLAYER);
    }

    public enableFreeCamera(): void {
        this.setMode(CameraMode.FREE_CAMERA);
    }

    private handleModeTransition(from: CameraMode, to: CameraMode): void {
        this.stopCurrentTransition();

        switch (to) {
            case CameraMode.FOLLOW_PLAYER:
                if (this.player) {
                    this.camera.startFollow(this.player);
                }
                break;
            
            case CameraMode.FREE_CAMERA:
                this.camera.stopFollow();
                break;
            
            case CameraMode.FOCUSED_BUILDING:
                this.camera.stopFollow();
                break;
        }
    }

    private calculateBuildingCenter(building: { getPosition(): Position; getDimensions(): { tilesWidth: number; tilesHeight: number } }): Position {
        const position = building.getPosition();
        const dimensions = building.getDimensions();
        
        return {
            x: position.x + (dimensions.tilesWidth * 16) / 2,
            y: position.y + (dimensions.tilesHeight * 16) / 2
        };
    }

    private stopCurrentTransition(): void {
        if (this.currentTransition) {
            this.currentTransition.stop();
            this.currentTransition = null;
        }
    }
}