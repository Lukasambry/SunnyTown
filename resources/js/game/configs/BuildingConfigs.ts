import { BuildingConfig, ResourceType, WorkerType } from '@/game/types';

export const BUILDING_CONFIGS: BuildingConfig[] = [
    {
        key: 'house',
        name: 'Maison',
        template: 'house-template',
        icon: 'house',
        cost: { [ResourceType.WOOD]: 10 },
        workerType: WorkerType.NEUTRAL,
        maxWorkers: 1,
        description: 'TestFromConfigs: Logement pour les ouvriers, améliore leur efficacité',
        storageCapacities: {
            [ResourceType.FOOD]: 200,
            [ResourceType.POPULATION]: 10
        }
    },
    {
        key: 'sawmill',
        name: 'Scierie',
        template: 'sawmill-template',
        icon: 'sawmill',
        cost: { [ResourceType.WOOD]: 10 },
        workerType: WorkerType.LUMBERJACK,
        maxWorkers: 3,
        description: 'TestFromConfigs: Traite le bois et stocke les ressources',
        storageCapacities: {
            [ResourceType.WOOD]: 300
        }
    },
    {
        key: 'forge',
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
            [ResourceType.METAL]: 100
        }
    },
    {
        key: 'farm',
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
    }
];
