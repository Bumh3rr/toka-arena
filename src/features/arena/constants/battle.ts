import type { AnimationTokagotchi } from "@/shared/domain/tokagotchi";

/**
 * Reglas del combate que la interfaz necesita conocer.
 *
 * Todas salen del motor del backend. Están aquí y no repartidas por las vistas
 * porque son las que hacen que la pantalla diga la verdad: si el servidor
 * cambia el turno a 30 s o la fatiga al turno 12, se corrige en un sitio.
 */

/** Duración del turno. `BattleSession` reinicia el plazo en cada cambio. */
export const TURN_SECONDS = 20;

/**
 * Margen que puede tardar el aviso de turno vencido.
 *
 * `BattleTimeoutScheduler` corre cada 5 s, así que el `TIMEOUT` llega hasta 5 s
 * después de que la cuenta atrás toque cero. Durante ese hueco la interfaz
 * espera en vez de adelantarse a un desenlace que aún no ocurrió.
 */
export const TIMEOUT_GRACE_SECONDS = 5;

/** Turno en que empieza la fatiga: los dos pierden 5% de su HP máximo. */
export const FATIGUE_FROM_TURN = 15;

/** Turno en que la fatiga se duplica al 10%. */
export const FATIGUE_HEAVY_FROM_TURN = 20;

/** Energía que devuelve descansar, contando la regeneración del turno. */
export const REST_ENERGY = 50;

/** Bajo este porcentaje de vida, la interfaz entra en alerta. */
export const CRITICAL_HP_PCT = 25;

/** Cuántas líneas del relato se conservan a la vista. */
export const LOG_LINES = 2;

/**
 * Animaciones del combate.
 *
 * **Provisional**: `ataque` y `daño` todavía no están rigueadas, así que se
 * cubren con las de cuidado. Cuando lleguen, este mapa es lo único que cambia
 * — ninguna vista nombra una animación directamente.
 *
 * `hurt` apunta a `idle` a propósito y no a otra de cuidado: `curacion` dibuja
 * cruces sanitarias sobre el personaje, así que usarla al encajar un golpe
 * decía justo lo contrario de lo que pasaba. Sin animación propia, el golpe se
 * lee igual por el número flotante y la barra de vida.
 */
export const BATTLE_ANIM: Record<
  "idle" | "attack" | "hurt" | "heal",
  AnimationTokagotchi
> = {
  idle: "idle",
  attack: "jugar",
  hurt: "idle",
  heal: "curacion",
};

/** Cuánto dura en pantalla la animación de una acción. */
export const ANIM_MS = 900;
