import type { PlayerProfileDTO } from "@/shared/player/api/player.dto";
import type { TokagotchiDTO } from "@/shared/api/dto/tokagotchi.dto";

// Interfaz para el API del Unboxing
export interface UnboxingApi {
  getUnboxing(): Promise<PlayerProfileDTO>;
  rename(id: string, newName: string): Promise<TokagotchiDTO>;
}