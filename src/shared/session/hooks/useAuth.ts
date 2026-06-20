import { useState } from 'react'
import { authService } from '../services/authService'
import { getAuthCode } from '../services/tokaAuth'
import { useToast } from '@/shared/hooks/useToast'
import type { AuthResponseDTO } from '../model/dto'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast, show } = useToast()

  const login = async (): Promise<{ success: boolean; isNewPlayer: boolean }> => {
    setLoading(true)
    setError(null)
    
    try {
      // Solicitar authCode a Toka
      const authCode: string = await getAuthCode('DigitalIdentity', ['USER_ID', 'USER_AVATAR', 'USER_NICKNAME'])
      if (!authCode) throw new Error('Error de Autenticación de Toka')

      // Enviar authCode al backend para login
      const response: AuthResponseDTO = await authService.login(authCode)
      if (!response) throw new Error('Login fallido')
      
      // Guardar sesión
      authService.saveSession(response)

      return {
        success: true,
        isNewPlayer: response.isNewPlayer
      }
      
    } catch (err: any) {
      const msg = err.message || 'Error al iniciar sesion'
      setError(msg)
      show(msg, {variant:'danger', position:'top'})
      
      return { success: false, isNewPlayer: false }
    } finally {
      setLoading(false)
      setTimeout(() => setError(null), 5000)
    }
  }

  const logout = () => {
    authService.clearSession()
  }

  return { login, logout, loading, error, toast }
}