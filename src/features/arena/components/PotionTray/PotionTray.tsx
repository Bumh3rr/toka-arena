import type { CSSProperties } from 'react'
import { IcChevUp } from '@/shared/ui/Icons/Icons'
import type { PotionSlot } from '../../types/arena.types'
import styles from './PotionTray.module.css'

interface PotionTrayProps {
  slots: PotionSlot[]
  onOpen: () => void
}

/**
 * Bandeja de pociones equipadas del lobby.
 *
 * Toda la píldora es el disparador del panel de pociones — igual que el
 * TokaStatusPill de Home abre el detalle del tokagotchi.
 */
export default function PotionTray({ slots, onOpen }: PotionTrayProps) {
  const equipped = slots.filter((slot) => slot.potion !== null).length

  return (
    <button
      className={styles.tray}
      onClick={onOpen}
      aria-label={`Pociones equipadas: ${equipped} de ${slots.length}`}
    >
      {slots.map((slot) => {
        const { potion } = slot

        return (
          <span
            key={slot.index}
            className={`${styles.slot} ${potion ? '' : styles.slotEmpty}`}
            style={potion ? ({ '--slot-tint': potion.tint } as CSSProperties) : undefined}
          >
            {potion && <img src={potion.image} alt="" className={styles.potion} />}
          </span>
        )
      })}

      <span className={styles.chev} aria-hidden="true"><IcChevUp /></span>
    </button>
  )
}
