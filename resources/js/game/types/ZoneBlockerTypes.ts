export interface ZoneBlockerConfig {
    name: string;
    displayName: string;
    description?: string;
    unlocked: boolean;
    unlockRequirements?: {
        level?: number;
        resources?: Record<string, number>;
        buildings?: string[];
    };
}

export interface ZoneBlockerState {
    blockerName: string;
    unlocked: boolean;
    discovered: boolean;
}
