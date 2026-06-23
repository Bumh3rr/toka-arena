import type { CSSProperties } from 'react'
import { Card, Label } from '@/shared/ui/Kit'
import styles from './Loading.module.css'

type LoadingProps = {
  text?: string
  subtitle?: string
  fullscreen?: boolean
  compact?: boolean
  className?: string
  style?: CSSProperties
}

export default function Loading({
  text = 'Cargando...',
  subtitle,
  fullscreen = false,
  compact = false,
  className = '',
  style,
}: LoadingProps) {
  return (
    <div
      className={[
        styles.root,
        fullscreen ? styles.fullscreen : '',
        compact ? styles.compact : '',
        className,
      ].join(' ')}
      aria-busy="true"
      aria-live="polite"
      style={style}
    >
      <Card
        variant="warm"
        padding="lg"
        radius="lg"
        shadow="none"
        className={styles.card}
        style={{
          '--card-bg-from': '#FFFCF4',
          '--card-bg': '#FFF6E6',
          '--card-edge': '#C9A86E',
          '--card-border': '3px solid var(--ink)',
          '--card-shadow': 'inset 0 2px 0 rgba(255,255,255,.7), 0 5px 0 #C9A86E',
        } as CSSProperties}
      >
        <div className={styles.dots} aria-hidden="true">
          <span className={`${styles.dot} ${styles.dot1}`} />
          <span className={`${styles.dot} ${styles.dot2}`} />
          <span className={`${styles.dot} ${styles.dot3}`} />
          <span className={`${styles.dot} ${styles.dot4}`} />
        </div>

        <Label variant="cafe" look="ghost" size="md" className={styles.text}>
          {text}
        </Label>

        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </Card>
    </div>
  )
}