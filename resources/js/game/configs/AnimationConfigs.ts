import { AnimationConfig, AnimationType } from '@/game/types/AnimationTypes';

export const ANIMATION_CONFIGS: AnimationConfig[] = [
    {
        key: AnimationType.PLAYER_IDLE,
        texture: 'player-idle',
        frames: { start: 0, end: 8 },
        frameRate: 8,
        repeat: -1,
        description: 'Player idle animation'
    },
    {
        key: AnimationType.PLAYER_WALK,
        texture: 'player-walk',
        frames: { start: 0, end: 7 },
        frameRate: 12,
        repeat: -1,
        description: 'Player walking animation'
    },
    {
        key: AnimationType.PLAYER_CHOP,
        texture: 'player-chop',
        frames: { start: 0, end: 7 },
        frameRate: 16,
        repeat: 0,
        description: 'Player chopping animation'
    },






    // Worker animations
    {
        key: AnimationType.WORKER_IDLE,
        texture: 'worker-idle',
        frames: { start: 0, end: 8 },
        frameRate: 10,
        repeat: -1,
        description: 'Worker idle animation'
    },
    {
        key: AnimationType.WORKER_WALK,
        texture: 'worker-walk',
        frames: { start: 0, end: 7 },
        frameRate: 12,
        repeat: -1,
        description: 'Worker walking animation'
    },
    {
        key: AnimationType.WORKER_CHOP,
        texture: 'worker-chop',
        frames: { start: 0, end: 9 },
        frameRate: 16,
        repeat: 0,
        description: 'Worker chopping animation'
    },
    {
        key: AnimationType.WORKER_MINING,
        texture: 'worker-mining',
        frames: { start: 0, end: 9 },
        frameRate: 16,
        repeat: 0,
        description: 'Worker mining animation'
    },
    {
        key: AnimationType.WORKER_CARRY,
        texture: 'worker-carry',
        frames: { start: 0, end: 7 },
        frameRate: 12,
        repeat: -1,
        description: 'Worker carrying animation'
    },
    {
        key: AnimationType.WORKER_DOING,
        texture: 'worker-doing',
        frames: { start: 0, end: 7 },
        frameRate: 12,
        repeat: 0,
        description: 'Worker doing animation'
    },

    // Tree animations
    {
        key: AnimationType.TREE_IDLE,
        texture: 'tree',
        frames: { start: 1, end: 4 },
        frameRate: 6,
        repeat: -1,
        description: 'Tree idle swaying animation'
    },
    {
        key: AnimationType.TREE_HIT,
        texture: 'tree',
        frames: { start: 1, end: 4 },
        frameRate: 10,
        repeat: 0,
        description: 'Tree being hit animation'
    },
    {
        key: AnimationType.TREE_DESTROY,
        texture: 'tree',
        frames: { start: 5, end: 5 },
        frameRate: 10,
        repeat: 0,
        description: 'Tree destruction animation'
    },

    // Coal animations
    {
        key: AnimationType.COAL_VEIN_IDLE,
        texture: 'coal_vein',
        frames: { start: 1, end: 1 },
        frameRate: 6,
        repeat: -1,
        description: 'Coal vien idle swaying animation'
    },

    // Effects animations
    {
        key: AnimationType.LEAVES_FALL,
        texture: 'leaves-hit',
        frames: { start: 0, end: 9 },
        frameRate: 12,
        repeat: 0,
        description: 'Falling leaves effect animation'
    }
]
