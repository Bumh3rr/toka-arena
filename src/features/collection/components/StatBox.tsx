// src/features/collection/components/StatBox.tsx
import type { CSSProperties } from 'react'
import styles from './StatBox.module.css'

interface StatBoxProps {
  label: string
  value: number
  color: string
}

export default function StatBox({ label, value, color }: StatBoxProps) {
  return (
    <div className={styles.box} style={{ '--sc': color } as CSSProperties}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}
