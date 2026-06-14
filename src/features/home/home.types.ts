import type { TokagotchiActive } from "@/shared/types/tokagotchi";
import type { AnimationTokagotchi } from "@/shared/types/tokagotchi";

// Acciones del cuidado
export type ActionCare = "feed" | "play" | "bathe";

export interface ConfigCare {
  key: ActionCare; // Palabra clave para identificar la accion
  label: string; // Palabra para mostrar en la UI
  cp: number; // CP que se obtendrá al realizar la acción
  cooldownSeg: number; // Segundos
  img: string; // Imagen de la Acción
  animation: AnimationTokagotchi; // Animación que mostrará al realizar la Acción
}

export interface HomeData {
  serverTime: number;
  missions: { claimable: number };
  activeToka: TokagotchiActive | null;
}
