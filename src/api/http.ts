import axios from 'axios'
import { authStorage } from '../stores/auth'

const base = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://127.0.0.1:8080'

const http = axios.create({
  baseURL: base,
  timeout: 15000,
})

http.interceptors.request.use((config) => {
  const token = authStorage.getToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default http
