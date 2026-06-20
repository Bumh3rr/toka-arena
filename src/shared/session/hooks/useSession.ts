import useSWR from "swr";
import { sessionApi } from "../api/me.api";
import type { PlayerProfile } from "@/shared/domain/player";

export type SessionState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; data: PlayerProfile };

export function useSession() {
  const { data, error, mutate } = useSWR<PlayerProfile>("me", () => sessionApi.getMe());
  const state: SessionState = error
    ? { status: "error", error: error instanceof Error ? error.message : "Error de sesión" }
    : !data ? { status: "loading" } : { status: "ready", data };
  return { state, reload: () => mutate() };
}
