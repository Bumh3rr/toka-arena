import type {
  MatchFighter,
  MatchmakingDriver,
  MatchmakingOutcome,
  SearchHandle,
} from "../types/arena.types";

/**
 * ARCHIVO TEMPORAL — el emparejamiento real todavía no está cableado.
 *
 * Imita la cola del backend: tarda un rato, publica el tamaño de la cola y
 * termina en uno de los tres desenlaces del diseño. Cuando entre el cliente
 * STOMP se borra este archivo y se pasa el driver real a `useMatchmaking`;
 * ninguna vista de la sección se toca.
 *
 * Para ver las pantallas que no salen por el camino normal, la URL manda:
 * `?mm=empty` fuerza "No hay rivales" y `?mm=error` fuerza "Se cayó la
 * conexión". Sin parámetro, siempre encuentra rival.
 */

/** Cuánto tarda la cola falsa en resolver. */
const SEARCH_MS = 2600;

/** Rivales de mentira. Se elige uno al azar en cada búsqueda. */
const FAKE_RIVALS: MatchFighter[] = [
  { name: "Mochi", species: "MOCHI", username: "Regina_92", rarity: "RARE" },
  { name: "Hana", species: "HANA", username: "Beto", rarity: "EPIC" },
  { name: "Tofu", species: "TOFU", username: "Lalo_MX", rarity: "COMMON" },
];

function forcedOutcome(): "empty" | "error" | null {
  const value = new URLSearchParams(window.location.search).get("mm");
  return value === "empty" || value === "error" ? value : null;
}

function pickRival(): MatchFighter {
  return FAKE_RIVALS[Math.floor(Math.random() * FAKE_RIVALS.length)];
}

function buildOutcome(): MatchmakingOutcome {
  const forced = forcedOutcome();

  if (forced === "empty") return { kind: "empty" };
  if (forced === "error") {
    return { kind: "error", message: "Se cayó la conexión" };
  }

  return {
    kind: "matched",
    battleId: `mock-${Date.now()}`,
    rival: pickRival(),
    // La iniciativa la decide el servidor; aquí se sortea para ver los dos casos.
    firstIsMe: Math.random() < 0.5,
  };
}

export const matchmakingMock: MatchmakingDriver = {
  search({ onQueue, onOutcome }): SearchHandle {
    // La cola crece mientras se espera, como la de verdad.
    let inQueue = 1;
    onQueue(inQueue);

    const growth = window.setInterval(() => {
      inQueue += 1;
      onQueue(inQueue);
    }, 900);

    const resolution = window.setTimeout(() => {
      window.clearInterval(growth);
      onOutcome(buildOutcome());
    }, SEARCH_MS);

    return {
      cancel() {
        window.clearInterval(growth);
        window.clearTimeout(resolution);
      },
    };
  },
};
