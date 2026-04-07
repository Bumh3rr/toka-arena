import { useState } from 'react'
import styles from './WoodButton.module.css'

interface WoodButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  width?: string
}

export default function WoodButton({
  label,
  onClick,
  disabled = false,
  width = '280px'
}: WoodButtonProps) {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      className={`${styles.button} ${pressed ? styles.pressed : ''} ${disabled ? styles.disabled : ''}`}
      style={{ width }}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={() => {
        if (!disabled) {
          setPressed(false)
          onClick()
        }
      }}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      disabled={disabled}
    >
      <span className={styles.label}>{label}</span>
    </button>
  )
}