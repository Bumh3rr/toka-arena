import type { EquippedAccessory } from '@/shared/domain/accessory'
import { getAccessoryImagePngSrc } from '@/shared/game/assets'
import { getAccessoryDisplayName } from '@/shared/constants/accessory'
import styles from './AccSlot.module.css'

interface AccSlotProps {
  label: string
  acc?: EquippedAccessory
  future?: boolean
  selected?: boolean
  onClick?: () => void
}

export default function AccSlot({ label, acc, future = false, selected = false, onClick }: AccSlotProps) {
  const name   = acc ? getAccessoryDisplayName(acc.type) : null
  const imgSrc = acc ? getAccessoryImagePngSrc(acc.type) : null

  const inner = (
    <>
      <div className={styles.thumb}>
        {acc && imgSrc ? (
          <img src={imgSrc} alt="" aria-hidden="true" className={styles.thumbImg} />
        ) : acc ? (
          <span className={styles.thumbFallback} aria-hidden="true">{acc.slot[0]}</span>
        ) : future ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        )}
      </div>
      <span className={styles.label}>{label}</span>
      {name   && <span className={styles.name}>{name}</span>}
      {future && <span className={styles.soon}>Próx.</span>}
    </>
  )

  if (future) {
    return (
      <div className={`${styles.slot} ${styles.future}`}>
        {inner}
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`${styles.slot} ${acc ? styles.filled : ''} ${selected ? styles.selected : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {inner}
    </button>
  )
}
