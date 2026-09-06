import type { PlayerProfile } from "@/shared/player/data/player";
import type { Stamina } from "../types/arena.types";

/**
 * Reglas de estamina de combate, de `Player` del backend.
 *
 * El servidor no las publica como datos, están escritas en la entidad. Se
 * copian aquí porque la interfaz tiene que anunciarlas —cuánto falta para el
 * siguiente punto, cuánto cuesta recargar— y si allá cambian, se corrige en un
 * solo sitio en lugar de en cada vista que las mencione.
 */
export const MAX_STAMINA = 10;

/** Un punto cada dos horas. */
export const REFILL_INTERVAL_MS = 2 * 60 * 60 * 1000;

/** Precio de llenar la barra entera. */
export const REFILL_COST_TF = 50;

/** Recargas que el backend permite comprar por día. */
export const MAX_DAILY_REFILLS = 2;

/**
 * Estamina lista para pintar, a partir del perfil.
 *
 * `lastStaminaUpdate` viene en el **reloj del servidor** y la cuenta atrás se
 * compara contra el del dispositivo, que puede ir adelantado o atrasado —o
 * estar en otra zona horaria. Restando el desfase, el instante que se pinta es
 * el mismo que el servidor usará para conceder el punto.
 *
 * El desfase sale de dos campos que el perfil ya trae: `serverTime` es la hora
 * del servidor al responder, y `createdAt` la del dispositivo al mapear la
 * respuesta. Su diferencia es lo que separa a los dos relojes.
 */
export function readStamina(profile: PlayerProfile): Stamina {
  const { current, lastUpdate } = profile.stamina;
  const isFull = current >= MAX_STAMINA;

  const clockSkew = profile.serverTime - profile.createdAt;
  const nextRefillAt = lastUpdate + REFILL_INTERVAL_MS - clockSkew;

  return {
    current,
    max: MAX_STAMINA,
    nextRefillAt: isFull ? null : nextRefillAt,
    fullRefillCostTF: REFILL_COST_TF,
  };
}

/** Recargas que le quedan hoy al jugador. */
export function refillsLeft(profile: PlayerProfile): number {
  return Math.max(0, MAX_DAILY_REFILLS - profile.stamina.refillsToday);
}
