<template>
    <div class="game-wrapper">
        <!-- Phaser Game Container -->
        <div id="game-container" ref="gameContainer"></div>

        <!-- Vue.js UI Overlay -->
        <GameUI v-if="isGameReady" />

        <!-- Loading Screen - reste affiché jusqu'à la fin complète du chargement -->
        <LoadingScreen
            v-if="!isLoadingComplete"
            :progress="loadingProgress"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Phaser from 'phaser'
import { gameConfig } from '@/game/config'
import { useGameState } from '@/game/ui/composables/useGameState'
import GameUI from './ui/GameUI.vue'
import LoadingScreen from './ui/LoadingScreen.vue'

const gameContainer = ref<HTMLElement>()
const loadingProgress = ref(0)

const { initializeGameIntegration } = useGameState()

let game: Phaser.Game | null = null
const isGameReady = ref(false)
const isLoadingComplete = ref(false)

const createGame = async () => {
    try {
        if (!gameContainer.value) {
            throw new Error('Game container not found')
        }

        const config = {
            ...gameConfig,
            parent: gameContainer.value
        }

        game = new Phaser.Game(config)

        game.events.once('ready', () => {
            handleGameReady()
        })

        game.events.on('preload.progress', (progress: number) => {
            loadingProgress.value = Math.round(progress * 100)
        })

        const handleResize = () => {
            if (game) {
                const width = window.innerWidth
                const height = window.innerHeight
                game.scale.resize(width, height)
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }

    } catch (error) {
        console.error('Error creating game instance:', error)
        throw error
    }
}

const handleGameReady = async () => {
    if (!game) return

    try {
        initializeGameIntegration(game)

        isGameReady.value = true

        console.log('Game ready and UI integrated')
    } catch (error) {
        console.error('Error in handleGameReady:', error)
        isLoadingComplete.value = true
    }
}

const handleLoadingComplete = () => {
    console.log('Loading screen completed - showing game')
    isLoadingComplete.value = true
}

const destroyGame = () => {
    if (game) {
        game.destroy(true)
        game = null
    }
    isGameReady.value = false
    isLoadingComplete.value = false
}

onMounted(async () => {
    await nextTick()

    window.addEventListener('loading:complete', handleLoadingComplete)

    if (gameContainer.value) {
        gameContainer.value.addEventListener('contextmenu', (e) => {
            e.preventDefault()
        })
        gameContainer.value.style.cursor = 'none'
    }

    try {
        const cleanup = await createGame()

        onBeforeUnmount(() => {
            cleanup?.()
            destroyGame()
            window.removeEventListener('loading:complete', handleLoadingComplete)
            if (gameContainer.value) {
                gameContainer.value.removeEventListener('contextmenu', (e) => e.preventDefault())
            }
        })
    } catch (error) {
        console.error('Failed to initialize game:', error)
        isLoadingComplete.value = true
    }
})
</script>

<style scoped>
.game-wrapper {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: relative;
    background: #000;
}

#game-container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
}

#game-container canvas {
    display: block;
    margin: 0 auto;
}
</style>
