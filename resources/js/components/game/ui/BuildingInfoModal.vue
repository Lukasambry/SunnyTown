<template>
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
                                <h2 class="!text-slate-800 !text-3xl" v-text="buildingDisplayName"/>
                            </div>

                            <div class="pixel-border pixel-border-stone w-full p-2 h-full flex flex-col gap-6">
                                <div class="flex justify-between">
                                    <img v-for="index in 8" :key="`${index}_dots`"
                                         src="/assets/game/ui/select_dots.png"
                                         class="h-5 w-auto opacity-50 pixelated"
                                         alt="dots">
                                </div>
                                <div class="p-2 flex flex-col gap-6">
                                    <div class="flex justify-between items-center h-20">
                                        <div class="flex justify-center items-center gap-4 w-full">
                                            <i class="!text-slate-900">📍</i>
                                            <span class="!text-slate-900">{{ positionText }}</span>
                                        </div>
                                        <div class="h-full px-0.5 bg-slate-200"></div>
                                        <div class="flex justify-center items-center gap-4 w-full">
                                            <i class="!text-slate-900">⚙️</i>
                                            <span class="!text-slate-900">{{ buildingLevel || 1 }}</span>
                                        </div>
                                    </div>

                                    <div class="!text-slate-900 text-sm">
                                        {{ buildingDescription }}
                                    </div>

                                    <button
                                        class="pixel-border pixel-border-stone w-full p-2 !text-slate-900 hover:bg-slate-100 transition-colors"
                                        @click="handleClose">
                                        Fermer
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="pixel-border pixel-border-dark-dirt w-[70%] flex flex-col-reverse">
                            <div class="pixel-border pixel-border-dirt h-16 w-full h-full">
                                <div class="px-8 py-10 flex flex-col gap-10 scroll overflow-auto max-h-full">

                                    <div v-if="activeTab === 'resources'">
                                        <div v-if="hasResources" class="space-y-9">
                                            <div v-for="resource in storedResources" :key="resource.resourceType" class="flex gap-5 w-full">
                                                <div class="relative h-20">
                                                    <div class="pixel-border pixel-border-dark-dirt h-full aspect-square flex items-center justify-center pb-2">
                                                        <div class="h-12 w-auto pixelated text-3xl">
                                                            <img :src="`/assets/game/ui/resources/${resource.resourceType}.png`" class="h-12 w-auto pixelated" :alt="resource.resourceType">
                                                        </div>
                                                    </div>
                                                    <div v-if="resource.productionRate" class="position-absolute bottom-1.5 px-0.5 pixel-border pixel-border-stone max-h-4.5 text-xs w-fit left-1/2 -translate-x-1/2 !text-slate-900">
                                                        {{ resource.productionRate }}/min
                                                    </div>
                                                </div>

                                                <div class="flex gap-4 items-center w-full py-1">
                                                    <div class="flex flex-col gap-3 w-full">
                                                        <div class="flex justify-between w-full">
                                                            <div class="flex gap-4 items-center">
                                                                <div class="pixel-border pixel-border-stone w-fit text-xs px-1 max-h-4.5 flex justify-center items-center !text-slate-900 !text-base line-height-0">
                                                                    {{ getResourceName(resource.resourceType) }}
                                                                </div>
                                                                <p v-if="resource.productionRate" class="!text-slate-700">{{ resource.productionRate }}/min</p>
                                                            </div>
                                                            <p class="!text-base">{{ resource.current }}/{{ resource.capacity }}</p>
                                                        </div>
                                                        <div class="pixel-progress">
                                                            <span class="pixel-progress-bar bg-emerald-400" :style="{ width: `${Math.round(((resource.current * 100) / resource.capacity))}%` }"></span>
                                                        </div>
                                                    </div>
                                                    <div class="flex flex-col justify-end items-center">
                                                        <button
                                                            class="pixel-border flex gap-1.5 items-center justify-center pixel-border-gold h-full !text-xl px-3 py-1"
                                                            :class="{
                                                                'opacity-50 cursor-not-allowed': !canCollectResource(resource.resourceType, resource.current),
                                                                'pixel-border-gold': resource.current > 0,
                                                                'pixel-border-stone': resource.current == 0
                                                            }"
                                                            :disabled="!canCollectResource(resource.resourceType, resource.current)"
                                                            @click="collectSingleResource(resource.resourceType, resource.current)">
                                                            Collecter
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-else class="text-center py-20 !text-slate-600">
                                            <div class="text-4xl mb-4">📦</div>
                                            <p>Aucune ressource stockée</p>
                                        </div>

                                        <!--
                                        <div v-if="hasResources && storedResources.some(r => r.current > 0)" class="mt-8 flex justify-center">
                                            <button
                                                class="pixel-border pixel-border-gold px-8 py-3 !text-xl flex items-center gap-3"
                                                @click="collectAllResources">
                                                <span>📦</span>
                                                Tout Collecter
                                            </button>
                                        </div>
                                        -->
                                    </div>

                                    <div v-if="activeTab === 'workers'">
                                        <div class="space-y-5">
                                            <div class="flex gap-5 w-full">
                                                <div class="relative h-20">
                                                    <div class="pixel-border pixel-border-dark-dirt h-full aspect-square flex items-center justify-center pb-2">
                                                        <div class="h-12 w-auto pixelated text-2xl">👷</div>
                                                    </div>
                                                </div>

                                                <div class="flex gap-4 items-center w-full py-1">
                                                    <div class="flex flex-col gap-3 w-full">
                                                        <div class="flex justify-between w-full">
                                                            <div class="pixel-border pixel-border-stone w-fit text-xs px-1 max-h-4.5 flex justify-center items-center !text-slate-900 !text-base line-height-0">
                                                                {{ workerTypeName }}
                                                            </div>
                                                            <p class="!text-base">{{ assignedWorkerCount }}/{{ maxWorkers }}</p>
                                                        </div>
                                                        <div class="pixel-progress" :class="`after:w-[${Math.round(workerProgressPercentage)}%] after:!bg-blue-500`"></div>
                                                    </div>
                                                    <div class="flex gap-2 items-center">
                                                        <button
                                                            class="pixel-border pixel-border-stone w-8 h-8 flex items-center justify-center !text-slate-900 hover:bg-slate-100"
                                                            :class="{ 'opacity-50 cursor-not-allowed': !canDecrement }"
                                                            :disabled="!canDecrement"
                                                            @click="decrementWorker">
                                                            -
                                                        </button>
                                                        <button
                                                            class="pixel-border pixel-border-stone w-8 h-8 flex items-center justify-center !text-slate-900 hover:bg-slate-100"
                                                            :class="{ 'opacity-50 cursor-not-allowed': !canIncrement }"
                                                            :disabled="!canIncrement"
                                                            @click="incrementWorker">
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="pixel-border pixel-border-stone p-4 !text-slate-900">
                                                <div class="flex justify-between items-center mb-2">
                                                    <span class="text-sm">Ouvriers disponibles:</span>
                                                    <span class="font-bold">{{ availableWorkers }}</span>
                                                </div>
                                                <div class="flex justify-between items-center">
                                                    <span class="text-sm">Efficacité du bâtiment:</span>
                                                    <span class="font-bold">{{ Math.round(workerEfficiency * 100) }}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="maxWorkers === 0" class="text-center py-20 !text-slate-600">
                                            <div class="text-4xl mb-4">🏭</div>
                                            <p>Ce bâtiment ne nécessite pas d'ouvriers</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Tab Navigation -->
                            <div class="flex gap-5">
                                <div
                                    class="w-fit no-bottom py-1 pb-2 px-3 flex gap-3 items-center !text-slate-900 cursor-pointer pixel-no-bottom"
                                    :class="{ 'pixel-border pixel-border-dirt': activeTab === 'resources' }"
                                    @click="activeTab = 'resources'">
                                    <img src="/assets/game/ui/basket.png" class="h-10 pixelated" alt="Resources">
                                    <h3 class="!text-slate-800 text-3xl">Ressources</h3>
                                </div>

                                <div
                                    class="w-fit no-bottom py-1 pb-2 px-3 flex gap-3 items-center !text-slate-900 cursor-pointer pixel-no-bottom"
                                    :class="{ 'pixel-border pixel-border-dirt': activeTab === 'workers' }"
                                    @click="activeTab = 'workers'">
                                    <img src="/assets/game/ui/playercount.png" class="h-10 pixelated" alt="Workers">
                                    <h3 class="!text-slate-800 text-3xl">Ouvriers</h3>
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
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useGameStore } from '@/game/stores/gameStore'
import { ResourceType } from '@/game/types/ResourceSystemTypes'
import BuildingIcon from './BuildingIcon.vue'

