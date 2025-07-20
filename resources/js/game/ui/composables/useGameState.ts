import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/game/stores/gameStore'
import type { ResourceType } from '@/game/types/ResourceSystemTypes'
import { ResourceManager } from '@/game/services/ResourceManager'

export interface GameInstance extends Phaser.Game {}

export const useGameState = () => {
    const gameStore = useGameStore()
    const gameInstance = ref<GameInstance | null>(null)
    const isInitialized = ref(false)

    const isUpdatingFromPhaser = ref(false)
    const isUpdatingFromVue = ref(false)

    const initializeGameIntegration = async (game: Phaser.Game) => {
        gameInstance.value = game

        // Attendre que la scène principale soit prête avant de marquer comme initialisé
        await waitForMainScene(game)

        isInitialized.value = true
        setupGameEventListeners()

        const resourceManager = ResourceManager.getInstance()
        gameStore.setGameLoaded(true)

        // Émettre l'événement game:ready seulement quand tout est vraiment prêt
        console.log('Game fully ready, emitting game:ready event')
        window.dispatchEvent(new CustomEvent('game:ready', {
            detail: {
                resourceManager,
                gameInstance: game
            }
        }))
    }

    const waitForMainScene = (game: Phaser.Game): Promise<void> => {
        return new Promise((resolve) => {
            const checkMainScene = () => {
                const mainScene = game.scene?.getScene('MainScene')
                if (!mainScene) {
                    console.log('MainScene not ready, retrying...')
                    setTimeout(checkMainScene, 100)
                    return
                }

                // Vérifier que la scène est vraiment active et initialisée
                if (!mainScene.scene.isActive() || !mainScene.scene.isVisible()) {
                    console.log('MainScene not fully active, retrying...')
                    setTimeout(checkMainScene, 100)
                    return
                }

                console.log('MainScene is ready and active')

                // Attendre un petit délai supplémentaire pour s'assurer que tout est bien initialisé
                setTimeout(() => {
                    resolve()
                }, 200)
            }

            checkMainScene()
        })
    }

    const setupGameEventListeners = () => {
        if (!gameInstance.value) {
            console.warn('Game instance not available for event setup')
            return
        }

        const waitForMainSceneEvents = () => {
            const mainScene = gameInstance.value?.scene?.getScene('MainScene')
            if (!mainScene) {
                console.log('MainScene not ready for event listeners, retrying...')
                setTimeout(waitForMainSceneEvents, 100)
                return
            }

            console.log('MainScene found, setting up event listeners')

            const handleResourceUpdate = (type: ResourceType, amount: number) => {
                if (isUpdatingFromVue.value) return

                isUpdatingFromPhaser.value = true
                try {
                    const resourceManager = ResourceManager.getInstance()
                    const current = resourceManager.getResource(type)
                    if (current !== amount) {
                        if (amount > current) {
                            resourceManager.addResource(type, amount - current, 'game_sync')
                        } else {
                            resourceManager.removeResource(type, current - amount, 'game_sync')
                        }
                    }
                } finally {
                    isUpdatingFromPhaser.value = false
                }
            }

            const handleBuildingPlaced = (building: any) => {
                if (isUpdatingFromVue.value) return

                isUpdatingFromPhaser.value = true
                try {
                    gameStore.addBuilding(building)
                    window.dispatchEvent(new CustomEvent('game:buildingPlaced', {
                        detail: { building }
                    }))
                } finally {
                    isUpdatingFromPhaser.value = false
                }
            }

            const handleBuildingDestroyed = (building: any) => {
                if (isUpdatingFromVue.value) return

                isUpdatingFromPhaser.value = true
                try {
                    gameStore.removeBuilding(building)
                    window.dispatchEvent(new CustomEvent('game:buildingDestroyed', {
                        detail: { building }
                    }))
                } finally {
                    isUpdatingFromPhaser.value = false
                }
            }

            const handleWorkerCreated = (event: CustomEvent) => {
                if (isUpdatingFromVue.value) return

                isUpdatingFromPhaser.value = true
                try {
                    const { worker } = event.detail
                    gameStore.addWorker(worker)
                    window.dispatchEvent(new CustomEvent('game:workerCreated', {
                        detail: { worker }
                    }))
                } finally {
                    isUpdatingFromPhaser.value = false
                }
            }

            const handleWorkerRemoved = (worker: any) => {
                if (isUpdatingFromVue.value) return

                isUpdatingFromPhaser.value = true
                try {
                    gameStore.removeWorker(worker)
                    window.dispatchEvent(new CustomEvent('game:workerRemoved', {
                        detail: { worker }
                    }))
                } finally {
                    isUpdatingFromPhaser.value = false
                }
            }

            try {
                mainScene.events.on('resourceUpdate', handleResourceUpdate)
                mainScene.events.on('buildingPlaced', handleBuildingPlaced)
                mainScene.events.on('buildingDestroyed', handleBuildingDestroyed)
                mainScene.events.on('workerCreated', handleWorkerCreated)
                mainScene.events.on('workerRemoved', handleWorkerRemoved)

                console.log('Event listeners successfully attached to MainScene')
            } catch (error) {
                console.error('Error setting up event listeners:', error)
            }
        }

        waitForMainSceneEvents()
    }

    const emitGameCommand = (command: string, data?: any) => {
        if (!gameInstance.value || isUpdatingFromPhaser.value) {
            console.warn(`Game command blocked: ${command}`, 'fromPhaser:', isUpdatingFromPhaser.value)
            return
        }

        isUpdatingFromVue.value = true
        try {
            console.log(`Emitting game command: ${command}`, data)
            window.dispatchEvent(new CustomEvent(`game:${command}`, {
                detail: data
            }))
        } finally {
            setTimeout(() => {
                isUpdatingFromVue.value = false
            }, 50)
        }
    }

    const selectBuilding = (buildingType: string | null) => {
        if (isUpdatingFromPhaser.value) return

        try {
            gameStore.selectBuilding(buildingType)

            if (buildingType) {
                emitGameCommand('selectBuilding', buildingType)
            }
        } catch (error) {
            console.error('Error in selectBuilding:', error)
        }
    }

    const clearBuildings = () => {
        if (isUpdatingFromPhaser.value) return

        try {
            gameStore.clearBuildings()
            emitGameCommand('clearBuildings')
        } catch (error) {
            console.error('Error in clearBuildings:', error)
        }
    }

    const createWorker = (workerType: string, positionHint?: string | { x: number, y: number }) => {
        if (isUpdatingFromPhaser.value) return

        try {
            console.log('createWorker called:', workerType, 'at position:', positionHint)
            const effectivePositionHint = positionHint || 'near_player'
            emitGameCommand('createWorker', { type: workerType, positionHint: effectivePositionHint })
        } catch (error) {
            console.error('Error in createWorker:', error)
        }
    }

    const showBuildingInfo = (building: any) => {
        try {
            gameStore.showBuildingInfo(building)
        } catch (error) {
            console.error('Error in showBuildingInfo:', error)
        }
    }

    const hideBuildingInfo = () => {
        try {
            gameStore.hideBuildingInfo()
        } catch (error) {
            console.error('Error in hideBuildingInfo:', error)
        }
    }

    const addResource = (type: ResourceType, amount: number) => {
        if (isUpdatingFromPhaser.value) return 0

        try {
            const added = gameStore.addResource(type, amount)
            emitGameCommand('addResource', { type, amount: added })
            return added
        } catch (error) {
            console.error('Error in addResource:', error)
            return 0
        }
    }

    const removeResource = (type: ResourceType, amount: number) => {
        if (isUpdatingFromPhaser.value) return 0

        try {
            const removed = gameStore.removeResource(type, amount)
            emitGameCommand('removeResource', { type, amount: removed })
            return removed
        } catch (error) {
            console.error('Error in removeResource:', error)
            return 0
        }
    }

    const setupExternalEventListeners = () => {
        const handleSelectBuilding = (event: CustomEvent) => {
            if (isUpdatingFromVue.value) return
            console.log('Handling select building from external event:', event.detail)
            selectBuilding(event.detail)
        }

        const handleClearBuildings = () => {
            if (isUpdatingFromVue.value) return
            clearBuildings()
        }

        const handleCreateWorker = (event: CustomEvent) => {
            if (isUpdatingFromVue.value) return
            console.log('handleCreateWorker called:', event.detail)
            const { type, positionHint } = event.detail
            createWorker(type, positionHint)
        }

        const handleRequestCreateWorker = (event: CustomEvent) => {
            if (isUpdatingFromVue.value) return
            console.log('handleRequestCreateWorker called:', event.detail)
            const { type, positionHint } = event.detail
            const effectivePositionHint = positionHint || 'near_player'
            emitGameCommand('createWorkerCommand', { type, positionHint: effectivePositionHint })
        }

        const handleBuildingPlacementComplete = (event: CustomEvent) => {
            const { buildingType } = event.detail
            gameStore.selectBuilding(null)
            console.log('Building placement completed:', buildingType)
        }

        const handleBuildingPlacementCancelled = () => {
            gameStore.selectBuilding(null)
            console.log('Building placement cancelled from game')
        }

        const handleResourceUpdate = (event: CustomEvent) => {
            if (isUpdatingFromVue.value) return
            const { type, amount } = event.detail
            gameStore.updateResource(type, amount)
            console.log(`Resource updated: ${type} = ${amount}`)
        }

        // Add event listeners
        window.addEventListener('game:selectBuilding', handleSelectBuilding)
        window.addEventListener('game:clearBuildings', handleClearBuildings)
        window.addEventListener('game:createWorker', handleCreateWorker)
        window.addEventListener('game:requestCreateWorker', handleRequestCreateWorker)
        window.addEventListener('game:resourceUpdate', handleResourceUpdate)
        window.addEventListener('game:buildingPlacementComplete', handleBuildingPlacementComplete)
        window.addEventListener('game:buildingPlacementCancelled', handleBuildingPlacementCancelled)

        return () => {
            window.removeEventListener('game:selectBuilding', handleSelectBuilding)
            window.removeEventListener('game:clearBuildings', handleClearBuildings)
            window.removeEventListener('game:createWorker', handleCreateWorker)
            window.removeEventListener('game:requestCreateWorker', handleRequestCreateWorker)
            window.removeEventListener('game:resourceUpdate', handleResourceUpdate)
            window.removeEventListener('game:buildingPlacementComplete', handleBuildingPlacementComplete)
            window.removeEventListener('game:buildingPlacementCancelled', handleBuildingPlacementCancelled)
        }
    }

    onMounted(() => {
        const cleanup = setupExternalEventListeners()

        onUnmounted(() => {
            cleanup()
            isInitialized.value = false
            gameInstance.value = null
        })
    })

    return {
        // State
        gameInstance,
        isInitialized,
        gameStore,

        // Methods
        initializeGameIntegration,
        selectBuilding,
        clearBuildings,
        createWorker,
        showBuildingInfo,
        hideBuildingInfo,
        addResource,
        removeResource,
        emitGameCommand
    }
}
