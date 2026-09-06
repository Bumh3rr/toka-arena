import { useCallback, useMemo, useState } from "react";
import { usePlayer } from "@/shared/player/hooks/usePlayer";
import type { Tokagotchi } from "@/shared/domain/tokagotchi";
import { ARENA_MODES, DEFAULT_ARENA_MODE } from "../constants/modes";
import { getArenaMock } from "../lib/arenaMock";
import { STAMINA_PER_BATTLE } from "../types/arena.types";
import type { ArenaLobbyData, ArenaMode, ArenaModeTheme } from "../types/arena.types";

interface ArenaLobbyReady {
  player: {
    username: string;
    tf: number;
    tokagotchi: Tokagotchi;
  };
  arena: ArenaLobbyData;
  /** Tema del modo seleccionado — de aquí sale todo lo visual del lobby. */
  theme: ArenaModeTheme;
  /** Hay estamina suficiente para entrar a un combate. */
  hasStamina: boolean;
  /** El jugador puede pelear: hay estamina y el modo está habilitado. */
  canBattle: boolean;
}

export type ArenaLobbyState =
  | { status: "loading" }
  | { status: "error"; error: string }
  /** El jugador no tiene ningún tokagotchi: no hay nada que llevar a la arena. */
  | { status: "empty" }
  | { status: "ready"; data: ArenaLobbyReady };

interface UseArenaLobbyResult {
  state: ArenaLobbyState;
  mode: ArenaMode;
  setMode: (mode: ArenaMode) => void;
  reload: () => void;
}

/**
 * Estado del lobby de arena.
 *
 * El jugador y su tokagotchi salen de la API real (`usePlayer`, clave SWR
 * compartida `'player'`). La estamina, el historial y las pociones equipadas
 * todavía no tienen backend y salen de `arenaMock`.
 *
 * Cuando la API de batallas exista, este archivo es el único que cambia:
 * la forma de `ArenaLobbyData` ya es la del contrato final.
 */
export function useArenaLobby(): UseArenaLobbyResult {
  const { state: playerState, reload } = usePlayer();
  const [mode, setMode] = useState<ArenaMode>(DEFAULT_ARENA_MODE);

  // TODO: sustituir por el endpoint de arena cuando el backend esté listo.
  // Se calcula una sola vez al montar: si se recalculara en cada render, el
  // `nextRefillAt` se movería con el reloj y la cuenta atrás nunca avanzaría.
  const arena = useMemo(() => getArenaMock(), []);

  const theme = ARENA_MODES[mode];

  // Sin memo a propósito: `usePlayer` devuelve un estado nuevo en cada render,
  // así que memoizar solo añadiría comparaciones sin evitar ningún trabajo.
  const state = buildState(playerState, arena, theme);

  const handleReload = useCallback(() => {
    void reload();
  }, [reload]);

  return { state, mode, setMode, reload: handleReload };
}

function buildState(
  playerState: ReturnType<typeof usePlayer>["state"],
  arena: ArenaLobbyData,
  theme: ArenaModeTheme,
): ArenaLobbyState {
  if (playerState.status === "loading") return { status: "loading" };
  if (playerState.status === "error") return { status: "error", error: playerState.error };

  const { username, tf, mainTokagotchi } = playerState.data;
  if (!mainTokagotchi) return { status: "empty" };

  const hasStamina = arena.stamina.current >= STAMINA_PER_BATTLE;

  return {
    status: "ready",
    data: {
      player: { username, tf, tokagotchi: mainTokagotchi },
      arena,
      theme,
      hasStamina,
      canBattle: hasStamina && theme.enabled,
    },
  };
}
