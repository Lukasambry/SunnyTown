<template>
  <div class="fixed bottom-4 left-4 z-40 flex flex-col gap-2">
    <button
      @click="togglePlayPause"
      class="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center group"
      :class="{ 'animate-pulse': state.isPlaying && !isModalOpen }"
      :title="hasUserInteracted ? 'Arrêter la musique' : 'Démarrer la musique'"
    >
      <svg 
        v-if="!hasUserInteracted || !state.isPlaying" 
        class="w-6 h-6 transition-transform group-hover:scale-110" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
      </svg>
      <svg 
        v-else 
        class="w-6 h-6 transition-transform group-hover:scale-110" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V7z" clip-rule="evenodd" />
      </svg>
    </button>

    <Transition name="quick-controls">
      <div 
        v-if="showQuickControls && hasUserInteracted"
        class="flex flex-col gap-1 bg-white rounded-lg shadow-lg p-2 border border-amber-200"
      >
        <button
          @click="toggleModal"
          class="w-10 h-8 rounded bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors flex items-center justify-center"
          title="Ouvrir les contrôles (Ctrl+M)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </button>

        <div class="flex items-center gap-1 px-1">
          <svg class="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.82L4.8 13.6a.5.5 0 00-.3-.1H2a1 1 0 01-1-1V7.5a1 1 0 011-1h2.5a.5.5 0 00.3-.1l3.583-3.22A1 1 0 019.383 3.076z" clip-rule="evenodd" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            :value="state.volume"
            @input="handleVolumeChange"
            class="w-16 h-1 bg-amber-200 rounded-lg appearance-none cursor-pointer"
            title="Volume"
          />
        </div>
      </div>
    </Transition>

    <Transition name="track-info">
      <div 
        v-if="state.currentTrack && showTrackInfo"
        class="bg-white rounded-lg shadow-lg px-3 py-2 border border-amber-200 max-w-48"
      >
        <div class="text-xs text-amber-800 font-medium truncate">
          {{ state.currentTrack.name }}
        </div>
        <div class="text-xs text-amber-600">
          {{ formatTime(state.currentTime) }} / {{ formatTime(state.duration) }}
        </div>
        <div class="w-full h-1 bg-amber-200 rounded-full mt-1 overflow-hidden">
          <div 
            class="h-full bg-amber-500 rounded-full transition-all duration-300"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAudioManager } from '@/composables/useAudioManager'

const {
  state,
  tracks,
  isModalOpen,
  hasUserInteracted,
  togglePlayPause,
  setVolume,
  formatTime,
  toggleModal
} = useAudioManager()

const showQuickControls = ref(false)
const showTrackInfo = ref(false)
let quickControlsTimer: number | null = null
let trackInfoTimer: number | null = null

const progressPercentage = computed(() => {
  if (state.duration === 0) return 0
  return (state.currentTime / state.duration) * 100
})

const showTemporaryTrackInfo = () => {
  showTrackInfo.value = true
  
  if (trackInfoTimer) {
    clearTimeout(trackInfoTimer)
  }
  
  trackInfoTimer = setTimeout(() => {
    showTrackInfo.value = false
  }, 3000)
}

const handleVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  setVolume(parseFloat(target.value))
}

const watchTrackChanges = () => {
  let lastTrackId = state.currentTrack?.id
  
  const interval = setInterval(() => {
    if (state.currentTrack?.id !== lastTrackId) {
      lastTrackId = state.currentTrack?.id
      if (state.currentTrack) {
        showTemporaryTrackInfo()
      }
    }
  }, 100)
  
  return () => clearInterval(interval)
}

onMounted(() => {
  const cleanup = watchTrackChanges()
  
  onUnmounted(() => {
    cleanup()
    if (quickControlsTimer) clearTimeout(quickControlsTimer)
    if (trackInfoTimer) clearTimeout(trackInfoTimer)
  })
})
</script>

<style scoped>
.quick-controls-enter-active, .quick-controls-leave-active {
  transition: all 0.2s ease;
}

.quick-controls-enter-from, .quick-controls-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}

.track-info-enter-active, .track-info-leave-active {
  transition: all 0.3s ease;
}

.track-info-enter-from, .track-info-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: #d97706;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #fbbf24;
}

input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #d97706;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #fbbf24;
}

.fixed:hover .quick-controls-enter-active {
  animation-delay: 0.1s;
}
</style>