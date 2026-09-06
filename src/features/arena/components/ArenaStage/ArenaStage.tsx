import type { CSSProperties } from 'react'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import TokaStatusPill from '@/shared/ui/Tokagotchi/TokaStatusPill/TokaStatusPill'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import type { ArenaModeTheme } from '../../types/arena.types'
import styles from './ArenaStage.module.css'

interface ArenaStageProps {
  theme: ArenaModeTheme
  tokagotchi: Tokagotchi
  /** Pausa la animación cuando un panel tapa el escenario. */
  paused: boolean
  onOpenToka: () => void
}

/** Alto del canvas del tokagotchi, en px. */
const TOKA_HEIGHT = 230
/** Brasas del modo apuesta: fijas para que no se recoloquen en cada render. */
const EMBERS = [8, 21, 34, 47, 58, 69, 82, 91]

/**
 * Escenario del lobby: el tokagotchi de pie sobre el ruedo, con el aura del
 * modo activo bajo las patas y su identidad colgando debajo.
 *
 * El fondo y el aura salen del tema, así que cambiar de modo repinta la arena
 * completa sin ninguna condición aquí dentro.
 */
export default function ArenaStage({ theme, tokagotchi, paused, onOpenToka }: ArenaStageProps) {
  const stageVars = {
    '--stage-glow': theme.aura.glow,
    '--stage-glow-soft': theme.aura.glowSoft,
  } as CSSProperties

  return (
    <div className={styles.stage} style={stageVars}>
      {/* Aura del ruedo — la elipse sobre la que se planta el tokagotchi */}
      <div className={styles.aura} aria-hidden="true" />

      {theme.aura.embers && (
        <div className={styles.embers} aria-hidden="true">
          {EMBERS.map((left, i) => (
            <span
              key={left}
              className={styles.ember}
              style={{ left: `${left}%`, animationDelay: `${i * 0.7}s` }}
            />
          ))}
        </div>
      )}

      <div className={styles.toka}>
        <TokagotchiCanvas
          key={tokagotchi.species}
          species={tokagotchi.species}
          accessories={tokagotchi.equipped}
          animacionActual="idle"
          paused={paused}
          width={230}
          height={TOKA_HEIGHT}
        />
      </div>

      <div className={styles.identity}>
        <TokaStatusPill
          compact
          nombre={tokagotchi.name}
          rareza={tokagotchi.rarity}
          cp={tokagotchi.cp}
          cpMeta={tokagotchi.nextEvolution?.cpRequired ?? 0}
          onOpen={onOpenToka}
        />
      </div>
    </div>
  )
}
