// resources/js/services/GameSaveService.ts

interface GameState {
    player: {
        level: number;
        gold: number;
        experience: {
            current: number;
            nextLevel: number;
        };
        health: {
            current: number;
            max: number;
        };
        avatar?: string;
    };
    resources: Record<string, number>;
    buildings: Array<{
        type: string;
        x: number;
        y: number;
    }>;
    workers: Array<{
        type: string;
        position: { x: number; y: number };
        buildingId?: string;
    }>;
    unlockedZones: string[];
    gameSettings: {
        musicEnabled: boolean;
        soundEnabled: boolean;
        lastPlayedAt: number;
    };
    version: string;
    timestamp: number;
}

interface SaveResponse {
    success: boolean;
    message: string;
    data?: any;
    errors?: Record<string, string[]>;
}

export class GameSaveService {
    private static instance: GameSaveService;
    private baseUrl: string = '/api/game-save';
    private playerId: string | null = null;
    private autoSaveInterval: number | null = null;
    private autoSaveEnabled: boolean = true;
    private isLoading: boolean = false;

    // Clés localStorage
    private readonly PLAYER_ID_KEY = 'sunnytown_player_id';
    private readonly SAVE_DATA_KEY = 'sunnytown_save_data';

    constructor() {
        this.initializePlayerId();
        this.setupAutoSave();
        this.setupEventListeners();
    }

    public static getInstance(): GameSaveService {
        if (!GameSaveService.instance) {
            GameSaveService.instance = new GameSaveService();
        }
        return GameSaveService.instance;
    }

    // ===========================================
    // INITIALISATION
    // ===========================================

    private initializePlayerId(): void {
        this.playerId = localStorage.getItem(this.PLAYER_ID_KEY);
        if (!this.playerId) {
            this.generatePlayerId();
        }
        console.log('🆔 Player ID:', this.playerId);
    }

