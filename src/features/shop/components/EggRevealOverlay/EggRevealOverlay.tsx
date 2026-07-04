import { useState, useRef, useCallback, useEffect } from 'react'
import { useSWRConfig } from 'swr'
import { useGiftSound } from '@/shared/audio/hooks/useGiftSound'
import { useRevealSound } from '@/shared/audio/hooks/useRevealSound'
import { useNavBar } from '@/shared/hooks/useNavBar'
import { tokagotchiApi } from '@/shared/api/tokagotchi.api'
import { mapTokagotchiDTO } from '@/shared/domain/mappers/tokagotchi.mapper'
import GenesisReveal from '@/features/unboxing/components/GenesisReveal/GenesisReveal'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import styles from './EggRevealOverlay.module.css'

type Phase = 'idle' | 'breaking' | 'result'

const EGG_IMG = '/assets/ui/egg/egg.png'
const BREAK_MS = 1500

interface EggRevealOverlayProps {
  tokagotchi: Tokagotchi
  onClose: () => void
}

export default function EggRevealOverlay({ tokagotchi, onClose }: EggRevealOverlayProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [toka, setToka] = useState(tokagotchi)
  const { playShake, stopShake } = useGiftSound()
  const { playReveal } = useRevealSound()
  const { hideBar, showBar } = useNavBar()
  const { mutate } = useSWRConfig()
  const timers = useRef<number[]>([])

  useEffect(() => {
    hideBar()
    const t = timers.current
    return () => {
      showBar()
      t.forEach(clearTimeout)
    }
  }, [hideBar, showBar])

  const startBreaking = useCallback(() => {
    if (phase !== 'idle') return
    setPhase('breaking')
    playShake()
    timers.current.push(
      window.setTimeout(() => {
        stopShake()
        setPhase('result')
        playReveal()
      }, BREAK_MS),
    )
  }, [phase, playShake, stopShake, playReveal])

  const handleRename = useCallback(
    async (name: string) => {
      const dto = await tokagotchiApi.rename(toka.id, name)
      setToka(mapTokagotchiDTO(dto))
      await mutate((key) => Array.isArray(key) && key[0] === 'collection.tokas')
    },
    [toka.id, mutate],
  )

  return (
    <div className={styles.overlay}>
      {phase !== 'result' && (
        <div className={styles.stage}>
          <h1 className={styles.title}>¡Tu nuevo huevo!</h1>

          <button
            type="button"
            className={`${styles.eggWrap} ${phase === 'breaking' ? styles.breaking : styles.idle}`}
            onClick={startBreaking}
            disabled={phase === 'breaking'}
            aria-label="Abrir huevo"
          >
            <span className={styles.glow} aria-hidden="true" />
            <img src={EGG_IMG} alt="" aria-hidden="true" className={styles.egg} />
          </button>

          {phase === 'idle' && <p className={styles.hint}>Toca para abrir</p>}
          {phase === 'breaking' && <div className={styles.flash} aria-hidden="true" />}
        </div>
      )}

      {phase === 'result' && (
        <GenesisReveal
          tokagotchi={toka}
          onStart={onClose}
          onRename={handleRename}
          title="¡Nuevo Tokagotchi!"
          subtitle="Se unió a tu colección"
          ctaLabel="¡Genial!"
        />
      )}
    </div>
  )
}
