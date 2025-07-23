import { ref, reactive, onMounted, onUnmounted } from 'vue'

export interface AudioTrack {
  id: string
  name: string
  src: string
  duration?: number
}

export interface AudioState {
  isPlaying: boolean
  isPaused: boolean
  currentTime: number
  duration: number
  volume: number
  currentTrack: AudioTrack | null
}

export const useAudioManager = () => {
  const audioElement = ref<HTMLAudioElement | null>(null)
  
  const state = reactive<AudioState>({
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    volume: 0.5,
    currentTrack: null
  })

  const hasUserInteracted = ref(false)
  const shouldAutoStart = ref(false)

  const tracks = ref<AudioTrack[]>([
    {
      id: 'sunnytown',
      name: 'Sunnytown Theme',
      src: '/assets/game/audio/sunnytown_song.mp3'
    }
  ])

  const isModalOpen = ref(false)

  // Initialisation de l'audio
  const initAudio = () => {
    if (!audioElement.value) {
      audioElement.value = new Audio()
      audioElement.value.loop = true
      audioElement.value.volume = state.volume
      
      // Event listeners pour l'audio
      audioElement.value.addEventListener('loadedmetadata', () => {
        if (audioElement.value) {
          state.duration = audioElement.value.duration
        }
      })
      
      audioElement.value.addEventListener('timeupdate', () => {
        if (audioElement.value) {
          state.currentTime = audioElement.value.currentTime
        }
      })
      
      audioElement.value.addEventListener('play', () => {
        state.isPlaying = true
        state.isPaused = false
      })
      
      audioElement.value.addEventListener('pause', () => {
        state.isPlaying = false
        state.isPaused = true
      })
      
      audioElement.value.addEventListener('ended', () => {
        state.isPlaying = false
        state.isPaused = false
        state.currentTime = 0
      })

      audioElement.value.addEventListener('error', (e) => {
        console.error('Erreur de chargement audio:', e)
        window.dispatchEvent(new CustomEvent('game:notification', {
          detail: {
            type: 'error',
            title: 'Erreur Audio',
            message: 'Impossible de charger la musique'
          }
        }))
      })
    }
  }

  const loadTrack = (track: AudioTrack) => {
    if (!audioElement.value) return

    console.log('Chargement de la piste:', track.src)

    audioElement.value.src = track.src
    state.currentTrack = track
    state.currentTime = 0

    
  }

  
  const play = async () => {
    if (!audioElement.value || !state.currentTrack) return

    try {
      await audioElement.value.play()
    } catch (error) {
      console.error('Erreur lors de la lecture:', error)
      window.dispatchEvent(new CustomEvent('game:notification', {
        detail: {
          type: 'error',
          title: 'Erreur de lecture',
          message: 'Impossible de lire la musique'
        }
      }))
    }
  }

  const pause = () => {
    if (audioElement.value && state.isPlaying) {
      audioElement.value.pause()
    }
  }

  const stop = () => {
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.currentTime = 0
      state.isPlaying = false
      state.isPaused = false
      state.currentTime = 0
    }
  }

  const togglePlayPause = async () => {
    if (!hasUserInteracted.value) {
      hasUserInteracted.value = true
      console.log('Premier clic détecté - démarrage de la musique')
      
      if (!state.currentTrack && tracks.value.length > 0) {
        loadTrack(tracks.value[0])
      }
      
      await play()
    } else {
      console.log('Clic détecté - arrêt de la musique')
      stop()
      hasUserInteracted.value = false
    }
  }

  const setVolume = (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    state.volume = clampedVolume
    
    if (audioElement.value) {
      audioElement.value.volume = clampedVolume
    }
  }

  const seek = (time: number) => {
    if (audioElement.value && state.duration > 0) {
      const clampedTime = Math.max(0, Math.min(state.duration, time))
      audioElement.value.currentTime = clampedTime
      state.currentTime = clampedTime
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const changeTrack = (trackId: string) => {
    const track = tracks.value.find(t => t.id === trackId)
    if (track) {
      loadTrack(track)
    }
  }

  const nextTrack = () => {
    return
  }

  const previousTrack = () => {
    return
  }

  const openModal = () => {
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
  }

  const toggleModal = () => {
    isModalOpen.value = !isModalOpen.value
  }

  const autoStart = () => {
    console.log('Préparation du système audio (pas de lecture automatique)')
    
    if (tracks.value.length > 0 && !state.currentTrack) {
      console.log('Chargement de la piste (en attente d\'interaction utilisateur):', tracks.value[0])
      loadTrack(tracks.value[0])
      shouldAutoStart.value = true
    }
  }

  const handleKeyboard = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    switch (event.code) {
      case 'Space':
        event.preventDefault()
        togglePlayPause()
        break
      case 'KeyM':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          toggleModal()
        }
        break
      case 'ArrowRight':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
        }
        break
      case 'ArrowLeft':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
        }
        break
    }
  }

  onMounted(() => {
    initAudio()
    autoStart()
    document.addEventListener('keydown', handleKeyboard)
  })

  onUnmounted(() => {
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value = null
    }
    document.removeEventListener('keydown', handleKeyboard)
  })

  return {
    state,
    tracks,
    isModalOpen,
    hasUserInteracted,
    shouldAutoStart,
    
    play,
    pause,
    stop,
    togglePlayPause,
    setVolume,
    seek,
    formatTime,
    changeTrack,
    nextTrack,
    previousTrack,
    loadTrack,
    
    openModal,
    closeModal,
    toggleModal,
    
    autoStart
  }
}