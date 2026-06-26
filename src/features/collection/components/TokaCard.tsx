import type { CSSProperties } from 'react'
import { RARITY_META } from '@/shared/constants/rarity'
import { COL_SPECIES_LABEL } from '../types/collection.types'
import styles from './TokaCard.module.css'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import { getTokaPreviewAccessories } from '../lib/tokaPreviewAccessories.ts'
import type { Tokagotchi, Rarity } from '@/shared/domain/tokagotchi.ts'

// Color oscuro del info-band según rareza — crea la identidad cromática de cada card
const BAND_BG: Record<Rarity, string> = {
  COMMON:    '#1C120A',
  RARE:      '#070D1C',
  EPIC:      '#0C0518',
  LEGENDARY: '#1C0A00',
}

interface TokaCardProps {
  toka: Tokagotchi
  isActive: boolean
  count: number
  stacked: boolean
  onClick: () => void
}

export default function TokaCard({ toka, isActive, count, stacked, onClick }: TokaCardProps) {
  const meta               = RARITY_META[toka.rarity]
  const previewAccessories = getTokaPreviewAccessories(toka, [])

  return (
    <button
      className={`${styles.card} ${stacked ? styles.stacked : ''}`}
      onClick={onClick}
      style={{
        '--ring':     meta.ring,
        '--ring-soft': meta.soft,
        '--band-bg':  BAND_BG[toka.rarity],
      } as CSSProperties}
      aria-label={`${toka.name}, ${meta.label}`}
    >
      {stacked && (
        <>
          <div className={`${styles.shadow} ${styles.s2}`} />
          <div className={`${styles.shadow} ${styles.s1}`} />
        </>
      )}

      <div className={styles.inner}>
        {/* Halo ambiental de rareza detrás del toka */}
        <div className={styles.rarityGlow} aria-hidden="true" />

        {/* Canvas + count badge */}
        <div className={styles.canvasWrap}>
          <TokagotchiCanvas
            width={140}
            height={120}
            species={toka.species}
            accessories={previewAccessories}
          />
          {stacked && <span className={styles.count}>×{count}</span>}
        </div>

        {/* Badges de estado (top corners) */}
        {isActive && (
          <span className={styles.activeBadge} aria-label="Tokagotchi activo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
        {toka.fav && (
          <span className={styles.favBadge} aria-label="Favorito">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l2.3 6.2 6.5 0-5.2 4.1 1.9 6.3L12 15.8l-5.5 3.8 1.9-6.3-5.2-4.1 6.5 0z" fill="currentColor" />
            </svg>
          </span>
        )}

        {/* Info band interno — nombre, rareza, CP */}
        <div className={styles.infoBand}>
          <span className={styles.nick}>{toka.name}</span>
          <div className={styles.metaRow}>
            <span className={styles.rarityDot} aria-hidden="true" />
            <span className={styles.rarityLabel}>{meta.label}</span>
            <span className={styles.species}>{COL_SPECIES_LABEL[toka.species]}</span>
            <span className={styles.cp}>
              {toka.cp}<span className={styles.cpUnit}> CP</span>
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
