import type { MainTokagotchiDTO, PlayerProfileDto } from "@/shared/api/dto/session.dto";

// Interfaz para el API del Unboxing
export interface UnboxingApi {
  getUnboxing(): Promise<PlayerProfileDto>;
  rename(id: string, newName: string): Promise<MainTokagotchiDTO>;
}