export interface PlayerLevelData {
    level: number;
    currentExperience: number;
    nextLevelExperience: number;
    health: {
        current: number;
        max: number;
    };
    gold: number;
}

export interface ExperienceGainEvent {
    amount: number;
    source: string;
    resourceType?: string;
    multiplier?: number;
}
