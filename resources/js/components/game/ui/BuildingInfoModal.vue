<!-- src/components/ui/BuildingInfoModal.vue -->
<template>
    <!-- Modal Overlay -->
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isVisible" class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
                @click="handleOverlayClick">
                <!-- Modal Content -->
                <div class="modal-content relative w-full max-w-md mx-auto" @click.stop>
                    <div class="bg-gray-900/95 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl">
                        <!-- Header -->
                        <div class="flex items-center justify-between p-6 border-b border-gray-700/50">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                                    <BuildingIcon :building-type="buildingData?.type || 'unknown'" :size="20" />
                                </div>
                                <h2 class="text-xl font-bold text-white">
                                    {{ buildingDisplayName }}
                                </h2>
                            </div>

                            <button
                                class="w-8 h-8 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                @click="handleClose">
                                x
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="p-6 space-y-6">
                            <!-- Building Info -->
                            <div class="space-y-3">
                                <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                                    Informations
                                </h3>
                                <div class="bg-gray-800/50 rounded-lg p-4 space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-400">Type:</span>
                                        <span class="text-white">{{ buildingDisplayName }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-400">Position:</span>
                                        <span class="text-white">{{ positionText }}</span>
                                    </div>
                                </div>

                                <!-- Description -->
                                <p class="text-gray-300 text-sm leading-relaxed">
                                    {{ buildingDescription }}
                                </p>
                            </div>

                            <!-- Resources -->
                            <div v-if="hasResources" class="space-y-3">
                                <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                                    Stockage des ressources
                                </h3>
                                <div class="space-y-3">
                                    <div v-for="resource in storedResources" :key="resource.resourceType"
                                         class="bg-gray-800/50 rounded-lg p-3">
                                        <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-white">
                        {{ getResourceName(resource.resourceType) }}
                    </span>
                                            <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-400">
                            {{ resource.current }}/{{ resource.capacity }}
                        </span>
                                                <!-- Bouton de récolte individuel -->
                                                <button
                                                    v-if="resource.current > 0"
                                                    @click="collectSingleResource(resource.resourceType, resource.current)"
                                                    class="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                                                    :disabled="!canCollectResource(resource.resourceType, resource.current)"
                                                    :class="{ 'opacity-50 cursor-not-allowed': !canCollectResource(resource.resourceType, resource.current) }"
                                                >
                                                    Récolter
                                                </button>
                                            </div>
                                        </div>
                                        <ResourceBar
                                            :resource-type="resource.resourceType"
                                            :current="resource.current"
                                            :max="resource.capacity"
                                            :width="280"
                                            :show-text="false"
                                        />
                                        <div class="flex justify-between items-center mt-1">
                                            <div class="text-xs text-gray-500">
                                                {{ Math.round(resource.percentage) }}% utilisé
                                            </div>
                                            <!-- Message de capacité si applicable -->
                                            <div v-if="resource.current > 0 && !canCollectResource(resource.resourceType, resource.current)"
                                                 class="text-xs text-yellow-400">
                                                Inventaire plein
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Empty Storage Message -->
                            <div v-else class="space-y-3">
                                <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                                    Stockage des ressources
                                </h3>
                                <div class="bg-gray-800/50 rounded-lg p-4 text-center">
                                    <p class="text-gray-400 text-sm">Aucun stockage configuré pour ce bâtiment</p>
                                </div>
                            </div>

                            <WorkerAssignmentUI :building="buildingData" />

                            <!-- Actions -->
                            <div v-if="availableActions.length > 0" class="space-y-3">
                                <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                                    Actions
                                </h3>
                                <div class="flex gap-2">
                                    <ActionButton v-for="action in availableActions" :key="action.key"
                                        :icon="action.icon" :label="action.label" :variant="action.variant"
                                        :disabled="action.disabled" @click="handleAction(action.key)" />
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
import { computed, ref, watch } from 'vue';
import { useGameStore } from '@/game/stores/gameStore'
import WorkerAssignmentUI from './WorkerAssignmentUI.vue'
import { ResourceType } from '@/game/types/ResourceSystemTypes'
import BuildingIcon from './BuildingIcon.vue'
import ActionButton from './ActionButton.vue'
import ResourceBar from './ResourceBar.vue'

interface BuildingAction {
    key: string
    label: string
    icon: string
    variant: 'primary' | 'secondary' | 'danger' | 'success'
    disabled?: boolean
}

const gameStore = useGameStore()
const isVisible = computed(() => gameStore.state?.showBuildingInfo || false)
const buildingData = computed(() => gameStore.state?.currentBuildingInfo || null)
const resourceUpdateTrigger = ref(0)

const buildingDisplayName = computed(() => {
    const type = buildingData.value?.getType()
    const names: Record<string, string> = {
        'house': 'Maison',
        'sawmill': 'Scierie',
        'mine': 'Mine',
        'farm': 'Ferme'
    }
    return type ? (names[type] || type) : 'Bâtiment'
})

const positionText = computed(() => {
    if (!buildingData.value) return 'Inconnue'

    const pos = buildingData.value.getPosition()
    const tileX = Math.floor(pos.x / 16)
    const tileY = Math.floor(pos.y / 16)
    return `(${tileX}, ${tileY})`
})

const buildingDescription = computed(() => {
    const type = buildingData.value?.getType()
    const descriptions: Record<string, string> = {
        'house': 'La maison peut abriter des ouvriers et améliorer leur efficacité.',
        'sawmill': 'La scierie traite le bois brut et peut stocker les ressources récoltées. Les bûcherons peuvent y déposer leur bois automatiquement.',
        'mine': 'La mine extrait pierre et métaux du sous-sol.',
        'farm': 'La ferme produit de la nourriture pour nourrir vos ouvriers.'
    }
    return type ? (descriptions[type] || 'Bâtiment fonctionnel pour votre colonie.') : ''
})

const storedResources = computed(() => {
    resourceUpdateTrigger.value // Force la re-évaluation

    if (!buildingData.value) return []

    const capacities = buildingData.value.getAllBuildingResourceCapacities()
    const stored = buildingData.value.getAllBuildingResources()

    return Array.from(capacities.entries())
        .filter(([_, capacity]) => capacity > 0)
        .map(([resourceType, capacity]) => ({
            resourceType,
            current: stored.get(resourceType) || 0,
            capacity,
            percentage: capacity > 0 ? ((stored.get(resourceType) || 0) / capacity) * 100 : 0
        }))
        .sort((a, b) => a.resourceType.localeCompare(b.resourceType))
})

const hasResources = computed(() => storedResources.value.length > 0)

const availableActions = computed((): BuildingAction[] => {
    if (!buildingData.value) return []

    const actions: BuildingAction[] = []
    const type = buildingData.value.getType()

    // Collect resources action for any building with stored resources
    const hasAnyStoredResources = storedResources.value.some(resource => resource.current > 0)

    if (hasAnyStoredResources) {
        actions.push({
            key: 'collect',
            label: 'Collecter tout',
            icon: 'plus',
            variant: 'success',
            disabled: false
        })
    }

    // Add building-specific actions
    if (type === 'sawmill') {
        actions.push({
            key: 'process',
            label: 'Traiter le bois',
            icon: 'cog',
            variant: 'primary',
            disabled: storedResources.value.find(r => r.resourceType === ResourceType.WOOD)?.current === 0
        })
    }

    return actions
})

// Methods
const handleClose = () => {
    gameStore.hideBuildingInfo()
}


const getPlayerInventorySpace = (resourceType: ResourceType): number => {
    const resourceManager = gameStore.getResourceManager()
    if (!resourceManager) return 0

    try {
        const inventory = resourceManager.getGlobalInventory()
        const currentAmount = inventory.getResource(resourceType)
        const maxStack = resourceManager.getStackSize(resourceType)
        return maxStack - currentAmount
    } catch (error) {
        console.error('Error getting player inventory space:', error)
        return 0
    }
}

const collectSingleResource = (resourceType: ResourceType, amount: number) => {
    if (!buildingData.value) return

    const building = buildingData.value
    const availableSpace = getPlayerInventorySpace(resourceType)

    if (availableSpace <= 0) {
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'warning',
                title: 'Inventaire plein',
                message: `Impossible de récolter ${getResourceName(resourceType)}, votre inventaire est plein.`
            }
        }))
        return
    }

    const amountToCollect = Math.min(amount, availableSpace)

    try {
        // Retirer du bâtiment
        const removed = building.removeResourceFromBuilding(resourceType, amountToCollect)

        if (removed > 0) {
            // Ajouter à l'inventaire du joueur
            const added = gameStore.addResource(resourceType, removed)

            // Si on n'a pas pu tout ajouter, remettre la différence dans le bâtiment
            if (added < removed) {
                building.addResourceToBuilding(resourceType, removed - added)
            }

            // Forcer la mise à jour de l'affichage
            resourceUpdateTrigger.value++

            // Notification de succès
            window.dispatchEvent(new CustomEvent('game:notification', {
                detail: {
                    type: 'success',
                    title: 'Ressource récoltée',
                    message: `+${added} ${getResourceName(resourceType)}`
                }
            }))

            // Émettre un événement pour mettre à jour d'autres parties du jeu
            window.dispatchEvent(new CustomEvent('game:resourceCollected', {
                detail: {
                    building,
                    resourceType,
                    amount: added,
                    source: 'individual_collect'
                }
            }))
        }
    } catch (error) {
        console.error('Error collecting resource:', error)
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'error',
                title: 'Erreur',
                message: 'Impossible de récolter cette ressource.'
            }
        }))
    }
}

