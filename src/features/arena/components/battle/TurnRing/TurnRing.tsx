import { TURN_SECONDS } from '../../../constants/battle'
import styles from './TurnRing.module.css'

interface TurnRingProps {
  /** Retrato del combatiente. */
  src: string
  /** Segundos que quedan del turno. */
  secondsLeft: number
  /** false ⇒ solo el retrato, sin anillo ni cuenta. */
  active: boolean
  label: string
}

const SIZE = 56
const STROKE = 4
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Bajo estos segundos el anillo avisa. */
const URGENT_SECONDS = 5

/**
 * Retrato del combatiente con la cuenta atrás de su turno alrededor.
 *
 * El anillo solo aparece en quien tiene el turno: así de quién es se lee en el
 * mismo sitio donde se mira el HP, sin buscar la etiqueta del escenario.
 *
 * A cero no cambia a "vencido" porque no lo está: el servidor tarda hasta 5 s
 * en forzar el descanso automático, y adelantarse sería mentir.
 */
export default function TurnRing({ src, secondsLeft, active, label }: TurnRingProps) {
  const pct = Math.min(1, Math.max(0, secondsLeft / TURN_SECONDS))
  const urgent = secondsLeft <= URGENT_SECONDS

  return (
    <div className={styles.wrap}>
      <img className={styles.portrait} src={src} alt="" />

      {active && (
        <>
          <svg
            className={styles.ring}
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            aria-hidden="true"
          >
            <circle
              className={`${styles.arc} ${urgent ? styles.arcUrgent : ''}`}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - pct)}
            />
          </svg>

          <span
            className={`${styles.seconds} ${urgent ? styles.secondsUrgent : ''}`}
            aria-label={`${label}: ${secondsLeft} segundos`}
          >
            {secondsLeft}
          </span>
        </>
      )}
    </div>
  )
}
