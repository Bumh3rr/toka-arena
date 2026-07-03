import type { CSSProperties } from 'react'
import { RARITY_META } from '@/shared/constants/rarity'
import styles from './TokaCard.module.css'
import type { Tokagotchi, Rarity } from '@/shared/domain/tokagotchi.ts'
import { getSpeciesImageSrc, getAccessoryImageSrc } from '@/shared/game/assets.ts'
import { IcReady } from '@/shared/ui/Icons/Icons'
import CardRarity from '@/shared/ui/Tokagotchi/Cards/CardRarity/CardRarity'
import CardSpecies from '@/shared/ui/Tokagotchi/Cards/CardSpecies/CardSpecies'

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
        <div className={styles.positionCardSpecies}>
          <CardSpecies species={toka.species} />
        </div>

        {/* Canvas + count badge */}
        <div className={styles.canvasWrap}>
          <img src={getSpeciesImageSrc(toka.species)} alt={toka.name} style={{ width: 140, height: 120, objectFit: 'contain' }} />
          {stacked && <span className={styles.count}>×{count}</span>}

          {toka.equipped.length > 0 && (
            <div className={styles.accBadges} aria-label="Accesorios equipados">
              {toka.equipped.map((acc, i) => {
                const src = getAccessoryImageSrc(acc.type)
                return (
                  <div
                    key={acc.slot}
                    className={styles.accBadge}
                    style={{ zIndex: toka.equipped.length - i }}
                    aria-label={acc.type.toLowerCase().replace(/_/g, ' ')}
                  >
                    {src
                      ? <img src={src} alt="" aria-hidden="true" className={styles.accBadgeImg} />
                      : <span className={styles.accBadgeFallback} aria-hidden="true">{acc.slot[0]}</span>
                    }
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Badges de estado (top corners) */}
        {isActive && (<span className={styles.activeBadge} aria-label="Tokagotchi activo"><IcReady /></span> )}
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
            <CardRarity rarity={toka.rarity} size="sm" />
            <span className={styles.cp}>
              <img src="/assets/ui/cp/cp.png" alt="" aria-hidden="true" className={styles.cpIcon} /> {toka.cp} <span className={styles.cpUnit}> CP</span>
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
