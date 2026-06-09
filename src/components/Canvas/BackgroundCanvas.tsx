/**
 * @file BackgroundCanvas.tsx
 *
 * Wrapper React del fondo animado. Monta (y destruye) un `BackgroundGame` dentro de
 * un `<div>` posicionado en `position: absolute; inset: 0` dentro del contenedor `.bg`.
 *
 * Sigue el mismo patrón que `TokagotchiCanvas`:
 *   BackgroundCanvas → BackgroundGame → createBackgroundScene
 *
 * ─── Fallback / degradación elegante ─────────────────────────────────────────
 * Si alguna de estas condiciones se cumple, el componente NO monta Phaser y el
 * fondo queda como el gradiente CSS definido en `.bg`:
 *
 *   1. `window.Phaser` no existe (CDN aún no cargó o fue bloqueado).
 *   2. El usuario activó `prefers-reduced-motion`.
 *
 * IMPORTANTE: el fallback de `.bg` es un GRADIENTE CSS, no una imagen.
 * Antes había un PNG estático pero se eliminó porque en el camino normal
 * (Phaser corre) esa imagen se descargaba y decodificaba para quedar inmediatamente
 * tapada por el canvas → bytes y memoria desperdiciados, y carga doble con las
 * texturas de Phaser. El gradiente CSS cuesta cero bytes, cubre los casos sin Phaser,
 * y evita el flash en blanco durante el boot. No volver a meter una imagen pesada en `.bg`.
 *
 * TODO (optimizaciones futuras):
 *   - Gate de gama baja: saltar el fondo animado en dispositivos débiles
 *     (vía navigator.deviceMemory / hardwareConcurrency) y quedarse con el gradiente.
 *     Si se quiere un paisaje estático más rico en esa rama, cargarlo con un <img>
 *     condicionalmente, NUNCA como imagen fija en el CSS de .bg (volvería a ser carga doble).
 *   - Fusionar fondo + personaje en una sola escena/Phaser.Game (un solo contexto WebGL
 *     y un solo loop) si los dos contextos pesan demasiado en gama baja. Hoy son dos
 *     instancias de Phaser.Game separadas.
 */
import { useEffect, useRef } from 'react'
import { BackgroundGame } from '../../game/BackgroundGame'

/**
 * Props de `BackgroundCanvas`.
 */
interface BackgroundCanvasProps {
  /**
   * Pausa el loop de Phaser cuando el fondo no es visible.
   * El caller lo activa cuando la CareSheet se expande (tapa el canvas)
   * o cuando detecta que la pestaña queda oculta.
   * Internamente también se gestiona `visibilitychange` para ahorrar batería.
   */
  paused?: boolean
  /**
   * DEV ONLY — fuerza una hora (0-23) para previsualizar el ciclo día/noche
   * sin esperar al reloj real del dispositivo.
   */
  hourOverride?: number
}

/**
 * Componente React que gestiona el ciclo de vida del fondo animado.
 *
 * - Crea `BackgroundGame` una sola vez al montar (el juego no se recrea si cambian las props).
 * - Reacciona al prop `paused` con un `useEffect` ligero que no recrea el juego.
 * - Escucha `visibilitychange` para pausar automáticamente cuando la pestaña queda oculta.
 * - En desmontaje destruye el juego y elimina el listener.
 *
 * El `<div>` resultante es `aria-hidden` porque es puramente decorativo.
 */
export default function BackgroundCanvas({ paused = false, hourOverride }: BackgroundCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<BackgroundGame | null>(null)

  // ── Crear / destruir (una sola vez al montar/desmontar) ───────────────────
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return
    // Sin Phaser global → queda el gradiente CSS de .bg (ver nota de fallback arriba)
    if (!(window as any).Phaser) return
    // Respeta prefers-reduced-motion → fondo estático, sin animación
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduced) return

    gameRef.current = new BackgroundGame(containerRef.current, { hourOverride })

    // Pausa también cuando la pestaña pasa a segundo plano para ahorrar batería.
    // Combina document.hidden con la prop `paused` para que ambas fuentes de pausa
    // funcionen independientemente.
    const onVis = () => gameRef.current?.setPaused(document.hidden || paused)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      gameRef.current?.destroy()
      gameRef.current = null
    }
    // La dependencia de `hourOverride` y `paused` se omite intencionalmente:
    // el juego solo se crea una vez; los cambios de `paused` los gestiona el efecto de abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Pausa/resume reactivo (sin recrear el juego) ──────────────────────────
  useEffect(() => { gameRef.current?.setPaused(paused) }, [paused])

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} aria-hidden="true" />
}
