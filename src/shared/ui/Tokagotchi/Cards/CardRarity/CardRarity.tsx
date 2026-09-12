import styles from './CardRarity.module.css'
import type { Rarity } from '@/shared/domain/tokagotchi'
import { RARITY_META } from '@/shared/constants/rarity'

export type RarityCardSize = 'sm' | 'md' | 'lg'

interface Props {
  rarity: Rarity
  size?: RarityCardSize
  customStyles?: React.CSSProperties
}

export default function CardRarity({ rarity, size = 'md', customStyles }: Props) {
  const { label, ring } = RARITY_META[rarity]
  const isLegendary = rarity === 'LEGENDARY'
  return (
    <div
      className={`${styles.rarity} ${styles[size]} ${isLegendary ? styles.rarBadgeLegend : ''}`}
      style={isLegendary ? customStyles : {
        background: `linear-gradient(180deg, rgba(255,255,255,.32), rgba(0,0,0,.06)), ${ring}`,
        boxShadow: `inset 0 2px 0 rgba(255, 255, 255, .4), 0 3px 0 ${ring}`,
        ...customStyles,
      }}
    >
      {label}
    </div>
  )
}
