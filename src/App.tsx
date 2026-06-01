import { useState } from 'react'
import { getAuthCode } from './services/tokaAuth'
import type { AuthCodeMethod, AuthCodeScopeMap } from './types/toka'

const METHODS: { method: AuthCodeMethod; scopes: AuthCodeScopeMap[AuthCodeMethod][] }[] = [
  { method: 'DigitalIdentity',     scopes: ['USER_ID', 'USER_AVATAR', 'USER_NICKNAME'] },
  { method: 'ContactInformation',  scopes: ['PLAINTEXT_MOBILE_PHONE', 'PLAINTEXT_EMAIL_ADDRESS'] },
  { method: 'AddressInformation',  scopes: ['USER_ADDRESS'] },
  { method: 'PersonalInformation', scopes: ['USER_NAME', 'USER_FIRST_SURNAME', 'USER_SECOND_SURNAME', 'USER_GENDER', 'USER_BIRTHDAY', 'USER_STATE_OF_BIRTH', 'USER_NATIONALITY'] },
  { method: 'KYCStatus',           scopes: ['USER_KYC_STATUS'] },
]

export default function App() {
  const [authCode, setAuthCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleGetAuthCode(method: AuthCodeMethod, scopes: AuthCodeScopeMap[AuthCodeMethod][]) {
    setAuthCode(null)
    setError(null)
    setLoading(true)

    getAuthCode(method, scopes)
      .then(setAuthCode)
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false))
  }

  return (
    <div>
      <p>Selecciona un método:</p>

      {METHODS.map(({ method, scopes }) => (
        <button key={method} onClick={() => handleGetAuthCode(method, scopes)}>
          {method}
        </button>
      ))}

      {loading && <p>Obteniendo authCode...</p>}

      {authCode && (
        <div>
          <p>authCode obtenido:</p>
          <code>{authCode}</code>
        </div>
      )}

      {error && (
        <div>
          <p>Error:</p>
          <code style={{ wordBreak: 'break-all' }}>{error}</code>
        </div>
      )}
    </div>
  )
}