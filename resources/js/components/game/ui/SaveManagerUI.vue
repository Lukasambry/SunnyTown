<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="visible" class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
                @click.self="onClose">
                <div class="modal-content relative w-full max-w-2xl mx-auto" @click.stop>
                    <div class="bg-gray-900/95 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl">
                        <!-- Header -->
                        <div class="flex items-center justify-between p-6 border-b border-gray-700/50">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                                    <img src="/assets/game/ui/buttons/floppy.png"
                                         :style="{ imageRendering: 'pixelated'}"
                                         alt="Disquette"
                                         class="w-8 h-8">
                                </div>
                                <div>
                                    <h2 class="text-xl font-bold text-white">
                                        Sauvegarde & Chargement
                                    </h2>
                                    <p class="text-sm text-gray-400">
                                        Gérez vos sauvegardes et restaurations de partie
                                    </p>
                                </div>
                            </div>
                            <button
                                class="w-8 h-8 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                @click="onClose">
                                ✕
                            </button>
                        </div>
                        <!-- Body -->
                        <div class="p-6 space-y-6">
                            <!-- Informations -->
                            <div class="space-y-3">
                                <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                                    Informations
                                </h3>
                                <div class="bg-gray-800/50 rounded-lg p-4 space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-400">ID Joueur:</span>
                                        <span class="text-white">{{ playerId || 'Non défini' }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-400">Dernière sauvegarde:</span>
                                        <span class="text-white">{{ lastSaveTime }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-400">Niveau:</span>
                                        <span class="text-white">{{ playerLevel }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-400">Ressources:</span>
                                        <span class="text-white">{{ totalResources }}</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Actions principales -->
                            <div class="space-y-3">
                                <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                                    Actions
                                </h3>
                                <div class="flex gap-2 flex-wrap">
                                    <button @click="manualSave" class="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition" :disabled="isSaving">
                                        💾 {{ isSaving ? 'Sauvegarde...' : 'Sauvegarder' }}
                                    </button>
                                    <button @click="exportSave" class="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                                        📤 Exporter
                                    </button>
                                    <button @click="importSave" class="px-4 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
                                        📥 Importer
                                    </button>
                                    <button @click="resetGame" class="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition">
                                        🔄 Nouveau jeu
                                    </button>
                                </div>
                            </div>
                            <!-- Sauvegardes BDD -->
                            <div class="space-y-3">
                                <h3 class="text-sm font-semibold text-blue-300 uppercase tracking-wide">
                                    Sauvegardes serveur
                                </h3>
                                <div>
                                    <button @click="refreshSaves" class="px-3 py-1 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition" :disabled="isLoadingSaves">
                                        🔄 {{ isLoadingSaves ? 'Chargement...' : 'Actualiser' }}
                                    </button>
                                </div>
                                <div v-if="serverSaves.length > 0" class="space-y-2 mt-2">
                                    <div v-for="save in serverSaves" :key="save.id" class="flex justify-between items-center bg-gray-800/50 rounded p-3">
                                        <div>
                                            <span class="font-semibold text-white">{{ save.save_name }}</span>
                                            <span class="text-gray-400 text-xs ml-2">
                                                Niv. {{ save.player_level }} • {{ formatDate(save.last_played_at) }}
                                            </span>
                                        </div>
                                        <button @click="loadSave(save.save_name)" class="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                                            📥 Charger
                                        </button>
                                    </div>
                                </div>
                                <div v-else class="text-gray-400 italic text-center py-4">
                                    Aucune sauvegarde serveur
                                </div>
                            </div>
                            <!-- Paramètres -->
                            <div class="space-y-3">
                                <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                                    Paramètres
                                </h3>
                                <div class="bg-gray-800/50 rounded p-3 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        v-model="autoSaveEnabled"
                                        @change="toggleAutoSave"
                                        id="autoSave"
                                    >
                                    <label for="autoSave" class="text-gray-200 text-sm cursor-pointer">
                                        Sauvegarde automatique (30s)
                                    </label>
                                </div>
                            </div>
                            <!-- Status -->
                            <div class="mt-4">
                                <div class="rounded px-4 py-2 text-center font-semibold"
                                    :class="{
                                        'bg-green-700/20 text-green-400': saveStatus.type === 'success',
                                        'bg-red-700/20 text-red-400': saveStatus.type === 'error',
                                        'bg-blue-700/20 text-blue-400': saveStatus.type === 'info',
                                        'bg-gray-700/20 text-gray-400': saveStatus.type === 'idle'
                                    }">
                                    {{ saveStatus.message }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useGameStore } from '@/game/stores/gameStore';
import { gameSaveService } from '@/game/services/GameSaveService';

const props = defineProps<{
    visible: boolean,
    onClose: () => void
}>()

// State
const isSaving = ref(false);
const isLoadingSaves = ref(false);
const autoSaveEnabled = ref(true);
const lastSaveTime = ref('Jamais');
const serverSaves = ref<any[]>([]);
const saveStatus = ref({
    type: 'idle',
    message: 'Prêt'
});

// Store
const gameStore = useGameStore();

// Computed
const playerId = computed(() => gameSaveService.getPlayerId());
const playerLevel = computed(() => gameStore.getPlayerLevel);
const totalResources = computed(() => gameStore.totalResources);

// Methods
const showStatus = (type: string, message: string) => {
    saveStatus.value = { type, message };
    setTimeout(() => {
        saveStatus.value = { type: 'idle', message: 'Prêt' };
    }, 3000);
};

const updateLastSaveTime = () => {
    lastSaveTime.value = new Date().toLocaleTimeString();
};

const manualSave = async () => {
    isSaving.value = true;
    try {
        const success = await gameSaveService.manualSave();
        if (success) {
            showStatus('success', 'Sauvegarde réussie !');
            updateLastSaveTime();
            refreshSaves();
        } else {
            showStatus('error', 'Erreur de sauvegarde');
        }
    } catch (error) {
        showStatus('error', 'Erreur inattendue');
        console.error('Erreur sauvegarde:', error);
    } finally {
        isSaving.value = false;
    }
};

const exportSave = () => {
    try {
        gameStore.exportSave();
        showStatus('success', 'Export réussi');
    } catch (error) {
        showStatus('error', 'Erreur export');
        console.error('Erreur export:', error);
    }
};

const importSave = () => {
    try {
        gameStore.importSave();
        showStatus('info', 'Import en cours...');
    } catch (error) {
        showStatus('error', 'Erreur import');
        console.error('Erreur import:', error);
    }
};

const resetGame = () => {
    try {
        gameSaveService.resetGame();
        showStatus('success', 'Nouveau jeu commencé');
        serverSaves.value = [];
    } catch (error) {
        showStatus('error', 'Erreur reset');
        console.error('Erreur reset:', error);
    }
};

const refreshSaves = async () => {
    isLoadingSaves.value = true;
    try {
        const saves = await gameSaveService.listSaves();
        serverSaves.value = saves;
        console.log('Sauvegardes récupérées:', saves);
    } catch (error) {
        console.error('Erreur récupération sauvegardes:', error);
        showStatus('error', 'Erreur chargement sauvegardes');
    } finally {
        isLoadingSaves.value = false;
    }
};

const loadSave = async (saveName: string) => {
    try {
        showStatus('info', `Chargement de ${saveName}...`);

        // Utiliser l'API directement pour charger une sauvegarde spécifique
        const response = await fetch(`/api/game-save/load?player_id=${playerId.value}&save_name=${saveName}`);
        const result = await response.json();

        if (result.success && result.data) {
            // Émettre l'événement pour appliquer les données
            window.dispatchEvent(new CustomEvent('game:loadGameState', {
                detail: {
                    gameState: gameSaveService.convertDbToGameState(result.data.game_state)
                }
            }));

            showStatus('success', 'Sauvegarde chargée !');
            setTimeout(() => {
                window.location.reload(); // Recharger pour appliquer complètement
            }, 1000);
        } else {
            showStatus('error', 'Erreur chargement');
        }
    } catch (error) {
        showStatus('error', 'Erreur chargement');
        console.error('Erreur chargement save:', error);
    }
};

const toggleAutoSave = () => {
    gameSaveService.setAutoSave(autoSaveEnabled.value);
    showStatus('info', `Sauvegarde auto: ${autoSaveEnabled.value ? 'ON' : 'OFF'}`);
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Event listeners
const handleGameSaved = () => {
    updateLastSaveTime();
    showStatus('success', 'Sauvegarde automatique');
};

const handleGameLoaded = () => {
    showStatus('info', 'Données chargées');
};

const handleNotification = (event: CustomEvent) => {
    const { type, message } = event.detail;
    showStatus(type, message);
};

// Lifecycle
onMounted(() => {
    // Écouter les événements du système unifié
    window.addEventListener('game:saved', handleGameSaved);
    window.addEventListener('game:loaded', handleGameLoaded);
    window.addEventListener('game:notification', handleNotification);

    updateLastSaveTime();
});

onUnmounted(() => {
    window.removeEventListener('game:saved', handleGameSaved);
    window.removeEventListener('game:loaded', handleGameLoaded);
    window.removeEventListener('game:notification', handleNotification);
});
</script>

<style scoped>
.modal-overlay {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
}

/* Modal transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
    transform: scale(0.9) translateY(-20px);
}

.modal-content {
    transition: transform 0.3s ease;
}
</style>
