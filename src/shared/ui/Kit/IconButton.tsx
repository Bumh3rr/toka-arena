// src/components/wait/IconButton.tsx
import type { CSSProperties, ReactNode } from 'react'
import { TOKENS, type ColorVariant } from './tokens'
import styles from './IconButton.module.css'

type Shape = 'round' | 'sm' | 'md' | 'lg'

const BR: Record<Shape, string> = {
  round: '50%',
  sm:    'var(--r-sm)',
  md:    'var(--r)',
  lg:    'var(--r-lg)',
}

interface IconButtonProps {
  variant?:   ColorVariant
  size?:      number        // tamaño en px del contenedor (ancho = alto)
  shape?:     Shape
  iconSize?:  number        // tamaño del svg interior en px
  disabled?:  boolean
  onClick?:   () => void
  children?:  ReactNode
  ariaLabel?: string
  style?:     CSSProperties
  className?: string
}

export default function IconButton({
  variant   = 'cream',
  size      = 32,
  shape     = 'round',
  iconSize,
  disabled  = false,
  onClick,
  children,
  ariaLabel,
  style,
  className = '',
}: IconButtonProps) {
  const tok = TOKENS[variant]
  const iSize = iconSize ?? Math.round(size * 0.55)

  const cssVars = {
    '--ib-size':      `${size}px`,
    '--ib-icon-size': `${iSize}px`,
    '--ib-bg-from':   tok.bgFrom,
    '--ib-bg':        tok.bg,
    '--ib-edge':      tok.edge,
    '--ib-text':      tok.text,
    '--ib-shine':     tok.shine,
    '--ib-ts':        tok.textShadow ?? 'none',
    '--ib-br':        BR[shape],
  } as CSSProperties

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${styles.btn} ${className}`}
      style={{ ...cssVars, ...style }}
    >
      {children}
    </button>
  )
}
