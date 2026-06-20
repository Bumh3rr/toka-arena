import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL
import { tokenStore } from '../session/store/token.store' 

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
})

api.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Dispara evento para que el hook de auth reaccione a la expiración del token
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return Promise.reject(error)
  }
)

export default api