import styles from './CoinPillCard.module.css'

interface CoinPillCardProps {
  tf: number
  bump?: boolean
}

export default function CoinPillCard({ tf, bump = false }: CoinPillCardProps) {
  return (
    <div className={styles.coinPill}>
      <img src="/assets/ui/moneda_tf.svg" alt="TF" className={bump ? styles.bump : ''} />
      <span>{tf}</span>
      <span className={styles.tf}>TF</span>
    </div>
  )
}
