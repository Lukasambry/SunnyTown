import Phaser from 'phaser';

import { ANIMATION_CONFIGS } from '@/game/configs/AnimationConfigs';
import { AnimationType, AnimationConfig, AnimationFrameConfig } from '@/game/types/AnimationTypes';

export interface AnimationState {
    readonly config: AnimationConfig;
    readonly isRegistered: boolean;
    readonly usageCount: number;
}

export class AnimationRegistry {
    private static instance: AnimationRegistry;
    private readonly animations = new Map<AnimationType, AnimationConfig>();
    private readonly registrationState = new Map<AnimationType, AnimationState>();
    private readonly sceneAnimations = new Map<Phaser.Scene, Set<AnimationType>>();

    private constructor() {
        this.initializeAnimations();
    }

    public static getInstance(): AnimationRegistry {
        if (!AnimationRegistry.instance) {
            AnimationRegistry.instance = new AnimationRegistry();
        }
        return AnimationRegistry.instance;
    }

    private initializeAnimations(): void {
        ANIMATION_CONFIGS.forEach((config) => {
            this.animations.set(config.key, config);
            this.registrationState.set(config.key, {
                config,
                isRegistered: false,
                usageCount: 0,
            });
        });
    }

    public registerAnimationsForScene(scene: Phaser.Scene, animationTypes?: AnimationType[]): void {
        const typesToRegister = animationTypes || Array.from(this.animations.keys());

        if (!this.sceneAnimations.has(scene)) {
            this.sceneAnimations.set(scene, new Set());
        }

        const sceneAnimations = this.sceneAnimations.get(scene)!;

        typesToRegister.forEach((type) => {
            const config = this.animations.get(type);

            if (!config) {
                console.warn(`Animation ${type} not found in registry`);
                return;
            }

            if (!scene.anims.exists(type)) {
                try {
                    scene.anims.create({
                        key: type,
                        frames: scene.anims.generateFrameNumbers(config.texture, config.frames),
                        frameRate: config.frameRate,
                        repeat: config.repeat,
                    });

                    sceneAnimations.add(type);

                    const state = this.registrationState.get(type)!;
                    this.registrationState.set(type, {
                        ...state,
                        isRegistered: true,
                        usageCount: state.usageCount + 1,
                    });

                    // console.log(`Animation ${type} registered for scene`);
                } catch (error) {
                    console.error(`Failed to register animation ${type}:`, error);
                }
            }
        });
    }

    public getAnimationConfig(type: AnimationType): AnimationConfig | undefined {
        return this.animations.get(type);
    }

    public getAvailableAnimations(): readonly AnimationType[] {
        return Array.from(this.animations.keys());
    }

    public isAnimationRegistered(scene: Phaser.Scene, type: AnimationType): boolean {
        return scene.anims.exists(type);
    }

