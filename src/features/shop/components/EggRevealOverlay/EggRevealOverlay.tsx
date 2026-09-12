import { useState, useRef, useCallback, useEffect } from 'react'
import { useSWRConfig } from 'swr'
import { useGiftSound } from '@/shared/audio/hooks/useGiftSound'
import { useRevealSound } from '@/shared/audio/hooks/useRevealSound'
import { useNavBar } from '@/shared/hooks/useNavBar'
import Portal from '@/shared/ui/Portal/Portal'
import { tokagotchiApi } from '@/shared/api/tokagotchi.api'
import { mapTokagotchiDTO } from '@/shared/domain/mappers/tokagotchi.mapper'
import { getEggArt } from '../../lib/eggArt'
import GenesisReveal from '@/features/unboxing/components/GenesisReveal/GenesisReveal'
import type { Rarity, Tokagotchi } from '@/shared/domain/tokagotchi'
import styles from './EggRevealOverlay.module.css'

type Phase = 'idle' | 'breaking' | 'result'

const BREAK_MS = 1500

interface EggRevealOverlayProps {
  tokagotchi: Tokagotchi
  /** Rareza del huevo comprado, para que el que se rompe sea el que se pagó. */
  eggRarity: Rarity
  onClose: () => void
}

export default function EggRevealOverlay({ tokagotchi, eggRarity, onClose }: EggRevealOverlayProps) {
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

  /*
   * Portal a <body>: el overlay es position:fixed y vive dentro de
   * FeatureScreen .content, que tiene scroll interno. En iOS WebKit un fixed
   * ahí dentro se ancla al contenido desplazado y deja de cubrir el viewport
   * (es el BUG-6, y los huevos están en la segunda sección, así que el
   * jugador casi siempre habrá desplazado). Mismo remedio que BuyConfirmSheet.
   */
  return (
    <Portal>
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
              <img src={getEggArt(eggRarity)} alt="" aria-hidden="true" className={styles.egg} />
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
    </Portal>
  )
}
