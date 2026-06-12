import { IcBolt, IcShield, IcHeart } from '../../Utils/Icons/Icons'
import type { Stats } from '../../../types/tokagotchi'
import styles from './styles/StatsRow.module.css'
import { HeaderTitleLine } from '../../CareSheet/CareSheet'
import { Card } from '../../UIKit'

export default function StatsRow({ stats }: { stats: Stats }) {

  const LIST_STATS = [
    { key: 'atk', label: 'Ataque', value: stats.atk, icon: <IcBolt /> },
    { key: 'def', label: 'Defensa', value: stats.def, icon: <IcShield /> },
    { key: 'hp', label: 'HP', value: stats.hp, icon: <IcHeart /> },
  ]

  return (
    <div>
      <HeaderTitleLine title="Estadísticas" />
      <div className={styles.stats}>

        {LIST_STATS.map((s) => (
          <Card key={s.key} variant="cream" shadow='md' radius='lg' className={`${styles.stat} ${styles[s.key]}`}>
            <div className={styles.ic}>{s.icon}</div>
            <div className={styles.txt}>
              <span className={styles.lab}>{s.label}</span>
              <span className={styles.val}>{s.value}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
