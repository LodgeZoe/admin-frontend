import { defineStore } from 'pinia'

const TOKEN_KEY = 'flower_admin_token'

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY)
  },
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: authStorage.getToken() as string | null,
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      authStorage.setToken(token)
    },
    logout() {
      this.token = null
      authStorage.clearToken()
    },
  },
})

