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
  },

  getUser: () => {
    const data = localStorage.getItem('toka_user')
    return data ? JSON.parse(data) : null
  },

  saveToken: (token: string): void => {
    localStorage.setItem('toka_token', token)
  },

  clearSession: (): void => {
    localStorage.removeItem('toka_token')
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('toka_token')
  },
}