const collectAllResources = () => {
    if (!buildingData.value) return

    const building = buildingData.value
    let totalCollected = 0
    let totalSkipped = 0

    storedResources.value.forEach(({ resourceType, current }) => {
        if (current > 0) {
            const availableSpace = getPlayerInventorySpace(resourceType)
            const amountToCollect = Math.min(current, availableSpace)

            if (amountToCollect > 0) {
                const removed = building.removeResourceFromBuilding(resourceType, amountToCollect)
                if (removed > 0) {
                    const added = gameStore.addResource(resourceType, removed)
                    totalCollected += added

                    // Si on n'a pas pu tout ajouter, remettre la différence
                    if (added < removed) {
                        building.addResourceToBuilding(resourceType, removed - added)
                    }
                }
            } else {
                totalSkipped += current
            }
        }
    })

    if (totalCollected > 0) {
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'success',
                title: 'Ressources récoltées',
                message: `${totalCollected} ressource${totalCollected > 1 ? 's' : ''} récoltée${totalCollected > 1 ? 's' : ''}${totalSkipped > 0 ? ` (${totalSkipped} ignorée${totalSkipped > 1 ? 's' : ''} - inventaire plein)` : ''}`
            }
        }))

        window.dispatchEvent(new CustomEvent('game:resourcesCollected', {
            detail: { building, totalCollected, totalSkipped }
        }))
    } else if (totalSkipped > 0) {
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'warning',
                title: 'Inventaire plein',
                message: 'Impossible de récolter les ressources, votre inventaire est plein.'
            }
        }))
    }
}

