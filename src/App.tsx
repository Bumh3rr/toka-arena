import { useState, useEffect } from 'react'
import { getAuthCode } from './services/tokaAuth'

export default function App() {
  const [authCode, setAuthCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAuthCode()
      .then(setAuthCode)
      .catch((err) => setError(String(err)))
  }, [])

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    )
  }

  if (!authCode) {
    return <p>Obteniendo authCode...</p>
  }

  return (
    <div>
      <p>authCode obtenido:</p>
      <code>{authCode}</code>
    </div>
  )
}