import http from './http'

export interface LoginResp {
  token: string
}

export interface MeResp {
  id: number
  name: string
  email: string
}

export function login(email: string, password: string) {
  return http.post<LoginResp>('/api/v1/auth/login', { email, password })
}

export function getMe() {
  return http.get<{ data: MeResp }>('/api/v1/auth/me')
}

export function logout() {
  return http.post('/api/v1/auth/logout', {})
}
