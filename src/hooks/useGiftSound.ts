import { Howl } from 'howler'

let shakeSfx: Howl | null = null

export function useGiftSound() {

  const initSounds = () => {
    if (!shakeSfx) {
      shakeSfx = new Howl({
        src: ['/assets/audio/regalo.wav'],
        loop: false,
        volume: 0.8
      })
    }
  }

  const playShake = () => {
    initSounds()
    shakeSfx?.play()
  }

  const stopShake = () => {
    shakeSfx?.stop()
  }

  return { playShake, stopShake }
}