import { IcClock } from '@/shared/ui/Icons/Icons'
import { CONFIG_CARE } from '../../constants/config'
import type { ActionCare } from '../../data/home.types'
import type { Cooldowns, Floaters } from '../../hooks/useHome'
import styles from './styles/CareRow.module.css'
import { HeaderTitleLine } from '../CareSheet/CareSheet'
import CpWidget from '../../../../shared/ui/CpWidget/CpWidget'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

interface CareBtnProps {
  accion: ActionCare
  cooldown: number
  floater: number | undefined
  onUse: (a: ActionCare) => void
}

function CareBtn({ accion, cooldown, floater, onUse }: CareBtnProps) {
  const cfg = CONFIG_CARE.find(c => c.key === accion)!
  const cool = cooldown > 0

  return (
    <button
      className={`${styles.btn} ${cool ? styles.cool : ''}`}
      disabled={cool}
      onClick={() => !cool && onUse(accion)}
    >
      {floater !== undefined && (
        <span className={styles.floater} key={floater}>
          <span className={styles.containerCp}>
            <CpWidget size={35} /> +{cfg.cp}
          </span>
        </span>
      )}
      <div className={styles.face}>
        <img
          src={cfg.img}
          alt={cfg.label}
        />
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
  onUse: (a: ActionCare) => void
  showHeader?: boolean
}

export default function CareRow({ cooldowns, floaters, onUse, showHeader = true }: CareRowProps) {
  return (
    <div>
      {showHeader && <HeaderTitleLine title="Cuidado" />}
      <div className={styles.grid}>
        {CONFIG_CARE.map(cfg => (
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
