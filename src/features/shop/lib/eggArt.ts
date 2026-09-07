import type { Rarity } from '@/shared/domain/tokagotchi'

/**
 * Ilustración del huevo por rareza. Cada una viene con su nido.
 *
 * LEGENDARY no se vende en la tienda (`ShopEggRarity` solo tiene COMMON, RARE
 * y EPIC); la entrada existe por defensa, para no romper si el backend lo
 * añadiera antes que el arte.
 */
const EGG_ART: Record<Rarity, string> = {
  COMMON: '/assets/ui/egg/egg_common.svg',
  RARE: '/assets/ui/egg/egg_rare.svg',
  EPIC: '/assets/ui/egg/egg_epic.svg',
  LEGENDARY: '/assets/ui/egg/egg_epic.svg',
}

/**
 * Arte del huevo de una rareza. Lo comparten la tarjeta de la tienda y el
 * sheet de confirmación, que si no enseñaba un icono genérico.
 */
export function getEggArt(rarity: Rarity): string {
  return EGG_ART[rarity]
}

/** Carpeta de la animación del huevo y sus fotogramas de respaldo. */
const ANIM_BASE = '/assets/animations/egg'

/**
 * Fotograma fijo de la animación, por rareza.
 *
 * Es el respaldo del huevo animado: se ve mientras carga el WASM y se queda si
 * el webview lo bloquea. Sale de la propia animación, no del SVG viejo, para
 * que el paso de estático a animado no dé salto.
 */
const EGG_POSTER: Record<Rarity, string> = {
  COMMON: `${ANIM_BASE}/egg_common.png`,
  RARE: `${ANIM_BASE}/egg_rare.png`,
  EPIC: `${ANIM_BASE}/egg_epic.png`,
  LEGENDARY: `${ANIM_BASE}/egg_epic.png`,
}

export function getEggPoster(rarity: Rarity): string {
  return EGG_POSTER[rarity]
}
