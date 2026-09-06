import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ANIM_MS, LOG_LINES, TURN_SECONDS } from "../constants/battle";
import type {
  BattleAction,
  BattleDriver,
  BattleFighter,
  BattleOutcome,
  BattleState,
} from "../types/arena.types";

/** Número flotante que sube sobre un combatiente al recibir o curar vida. */
export interface HpFlash {
  /** Identifica la instancia, para que React reinicie la animación. */
  key: number;
  playerId: string;
  /** Negativo si perdió vida. */
  delta: number;
}

interface UseBattleOptions {
  driver: BattleDriver;
  myPlayerId: string;
  /** Hay conexión con el servidor. Lo sabe el transporte, no la batalla. */
  online: boolean;
}

interface UseBattleResult {
  /** null mientras no llega el primer estado. */
  state: BattleState | null;
  me: BattleFighter | null;
  rival: BattleFighter | null;
  isMyTurn: boolean;
  /** Segundos que quedan del turno. 0 cuando ya venció. */
  secondsLeft: number;
  /** Últimas líneas del relato del servidor, la más reciente al final. */
  log: string[];
  /** Golpes y curaciones del último cambio de estado. */
  flashes: HpFlash[];
  /** true mientras se reproduce la animación de una acción. */
  acting: boolean;
  /** El transporte está conectado. */
  online: boolean;
  /** Resultado, si el combate ya terminó. */
  outcome: BattleOutcome | null;
  /**
   * El combate acabó porque el rival se fue, no porque cayera.
   *
   * `resolveAbandon` del backend borra la sesión **sin tocar el HP** de quien
   * abandona, así que terminar con los dos en pie solo puede significar eso.
   * Se deduce de la estructura del estado, no de leer la frase narrativa.
   */
  byAbandon: boolean;
  /** Último error del servidor, para un toast. Se limpia al leerlo. */
  error: string | null;
  clearError: () => void;
  send: (action: BattleAction) => void;
  surrender: () => void;
}

/**
 * Estado del escenario de batalla.
 *
 * Cada mensaje del servidor trae el estado íntegro, así que aquí no se mezcla
 * nada: se reemplaza. Lo único que se deriva comparando con el estado anterior
 * son los números flotantes de daño, porque el contrato no manda el daño como
 * dato — solo la frase narrativa con el número dentro. Diferenciar el HP es
 * fiable justo porque el estado viene completo.
 */
export function useBattle({ driver, myPlayerId, online }: UseBattleOptions): UseBattleResult {
  const [state, setState] = useState<BattleState | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [flashes, setFlashes] = useState<HpFlash[]>([]);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Vida anterior de cada combatiente, para calcular los flotantes. */
  const previousHp = useRef<Record<string, number>>({});
  const flashSeq = useRef(0);

  // ── Suscripción ───────────────────────────────────────────────────────────

  useEffect(() => {
    const handle = driver.connect({
      onState: (next) => {
        setState(next);

        setLog((lines) =>
          next.lastActionDescription
            ? [...lines, next.lastActionDescription].slice(-LOG_LINES)
            : lines,
        );

        // Diferencia de vida contra el estado anterior: de aquí salen los
        // números flotantes que el contrato no manda.
        const deltas: HpFlash[] = [];
        for (const fighter of Object.values(next.fighters)) {
          const before = previousHp.current[fighter.playerId];
          if (before !== undefined && before !== fighter.currentHp) {
            flashSeq.current += 1;
            deltas.push({
              key: flashSeq.current,
              playerId: fighter.playerId,
              delta: fighter.currentHp - before,
            });
          }
          previousHp.current[fighter.playerId] = fighter.currentHp;
        }

        if (deltas.length > 0) {
          setFlashes(deltas);
          setActing(true);
        }
      },
      onError: setError,
    });

    return () => {
      handle.disconnect();
      previousHp.current = {};
    };
  }, [driver]);

  // La animación se apaga sola: dura lo mismo que el golpe en pantalla
  useEffect(() => {
    if (!acting) return;

    const id = window.setTimeout(() => {
      setActing(false);
      setFlashes([]);
    }, ANIM_MS);

    return () => window.clearTimeout(id);
  }, [acting]);

  // ── Cuenta atrás del turno ────────────────────────────────────────────────

  /*
   * El plazo lo fija el servidor (`turnDeadlineMilli`), así que el valor se
   * deriva del reloj en cada tic en lugar de descontar de un contador propio:
   * un render perdido o una pestaña en segundo plano no lo desincronizan.
   */
  const [now, setNow] = useState(() => Date.now());

  const deadline = state?.turnDeadlineMilli ?? 0;

  useEffect(() => {
    if (!deadline) return;

    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [deadline]);

  const secondsLeft = deadline
    ? Math.max(0, Math.min(TURN_SECONDS, Math.round((deadline - now) / 1000)))
    : 0;

  // ── Derivados ─────────────────────────────────────────────────────────────

  const me = state?.fighters[myPlayerId] ?? null;

  const rival = useMemo(() => {
    if (!state) return null;
    return (
      Object.values(state.fighters).find((f) => f.playerId !== myPlayerId) ?? null
    );
  }, [state, myPlayerId]);

  const finished = state?.eventType === "FIN_DE_BATALLA";

  const outcome: BattleOutcome | null = useMemo(() => {
    if (!finished || !me || !rival) return null;
    if (me.currentHp > 0 && rival.currentHp <= 0) return "WIN";
    if (me.currentHp <= 0 && rival.currentHp > 0) return "LOSS";
    return "DRAW";
  }, [finished, me, rival]);

  const byAbandon = Boolean(
    finished && me && rival && me.currentHp > 0 && rival.currentHp > 0,
  );

  const isMyTurn = !finished && state?.activePlayerId === myPlayerId;

  const send = useCallback(
    (action: BattleAction) => {
      driver.send(action);
    },
    [driver],
  );

  const surrender = useCallback(() => driver.surrender(), [driver]);
  const clearError = useCallback(() => setError(null), []);

  return {
    state,
    me,
    rival,
    isMyTurn: Boolean(isMyTurn),
    secondsLeft,
    log,
    flashes,
    acting,
    online,
    outcome,
    byAbandon,
    error,
    clearError,
    send,
    surrender,
  };
}
