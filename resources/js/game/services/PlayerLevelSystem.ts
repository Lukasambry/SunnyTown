import { useGameStore } from '@/game/stores/gameStore';
import { ResourceType } from '@/game/types/ResourceSystemTypes';
import { PlayerLevelData } from '@/game/types/PlayerTypes';

export class PlayerLevelSystem {
    private static instance: PlayerLevelSystem;
    private gameStore = useGameStore();

    public static getInstance(): PlayerLevelSystem {
        if (!PlayerLevelSystem.instance) {
            PlayerLevelSystem.instance = new PlayerLevelSystem();
        }
        return PlayerLevelSystem.instance;
    }

    public addExperience(amount: number, source: string = 'unknown', resourceType?: ResourceType): void {
        // Calculer le multiplicateur selon le type de ressource
        const multiplier = resourceType ? this.getResourceExperienceMultiplier(resourceType) : 1.0;
        const finalAmount = Math.floor(amount * multiplier);

        // Récupérer les données actuelles du joueur
        const currentData = this.getCurrentPlayerData();

        // Calculer la nouvelle expérience
        let newExp = currentData.currentExperience + finalAmount;
        let newLevel = currentData.level;
        let newNextLevelExp = currentData.nextLevelExperience;

        // Vérifier si le joueur monte de niveau
        const levelUpData = this.checkLevelUp(newExp, newLevel, newNextLevelExp);

        if (levelUpData.hasLeveledUp) {
            newLevel = levelUpData.newLevel;
            newExp = levelUpData.remainingExp;
            newNextLevelExp = levelUpData.newNextLevelExp;

            this.handleLevelUp(newLevel);
        }

        // Mettre à jour le store
        this.updatePlayerData({
            level: newLevel,
            currentExperience: newExp,
            nextLevelExperience: newNextLevelExp
        });

        // Émettre un événement pour les effets UI
        this.emitExperienceEvent({
            amount: finalAmount,
            source,
            resourceType,
            multiplier,
            newExperience: newExp,
            newLevel,
            isLevelUp: levelUpData.hasLeveledUp
        });
    }

    private getResourceExperienceMultiplier(resourceType: ResourceType): number {
        switch (resourceType) {
            case ResourceType.WOOD:
                return 20.0;
            case ResourceType.STONE:
                return 1.5;
            case ResourceType.FOOD:
                return 0.8;
            default:
                return 1.0;
        }
    }

    private getCurrentPlayerData(): PlayerLevelData {
        return {
            level: this.gameStore.getPlayerLevel,
            currentExperience: this.gameStore.getPlayerCurrentExperience,
            nextLevelExperience: this.gameStore.getPlayerNextLevelExperience,
            health: {
                current: this.gameStore.getPlayerCurrentHealth,
                max: this.gameStore.getPlayerMaxHealth
            },
            gold: this.gameStore.getPlayerGold
        };
    }

    private checkLevelUp(experience: number, currentLevel: number, nextLevelExp: number): {
        hasLeveledUp: boolean;
        newLevel: number;
        remainingExp: number;
        newNextLevelExp: number;
    } {
        let newLevel = currentLevel;
        let remainingExp = experience;
        let newNextLevelExp = nextLevelExp;
        let hasLeveledUp = false;

        // Gérer les niveaux multiples
        while (remainingExp >= newNextLevelExp) {
            hasLeveledUp = true;
            remainingExp -= newNextLevelExp;
            newLevel++;
            newNextLevelExp = this.calculateNextLevelExperience(newLevel);
        }

        return {
            hasLeveledUp,
            newLevel,
            remainingExp,
            newNextLevelExp
        };
    }

    private calculateNextLevelExperience(level: number): number {
        return Math.floor(100 * Math.pow(1.2, level - 1));
    }

    private handleLevelUp(newLevel: number): void {
        // Soigner le joueur complètement
        const maxHealth = this.gameStore.getPlayerMaxHealth;
        this.gameStore.updatePlayerHealth({
            current: maxHealth,
            max: maxHealth
        });

        // Bonus de pièces d'or
        const goldBonus = newLevel * 5;
        const currentGold = this.gameStore.getPlayerGold;
        this.gameStore.updatePlayerGold(currentGold + goldBonus);

        // Émettre un événement pour l'effet visuel
        window.dispatchEvent(new CustomEvent('player:levelUp', {
            detail: {
                newLevel,
                goldBonus,
                healthRestored: true
            }
        }));
    }

    private updatePlayerData(data: Partial<PlayerLevelData>): void {
        if (data.level !== undefined) {
            this.gameStore.updatePlayerLevel(data.level);
        }

        if (data.currentExperience !== undefined && data.nextLevelExperience !== undefined) {
            this.gameStore.updatePlayerExperience({
                current: data.currentExperience,
                nextLevel: data.nextLevelExperience
            });
        }
    }

    private emitExperienceEvent(eventData: any): void {
        window.dispatchEvent(new CustomEvent('player:experienceGained', {
            detail: eventData
        }));
    }

    public getLevel(): number {
        return this.gameStore.getPlayerLevel;
    }

    public getCurrentExperience(): number {
        return this.gameStore.getPlayerCurrentExperience;
    }

    public getNextLevelExperience(): number {
        return this.gameStore.getPlayerNextLevelExperience;
    }

    public getExperienceProgress(): number {
        const current = this.getCurrentExperience();
        const next = this.getNextLevelExperience();
        return next > 0 ? (current / next) * 100 : 0;
    }
}
