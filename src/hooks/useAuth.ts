import { useState } from 'react'
import { authService } from '../services/authService'
import { getAuthCode } from '../services/tokaAuth'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithToka = async (): Promise<{ success: boolean; hasFirstToka: boolean }> => {
    setLoading(true)
    setError(null)
    try {
      // Solicitar authCode a Toka
      const authCode = await getAuthCode('DigitalIdentity', ['USER_ID', 'USER_AVATAR', 'USER_NICKNAME'])
      if (!authCode) throw new Error('Error de Autenticación')

      // Enviar authCode al backend para login
      const response = await authService.loginWithAuthCode(authCode)
      if (!response.success) throw new Error('Login fallido')

      // Guardar sesión
      authService.saveSession(response)

      return {
        success: true,
        hasFirstToka: response?.user?.hasFirstToka ?? false
      }
    } catch (err: any) {
      const msg = err.message || 'Error al iniciar sesion con Toka'
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