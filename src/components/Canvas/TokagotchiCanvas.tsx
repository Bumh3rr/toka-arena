import { useEffect, useRef } from 'react'
import { TokagotchiGame } from '../../game/TokagotchiGame'
import type { TokagotchiConfig } from '../../game/types'
import type { Species, Assets, AnimationTokagotchi } from '../../types/tokagotchi'
import { getAssetsBySpecies } from '../../services/tokagotchiService'

/**
 * Props de {@link TokagotchiCanvas}.
 * Todas son opcionales — los defaults funcionan para una vista de Home estándar.
 */
interface TokagotchiCanvasProps {
  /** Ancho lógico del canvas en px CSS (el DPR se aplica internamente). */
  width?: number
  /** Alto lógico del canvas en px CSS. */
  height?: number
  /** Índice del accesorio de cabeza en el slot DragonBones. `-1` = sin accesorio. */
  accesorioIndexCabeza?: number
  /** Índice del accesorio de cuerpo en el slot DragonBones. `-1` = sin accesorio. */
  accesorioIndexCuerpo?: number
  /** Animación activa. Cambia en tiempo real sin reiniciar Phaser. */
  animacionActual?: AnimationTokagotchi
  /**
   * Especie del Tokagotchi usada para resolver los assets cuando no se pasa `assets`.
   * Si se proporciona `assets`, este prop se ignora.
   */
  especie?: Species
  /**
   * Assets precargados del Tokagotchi. Tiene prioridad sobre `especie`.
   * Pasar este prop evita la llamada a `getAssetsByEspecie` en cada render.
   */
  assets?: Assets
  /** Espeja el personaje horizontalmente. Útil para el rival en la pantalla de arena. */
  reverse?: boolean
  /**
   * Pausa el loop de animación DragonBones (`timeScale = 0`) para ahorrar CPU/batería.
   *
   * Úsalo cuando el canvas quede tapado o fuera de pantalla. El listener interno
   * `visibilitychange` también pausa automáticamente al ocultar la pestaña del navegador;
   * ambas señales se combinan con OR para que la reanudación requiera que las dos sean falsas.
   */
  paused?: boolean
}

/**
 * Componente React que gestiona el ciclo de vida de una instancia de Phaser
 * con un personaje DragonBones animado.
 *
 * **Reglas de uso:**
 * - Requiere que `window.Phaser` y `window.dragonBones` estén disponibles como globales.
 *   Si alguno falta el componente no monta Phaser y el `<div>` queda vacío.
 * - Crea `TokagotchiGame` **una sola vez** al montar; lo destruye al desmontar.
 * - Cada prop reactiva tiene su propio `useEffect` — ningún cambio de prop recrea el juego.
 * - Pausa automáticamente cuando la pestaña queda en segundo plano (`visibilitychange`).
 *
 * @see {@link TokagotchiGame} para el wrapper de Phaser.
 * @see {@link ITokagotchiScene} para la API de la escena.
 */
export default function TokagotchiCanvas({
  width = 350,
  height = 310,
  accesorioIndexCabeza = -1,
  accesorioIndexCuerpo = -1,
  animacionActual = 'idle',
  especie = 'TOFU',
  assets,
  reverse = false,
  paused = false,
}: TokagotchiCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<TokagotchiGame | null>(null)
  // Ref para que el listener visibilitychange siempre lea el valor actual de `paused`
  // sin necesidad de re-registrarse cuando el prop cambia.
  const pausedRef = useRef(paused)

  if (!assets) {
    assets = getAssetsBySpecies(especie)
  }

  // ── Crear / destruir (una sola vez al montar/desmontar) ───────────────────
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return
    if (!(window as any).Phaser || !(window as any).dragonBones) return

    const cfg: TokagotchiConfig = {
      width, height, assets, animacionActual,
      accesorioIndexCabeza, accesorioIndexCuerpo, reverse,
    }

    gameRef.current = new TokagotchiGame(containerRef.current, cfg)

    // Pausa cuando la pestaña va a segundo plano para ahorrar CPU/batería.
    // Usa pausedRef para evitar capturar el valor stale del closure.
    const onVis = () => gameRef.current?.setPaused(document.hidden || pausedRef.current)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      gameRef.current?.destroy()
      gameRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Props reactivas — cada una en su propio efecto ───────────────────────
  useEffect(() => { gameRef.current?.setAnimation(animacionActual) }, [animacionActual])
  useEffect(() => { gameRef.current?.setAccesorioCabeza(accesorioIndexCabeza) }, [accesorioIndexCabeza])
  useEffect(() => { gameRef.current?.setAccesorioCuerpo(accesorioIndexCuerpo) }, [accesorioIndexCuerpo])
  useEffect(() => { gameRef.current?.resize(width, height, reverse) }, [width, height, reverse])
  useEffect(() => {
    pausedRef.current = paused
    // Combina el prop con document.hidden para no reanudar si la pestaña sigue oculta.
    gameRef.current?.setPaused(paused || document.hidden)
  }, [paused])

  return <div ref={containerRef} style={{ width, height }} aria-hidden="true" />
}
