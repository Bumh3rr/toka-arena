import { Card } from "./Card"
import styles from './CoinPillCard.module.css'


interface CoinPillCardProps {
    tf: number
}

function CoinPillCard({ tf }: CoinPillCardProps) {
    return (
        <Card colorBackground='gold'>
            <img src="/assets/ui/moneda_tf.svg" alt="TF" className={styles.imgCoin} />
            <span>{tf}</span>
            <span className={styles.tf}>TF</span>
        </Card>
    )
}

export { CoinPillCard }