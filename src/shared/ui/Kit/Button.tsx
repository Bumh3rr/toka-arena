import type { CSSProperties, ReactNode } from 'react'
import { TOKENS, type ColorVariant } from './tokens'
import styles from './Button.module.css'

type Size   = 'sm' | 'md' | 'lg'
type Radius = 'sm' | 'md' | 'lg' | 'pill'

const EDGE_H: Record<Size, number>  = { sm: 2,         md: 3,          lg: 5          }
const FS:     Record<Size, number>  = { sm: 11.5,      md: 13,         lg: 16         }
const PAD:    Record<Size, string>  = { sm: '5px 11px', md: '7px 14px', lg: '12px 20px' }
const BR:     Record<Radius, string> = {
  sm:   'var(--r-sm)',
  md:   'var(--r)',
  lg:   'var(--r-lg)',
  pill: 'var(--r-pill)',
}

interface ButtonProps {
  variant?:   ColorVariant
  size?:      Size
  radius?:    Radius
  fullWidth?: boolean
  disabled?:  boolean
  onClick?:   () => void
  children?:  ReactNode
  icon?:      ReactNode
  iconRight?: ReactNode
  // overrides puntuales
  fontSize?:  number
  padding?:   string
  color?:     string
  style?:     CSSProperties
  className?: string
  type?:      'button' | 'submit' | 'reset'
}

export default function Button({
  variant    = 'gold',
  size       = 'md',
  radius     = 'md',
  fullWidth  = false,
  disabled   = false,
  onClick,
  children,
  icon,
  iconRight,
  fontSize,
  padding,
  color,
  style,
  className = '',
  type      = 'button',
}: ButtonProps) {
  const tok = TOKENS[variant]
  const edgeH = EDGE_H[size]

  const cssVars = {
    '--btn-bg-from':  tok.bgFrom,
    '--btn-bg':       tok.bg,
    '--btn-edge':     tok.edge,
    '--btn-edge-h':   `${edgeH}px`,
    '--btn-text':     color ?? tok.text,
    '--btn-shine':    tok.shine,
    '--btn-ts':       tok.textShadow ?? 'none',
    '--btn-fs':       `${fontSize ?? FS[size]}px`,
    '--btn-pad':      padding ?? PAD[size],
    '--btn-br':       BR[radius],
    '--btn-w':        fullWidth ? '100%' : 'auto',
  } as CSSProperties

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${styles.btn} ${className}`}
      style={{ ...cssVars, ...style }}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
    </button>
  )
}
