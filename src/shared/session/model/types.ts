import type { AuthResponseDTO } from "@/shared/api/dto/auth.dto";
import type { PlayerProfile } from "@/shared/domain/player";

export interface LoginData {
  success: boolean;
  isNewPlayer: boolean;
}

export interface SessionApi {
  getMe(): Promise<PlayerProfile>;
  renameUsername(newUsername: string): Promise<PlayerProfile>;
}

export interface AuthApi {
  login(authCode: string): Promise<AuthResponseDTO>;
}