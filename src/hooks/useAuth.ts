import { useState } from 'react'
import { authService } from '../services/authService'

type AuthCodeProps = {
  authCode: string | null
}

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithToka = async ({ authCode }: AuthCodeProps): Promise<{ success: boolean; hasFirstToka: boolean }> => {
    setLoading(true)
    setError(null)
    try {
      authCode  = ''
      // 1. Obtener authCode de la URL (inyectado por Toka Super App)
      //const authCode = getAuthCodeFromURL()
     // authCode = 'DEBUG' // TODO: Eliminar esta línea y usar el authCode real inyectado por la Super App. Se deja hardcodeado para facilitar pruebas sin necesidad de la Super App. --- IGNORE ---

      // 2. Intercambiar authCode por JWT en el backend
      //const response = await authService.loginWithAuthCode(authCode)

      //if (!response.success) throw new Error('Login fallido')

      // 3. Guardar sesión completa
      authService.saveSession({
        success: true,
        accessToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0IiwiaWF0IjoxNzc1NzYyMDA4LCJleHAiOjE3NzU4NDg0MDh9.3kK3f3GEIL7Di2xCJSvEpt2tNMR8RXzcoddOkr-ArI4wt7jNR67OjRcAYYx2uGmCiDZHjnkbLuzxeET3FCieCQ',
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