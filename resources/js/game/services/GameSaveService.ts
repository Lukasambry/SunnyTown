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
                    'Accept': 'application/json',
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

    private collectGameState(): GameState {
        console.log('📊 Collecte de l\'état du jeu...');

        const gameStore = (window as any).gameStore;

        if (!gameStore) {
            console.warn('⚠️ GameStore non disponible, utilisation des données par défaut');
            return this.getDefaultGameState();
        }

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

        const resources: Record<string, number> = {};

        console.log('🔍 Collecte des ressources...');

        // Méthode 1 : Via le ResourceManager directement
        try {
            const resourceManager = gameStore.getResourceManager?.();
            if (resourceManager) {
                console.log('✅ ResourceManager trouvé via gameStore');
                const inventory = resourceManager.getGlobalInventory();
                const allResources = inventory.getAllResources();

                allResources.forEach((amount: number, type: string) => {
                    if (amount > 0) {
                        resources[type.toLowerCase()] = amount;
                    }
                });

                console.log('📦 Ressources via ResourceManager:', resources);
            }
        } catch (error) {
            console.warn('⚠️ Erreur ResourceManager:', error);
        }

        // Méthode 2 : Via gameStore.getResourceAmount (fallback)
        if (Object.keys(resources).length === 0) {
            console.log('🔄 Fallback vers getResourceAmount...');
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

            console.log('📦 Ressources via getResourceAmount:', resources);
        }

        // Méthode 3 : Via resourcesMap (dernier recours)
        if (Object.keys(resources).length === 0) {
            console.log('🔄 Dernier recours via resourcesMap...');
            try {
                if (gameStore.resourcesMap && typeof gameStore.resourcesMap.forEach === 'function') {
                    gameStore.resourcesMap.forEach((amount: number, type: string) => {
                        if (amount > 0) {
                            resources[type.toLowerCase()] = amount;
                        }
                    });
                    console.log('📦 Ressources via resourcesMap:', resources);
                }
            } catch (error) {
                console.warn('⚠️ Erreur resourcesMap:', error);
            }
        }

        const buildings: any[] = [];
        try {
            const buildingManager = (window as any).__BUILDING_MANAGER__;
            if (buildingManager && typeof buildingManager.getAllBuildings === 'function') {
                const currentBuildings = buildingManager.getAllBuildings();
                buildings.push(...currentBuildings);
                console.log('📦 Bâtiments collectés depuis BuildingManager:', buildings.length);
            } else {
                console.log('📦 Pas de BuildingManager disponible, bâtiments collectés via événements');
            }
        } catch (error) {
            console.warn('Erreur collecte bâtiments:', error);
        }

        const unlockedZones: string[] = [];
        try {
            if (gameStore.state?.unlockedZones) {
                unlockedZones.push(...gameStore.state.unlockedZones);
            }
        } catch (error) {
            console.warn('Erreur collecte zones:', error);
        }

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
            resourcesDetail: resources,
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
            resources: {}, // CORRECTION: Pas de ressources par défaut
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

    public async save(saveName: string = 'auto'): Promise<SaveResponse> {
        if (!this.playerId) {
            await this.generatePlayerId();
        }

        console.log(`💾 Sauvegarde: ${saveName}`);

        try {
            const gameState = this.collectGameState();

            // 1. Sauvegarder dans localStorage
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
            console.log('🚀 Tentative de sauvegarde BDD...');

            const response = await fetch(`${this.baseUrl}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
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

            console.log('📡 Réponse serveur:', response.status, response.statusText);

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                console.log('📄 Content-Type:', contentType);

                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('❌ Réponse non-JSON:', text.substring(0, 200));
                    return { success: false, message: 'Réponse serveur invalide' };
                }

                const result = await response.json();
                console.log('✅ Sauvegarde BDD réussie');
                return result;
            } else {
                const errorText = await response.text();
                console.error('❌ Erreur sauvegarde BDD:', response.status, errorText);
                return { success: false, message: 'Erreur serveur' };
            }
        } catch (error) {
            console.error('❌ Erreur réseau BDD:', error);
            return { success: false, message: 'Erreur réseau' };
        }
    }
    public async initializeGame(): Promise<void> {
        if (this.isLoading) return;
        this.isLoading = true;

        console.log('🎮 Initialisation du jeu...');

        try {
            // 1. Charger depuis la BDD avec la bonne méthode
            const dbResult = await this.loadFromDatabase('auto');

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

        this.saveToLocalStorage(gameState);

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

    private setupEventListeners(): void {
        window.addEventListener('game:requestSave', (event: CustomEvent) => {
            const saveName = event.detail?.saveName || 'manual';
            this.save(saveName);
        });

        window.addEventListener('game:requestReset', () => {
            this.resetGame();
        });
    }

    private notifyUI(type: 'success' | 'error' | 'warning', message: string): void {
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: { type, message }
        }));
    }

    public async resetGame(): Promise<void> {
        const confirmed = confirm(
            'Êtes-vous sûr de vouloir commencer une nouvelle partie ?\n\n' +
            'Cette action va :\n' +
            '• Supprimer TOUTES vos sauvegardes locales\n' +
            '• Supprimer TOUTES vos sauvegardes serveur\n' +
            '• Redémarrer le jeu à zéro\n\n' +
            'Cette action est IRRÉVERSIBLE !'
        );

        if (!confirmed) {
            console.log('🚫 Nouvelle partie annulée par l\'utilisateur');
            return;
        }

        try {
            await this.startNewGame();

            setTimeout(() => {
                console.log('🔄 Rechargement de la page...');
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('❌ Erreur lors du reset:', error);
            this.notifyUI('error', 'Erreur lors de la réinitialisation');
        }
    }

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
            const response = await fetch(`${this.baseUrl}/list?player_id=${this.playerId}`, {
                headers: {
                    'Accept': 'application/json',
                }
            });
            if (response.ok) {
                const result = await response.json();
                return result.success ? result.data : [];
            }
        } catch (error) {
            console.error('Erreur liste sauvegardes:', error);
        }
        return [];
    }

    public async startNewGame(): Promise<void> {
        console.log('🆕 Démarrage d\'une nouvelle partie...');

        try {
            this.clearAllData();

            await this.clearAllDatabaseSaves();

            // Attendre pour s'assurer que les données sont bien nettoyées
            await new Promise(resolve => setTimeout(resolve, 500));

            const defaultState = this.getDefaultGameState();

            this.applyGameState(defaultState);

            await this.save('auto');

            this.notifyUI('success', 'Nouvelle partie créée !');

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('❌ Erreur nouvelle partie:', error);
            this.notifyUI('error', 'Erreur lors de la création');
        }
    }

    private clearAllLocalStorage(): void {
        console.log('🧹 Nettoyage complet du localStorage...');

        const keysToRemove = [
            this.SAVE_DATA_KEY,
            'sunnytown_savegame',
            'sunnytown_resources',
            'sunnytown_game_data',
            'sunnytown_player_data',
            'sunnytown_buildings'
        ];

        keysToRemove.forEach(key => {
            try {
                localStorage.removeItem(key);
                console.log(`🗑️ Supprimé: ${key}`);
            } catch (error) {
                console.warn(`⚠️ Erreur suppression ${key}:`, error);
            }
        });

        try {
            sessionStorage.clear();
            console.log('🗑️ SessionStorage nettoyé');
        } catch (error) {
            console.warn('⚠️ Erreur nettoyage sessionStorage:', error);
        }
    }

    private clearAllData(): void {
        console.log('🧹 Nettoyage COMPLET...');

        const keysToRemove = [
            this.SAVE_DATA_KEY,
            'sunnytown_savegame',
            'sunnytown_resources',
            'sunnytown_game_data',
            'sunnytown_player_data',
            'sunnytown_buildings'
        ];

        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });

        sessionStorage.clear();

        window.dispatchEvent(new CustomEvent('game:clearAllBuildings'));

        window.dispatchEvent(new CustomEvent('game:forceReset'));
    }

    private async clearAllDatabaseSaves(): Promise<void> {
        if (!this.playerId) {
            console.log('⚠️ Pas d\'ID joueur, skip suppression BDD');
            return;
        }

        try {
            console.log('🗑️ Suppression des sauvegardes BDD...');

            const saves = await this.listSaves();

            if (saves.length === 0) {
                console.log('ℹ️ Aucune sauvegarde BDD à supprimer');
                return;
            }

            const deletePromises = saves.map(save =>
                fetch(`${this.baseUrl}/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        player_id: this.playerId,
                        save_name: save.save_name,
                    }),
                })
            );

            await Promise.all(deletePromises);
            console.log(`✅ ${saves.length} sauvegardes BDD supprimées`);

        } catch (error) {
            console.error('❌ Erreur suppression sauvegardes BDD:', error);
            // Ne pas bloquer la nouvelle partie si la BDD est inaccessible
        }
    }
    public async loadSaveWithReload(saveName: string): Promise<void> {
        try {
            console.log(`📥 Chargement de la sauvegarde "${saveName}" avec rechargement...`);

            const result = await this.loadFromDatabase(saveName);

            if (!result.success) {
                this.notifyUI('error', `Impossible de charger la sauvegarde "${saveName}"`);
                return;
            }

            this.clearGameDataLocalStorage();

            this.notifyUI('success', 'Sauvegarde chargée, rechargement...');

            setTimeout(() => {
                console.log('🔄 Rechargement de la page pour appliquer la sauvegarde...');
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('❌ Erreur lors du chargement avec rechargement:', error);
            this.notifyUI('error', 'Erreur lors du chargement de la sauvegarde');
        }
    }

    // CORRECTION: Méthode loadFromDatabase avec auto-retry
    private async loadFromDatabase(saveName: string = 'auto'): Promise<{ success: boolean, data?: any }> {
        if (!this.playerId) {
            return { success: false };
        }

        try {
            console.log('🔍 Test de connexion serveur...');

            const healthResponse = await fetch('/api/health-check', {
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!healthResponse.ok) {
                console.warn('⚠️ Serveur API non accessible');
                return { success: false };
            }

            console.log('✅ Serveur accessible, chargement sauvegarde...');

            // Essayez d'abord de charger la sauvegarde spécifique
            let response = await fetch(`${this.baseUrl}/load?player_id=${this.playerId}&save_name=${saveName}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok && saveName === 'auto') {
                console.log('🔄 Tentative de chargement de la dernière sauvegarde...');
                response = await fetch(`${this.baseUrl}/load-latest?player_id=${this.playerId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
            }

            if (response.ok) {
                const contentType = response.headers.get('content-type');

                if (!contentType || !contentType.includes('application/json')) {
                    console.error('❌ Réponse serveur non-JSON:', contentType);
                    const text = await response.text();
                    console.error('Contenu reçu:', text.substring(0, 200));
                    return { success: false };
                }

                const result = await response.json();
                if (result.success && result.data) {
                    // Convertir et appliquer l'état
                    const gameState = this.convertDbToGameState(result.data.game_state);
                    this.applyGameState(gameState);

                    console.log('✅ Sauvegarde BDD chargée et appliquée');
                    return { success: true, data: result.data };
                }
            } else {
                console.warn(`⚠️ Erreur HTTP ${response.status}: ${response.statusText}`);
            }

            return { success: false };
        } catch (error) {
            console.error('❌ Erreur chargement BDD:', error);

            if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
                console.error('❌ Le serveur a renvoyé du HTML au lieu de JSON');
                console.error('🔧 Vérifiez que les routes API sont bien dans routes/api.php');
            }

            return { success: false };
        }
    }
    private clearGameDataLocalStorage(): void {
        console.log('🧹 Nettoyage localStorage (conservation player_id)...');

        const keysToRemove = [
            this.SAVE_DATA_KEY,
            'sunnytown_savegame',
            'sunnytown_resources',
            'sunnytown_game_data',
            'sunnytown_player_data',
            'sunnytown_buildings'
        ];

        keysToRemove.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.warn(`Erreur suppression ${key}:`, error);
            }
        });

        try {
            sessionStorage.clear();
        } catch (error) {
            console.warn('Erreur nettoyage sessionStorage:', error);
        }
    }
}

export const gameSaveService = GameSaveService.getInstance();
