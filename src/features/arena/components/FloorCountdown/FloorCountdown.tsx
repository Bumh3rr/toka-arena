import styles from './FloorCountdown.module.css'

interface FloorCountdownProps {
  /** Número visible. En 0 no se pinta nada: el combate ya arranca. */
  value: number
}

/**
 * Cuenta atrás pintada sobre la arena.
 *
 * El `key` en el número fuerza un elemento nuevo por cada cifra, que es lo que
 * hace que la animación de golpe se repita en el 3, el 2 y el 1 en lugar de
 * quedarse congelada tras el primero.
 */
export default function FloorCountdown({ value }: FloorCountdownProps) {
  if (value <= 0) return null

  return (
    <div className={styles.floor} aria-live="polite" aria-atomic="true">
      <span key={value} className={styles.number}>{value}</span>
    </div>
  )
}
