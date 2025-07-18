import { WorkerType, WorkerActionType, type WorkerConfig } from '../types/WorkerConfigTypes';
import { ResourceType } from '../types/ResourceSystemTypes';
import { BuildingType } from '../types/BuildingTypes';
import { ResourceEntityType } from '../types/ResourceEntityTypes';
import { AnimationType } from '../services';

export const WORKER_CONFIGS: Record<WorkerType, WorkerConfig> = {
    [WorkerType.LUMBERJACK]: {
        id: WorkerType.LUMBERJACK,
        name: 'Bûcheron',
        description: 'Coupe les arbres et récolte le bois',
        texture: AnimationType.WORKER_IDLE,

        carryCapacity: 10,
        harvestSpeed: 3000,
        moveSpeed: 30,
        workRadius: 500,

        harvestTargets: [{
            actionType: WorkerActionType.HARVEST_RESOURCE_ENTITY,
            targetTypes: [ResourceEntityType.TREE],
            resourceTypes: [ResourceType.WOOD],
            priority: 1
        }],

        depositTargets: [{
            actionType: WorkerActionType.DEPOSIT_TO_BUILDING,
            targetTypes: [BuildingType.SAWMILL],
            resourceTypes: [ResourceType.WOOD],
            priority: 1
        }],

        animations: {
            idle: { type: AnimationType.WORKER_IDLE },
            walking: { type: AnimationType.WORKER_WALK },
            working: { type: AnimationType.WORKER_CHOP },
            carrying: { type: AnimationType.WORKER_WALK },
            depositing: { type: AnimationType.WORKER_DOING }
        },

        //tint: 0xdd9955,
        scale: 1.0
    },

    [WorkerType.MINER]: {
        id: WorkerType.MINER,
        name: 'Mineur',
        description: 'Extrait la pierre et les minerais',
        texture: AnimationType.WORKER_IDLE,

        carryCapacity: 8,
        harvestSpeed: 4000,
        moveSpeed: 65,
        workRadius: 400,

        harvestTargets: [{
            actionType: WorkerActionType.HARVEST_RESOURCE_ENTITY,
            targetTypes: [ResourceEntityType.ROCK, ResourceEntityType.COAL_VEIN],
            resourceTypes: [ResourceType.STONE, ResourceType.COAL_ORE],
            priority: 1
        }],
        depositTargets: [{
            actionType: WorkerActionType.DEPOSIT_TO_BUILDING,
            targetTypes: [BuildingType.FORGE],
            resourceTypes: [ResourceType.STONE, ResourceType.COAL_ORE],
            priority: 1
        }],

        animations: {
            idle: { type: AnimationType.WORKER_IDLE },
            walking: { type: AnimationType.WORKER_WALK },
            working: { type: AnimationType.WORKER_MINING },
            carrying: { type: AnimationType.WORKER_WALK },
            depositing: { type: AnimationType.WORKER_DOING }
        },

        //tint: 0x8b7355,
        scale: 1.0
    },

    [WorkerType.FARMER]: {
        id: WorkerType.FARMER,
        name: 'Fermier',
        description: 'Cultive et récolte la nourriture',
        texture: AnimationType.WORKER_IDLE,

        carryCapacity: 12,
        harvestSpeed: 2500,
        moveSpeed: 75,
        workRadius: 450,

        harvestTargets: [{
            actionType: WorkerActionType.HARVEST_RESOURCE_ENTITY,
            targetTypes: [ResourceEntityType.BERRY_BUSH],
            resourceTypes: [ResourceType.FOOD],
            priority: 1
        }],

        depositTargets: [{
            actionType: WorkerActionType.DEPOSIT_TO_BUILDING,
            targetTypes: [BuildingType.FARM],
            resourceTypes: [ResourceType.FOOD],
            priority: 1
        }, {
            actionType: WorkerActionType.DEPOSIT_TO_BUILDING,
            targetTypes: [BuildingType.HOUSE],
            resourceTypes: [ResourceType.FOOD],
            priority: 2
        }],

        animations: {
            idle: { type: AnimationType.WORKER_IDLE },
            walking: { type: AnimationType.WORKER_WALK },
            working: { type: AnimationType.WORKER_DOING },
            carrying: { type: AnimationType.WORKER_WALK },
            depositing: { type: AnimationType.WORKER_DOING }
        },

        //tint: 0x228b22,
        scale: 1.0
    },

    [WorkerType.TRANSPORTER]: {
        id: WorkerType.TRANSPORTER,
        name: 'Transporteur',
        description: 'Transporte les ressources entre bâtiments',
        texture: AnimationType.WORKER_IDLE,

        carryCapacity: 15,
        harvestSpeed: 1000,
        moveSpeed: 80,
        workRadius: 800,

        harvestTargets: [{
            actionType: WorkerActionType.HARVEST_BUILDING,
            targetTypes: [BuildingType.SAWMILL, BuildingType.FORGE],
            resourceTypes: Object.values(ResourceType),
            priority: 1
        }],

        depositTargets: [{
            actionType: WorkerActionType.DEPOSIT_TO_BUILDING,
            targetTypes: [BuildingType.STORAGE],
            resourceTypes: Object.values(ResourceType),
            priority: 1
        }],

        animations: {
            idle: { type: AnimationType.WORKER_IDLE },
            walking: { type: AnimationType.WORKER_CARRY },
            working: { type: AnimationType.WORKER_DOING },
            carrying: { type: AnimationType.WORKER_CARRY,
                item: {
                    img: (resource) => `resource_${resource?.type || 'unknown'}`,
                    posY: -16,
                    posX: 2,
                    depth: 1
                }
            },
            depositing: { type: AnimationType.WORKER_DOING }
        },

        //tint: 0x3498db,
        scale: 1.0
    },
    [WorkerType.NEUTRAL]: {
        id: WorkerType.NEUTRAL,
        name: 'Ouvrier',
        description: 'Ouvrier neutre, peut être assigné à n\'importe quel métier.',
        texture: AnimationType.WORKER_IDLE,
        carryCapacity: 0,
        harvestSpeed: 0,
        moveSpeed: 60,
        workRadius: 300,
        harvestTargets: [],
        depositTargets: [],
        animations: {
            idle: { type: AnimationType.WORKER_IDLE },
            walking: { type: AnimationType.WORKER_WALK },
            working: { type: AnimationType.WORKER_DOING },
            carrying: { type: AnimationType.WORKER_CARRY },
            depositing: { type: AnimationType.WORKER_DOING }
        },

        //tint: 0xaaaaaa,
        scale: 1.0
    }
};
