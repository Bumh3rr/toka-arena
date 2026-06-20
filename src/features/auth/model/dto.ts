/**
 * src/features/auth/model/dto.ts
 * (DTOs) relacionados con la autenticación
 */
export interface LoginSuperAppRequestDTO {
  authCode: string
}

export interface AuthResponseDTO {
  token: string
  playerId: string
  isNewPlayer: boolean
}