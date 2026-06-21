import type { HomeResponseDTO, CareActionDTO, CareResponseDTO,AscendResponseDTO  } from "./dto";
import type { TokagotchiActive } from "@/shared/domain/tokagotchi";
import type { AnimationTokagotchi } from "@/shared/domain/tokagotchi";

// Acciones del cuidado
export type ActionCare = "feed" | "play" | "bathe";

// Interfaz para la configuración de cada acción de cuidado
export interface ConfigCare {
  key: ActionCare; // Palabra clave para identificar la accion
  label: string; // Palabra para mostrar en la UI
  cp: number; // CP que se obtendrá al realizar la acción
  cooldownSeg: number; // Segundos
  img: string; // Imagen de la Acción
  animation: AnimationTokagotchi; // Animación que mostrará al realizar la Acción
}

// Interfaz para el estado del Home
export interface HomeData {
  serverTime: number;
  missions: { claimable: number };
  activeToka: TokagotchiActive | null;
}

// Interfaz para el API del Home
export interface HomeApi {
  getHome(): Promise<HomeResponseDTO>;
  care(tokaId: string, action: CareActionDTO): Promise<CareResponseDTO>;
  rename(tokaId: string, name: string): Promise<string>;
  ascend(tokaId: string): Promise<AscendResponseDTO>;
}