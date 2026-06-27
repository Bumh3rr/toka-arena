//import type { PlayerProfile } from "@/shared/domain/player";
import type { HomeData } from "../data/home.types";
import type { CareActionDTO } from "../../../shared/api/dto/tokagotchi-responses.dto";
import type { ActionCare } from "../data/home.types";
import { useCallback, useEffect, useReducer, useState } from "react";
import useSWR from "swr";
import { homeApi } from "../api/home.api";
import { tokagotchiApi } from "@/shared/api/tokagotchi.api"
import { applyAscendResponse, applyCareResponse, applyRename } from "../data/home.reconcilers";
import { homeUiReducer, INITIAL_UI, type HomeUi } from "./homeUiReducer";
import { useToast } from "@/shared/hooks/useToast";
import { CONFIG_CARE } from "../constants/config";
import { RARITY_META } from '@/shared/constants/rarity'
import { mapHomeResponseDTO } from "../data/home.mapper";
import { getApiErrorMessage } from "@/shared/api/client";
import { playerApi } from "@/shared/player/api/player.api";

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
  //const { mutate: globalMutate } = useSWRConfig();

  const { data, error, mutate } = useSWR<HomeData>("home", async () => {
    const res = await homeApi.getHome();
    console.log("Fetch /home:", res);
    syncClock(new Date(res.player.serverTime).getTime());
    return mapHomeResponseDTO(res);
  });

  const [ui, dispatch] = useReducer(homeUiReducer, INITIAL_UI);
  const { show, toast } = useToast();

  const care = data?.player?.mainTokagotchi?.careCooldown
  const active = !!care && [care.feed, care.play, care.bathe].some((t) => (t ?? 0) > serverNow());
  useTicker(active);

  const runAction = useCallback(
    async (action: ActionCare) => {
      if (!data?.player?.mainTokagotchi || ui.pendingAction) return;
      if (remaining(data.player.mainTokagotchi.careCooldown[action]) > 0) return;
      const cfg = CONFIG_CARE.find((c) => c.key === action);
      if (!cfg) return;
      const tokaId = data.player.mainTokagotchi.id;

      dispatch({ type: "ACTION_START", action });
      try {
        await mutate(
          async (prev) => {
            const res = await tokagotchiApi.care(tokaId, ACTION_TO_DTO[action]);
            if (!res) throw new Error("No se recibió respuesta del servidor");
            return prev ? applyCareResponse(prev, res) : prev;
          },
          {
            // CP optimista: se ve instantáneo, se reconcilia con el server, revierte si truena
            optimisticData: (prev) =>
              prev?.player?.mainTokagotchi ? {
                    ...prev,
                    player: {
                      ...prev.player,
                      mainTokagotchi: {
                        ...prev.player.mainTokagotchi,
                        cp: prev.player.mainTokagotchi.cp + cfg.cp,
                      },
                    },
                  }
                : prev!,
            revalidate: false,
            rollbackOnError: true,
          },
        );
        // solo en éxito:
        dispatch({ type: "SET_ANIMATION", animation: cfg.animation });
        window.setTimeout(() => dispatch({ type: "SET_ANIMATION", animation: "idle" }),3000);
        const fid = Date.now();
        dispatch({ type: "ADD_FLOATER", action, id: fid });
        window.setTimeout(() => dispatch({ type: "REMOVE_FLOATER", action, id: fid }),1000);
        show(`+${cfg.cp} CP por ${cfg.label.toLowerCase()}`, {variant: "celebrity"});
      } catch (err) {
        const msg = getApiErrorMessage(err, "Acción fallida");
        console.error("Error en acción de cuidado:", err);
        show(msg, { variant: "danger" });
      } finally {
        dispatch({ type: "ACTION_END" });
      }
    },
    [data, ui.pendingAction, mutate, show],
  );

  const renameToka = useCallback(async (newName: string) => {
    if (!data?.player?.mainTokagotchi) return;
    const tokaId = String(data.player.mainTokagotchi.id);
    try {
      await mutate(
        async (prev) => {
          const res = await tokagotchiApi.rename(tokaId, newName);
          return prev ? applyRename(prev, res.name) : prev;
        },
        {
          optimisticData: (prev) =>
            prev?.player?.mainTokagotchi ? { ...prev, player: { ...prev.player, mainTokagotchi: { ...prev.player.mainTokagotchi, name: newName.trim() } } } : prev!,
          revalidate: false,
          rollbackOnError: true,
        },
      );
      show("Nombre actualizado", { variant: "info" });
    } catch (err) {
      const msg = getApiErrorMessage(err, "No se pudo renombrar");
      console.error("Error al renombrar:", err);
      show(msg, { variant: "danger" });
    }
  }, [data, mutate, show]);

  const ascend = useCallback(async (): Promise<"SUCCESS" | "FAIL" | null> => {
    if (!data?.player?.mainTokagotchi?.nextEvolution) return null;
    const tokaId = data.player.mainTokagotchi.id;
    try {
      // 1. Petición al server
      const res = await tokagotchiApi.ascend(String(tokaId));
      
      await mutate((prev) => (prev ? applyAscendResponse(prev, res) : prev), { revalidate: false });
      // 2. Mostrar mensaje de resultado
      const rarityLabel = RARITY_META[res.tokagotchi.rarity].label
      show(
        res.result === "SUCCESS"
          ? `¡Ascendió a ${rarityLabel}! ✨`
          : "La ascensión falló. Toca esperar :(",
        { variant: res.result === "SUCCESS" ? "celebrity" : "danger" },
      );

      if (res.result === 'SUCCESS') {
        dispatch({ type: "SET_ANIMATION", animation: 'curacion' });
        window.setTimeout(() => dispatch({ type: "SET_ANIMATION", animation: "idle" }),3000);
      } else if (res.result === 'FAIL') {
        dispatch({ type: "SET_ANIMATION", animation: 'curacion' });
        window.setTimeout(() => dispatch({ type: "SET_ANIMATION", animation: "idle" }),3000);
      }

      // 3) Obtener TF actualizado mediante /me
      const resMe = await playerApi.getMe();
      await mutate((prev) => (prev ? { ...prev, player: { ...prev.player, tf: resMe.tf } } : prev), { revalidate: false });

      return res.result;
    } catch (err) {
      const msg = getApiErrorMessage(err, "No se pudo ascender");
      console.error("Error al ascender:", err);
      show(msg, { variant: "danger" });
      return null;
    }
  }, [data, mutate, show]);

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
            feed: remaining(data.player?.mainTokagotchi?.careCooldown.feed ?? null),
            play: remaining(data.player?.mainTokagotchi?.careCooldown.play ?? null),
            bathe: remaining(data.player?.mainTokagotchi?.careCooldown.bathe ?? null),
          },
        };

  return { state, runAction, renameToka, ascend, reload: () => mutate(), toast };
}
