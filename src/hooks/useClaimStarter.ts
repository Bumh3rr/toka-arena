import { useState } from 'react'
import type { Tokagotchi } from '../types/toka'
import { tokagotchiService } from '../services/tokagotchiService'

export function useClaimStarter() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const claimStarter = async (): Promise<Tokagotchi | null> => {
    setLoading(true)
    setError(null)
    try {
      const tokagotchi = await tokagotchiService.claimStarter()
      return tokagotchi
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al reclamar tu Tokagotchi')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { claimStarter, loading, error }
}