import styles from './RarityCard.module.css'
import { RAR, type Rarity } from '../../types/tokagotchi'

export type RarityCardSize = 'sm' | 'md' | 'lg'

interface Props {
  rarity?: Rarity
  /** Tamaño del badge — escala la fuente y el padding. Default 'md'. */
  size?: RarityCardSize
  customStyles?: React.CSSProperties
}

export default function RarityCard({ rarity, size = 'md', customStyles }: Props) {
  const { label, ring } = RAR[rarity ?? 'COMMON']

  return (
    <div
      className={`${styles.rarity} ${styles[size]}`}
      style={{
        background: `linear-gradient(180deg, rgba(255,255,255,.32), rgba(0,0,0,.06)), ${ring}`,
        boxShadow: `inset 0 2px 0 rgba(255, 255, 255, .4), 0 3px 0 ${ring}`,
        ...customStyles,
      }}
    >
      {label}
    </div>
  )
}
