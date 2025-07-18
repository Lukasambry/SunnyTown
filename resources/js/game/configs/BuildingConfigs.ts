import { BuildingConfig, ResourceType, WorkerType } from '@/game/types';
import { BuildingType } from '../types/BuildingTypes';

export const BUILDING_CONFIGS: BuildingConfig[] = [
    {
        key: BuildingType.HOUSE,
        name: 'Maison',
        template: 'house-template',
        icon: 'house',
        cost: { [ResourceType.WOOD]: 10 },
        workerType: WorkerType.NEUTRAL,
        maxWorkers: 1,
        description: 'TestFromConfigs: Logement pour les ouvriers, améliore leur efficacité',
        storageCapacities: {
            [ResourceType.FOOD]: 5,
            [ResourceType.POPULATION]: 10
        }
    },
    {
        key: BuildingType.SAWMILL,
        name: 'Scierie',
        template: 'sawmill-template',
        icon: 'sawmill',
        cost: { [ResourceType.WOOD]: 10 },
        workerType: WorkerType.LUMBERJACK,
        maxWorkers: 3,
        description: 'TestFromConfigs: Traite le bois et stocke les ressources',
        storageCapacities: {
            [ResourceType.WOOD]: 10
        }
    },
    {
        key: BuildingType.FORGE,
        name: 'Forge',
        template: 'house-template',
        icon: 'forge',
        cost: {
            [ResourceType.WOOD]: 15,
            [ResourceType.STONE]: 10
        },
        workerType: WorkerType.MINER,
        maxWorkers: 2,
        description: 'TestFromConfigs: Extrait pierre et métaux du sous-sol',
        storageCapacities: {
            [ResourceType.STONE]: 5,
            [ResourceType.COAL_ORE]: 100,
            [ResourceType.METAL]: 100
        }
    },
    {
        key: BuildingType.FARM,
        name: 'Ferme',
        template: 'farm-template',
        icon: 'farm',
        cost: { [ResourceType.WOOD]: 12 },
        workerType: WorkerType.FARMER,
        maxWorkers: 2,
        description: 'TestFromConfigs: Produit de la nourriture pour les ouvriers',
        storageCapacities: {
            [ResourceType.FOOD]: 300,
            [ResourceType.WOOD]: 100
        }
    },
    {
        key: BuildingType.STORAGE,
        name: 'Entrepot',
        template: 'sawmill-template',
        icon: 'storage',
        cost: {
            [ResourceType.WOOD]: 12,
            [ResourceType.STONE]: 10
        },
        workerType: WorkerType.TRANSPORTER,
        maxWorkers: 2,
        description: 'TestFromConfigs: Permet de stocker les ressources',
        storageCapacities: {
            [ResourceType.WOOD]: 900,
            [ResourceType.FOOD]: 900,
            [ResourceType.STONE]: 900,
            [ResourceType.METAL]: 900
        }
    }
];
