import type { EquippedAccessory, Species } from "@/shared/domain/tokagotchi";

/**
 * Memoria de los Tokagotchis ya capturados del canvas.
 *
 * La moneda del volado quiere al Tokagotchi vestido, y la única forma de
 * tenerlo es capturar el canvas de Phaser. El problema es el momento: si se
 * captura al entrar a la cola, un emparejamiento rápido puede llegar antes que
 * la captura y la moneda se queda con el retrato plano.
 *
 * El lobby lo resuelve: ahí el canvas vive todo el tiempo que el jugador tarda
 * en decidirse, muy por encima de los ~500 ms que cuesta la captura. Así que se
 * captura ahí, se guarda aquí, y la búsqueda solo tiene que leerlo.
 *
 * Vive en memoria a propósito: es una imagen derivada, barata de volver a
 * hacer, y guardarla en disco solo arriesgaría servir un Tokagotchi con los
 * accesorios de ayer.
 */

/** Data URLs indexadas por apariencia. */
const cache = new Map<string, string>();

/**
 * Clave de apariencia: lo que se ve, no quién es.
 *
 * Dos Tokagotchis de la misma especie con los mismos accesorios se ven igual,
 * y el mismo Tokagotchi con otro accesorio ya no. Los tipos se ordenan para
 * que el orden en que el backend los devuelva no genere claves distintas.
 */
export function portraitKey(species: Species, equipped: EquippedAccessory[]): string {
  const looks = equipped
    .map((a) => a.type)
    .sort()
    .join(",");

  return `${species}|${looks}`;
}

export function getPortrait(key: string): string | null {
  return cache.get(key) ?? null;
}

export function setPortrait(key: string, dataUrl: string): void {
  cache.set(key, dataUrl);
}
