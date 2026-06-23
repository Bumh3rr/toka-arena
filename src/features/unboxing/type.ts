import type { PlayerProfileDto } from "@/shared/api/dto/session.dto";
import type { MainTokagotchiDTO } from "@/shared/api/dto/tokagotchi.dto";

// Interfaz para el API del Unboxing
export interface UnboxingApi {
  getUnboxing(): Promise<PlayerProfileDto>;
  rename(id: string, newName: string): Promise<MainTokagotchiDTO>;
}