export enum CameraMode {
    FOLLOW_PLAYER = 'follow_player',
    FREE_CAMERA = 'free_camera',
    FOCUSED_BUILDING = 'focused_building'
}

export interface CameraConfig {
    readonly transitionDuration: number;
    readonly zoomLevel: number;
    readonly smoothingFactor: number;
}

export interface CameraTransition {
    readonly targetX: number;
    readonly targetY: number;
    readonly duration: number;
    readonly ease?: string;
    readonly onComplete?: () => void;
}