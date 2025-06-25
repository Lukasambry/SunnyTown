import { BuildingConfig, ResourceType, WorkerType } from '@/game/types';

export const BUILDING_CONFIGS: BuildingConfig[] = [
    {
        key: 'house',
        name: 'Maison',
        template: 'house-template',
        icon: 'house',
        cost: { [ResourceType.WOOD]: 10 },
        workerType: WorkerType.NEUTRAL,
        description: 'Logement pour les ouvriers, améliore leur efficacité'
    },
    {
        key: 'sawmill',
        name: 'Scierie',
        template: 'sawmill-template',
        icon: 'sawmill',
        cost: { [ResourceType.WOOD]: 10 },
        workerType: WorkerType.LUMBERJACK,
        description: 'Traite le bois et stocke les ressources'
    },
    {
        key: 'mine',
        name: 'Mine',
        template: 'mine-template',
        icon: 'mine',
        cost: {
            [ResourceType.WOOD]: 15,
            [ResourceType.STONE]: 10
        },
        workerType: WorkerType.MINER,
        description: 'Extrait pierre et métaux du sous-sol'
    },
    {
        key: 'farm',
        name: 'Ferme',
        template: 'farm-template',
        icon: 'farm',
        cost: { [ResourceType.WOOD]: 12 },
        workerType: WorkerType.FARMER,
        description: 'Produit de la nourriture pour les ouvriers'
    }
];
