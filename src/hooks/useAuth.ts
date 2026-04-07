import { useState } from 'react'
import { authService } from '../services/authService'
import type { RegisterRequest, LoginRequest } from '../types/auth'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (data: RegisterRequest): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.register(data)
      authService.saveToken(response.token)
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse')
      return false
    } finally {
      setLoading(false)
    }
  }

  const login = async (data: LoginRequest): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.login(data)
      authService.saveToken(response.token)
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.clearSession()
  }

  return { login, register, logout, loading, error }
}