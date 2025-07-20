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

// Refs
const gameContainer = ref<HTMLElement>()
const loadingProgress = ref(0)

// Game state composable
const { initializeGameIntegration } = useGameState()

// State
let game: Phaser.Game | null = null
const isGameReady = ref(false)
const isLoadingComplete = ref(false) // Nouveau: état de fin de chargement complet

// Methods
const createGame = async () => {
    try {
        if (!gameContainer.value) {
            throw new Error('Game container not found')
        }

        // Update game config to target our container
        const config = {
            ...gameConfig,
            parent: gameContainer.value
        }

        // Create the game instance
        game = new Phaser.Game(config)

        // Wait for the game to be ready
        game.events.once('ready', () => {
            handleGameReady()
        })

        // Monitor loading progress from Phaser
        game.events.on('preload.progress', (progress: number) => {
            loadingProgress.value = Math.round(progress * 100)
        })

        // Handle resize
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
        // Initialize game integration
        initializeGameIntegration(game)

        // Mark game as ready (mais pas encore l'écran de chargement)
        isGameReady.value = true

        console.log('Game ready and UI integrated')

        // Le LoadingScreen va maintenant écouter l'événement 'game:ready'
        // et gérer la transition finale

    } catch (error) {
        console.error('Error in handleGameReady:', error)
        // En cas d'erreur, forcer la fin du chargement
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

// Lifecycle
onMounted(async () => {
    // Wait for DOM to be ready
    await nextTick()

    // Écouter l'événement de fin de chargement complet
    window.addEventListener('loading:complete', handleLoadingComplete)

    // Prevent context menu on right-click in game container
    if (gameContainer.value) {
        gameContainer.value.addEventListener('contextmenu', (e) => {
            e.preventDefault()
        })
        // Hide default cursor
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
        // En cas d'erreur, afficher quand même le jeu
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

/* Ensure Phaser canvas fits properly */
#game-container canvas {
    display: block;
    margin: 0 auto;
}
</style>
