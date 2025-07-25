import { ResourceType } from './ResourceSystemTypes';

export enum WorkerType {
    NEUTRAL = 'neutral',
    LUMBERJACK = 'lumberjack',
    MINER = 'miner',
    FARMER = 'farmer',
    TRANSPORTER = 'transporter'
}

export enum WorkerState {
    IDLE = 'idle',
    MOVING_TO_HARVEST = 'moving_to_harvest',
    HARVESTING = 'harvesting',
    MOVING_TO_DEPOSIT = 'moving_to_deposit',
    DEPOSITING = 'depositing',
    WAITING = 'waiting'
}

export enum WorkerActionType {
    HARVEST_RESOURCE_ENTITY = 'harvest_resource_entity',
    HARVEST_BUILDING = 'harvest_building',
    DEPOSIT_TO_BUILDING = 'deposit_to_building'
}

export interface WorkerAnimationItemConfig {
    img?: string | ((data?: any) => string | null);
    posX?: number;
    posY?: number;
    scale?: number;
    alpha?: number;
    rotation?: number;
    visible?: boolean;
    depth?: number;
}

export interface WorkerAnimationWithItem {
    type: string;
    item?: WorkerAnimationItemConfig;
}

export interface WorkerAnimationConfig {
    idle: WorkerAnimationWithItem;
    walking: WorkerAnimationWithItem;
    working: WorkerAnimationWithItem;
    carrying: WorkerAnimationWithItem;
    depositing: WorkerAnimationWithItem;
}

export interface WorkerTargetConfig {
    actionType: WorkerActionType;
    targetTypes: string[];
    resourceTypes: ResourceType[];
    priority: number;
}

export interface WorkerPosition {
    readonly x: number;
    readonly y: number;
}

export interface WorkerStats {
    totalHarvested: Record<ResourceType, number>;
    totalDeposited: Record<ResourceType, number>;
    workingTime: number;
    idleTime: number;
    created: number;
}

// Interface uniforme pour la configuration des workers
export interface WorkerConfig {
    id: WorkerType;
    name: string;
    description: string;
    texture: string;

    carryCapacity: number;
    harvestSpeed: number;
    moveSpeed: number;
    workRadius: number;

    harvestTargets: WorkerTargetConfig[];
    depositTargets: WorkerTargetConfig[];

    animations: WorkerAnimationConfig;

    tint?: number;
    scale?: number;
}