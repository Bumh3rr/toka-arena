import { Label } from '@/shared/ui/Kit'
import type { StatusEffect } from '../../../types/arena.types'
import styles from './StatusChips.module.css'

interface StatusChipsProps {
  effects: StatusEffect[]
}

/**
 * Etiquetas de los estados y buffs activos, con los turnos que les quedan.
 *
 * Los perjudiciales van en rojo y los favorables en verde: el jugador tiene
 * que distinguir de un vistazo lo que le está haciendo daño de lo que le está
 * ayudando, sin leer el nombre.
 */
export default function StatusChips({ effects }: StatusChipsProps) {
  if (effects.length === 0) return null

  return (
    <div className={styles.row}>
      {effects.map((effect) => (
        <Label
          key={effect.id}
          variant={effect.harmful ? 'danger' : 'green'}
          look="soft"
          size="xs"
        >
          {effect.label}
          <span className={styles.amount}>{effect.amount}</span>
        </Label>
      ))}
    </div>
  )
}
