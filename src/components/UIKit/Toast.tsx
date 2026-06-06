import type { CSSProperties, ReactNode } from 'react'
import styles from './Toast.module.css'

export type ToastVariant = 'info' | 'warn' | 'danger' | 'celebrity'
export type ToastPosition = 'top' | 'bottom'
export type ToastAlign = 'start' | 'center' | 'end'

export interface ToastProps {
  message: string
  variant?:  ToastVariant   // default 'info'
  position?: ToastPosition  // default 'bottom'
  align?:    ToastAlign     // default 'center'
  /** Sobrescribe el icono por defecto. Pasar null para ocultarlo. */
  icon?:     ReactNode
  className?: string
  style?:    CSSProperties
}

// ── Iconos inline para no acoplar UIKit a ./Icons ─────────────────────────────

function SvgInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 11v5"/>
      <circle cx="12" cy="7.5" r=".65" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function SvgWarn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 2 21h20L12 3z"/>
      <path d="M12 10v4.5"/>
      <circle cx="12" cy="17.5" r=".65" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function SvgDanger() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9"/>
      <path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/>
    </svg>
  )
}

function SvgStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.6 8H22l-6.8 4.9 2.6 8L12 18l-5.8 4.9 2.6-8L2 10h7.4L12 2z"/>
    </svg>
  )
}

const DEFAULT_ICONS: Record<ToastVariant, ReactNode> = {
  info:      <SvgInfo />,
  warn:      <SvgWarn />,
  danger:    <SvgDanger />,
  celebrity: <SvgStar />,
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Toast({
  message,
  variant  = 'info',
  position = 'bottom',
  align    = 'center',
  icon,
  className = '',
  style,
}: ToastProps) {
  const resolvedIcon = icon === undefined ? DEFAULT_ICONS[variant] : icon

  const cls = [
    styles.toast,
    styles[variant],
    styles[position],
    styles[align],
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={cls} style={style} role="status" aria-live="polite">
      {resolvedIcon && <span className={styles.icon}>{resolvedIcon}</span>}
      <span>{message}</span>
    </div>
  )
}
