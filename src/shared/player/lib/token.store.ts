const KEY = 'toka_token'

let token: string | null = localStorage.getItem(KEY)

export const tokenStore = {
  get: () => token,
  set: (value: string) => {
    token = value
    localStorage.setItem(KEY, value)
  },
  clear: () => {
    token = null
    localStorage.removeItem(KEY)
  },
  exists: () => token !== null,
}
