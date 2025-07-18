<!-- src/components/ui/BuildingInfoModal.vue -->
<template>
    <!-- Modal Overlay -->
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isVisible" class="modal-overlay fixed inset-0 flex items-center justify-center p-4 !z-[9999]"
                 @click="handleOverlayClick">
                <div class="modal-content relative w-full max-w-[1020px] mx-auto" @click.stop>
                    <div class="relative m-auto h-128 w-full flex gap-6">
                        <button class="absolute top-0 -right-4 translate-x-1/1 h-18 aspect-square cursor-pointer hover:scale-105 transition duration-150 ease-in-out" @click="handleClose">
                            <img src="/assets/game/ui/building-cancel-button.png"
                                 class="w-auto h-full pixelated"
                                 alt="cancel-button">
                        </button>

                        <div class="flex flex-col gap-6 w-[30%]">
                            <div class="pixel-border pixel-border-dirt w-full flex items-center gap-6 p-1 h-fit">
                                <div class="pixel-border pixel-border-stone relative h-full w-16">
                                    <p class="absolute left-1/2 -bottom-0.5 -translate-x-1/2">
                                        <img :src="`/assets/game/buildings/icons/${buildingType}.png`" class="h-15 max-w-14 pixelated" :alt="buildingType">
                                    </p>
                                </div>
                                <h2 class="text-xl font-bold text-white">
                                    {{ buildingDisplayName }}
                                </h2>
                            </div>

                            <button
                                class="w-8 h-8 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                @click="handleClose">
                                <ActionIcon icon="close" :size="16" />
                            </button>
                        </div>

                        <div class="pixel-border pixel-border-dark-dirt w-[70%] flex flex-col-reverse">
                            <div class="pixel-border pixel-border-dirt h-16 w-full h-full">
                                <div class="px-8 py-10 flex flex-col gap-10 scroll overflow-auto max-h-full">

                                    <div v-if="activeTab === 'resources'">
                                        <div v-if="hasResources" class="space-y-4">
                                            <div v-for="resource in storedResources" :key="resource.resourceType" class="space-y-3">
                                                <div class="pixel-border pixel-border-stone rounded-lg p-4 bg-slate-50/50 backdrop-blur-sm">
                                                    <div class="flex items-center justify-between mb-3">
                                                        <div class="flex items-center gap-3">
                                                            <div class="text-2xl">{{ getResourceIcon(resource.resourceType) }}</div>
                                                            <div>
                                                                <h4 class="font-semibold text-slate-800">{{ getResourceName(resource.resourceType) }}</h4>
                                                                <p class="text-sm text-slate-600">
                                                                    {{ resource.current }}/{{ resource.capacity }}
                                                                    <span v-if="resource.productionRate" class="text-green-600">
                                                                        (+{{ resource.productionRate }}/min)
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="w-full bg-slate-200 rounded-full h-3 mb-4 overflow-hidden">
                                                        <div class="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500 ease-out shadow-inner"
                                                            :style="{ width: resource.percentage + '%' }">
                                                        </div>
                                                    </div>

                                                    <div class="flex gap-2 justify-between">
                                                        <div class="flex gap-2">
                                                            <button
                                                                class="pixel-border flex gap-1.5 items-center justify-center pixel-border-gold px-3 py-1"
                                                                :class="{
                                                                    'opacity-50 cursor-not-allowed': !canCollectResource(resource.resourceType, resource.current),
                                                                    'pixel-border-gold': resource.current > 0,
                                                                    'pixel-border-stone': resource.current == 0
                                                                }"
                                                                :disabled="!canCollectResource(resource.resourceType, resource.current)"
                                                                @click="collectSingleResource(resource.resourceType, resource.current)">
                                                                📤 Collecter
                                                            </button>
                                                        </div>

                                                        <div class="flex gap-2">
                                                            <button
                                                                class="pixel-border flex gap-1.5 items-center justify-center pixel-border-blue px-3 py-1"
                                                                :class="{
                                                                    'opacity-50 cursor-not-allowed': !canDepositResource(resource.resourceType),
                                                                    'pixel-border-blue': canDepositResource(resource.resourceType),
                                                                    'pixel-border-stone': !canDepositResource(resource.resourceType)
                                                                }"
                                                                :disabled="!canDepositResource(resource.resourceType)"
                                                                @click="depositSingleResource(resource.resourceType)"
                                                                :title="`Déposer ${getResourceName(resource.resourceType)} (Vous avez: ${getPlayerInventoryAmount(resource.resourceType)}, Espace libre: ${getBuildingFreeSpace(resource.resourceType)})`">
                                                                📥 Déposer
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div class="mt-2 text-xs text-slate-500">
                                                        Votre inventaire: {{ getPlayerInventoryAmount(resource.resourceType) }} | 
                                                        Espace libre: {{ getBuildingFreeSpace(resource.resourceType) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-else class="text-center py-20 text-slate-600">
                                            <div class="text-4xl mb-4">📦</div>
                                            <p class="mb-4">Aucune ressource stockée</p>
                                            
                                            <!-- Bouton pour déposer même quand le bâtiment est vide -->
                                            <button
                                                v-if="Object.values(ResourceType).some(rt => canDepositResource(rt))"
                                                class="pixel-border pixel-border-blue px-6 py-3 flex items-center gap-3 mx-auto"
                                                @click="depositAllPossibleResources">
                                                <span class="text-xl">📥</span>
                                                <span class="font-semibold">Déposer des ressources</span>
                                            </button>
                                        </div>

                                        <div v-if="hasResources" class="mt-6 flex gap-3 justify-center">
                                            <button
                                                v-if="storedResources.some(r => r.current > 0)"
                                                class="pixel-border pixel-border-gold px-6 py-3 flex items-center gap-3"
                                                @click="collectAllResources">
                                                <span class="text-xl">📤</span>
                                                <span class="font-semibold">Tout collecter</span>
                                            </button>

                                            <button
                                                v-if="storedResources.some(r => canDepositResource(r.resourceType))"
                                                class="pixel-border pixel-border-blue px-6 py-3 flex items-center gap-3"
                                                @click="depositAllPossibleResources">
                                                <span class="text-xl">📥</span>
                                                <span class="font-semibold">Tout déposer</span>
                                            </button>
                                        </div>
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
                                    Ressources stockées
                                </h3>
                                <div class="space-y-2">
                                    <ResourceBar v-for="[resourceType, amount] in storedResources" :key="resourceType"
                                        :resource-type="resourceType" :current="amount"
                                        :max="getResourceCapacity(resourceType)" :width="280" />
                                </div>
                            </div>

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
import { ref, computed, watch, onMounted, onUnmounted, nextTick, toRaw } from 'vue'
import { useGameStore } from '@/game/stores/gameStore'
import { ResourceType } from '@/game/types/ResourceSystemTypes'

const gameStore = useGameStore()
const activeTab = ref<'resources' | 'workers'>('resources')
let previousResourcesState = ref<Map<any, number>>(new Map())
const resourceUpdateTrigger = ref(0)
const availableWorkers = ref(0)

const isVisible = computed(() => gameStore.state?.showBuildingInfo || false)

const buildingData = computed(() => gameStore.state?.currentBuildingInfo || null)

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

const buildingLevel = computed(() => {
    // Placeholder - you can implement building levels later
    return 1
})

const getPlayerInventoryAmount = (resourceType: ResourceType): number => {
    const resourceManager = gameStore.getResourceManager()
    if (!resourceManager) return 0

    try {
        const inventory = resourceManager.getGlobalInventory()
        return inventory.getResource(resourceType)
    } catch (error) {
        console.error('Error getting player inventory amount:', error)
        return 0
    }
}

const getBuildingFreeSpace = (resourceType: ResourceType): number => {
    if (!buildingData.value) return 0
    
    const capacity = buildingData.value.getBuildingResourceCapacity(resourceType)
    const current = buildingData.value.getBuildingResource(resourceType)
    return Math.max(0, capacity - current)
}

const canDepositResource = (resourceType: ResourceType): boolean => {
    const playerAmount = getPlayerInventoryAmount(resourceType)
    const buildingSpace = getBuildingFreeSpace(resourceType)
    return playerAmount > 0 && buildingSpace > 0
}

const handleResourceDeposited = (event: CustomEvent) => {
    if (buildingData.value && event.detail.building === buildingData.value) {
        resourceUpdateTrigger.value++
        
        nextTick(() => {
            resourceUpdateTrigger.value++
        })
    }
}

const depositSingleResource = (resourceType: ResourceType, amount?: number) => {
    if (!buildingData.value) {
        console.error('❌ No building data available')
        return
    }

    const building = toRaw(buildingData.value)
    
    const playerAmount = getPlayerInventoryAmount(resourceType)
    const buildingSpace = getBuildingFreeSpace(resourceType)

    if (playerAmount <= 0) {
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'warning',
                title: 'Inventaire vide',
                message: `Vous n'avez pas de ${getResourceName(resourceType)} à déposer.`
            }
        }))
        return
    }

    if (buildingSpace <= 0) {
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'warning',
                title: 'Bâtiment plein',
                message: `Le bâtiment ne peut plus stocker de ${getResourceName(resourceType)}.`
            }
        }))
        return
    }

    const amountToDeposit = amount ? Math.min(amount, playerAmount, buildingSpace) : Math.min(playerAmount, buildingSpace)

    try {
        const removed = gameStore.removeResource(resourceType, amountToDeposit)

        if (removed > 0) {
            const added = building.addResourceToBuilding(resourceType, removed)

            if (added < removed) {
                const refunded = removed - added
                gameStore.addResource(resourceType, refunded)
            }

            resourceUpdateTrigger.value++

            window.dispatchEvent(new CustomEvent('game:notification', {
                detail: {
                    type: 'success',
                    title: 'Ressource déposée',
                    message: `${added} ${getResourceName(resourceType)} déposé${added > 1 ? 's' : ''}`
                }
            }))

            window.dispatchEvent(new CustomEvent('game:resourceDeposited', {
                detail: { building: buildingData.value, resourceType, amount: added, source: 'player_deposit' }
            }))

            nextTick(() => {
                resourceUpdateTrigger.value++
            })
        } else {
            console.error('❌ Failed to remove resource from player inventory')
        }
    } catch (error) {
        console.error('❌ Error depositing resource:', error)
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'error',
                title: 'Erreur',
                message: 'Impossible de déposer cette ressource.'
            }
        }))
    }
}

