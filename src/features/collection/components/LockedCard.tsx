// src/features/collection/components/LockedCard.tsx
import styles from './LockedCard.module.css'

export default function LockedCard() {
  return (
    <div className={styles.card} aria-label="Especie bloqueada">
      <div className={styles.inner}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="5" y="11" width="14" height="10" rx="2.5"/>
          <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
        </svg>
      </div>
      <div className={styles.meta}>
        <span className={styles.nick}>???</span>
        <span className={styles.sub}>Por descubrir</span>
      </div>
    </div>
  )
}
