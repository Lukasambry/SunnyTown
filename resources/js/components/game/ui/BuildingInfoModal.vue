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
                                <div class="p-2 flex flex-col justify-between h-full">
                                    <div class="flex flex-col gap-6">
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
                                    </div>

                                    <div class="flex flex-col gap-4">
                                        <div v-if="hasResources" class="flex gap-4 justify-between">
                                            <button
                                                class="pixel-border px-6 py-1.5 flex items-center gap-3 w-full"
                                                :class="{
                                                    'pixel-border-success': storedResources.some(r => canDepositResource(r.resourceType)),
                                                    'pixel-border-stone text-slate-700': !storedResources.some(r => canDepositResource(r.resourceType))
                                                }"
                                                @click="depositAllPossibleResources">
                                                <span class="font-semibold">Tout deposer</span>
                                            </button>
                                            <button
                                                class="pixel-border pixel-border-gold px-6 py-1.5 flex items-center gap-3 w-full"
                                                :class="{
                                                    'pixel-border-stone text-slate-700': !storedResources.some(r => r.current > 0)
                                                }"
                                                @click="collectAllResources">
                                                <span class="font-semibold">Tout collecter</span>
                                            </button>
                                        </div>
                                        <!--
                                        <button
                                            class="pixel-border pixel-border-stone w-full px-6 py-1.5 !text-slate-800 hover:bg-slate-100 transition-colors"
                                            @click="handleClose">
                                            Fermer
                                        </button>
                                        -->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="pixel-border pixel-border-dark-dirt w-[70%] flex flex-col-reverse">
                            <div class="pixel-border pixel-border-dirt h-16 w-full h-full">
                                <div class="px-8 py-10 flex flex-col gap-10 scroll overflow-auto max-h-full">

                                    <div v-if="activeTab === 'resources'">
                                        <div v-if="hasResources" class="space-y-6">
                                            <div v-for="resource in storedResources" :key="resource.resourceType" class="space-y-6">

                                                <div class="flex gap-5 w-full">
                                                    <div class="relative h-26">
                                                        <div class="pixel-border pixel-border-dark-dirt h-full aspect-square flex items-center justify-center p-5">
                                                            <img :src="`/assets/game/ui/resources/${resource.resourceType}.png`" class="h-full w-full object-contain pixelated" alt="Basket">
                                                        </div>
                                                    </div>

                                                    <div class="flex gap-4 items-center w-full py-1">
                                                        <div class="flex flex-col gap-3 w-full">
                                                            <div class="flex justify-between w-full">
                                                                <div class="flex gap-4 items-center">
                                                                    <div class="pixel-border pixel-border-stone w-fit text-xs px-1 max-h-4.5 flex justify-center items-center !text-slate-900 !text-base line-height-0">
                                                                        {{ getResourceName(resource.resourceType) }}
                                                                    </div>
                                                                    <span v-if="resource.productionRate">
                                                                        (+{{ resource.productionRate }}/min)
                                                                    </span>
                                                                </div>
                                                                <p class="!text-base">{{ resource.current }}/{{ resource.capacity }}</p>
                                                            </div>
                                                            <div class="pixel-progress">
                                                                <div class="pixel-progress-bar bg-green-500 transition duration-150 ease-in-out" :style="{ width: resource.percentage + '%' }"></div>
                                                            </div>
                                                            <div class="flex justify-between gap-4">
                                                                <button
                                                                    class="pixel-border flex gap-1.5 items-center justify-center gold h-full !text-xl w-full cursor-pointer"
                                                                    :class="{
                                                                        'opacity-90 !cursor-not-allowed': !canDepositResource(resource.resourceType),
                                                                        'pixel-border-success': canDepositResource(resource.resourceType),
                                                                        'pixel-border-stone text-slate-700': !canDepositResource(resource.resourceType)
                                                                    }"
                                                                    :disabled="!canDepositResource(resource.resourceType)"
                                                                    @click="depositSingleResource(resource.resourceType)"
                                                                    :title="`Déposer ${getResourceName(resource.resourceType)} (Vous avez: ${getPlayerInventoryAmount(resource.resourceType)}, Espace libre: ${getBuildingFreeSpace(resource.resourceType)})`">
                                                                    Deposer
                                                                </button>
                                                                <button
                                                                    class="pixel-border flex gap-1.5 items-center justify-center gold h-full !text-xl w-full cursor-pointer"
                                                                    :class="{
                                                                        'opacity-90 !cursor-not-allowed': !canCollectResource(resource.resourceType),
                                                                        'pixel-border-gold': resource.current > 0,
                                                                        'pixel-border-stone': resource.current == 0
                                                                    }"
                                                                    :disabled="!canCollectResource(resource.resourceType)"
                                                                    @click="collectSingleResource(resource.resourceType, resource.current)">
                                                                    Collecter
                                                                </button>
                                                            </div>

                                                            <!--
                                                            <div class="mt-2 text-xs text-slate-500">
                                                                Votre inventaire: {{ getPlayerInventoryAmount(resource.resourceType) }} |
                                                                Espace libre: {{ getBuildingFreeSpace(resource.resourceType) }}
                                                            </div>
                                                            -->
                                                        </div>
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
                                                class="pixel-border pixel-border-success px-6 py-3 flex items-center gap-3 mx-auto"
                                                @click="depositAllPossibleResources">
                                                <span class="text-xl">📥</span>
                                                <span class="font-semibold">Déposer des ressources</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div v-if="activeTab === 'workers'">
                                        <div class="space-y-5">
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
                                            <div class="flex gap-5 w-full">
                                                <div class="relative h-20">
                                                    <div class="pixel-border pixel-border-dark-dirt h-full aspect-square flex items-center justify-center p-2">
                                                        <div class="h-12 w-auto pixelated text-2xl">
                                                            <img src="/assets/game/ui/gobelin.png" class="w-full h-full object-contain" alt="gobelin">
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="flex gap-5 items-center w-full py-1">
                                                    <div class="flex flex-col gap-3 w-full">
                                                        <div class="flex justify-between w-full">
                                                            <div class="pixel-border pixel-border-stone w-fit text-xs px-1 max-h-4.5 flex justify-center items-center !text-slate-900 !text-base line-height-0">
                                                                {{ workerTypeName }}
                                                            </div>
                                                            <p class="!text-base">{{ assignedWorkerCount }}/{{ maxWorkers }}</p>
                                                        </div>
                                                        <div class="pixel-progress">
                                                            <div class="pixel-progress-bar bg-green-500 transition duration-150 ease-in-out" :style="{ width: Math.round(workerProgressPercentage) + '%' }"></div>
                                                        </div>
                                                    </div>
                                                    <div class="flex items-center pixel-border pixel-border-stone p-1 gap-4">
                                                        <button
                                                            class="pixel-border h-8 flex items-center justify-center px-0.5 w-10 cursor-pointer"
                                                            :class="{
                                                                'pixel-border-success': canDecrement ,
                                                                'pixel-border-stone !cursor-not-allowed': !canDecrement
                                                            }"
                                                            @click="decrementWorker">
                                                            <img src="/assets/game/ui/minos.png" class="w-full h-full object-contain pixelated" alt="minos">
                                                        </button>
                                                        <button
                                                            class="pixel-border  h-8 flex items-center justify-center  px-0.5 w-10 cursor-pointer"
                                                            :class="{
                                                                'pixel-border-success': canIncrement,
                                                                'pixel-border-stone !cursor-not-allowed': !canIncrement
                                                            }"
                                                            :disabled="!canIncrement"
                                                            @click="incrementWorker">
                                                            <img src="/assets/game/ui/plus.png" class="w-full h-full object-contain pixelated" alt="plus">
                                                        </button>
                                                    </div>
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
import { ref, computed, watch, onMounted, onUnmounted, nextTick, toRaw } from 'vue'
import { useGameStore } from '@/game/stores/gameStore'
import { ResourceType } from '@/game/types/ResourceSystemTypes'

