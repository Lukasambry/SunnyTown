import type { ResourceType } from './ResourceSystemTypes';

export interface BuildingCost {
    readonly [resourceType: string]: number;
}

export interface BuildingConfig {
    key: string;
    name: string;
    template: string;
    icon: string;
    cost: BuildingCost;
    workerType: string;
    description?: string;
    maxWorkers: number;
    storageCapacities?: BuildingStorageCapacity;
}

export enum BuildingType {
    HOUSE = 'house',
    SAWMILL = 'sawmill',
    FORGE = 'forge',
    FARM = 'farm',
    STORAGE = 'storage'
}

export interface BuildingDimensions {
    readonly tilesWidth: number;
    readonly tilesHeight: number;
}

export interface BuildingPosition {
    readonly x: number;
    readonly y: number;
}

export type BuildingStorageCapacity = {
    readonly [key in ResourceType]?: number;
};

// Utilitaires
export const calculateBuildingCost = (config: BuildingConfig): number => {
    return Object.values(config.cost).reduce((total, cost) => total + cost, 0);
};

export const canAffordBuilding = (config: BuildingConfig, resources: Record<string, number>): boolean => {
    return Object.entries(config.cost).every(([resource, cost]) =>
        (resources[resource] || 0) >= cost
    );
};
