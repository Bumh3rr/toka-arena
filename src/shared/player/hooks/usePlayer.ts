import useSWR from "swr";
import { useCallback } from "react";
import { useToast } from "@/shared/hooks/useToast";
import type { PlayerProfile } from "../data/player";
import { playerApi } from "../api/player.api";
import { applyRenamePlayerUsername } from "../data/player.mapper";

export type PlayerState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; data: PlayerProfile };

type UsePlayerResult = {
  state: PlayerState;
  reload: () => Promise<PlayerProfile | undefined>;
  isRefreshing: boolean;
  renameUsername: (newName: string) => Promise<void>;
  toast: ReturnType<typeof useToast>["toast"];
};

function getPlayerErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Error de sesión";
}

export function usePlayer(): UsePlayerResult {
  const { data, error, mutate, isValidating } = useSWR<PlayerProfile>("player", () => playerApi.getMe());
  const { show, toast } = useToast();

  const renameUsername = useCallback(async (newName: string) => {
    if (!data) return;
    const username = data.username
    try {
      await mutate(
        async (prev) => {
          const res = await playerApi.renamePlayerUsername(username);
          return prev ? applyRenamePlayerUsername(prev, res.username) : prev;
        },
        {
          optimisticData: (prev) =>
          prev?.mainTokagotchi ? { ...prev, mainTokagotchi: { ...prev.mainTokagotchi, name: newName.trim() } } : prev!,
          revalidate: false,
          rollbackOnError: true,
        },
      );
      show("Nombre actualizado", { variant: "info" });
    } catch (err) {
      console.error("Error renombrando usuario", err);
      show("Error al renombrar", { variant: "danger" });
    }
  }, [data, mutate, show]);

  const state: PlayerState = data
    ? { status: "ready", data }
    : error
      ? { status: "error", error: getPlayerErrorMessage(error) }
      : { status: "loading" };

  const reload = () => mutate();

  return {
    state,
    reload,
    renameUsername,
    toast,
    isRefreshing: isValidating,
  };
}
