import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { authApi } from '../api/auth.api'
import { acquireAuthCode } from '../lib/authCode'
import { tokenStore } from '../store/token.store'
import { useToast } from '@/shared/hooks/useToast'
import type { LoginData } from '../model/types'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast, show } = useToast()
  const { mutate } = useSWRConfig()

  const login = async (): Promise<LoginData> => {
    setLoading(true)
    setError(null)
    try {
      // 1. Obtener el auth code
      const authCode = await acquireAuthCode()
      // 2. Enviar el auth code al backend
      const res = await authApi.login(authCode)
      
      // 3. Guardar el token y actualizar la sesión
      tokenStore.set(res.token)
      await mutate('me')
      
      // 4. Retornar el resultado
      return { success: true, isNewPlayer: res.isNewPlayer }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión'
      setError(msg)
      show(msg, { variant: 'danger', position: 'top' })
      
      return { success: false, isNewPlayer: false }
    } finally {
      setLoading(false)
      window.setTimeout(() => setError(null), 5000)
    }
  }

  const logout = () => {
    tokenStore.clear()
    mutate('me', undefined, { revalidate: false })
  }

  return { login, logout, loading, error, toast }
}
