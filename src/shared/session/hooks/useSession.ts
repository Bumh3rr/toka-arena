import useSWR from "swr";
import { sessionApi } from "../api/session.api";
import type { MeResponseDTO, Session } from "../session.types";

const mapSession = (d: MeResponseDTO): Session => ({
  id: d.id, username: d.username, avatar: d.avatar,
  tf: d.wallet.tf, activeTokaId: d.activeTokaId, createdAt: new Date(d.createdAt).getTime(),
});

export type SessionState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; data: Session };

export function useSession() {
  const { data, error, mutate } = useSWR<Session>("me", async () => mapSession(await sessionApi.getMe()));
  const state: SessionState = error
    ? { status: "error", error: error instanceof Error ? error.message : "Error de sesión" }
    : !data ? { status: "loading" } : { status: "ready", data };
  return { state, reload: () => mutate() };
}