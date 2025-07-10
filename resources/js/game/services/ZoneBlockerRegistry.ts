import type { ZoneBlockerConfig } from '../types/ZoneBlockerTypes';

export class ZoneBlockerRegistry {
    private static instance: ZoneBlockerRegistry;
    private blockers = new Map<string, ZoneBlockerConfig>();

    private constructor() {
        this.initializeDefaultBlockers();
    }

    public static getInstance(): ZoneBlockerRegistry {
        if (!ZoneBlockerRegistry.instance) {
            ZoneBlockerRegistry.instance = new ZoneBlockerRegistry();
        }
        return ZoneBlockerRegistry.instance;
    }

    public registerBlocker(config: ZoneBlockerConfig): void {
        this.blockers.set(config.name, config);
    }

    public getBlocker(name: string): ZoneBlockerConfig | undefined {
        return this.blockers.get(name);
    }

    public getAllBlockers(): ZoneBlockerConfig[] {
        return Array.from(this.blockers.values());
    }

    public getUnlockedBlockers(): ZoneBlockerConfig[] {
        return this.getAllBlockers().filter(blocker => blocker.unlocked);
    }

    private initializeDefaultBlockers(): void {
        console.log('ZoneBlockerRegistry initialized - blockers will be loaded from Tiled properties');
    }
}
