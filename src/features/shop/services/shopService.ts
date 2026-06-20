import api from '@/shared/api/client'

export const shopService = {
  comprarAccesorio: async (idAccesorio: string): Promise<{ message: string }> => {
    const response = await api.post(`/shop/buy/accessory/${idAccesorio}`)
    return response.data
  }
}