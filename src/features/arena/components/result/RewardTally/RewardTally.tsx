import { Card } from '@/shared/ui/Kit'
import { useCountUp } from '../../../hooks/useCountUp'
import styles from './RewardTally.module.css'

interface RewardTallyProps {
  /** Encabezado, distinto según se haya ganado o perdido. */
  lead: string
  tf: number
  cp: number
  /** Saldo de TF con el que se queda el jugador. */
  tfTotal: number
}

/**
 * Lo que el combate dejó.
 *
 * Es la razón por la que esta pantalla existe, así que va en el centro y con
 * las cifras subiendo: un número que crece se mira, uno que ya está puesto se
 * lee por encima.
 *
 * Los valores son reales —salen de comparar el perfil antes y después—, no la
 * tabla de recompensas escrita a mano.
 */
export default function RewardTally({ lead, tf, cp, tfTotal }: RewardTallyProps) {
  const tfShown = useCountUp(tf)
  const cpShown = useCountUp(cp)

  return (
    <Card padding="md" radius="lg" className={styles.card}>
      <span className={styles.lead}>{lead}</span>

      <div className={styles.row}>
        <div className={styles.prize}>
          <img className={styles.icon} src="/assets/ui/tf/moneda_tf.png" alt="" />
          <span className={styles.amount}>+{tfShown}</span>
          <span className={styles.unit}>TokaFeed</span>
        </div>

        <span className={styles.divider} aria-hidden="true" />

        <div className={styles.prize}>
          <img className={styles.icon} src="/assets/ui/cp/cp.png" alt="" />
          <span className={styles.amount}>+{cpShown}</span>
          <span className={styles.unit}>Cuidado</span>
        </div>
      </div>

      <span className={styles.balance}>Saldo: {tfTotal} TF</span>
    </Card>
  )
}