const depositAllPossibleResources = () => {
    if (!buildingData.value) {
        console.error('❌ No building data available')
        return
    }

    const building = toRaw(buildingData.value)
    
    let totalDeposited = 0
    let totalSkipped = 0

    const capacities = building.getAllBuildingResourceCapacities()
    capacities.forEach((capacity, resourceType) => {
        if (capacity > 0) {
            const playerAmount = getPlayerInventoryAmount(resourceType)
            const buildingSpace = getBuildingFreeSpace(resourceType)
            const amountToDeposit = Math.min(playerAmount, buildingSpace)

            if (amountToDeposit > 0) {
                try {
                    const removed = gameStore.removeResource(resourceType, amountToDeposit)
                    if (removed > 0) {
                        const added = building.addResourceToBuilding(resourceType, removed)
                        totalDeposited += added

                        if (added < removed) {
                            gameStore.addResource(resourceType, removed - added)
                        }
                    }
                } catch (error) {
                    console.error(`    ❌ Error depositing ${resourceType}:`, error)
                }
            } else if (playerAmount > 0 && buildingSpace <= 0) {
                totalSkipped += playerAmount
            }
        }
    })

    resourceUpdateTrigger.value++
    
    nextTick(() => {
        resourceUpdateTrigger.value++
    })

    if (totalDeposited > 0) {
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'success',
                title: 'Ressources déposées',
                message: `${totalDeposited} ressource${totalDeposited > 1 ? 's' : ''} déposée${totalDeposited > 1 ? 's' : ''}${totalSkipped > 0 ? ` (${totalSkipped} ignorée${totalSkipped > 1 ? 's' : ''} - bâtiment plein)` : ''}`
            }
        }))

        window.dispatchEvent(new CustomEvent('game:resourcesDeposited', {
            detail: { building: buildingData.value, totalDeposited, totalSkipped }
        }))
    } else if (totalSkipped > 0) {
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'warning',
                title: 'Bâtiment plein',
                message: 'Impossible de déposer les ressources, le bâtiment est plein.'
            }
        }))
    } else {
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'info',
                title: 'Aucune ressource',
                message: 'Vous n\'avez aucune ressource compatible à déposer.'
            }
        }))
    }
}

