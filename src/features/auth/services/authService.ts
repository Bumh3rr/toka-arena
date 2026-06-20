import api from '@/shared/services/api'
import type { LoginSuperAppRequestDTO, AuthResponseDTO} from '../model/dto'

export const authService = {
  loginWithAuthCode: async (authCode: string): Promise<AuthResponseDTO> => {
    const body: LoginSuperAppRequestDTO = { authCode: authCode }
    const response = await api.post<AuthResponseDTO>('/auth/login', body)
    return response.data
  },

  saveSession: (response: AuthResponseDTO): void => {
    localStorage.setItem('toka_token', response.token)
    localStorage.setItem('is_authenticated', 'true')
  },

  saveToken: (token: string): void => {
    localStorage.setItem('toka_token', token)
  },

  clearSession: (): void => {
    localStorage.removeItem('toka_token')
    localStorage.removeItem('is_authenticated')
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('toka_token') && localStorage.getItem('is_authenticated') === 'true'
  },
}