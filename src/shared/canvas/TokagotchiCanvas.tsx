import { useEffect, useRef } from 'react'
import { TokagotchiGame } from '../game/tokagotchi/TokagotchiGame'
import type { TokagotchiConfig } from '../game/tokagotchi/types'
import type { Species, Assets, AnimationTokagotchi } from '../domain/tokagotchi'
import { getSpeciesAssets } from '../game/assets'
import type { EquippedAccessory } from '../domain/accessory'

/**
 * Cadencia de los reintentos de captura.
 *
 * No hay techo de intentos a propósito: acotarlo por número de intentos hacía
 * que el bucle se rindiera antes de que Phaser terminara de arrancar en cuanto
 * el reloj corría más rápido que los fotogramas. Se reintenta mientras el
 * canvas viva, y cada intento cuesta leer un booleano.
 */
const PORTRAIT_RETRY_MS = 150

/**
 * Props de {@link TokagotchiCanvas}.
 * Todas son opcionales — los defaults funcionan para una vista de Home estándar.
 */
interface TokagotchiCanvasProps {
  /** Ancho lógico del canvas en px CSS (el DPR se aplica internamente). */
  width?: number
  /** Alto lógico del canvas en px CSS. */
  height?: number
  /** Lista de accesorios equipados. */
  accessories?: EquippedAccessory[]
  /** Animación activa. Cambia en tiempo real sin reiniciar Phaser. */
  animacionActual?: AnimationTokagotchi
  /**
   * Especie del Tokagotchi usada para resolver los assets cuando no se pasa `assets`.
   * Si se proporciona `assets`, este prop se ignora.
   */
  species?: Species
  /**
   * Assets precargados del Tokagotchi. Tiene prioridad sobre `especie`.
   * Pasar este prop evita la llamada a `getAssetsByEspecie` en cada render.
   */
  assets?: Assets
  /** Espeja el personaje horizontalmente. Útil para el rival en la pantalla de arena. */
  reverse?: boolean
  /**
   * Se llama UNA vez con el canvas capturado como PNG (data URL, con alfa) en
   * cuanto el personaje está en pie.
   *
   * Sirve para reutilizar el Tokagotchi vestido fuera de Phaser. El callback
   * debe ser estable (`useState` setter o `useCallback`): si cambia de
   * identidad en cada render, la captura se reintenta sin parar. Si no se
   * pasa, no se hace ningún trabajo extra.
   */
  onPortrait?: (dataUrl: string) => void
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
  accessories = [],
  animacionActual = 'idle',
  species = 'TOFU',
  assets,
  reverse = false,
  paused = false,
  onPortrait,
}: TokagotchiCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<TokagotchiGame | null>(null)
  // Ref para que el listener visibilitychange siempre lea el valor actual de `paused`
  // sin necesidad de re-registrarse cuando el prop cambia.
  const pausedRef = useRef(paused)

  if (!assets) {
    assets = getSpeciesAssets(species)
  }

  // ── Crear / destruir (una sola vez al montar/desmontar) ───────────────────
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return
    if (!(window as any).Phaser || !(window as any).dragonBones) return

    const cfg: TokagotchiConfig = {
      width, height, assets, animacionActual,accessories, reverse
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
  useEffect(() => { gameRef.current?.setAccessories(accessories) }, [accessories])
  useEffect(() => { gameRef.current?.resize(width, height, reverse) }, [width, height, reverse])
  useEffect(() => {
    pausedRef.current = paused
    // Combina el prop con document.hidden para no reanudar si la pestaña sigue oculta.
    gameRef.current?.setPaused(paused || document.hidden)
  }, [paused])

  // ── Captura del personaje ────────────────────────────────────────────────

  /*
   * La escena no avisa cuando el armature entra, así que se reintenta a
   * intervalos cortos hasta que la captura sale. En cuanto hay imagen el bucle
   * se detiene para siempre; si el canvas se desmonta antes, el cleanup lo
   * corta y nadie recibe nada.
   */
  useEffect(() => {
    if (!onPortrait) return

    let cancelled = false
    let timer = 0

    const attempt = async () => {
      if (cancelled) return

      const src = await gameRef.current?.snapshot()
      if (cancelled) return

      if (src) {
        onPortrait(src)
        return
      }

      timer = window.setTimeout(attempt, PORTRAIT_RETRY_MS)
    }

    timer = window.setTimeout(attempt, PORTRAIT_RETRY_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [onPortrait])

  return <div ref={containerRef} style={{ width, height, pointerEvents: 'none' }} aria-hidden="true" />
}
