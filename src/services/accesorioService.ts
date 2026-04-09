import api from './api'

export const accesorioService = {
  equipar: async (idTokagotchi: string, idAccesorio: string): Promise<void> => {
    await api.post(`/tokagotchi/${idTokagotchi}/equip/${idAccesorio}`)
  }
}