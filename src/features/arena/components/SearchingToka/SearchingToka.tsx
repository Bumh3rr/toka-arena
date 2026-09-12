import type { CSSProperties } from 'react'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import type { ModeAura } from '../../types/arena.types'
import styles from './SearchingToka.module.css'

interface SearchingTokaProps {
  tokagotchi: Tokagotchi
  /** Aura del modo activo, la misma que pisa en el lobby. */
  aura: ModeAura
  /**
   * Recibe el canvas capturado en cuanto el personaje está en pie.
   *
   * Es el único momento del flujo en que hay un Tokagotchi vestido renderizado,
   * así que de aquí sale la cara de la moneda. Debe ser estable.
   */
  onPortrait: (dataUrl: string) => void
}

/** Alto del canvas, en px. */
const TOKA_SIZE = 240

/**
 * El Tokagotchi del jugador esperando rival en el ruedo.
 *
 * Ocupa el mismo hueco que la moneda —y la misma altura de caja— para que el
 * rótulo colgado no se mueva de sitio cuando aparece el emparejamiento.
 *
 * El `key` por especie es el arreglo de BUG-2: `TokagotchiGame` se crea una
 * sola vez al montar, así que cambiar de Tokagotchi exige remontar el canvas.
 */
export default function SearchingToka({
  tokagotchi,
  aura,
  onPortrait,
}: SearchingTokaProps) {
  const vars = {
    '--stage-glow': aura.glow,
    '--stage-glow-soft': aura.glowSoft,
  } as CSSProperties

  return (
    <div className={styles.stage} style={vars}>
      <div className={styles.aura} aria-hidden="true" />

      <div className={styles.toka}>
        <TokagotchiCanvas
          key={tokagotchi.species}
          species={tokagotchi.species}
          accessories={tokagotchi.equipped}
          animacionActual="idle"
          width={TOKA_SIZE}
          height={TOKA_SIZE}
          onPortrait={onPortrait}
        />
      </div>
    </div>
  )
}
