import { Card, Label } from '@/shared/ui/Kit'
import { useCountdown } from '../../../hooks/useCountdown'
import { formatCountdown } from '../../../lib/time'
import type { Stamina } from '../../../types/arena.types'
import styles from './AftermathRow.module.css'

interface AftermathRowProps {
  stamina: Stamina
}

/**
 * Lo que costó el combate.
 *
 * La estamina se cobra **al terminar**, no al entrar a la cola, así que este es
 * el primer momento en que el jugador ve el cargo. Y es lo que decide si puede
 * volver a pelear: cuando llega a cero, el aviso pasa a rojo y dice cuándo
 * vuelve, en vez de dejarlo descubrirlo al chocar con el botón del lobby.
 */
export default function AftermathRow({ stamina }: AftermathRowProps) {
  const remaining = useCountdown(stamina.nextRefillAt)
  const empty = stamina.current === 0

  const hint = empty
    ? `Vuelve en ${formatCountdown(remaining)}`
    : stamina.current >= stamina.max
      ? 'Al máximo'
      : `+1 en ${formatCountdown(remaining)}`

  return (
    <Card padding="sm" radius="lg" className={styles.card}>
      <div className={styles.pips} aria-hidden="true">
        {Array.from({ length: stamina.max }, (_, i) => (
          <span key={i} className={`${styles.pip} ${i < stamina.current ? styles.pipOn : ''}`} />
        ))}
      </div>

      <div className={styles.info}>
        <span className={styles.label}>
          Estamina{' '}
          <strong className={empty ? styles.empty : undefined}>
            {stamina.current}/{stamina.max}
          </strong>
        </span>
        <span className={styles.hint}>{hint}</span>
      </div>

      {empty && (
        <Label variant="danger" look="soft" size="xs" uppercase>
          Sin estamina
        </Label>
      )}
    </Card>
  )
}
