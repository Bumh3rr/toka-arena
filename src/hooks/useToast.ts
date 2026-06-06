import { useState, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import type { ToastVariant, ToastPosition, ToastAlign } from '../components/UIKit/Toast'

export interface ToastOptions {
  variant?:  ToastVariant
  position?: ToastPosition
  align?:    ToastAlign
  duration?: number   // ms — por defecto 2200
  icon?:     ReactNode
}

export interface ToastState extends ToastOptions {
  message: string
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback((message: string, opts: ToastOptions = {}) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const { duration = 2200, ...rest } = opts
    setToast({ message, ...rest })
    timerRef.current = setTimeout(() => setToast(null), duration)
  }, [])

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(null)
  }, [])

  return { toast, show, hide }
}
