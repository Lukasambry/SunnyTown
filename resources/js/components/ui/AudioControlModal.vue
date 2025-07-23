<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click.self="closeModal"
      >
        <div
          class="pixel-border pixel-border-gold bg-gradient-to-b from-amber-50 to-amber-100 w-full max-w-md p-6 rounded-lg shadow-2xl"
          @click.stop
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-amber-900">
              🎵 Contrôles Audio
            </h3>
            <button
              @click="closeModal"
              class="text-amber-700 hover:text-amber-900 transition-colors p-1"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

  <div v-if="!hasUserInteracted" class="mb-6">
    <div class="pixel-border pixel-border-stone bg-amber-50 p-4 rounded text-center">
      <p class="text-amber-800 font-medium mb-2">🎵 Cliquez sur le bouton pour démarrer la musique</p>
      <p class="text-amber-600 text-sm">La musique se lancera au premier clic, puis s'arrêtera au suivant</p>
    </div>
  </div>

  <div v-if="state.currentTrack && hasUserInteracted" class="mb-6">
            <div class="pixel-border pixel-border-stone bg-white p-4 rounded">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.82L4.8 13.6a.5.5 0 00-.3-.1H2a1 1 0 01-1-1V7.5a1 1 0 011-1h2.5a.5.5 0 00.3-.1l3.583-3.22A1 1 0 019.383 3.076zM12 5a1 1 0 011.414.006l2.79 2.79A1 1 0 0116 8.414V11.586a1 1 0 01-.796.98l-2.79 2.79A1 1 0 0112 15V5z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-amber-900">{{ state.currentTrack.name }}</h4>
                  <p class="text-sm text-amber-700">
                    {{ formatTime(state.currentTime) }} / {{ formatTime(state.duration) }}
                  </p>
                </div>
              </div>

              <div class="mb-4">
                <div 
                  class="w-full h-2 bg-amber-200 rounded-full cursor-pointer relative overflow-hidden"
                  @click="handleProgressClick"
                  ref="progressBar"
                >
                  <div 
                    class="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-150"
                    :style="{ width: progressPercentage + '%' }"
                  ></div>
                </div>
              </div>

              <div class="flex items-center justify-center gap-4 mb-4">
                <button
                  @click="togglePlayPause"
                  class="p-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-lg"
                  :title="hasUserInteracted ? 'Arrêter la musique' : 'Démarrer la musique'"
                >
                  <svg v-if="!hasUserInteracted || !state.isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V7z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>

              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.82L4.8 13.6a.5.5 0 00-.3-.1H2a1 1 0 01-1-1V7.5a1 1 0 011-1h2.5a.5.5 0 00.3-.1l3.583-3.22A1 1 0 019.383 3.076zM12 5a1 1 0 011.414.006l2.79 2.79A1 1 0 0116 8.414V11.586a1 1 0 01-.796.98l-2.79 2.79A1 1 0 0112 15V5z" clip-rule="evenodd" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  :value="state.volume"
                  @input="handleVolumeChange"
                  class="flex-1 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span class="text-sm text-amber-700 w-10 text-right">
                  {{ Math.round(state.volume * 100) }}%
                </span>
              </div>
            </div>
          </div>

          
          <div class="text-xs text-amber-600 space-y-1">
            <p><strong>Raccourcis :</strong></p>
            <p>• Espace : Play/Pause</p>
            <p>• Ctrl+M : Ouvrir/Fermer</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAudioManager } from '@/composables/useAudioManager'

const {
  state,
  tracks,
  isModalOpen,
  hasUserInteracted,
  togglePlayPause,
  setVolume,
  seek,
  formatTime,
  closeModal
} = useAudioManager()

const progressBar = ref<HTMLElement>()

const progressPercentage = computed(() => {
  if (state.duration === 0) return 0
  return (state.currentTime / state.duration) * 100
})

const handleProgressClick = (event: MouseEvent) => {
  if (!progressBar.value || state.duration === 0) return
  
  const rect = progressBar.value.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * state.duration
  
  seek(newTime)
}

const handleVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  setVolume(parseFloat(target.value))
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.pixel-border {
  position: relative;
  border: 2px solid;
}

.pixel-border-gold {
  border-color: #d97706;
  box-shadow: inset 0 0 0 1px #fbbf24;
}

.pixel-border-stone {
  border-color: #78716c;
  box-shadow: inset 0 0 0 1px #a8a29e;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #d97706;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #fbbf24;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #d97706;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #fbbf24;
}
</style>