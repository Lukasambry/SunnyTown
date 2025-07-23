<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isVisible" class="modal-overlay fixed inset-0 flex items-center justify-center p-4 !z-[9999]"
                 @click="handleClose">
                <div class="modal-content relative w-full max-w-[640px] mx-auto" @click.stop>

                    <div class="relative m-auto h-128 w-full flex justify-center gap-6">
                        <button class="absolute top-0 -right-4 translate-x-1/1 h-18 aspect-square cursor-pointer hover:scale-105 transition duration-150 ease-in-out" @click="handleClose">
                            <img src="/assets/game/ui/building-cancel-button.png"
                                 class="w-auto h-full pixelated"
                                 alt="cancel-button">
                        </button>

                        <!-- Panneau principal droite - structure exacte de l'exemple -->
                        <div class="pixel-border pixel-border-dark-dirt w-full flex flex-col-reverse justify-between">
                            <div class="pixel-border pixel-border-dirt w-full h-full max-h-110.5">
                                <div class="px-8 py-10 flex flex-col gap-6 scroll overflow-auto max-h-full">

                                    <div class="pixel-border pixel-border-stone text-xs text-slate-700 p-3">
                                        <p class="text-base bold mb-2">Système de prix :</p>
                                        <p>Le prix du prochain ouvrier augmente à chaque achat.</p>
                                        <p class="mt-1">Prochain prix : <strong>{{ nextWorkerPrice }} coins</strong></p>
                                    </div>
                                    <div class="flex gap-5 w-full">
                                        <div class="relative h-26">
                                            <div class="pixel-border pixel-border-dark-dirt h-full aspect-square flex items-center justify-center p-5">
                                                <img src="/assets/game/ui/gobelin.png" class="h-full w-full object-contain pixelated" alt="Basket">
                                            </div>
                                        </div>

                                        <div class="flex gap-4 items-center w-full py-1">
                                            <div class="flex flex-col gap-3 w-full">
                                                <div class="flex justify-between w-full">
                                                    <div class="flex gap-4 items-center">
                                                        <div class="pixel-border pixel-border-stone w-fit text-xs px-1 max-h-4.5 flex justify-center items-center !text-slate-900 !text-base line-height-0">
                                                            Gobelin
                                                        </div>
                                                    </div>
                                                    <div class="pixel-border pixel-border-stone w-fit text-xs px-1 max-h-4.5 flex justify-center items-center !text-slate-900 !text-base line-height-0 gap-1">
                                                        <img src="/assets/game/ui/coin.png" alt="coin" class="w-4 h-4 pixelated">
                                                        {{ workerPrice }}
                                                    </div>
                                                </div>
                                                <div class="pixel-progress">
                                                    <div class="pixel-progress-bar bg-gold-secondary transition duration-150 ease-in-out" :style="{ width: ((playerGold * 100) / workerPrice) + '%', maxWidth: '100%' }"></div>
                                                </div>
                                                <div class="flex justify-between gap-4">
                                                    <button
                                                        class="pixel-border flex gap-1.5 items-center justify-center gold h-full !text-xl w-full cursor-pointer"
                                                        :class="{
                                                                        'pixel-border-stone opacity-90 !cursor-not-allowed': !canAffordWorker,
                                                                        'pixel-border-gold': canAffordWorker,
                                                                    }"
                                                        :disabled="!canAffordWorker"
                                                        @click="purchaseWorker">
                                                        Recruter
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex gap-5">
                                <div class="w-fit no-bottom pixel-border pixel-border-dirt py-1 pb-2 px-3 flex gap-3 items-center !text-slate-900 cursor-pointer pixel-no-bottom">
                                    <img src="/assets/game/ui/playercount.png"
                                         class="h-10 pixelated"
                                         alt="ArrowUp">
                                    <h3 class="!text-slate-900 !text-3xl">Recruter des Ouvriers</h3>
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
import { ref, computed } from 'vue'
import { useGameStore } from '@/game/stores/gameStore'

const gameStore = useGameStore()
const isVisible = ref(false)

// Computed values
const totalWorkerCount = computed(() => {
    // Récupérer le nombre total d'ouvriers depuis le game store ou le worker manager
    return gameStore.workerCount
})

const playerGold = computed(() => gameStore.getPlayerGold)

const workerPrice = computed(() => {
    const basePrice = 50
    const count = totalWorkerCount.value
    return Math.floor(basePrice * Math.pow(1.3, count))
})

const nextWorkerPrice = computed(() => {
    const basePrice = 50
    const count = totalWorkerCount.value + 1
    return Math.floor(basePrice * Math.pow(1.3, count))
})

const canAffordWorker = computed(() => {
    return playerGold.value >= workerPrice.value
})

// Methods
const purchaseWorker = () => {
    if (!canAffordWorker.value) {
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'error',
                title: 'Fonds insuffisants',
                message: `Vous avez besoin de ${workerPrice.value} coins pour recruter un ouvrier.`
            }
        }))
        return
    }

    try {
        // Déduire le coût en gold du joueur
        const success = gameStore.updatePlayerGold(playerGold.value - workerPrice.value)

        if (success !== false) {
            // Émettre un événement pour créer un nouvel ouvrier NEUTRAL aux coordonnées du joueur
            window.dispatchEvent(new CustomEvent('game:purchaseWorker', {
                detail: {
                    workerType: 'neutral',
                    cost: workerPrice.value
                }
            }))

            window.dispatchEvent(new CustomEvent('game:notification', {
                detail: {
                    type: 'success',
                    title: 'Ouvrier recruté !',
                    message: `Nouvel ouvrier recruté pour ${workerPrice.value} coins.`
                }
            }))

            // Fermer la modal après l'achat
            hide()
        } else {
            throw new Error('Failed to deduct gold')
        }
    } catch (error) {
        console.error('Error purchasing worker:', error)
        window.dispatchEvent(new CustomEvent('game:notification', {
            detail: {
                type: 'error',
                title: 'Erreur',
                message: 'Impossible de recruter l\'ouvrier.'
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

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
