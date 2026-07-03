import { useState } from "react"
import { Button } from "@/shared/ui/Kit"
import styles from './CoinPillCard.module.css'

interface CoinPillCardProps {
    tf: number
    onClick?: () => void
}

function CoinPillCard({ tf, onClick }: CoinPillCardProps) {
    const [dump, setDump] = useState(false)
    return (
        <Button
            radius="pill"
            onClick={() => {
                if (dump) return
                setDump(!dump)
                setTimeout(() => setDump(false), 400)
                if (onClick) onClick()
            }}
        >
            <img src="/assets/ui/tf/tf.svg" alt="TF" className={`${styles.imgCoin} ${dump ? styles.dump : ''}`} />
            <span>{tf}</span>
            <span className={styles.tf}>TF</span>
        </Button>
    )
}

export { CoinPillCard }