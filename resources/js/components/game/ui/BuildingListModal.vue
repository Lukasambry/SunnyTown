<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isVisible" class="modal-overlay fixed inset-0 flex items-center justify-center p-4 !z-[9999]"
                 @click="handleOverlayClick">
                <div class="modal-content relative w-full max-w-[1020px] mx-auto" @click.stop>

                    <div class="relative m-auto max-w-[1020px] h-128 w-full flex gap-6">
                        <button class="absolute top-0 -right-4 translate-x-1/1 h-18 aspect-square cursor-pointer hover:scale-105 transition duration-150 ease-in-out" @click="handleClose">
                            <img src="/assets/game/ui/building-cancel-button.png"
                                 class="w-auto h-full pixelated"
                                 alt="cancel-button">
                        </button>

                        <div class="flex flex-col gap-6 w-[30%]">
                            <div class="pixel-border pixel-border-dirt w-full flex items-center gap-6 p-2 h-fit">
                                <div class="pixel-border pixel-border-stone relative h-full w-16">
                                    <p class="absolute left-1/2 -bottom-0.5 -translate-x-1/2">
                                        <img src="#" class="h-15 max-w-14 pixelated" alt="icon_scierie">
                                    </p>
                                </div>
                                <h2 class="!text-slate-900 !text-3xl">Atelier</h2>
                            </div>
                            <div class="pixel-border pixel-border-stone w-full p-4 h-full flex flex-col gap-6">
                                <div class="flex justify-between items-center h-20">
                                    <div class="flex flex-col gap-2 w-full text-center">
                                        <div class="!text-slate-900 font-mono">
                                            Total: {{ totalBuildings }}
                                        </div>
                                        <div class="!text-slate-900 font-mono">
                                            Ouvriers: {{ totalWorkers }}
                                        </div>
                                        <button
                                            class="pixel-border pixel-border-stone w-full p-2 !text-slate-900 hover:bg-slate-100 transition-colors mt-4"
                                            @click="handleClose">
                                            Fermer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Panneau principal droite - structure exacte de l'exemple -->
                        <div class="pixel-border pixel-border-dark-dirt w-[70%] flex flex-col-reverse justify-between">
                            <div class="pixel-border pixel-border-dirt w-full h-full max-h-110.5">
                                <div class="px-8 py-10 flex flex-col gap-6 scroll overflow-auto max-h-full">

                                    <!-- Bâtiments disponibles - style exact de l'exemple -->
                                    <div v-for="building in availableBuildings" :key="building.key"
                                         class="flex gap-5 w-full p-6 cursor-pointer hover:-translate-y-0.5 transition duration-150 ease-in-out"
                                         :class="canAffordBuilding(building) ? 'pixel-border pixel-border-gold' : 'pixel-border pixel-border-stone'"
                                         @click="handleBuildingSelect(building.key)">

                                        <!-- Image du bâtiment - même structure que l'exemple -->
                                        <div class="relative h-28">
                                            <div class="h-full w-28 flex items-center justify-center p-1">
                                                <img :src="`/assets/game/buildings/${building.key}.png`"
                                                     class="w-auto max-w-full max-h-full h-auto pixelated"
                                                     :alt="building.key">
                                            </div>
                                        </div>

                                        <!-- Contenu - structure identique à l'exemple -->
                                        <div class="flex gap-4 items-center w-full py-1">
                                            <div class="flex flex-col gap-6 w-full">
                                                <div class="flex justify-between w-full">
                                                    <div class="flex gap-4 items-center">
                                                        <div class="ml-1 pixel-border pixel-border-stone w-fit text-xs px-1 max-h-4.5 flex justify-center items-center !text-slate-900 !text-base line-height-0">
                                                            {{ building.name }}
                                                        </div>
                                                        <div v-if="getBuildingCount(building.key) > 0"
                                                             class="ml-1 pixel-border pixel-border-gold w-fit text-xs px-1 max-h-4.5 flex justify-center items-center !text-slate-900 !text-sm line-height-0">
                                                            x{{ getBuildingCount(building.key) }}
                                                        </div>
                                                    </div>

                                                    <!-- Coûts - même structure que l'exemple -->
                                                    <div class="ml-1 flex gap-5 text-xs line-height-0">
                                                        <div v-if="building.cost?.wood"
                                                             class="pixel-border pixel-border-stone w-fit text-xs px-1 max-h-4.5 flex justify-center items-center gap-1.5 !text-slate-900 !text-sm line-height-0">
                                                            <img src="https://i.postimg.cc/7ZRVm9Xv/wood.png"
                                                                 class="w-auto h-4 pixelated"
                                                                 alt="wood">
                                                            <p :class="canAffordBuilding(building) ? '' : '!text-red-400'">
                                                                {{ building.cost.wood }}
                                                            </p>
                                                        </div>
                                                        <div v-if="building.cost?.coin"
                                                             class="pixel-border pixel-border-gold w-fit text-xs px-1 max-h-4.5 flex justify-center items-center gap-1.5 !text-sm line-height-0">
                                                            <img src="https://i.postimg.cc/ncPcz90V/coin.png"
                                                                 class="w-auto h-4 pixelated"
                                                                 alt="coins">
                                                            <p :class="canAffordBuilding(building) ? '' : '!text-red-400'">
                                                                {{ building.cost.coin }}
                                                            </p>
                                                        </div>
                                                        <div v-if="building.cost?.stone"
                                                             class="pixel-border pixel-border-stone w-fit text-xs px-1 max-h-4.5 flex justify-center items-center gap-1.5 !text-sm line-height-0">
                                                            <img src="https://i.postimg.cc/4x9vHzNr/stone.png"
                                                                 class="w-auto h-4 pixelated"
                                                                 alt="stone">
                                                            <p :class="canAffordBuilding(building) ? '' : '!text-red-400'">
                                                                {{ building.cost.stone }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Description - même style que l'exemple -->
                                                <div class="flex gap-4">
                                                    <p class="!text-slate-900 leading-5 !text-base">
                                                        {{ building.description }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Message si pas de bâtiments -->
                                    <div v-if="availableBuildings.length === 0" class="text-center py-20">
                                        <p class="!text-slate-600">Aucun bâtiment disponible</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Onglets - exactement comme dans l'exemple -->
                            <div class="flex gap-5">
                                <div class="w-fit no-bottom py-1 pb-2 px-3 flex gap-3 items-center !text-slate-900 cursor-pointer pixel-no-bottom"
                                     :class="{'pixel-border pixel-border-dirt': activeTab === 'buildings'}"
                                     @click="activeTab = 'buildings'">
                                    <img src="/assets/game/ui/arrow_up.png"
                                         class="h-10 pixelated"
                                         alt="ArrowUp">
                                    <h3 class="!text-slate-900 !text-3xl">Batiments</h3>
                                </div>

                                <div class="w-fit no-bottom py-1 pb-2 px-3 flex gap-3 items-center !text-slate-900 cursor-pointer pixel-no-bottom"
                                     :class="{'pixel-border pixel-border-dirt': activeTab === 'decorations'}"
                                     @click="activeTab = 'decorations'">
                                    <img src="/assets/game/ui/playercount.png"
                                         class="h-10 pixelated"
                                         alt="playercount">
                                    <h3 class="!text-slate-900 !text-3xl">Decorations</h3>
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
import { ref, computed, watch, nextTick } from 'vue'
import { useGameStore } from '@/game/stores/gameStore'
import type { BuildingConfig } from '@/game/types/BuildingTypes'

const gameStore = useGameStore()

const isVisible = ref(false)
const activeTab = ref('buildings')

const buildingRegistry = computed(() => {
    const registry = gameStore.getBuildingRegistry()
    if (!registry) {
        console.error('BuildingRegistry not available')
        return null
    }
    return registry
})

const availableBuildings = computed((): readonly BuildingConfig[] => {
    if (!buildingRegistry.value) {
        return []
    }

    try {
        const buildings = buildingRegistry.value.getAllBuildings()

        // Filtrer selon l'onglet actif
        if (activeTab.value === 'buildings') {
            return buildings.filter(building =>
                !building.isDecoration &&
                building.category !== 'decoration'
            )
        } else if (activeTab.value === 'decorations') {
            return buildings.filter(building =>
                building.isDecoration ||
                building.category === 'decoration'
            )
        }

        return buildings
    } catch (error) {
        console.error('Error getting available buildings:', error)
        return []
    }
})

const totalBuildings = computed(() => {
    return gameStore.buildingCount
})

const totalWorkers = computed(() => {
    return gameStore.workerCount
})

const getBuildingCount = (buildingType: string): number => {
    return gameStore.state.buildings?.filter(building =>
        building.getType?.() === buildingType
    ).length || 0
}

const canAffordBuilding = (building: BuildingConfig): boolean => {
    if (!buildingRegistry.value) {
        return false
    }

    try {
        return buildingRegistry.value.canAffordBuilding(building.key)
    } catch (error) {
        console.error(`Error checking affordability for ${building.key}:`, error)
        return false
    }
}

const handleBuildingSelect = (buildingKey: string) => {
    const building = availableBuildings.value.find(b => b.key === buildingKey)

    if (!building || !canAffordBuilding(building)) {
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'error',
                title: 'Ressources insuffisantes',
                message: `Vous n'avez pas assez de ressources pour construire ${building?.name || 'ce bâtiment'}`
            }
        }))
        return
    }

    try {
        gameStore.selectBuilding(buildingKey)

        window.dispatchEvent(new CustomEvent('game:selectBuilding', {
            detail: buildingKey
        }))

        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'info',
                title: 'Mode construction activé',
                message: `Placez ${building.name} sur la carte`
            }
        }))

        hide()
    } catch (error) {
        console.error('Error selecting building:', error)
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'error',
                title: 'Erreur',
                message: 'Impossible de sélectionner ce bâtiment'
            }
        }))
    }
}

const show = () => {
    isVisible.value = true
}

const hide = () => {
    isVisible.value = false
}

const handleClose = () => {
    hide()
}

const handleOverlayClick = () => {
    hide()
}

watch(() => gameStore.state?.buildings, () => {
    nextTick(() => {
        console.log('Buildings updated, refreshing modal data')
    })
}, { deep: true })

watch(() => gameStore.resourceList, () => {
    nextTick(() => {
        console.log('Resources updated, refreshing affordability')
    })
}, { deep: true })

defineExpose({
    show,
    hide
})
</script>

<style scoped>
.modal-overlay {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
}

.modal-content {
    animation: modal-slide-in 0.3s ease-out;
}

@keyframes modal-slide-in {
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
