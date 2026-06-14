import useSWR from "swr";
import { passApi } from "../api/pass.api";
import type { PassResponseDTO, Pass } from "../pass.types";

const mapPass = (d: PassResponseDTO): Pass => ({
  ...d,
  serverTime: new Date(d.serverTime).getTime(),
  endsAt: d.endsAt ? new Date(d.endsAt).getTime() : null,
});

export type PassState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; data: Pass };

export function usePass() {
  const { data, error, mutate } = useSWR<Pass>("pass", async () => mapPass(await passApi.getPass()));
  const state: PassState = error
    ? { status: "error", error: error instanceof Error ? error.message : "Error del pase" }
    : !data ? { status: "loading" } : { status: "ready", data };
  return { state, reload: () => mutate() };
}