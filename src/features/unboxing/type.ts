import type { MainTokagotchiDTO, PlayerProfileDto } from "@/shared/api/dto/session.dto";

// Interfaz para el API del Unboxing
export interface UnboxingApi {
  getUnboxing(): Promise<PlayerProfileDto>;
  rename(id: number, newName: string): Promise<MainTokagotchiDTO>;
}