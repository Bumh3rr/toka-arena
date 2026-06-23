import useSWR from "swr";
import { sessionApi } from "../../api/me.api";
import type { PlayerProfile } from "@/shared/domain/player";
import { useCallback } from "react";
import { applyRenamePlayerUsername } from "../model/mapper";
import { useToast } from "@/shared/hooks/useToast";

export type SessionState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; data: PlayerProfile };

type UseSessionResult = {
  state: SessionState;
  reload: () => Promise<PlayerProfile | undefined>;
  isRefreshing: boolean;
  renameUsername: (newName: string) => Promise<void>;
  toast: ReturnType<typeof useToast>["toast"];
};

function getSessionErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Error de sesión";
}

export function useSession(): UseSessionResult {
  const { data, error, mutate, isValidating } = useSWR<PlayerProfile>("me", () => sessionApi.getMe());
  const { show, toast } = useToast();

  const renameUsername = useCallback(async (newName: string) => {
    if (!data) return;
    const username = data.username
    try {
      await mutate(
        async (prev) => {
          const res = await sessionApi.renamePlayerUsername(username);
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

  const state: SessionState = data
    ? { status: "ready", data }
    : error
      ? { status: "error", error: getSessionErrorMessage(error) }
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
