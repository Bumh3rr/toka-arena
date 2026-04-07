import type { TokaUser } from '../types/toka'

export const tokaAuth = {
  getUser: (): TokaUser => ({
    id: 'toka_user_123',
    name: 'Kevin Altamirano',
    avatar: '/assets/avatar_default.png',
    walletBalance: { TF: 500 }
  }),

  saveSession: (user: TokaUser): void => {
    localStorage.setItem('toka_user', JSON.stringify(user))
  },

  getSession: (): TokaUser | null => {
    const data = localStorage.getItem('toka_user')
    return data ? JSON.parse(data) : null
  },

  clearSession: (): void => {
    localStorage.removeItem('toka_user')
  }
}