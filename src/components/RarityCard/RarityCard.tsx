import styles from './RarityCard.module.css'
import { RAR } from '../../types/tokagotchi'
import { type Rareza } from '../../types/tokagotchi'

interface Props {
    rarity?: Rareza;
    customStyles?: React.CSSProperties,
}

export default function RarityCard({ rarity, customStyles }: Props) {
    const { label, ring } = RAR[rarity ?? 'COMMON']

    return (
        <div className={styles.rarity} style={
            {
                background: `linear-gradient(180deg, rgba(255,255,255,.32), rgba(0,0,0,.06)), ${ring}`,
                boxShadow: `inset 0 2px 0 rgba(255, 255, 255, .4), 0 3px 0 ${ring}`,
                ...customStyles,
            }
        }>
            {label}
        </div>
    )
}