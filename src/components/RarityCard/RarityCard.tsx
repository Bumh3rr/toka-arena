import styles from './RarityCard.module.css'
import { RAR } from '../../types/tokagotchi'

interface Props {
    rarity: 'COMMON' | 'EPIC' | 'LEGENDARY' | 'RARE'
}

export default function RarityCard({ rarity }: Props) {
    const { label, ring: ringColor} = RAR[rarity]

    return (
        <div className={styles.rarity} style={
            {
                background: `linear-gradient(180deg, rgba(255,255,255,.32), rgba(0,0,0,.06)), ${ringColor}`,
                boxShadow: `inset 0 2px 0 rgba(255, 255, 255, .4), 0 3px 0 ${ringColor}`
            }
        }>
            {label}
        </div>
    )
}