import type { CSSProperties, ReactNode } from 'react'
import { TOKENS, type ColorVariant } from './tokens'
import styles from './Card.module.css'

type Padding = 'none' | 'sm' | 'md' | 'lg'
type Radius  = 'sm' | 'md' | 'lg'
type Shadow  = 'none' | 'sm' | 'md'

const PAD: Record<Padding, string> = {
  none: '0',
  sm:   '10px 12px',
  md:   '14px 14px 15px',
  lg:   '18px 18px 20px',
}
const BR: Record<Radius, string> = {
  sm: 'var(--r-sm)',
  md: 'var(--r)',
  lg: 'var(--r-lg)',
}
const SHADOW: Record<Shadow, string> = {
  none: 'none',
  sm:   'inset 0 2px 0 rgba(255,255,255,.6), 0 2px 0 var(--card-edge)',
  md:   'inset 0 2px 0 rgba(255,255,255,.6), 0 3px 0 var(--card-edge)',
}

interface CardProps {
  variant?:  ColorVariant
  padding?:  Padding
  radius?:   Radius
  shadow?:   Shadow
  border?:   boolean
  // overrides puntuales
  style?:    CSSProperties
  className?: string
  children?:  ReactNode
  onClick?:   () => void
}

export default function Card({
  variant   = 'cream',
  padding   = 'md',
  radius    = 'lg',
  shadow    = 'md',
  border    = true,
  style,
  className = '',
  children,
  onClick,
}: CardProps) {
  const tok = TOKENS[variant]

  const cssVars = {
    '--card-bg-from': tok.bgFrom,
    '--card-bg':      tok.bg,
    '--card-edge':    tok.edge,
    '--card-pad':     PAD[padding],
    '--card-br':      BR[radius],
    '--card-shadow':  SHADOW[shadow],
    '--card-border':  border ? `2.5px solid var(--ink)` : 'none',
  } as CSSProperties

  return (
    <div
      className={`${styles.card} ${className}`}
      style={{ ...cssVars, ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
