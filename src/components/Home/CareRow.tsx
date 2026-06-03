// src/components/Home/CareRow.tsx
import { IcClock } from '../Icons/Icons'
import { CUIDADO_CONFIG, type AccionCuidado } from '../../constants/cuidado'
import type { Cooldowns, Floaters } from '../../hooks/useHome'
import styles from './CareRow.module.css'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

interface CareBtnProps {
  accion: AccionCuidado
  cooldown: number
  floater: number | undefined
  onUse: (a: AccionCuidado) => void
}

function CareBtn({ accion, cooldown, floater, onUse }: CareBtnProps) {
  const cfg = CUIDADO_CONFIG.find(c => c.key === accion)!
  const cool = cooldown > 0

  return (
    <button
      className={`${styles.btn} ${cool ? styles.cool : ''}`}
      disabled={cool}
      onClick={() => !cool && onUse(accion)}
    >
      {!cool && (
        <span className={styles.badge}>
          <span className={styles.dot} />+{cfg.cp} CP
        </span>
      )}
      {floater !== undefined && (
        <span className={styles.floater} key={floater}>+{cfg.cp} CP</span>
      )}
      <div className={styles.face}>
        <img
          src={cfg.img}
          alt={cfg.label}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
        <div className={styles.fallbackLabel}>{cfg.label}</div>
        {cool && (
          <div className={styles.veil}>
            <span className={styles.clock}><IcClock /></span>
            <span className={styles.timer}>{fmt(cooldown)}</span>
          </div>
        )}
      </div>
    </button>
  )
}

interface CareRowProps {
  cooldowns: Cooldowns
  floaters: Floaters
  onUse: (a: AccionCuidado) => void
}

export default function CareRow({ cooldowns, floaters, onUse }: CareRowProps) {
  return (
    <div>
      <div className={styles.secHeader}>
        <span className={styles.secTitle}>Cuidado</span>
        <span className={styles.secLine} />
      </div>
      <div className={styles.grid}>
        {CUIDADO_CONFIG.map(cfg => (
          <CareBtn
            key={cfg.key}
            accion={cfg.key}
            cooldown={cooldowns[cfg.key]}
            floater={floaters[cfg.key]}
            onUse={onUse}
          />
        ))}
      </div>
    </div>
  )
}
