import { useCallback, useEffect, useRef, useState } from "react";
import {
  COIN_FLIGHT_MS,
  COIN_LANDING_AT_MS,
  COUNTDOWN_FROM,
  COUNTDOWN_STEP_MS,
  FOUND_MS,
  QUEUE_TICK_MS,
  RESULT_HOLD_MS,
} from "../constants/matchmaking";
import type {
  MatchFighter,
  MatchFound,
  MatchmakingDriver,
  MatchmakingOutcome,
} from "../types/arena.types";

export type MatchmakingState =
  | { phase: "SEARCHING"; waitingSeconds: number; playersInQueue: number }
  | { phase: "FOUND"; match: MatchFound }
  /** El vuelo de la moneda. `landing` cambia el rótulo a "CAYENDO...". */
  | { phase: "FLIGHT"; match: MatchFound; landing: boolean }
  | { phase: "RESULT"; match: MatchFound; countdown: number }
  | { phase: "EMPTY" }
  | { phase: "ERROR"; message: string };

interface UseMatchmakingOptions {
  /** El Tokagotchi del jugador, ya resuelto por la vista. */
  me: MatchFighter;
  /** De dónde salen los emparejamientos. */
  driver: MatchmakingDriver;
  /** La cuenta atrás llegó a cero: toca entrar al combate. */
  onBattleStart: (match: MatchFound) => void;
}

interface UseMatchmakingResult {
  state: MatchmakingState;
  /** Abandona la búsqueda o el error y vuelve a intentar. */
  retry: () => void;
  /** Cancela lo que esté en curso. La vista decide a dónde ir después. */
  cancel: () => void;
}

/**
 * Máquina de estados de la búsqueda de rival y el volado de iniciativa.
 *
 * El vuelo de la moneda no sortea nada: el orden de turno ya viene resuelto
 * por el servidor (`firstIsMe`) desde el momento en que hay rival, así que la
 * animación es determinista y siempre puede aterrizar en la cara correcta.
 *
 * Los temporizadores del vuelo viven en un solo arreglo que se limpia entero
 * al desmontar o al cancelar: una búsqueda abandonada no puede despertar más
 * tarde y empujar una transición sobre una pantalla que ya no existe.
 */
export function useMatchmaking({
  me,
  driver,
  onBattleStart,
}: UseMatchmakingOptions): UseMatchmakingResult {
  const [state, setState] = useState<MatchmakingState>({
    phase: "SEARCHING",
    waitingSeconds: 0,
    playersInQueue: 0,
  });

  /** Reinicia la búsqueda: cambiarlo vuelve a disparar el efecto de la cola. */
  const [attempt, setAttempt] = useState(0);

  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  // `me` se lee dentro del callback del driver, que sobrevive al render en que
  // se creó. Con una ref el emparejamiento siempre usa el Tokagotchi vigente
  // sin volver a entrar a la cola cada vez que se revalida el perfil.
  const meRef = useRef(me);
  useEffect(() => {
    meRef.current = me;
  }, [me]);

  const onBattleStartRef = useRef(onBattleStart);
  useEffect(() => {
    onBattleStartRef.current = onBattleStart;
  }, [onBattleStart]);

  // ── El vuelo ──────────────────────────────────────────────────────────────

  const startFlight = useCallback(
    (match: MatchFound) => {
      setState({ phase: "FOUND", match });

      later(FOUND_MS, () => setState({ phase: "FLIGHT", match, landing: false }));
      later(FOUND_MS + COIN_LANDING_AT_MS, () =>
        setState({ phase: "FLIGHT", match, landing: true }),
      );
      later(FOUND_MS + COIN_FLIGHT_MS, () =>
        setState({ phase: "RESULT", match, countdown: COUNTDOWN_FROM }),
      );
    },
    [later],
  );

  // ── La cola ───────────────────────────────────────────────────────────────

  useEffect(() => {
    let live = true;

    const handle = driver.search({
      onQueue: (playersInQueue) => {
        if (!live) return;
        setState((prev) =>
          prev.phase === "SEARCHING" ? { ...prev, playersInQueue } : prev,
        );
      },
      onOutcome: (outcome: MatchmakingOutcome) => {
        if (!live) return;

        if (outcome.kind === "empty") {
          setState({ phase: "EMPTY" });
          return;
        }
        if (outcome.kind === "error") {
          setState({ phase: "ERROR", message: outcome.message });
          return;
        }

        startFlight({
          battleId: outcome.battleId,
          me: meRef.current,
          rival: outcome.rival,
          firstIsMe: outcome.firstIsMe,
        });
      },
    });

    return () => {
      live = false;
      handle.cancel();
      clearTimers();
    };
  }, [attempt, driver, startFlight, clearTimers]);

  // ── Contador de espera ────────────────────────────────────────────────────

  useEffect(() => {
    if (state.phase !== "SEARCHING") return;

    const id = window.setInterval(() => {
      setState((prev) =>
        prev.phase === "SEARCHING"
          ? { ...prev, waitingSeconds: prev.waitingSeconds + 1 }
          : prev,
      );
    }, QUEUE_TICK_MS);

    return () => window.clearInterval(id);
  }, [state.phase]);

  // ── Cuenta atrás del resultado ────────────────────────────────────────────

  /*
   * Vive en su propio efecto en lugar de en la cadena del vuelo: cada número
   * programa el siguiente, así que la cuenta no puede desincronizarse ni
   * quedarse a medias si el componente se vuelve a renderizar.
   */
  useEffect(() => {
    if (state.phase !== "RESULT") return;

    const { countdown, match } = state;

    // El último número ya tuvo su paso completo: encadenar aquí otra espera
    // dejaría la arena en blanco justo antes del combate.
    if (countdown === 0) {
      onBattleStartRef.current(match);
      return;
    }

    // El primer número espera un poco más: da tiempo a leer quién ataca primero.
    const delay =
      countdown === COUNTDOWN_FROM
        ? RESULT_HOLD_MS + COUNTDOWN_STEP_MS
        : COUNTDOWN_STEP_MS;

    const id = window.setTimeout(() => {
      setState((prev) =>
        prev.phase === "RESULT" ? { ...prev, countdown: prev.countdown - 1 } : prev,
      );
    }, delay);

    return () => window.clearTimeout(id);
  }, [state]);

  // ── Acciones ──────────────────────────────────────────────────────────────

  const retry = useCallback(() => {
    clearTimers();
    setState({ phase: "SEARCHING", waitingSeconds: 0, playersInQueue: 0 });
    setAttempt((n) => n + 1);
  }, [clearTimers]);

  const cancel = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  return { state, retry, cancel };
}
