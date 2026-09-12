import type { CSSProperties, ReactNode } from 'react'
import { CoinPillCard } from '@/shared/ui/Cards/CoinPillCard/CoinPillCard'
import { usePlayer } from '@/shared/player/hooks/usePlayer'
import styles from './FeatureScreen.module.css'

export interface FeatureScreenProps {
  title: string
  backgroundImage: string
  tabs?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
  style?: CSSProperties
}

function FeatureScreenTopbar({ title }: { title: string }) {
  const { state } = usePlayer()
  const tf = state.status === 'ready' ? state.data.tf : 0

  return (
    <div className={styles.topbar}>
      <span className={styles.title}>{title}</span>
      <CoinPillCard tf={tf} />
    </div>
  )
}

export default function FeatureScreen({
  title,
  backgroundImage,
  tabs,
  children,
  className = '',
  contentClassName = '',
  style,
}: FeatureScreenProps) {
  return (
    <div className={`${styles.screen} ${className}`.trim()} style={style}>
      <div className={styles.background} style={{ backgroundImage: `url('${backgroundImage}')` }} />

      <FeatureScreenTopbar title={title} />

      {tabs && <div className={styles.tabsWrap}>{tabs}</div>}

      <div className={`${styles.content} ${contentClassName}`.trim()}>{children}</div>
    </div>
  )
}