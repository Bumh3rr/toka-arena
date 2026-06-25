import api from '../api/client'

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
  getMisiones: async (): Promise<MisionesResponse> => {
    const response = await api.get('/missions')
    console.log("/missions", response.data)
    return response.data
  }
}