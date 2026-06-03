import api from './api'
import type {
  LoginSuperAppRequest,
  AuthResponse
} from '../types/auth'

export const authService = {
  loginWithAuthCode: async (authCode: string): Promise<AuthResponse> => {
    const body: LoginSuperAppRequest = { authcode: authCode }
    const response = await api.post<AuthResponse>('/auth/login-superapp', body)
    return response.data
  },

  saveSession: (response: AuthResponse): void => {
    localStorage.setItem('toka_token', response.accessToken)
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