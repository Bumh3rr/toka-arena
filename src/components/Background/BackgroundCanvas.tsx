/* ============================================================
   Toka Arena — BackgroundCanvas
   Wrapper React del fondo animado. Mismo patrón que TokagotchiCanvas.
   Se monta DENTRO de .bg; si no hay Phaser o el usuario pidió
   reduced-motion, no monta nada y queda el fondo estático de .bg.
   ============================================================ */
import { useEffect, useRef } from 'react'
import { BackgroundGame } from '../../game/BackgroundGame'

interface BackgroundCanvasProps {
  /** pausa el loop cuando el fondo no se ve (p. ej. sheet expandida) */
  paused?: boolean
  /** DEV: fuerza una hora (0-23) para previsualizar día/noche */
  hourOverride?: number
}

export default function BackgroundCanvas({ paused = false, hourOverride }: BackgroundCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<BackgroundGame | null>(null)

  // crear / destruir (una sola vez)
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return
    if (!(window as any).Phaser) return // sin Phaser → queda el fondo estático de .bg
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduced) return                 // respeta reduced-motion → fondo estático

    gameRef.current = new BackgroundGame(containerRef.current, { hourOverride })

    // pausa también cuando la pestaña no está visible (ahorra batería)
    const onVis = () => gameRef.current?.setPaused(document.hidden || paused)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      gameRef.current?.destroy()
      gameRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // pausa/resume según prop
  useEffect(() => { gameRef.current?.setPaused(paused) }, [paused])

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} aria-hidden="true" />
}
