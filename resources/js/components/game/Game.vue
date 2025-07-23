<template>
    <div class="game-wrapper">
        <div id="game-container" ref="gameContainer"></div>

        <GameUI v-if="isGameReady" />

        <AudioControlButton v-if="isGameReady" />
        <AudioControlModal />

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
import AudioControlButton from '../ui/AudioControlButton.vue'
import AudioControlModal from '../ui/AudioControlModal.vue'

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
    try {
        console.log('Game ready, initializing integration...')
        
        if (!game) {
            throw new Error('Game instance is null')
        }

        await initializeGameIntegration(game)

        await nextTick()

        isGameReady.value = true
        
        setTimeout(() => {
            isLoadingComplete.value = true
        }, 500)

    } catch (error) {
        console.error('Error in handleGameReady:', error)
        throw error
    }
}

onMounted(async () => {
    try {
        const cleanup = await createGame()
        
        onBeforeUnmount(() => {
            if (cleanup) cleanup()
            if (game) {
                game.destroy(true)
                game = null
            }
        })
    } catch (error) {
        console.error('Failed to initialize game:', error)
    }
})
</script>

<style scoped>
.game-wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

#game-container {
    width: 100%;
    height: 100%;
}
</style>