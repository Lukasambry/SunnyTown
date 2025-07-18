import { ResourceType } from '@/game//types/ResourceSystemTypes';
import { BUILDING_CONFIGS } from '@/game/configs/BuildingConfigs';
import type { BuildingConfig } from '@/game/types/BuildingTypes';
import { ResourceManager } from './ResourceManager';

export class BuildingRegistry {
    private static instance: BuildingRegistry;
    private readonly buildings = new Map<string, BuildingConfig>();

    private constructor() {
        this.initializeBuildings();
    }

    public static getInstance(): BuildingRegistry {
        if (!BuildingRegistry.instance) {
            BuildingRegistry.instance = new BuildingRegistry();
        }
        return BuildingRegistry.instance;
    }

    private initializeBuildings(): void {
        BUILDING_CONFIGS.forEach((config) => {
            this.buildings.set(config.key, config);
        });
    }

    public getBuildingConfig(buildingType: string): BuildingConfig | undefined {
        return BUILDING_CONFIGS.find((config) => config.key === buildingType);
    }

    public getBuilding(key: string): BuildingConfig | undefined {
        return this.buildings.get(key);
    }

    public getAllBuildings(): readonly BuildingConfig[] {
        return Array.from(this.buildings.values());
    }

    public getBuildingCost(key: string): Partial<Record<ResourceType, number>> {
        const building = this.buildings.get(key);
        return building?.cost || {};
    }

    public getBuildingName(key: string): string {
        const building = this.buildings.get(key);
        return building?.name || key;
    }

    public getBuildingDescription(key: string): string {
        const building = this.buildings.get(key);
        return building?.description || key;
    }

    public isValidBuilding(key: string): boolean {
        return this.buildings.has(key);
    }

    public canAffordBuilding(buildingKey: string): boolean {
        try {
            const cost = this.getBuildingCost(buildingKey);
            const resourceManager = ResourceManager.getInstance();
            return resourceManager.canAfford(cost);
        } catch (error) {
            console.error(`Error checking affordability for ${buildingKey}:`, error);
            return false;
        }
    }

    public deductBuildingCost(buildingKey: string, source: string = 'building_construction'): boolean {
        try {
            const cost = this.getBuildingCost(buildingKey);
            const resourceManager = ResourceManager.getInstance();
            return resourceManager.deductCost(cost, source);
        } catch (error) {
            console.error(`Error deducting cost for ${buildingKey}:`, error);
            return false;
        }
    }

    public canAffordBuildingWithResources(buildingKey: string, availableResources: Map<ResourceType, number>): boolean {
        const cost = this.getBuildingCost(buildingKey);

        return Object.entries(cost).every(([resource, amount]) => {
            const available = availableResources.get(resource as ResourceType) || 0;
            return available >= (amount || 0);
        });
    }

    public getFormattedCost(buildingKey: string): Array<{ type: ResourceType; amount: number; name: string }> {
        const cost = this.getBuildingCost(buildingKey);
        const resourceManager = ResourceManager.getInstance();

        return Object.entries(cost).map(([type, amount]) => ({
            type: type as ResourceType,
            amount: amount || 0,
            name: resourceManager.getName(type as ResourceType),
        }));
    }

    public getAffordabilityDetails(buildingKey: string): {
        canAfford: boolean;
        missing: Array<{ type: ResourceType; required: number; available: number; missing: number }>;
    } {
        const cost = this.getBuildingCost(buildingKey);
        const resourceManager = ResourceManager.getInstance();
        const missing: Array<{ type: ResourceType; required: number; available: number; missing: number }> = [];
        let canAfford = true;

        Object.entries(cost).forEach(([type, required]) => {
            const available = resourceManager.getResource(type as ResourceType);
            const requiredAmount = required || 0;

            if (available < requiredAmount) {
                canAfford = false;
                missing.push({
                    type: type as ResourceType,
                    required: requiredAmount,
                    available,
                    missing: requiredAmount - available,
                });
            }
        });

        return { canAfford, missing };
    }
}
