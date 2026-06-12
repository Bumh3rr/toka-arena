import type { CSSProperties, ReactNode } from 'react'
import { TOKENS, type ColorVariant } from './tokens'
import styles from './Label.module.css'

type LabelSize = 'xs' | 'sm' | 'md'
type LabelLook = 'solid' | 'soft' | 'outline' | 'ghost'

const FS:  Record<LabelSize, number>  = { xs: 9.5,      sm: 11,        md: 13         }
const PAD: Record<LabelSize, string>  = { xs: '1px 7px', sm: '3px 9px', md: '4px 12px' }
const FW:  Record<LabelSize, number>  = { xs: 800,       sm: 700,       md: 700        }

interface LabelProps {
  variant?:    ColorVariant
  look?:       LabelLook
  size?:       LabelSize
  uppercase?:  boolean
  dot?:        boolean
  letterSpacing?: number
  fontSize?:   number
  color?:      string
  style?:      CSSProperties
  className?:  string
  children?:   ReactNode
}

export default function Label({
  variant      = 'gold',
  look         = 'solid',
  size         = 'sm',
  uppercase    = false,
  dot          = false,
  letterSpacing,
  fontSize,
  color,
  style,
  className = '',
  children,
}: LabelProps) {
  const tok = TOKENS[variant]

  let bg: string
  let text: string
  let border: string

  switch (look) {
    case 'solid':
      bg     = `linear-gradient(180deg, ${tok.bgFrom}, ${tok.bg})`
      text   = color ?? tok.text
      border = `1.5px solid rgba(74,40,0,.25)`
      break
    case 'soft':
      bg     = tok.softBg ?? tok.bg
      text   = color ?? tok.softText ?? tok.text
      border = `1.5px solid rgba(74,40,0,.15)`
      break
    case 'outline':
      bg     = 'transparent'
      text   = color ?? tok.bg
      border = `1.5px solid ${tok.bg}`
      break
    case 'ghost':
      bg     = 'transparent'
      text   = color ?? tok.softText ?? tok.text
      border = 'none'
      break
  }

  const cssVars = {
    '--lbl-bg':     bg,
    '--lbl-text':   text,
    '--lbl-border': border,
    '--lbl-fs':     `${fontSize ?? FS[size]}px`,
    '--lbl-pad':    PAD[size],
    '--lbl-fw':     FW[size],
    '--lbl-tt':     uppercase ? 'uppercase' : 'none',
    '--lbl-ls':     letterSpacing !== undefined ? `${letterSpacing}px` : uppercase ? '.4px' : 'normal',
  } as CSSProperties

  return (
    <span
      className={`${styles.label} ${className}`}
      style={{ ...cssVars, ...style }}
    >
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  )
}
