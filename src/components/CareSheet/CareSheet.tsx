// src/components/CareSheet/CareSheet.tsx
import { useState, useRef, useLayoutEffect } from 'react'
import styles from './CareSheet.module.css'

export const SCENE_MAX = 228
export const SCENE_MIN = 8

interface CareSheetProps {
  expanded: boolean
  setExpanded: (v: boolean) => void
  containerRef: React.RefObject<HTMLDivElement>
  onDraggingChange?: (dragging: boolean) => void
  children: React.ReactNode
}

export default function CareSheet({
  expanded, setExpanded, containerRef, onDraggingChange, children
}: CareSheetProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || dragging) return
    container.style.setProperty('--scene-h', `${expanded ? SCENE_MIN : SCENE_MAX}px`)
  }, [expanded, dragging, containerRef])

  const onDown = (e: React.PointerEvent) => {
    const container = containerRef.current
    if (!container) return

    const scale = container.getBoundingClientRect().height / container.offsetHeight || 1
    const startScene = expanded ? SCENE_MIN : SCENE_MAX
    const startY = e.clientY
    let moved = 0
    let live = startScene

    setDragging(true)
    onDraggingChange?.(true)

    const onMove = (ev: PointerEvent) => {
      const dy = (ev.clientY - startY) / scale
      moved = Math.max(moved, Math.abs(dy))
      live = Math.max(SCENE_MIN, Math.min(SCENE_MAX, startScene + dy))
      container.style.setProperty('--scene-h', `${live}px`)
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      const next = moved < 6 ? !expanded : live < (SCENE_MAX + SCENE_MIN) / 2
      setDragging(false)
      onDraggingChange?.(false)
      setExpanded(next)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    e.preventDefault()
  }

  return (
    <div ref={wrapRef} className={`${styles.dsheet} ${expanded ? styles.expanded : ''}`}>
      <div className={styles.sheet}>
        <div className={styles.handle} onPointerDown={onDown}>
          <div className={styles.grabLine} />
        </div>
        <div className={styles.scroll}>{children}</div>
      </div>
    </div>
  )
}

export function HeaderTitleLine({ title }: { title: string }) {
  return (
    <div className={styles.secHeader}>
      <span className={styles.secTitle}>{title}</span>
      <span className={styles.secLine} />
    </div>
  )
}
