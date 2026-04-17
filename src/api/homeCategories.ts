import http from './http'

export interface HomeCategory {
  id: number
  name: string
  emoji: string | null
  sort_order: number
  status: number
}

export interface HomeCategoryUpsertPayload {
  name: string
  emoji?: string | null
  sort_order?: number
  status?: number
}

export function listHomeCategories() {
  return http.get<{ data: HomeCategory[] }>('/api/v1/admin/home-categories')
}

export function getHomeCategory(id: number) {
  return http.get<{ data: HomeCategory }>(`/api/v1/admin/home-categories/${id}`)
}

export function createHomeCategory(payload: HomeCategoryUpsertPayload) {
  return http.post<{ data: HomeCategory }>('/api/v1/admin/home-categories', payload)
}

export function updateHomeCategory(id: number, payload: HomeCategoryUpsertPayload) {
  return http.put<{ data: HomeCategory }>(`/api/v1/admin/home-categories/${id}`, payload)
}

export function deleteHomeCategory(id: number) {
  return http.delete(`/api/v1/admin/home-categories/${id}`)
}

