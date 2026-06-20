import useSWR from "swr";
import { sessionApi } from "../api/auth.api";
import type { PlayerProfile } from "../model/types";
import { toPlayerProfile } from "../model/mapper";

export type SessionState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; data: PlayerProfile };

export function useSession() {
  const { data, error, mutate } = useSWR<PlayerProfile>("me", async () => toPlayerProfile(await sessionApi.getMe()));
  const state: SessionState = error
    ? { status: "error", error: error instanceof Error ? error.message : "Error de sesión" }
    : !data ? { status: "loading" } : { status: "ready", data };
  return { state, reload: () => mutate() };
}