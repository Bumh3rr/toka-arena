import type { CSSProperties } from 'react'
import type { ResultTheme } from '../../../constants/results'
import styles from './VerdictBanner.module.css'

interface VerdictBannerProps {
  theme: ResultTheme
  /** Turnos que duró el combate. */
  turns: number
  rivalName: string
}

/**
 * El veredicto.
 *
 * Es lo único que el jugador necesita leer en el primer medio segundo, así que
 * ocupa el tamaño que le corresponde y el resto de la pantalla se ordena
 * debajo. La línea de contexto va pequeña: importa, pero después.
 */
export default function VerdictBanner({ theme, turns, rivalName }: VerdictBannerProps) {
  const vars = { '--verdict-glow': theme.glow } as CSSProperties

  return (
    <header className={styles.banner} style={vars}>
      <h1 className={styles.title}>{theme.title}</h1>
      <p className={styles.subtitle}>{theme.subtitle}</p>
      <p className={styles.meta}>
        contra {rivalName} · {turns} {turns === 1 ? 'turno' : 'turnos'}
      </p>
    </header>
  )
}
