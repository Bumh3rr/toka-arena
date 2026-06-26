import type { Rarity } from '@/shared/domain/tokagotchi'
import { IcChevUp } from '@/shared/ui/Icons/Icons'
import RarityCard from '@/shared/ui/Cards/RarityCard/RarityCard'
import styles from './TokaStatusPill.module.css'

interface TokaStatusPillProps {
  nombre: string
  rareza: Rarity
  cp: number
  cpMeta: number
  onOpen: () => void
}

export default function TokaStatusPill({ nombre, rareza, cp, cpMeta, onOpen }: TokaStatusPillProps) {
  const pct = Math.min(100, Math.round((cp / Math.max(1, cpMeta)) * 100))

  return (
    <button className={styles.statusPill} onClick={onOpen} aria-label="Ver detalles del tokagotchi">
      <div className={styles.statusTop}>
        <span className={styles.statusNm}>{nombre}</span>
        <RarityCard rarity={rareza} size="sm" />
        <span className={styles.statusChev}><IcChevUp /></span>
      </div>
      <div className={styles.statusBottom}>
        <div className={styles.cpBar}>
          <div
            className={`${styles.cpFill} ${pct > 0 ? styles.cpFillActive : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={styles.cpVal}><b className={styles.cpNow}>{cp}</b>/{cpMeta} 
          <img src="/assets/ui/cp/cp.png" alt="" className={styles.icon} />
        </span>
      </div>
    </button>
  )
}
