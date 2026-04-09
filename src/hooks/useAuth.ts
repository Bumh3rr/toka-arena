import { useState } from 'react'
import { authService } from '../services/authService'


export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithToka = async (): Promise<{ success: boolean; hasFirstToka: boolean }> => {
    setLoading(true)
    setError(null)
    try {
      // 1. Obtener authCode de la URL (inyectado por Toka Super App)
      //const authCode = getAuthCodeFromURL()
     // authCode = 'DEBUG' // TODO: Eliminar esta línea y usar el authCode real inyectado por la Super App. Se deja hardcodeado para facilitar pruebas sin necesidad de la Super App. --- IGNORE ---

      // 2. Intercambiar authCode por JWT en el backend
      //const response = await authService.loginWithAuthCode(authCode)

      //if (!response.success) throw new Error('Login fallido')

      // 3. Guardar sesión completa
      authService.saveSession({
        success: true,
        accessToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0IiwiaWF0IjoxNzc1NzYyNjQ0LCJleHAiOjE3NzU4NDkwNDR9.AoZZ-mRxlf7S1efTc6N0qxC2W4acrc-lCPYtlWG5XMYyVO4SwLwYtD5vQDpYYsyXfy7nh6RxSokliGaHZgghoQ',
        tokenType: 'Bearer',
        user: {
          id: 1,
          username: 'demo_user',
          hasFirstToka: false,
          tf: 0
        }
      })

      return {
        success: true,
        hasFirstToka: false
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