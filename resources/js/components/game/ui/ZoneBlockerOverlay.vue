<template>
    <Teleport to="body">
        <Transition name="zone-blocker-fade">
            <div
                v-if="isVisible"
                class="zone-blocker-overlay fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
            >
                <div class="zone-blocker-content pointer-events-auto">
                    <div class="zone-blocker-card bg-gray-900/95 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl p-6 min-w-96">
                        <!-- Header -->
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-amber-600/20 flex items-center justify-center">
                                    <div class="w-6 h-6 rounded bg-amber-500"></div>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold text-white">{{ blockerDisplayName }}</h3>
                                    <p class="text-sm text-gray-400">Zone de découverte</p>
                                </div>
                            </div>

                            <button
                                class="w-8 h-8 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                @click="handleClose"
                            >
                                ✕
                            </button>
                        </div>

                        <!-- Status Section -->
                        <div class="mb-4">
                            <div class="flex items-center gap-2 mb-2">
                                <div
                                    class="w-3 h-3 rounded-full"
                                    :class="blockerStatus.unlocked ? 'bg-green-500' : 'bg-red-500'"
                                ></div>
                                <span class="text-sm font-medium" :class="blockerStatus.unlocked ? 'text-green-400' : 'text-red-400'">
                  {{ blockerStatus.unlocked ? 'Zone accessible' : 'Zone bloquée' }}
                </span>
                            </div>

                            <p v-if="blockerConfig?.description" class="text-sm text-gray-300">
                                {{ blockerConfig.description }}
                            </p>
                            <p v-else class="text-sm text-gray-400 italic">
                                Aucune description disponible
                            </p>
                        </div>

                        <!-- Zone Info Section -->
                        <div v-if="blockerConfig" class="mb-4">
                            <h4 class="text-sm font-medium text-gray-300 mb-2">Informations de la zone</h4>
                            <div class="bg-gray-800/50 rounded-lg p-3 space-y-2">
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-400">Nom</span>
                                    <span class="text-white">{{ blockerConfig.displayName || blockerConfig.name }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-400">Statut</span>
                                    <span :class="blockerStatus.unlocked ? 'text-green-400' : 'text-red-400'">
                    {{ blockerStatus.unlocked ? 'Débloquée' : 'Bloquée' }}
                  </span>
                                </div>
                            </div>
                        </div>

                        <!-- Requirements Section (if locked) -->
                        <div v-if="!blockerStatus.unlocked && hasUnlockRequirements" class="mb-4">
                            <h4 class="text-sm font-medium text-gray-300 mb-2">Conditions de déblocage</h4>
                            <div class="bg-gray-800/50 rounded-lg p-3 space-y-2">

                                <!-- Level requirement -->
                                <div v-if="blockerConfig.unlockRequirements?.level" class="flex items-center justify-between text-sm">
                                    <span class="text-gray-400">Niveau requis</span>
                                    <span :class="playerLevel >= blockerConfig.unlockRequirements.level ? 'text-green-400' : 'text-red-400'">
                    {{ playerLevel }} / {{ blockerConfig.unlockRequirements.level }}
                  </span>
                                </div>

                                <!-- Resource requirements -->
                                <div v-if="blockerConfig.unlockRequirements?.resources" class="space-y-1">
                                    <div class="text-xs text-gray-500 uppercase tracking-wide">Ressources nécessaires</div>
                                    <div
                                        v-for="[resourceType, amount] in Object.entries(blockerConfig.unlockRequirements.resources)"
                                        :key="resourceType"
                                        class="flex items-center justify-between text-sm"
                                    >
                                        <div class="flex items-center gap-2">
                                            <ResourceIcon :resource-type="resourceType as ResourceType" :size="14" />
                                            <span class="text-gray-400 capitalize">{{ getResourceDisplayName(resourceType) }}</span>
                                        </div>
                                        <span :class="getResourceAmount(resourceType) >= amount ? 'text-green-400' : 'text-red-400'">
                      {{ getResourceAmount(resourceType) }} / {{ amount }}
                    </span>
                                    </div>
                                </div>

                                <!-- Building requirements -->
                                <div v-if="blockerConfig.unlockRequirements?.buildings" class="space-y-1">
                                    <div class="text-xs text-gray-500 uppercase tracking-wide">Bâtiments requis</div>
                                    <div
                                        v-for="buildingType in blockerConfig.unlockRequirements.buildings"
                                        :key="buildingType"
                                        class="flex items-center justify-between text-sm"
                                    >
                                        <div class="flex items-center gap-2">
                                            <BuildingIcon :building-type="buildingType" :size="14" />
                                            <span class="text-gray-400 capitalize">{{ getBuildingDisplayName(buildingType) }}</span>
                                        </div>
                                        <span :class="hasBuildingType(buildingType) ? 'text-green-400' : 'text-red-400'">
                      {{ hasBuildingType(buildingType) ? '✓ Possédé' : '✗ Manquant' }}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- No Requirements Message -->
                        <div v-else-if="!blockerStatus.unlocked && !hasUnlockRequirements" class="mb-4">
                            <div class="bg-blue-800/20 rounded-lg p-3 border border-blue-600/30">
                                <div class="flex items-center gap-2">
                                    <div class="w-4 h-4 rounded-full bg-blue-500"></div>
                                    <span class="text-sm text-blue-300">Cette zone peut être débloquée gratuitement</span>
                                </div>
                            </div>
                        </div>

                        <!-- Already Unlocked Message -->
                        <div v-else-if="blockerStatus.unlocked" class="mb-4">
                            <div class="bg-green-800/20 rounded-lg p-3 border border-green-600/30">
                                <div class="flex items-center gap-2">
                                    <div class="w-4 h-4 rounded-full bg-green-500"></div>
                                    <span class="text-sm text-green-300">Zone débloquée et accessible</span>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex gap-3 justify-end">
                            <ActionButton
                                v-if="!blockerStatus.unlocked && canUnlock"
                                label="Débloquer"
                                variant="primary"
                                size="md"
                                @click="handleUnlock"
                            />
                            <ActionButton
                                v-else-if="blockerStatus.unlocked"
                                label="Déjà débloqué"
                                variant="secondary"
                                size="md"
                                :disabled="true"
                            />
                            <ActionButton
                                label="Fermer"
                                variant="secondary"
                                size="md"
                                @click="handleClose"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useGameStore } from '@game/stores/gameStore';
