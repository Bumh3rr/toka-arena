import { useState } from 'react'
import { authService } from '../services/authService'
import { tokaAuth } from '../services/tokaAuth'
import type { RegisterRequest, LoginRequest } from '../types/auth'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithToka = async (): Promise<boolean> => {
  setLoading(true)
  setError(null)
  try {
    // 1. Esperar bridge + obtener authCode
    await tokaAuth.waitForBridge()
    const authCode = await tokaAuth.getDigitalIdentityAuthCode()

    // 2. Intercambiar por JWT en tu backend
    const response = await authService.loginWithAuthCode(authCode)
    authService.saveToken(response.token)
    return true
  } catch (err: any) {
    setError(err.response?.data?.message || 'Error al iniciar sesión con Toka')
    return false
  } finally {
    setLoading(false)
  }
}

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

  return { login, register, logout, loginWithToka, loading, error }
}