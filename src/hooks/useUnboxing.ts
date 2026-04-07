import { useState } from 'react'
import type { Tokagotchi } from '../types/toka'
import { useGiftSound } from './useGiftSound'
import { useRevealSound } from './useRevealSound'
import { useClaimStarter } from './useClaimStarter'

export type UnboxingPhase = 'reveal' | 'breaking' | 'result'
export type GiftFase = 'idle' | 'shaking' | 'exploding'

export function useUnboxing() {
  const [phase, setPhase] = useState<UnboxingPhase>('reveal')
  const [giftFase, setGiftFase] = useState<GiftFase>('idle')
  const [result, setResult] = useState<Tokagotchi | null>(null)
  const { playShake, stopShake } = useGiftSound()
  const { playReveal } = useRevealSound()
  const { claimStarter, loading, error } = useClaimStarter()

  const startBreaking = async () => {
    setPhase('breaking')
    setGiftFase('shaking')
    playShake()

    // Llama al backend mientras el regalo vibra
    const tokagotchi = await claimStarter()

    setTimeout(() => {
      stopShake()
      setGiftFase('exploding')
    }, 1500)

    setTimeout(() => {
      if (tokagotchi) {
        setResult(tokagotchi)
        setPhase('result')
        playReveal()
      }
    }, 2100)
  }

  return { phase, giftFase, result, startBreaking, loading, error }
}