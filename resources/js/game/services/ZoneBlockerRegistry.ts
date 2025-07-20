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

    // NOUVEAU: Marquer une zone comme débloquée
    public unlockBlocker(blockerName: string): boolean {
        const blocker = this.blockers.get(blockerName);
        if (!blocker) {
            console.warn(`ZoneBlockerRegistry: Blocker ${blockerName} not found`);
            return false;
        }

        if (blocker.unlocked) {
            console.log(`ZoneBlockerRegistry: Blocker ${blockerName} already unlocked`);
            return false;
        }

        blocker.unlocked = true;
        console.log(`ZoneBlockerRegistry: Blocker ${blockerName} marked as unlocked`);
        return true;
    }

    // NOUVEAU: Vérifier si une zone est débloquée
    public isBlockerUnlocked(blockerName: string): boolean {
        const blocker = this.blockers.get(blockerName);
        return blocker ? blocker.unlocked : false;
    }

    // NOUVEAU: Réinitialiser toutes les zones (pour nouvelle partie)
    public resetAllBlockers(): void {
        this.blockers.forEach(blocker => {
            blocker.unlocked = false;
        });
        console.log('ZoneBlockerRegistry: All blockers reset to locked state');
    }

    private initializeDefaultBlockers(): void {
        console.log('ZoneBlockerRegistry initialized - blockers will be loaded from Tiled properties');
    }
}
