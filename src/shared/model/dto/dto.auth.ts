export interface LoginSuperAppRequestDTO {
  authCode: string
}

export interface AuthResponseDTO {
  token: string
  playerId: string
  isNewPlayer: boolean
}