import api from './api'
import type { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth'

export const authService = {
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