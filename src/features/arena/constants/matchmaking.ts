/**
 * Cadencia de la sección de búsqueda y volado.
 *
 * Es la única fuente de los tiempos: el hook programa sus transiciones con
 * estos valores y el CSS de la moneda deriva su duración del mismo vuelo.
 */

/** Cuánto se queda en pantalla la tarjeta "¡Rival encontrado!". */
export const FOUND_MS = 1600;

/** Vuelo completo de la moneda: impulso, giro, caída y rebotes. */
export const COIN_FLIGHT_MS = 2400;

/**
 * Fracción del vuelo en que la moneda toca el suelo por primera vez.
 *
 * Parte el vuelo en los dos rótulos del diseño: antes es "VOLADO DE
 * INICIATIVA", después "CAYENDO...". **Está clavado también en el keyframe
 * `coinFlight` de InitiativeCoin**: si se mueve aquí, hay que moverlo allá.
 */
export const COIN_TOUCHDOWN = 0.55;

/** Momento del vuelo en que el rótulo cambia a "CAYENDO...". */
export const COIN_LANDING_AT_MS = Math.round(COIN_FLIGHT_MS * COIN_TOUCHDOWN);

/** Vueltas completas que da la moneda antes de asentarse. */
export const COIN_SPINS = 5;

/** Pausa con la iniciativa ya resuelta, antes de arrancar la cuenta atrás. */
export const RESULT_HOLD_MS = 600;

/** Desde dónde cuenta el número del suelo antes de entrar a la batalla. */
export const COUNTDOWN_FROM = 3;

/** Cadencia de la cuenta atrás del suelo. */
export const COUNTDOWN_STEP_MS = 700;

/** Cada cuánto avanza el contador de espera en la cola. */
export const QUEUE_TICK_MS = 1000;
