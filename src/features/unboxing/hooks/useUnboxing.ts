import { useState } from 'react'
import type { TokagotchiActive } from '@/shared/model/tokagotchi'
import { useGiftSound } from './useGiftSound'
import { useRevealSound } from './useRevealSound'
import { useClaimStarter } from './useClaimStarter'
import { useToast } from '@/shared/hooks/useToast'
import { useNavigate } from 'react-router-dom'

export type UnboxingPhase = 'reveal' | 'breaking' | 'result'
export type GiftFase = 'idle' | 'shaking' | 'exploding'

export function useUnboxing() {
  const [phase, setPhase] = useState<UnboxingPhase>('reveal')
  const [giftFase, setGiftFase] = useState<GiftFase>('idle')
  const [result, setResult] = useState<TokagotchiActive | null>(null)
  const { playShake, stopShake } = useGiftSound()
  const { playReveal } = useRevealSound()
  const { claimStarter, loading, error } = useClaimStarter()
  const { show, toast } = useToast()
  const navigate = useNavigate()


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
      }else{
        setPhase('reveal')
        setGiftFase('idle')
        show("Error al reclamar el Tokagotchi", { variant: "danger" });
        setTimeout(() => {navigate('/login', { replace: true })}, 1000)
      }
    }, 2100)
  }

  return { phase, giftFase, result, startBreaking, loading, error, toast };
}