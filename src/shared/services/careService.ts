import api from '@/shared/services/api'

export const careService = {
  feed: async (id: string): Promise<void> => {
    await api.post(`/tokagotchi/care/${id}/feed`)
  },
  play: async (id: string): Promise<void> => {
    await api.post(`/tokagotchi/care/${id}/play`)
  },
  bathe: async (id: string): Promise<void> => {
    await api.post(`/tokagotchi/care/${id}/bathe`)
  }
}