interface StoredResource {
    resourceType: ResourceType
    current: number
    capacity: number
    percentage: number
    productionRate?: number
}

// Reactive data
const gameStore = useGameStore()
const activeTab = ref<'resources' | 'workers'>('resources')
const resourceUpdateTrigger = ref(0)
const availableWorkers = ref(0)

// Computed properties
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

const buildingType = computed(() => {
    return buildingData.value?.getType() ?? "default"
})

const positionText = computed(() => {
    if (!buildingData.value) return 'Inconnue'
    const pos = buildingData.value.getPosition()
    const tileX = Math.floor(pos.x / 16)
    const tileY = Math.floor(pos.y / 16)
    return `${tileX}, ${tileY}`
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

const storedResources = computed(() => {
    resourceUpdateTrigger.value // Force re-evaluation
    if (!buildingData.value) return []

    const capacities = buildingData.value.getAllBuildingResourceCapacities()
    const stored = buildingData.value.getAllBuildingResources()

    return Array.from(capacities.entries())
        .filter(([_, capacity]) => capacity > 0)
        .map(([resourceType, capacity]) => ({
            resourceType,
            current: stored.get(resourceType) || 0,
            capacity,
            percentage: capacity > 0 ? ((stored.get(resourceType) || 0) / capacity) * 100 : 0,
            productionRate: getProductionRate(resourceType)
        }))
})

const hasResources = computed(() => storedResources.value.length > 0)

// Worker-related computed properties
const maxWorkers = computed(() => {
    const building = buildingData.value
    if (!building) return 0
    return building.getMaxWorkers() || 0
})

const assignedWorkerCount = computed(() => {
    resourceUpdateTrigger.value // Force re-evaluation when resources change
    const building = buildingData.value
    if (!building) return 0
    return building.getAssignedWorkerCount() || 0
})

const workerTypeName = computed(() => {
    const type = buildingData.value?.getWorkerType()
    const names: Record<string, string> = {
        'NEUTRAL': 'Ouvrier généraliste',
        'LUMBERJACK': 'Bûcheron',
        'MINER': 'Mineur',
        'FARMER': 'Fermier'
    }
    return type ? (names[type] || type) : 'Ouvrier'
})

const workerProgressPercentage = computed(() => {
    return maxWorkers.value > 0 ? (assignedWorkerCount.value / maxWorkers.value) * 100 : 0
})

const canIncrement = computed(() => {
    const result = assignedWorkerCount.value < maxWorkers.value && availableWorkers.value > 0
    console.log('canIncrement:', result, {
        assigned: assignedWorkerCount.value,
        max: maxWorkers.value,
        available: availableWorkers.value
    })
    return result
})

const canDecrement = computed(() => {
    const result = assignedWorkerCount.value > 0
    console.log('canDecrement:', result, { assigned: assignedWorkerCount.value })
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
        [ResourceType.stone]: '🪨',
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
        [ResourceType.stone]: 'Pierre',
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
    // This would be implemented based on your building production logic
    // For now, returning placeholder values for different building types
    const type = buildingData.value?.getType()

    if (type === 'sawmill' && resourceType === ResourceType.WOOD) return 8
    if (type === 'sawmill' && resourceType === ResourceType.PLANKS) return 12
    if (type === 'mine' && resourceType === ResourceType.stone) return 6
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
        const removed = building.removeResourceFromBuilding(resourceType, amountToCollect)

        if (removed > 0) {
            const added = gameStore.addResource(resourceType, removed)

            if (added < removed) {
                building.addResourceToBuilding(resourceType, removed - added)
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
                detail: { building, resourceType, amount: added, source: 'individual_collect' }
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

const incrementWorker = () => {
    if (!buildingData.value || !canIncrement.value) return

    console.log('Incrementing worker - current count:', assignedWorkerCount.value)

    window.dispatchEvent(new CustomEvent('game:assignWorkerToBuilding', {
        detail: { building: buildingData.value }
    }))
}

const decrementWorker = () => {
    if (!buildingData.value || !canDecrement.value) return

    console.log('Decrementing worker - current count:', assignedWorkerCount.value)

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

// Event listeners and watchers
onMounted(() => {
    const handleAvailableWorkersUpdate = (event: CustomEvent) => {
        console.log('Available workers update:', event.detail)
        availableWorkers.value = event.detail.count || 0
    }

    const handleWorkerAssignment = (event: CustomEvent) => {
        console.log('Worker assignment event:', event.detail)
        if (buildingData.value && event.detail.buildingId === buildingData.value.getBuildingId()) {
            // Force update of all reactive data including worker counts
            resourceUpdateTrigger.value++

            // Also trigger a nextTick to ensure DOM updates
            nextTick(() => {
                console.log('Resource and worker data updated after assignment')
                console.log('New assigned count:', buildingData.value?.getAssignedWorkerCount())
            })

            // Request updated worker count
            window.dispatchEvent(new CustomEvent('game:requestAvailableWorkers'))
        }
    }

    const handleWorkerUnassignment = (event: CustomEvent) => {
        console.log('Worker unassignment event:', event.detail)
        if (buildingData.value && event.detail.buildingId === buildingData.value.getBuildingId()) {
            // Force update of all reactive data including worker counts
            resourceUpdateTrigger.value++

            // Also trigger a nextTick to ensure DOM updates
            nextTick(() => {
                console.log('Resource and worker data updated after unassignment')
                console.log('New assigned count:', buildingData.value?.getAssignedWorkerCount())
            })

            // Request updated worker count
            window.dispatchEvent(new CustomEvent('game:requestAvailableWorkers'))
        }
    }

    window.addEventListener('game:availableWorkersUpdate', handleAvailableWorkersUpdate as EventListener)
    window.addEventListener('game:workerAssignedToBuilding', handleWorkerAssignment as EventListener)
    window.addEventListener('game:workerUnassignedFromBuilding', handleWorkerUnassignment as EventListener)

    // Request initial worker count
    console.log('Requesting initial available workers count')
    window.dispatchEvent(new CustomEvent('game:requestAvailableWorkers'))

    onUnmounted(() => {
        window.removeEventListener('game:availableWorkersUpdate', handleAvailableWorkersUpdate as EventListener)
        window.removeEventListener('game:workerAssignedToBuilding', handleWorkerAssignment as EventListener)
        window.removeEventListener('game:workerUnassignedFromBuilding', handleWorkerUnassignment as EventListener)
    })
})

// Watch for building data changes
watch(() => buildingData.value, (newBuilding) => {
    if (newBuilding) {
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

        window.addEventListener('game:buildingResourceChanged', handleResourceChange)
        window.addEventListener('game:resourceCollected', handleResourceCollected)

        return () => {
            window.removeEventListener('game:buildingResourceChanged', handleResourceChange)
            window.removeEventListener('game:resourceCollected', handleResourceCollected)
        }
    }
}, { immediate: true })

// Watch for direct building resource changes
watch(() => {
    if (!buildingData.value) return null
    return buildingData.value.getAllBuildingResources()
}, (newResources) => {
    if (newResources) {
        console.log('Building resources changed directly, updating display')
        resourceUpdateTrigger.value++
    }
}, { deep: true })

// Watch for worker count changes to force resource updates
watch(assignedWorkerCount, (newCount, oldCount) => {
    if (newCount !== oldCount) {
        console.log(`Worker count changed from ${oldCount} to ${newCount}, updating resources`)
        resourceUpdateTrigger.value++
    }
})

// Watch for modal visibility to refresh data
watch(isVisible, (visible) => {
    if (visible) {
        console.log('Modal opened, requesting fresh data')
        // Request fresh worker data when modal opens
        window.dispatchEvent(new CustomEvent('game:requestAvailableWorkers'))

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
</script>

<style scoped>
.modal-overlay {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
    transform: scale(0.9) translateY(-20px);
}

.modal-content {
    transition: transform 0.3s ease;
}
</style>
