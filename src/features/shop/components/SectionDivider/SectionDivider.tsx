import type { ReactNode } from 'react'
import styles from './SectionDivider.module.css'

interface SectionDividerProps {
  children: ReactNode
}

/** Encabezado de sección con líneas ornamentales a los lados. */
export default function SectionDivider({ children }: SectionDividerProps) {
  return (
    <div className={styles.divider}>
      <span className={styles.line} />
      <span className={styles.title}>{children}</span>
      <span className={styles.line} />
    </div>
  )
}
