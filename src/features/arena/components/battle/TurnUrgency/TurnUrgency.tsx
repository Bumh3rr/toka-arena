import styles from './TurnUrgency.module.css'

interface TurnUrgencyProps {
  /** Segundos que quedan del turno. */
  secondsLeft: number
}

/**
 * Cuenta atrás grande sobre el ruedo, en los últimos segundos del turno.
 *
 * El anillo del avatar lleva la cuenta todo el turno, pero está en el borde de
 * la pantalla y el jugador está mirando al centro. Cuando el tiempo se acaba de
 * verdad, el aviso va donde ya están los ojos.
 *
 * El `key` por segundo fuerza un elemento nuevo en cada cifra: es lo que hace
 * que el golpe se repita en el 6, el 5, el 4... en vez de quedarse congelado
 * tras el primero.
 */
export default function TurnUrgency({ secondsLeft }: TurnUrgencyProps) {
  return (
    <div className={styles.wrap} aria-live="assertive" aria-atomic="true">
      <span key={secondsLeft} className={styles.number}>
        {secondsLeft}
      </span>
      <span className={styles.hint}>Se acaba tu turno</span>
    </div>
  )
}
