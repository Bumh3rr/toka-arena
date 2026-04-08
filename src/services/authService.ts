import api from './api'
import type { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth'

export const authService = {

    // Agrega esto dentro del objeto authService, después de login:
  loginWithAuthCode: async (authCode: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', {
      authCode  // tu backend recibirá esto en vez de username/password
    })
    localStorage.setItem('toka_token', response.data.token)
    return response.data
  },

  saveUser: (user: { userId: string; nickName: string; avatar: string }): void => {
    localStorage.setItem('toka_user', JSON.stringify(user))
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  saveToken: (token: string): void => {
    localStorage.setItem('toka_token', token)
  },

  getToken: (): string | null => {
    return localStorage.getItem('toka_token')
  },

  clearSession: (): void => {
    localStorage.removeItem('toka_token')
    localStorage.removeItem('toka_user')
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('toka_token')
  }
}