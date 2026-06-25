import { useRef, type CSSProperties, type ReactNode } from 'react'
import styles from './SheetPanel.module.css'

export interface SheetPanelProps {
  /** Controlled expanded/collapsed state */
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
  /**
   * Called when drag starts (true) or ends (false).
   * Parent should disable CSS transitions on siblings while dragging.
   */
  onDragging?: (isDragging: boolean) => void
  /**
   * Live callback during drag: 0 = fully expanded · 1 = fully collapsed.
   * Use it to synchronise sibling elements (opacity, position) with the drag.
   */
  onDragProgress?: (progress: number) => void
  /** Px from the top of the container that stays uncovered (default: 240). */
  topOffset?: number
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * Reusable bottom drawer anchored inside a `position:relative/absolute` container.
 *
 * The sheet slides up from the bottom; dragging the grab handle snaps it between
 * collapsed (hidden behind bottom edge) and expanded (revealed up to `topOffset`).
 *
 * Usage:
 * ```tsx
 * <SheetPanel
 *   expanded={open}
 *   onExpandedChange={setOpen}
 *   onDragging={setDragging}          // disable container transitions
 *   onDragProgress={(p) => { ... }}   // sync sibling elements live
 *   topOffset={240}
 * >
 *   <MyContent />
 * </SheetPanel>
 * ```
 */
export default function SheetPanel({
  expanded,
  onExpandedChange,
  onDragging,
  onDragProgress,
  topOffset = 240,
  children,
  className,
  style,
}: SheetPanelProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  const onGrabDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const sheetEl = sheetRef.current
    if (!sheetEl) return

    const startY = e.clientY
    const startExpanded = expanded
    // 0 = sheet at top (expanded) · 100 = sheet off screen (collapsed)
    const startPct = startExpanded ? 0 : 100
    const sheetHeight = sheetEl.offsetHeight
    let livePct = startPct
    let moved = 0

    onDragging?.(true)
    e.currentTarget.setPointerCapture(e.pointerId)

    const onMove = (ev: PointerEvent) => {
      const dy = ev.clientY - startY
      moved = Math.max(moved, Math.abs(dy))
      livePct = Math.max(0, Math.min(100, startPct + (dy / sheetHeight) * 100))

      sheetEl.style.transform = `translateY(${livePct}%)`
      onDragProgress?.(livePct / 100)
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)

      // Clear the inline transform — the CSS class drives the final position
      sheetEl.style.transform = ''
      onDragging?.(false)

      // Tap (tiny movement) = toggle; drag = snap to whichever half the user released in
      const next = moved < 6 ? !startExpanded : livePct < 50
      onExpandedChange(next)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    e.preventDefault()
  }

  const sheetStyle: CSSProperties = {
    height: `calc(100% - ${topOffset}px)`,
    ...style,
  }

  return (
    <div
      ref={sheetRef}
      className={`${styles.sheet} ${expanded ? styles.expanded : ''} ${className ?? ''}`}
      style={sheetStyle}
    >
      <div className={styles.handle} onPointerDown={onGrabDown}>
        <div className={styles.grab} />
      </div>
      <div className={styles.scroll}>
        {children}
      </div>
    </div>
  )
}
