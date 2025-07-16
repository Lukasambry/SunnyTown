<template>
    <div class="save-manager-ui">
        <button
            @click="togglePanel"
            class="save-toggle-btn"
            :class="{ 'active': isPanelOpen }"
        >
            💾 Sauvegarde
        </button>

        <Transition name="panel-slide">
            <div v-if="isPanelOpen" class="save-panel">
                <div class="save-panel-header">
                    <h3>Gestion des Sauvegardes</h3>
                    <button @click="togglePanel" class="close-btn">✕</button>
                </div>

                <div class="save-panel-content">
                    <div class="save-info">
                        <h4>Informations de Sauvegarde</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="label">Dernière sauvegarde:</span>
                                <span class="value">{{ lastSaveTime }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Version:</span>
                                <span class="value">{{ saveVersion }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Niveau joueur:</span>
                                <span class="value">{{ playerLevel }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Ressources:</span>
                                <span class="value">{{ totalResources }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Bâtiments:</span>
                                <span class="value">{{ totalBuildings }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="save-actions">
                        <h4>Actions</h4>
                        <div class="action-buttons">
                            <button @click="manualSave" class="action-btn save-btn">
                                💾 Sauvegarder maintenant
                            </button>

                            <button @click="exportSave" class="action-btn export-btn">
                                📤 Exporter sauvegarde
                            </button>

                            <button @click="importSave" class="action-btn import-btn">
                                📥 Importer sauvegarde
                            </button>

                            <button @click="loadSave" class="action-btn import-btn">
                                🔄 Charger sauvegarde
                            </button>

                            <button @click="resetGame" class="action-btn reset-btn">
                                🔄 Nouvelle partie
                            </button>
                        </div>
                    </div>

                    <div class="save-test" v-if="showTestSection">
                        <h4>Tests & Debug</h4>
                        <div class="test-buttons">
                            <button @click="testSave" class="test-btn">
                                🧪 Test sauvegarde
                            </button>

                            <button @click="testLoad" class="test-btn">
                                🔄 Test chargement
                            </button>

                            <button @click="addTestResources" class="test-btn">
                                ➕ Ajouter ressources test
                            </button>

                            <button @click="levelUpTest" class="test-btn">
                                ⬆️ Level up test
                            </button>

                            <button @click="unlockTestZone" class="test-btn">
                                🔓 Débloquer zone test
                            </button>

                            <button @click="forceRefresh" class="test-btn">
                                🔄 Actualiser données
                            </button>
                        </div>

                        <div class="test-toggle">
                            <label>
                                <input
                                    type="checkbox"
                                    v-model="autoSaveEnabled"
                                    @change="toggleAutoSave"
                                >
                                Sauvegarde automatique (30s)
                            </label>
                        </div>
                    </div>

                    <div class="save-status">
                        <div class="status-indicator" :class="saveStatus.type">
                            {{ saveStatus.message }}
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useGameStore } from '@/game/stores/gameStore';
import { SaveGameManager } from '@/game/services/SaveGameManager';
import { saveIntegrationService } from '@/game/services/SaveIntegrationService';
import { ResourceType } from '@/game/types/ResourceSystemTypes';

const isPanelOpen = ref(false);
const showTestSection = ref(process.env.NODE_ENV === 'development'); // Afficher seulement en dev
const autoSaveEnabled = ref(true);
const lastSaveTime = ref('Jamais');
const saveVersion = ref('1.0.0');
const saveStatus = ref({
    type: 'idle',
    message: 'Prêt'
});


const gameStore = useGameStore();
const saveManager = SaveGameManager.getInstance();


const playerLevel = computed(() => gameStore.playerLevel || 1);

const totalResources = computed(() => {
    let total = 0;
    if (gameStore.resourcesMap) {
        gameStore.resourcesMap.forEach(amount => total += amount);
    }
    return total;
});

const totalBuildings = computed(() => {
    try {
        const mainSave = localStorage.getItem('sunnytown_savegame');
        if (mainSave) {
            const saveData = JSON.parse(mainSave);
            return Array.isArray(saveData.buildings) ? saveData.buildings.length : 0;
        }
        return 0;
    } catch {
        return 0;
    }
});

const togglePanel = () => {
    isPanelOpen.value = !isPanelOpen.value;
};

const manualSave = () => {
    try {
        saveIntegrationService.manualSave();
        updateSaveStatus('success', 'Sauvegarde réussie !');
        updateLastSaveTime();
    } catch (error) {
        updateSaveStatus('error', 'Erreur de sauvegarde');
        console.error('Erreur lors de la sauvegarde manuelle:', error);
    }
};

const exportSave = () => {
    try {
        saveIntegrationService.exportSave();
        updateSaveStatus('success', 'Export en cours...');
    } catch (error) {
        updateSaveStatus('error', 'Erreur d\'export');
        console.error('Erreur lors de l\'export:', error);
    }
};

const importSave = () => {
    try {
        saveIntegrationService.importSave();
        updateSaveStatus('info', 'Import en cours...');
    } catch (error) {
        updateSaveStatus('error', 'Erreur d\'import');
        console.error('Erreur lors de l\'import:', error);
    }
};

const loadSave = () => {
    try {
        const raw = localStorage.getItem('sunnytown_savegame');
        if (raw) {
            const saveData = JSON.parse(raw);
            gameStore.applySaveData(saveData);
            updateSaveStatus('success', 'Sauvegarde chargée');
        } else {
            updateSaveStatus('error', 'Aucune sauvegarde trouvée');
        }
    } catch (error) {
        updateSaveStatus('error', 'Erreur chargement sauvegarde');
        console.error('Erreur lors du chargement de la sauvegarde:', error);
    }
};

const resetGame = () => {
    try {
        saveIntegrationService.resetGame();
    } catch (error) {
        updateSaveStatus('error', 'Erreur de réinitialisation');
        console.error('Erreur lors de la réinitialisation:', error);
    }
};

const forceRefresh = () => {
    try {
        saveIntegrationService.forceRefreshGameData();
        updateSaveStatus('info', 'Actualisation forcée effectuée');
    } catch (error) {
        updateSaveStatus('error', 'Erreur lors de l\'actualisation');
        console.error('Erreur lors de l\'actualisation:', error);
    }
};


const testSave = () => {
    console.log('=== TEST SAUVEGARDE ===');
    const data = saveManager.collectGameData?.() || 'Méthode non accessible';
    console.log('Données collectées:', data);

    saveManager.saveGame();
    updateSaveStatus('info', 'Test de sauvegarde effectué');
};

const testLoad = () => {
    console.log('=== TEST CHARGEMENT ===');
    const data = saveManager.loadGame();
    console.log('Données chargées:', data);

    if (data) {
        saveManager.applyLoadedData(data);
        updateSaveStatus('info', 'Test de chargement effectué');
    }
};

const addTestResources = () => {
    try {
        gameStore.addResource(ResourceType.WOOD, 50);
        gameStore.addResource(ResourceType.STONE, 25);
        gameStore.addResource(ResourceType.FOOD, 15);

        updateSaveStatus('success', 'Ressources test ajoutées');
    } catch (error) {
        updateSaveStatus('error', 'Erreur ajout ressources');
        console.error('Erreur lors de l\'ajout de ressources test:', error);
    }
};

const levelUpTest = () => {
    try {
        const currentLevel = gameStore.playerLevel || 1;
        gameStore.updatePlayerLevel(currentLevel + 1);
        gameStore.updatePlayerExperience({
            current: 0,
            nextLevel: (currentLevel + 1) * 100
        });

        updateSaveStatus('success', 'Level up test effectué');
    } catch (error) {
        updateSaveStatus('error', 'Erreur level up');
        console.error('Erreur lors du level up test:', error);
    }
};

const unlockTestZone = () => {
    try {
        window.dispatchEvent(new CustomEvent('game:zoneUnlocked', {
            detail: { zoneName: 'test_zone_' + Date.now() }
        }));

        updateSaveStatus('success', 'Zone test débloquée');
    } catch (error) {
        updateSaveStatus('error', 'Erreur déblocage zone');
        console.error('Erreur lors du déblocage de zone test:', error);
    }
};

const toggleAutoSave = () => {
    if (autoSaveEnabled.value) {
        console.log('Auto-save activé');
    } else {
        saveManager.stopAutoSave();
        console.log('Auto-save désactivé');
    }
};

const updateSaveStatus = (type: string, message: string) => {
    saveStatus.value = { type, message };

    setTimeout(() => {
        saveStatus.value = { type: 'idle', message: 'Prêt' };
    }, 3000);
};

const updateLastSaveTime = () => {
    lastSaveTime.value = new Date().toLocaleTimeString();
};

const handleGameSaved = (event: CustomEvent) => {
    updateLastSaveTime();
    updateSaveStatus('success', 'Sauvegarde automatique');
};

const handleGameLoaded = (event: CustomEvent) => {
    updateSaveStatus('info', 'Données chargées');
};

onMounted(() => {
    window.addEventListener('game:saved', handleGameSaved);
    window.addEventListener('game:loaded', handleGameLoaded);

    updateLastSaveTime();
});

onUnmounted(() => {
    window.removeEventListener('game:saved', handleGameSaved);
    window.removeEventListener('game:loaded', handleGameLoaded);
});
</script>

<style scoped>
.save-manager-ui {
    position: fixed;
    top: 20px;
    right: 400px;
    z-index: 1000;
}

.save-toggle-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
}

.save-toggle-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.save-toggle-btn.active {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.save-panel {
    position: absolute;
    top: 60px;
    right: 0;
    width: 400px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.3);
}

.save-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(0,0,0,0.1);
}

.save-panel-header h3 {
    margin: 0;
    color: #333;
    font-size: 18px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #666;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.close-btn:hover {
    background-color: rgba(0,0,0,0.1);
}

.save-panel-content {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
}

.save-info, .save-actions, .save-test {
    margin-bottom: 24px;
}

.save-info h4, .save-actions h4, .save-test h4 {
    margin: 0 0 12px 0;
    color: #333;
    font-size: 16px;
    font-weight: 600;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    background: rgba(0,0,0,0.05);
    border-radius: 6px;
    font-size: 14px;
}

.label {
    font-weight: 500;
    color: #666;
}

.value {
    font-weight: 600;
    color: #333;
}

.action-buttons, .test-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.action-btn, .test-btn {
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.save-btn {
    background: #10b981;
    color: white;
}

.export-btn {
    background: #3b82f6;
    color: white;
}

.import-btn {
    background: #8b5cf6;
    color: white;
}

.reset-btn {
    background: #ef4444;
    color: white;
}

.test-btn {
    background: #f59e0b;
    color: white;
    font-size: 12px;
    padding: 6px 12px;
}

.action-btn:hover, .test-btn:hover {
    transform: translateY(-1px);
    opacity: 0.9;
}

.test-toggle {
    margin-top: 12px;
    padding: 8px;
    background: rgba(0,0,0,0.05);
    border-radius: 6px;
}

.test-toggle label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    cursor: pointer;
}

.save-status {
    padding: 12px;
    border-radius: 6px;
    text-align: center;
    font-weight: 500;
    margin-top: 16px;
}

.status-indicator.idle {
    background: rgba(107, 114, 128, 0.1);
    color: #6b7280;
}

.status-indicator.success {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
}

.status-indicator.error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

.status-indicator.info {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
}

.panel-slide-enter-active,
.panel-slide-leave-active {
    transition: all 0.3s ease;
}

.panel-slide-enter-from {
    opacity: 0;
    transform: translateX(20px) translateY(-10px);
}

.panel-slide-leave-to {
    opacity: 0;
    transform: translateX(20px) translateY(-10px);
}
</style>
