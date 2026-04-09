import axios from 'axios'

const api = axios.create({
  baseURL: 'https://9c4c-201-149-79-122.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
    'X-App-Id': '3500020265523984'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('toka_token')
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