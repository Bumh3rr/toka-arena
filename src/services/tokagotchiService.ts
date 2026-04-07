import api from './api'
import type { Tokagotchi } from '../types/toka'

export const tokagotchiService = {
  claimStarter: async (): Promise<Tokagotchi> => {
    const response = await api.post<Tokagotchi>('/tokagotchi/claim-starter')
    return response.data
  }
}