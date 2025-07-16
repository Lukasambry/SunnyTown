export enum AnimationType {
    // Player
    PLAYER_IDLE = 'player-idle',
    PLAYER_WALK = 'player-walk',
    PLAYER_CHOP = 'player-chop',

    // Worker
    WORKER_IDLE = 'worker-idle',
    WORKER_WALK = 'worker-walk',
    WORKER_CHOP = 'worker-chop',
    WORKER_MINING = 'worker-mining',
    WORKER_CARRY = 'worker-carry',

    // Tree
    TREE_IDLE = 'tree-idle',
    TREE_HIT = 'tree-hit',
    TREE_DESTROY = 'tree-destroy',
    LEAVES_FALL = 'leaves-fall',

    // Coal Vein
    COAL_VEIN_IDLE = 'coal-vein-idle',
}

export interface AnimationConfig {
    readonly key: AnimationType;
    readonly texture: string;
    readonly frames: {
        readonly start: number;
        readonly end: number;
    };
    readonly frameRate: number;
    readonly repeat: number;
    readonly description?: string;
}

export interface AnimationFrameConfig {
    readonly hitFrame?: number;
    readonly onHitFrame?: () => void;
    readonly onComplete?: () => void;
}
