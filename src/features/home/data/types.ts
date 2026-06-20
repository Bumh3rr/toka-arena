import type { HomeResponseDTO, CareActionDTO, CareResponseDTO, RenameResponseDTO,AscendResponseDTO  } from "./dto";
import type { TokagotchiActive } from "@/shared/model/tokagotchi";
import type { AnimationTokagotchi } from "@/shared/model/tokagotchi";

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
  care(tokaId: number, action: CareActionDTO): Promise<CareResponseDTO>;
  rename(tokaId: number, name: string): Promise<RenameResponseDTO>;
  ascend(tokaId: number): Promise<AscendResponseDTO>;
}