import http from './http'

export interface Product {
  id: number
  name: string
  subtitle: string | null
  price: number
  original_price: number | null
  cover_url: string
  description: string | null
  sale_count: number
  status: number    // 1=上架 0=下架
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProductUpsertPayload {
  name: string
  subtitle?: string | null
  price: number
  original_price?: number | null
  cover_url: string
  description?: string | null
  sale_count?: number
  status?: number
  sort_order?: number
}

export function listProducts() {
  return http.get<{ data: Product[] }>('/api/v1/admin/products')
}

export function getProduct(id: number) {
  return http.get<{ data: Product }>(`/api/v1/admin/products/${id}`)
}

export function createProduct(payload: ProductUpsertPayload) {
  return http.post<{ data: Product }>('/api/v1/admin/products', payload)
}

export function updateProduct(id: number, payload: ProductUpsertPayload) {
  return http.put<{ data: Product }>(`/api/v1/admin/products/${id}`, payload)
}

export function deleteProduct(id: number) {
  return http.delete(`/api/v1/admin/products/${id}`)
}
