import type { Scene } from 'phaser'

export interface SoundEffect {
  key: string
  src: string
  volume?: number
  loop?: boolean
}

export class AudioService {
  private static instance: AudioService
  private scene: Scene | null = null
  private soundEffects = new Map<string, Phaser.Sound.BaseSound>()
  private globalMuted = false

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService()
    }
    return AudioService.instance
  }

  public initialize(scene: Scene): void {
    this.scene = scene
    this.preloadSoundEffects()
    this.setupEventListeners()
  }

  private preloadSoundEffects(): void {
    if (!this.scene) return

    const effects: SoundEffect[] = [
      { key: 'song-game', src: 'audio/effects/sunnytown_song.mp3', volume: 0.7 },
    ]

    effects.forEach(effect => {
      if (!this.scene!.cache.audio.exists(effect.key)) {
        this.scene!.load.audio(effect.key, effect.src)
      }
    })

    this.scene.load.start()
  }

  private setupEventListeners(): void {
    if (!this.scene) return

    window.addEventListener('game:treeHit', () => {
      this.playSound('tree-hit-sound')
    })

    window.addEventListener('game:treeDestroyed', () => {
      this.playSound('tree-destroy-sound')
    })

    window.addEventListener('game:workerCreated', () => {
      this.playSound('worker-created')
    })

    window.addEventListener('game:buildingPlaced', () => {
      this.playSound('building-placed')
    })

    window.addEventListener('game:notification', (event: any) => {
      if (event.detail?.type === 'success') {
        this.playSound('notification')
      }
    })

    window.addEventListener('audio:volumeChanged', (event: any) => {
      this.setGlobalVolume(event.detail.volume)
    })

    window.addEventListener('audio:muted', () => {
      this.muteAll()
    })

    window.addEventListener('audio:unmuted', () => {
      this.unmuteAll()
    })
  }

  public playSound(key: string, options?: { volume?: number, loop?: boolean }): void {
    if (!this.scene || this.globalMuted) return

    try {
      if (this.scene.cache.audio.exists(key)) {
        const sound = this.scene.sound.add(key, {
          volume: options?.volume ?? 1,
          loop: options?.loop ?? false
        })
        
        sound.play()
        
        this.soundEffects.set(key, sound)
        
        if (!options?.loop) {
          sound.once('complete', () => {
            this.soundEffects.delete(key)
            sound.destroy()
          })
        }
      }
    } catch (error) {
      console.warn(`Could not play sound ${key}:`, error)
    }
  }

  public stopSound(key: string): void {
    const sound = this.soundEffects.get(key)
    if (sound) {
      sound.stop()
      sound.destroy()
      this.soundEffects.delete(key)
    }
  }

  public stopAllSounds(): void {
    this.soundEffects.forEach((sound, key) => {
      sound.stop()
      sound.destroy()
      this.soundEffects.delete(key)
    })
  }

  public setGlobalVolume(volume: number): void {
    if (!this.scene) return

    const clampedVolume = Math.max(0, Math.min(1, volume))
    
    this.scene.sound.volume = clampedVolume
    
    this.soundEffects.forEach(sound => {
      if (sound.volume !== undefined) {
        sound.setVolume(clampedVolume)
      }
    })
  }

  public muteAll(): void {
    this.globalMuted = true
    if (this.scene) {
      this.scene.sound.mute = true
    }
  }

  public unmuteAll(): void {
    this.globalMuted = false
    if (this.scene) {
      this.scene.sound.mute = false
    }
  }

  public isMuted(): boolean {
    return this.globalMuted
  }

  public syncWithVueAudio(volume: number, muted: boolean): void {
    if (muted) {
      this.muteAll()
    } else {
      this.unmuteAll()
      this.setGlobalVolume(volume)
    }
  }

  public preloadBatchSounds(sounds: SoundEffect[]): void {
    if (!this.scene) return

    sounds.forEach(sound => {
      if (!this.scene!.cache.audio.exists(sound.key)) {
        this.scene!.load.audio(sound.key, sound.src)
      }
    })
  }

  public destroy(): void {
    this.stopAllSounds()
    this.scene = null
    
    window.removeEventListener('game:treeHit', () => {})
    window.removeEventListener('game:treeDestroyed', () => {})
    window.removeEventListener('game:workerCreated', () => {})
    window.removeEventListener('game:buildingPlaced', () => {})
    window.removeEventListener('game:notification', () => {})
    window.removeEventListener('audio:volumeChanged', () => {})
    window.removeEventListener('audio:muted', () => {})
    window.removeEventListener('audio:unmuted', () => {})
  }
}