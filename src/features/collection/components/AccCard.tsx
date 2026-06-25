// src/features/collection/components/AccCard.tsx
import type { ColAcc, AccSlotKey } from '../types/collection.types'
import styles from './AccCard.module.css'

const SLOT_LABEL: Record<AccSlotKey, string> = {
  cabeza: 'Cabeza',
  cuerpo: 'Cuerpo',
  cara: 'Cara',
  espalda: 'Espalda',
}

interface AccCardProps {
  acc: ColAcc
}

export default function AccCard({ acc }: AccCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.inner}>
        {acc.image ? (
          <img src={acc.image} alt={acc.name} className={styles.img} />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="3"/>
            <circle cx="8.5" cy="9.5" r="2"/>
            <path d="M21 16l-5-5-8 8"/>
          </svg>
        )}
      </div>
      <div className={styles.meta}>
        <span className={styles.name}>{acc.name}</span>
        <span className={styles.slot}>{SLOT_LABEL[acc.slot]}</span>
      </div>
      <div className={styles.badges}>
        {acc.owned > 1 && <span className={styles.qty}>×{acc.owned}</span>}
        {acc.equipped.length > 0 ? (
          <span className={styles.equipped}>
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <ellipse cx="5.5" cy="7.2" rx="1.7" ry="2.2"/>
              <ellipse cx="9.6" cy="5.4" rx="1.8" ry="2.4"/>
              <ellipse cx="13.8" cy="6.6" rx="1.7" ry="2.2"/>
              <path d="M9.6 9.4c-2.6 0-4.4 1.8-4.4 3.8 0 1.7 1.4 2.5 2.6 2.5.9 0 1.3-.4 1.8-.4s.9.4 1.8.4c1.2 0 2.6-.8 2.6-2.5 0-2-1.8-3.8-4.4-3.8z"/>
            </svg>
            En {acc.equipped.length}
          </span>
        ) : (
          <span className={styles.free}>Libre</span>
        )}
      </div>
    </div>
  )
}
