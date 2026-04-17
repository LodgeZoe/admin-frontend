import http from './http'

export interface Banner {
  id: number
  title: string
  sub_title: string | null
  image_url: string
  link_type: string | null
  link_value: string | null
  sort_order: number
  status: number
  created_at: string
  updated_at: string
}

export interface BannerUpsertPayload {
  title: string
  sub_title?: string | null
  image_url: string
  link_type?: string | null
  link_value?: string | null
  sort_order?: number
  status?: number
}

export function listBanners() {
  return http.get<{ data: Banner[] }>('/api/v1/admin/banners')
}

export function getBanner(id: number) {
  return http.get<{ data: Banner }>(`/api/v1/admin/banners/${id}`)
}

export function createBanner(payload: BannerUpsertPayload) {
  return http.post<{ data: Banner }>('/api/v1/admin/banners', payload)
}

export function updateBanner(id: number, payload: BannerUpsertPayload) {
  return http.put<{ data: Banner }>(`/api/v1/admin/banners/${id}`, payload)
}

export function deleteBanner(id: number) {
  return http.delete(`/api/v1/admin/banners/${id}`)
}

