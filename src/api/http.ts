import axios from 'axios'
import { authStorage } from '../stores/auth'

const base = import.meta.env.VITE_API_BASE_URL as string | undefined

const http = axios.create({
  ...(base ? { baseURL: base } : {}),
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

