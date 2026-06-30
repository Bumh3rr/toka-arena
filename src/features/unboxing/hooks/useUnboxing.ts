import { useState } from "react";
import { useGiftSound } from "../../../shared/audio/hooks/useGiftSound";
import { useRevealSound } from "../../../shared/audio/hooks/useRevealSound";
import { useToast } from "@/shared/hooks/useToast";
import { useNavigate } from "react-router-dom";
import type { PlayerProfile } from "@/shared/player/data/player";
import { unboxingApi } from "../api/unboxing.api";
import { mapPlayerProfileDTO } from "@/shared/player/data/player.mapper";
import { mapTokagotchiDTO } from "@/shared/domain/mappers/tokagotchi.mapper";

export type UnboxingPhase = "reveal" | "breaking" | "result";
export type GiftFase = "idle" | "shaking" | "exploding";

export function useUnboxing() {
  const [phase, setPhase] = useState<UnboxingPhase>("reveal");
  const [giftFase, setGiftFase] = useState<GiftFase>("idle");
  const [result, setResult] = useState<PlayerProfile | null>(null);
  const { playShake, stopShake } = useGiftSound();
  const { playReveal } = useRevealSound();
  const { show, toast } = useToast();
  const navigate = useNavigate();

  async function claimStarter() {
    try {
      const player = await unboxingApi.getUnboxing();
      return mapPlayerProfileDTO(player);
    } catch (error) {
      console.error("Error al reclamar el Tokagotchi:", error);
      return null;
    }
  }

  const startBreaking = async () => {
    setPhase("breaking");
    setGiftFase("shaking");
    playShake();

    // Llama al backend mientras el regalo vibra
    const response = await claimStarter();
    
    setTimeout(() => {
      stopShake();
      setGiftFase("exploding");
    }, 1500);

    setTimeout(() => {
      if (response) {
        setResult(response);
        setPhase("result");
        playReveal();
      } else {
        setPhase("reveal");
        setGiftFase("idle");
        show("Error al reclamar el Tokagotchi", { variant: "danger" });
        setTimeout(() => { navigate("/login", { replace: true }); }, 1000);
      }
    }, 2100);
  };

  const renameResult = async (name: string) => {
    if (!result || !result.mainTokagotchi) return;
    try {
      const updated = await unboxingApi.rename(result.mainTokagotchi.id , name);
      const mainTokagotchi = mapTokagotchiDTO(updated);
      setResult(prev => prev ? ({ ...prev, mainTokagotchi }) : prev);

      show("¡Nombre guardado!", { variant: "celebrity" });
    } catch {
      show("Ocurrió un error al guardar el nombre", { variant: "danger" });
    }
  };

  return {
    phase,
    giftFase,
    result,
    startBreaking,
    renameResult,
    toast,
  };
}
