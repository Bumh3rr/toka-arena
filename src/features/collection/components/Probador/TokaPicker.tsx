import type { CSSProperties } from 'react'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import { getSpeciesImageSrc, getAccessoryImageSrc } from '@/shared/game/assets'
import { RARITY_META } from '@/shared/constants/rarity'
import { IcClothes, IcReady } from '@/shared/ui/Icons/Icons'
import styles from './TokaPicker.module.css'
import CardRarity from '@/shared/ui/Tokagotchi/Cards/CardRarity/CardRarity'

interface TokaPickerProps {
  roster: Tokagotchi[]
  activeTokaId: string
  selectedTokaId: string
  onSelect: (id: string) => void
}

export default function TokaPicker({ roster, activeTokaId, selectedTokaId, onSelect }: TokaPickerProps) {
  return (
    <div className={styles.strip} role="listbox" aria-label="Elegir Tokagotchi">
      {roster.map((t) => {
        const meta       = RARITY_META[t.rarity]
        const isSelected = t.id === selectedTokaId
        const isActive   = t.id === activeTokaId
        const ringVars   = { '--ring': meta.ring, '--ring-soft': meta.soft } as CSSProperties

        if (isSelected) {
          return (
            <button
              key={t.id}
              type="button"
              role="option"
              aria-selected
              aria-label={`${t.name}, ${meta.label}, vistiendo`}
              className={styles.featured}
              style={ringVars}
              onClick={() => onSelect(t.id)}
            >
              <span className={styles.wearing}>Vistiendo</span>
              <span className={styles.featuredThumb}>
                <img src={getSpeciesImageSrc(t.species)} alt="" aria-hidden="true" className={styles.featuredImg} />
                {isActive && <span className={styles.activeDot} aria-hidden="true"><IcReady /></span>}
              </span>
              <span className={styles.featuredInfo}>
                <span className={styles.featuredName}>{t.name}</span>
                <CardRarity size='sm' rarity={t.rarity} />
                <span className={styles.featuredMeta}>
                  <img src="/assets/ui/cp/cp.png" alt="" aria-hidden="true" className={styles.featuredCpIcon} /> {t.cp} { }
                  <IcClothes /> {t.equipped.length}
                </span>
              </span>
              <span className={styles.tail} aria-hidden="true" />
            </button>
          )
        }

        return (
          <button
            key={t.id}
            type="button"
            role="option"
            aria-selected={false}
            aria-label={`${t.name}${isActive ? ', activo' : ''}`}
            className={styles.avatar}
            style={ringVars}
            onClick={() => onSelect(t.id)}
          >
            <span className={styles.thumbWrap}>
              <img src={getSpeciesImageSrc(t.species)} alt="" aria-hidden="true" className={styles.thumb} />
              {t.equipped.length > 0 && (
                <span className={styles.badges} aria-hidden="true">
                  {t.equipped.slice(0, 3).map((acc) => {
                    const src = getAccessoryImageSrc(acc.type)
                    return (
                      <span key={acc.slot} className={styles.badge}>
                        {src
                          ? <img src={src} alt="" className={styles.badgeImg} />
                          : <span className={styles.badgeFallback}>{acc.slot[0]}</span>}
                      </span>
                    )
                  })}
                </span>
              )}
              {isActive && <span className={styles.activeDot} aria-hidden="true"><IcReady /></span>}
            </span>
            <span className={styles.name}>{t.name}</span>
          </button>
        )
      })}
    </div>
  )
}
