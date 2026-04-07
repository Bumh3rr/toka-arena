import { Howl } from 'howler'

let revealSfx: Howl | null = null

export function useRevealSound() {
  const initSound = () => {
    if (!revealSfx) {
      revealSfx = new Howl({
        src: ['/assets/audio/exito.wav'],
        loop: false,
        volume: 0.9
      })
    }
  }

  const playReveal = () => {
    initSound()
    revealSfx?.play()
  }

  return { playReveal }
}