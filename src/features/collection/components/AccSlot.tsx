// src/features/collection/components/AccSlot.tsx
import type { ColAcc } from '../types/collection.types'
import styles from './AccSlot.module.css'

interface AccSlotProps {
  label: string
  acc?: ColAcc | undefined
  future?: boolean
}

export default function AccSlot({ label, acc, future = false }: AccSlotProps) {
  return (
    <div className={`${styles.slot} ${future ? styles.future : ''} ${acc ? styles.filled : ''}`}>
      <div className={styles.thumb}>
        {acc ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
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
      {acc && <span className={styles.name}>{acc.name}</span>}
      {future && <span className={styles.soon}>Próx.</span>}
    </div>
  )
}
