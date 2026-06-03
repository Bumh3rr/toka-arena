
import styles from './CoinPillCard.module.css'

interface CoinPillCardProps {
    tf: number
}

export default function CoinPillCard({ tf }: CoinPillCardProps) {
    return (
        <div className={styles.coinPill}>
            <img src="/assets/ui/moneda_tf.svg" alt="TF" className={styles.bump} />
            <span>{tf}</span>
            <span className={styles.tf}>TF</span>
        </div>
    )
}