    private async generatePlayerId(): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/generate-player-id`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
            });

            if (response.ok) {
                const result = await response.json();
                this.playerId = result.data.player_id;
                localStorage.setItem(this.PLAYER_ID_KEY, this.playerId || '');
                console.log('✅ Nouvel ID généré:', this.playerId);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.warn('⚠️ Génération ID serveur échouée, fallback local:', error);
            this.playerId = this.generateUUID();
            localStorage.setItem(this.PLAYER_ID_KEY, this.playerId);
        }
    }

    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private getCsrfToken(): string {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    }

    // ===========================================
    // COLLECTE DE DONNÉES
    // ===========================================

    private collectGameState(): GameState {
        console.log('📊 Collecte de l\'état du jeu...');

        // Accès au gameStore via window.gameStore (votre store l'expose déjà)
        const gameStore = (window as any).gameStore;

        if (!gameStore) {
            console.warn('⚠️ GameStore non disponible, utilisation des données par défaut');
            return this.getDefaultGameState();
        }

        // Collecter les données du joueur
        const player = {
            level: gameStore.playerLevel || 1,
            gold: gameStore.playerGold || 0,
            experience: {
                current: gameStore.playerExperience?.current || 0,
                nextLevel: gameStore.playerExperience?.nextLevel || 100,
            },
            health: {
                current: gameStore.playerHealth?.current || 100,
                max: gameStore.playerHealth?.max || 100,
            },
            avatar: gameStore.playerAvatar || 'default',
        };

        // Collecter les ressources
        const resources: Record<string, number> = {};
        const resourceTypes = ['WOOD', 'STONE', 'FOOD', 'IRON', 'COAL', 'GOLD', 'METAL', 'TOOLS', 'ENERGY', 'PLANKS', 'POPULATION'];

        resourceTypes.forEach(type => {
            try {
                const amount = gameStore.getResourceAmount?.(type) || 0;
                if (amount > 0) {
                    resources[type.toLowerCase()] = amount;
                }
            } catch (error) {
                console.warn(`Erreur ressource ${type}:`, error);
            }
        });

        // Collecter les bâtiments depuis sessionStorage (comme dans votre BuildingManager)
        const buildings: any[] = [];
        try {
            const storedBuildings = sessionStorage.getItem('BUILDINGS_STORAGE');
            if (storedBuildings) {
                const buildingsData = JSON.parse(storedBuildings);
                buildings.push(...buildingsData);
            }
        } catch (error) {
            console.warn('Erreur collecte bâtiments:', error);
        }

        // Collecter les zones débloquées (via votre gameStore)
        const unlockedZones: string[] = [];
        try {
            if (gameStore.state?.unlockedZones) {
                unlockedZones.push(...gameStore.state.unlockedZones);
            }
        } catch (error) {
            console.warn('Erreur collecte zones:', error);
        }

        // Paramètres du jeu
        const gameSettings = {
            musicEnabled: true,
            soundEnabled: true,
            lastPlayedAt: Date.now(),
        };

        const gameState: GameState = {
            player,
            resources,
            buildings,
            workers: [], // TODO: Implémenter si nécessaire
            unlockedZones,
            gameSettings,
            version: '1.0.0',
            timestamp: Date.now(),
        };

        console.log('📊 État collecté:', {
            player: player.level,
            resources: Object.keys(resources).length,
            buildings: buildings.length,
            zones: unlockedZones.length,
        });

        return gameState;
    }

    private getDefaultGameState(): GameState {
        return {
            player: {
                level: 1,
                gold: 0,
                experience: { current: 0, nextLevel: 100 },
                health: { current: 100, max: 100 },
                avatar: 'default',
            },
            resources: {},
            buildings: [],
            workers: [],
            unlockedZones: [],
            gameSettings: {
                musicEnabled: true,
                soundEnabled: true,
                lastPlayedAt: Date.now(),
            },
            version: '1.0.0',
            timestamp: Date.now(),
        };
    }

    // ===========================================
    // SAUVEGARDE
    // ===========================================

    public async save(saveName: string = 'auto'): Promise<SaveResponse> {
        if (!this.playerId) {
            await this.generatePlayerId();
        }

        console.log(`💾 Sauvegarde: ${saveName}`);

        try {
            const gameState = this.collectGameState();

            // 1. Sauvegarder dans localStorage (toujours)
            this.saveToLocalStorage(gameState);

            // 2. Sauvegarder en BDD
            const dbResult = await this.saveToDatabase(gameState, saveName);

            if (dbResult.success) {
                console.log('✅ Sauvegarde complète réussie');
                this.notifyUI('success', 'Sauvegarde réussie');
                return dbResult;
            } else {
                console.warn('⚠️ Sauvegarde BDD échouée, localStorage OK');
                this.notifyUI('warning', 'Sauvegarde locale uniquement');
                return { success: true, message: 'Sauvegarde locale réussie' };
            }
        } catch (error) {
            console.error('❌ Erreur sauvegarde:', error);
            this.notifyUI('error', 'Erreur de sauvegarde');
            return { success: false, message: 'Erreur de sauvegarde' };
        }
    }

    private saveToLocalStorage(gameState: GameState): void {
        try {
            localStorage.setItem(this.SAVE_DATA_KEY, JSON.stringify(gameState));
            console.log('✅ Sauvegarde localStorage');
        } catch (error) {
            console.error('❌ Erreur sauvegarde localStorage:', error);
        }
    }

    private async saveToDatabase(gameState: GameState, saveName: string): Promise<SaveResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
                body: JSON.stringify({
                    player_id: this.playerId,
                    save_name: saveName,
                    game_state: {
                        player: gameState.player,
                        resources: gameState.resources,
                        buildings: gameState.buildings,
                        workers: gameState.workers,
                        gameData: {
                            unlockedZones: gameState.unlockedZones,
                            gameSettings: gameState.gameSettings,
                        },
                        metadata: {
                            gameVersion: gameState.version,
                            timestamp: gameState.timestamp,
                        },
                    },
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Sauvegarde BDD réussie');
                return result;
            } else {
                const error = await response.text();
                console.error('❌ Erreur sauvegarde BDD:', error);
                return { success: false, message: 'Erreur serveur' };
            }
        } catch (error) {
            console.error('❌ Erreur réseau BDD:', error);
            return { success: false, message: 'Erreur réseau' };
        }
    }

    // ===========================================
    // CHARGEMENT
    // ===========================================

    public async initializeGame(): Promise<void> {
        if (this.isLoading) return;
        this.isLoading = true;

        console.log('🎮 Initialisation du jeu...');

        try {
            // 1. Essayer de charger depuis la BDD
            const dbResult = await this.loadFromDatabase();

            if (dbResult.success) {
                console.log('✅ Chargement depuis BDD réussi');
                this.isLoading = false;
                return;
            }

            // 2. Fallback: charger depuis localStorage
            console.log('🔄 Fallback vers localStorage...');
            const localData = this.loadFromLocalStorage();

            if (localData) {
                this.applyGameState(localData);
                console.log('✅ Chargement depuis localStorage réussi');
            } else {
                console.log('ℹ️ Aucune sauvegarde trouvée, nouveau jeu');
                this.applyGameState(this.getDefaultGameState());
            }
        } catch (error) {
            console.error('❌ Erreur initialisation:', error);
            this.applyGameState(this.getDefaultGameState());
        }

        this.isLoading = false;
    }

    private async loadFromDatabase(): Promise<SaveResponse> {
        if (!this.playerId) return { success: false, message: 'Pas d\'ID joueur' };

        try {
            const response = await fetch(`${this.baseUrl}/load?player_id=${this.playerId}&save_name=auto`);

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    this.applyGameState(this.convertDbToGameState(result.data.game_state));
                    return result;
                }
            }

            return { success: false, message: 'Aucune sauvegarde BDD' };
        } catch (error) {
            console.error('Erreur chargement BDD:', error);
            return { success: false, message: 'Erreur réseau' };
        }
    }

    private loadFromLocalStorage(): GameState | null {
        try {
            const data = localStorage.getItem(this.SAVE_DATA_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Erreur chargement localStorage:', error);
        }
        return null;
    }

    convertDbToGameState(dbData: any): GameState {
        // Convertir le format BDD vers le format unifié
        return {
            player: {
                level: dbData.player?.level || 1,
                gold: dbData.player?.gold || 0,
                experience: {
                    current: dbData.player?.experience?.current || 0,
                    nextLevel: dbData.player?.experience?.nextLevel || 100,
                },
                health: {
                    current: dbData.player?.health?.current || 100,
                    max: dbData.player?.health?.max || 100,
                },
                avatar: dbData.player?.avatar || 'default',
            },
            resources: dbData.resources || {},
            buildings: dbData.buildings || [],
            workers: dbData.workers || [],
            unlockedZones: dbData.gameData?.unlockedZones || [],
            gameSettings: dbData.gameData?.gameSettings || {
                musicEnabled: true,
                soundEnabled: true,
                lastPlayedAt: Date.now(),
            },
            version: dbData.metadata?.gameVersion || '1.0.0',
            timestamp: dbData.metadata?.timestamp || Date.now(),
        };
    }

    private applyGameState(gameState: GameState): void {
        console.log('🔄 Application de l\'état du jeu...');

        // Sauvegarder dans localStorage pour la cohérence
        this.saveToLocalStorage(gameState);

        // Émettre un événement pour que le jeu applique les données
        window.dispatchEvent(new CustomEvent('game:loadGameState', {
            detail: { gameState }
        }));

        console.log('✅ État appliqué:', {
            level: gameState.player.level,
            gold: gameState.player.gold,
            resources: Object.keys(gameState.resources).length,
            buildings: gameState.buildings.length,
        });
    }

    // ===========================================
    // SAUVEGARDE AUTOMATIQUE
    // ===========================================

    private setupAutoSave(): void {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        this.autoSaveInterval = setInterval(() => {
            if (this.autoSaveEnabled && !this.isLoading) {
                this.save('auto').catch(error => {
                    console.warn('Échec sauvegarde auto:', error);
                });
            }
        }, 30000); // 30 secondes

        // Sauvegarder avant fermeture
        window.addEventListener('beforeunload', () => {
            if (this.autoSaveEnabled) {
                try {
                    const gameState = this.collectGameState();
                    this.saveToLocalStorage(gameState);
                } catch (error) {
                    console.warn('Erreur sauvegarde beforeunload:', error);
                }
            }
        });

        console.log('🔄 Sauvegarde automatique activée (30s)');
    }

    public setAutoSave(enabled: boolean): void {
        this.autoSaveEnabled = enabled;
        if (enabled) {
            this.setupAutoSave();
        } else if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
        console.log(`🔄 Sauvegarde automatique: ${enabled ? 'ON' : 'OFF'}`);
    }

    // ===========================================
    // UTILITAIRES
    // ===========================================

    private setupEventListeners(): void {
        // Écouter les demandes de sauvegarde manuelle
        window.addEventListener('game:requestSave', (event: CustomEvent) => {
            const saveName = event.detail?.saveName || 'manual';
            this.save(saveName);
        });

        // Écouter les demandes de reset
        window.addEventListener('game:requestReset', () => {
            this.resetGame();
        });
    }

    private notifyUI(type: 'success' | 'error' | 'warning', message: string): void {
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: { type, message }
        }));
    }

    public resetGame(): void {
        if (confirm('Êtes-vous sûr de vouloir recommencer ? Toutes les données seront perdues.')) {
            localStorage.removeItem(this.SAVE_DATA_KEY);
            sessionStorage.clear();
            this.applyGameState(this.getDefaultGameState());
            this.notifyUI('success', 'Nouveau jeu commencé');
        }
    }

    // ===========================================
    // API PUBLIQUE
    // ===========================================

    public getPlayerId(): string | null {
        return this.playerId;
    }

    public async manualSave(): Promise<boolean> {
        const result = await this.save('manual');
        return result.success;
    }

    public getCurrentGameState(): GameState | null {
        return this.loadFromLocalStorage();
    }

    public async listSaves(): Promise<any[]> {
        try {
            const response = await fetch(`${this.baseUrl}/list?player_id=${this.playerId}`);
            if (response.ok) {
                const result = await response.json();
                return result.success ? result.data : [];
            }
        } catch (error) {
            console.error('Erreur liste sauvegardes:', error);
        }
        return [];
    }
}

// Instance globale
export const gameSaveService = GameSaveService.getInstance();
