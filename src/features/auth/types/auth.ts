export interface LoginSuperAppRequest {
  authcode: string
}

export interface TokaUser {
  id: number
  username: string
  hasFirstToka: boolean
  tf: number
}

export interface AuthResponse {
  success: boolean
  accessToken: string
  tokenType: string
  user: TokaUser
}