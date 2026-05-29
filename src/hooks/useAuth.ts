// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { getAuthCode } from '../services/tokaAuth'

type AuthStatus = 'loading' | 'authenticated' | 'error'

interface AuthState {
  status: AuthStatus
  token: string | null
  hasStarter: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    status: 'loading',
    token: null,
    hasStarter: false,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function authenticate() {
      try {
        const authCode = await getAuthCode()

        // TODO: reemplazar con tu authService.login(authCode)
        // const { token, hasStarter } = await authService.login(authCode)
        const token = `jwt_from_${authCode}`
        const hasStarter = false // vendrá del backend

        localStorage.setItem('toka_token', token)

        if (!cancelled) {
          setAuthState({ status: 'authenticated', token, hasStarter, error: null })
        }
      } catch {
        if (!cancelled) {
          setAuthState({ status: 'error', token: null, hasStarter: false, error: 'Auth fallida' })
        }
      }
    }

    authenticate()
    return () => { cancelled = true }
  }, [])

  return authState
}