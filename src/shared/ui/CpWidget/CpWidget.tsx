import type { CSSProperties } from 'react'
import styles from './CpWidget.module.css'

type CpWidgetProps = {
  className?: string
  style?: CSSProperties
  size?: number | string
}

export default function CpWidget({ className, style, size }: CpWidgetProps) {
  const cssVars =
    size !== undefined
      ? ({
          '--cp-size': typeof size === 'number' ? `${size}px` : size,
        } as CSSProperties)
      : undefined

  const mergedStyle = cssVars ? { ...cssVars, ...style } : style

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} style={mergedStyle}>
      <div className={styles.iconWrap} aria-hidden="true">
        <img src="/assets/ui/cp/cp_stars.png" alt="" className={styles.icon} />
        <span className={styles.sparkA} />
        <span className={styles.sparkB} />
        <span className={styles.sparkC} />
      </div>
    </div>
  )
}
