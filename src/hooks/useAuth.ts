import { useState } from 'react'
import { authService } from '../services/authService'
import { getAuthCodeFromURL } from '../services/tokaAuth'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithToka = async (): Promise<{ success: boolean; hasFirstToka: boolean }> => {
    setLoading(true)
    setError(null)
    try {
      // 1. Obtener authCode de la URL (inyectado por Toka Super App)
      const authCode = getAuthCodeFromURL()
      if (!authCode) throw new Error('No se encontró el authCode en la URL')

      // 2. Intercambiar authCode por JWT en el backend
      const response = await authService.loginWithAuthCode(authCode)

      if (!response.success) throw new Error('Login fallido')

      // 3. Guardar sesión completa
      authService.saveSession(response)

      return {
        success: true,
        hasFirstToka: response.user.hasFirstToka
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al iniciar sesión con Toka'
      setError(msg)
      return { success: false, hasFirstToka: false }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.clearSession()
  }

  return { loginWithToka, logout, loading, error }
}