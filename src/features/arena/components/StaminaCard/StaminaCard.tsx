import { Card } from '@/shared/ui/Kit'
import { useCountdown } from '../../hooks/useCountdown'
import { formatCountdown } from '../../lib/time'
import type { Stamina } from '../../types/arena.types'
import styles from './StaminaCard.module.css'

interface StaminaCardProps {
  stamina: Stamina
}

// Geometría del anillo de progreso
const RING_SIZE = 42
const RING_STROKE = 4
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

/**
 * Píldora de estamina anclada al borde izquierdo del lobby.
 *
 * Muestra los puntos disponibles dentro de un anillo de progreso y la cuenta
 * atrás hasta el siguiente punto. Sin estamina cambia a tono de alerta y deja
 * de anunciar el `+1` (no hay nada que sumar todavía).
 */
export default function StaminaCard({ stamina }: StaminaCardProps) {
  const { current, max, nextRefillAt } = stamina
  const remaining = useCountdown(nextRefillAt)

  const isEmpty = current === 0
  const isFull = current >= max
  const pct = Math.min(1, current / Math.max(1, max))

  // Con el plazo cumplido el punto ya viene en camino: no anunciamos un 0:00 fijo
  const hint = isFull
    ? 'Al máximo'
    : remaining === 0
      ? 'Recargando...'
      : isEmpty
        ? `en ${formatCountdown(remaining)}`
        : `+1 en ${formatCountdown(remaining)}`

  return (
    <Card
      padding="none"
      radius="lg"
      className={`${styles.card} ${isEmpty ? styles.empty : ''}`}
    >
      <div className={styles.ring}>
        <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} aria-hidden="true">
          <circle
            className={styles.track}
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            strokeWidth={RING_STROKE}
          />
          <circle
            className={styles.fill}
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            strokeWidth={RING_STROKE}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - pct)}
          />
        </svg>
        <span className={styles.value}>{current}</span>
        {isEmpty && <span className={styles.alertDot} aria-hidden="true" />}
      </div>

      <div className={styles.info}>
        <span className={styles.title}>Estamina</span>
        <span className={styles.hint}>{hint}</span>
      </div>
    </Card>
  )
}