const storedResources = computed(() => {
    resourceUpdateTrigger.value 
    if (!buildingData.value) return []

    const resources = buildingData.value.getAllBuildingResources()
    return Array.from(resources.entries()).filter(([_, amount]) => amount > 0)
})

const hasResources = computed(() => storedResources.value.length > 0)

const maxWorkers = computed(() => {
    const building = buildingData.value
    if (!building) return 0
    return building.getMaxWorkers() || 0
})

const assignedWorkerCount = computed(() => {
    resourceUpdateTrigger.value 
    const building = buildingData.value
    if (!building) return 0
    return building.getAssignedWorkerCount() || 0
})

    // Collect resources action for storage buildings
    if (type === 'sawmill' && hasResources.value) {
        const hasAnyResources = storedResources.value.some(([_, amount]) => amount > 0)
        actions.push({
            key: 'collect',
            label: 'Collecter tout',
            icon: 'plus',
            variant: 'success',
            disabled: !hasAnyResources
        })
    }

    return actions
})

const canIncrement = computed(() => {
    const result = assignedWorkerCount.value < maxWorkers.value && availableWorkers.value > 0
    return result
})

const canDecrement = computed(() => {
    const result = assignedWorkerCount.value > 0
    return result
})

const workerEfficiency = computed(() => {
    if (maxWorkers.value === 0) return 1
    return assignedWorkerCount.value / maxWorkers.value
})

