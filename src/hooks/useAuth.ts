import { useState } from 'react'
import { authService } from '../services/authService'


export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithToka = async (): Promise<{ success: boolean; hasFirstToka: boolean }> => {
    setLoading(true)
    setError(null)
    try {
      // 1) Intentar authCode inyectado en query string.
      // 2) Si corre dentro de Toka, solicitar authCode al bridge.
      // 3) En desarrollo local, permitir fallback por variable de entorno.
        const authCode = 'DEBUG'

      if (!authCode) {
        throw new Error('No se pudo obtener authCode para iniciar sesion')
      }

      const response = await authService.loginWithAuthCode(authCode)

      if (!response.success) throw new Error('Login fallido')

      // 3. Guardar sesión completa
      authService.saveSession(response)

      return {
        success: true,
        hasFirstToka: false
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al iniciar sesion con Toka'
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