const canCollectResource = (resourceType: ResourceType, amount: number): boolean => {
    const availableSpace = getPlayerInventorySpace(resourceType)
    return availableSpace > 0
}

const handleOverlayClick = () => {
    handleClose()
}

const handleAction = (actionKey: string) => {
    if (!buildingData.value) return

    switch (actionKey) {
        case 'collect':
            collectAllResources()
            break
    }
}

// Methods
const getResourceName = (resourceType: ResourceType): string => {
    const names: Record<ResourceType, string> = {
        [ResourceType.WOOD]: '🪵 Bois',
        [ResourceType.PLANKS]: '🪵 Planches',
        [ResourceType.STONE]: '🪨 Pierre',
        [ResourceType.METAL_ORE]: '⛏️ Minerai de métal',
        [ResourceType.COAL_ORE]: '⚫ Minerai de charbon',
        [ResourceType.METAL]: '🔩 Métal',
        [ResourceType.FOOD]: '🍞 Nourriture',
        [ResourceType.TOOLS]: '🔨 Outils',
        [ResourceType.ENERGY]: '⚡ Énergie',
        [ResourceType.POPULATION]: '👥 Population'
    }
    return names[resourceType] || resourceType
}


// Keyboard handling
watch(isVisible, (visible) => {
    if (visible) {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose()
            }
        }

        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }
})
watch(() => buildingData.value, (newBuilding) => {
    if (newBuilding) {
        const handleResourceChange = (event: CustomEvent) => {
            if (event.detail.buildingId === newBuilding.getBuildingId()) {
                console.log('Building resource changed, forcing update')
                resourceUpdateTrigger.value++
            }
        }

        const handleResourceCollected = (event: CustomEvent) => {
            if (event.detail.building === newBuilding) {
                console.log('Resource collected, forcing update')
                resourceUpdateTrigger.value++
            }
        }

        window.addEventListener('game:buildingResourceChanged', handleResourceChange)
        window.addEventListener('game:resourceCollected', handleResourceCollected)

        return () => {
            window.removeEventListener('game:buildingResourceChanged', handleResourceChange)
            window.removeEventListener('game:resourceCollected', handleResourceCollected)
        }
    }
}, { immediate: true })

watch(() => {
    if (!buildingData.value) return null
    return buildingData.value.getAllBuildingResources()
}, (newResources) => {
    if (newResources) {
        console.log('Building resources changed directly:', newResources)
        resourceUpdateTrigger.value++
    }
}, { deep: true })
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
