import styles from './PulseRings.module.css'

/** Retardo de cada anillo, en segundos. Uno por anillo. */
const RING_DELAYS = [0, 0.6, 1.2]

/**
 * Anillos concéntricos que se expanden detrás de la moneda.
 *
 * Hacen doble trabajo: mientras se busca rival leen como un radar, y durante
 * el volado marcan el pulso del giro sin competir con la moneda.
 */
export default function PulseRings() {
  return (
    <div className={styles.rings} aria-hidden="true">
      {RING_DELAYS.map((delay) => (
        <span
          key={delay}
          className={styles.ring}
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  )
}