    public playAnimation(sprite: Phaser.GameObjects.Sprite, type: AnimationType, options: AnimationFrameConfig = {}): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!sprite.scene.anims.exists(type)) {
                console.error(`Animation ${type} not registered in scene`);
                reject(new Error(`Animation ${type} not found`));
                return;
            }

            const config = this.animations.get(type);
            if (!config) {
                reject(new Error(`Animation configuration for ${type} not found`));
                return;
            }

            if (options.hitFrame !== undefined && options.onHitFrame) {
                const handleFrameUpdate = (anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
                    if (frame.index === options.hitFrame && options.onHitFrame) {
                        options.onHitFrame();
                    }
                };

                sprite.on('animationupdate', handleFrameUpdate);

                sprite.once('animationcomplete', () => {
                    sprite.off('animationupdate', handleFrameUpdate);
                });
            }

            const handleComplete = () => {
                if (options.onComplete) {
                    options.onComplete();
                }
                resolve();
            };

            if (config.repeat === 0) {
                sprite.once('animationcomplete', handleComplete);
            } else {
                resolve();
            }

            sprite.play(type, true);
        });
    }

    public stopAnimation(sprite: Phaser.GameObjects.Sprite, fallbackType?: AnimationType): void {
        sprite.anims.stop();

        if (fallbackType && sprite.scene.anims.exists(fallbackType)) {
            sprite.play(fallbackType, true);
        }
    }

    public getAnimationStats(): {
        readonly totalAnimations: number;
        readonly registeredAnimations: number;
        readonly animationsByTexture: Record<string, number>;
        readonly usageStats: Array<{ type: AnimationType; usageCount: number }>;
    } {
        const animationsByTexture: Record<string, number> = {};
        const usageStats: Array<{ type: AnimationType; usageCount: number }> = [];

        let registeredCount = 0;

        for (const [type, state] of this.registrationState) {
            if (state.isRegistered) {
                registeredCount++;
            }

            const texture = state.config.texture;
            animationsByTexture[texture] = (animationsByTexture[texture] || 0) + 1;

            usageStats.push({
                type,
                usageCount: state.usageCount,
            });
        }

        return {
            totalAnimations: this.animations.size,
            registeredAnimations: registeredCount,
            animationsByTexture,
            usageStats: usageStats.sort((a, b) => b.usageCount - a.usageCount),
        };
    }

    public validateTextures(scene: Phaser.Scene): {
        readonly isValid: boolean;
        readonly missingTextures: string[];
    } {
        const missingTextures: string[] = [];
        const requiredTextures = new Set<string>();

        this.animations.forEach((config) => {
            requiredTextures.add(config.texture);
        });

        for (const texture of requiredTextures) {
            if (!scene.textures.exists(texture)) {
                missingTextures.push(texture);
            }
        }

        return {
            isValid: missingTextures.length === 0,
            missingTextures,
        };
    }

    public cleanupSceneAnimations(scene: Phaser.Scene): void {
        const sceneAnimations = this.sceneAnimations.get(scene);

        if (sceneAnimations) {
            sceneAnimations.forEach((type) => {
                const state = this.registrationState.get(type);
                if (state) {
                    this.registrationState.set(type, {
                        ...state,
                        usageCount: Math.max(0, state.usageCount - 1),
                    });
                }
            });

            this.sceneAnimations.delete(scene);
        }
    }

    public getAnimationDuration(type: AnimationType): number {
        const config = this.animations.get(type);
        if (!config) return 0;

        const frameCount = config.frames.end - config.frames.start + 1;
        return (frameCount / config.frameRate) * 1000;
    }

    public isLoopingAnimation(type: AnimationType): boolean {
        const config = this.animations.get(type);
        return config ? config.repeat === -1 : false;
    }

    public getAnimationsByTexture(texture: string): AnimationType[] {
        return Array.from(this.animations.entries())
            .filter(([_, config]) => config.texture === texture)
            .map(([type, _]) => type);
    }

    public registerCustomAnimation(config: AnimationConfig): boolean {
        if (this.animations.has(config.key)) {
            console.warn(`Animation ${config.key} already exists`);
            return false;
        }

        this.animations.set(config.key, config);
        this.registrationState.set(config.key, {
            config,
            isRegistered: false,
            usageCount: 0,
        });

        return true;
    }

    public getAnimationsForEntityType(entityType: 'player' | 'worker' | 'tree' | 'effects' | 'coal_vein'): AnimationType[] {
        const entityAnimations = {
            player: [AnimationType.PLAYER_IDLE, AnimationType.PLAYER_WALK, AnimationType.PLAYER_CHOP],
            worker: [AnimationType.WORKER_IDLE, AnimationType.WORKER_WALK, AnimationType.WORKER_CHOP],
            tree: [AnimationType.TREE_IDLE, AnimationType.TREE_HIT, AnimationType.TREE_DESTROY],
            coal_vein: [AnimationType.COAL_VEIN_IDLE],
            effects: [AnimationType.LEAVES_FALL],
        };

        return entityAnimations[entityType] || [];
    }
}
