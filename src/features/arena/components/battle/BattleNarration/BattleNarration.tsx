import type { CSSProperties } from 'react'
import { LOG_VISIBLE_MS } from '../../../constants/battle'
import styles from './BattleNarration.module.css'

interface BattleNarrationProps {
  /** Última frase del servidor. Cadena vacía si todavía no hay ninguna. */
  text: string
}

/**
 * Lo que acaba de pasar, contado sobre el ruedo.
 *
 * Antes esto era una tarjeta fija bajo el escenario, y ahí no se leía: durante
 * el combate el ojo está en los Tokagotchis, no en el pie de pantalla. Aquí
 * aparece con cada acción, se lee sin apartar la vista y se retira sola para no
 * tapar la pelea.
 *
 * El texto viene **redactado por el servidor** y se muestra tal cual: darle
 * otro formato exigiría parsear la frase, y eso se rompe con cada retoque del
 * copy del backend.
 *
 * El `key` por texto es lo único que hace falta para que reaparezca: cada
 * frase monta un elemento nuevo y su animación arranca de cero. Sin estado ni
 * temporizador que sincronizar — y como el servidor manda el estado íntegro en
 * cada mensaje, que la frase no cambie significa que no hubo nada que anunciar.
 */
export default function BattleNarration({ text }: BattleNarrationProps) {
  if (!text) return null

  return (
    <p
      key={text}
      className={styles.banner}
      style={{ '--narration-life': `${LOG_VISIBLE_MS}ms` } as CSSProperties}
      aria-live="polite"
    >
      {text}
    </p>
  )
}
