import http from './http'

export interface Store {
  id: number
  name: string
  tag: string
  address: string
  hours: string
  phone: string
  latitude: number
  longitude: number
  cover_url: string
  tips: string
  sort_order: number
  status: number    // 1=展示 0=隐藏
  created_at: string
  updated_at: string
}

export interface StoreUpsertPayload {
  name: string
  tag?: string
  address: string
  hours: string
  phone: string
  latitude: number
  longitude: number
  cover_url?: string
  tips?: string
  sort_order?: number
  status?: number
}

export function listStores() {
  return http.get<{ data: Store[] }>('/api/v1/admin/stores')
}

export function getStore(id: number) {
  return http.get<{ data: Store }>(`/api/v1/admin/stores/${id}`)
}

export function createStore(payload: StoreUpsertPayload) {
  return http.post<{ data: Store }>('/api/v1/admin/stores', payload)
}

export function updateStore(id: number, payload: StoreUpsertPayload) {
  return http.put<{ data: Store }>(`/api/v1/admin/stores/${id}`, payload)
}

export function deleteStore(id: number) {
  return http.delete(`/api/v1/admin/stores/${id}`)
}
