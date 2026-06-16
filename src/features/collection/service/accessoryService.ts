import api from '@/shared/services/api'

export const accesorioService = {
  equipar: async (idTokagotchi: string, idAccesorio: string): Promise<void> => {
    await api.post(`/tokagotchi/${idTokagotchi}/equip/${idAccesorio}`)
  }
}