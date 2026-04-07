import { useEffect, useRef } from 'react'
import { Howl } from 'howler'

// Instancia global fuera del hook — persiste entre renders
let musicInstance: Howl | null = null

export function useLoginMusic() {
  const isPlayingRef = useRef(false)

  useEffect(() => {
    // Si ya hay música corriendo, no crear otra
    if (isPlayingRef.current) return

    if (!musicInstance) {
      musicInstance = new Howl({
        src: ['/assets/audio/bg_login.mp3'],
        loop: true,
        volume: 0.1
      })
    }

    musicInstance.play()
    isPlayingRef.current = true

    return () => {
      musicInstance?.stop()
      isPlayingRef.current = false
    }
  }, [])

  const stop = () => {
    musicInstance?.stop()
    musicInstance = null
    isPlayingRef.current = false
  }

  const setVolume = (v: number) => musicInstance?.volume(v)

  return { stop, setVolume }
}