// Methods
const getResourceIcon = (resourceType: ResourceType): string => {
    const icons: Record<ResourceType, string> = {
        [ResourceType.WOOD]: '🪵',
        [ResourceType.PLANKS]: '🪵',
        [ResourceType.STONE]: '🪨',
        [ResourceType.METAL_ORE]: '⛏️',
        [ResourceType.COAL_ORE]: '⚫',
        [ResourceType.METAL]: '🔩',
        [ResourceType.FOOD]: '🍞',
        [ResourceType.TOOLS]: '🔨',
        [ResourceType.ENERGY]: '⚡',
        [ResourceType.POPULATION]: '👥'
    }
    return icons[resourceType] || '📦'
}

const getResourceName = (resourceType: ResourceType): string => {
    const names: Record<ResourceType, string> = {
        [ResourceType.WOOD]: 'Bois',
        [ResourceType.PLANKS]: 'Planches',
        [ResourceType.STONE]: 'Pierre',
        [ResourceType.METAL_ORE]: 'Minerai de métal',
        [ResourceType.COAL_ORE]: 'Minerai de charbon',
        [ResourceType.METAL]: 'Métal',
        [ResourceType.FOOD]: 'Nourriture',
        [ResourceType.TOOLS]: 'Outils',
        [ResourceType.ENERGY]: 'Énergie',
        [ResourceType.POPULATION]: 'Population'
    }
    return names[resourceType] || resourceType
}