import type { ZoneBlockerConfig } from '@game/types/ZoneBlockerTypes';
import { ResourceType } from '@game/types/ResourceSystemTypes';
import ResourceIcon from './ResourceIcon.vue';
import BuildingIcon from './BuildingIcon.vue';
import ActionButton from './ActionButton.vue';

const gameStore = useGameStore();

const isVisible = ref(false);
const selectedBlockerName = ref<string>('');
const blockerConfig = ref<ZoneBlockerConfig | null>(null);

const blockerDisplayName = computed(() =>
    blockerConfig.value?.displayName || selectedBlockerName.value
);

const blockerStatus = computed(() => ({
    unlocked: blockerConfig.value?.unlocked || false,
    discovered: true // Pour l'instant, toutes les zones découvertes sont visibles
}));

const playerLevel = computed(() => gameStore.playerLevel || 1);

const hasUnlockRequirements = computed(() => {
    return blockerConfig.value?.unlockRequirements &&
        Object.keys(blockerConfig.value.unlockRequirements).length > 0;
});

const canUnlock = computed(() => {
    if (blockerStatus.value.unlocked) return false;
    if (!hasUnlockRequirements.value) return true; // Pas de conditions = déblocage possible

    const requirements = blockerConfig.value!.unlockRequirements;

    // Check level requirement
    if (requirements.level && playerLevel.value < requirements.level) {
        return false;
    }

    // Check resource requirements
    if (requirements.resources) {
        for (const [resourceType, amount] of Object.entries(requirements.resources)) {
            if (getResourceAmount(resourceType) < amount) {
                return false;
            }
        }
    }

    // Check building requirements
    if (requirements.buildings) {
        for (const buildingType of requirements.buildings) {
            if (!hasBuildingType(buildingType)) {
                return false;
            }
        }
    }

    return true;
});

