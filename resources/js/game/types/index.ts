export * from './ResourceEntityTypes';
export * from './ResourceSystemTypes';

export {
    type BuildingConfig,
    type BuildingCost,
    type BuildingDimensions,
    type BuildingPosition,
    type BuildingStorageCapacity,
    calculateBuildingCost,
    canAffordBuilding
} from './BuildingTypes';

export * from './WorkerTypes';
export * from './CameraTypes';

export interface Position {
    readonly x: number;
    readonly y: number;
}

export * from './ZoneBlockerTypes';
