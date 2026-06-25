import type { CSSProperties } from 'react'
import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  pct: number           // 0–100
  color?: string        // fill gradient override (default blue)
  height?: number       // px, default 12
  className?: string
  style?: CSSProperties
}

export default function ProgressBar({
  pct,
  color,
  height = 12,
  className = '',
  style,
}: ProgressBarProps) {
  const clampedPct = Math.min(100, Math.max(0, pct))
  return (
    <div
      className={`${styles.track} ${className}`}
      role="progressbar"
      aria-valuenow={clampedPct}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ '--pb-h': `${height}px`, ...style } as CSSProperties}
    >
      <div
        className={styles.fill}
        style={{
          width: `${clampedPct}%`,
          background: color ?? 'linear-gradient(180deg,#7FC9F2,var(--blue))',
        }}
      />
    </div>
  )
}
