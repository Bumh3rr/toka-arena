// src/components/Home/StatsRow.tsx
import { IcBolt, IcShield, IcHeart } from '../Icons/Icons'
import type { TokagotchiStats } from '../../types/tokagotchi'
import styles from './StatsRow.module.css'
import { HeaderTitleLine } from '../CareSheet/CareSheet'

export default function StatsRow({ stats }: { stats: TokagotchiStats }) {
  return (
    <div>
      <HeaderTitleLine title="Estadísticas" />
      <div className={styles.stats}>
        <div className={`${styles.stat} ${styles.atk}`}>
          <div className={styles.ic}><IcBolt /></div>
          <div className={styles.txt}>
            <span className={styles.lab}>Ataque</span>
            <span className={styles.val}>{stats.atk}</span>
          </div>
        </div>
        <div className={`${styles.stat} ${styles.def}`}>
          <div className={styles.ic}><IcShield /></div>
          <div className={styles.txt}>
            <span className={styles.lab}>Defensa</span>
            <span className={styles.val}>{stats.def}</span>
          </div>
        </div>
        <div className={`${styles.stat} ${styles.hp}`}>
          <div className={styles.ic}><IcHeart /></div>
          <div className={styles.txt}>
            <span className={styles.lab}>HP</span>
            <span className={styles.val}>{stats.hp}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
