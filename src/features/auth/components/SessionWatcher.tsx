import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tokenStore } from '../../../shared/player/lib/token.store'

/**
 * Reacciona a la expiración del token: el interceptor de axios emite `auth:expired`
 * en un 401, aquí limpiamos la sesión y mandamos al login.
 */
export default function SessionWatcher() {
  const navigate = useNavigate()

  useEffect(() => {
    const onExpired = () => {
      tokenStore.clear()
      navigate('/login', { replace: true })
    }
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [navigate])

  return null
}
