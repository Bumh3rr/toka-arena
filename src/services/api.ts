import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Adjunta el token automáticamente en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('toka_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el token expira (401), limpia sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('toka_token')
      localStorage.removeItem('toka_user')
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

export default api