const gameStore = useGameStore()
const activeTab = ref<'resources' | 'workers'>('resources')
const previousResourcesState = ref<Map<any, number>>(new Map())
const resourceUpdateTrigger = ref(0)
const availableWorkers = ref(0)

const isVisible = computed(() => gameStore.state?.showBuildingInfo || false)
const buildingData = computed(() => gameStore.state?.currentBuildingInfo || null)

const buildingDisplayName = computed(() => {
    return buildingData.value?.getBuildingName()
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
    return buildingData.value?.getBuildingDescription() || 'Bâtiment fonctionnel pour votre colonie.'
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
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    resourceUpdateTrigger.value

    if (!buildingData.value) return []

    const capacities = buildingData.value.getAllBuildingResourceCapacities()
    const stored = buildingData.value.getAllBuildingResources()

    return Array.from(capacities.entries())
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const maxWorkers = computed(() => {
    const building = buildingData.value
    if (!building) return 0
    return building.getMaxWorkers() || 0
})

const assignedWorkerCount = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    resourceUpdateTrigger.value
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
    return assignedWorkerCount.value < maxWorkers.value && availableWorkers.value > 0
})

const canDecrement = computed(() => {
    return assignedWorkerCount.value > 0
})

const workerEfficiency = computed(() => {
    if (maxWorkers.value === 0) return 1
    return assignedWorkerCount.value / maxWorkers.value
})


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

const canCollectResource = (resourceType: ResourceType): boolean => {
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
    let totalSkipped = 0

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
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'success',
                title: 'Ressources récoltées',
                message: `${totalCollected} ressource${totalCollected > 1 ? 's' : ''} récoltée${totalCollected > 1 ? 's' : ''}${totalSkipped > 0 ? ` (${totalSkipped} ignorée${totalSkipped > 1 ? 's' : ''} - inventaire plein)` : ''}`
            }
        }))

        window.dispatchEvent(new CustomEvent('game:resourcesCollected', {
            detail: { building: buildingData.value, totalCollected, totalSkipped }
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

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
    transform: scale(0.9) translateY(-20px);
}

.modal-content {
    transition: transform 0.3s ease;
}

@keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

@media (max-width: 640px) {
    .resource-actions button {
        width: 100%;
        justify-content: center;
    }
}
</style>
