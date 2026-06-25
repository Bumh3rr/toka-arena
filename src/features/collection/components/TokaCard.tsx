// src/features/collection/components/TokaCard.tsx
import type { CSSProperties } from 'react'
import { RARITY_META } from '@/shared/constants/rarity'
import { COL_SPECIES_LABEL } from '../types/collection.types'
import styles from './TokaCard.module.css'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import { getTokaPreviewAccessories } from '../lib/tokaPreviewAccessories.ts'
import type { Tokagotchi } from '@/shared/domain/tokagotchi.ts'

interface TokaCardProps {
  toka: Tokagotchi
  isActive: boolean
  count: number
  stacked: boolean
  onClick: () => void
}

export default function TokaCard({ toka, isActive, count, stacked, onClick }: TokaCardProps) {
  const meta = RARITY_META[toka.rarity]
  const previewAccessories = getTokaPreviewAccessories(toka, [])


  return (
    <button
      className={`${styles.card} ${stacked ? styles.stacked : ''}`}
      onClick={onClick}
      style={{ '--ring': meta.ring, '--ring-soft': meta.soft } as CSSProperties}
      aria-label={`${toka.name}, ${meta.label}`}
    >
      {stacked && (
        <>
          <div className={`${styles.shadow} ${styles.s2}`} />
          <div className={`${styles.shadow} ${styles.s1}`} />
        </>
      )}
      <div className={styles.inner}>
        <TokagotchiCanvas
          width={140} 
          height={120}
          species={toka.species}
          accessories={previewAccessories}
        />

        {isActive && (
          <span className={styles.activeBadge} aria-label="Tokagotchi activo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </span>
        )}
        {toka.name && (
          <span className={styles.favBadge} aria-label="Favorito">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l2.3 6.2 6.5 0-5.2 4.1 1.9 6.3L12 15.8l-5.5 3.8 1.9-6.3-5.2-4.1 6.5 0z" fill="currentColor"/>
            </svg>
          </span>
        )}
        {stacked && <span className={styles.count}>×{count}</span>}
      </div>
      <div className={styles.meta}>
        <span className={styles.nick}>{toka.name}</span>
        <span className={styles.sub}>
          {COL_SPECIES_LABEL[toka.species]} · <span style={{ color: meta.ring }}>{meta.label}</span>
        </span>
      </div>
    </button>
  )
}
