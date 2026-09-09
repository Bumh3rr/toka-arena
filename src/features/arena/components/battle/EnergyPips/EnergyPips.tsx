import styles from './EnergyPips.module.css'

interface EnergyPipsProps {
  /** Energía actual, 0–100. */
  value: number
  /** Coste de la habilidad que el jugador está considerando, si hay alguna. */
  preview?: number
}

/** Un bloque por cada 10 de energía. */
const PIPS = 10
const PER_PIP = 100 / PIPS

/**
 * Energía en bloques en vez de barra continua.
 *
 * Las habilidades cuestan 15, 25, 35 o 60, así que lo que el jugador necesita
 * saber no es "cuánta energía tengo" sino "me alcanza para esta". Los bloques
 * se cuentan de un vistazo; una barra continua obliga a estimar.
 */
export default function EnergyPips({ value, preview }: EnergyPipsProps) {
  const filled = Math.round(value / PER_PIP)
  const spent = preview ? Math.round(preview / PER_PIP) : 0

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Energía"
    >
      {Array.from({ length: PIPS }, (_, i) => {
        // Los últimos bloques llenos se marcan como los que gastaría la
        // habilidad seleccionada, para ver el coste antes de confirmarlo
        const isFilled = i < filled
        const isSpent = isFilled && i >= filled - spent

        return (
          <span
            key={i}
            className={`${styles.pip} ${isFilled ? styles.pipOn : ''} ${isSpent ? styles.pipSpent : ''}`}
          />
        )
      })}
    </div>
  )
}
