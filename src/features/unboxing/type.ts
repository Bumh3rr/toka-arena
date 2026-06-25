import type { PlayerProfileDto } from "@/shared/api/dto/player.dto";
import type { TokagotchiDTO } from "@/shared/api/dto/tokagotchi.dto";

// Interfaz para el API del Unboxing
export interface UnboxingApi {
  getUnboxing(): Promise<PlayerProfileDto>;
  rename(id: string, newName: string): Promise<TokagotchiDTO>;
}