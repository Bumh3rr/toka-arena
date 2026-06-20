import { useState } from 'react'
import { tokagotchiService } from '@/shared/services/tokagotchiService'
import type { TokagotchiActive } from '@/shared/model/tokagotchi'

export function useClaimStarter() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const claimStarter = async (): Promise<TokagotchiActive | null> => {
    setLoading(true)
    setError(null)
    try {
      const tokagotchi = await tokagotchiService.claimStarter()
      console.log(tokagotchi);
      
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