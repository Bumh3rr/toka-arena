import { POTIONS_META } from '../constants/potions'
import type { PotionId } from '../types/arena.types'

/** Carpeta de las animaciones de poción. */
const BASE = '/assets/animations/potions'

/**
 * Pociones cuya animación de Rive ya existe.
 *
 * Se lleva una lista explícita en vez de intentar el `.riv` a ciegas: sin ella,
 * cada poción sin animación provocaría un 404 al abrir el panel. Añadir una
 * animación es añadir su id aquí — el resto de las rutas se derivan del nombre.
 */
const ANIMATED = new Set<PotionId>([
  // Ir añadiendo a medida que lleguen los .riv:
  // 'MINOR_HEALTH',
])

export interface PotionArt {
  /** `.riv` de la animación, o null si esa poción todavía no tiene. */
  riv: string | null
  /**
   * Imagen fija de respaldo: se ve mientras carga el WASM y se queda si el
   * webview lo bloquea o si la poción aún no tiene animación.
   */
  poster: string
}

/**
 * Arte de una poción.
 *
 * El nombre del archivo es el `PotionId` en minúsculas, que es el mismo valor
 * que usa `PotionType` del backend — así el id manda y no hay una segunda
 * tabla de nombres que mantener sincronizada.
 */
export function getPotionArt(id: PotionId): PotionArt {
  const name = id.toLowerCase()
  return {
    riv: ANIMATED.has(id) ? `${BASE}/${name}.riv` : null,
    poster: `${BASE}/${name}.png`,
  }
}

/** Respaldo cuando tampoco existe el PNG: el SVG que ya está en el proyecto. */
export function getPotionFallbackSvg(id: PotionId): string {
  return POTIONS_META[id].image
}
