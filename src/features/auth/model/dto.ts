/**
 * src/features/auth/model/dto.ts
 * (DTOs) relacionados con la autenticación
 */
export interface LoginSuperAppRequestDTO {
  authcode: string
}
export interface TokaUser {
  id: number
  username: string
  hasFirstToka: boolean
  tf: number
}
export interface AuthResponseDTO {
  success: boolean
  accessToken: string
  tokenType: string
  user: TokaUser
}