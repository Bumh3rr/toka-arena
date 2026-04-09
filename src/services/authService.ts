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
    localStorage.setItem('toka_user', JSON.stringify(response.user))
  },

  getUser: () => {
    const data = localStorage.getItem('toka_user')
    return data ? JSON.parse(data) : null
  },

  getToken: (): string | null => {
    return localStorage.getItem('toka_token')
  },

  saveToken: (token: string): void => {
    localStorage.setItem('toka_token', token)
  },

  clearSession: (): void => {
    localStorage.removeItem('toka_token')
    localStorage.removeItem('toka_user')
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('toka_token')
  },

  hasFirstToka: (): boolean => {
    const user = authService.getUser()
    return user?.hasFirstToka ?? false
  }
}