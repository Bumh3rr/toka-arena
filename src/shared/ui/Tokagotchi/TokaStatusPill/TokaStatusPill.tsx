import type { Rarity } from '@/shared/domain/tokagotchi'
import { IcChevUp } from '@/shared/ui/Icons/Icons'
import CardRarity from '@/shared/ui/Tokagotchi/Cards/CardRarity/CardRarity'
import styles from './TokaStatusPill.module.css'

interface TokaStatusPillProps {
  nombre: string
  rareza: Rarity
  cp: number
  cpMeta: number
  onOpen: () => void
  /**
   * Oculta la barra de CP y deja solo la identidad.
   * Se usa donde la píldora compite con el escenario (Arena) y el progreso
   * de evolución no es la información principal.
   */
  compact?: boolean
}

export default function TokaStatusPill({
  nombre,
  rareza,
  cp,
  cpMeta,
  onOpen,
  compact = false,
}: TokaStatusPillProps) {
  const pct = Math.min(100, Math.round((cp / Math.max(1, cpMeta)) * 100))

  return (
    <button
      className={`${styles.statusPill} ${compact ? styles.compact : ''}`}
      onClick={onOpen}
      aria-label="Ver detalles del tokagotchi"
    >
      <div className={styles.statusTop}>
        <span className={styles.statusNm}>{nombre}</span>
        <CardRarity rarity={rareza} size="sm" />
        <span className={styles.statusChev}><IcChevUp /></span>
      </div>

      {!compact && (
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
      )}
    </button>
  )
}