const getResourceAmount = (resourceType: string): number => {
    return gameStore.getResourceAmount(resourceType as ResourceType) || 0;
};

const getResourceDisplayName = (resourceType: string): string => {
    const displayNames: Record<string, string> = {
        wood: 'Bois',
        stone: 'Pierre',
        gold: 'Or',
        coal: 'Charbon',
        iron: 'Fer',
        food: 'Nourriture'
    };
    return displayNames[resourceType] || resourceType;
};

const getBuildingDisplayName = (buildingType: string): string => {
    const displayNames: Record<string, string> = {
        house: 'Maison',
        sawmill: 'Scierie',
        quarry: 'Carrière',
        mine: 'Mine',
        farm: 'Ferme',
        blacksmith: 'Forgeron'
    };
    return displayNames[buildingType] || buildingType;
};

const hasBuildingType = (buildingType: string): boolean => {
    // Récupérer les bâtiments du gameStore
    const buildings = gameStore.state?.buildings || [];
    return buildings.some(building => building.type === buildingType);
};

const handleBlockerSelected = (event: CustomEvent) => {
    const { blockerName, config } = event.detail;

    selectedBlockerName.value = blockerName;
    blockerConfig.value = config;
    isVisible.value = true;
};

const handleBlockerDeselected = () => {
    isVisible.value = false;
    selectedBlockerName.value = '';
    blockerConfig.value = null;
};

const handleClose = () => {
    window.dispatchEvent(new CustomEvent('game:deselectZoneBlocker'));
};

const handleUnlock = () => {
    if (!blockerConfig.value) return;

    if (!blockerStatus.value.unlocked && canUnlock.value) {
        // Consommer les ressources nécessaires
        if (blockerConfig.value.unlockRequirements?.resources) {
            for (const [resourceType, amount] of Object.entries(blockerConfig.value.unlockRequirements.resources)) {
                gameStore.removeResource(resourceType as ResourceType, amount);
            }
        }

        // Déclencher l'événement de déblocage
        window.dispatchEvent(new CustomEvent('game:unlockZoneBlocker', {
            detail: { blockerName: selectedBlockerName.value }
        }));

        // Notification de succès
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'success',
                title: 'Zone débloquée !',
                message: `${blockerDisplayName.value} est maintenant accessible !`
            }
        }));

        // Fermer l'overlay
        handleClose();
    } else if (blockerStatus.value.unlocked) {
        // Zone déjà débloquée
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'info',
                title: 'Zone déjà accessible',
                message: `${blockerDisplayName.value} est déjà débloquée`
            }
        }));
    } else {
        // Conditions non remplies
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'warning',
                title: 'Conditions non remplies',
                message: 'Vous ne remplissez pas toutes les conditions pour débloquer cette zone'
            }
        }));
    }
};

onMounted(() => {
    window.addEventListener('game:zoneBlockerSelected', handleBlockerSelected);
    window.addEventListener('game:zoneBlockerDeselected', handleBlockerDeselected);
});

onUnmounted(() => {
    window.removeEventListener('game:zoneBlockerSelected', handleBlockerSelected);
    window.removeEventListener('game:zoneBlockerDeselected', handleBlockerDeselected);
});
</script>

<style scoped>
.zone-blocker-fade-enter-active,
.zone-blocker-fade-leave-active {
    transition: opacity 0.3s ease;
}

.zone-blocker-fade-enter-from,
.zone-blocker-fade-leave-to {
    opacity: 0;
}

.zone-blocker-card {
    animation: zone-blocker-slide-in 0.3s ease-out;
}

@keyframes zone-blocker-slide-in {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>