const getProductionRate = (resourceType: ResourceType): number | undefined => {
    const type = buildingData.value?.getType()

    if (type === 'sawmill' && resourceType === ResourceType.WOOD) return 8
    if (type === 'sawmill' && resourceType === ResourceType.PLANKS) return 12
    if (type === 'mine' && resourceType === ResourceType.STONE) return 6
    if (type === 'farm' && resourceType === ResourceType.FOOD) return 10

    return undefined
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

const canCollectResource = (resourceType: ResourceType, amount: number): boolean => {
    const availableSpace = getPlayerInventorySpace(resourceType)
    return availableSpace > 0
}

const collectSingleResource = (resourceType: ResourceType, amount: number) => {
    if (!buildingData.value) {
        console.error('❌ No building data available for collection')
        return
    }

    const building = toRaw(buildingData.value)
    
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
        const removed = building.removeResourceFromBuilding(resourceType, amountToCollect)

        if (removed > 0) {
            const added = gameStore.addResource(resourceType, removed)

            if (added < removed) {
                const refunded = removed - added
                building.addResourceToBuilding(resourceType, refunded)
            }

            resourceUpdateTrigger.value++

            window.dispatchEvent(new CustomEvent('game:notification', {
                detail: {
                    type: 'success',
                    title: 'Ressource récoltée',
                    message: `+${added} ${getResourceName(resourceType)}`
                }
            }))

            window.dispatchEvent(new CustomEvent('game:resourceCollected', {
                detail: { building: buildingData.value, resourceType, amount: added, source: 'individual_collect' }
            }))

            nextTick(() => {
                resourceUpdateTrigger.value++
            })
        } else {
            console.error('❌ Failed to remove resource from building')
        }
    } catch (error) {
        console.error('❌ Error collecting resource:', error)
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
    if (!buildingData.value) {
        console.error('❌ No building data available for collection')
        return
    }

    const building = toRaw(buildingData.value)
    
    let totalCollected = 0

    storedResources.value.forEach(({ resourceType, current }) => {
        if (current > 0) {
            const availableSpace = getPlayerInventorySpace(resourceType)
            const amountToCollect = Math.min(current, availableSpace)

            if (amountToCollect > 0) {
                try {
                    const removed = building.removeResourceFromBuilding(resourceType, amountToCollect)
                    if (removed > 0) {
                        const added = gameStore.addResource(resourceType, removed)
                        totalCollected += added

                        if (added < removed) {
                            building.addResourceToBuilding(resourceType, removed - added)
                        }
                    }
                } catch (error) {
                    console.error(`    ❌ Error collecting ${resourceType}:`, error)
                }
            } else {
                totalSkipped += current
            }
        }
    })

    resourceUpdateTrigger.value++
    
    nextTick(() => {
        resourceUpdateTrigger.value++
    })

    if (totalCollected > 0) {
        // Emit event to update the main scene
        window.dispatchEvent(new CustomEvent('game:resourcesCollected', {
            detail: { building: buildingData.value, totalCollected, totalSkipped }
        }))
    }
}

const incrementWorker = () => {
    if (!buildingData.value || !canIncrement.value) return

    window.dispatchEvent(new CustomEvent('game:assignWorkerToBuilding', {
        detail: { building: buildingData.value }
    }))
}

const decrementWorker = () => {
    if (!buildingData.value || !canDecrement.value) return

    window.dispatchEvent(new CustomEvent('game:unassignWorkerFromBuilding', {
        detail: { building: buildingData.value }
    }))
}

const handleClose = () => {
    gameStore.hideBuildingInfo()
}

const handleOverlayClick = () => {
    handleClose()
}

onMounted(() => {
    const handleAvailableWorkersUpdate = (event: CustomEvent) => {
        availableWorkers.value = event.detail.count || 0
    }

    const handleWorkerAssignment = (event: CustomEvent) => {
        if (buildingData.value && event.detail.buildingId === buildingData.value.getBuildingId()) {
            resourceUpdateTrigger.value++
            window.dispatchEvent(new CustomEvent('game:requestAvailableWorkers'))
        }
    }

    const handleWorkerUnassignment = (event: CustomEvent) => {
        if (buildingData.value && event.detail.buildingId === buildingData.value.getBuildingId()) {
            resourceUpdateTrigger.value++

            window.dispatchEvent(new CustomEvent('game:requestAvailableWorkers'))
        }
    }

    window.addEventListener('game:resourceDeposited', handleResourceDeposited)
    window.addEventListener('game:availableWorkersUpdate', handleAvailableWorkersUpdate as EventListener)
    window.addEventListener('game:workerAssignedToBuilding', handleWorkerAssignment as EventListener)
    window.addEventListener('game:workerUnassignedFromBuilding', handleWorkerUnassignment as EventListener)

    window.dispatchEvent(new CustomEvent('game:requestAvailableWorkers'))

    onUnmounted(() => {
        window.removeEventListener('game:resourceDeposited', handleResourceDeposited)
        window.removeEventListener('game:availableWorkersUpdate', handleAvailableWorkersUpdate as EventListener)
        window.removeEventListener('game:workerAssignedToBuilding', handleWorkerAssignment as EventListener)
        window.removeEventListener('game:workerUnassignedFromBuilding', handleWorkerUnassignment as EventListener)
    })
})

watch(() => buildingData.value, (newBuilding) => {
    if (newBuilding) {
        setTimeout(() => {
            autoFixStorage()
        }, 100)
        
        const handleResourceChange = (event: CustomEvent) => {
            if (event.detail.buildingId === newBuilding.getBuildingId()) {
                resourceUpdateTrigger.value++
            }
        }

        const handleResourceCollected = (event: CustomEvent) => {
            if (event.detail.building === newBuilding) {
                resourceUpdateTrigger.value++
            }
        }

        window.addEventListener('game:buildingResourceChanged', handleResourceChange as EventListener)
        window.addEventListener('game:resourceCollected', handleResourceCollected as EventListener)

        return () => {
            window.removeEventListener('game:buildingResourceChanged', handleResourceChange as EventListener)
            window.removeEventListener('game:resourceCollected', handleResourceCollected as EventListener)
        }
    }
}, { immediate: true })

watch(() => {
    if (!buildingData.value) return null
    return buildingData.value.getAllBuildingResources()
}, (newResources) => {
    if (newResources) {
        resourceUpdateTrigger.value++
    }
}, { deep: true })

watch(assignedWorkerCount, (newCount, oldCount) => {
    if (newCount !== oldCount) {
        resourceUpdateTrigger.value++
    }
})

watch(isVisible, (visible) => {
    if (visible) {
        window.dispatchEvent(new CustomEvent('game:requestAvailableWorkers'))
        
        if (buildingData.value) {
            resourceUpdateTrigger.value++
            nextTick(() => {
                resourceUpdateTrigger.value++
            })
        }

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


watch(() => {
    if (!buildingData.value) return new Map()
    return buildingData.value.getAllBuildingResources()
}, (newResources, oldResources) => {
    if (newResources && newResources.size > 0) {
        let hasChanged = false
        
        if (!oldResources || oldResources.size !== newResources.size) {
            hasChanged = true
        } else {
            for (const [resourceType, amount] of newResources.entries()) {
                if (oldResources.get(resourceType) !== amount) {
                    hasChanged = true
                    break
                }
            }
        }
        
        if (hasChanged) {
            resourceUpdateTrigger.value++
            previousResourcesState.value = new Map(newResources)
        }
    }
}, { deep: true, immediate: true })

const autoFixStorage = () => {
    if (!buildingData.value) return
    
    const building = buildingData.value
    const resourceStorage = (building as any).resourceStorage
    
    if (!resourceStorage) return
    
    if (!(resourceStorage.capacity instanceof Map) || !(resourceStorage.stored instanceof Map)) {
        fixBuildingStorage()
        resourceUpdateTrigger.value++
    }
}

const fixBuildingStorage = () => {
    if (!buildingData.value) {
        return
    }

    const building = buildingData.value
    
    const resourceStorage = (building as any).resourceStorage
    
    if (!resourceStorage) {
        return
    }
    
    if (!(resourceStorage.capacity instanceof Map)) {
        resourceStorage.capacity = new Map(Object.entries(resourceStorage.capacity || {}))
    }
    
    if (!(resourceStorage.stored instanceof Map)) {
        resourceStorage.stored = new Map(Object.entries(resourceStorage.stored || {}))
    }
    
    const buildingType = building.getType()
    
    const buildingRegistry = (building as any).buildingRegistry
    const config = buildingRegistry?.getBuildingConfig(buildingType)
    
    if (config && config.storageCapacities) {
        Object.entries(config.storageCapacities).forEach(([resourceType, capacity]) => {
            if (typeof capacity === 'number' && capacity > 0) {
                resourceStorage.capacity.set(resourceType, capacity)
                
                if (!resourceStorage.stored.has(resourceType)) {
                    resourceStorage.stored.set(resourceType, 0)
                }
            }
        })
    }
}

</script>

<style scoped>
.modal-overlay {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
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

.pixel-border-blue {
    border-color: #3b82f6 !important;
    color: #1e40af;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.pixel-border-blue:hover:not(:disabled) {
    background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.pixel-border-blue:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.pixel-border:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.inventory-info {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 0.5rem;
    padding: 0.25rem 0.5rem;
    background: rgba(148, 163, 184, 0.1);
    border-radius: 0.25rem;
}

.resource-progress-bar {
    position: relative;
    overflow: hidden;
}

.resource-progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
    animation: shine 2s ease-in-out infinite;
}

@keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

@media (max-width: 640px) {
    .resource-actions {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .resource-actions button {
        width: 100%;
        justify-content: center;
    }
}
</style>