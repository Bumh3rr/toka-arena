import api from './api'
import type { Tokagotchi } from '../types/toka'
import { mapResponseToTokagotchi } from './tokagotchiService'

export interface UserMeResponse {
  id: number
  username: string
  tf: number
  firstToka: boolean
  tokagotchiActivo: any
  tokagotchis: any[]
  accessories: any[]
  consumables: any[]
}

export interface MisionResponse {
  id: number
  description: string
  completed: boolean
  percentage: number
  currentProgress: number
  requiredAmount: number
  rewardTf: number
}

export interface MisionesResponse {
  summary: string
  missions: MisionResponse[]
}

export const userService = {
  getMe: async (): Promise<UserMeResponse> => {
    const response = await api.get('/users/me')
    return response.data
  },

  renameTokagotchi: async (id: number, newName: string): Promise<Tokagotchi> => {
    const response = await api.post(`/tokagotchi/${id}/rename`, { newName })
    return mapResponseToTokagotchi(response.data)
  },

  getMisiones: async (): Promise<MisionesResponse> => {
    const response = await api.get('/missions')
    return response.data
  }
}