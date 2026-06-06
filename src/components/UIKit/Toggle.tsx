import type { CSSProperties } from 'react'
import { TOKENS } from './tokens'
import type { ColorVariant } from './tokens'
import styles from './Toggle.module.css'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Color activo (estado ON). Por defecto 'green'. */
  variant?: ColorVariant
  /** Tamaño del switch. Por defecto 'md'. */
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  ariaLabel?: string
  className?: string
  style?: CSSProperties
}

export default function Toggle({
  checked,
  onChange,
  variant = 'green',
  size = 'md',
  disabled = false,
  ariaLabel,
  className = '',
  style,
}: ToggleProps) {
  const tok = TOKENS[variant]

  const vars = {
    '--tog-on-from': tok.bgFrom,
    '--tog-on-to':   tok.bg,
  } as CSSProperties

  return (
    <button
      className={[styles.toggle, styles[size], checked && styles.on, disabled && styles.disabled, className].filter(Boolean).join(' ')}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{ ...vars, ...style }}
    >
      <span className={styles.knob} />
    </button>
  )
}
