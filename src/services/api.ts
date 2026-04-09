import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Id': import.meta.env.VITE_APP_ID
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('toka_token')
  console.log('Token enviado:', token) // ← temporal
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('toka_token')
      localStorage.removeItem('toka_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api