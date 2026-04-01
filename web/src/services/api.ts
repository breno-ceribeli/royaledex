import axios from 'axios'
import { auth } from '../config/firebase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Interceptor — injeta o token Firebase em toda requisição automaticamente
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api