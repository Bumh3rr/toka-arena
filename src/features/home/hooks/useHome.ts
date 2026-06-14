import type { Session } from "@/shared/session/session.types";
import type { HomeData } from "../home.types";
import type { CareActionDTO, ApiError } from "../home.dto";
import type { ActionCare } from "../home.types";
import { useCallback, useEffect, useReducer, useState } from "react";
import useSWR, {useSWRConfig} from "swr";
import { applyAscendResponse } from "../home.mapper";
import { homeApi } from "../api/home.api";
import { mapHome, applyCareResponse, applyRename } from "../home.mapper";
import { homeUiReducer, INITIAL_UI, type HomeUi } from "./homeUiReducer";
import { useToast } from "@/shared/hooks/useToast";
import { CONFIG_CARE } from "../constants/cuidado";
import { RARITY_META } from '@/shared/constants/rarity'

// ── reloj del servidor (usa el serverTime para corregir desfase de reloj) ──
let clockOffset = 0;
const syncClock = (serverMs: number) => { clockOffset = serverMs - Date.now(); };
const serverNow = () => Date.now() + clockOffset;

const ACTION_TO_DTO: Record<ActionCare, CareActionDTO> = {
  feed: "FEED",
  play: "PLAY",
  bathe: "BATHE",
};
const remaining = (at: number | null) => at == null ? 0 : Math.max(0, Math.ceil((at - serverNow()) / 1000));

export type Cooldowns = Record<ActionCare, number>; // segundos restantes
export type { Floaters } from "./homeUiReducer"; // re-export para consumidores (p. ej. CareRow)
export type HomeState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; data: HomeData; ui: HomeUi; cooldowns: Cooldowns };

// Re-render cada segundo SOLO mientras haya un cooldown activo
function useTicker(active: boolean) {
  const [, force] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
}

export function useHome() {
  const { mutate: globalMutate } = useSWRConfig();

  const { data, error, mutate } = useSWR<HomeData>("home", async () => {
    const res = await homeApi.getHome();
    console.log("homeApi: ",res)
    syncClock(new Date(res.serverTime).getTime());
    return mapHome(res);
  });

  const [ui, dispatch] = useReducer(homeUiReducer, INITIAL_UI);
  const { show, toast } = useToast();

  const care = data?.activeToka?.care;
  const active = !!care && [care.feed, care.play, care.bathe].some((t) => (t ?? 0) > serverNow());
  useTicker(active);

  const runAction = useCallback(
    async (action: ActionCare) => {
      if (!data?.activeToka || ui.pendingAction) return;
      if (remaining(data.activeToka.care[action]) > 0) return;
      const cfg = CONFIG_CARE.find((c) => c.key === action);
      if (!cfg) return;
      const tokaId = data.activeToka.id;

      dispatch({ type: "ACTION_START", action });
      try {
        await mutate(
          async (prev) => {
            const res = await homeApi.care(tokaId, ACTION_TO_DTO[action]);
            return prev ? applyCareResponse(prev, res) : prev;
          },
          {
            // CP optimista: se ve instantáneo, se reconcilia con el server, revierte si truena
            optimisticData: (prev) =>
              prev?.activeToka
                ? {
                    ...prev,
                    activeToka: {
                      ...prev.activeToka,
                      cp: prev.activeToka.cp + cfg.cp,
                    },
                  }
                : prev!,
            revalidate: false,
            rollbackOnError: true,
          },
        );
        // solo en éxito:
        dispatch({ type: "SET_ANIMATION", animation: cfg.animation });
        window.setTimeout(
          () => dispatch({ type: "SET_ANIMATION", animation: "idle" }),
          3000,
        );
        const fid = Date.now();
        dispatch({ type: "ADD_FLOATER", action, id: fid });
        window.setTimeout(
          () => dispatch({ type: "REMOVE_FLOATER", action, id: fid }),
          1000,
        );
        show(`+${cfg.cp} CP por ${cfg.label.toLowerCase()}`, {
          variant: "celebrity",
        });
      } catch (err) {
        const e = err as ApiError;
        show(
          e?.error === "ON_COOLDOWN" ? "Aún en cooldown" : "Acción fallida",
          { variant: "danger" },
        );
        if (e?.error === "ON_COOLDOWN") await mutate(); // re-sincroniza el cooldown real del server
      } finally {
        dispatch({ type: "ACTION_END" });
      }
    },
    [data, ui.pendingAction, mutate, show],
  );

  const renameToka = useCallback(async (newName: string) => {
    if (!data?.activeToka) return;
    const tokaId = data.activeToka.id;
    try {
      await mutate(
        async (prev) => {
          const res = await homeApi.rename(tokaId, newName);
          return prev ? applyRename(prev, res.name) : prev;
        },
        {
          optimisticData: (prev) =>
            prev?.activeToka ? { ...prev, activeToka: { ...prev.activeToka, name: newName.trim() } } : prev!,
          revalidate: false,
          rollbackOnError: true,
        },
      );
      show("Nombre actualizado", { variant: "info" });
    } catch (err) {
      const e = err as ApiError;
      show(e?.error === "INVALID_NAME" ? "Nombre inválido" : "Error al renombrar", { variant: "danger" });
    }
  }, [data, mutate, show]);

  const ascend = useCallback(async (): Promise<"SUCCESS" | "FAIL" | null> => {
    if (!data?.activeToka?.evolution) return null;
    const tokaId = data.activeToka.id;
    try {
      const res = await homeApi.ascend(tokaId);
      // 1) cache del toka (/home)
      await mutate((prev) => (prev ? applyAscendResponse(prev, res) : prev), { revalidate: false });
      // 2) cache del wallet (/me) — el TF se consumió
      await globalMutate("me", (prev?: Session) => (prev ? { ...prev, tf: res.wallet.tf } : prev), { revalidate: false });

      const rarityLabel = RARITY_META[res.toka.rarity].label
      show(
        res.result === "SUCCESS"
          ? `¡Ascendió a ${rarityLabel}! ✨`
          : "La ascensión falló. Toca esperar el cooldown.",
        { variant: res.result === "SUCCESS" ? "celebrity" : "danger" },
      );
      return res.result;
    } catch (err) {
      const e = err as ApiError;
      const msg: Record<string, string> = {
        ON_COOLDOWN: "Aún en cooldown",
        INSUFFICIENT_CP: "No tienes CP suficiente",
        INSUFFICIENT_TF: "No tienes TF suficiente",
        MAX_RARITY: "Ya estás en rareza máxima",
      };
      show(msg[e?.error ?? ""] ?? "No se pudo ascender", { variant: "danger" });
      return null;
    }
  }, [data, mutate, globalMutate, show]);

  const state: HomeState = error
    ? {
        status: "error",
        error: error instanceof Error ? error.message : "Error al cargar",
      }
    : !data
      ? { status: "loading" }
      : {
          status: "ready",
          data,
          ui,
          cooldowns: {
            feed: remaining(data.activeToka?.care.feed ?? null),
            play: remaining(data.activeToka?.care.play ?? null),
            bathe: remaining(data.activeToka?.care.bathe ?? null),
          },
        };

  return { state, runAction, renameToka, ascend, reload: () => mutate(), toast };
}
