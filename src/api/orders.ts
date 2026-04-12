import http from './http'

export interface OrderItem {
  id: number
  order_id: number
  product_id: number | null
  product_name: string
  product_image_url: string | null
  unit_price: number
  quantity: number
  line_amount: number
}

export interface Order {
  id: number
  order_no: string
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  total_amount: number
  items_count: number
  contact_name: string | null
  contact_phone: string | null
  delivery_address: string | null
  remark: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export const ORDER_STATUS_MAP: Record<string, string> = {
  pending:   '待支付',
  paid:      '已支付',
  shipped:   '已发货',
  completed: '已完成',
  cancelled: '已取消',
}

export const ORDER_STATUS_TYPE: Record<string, string> = {
  pending:   'warning',
  paid:      'primary',
  shipped:   'info',
  completed: 'success',
  cancelled: 'danger',
}

export function listOrders() {
  return http.get<{ data: Order[] }>('/api/v1/admin/orders')
}

export function getOrder(id: number) {
  return http.get<{ data: Order }>(`/api/v1/admin/orders/${id}`)
}

export function updateOrderStatus(id: number, status: string) {
  return http.patch<{ data: Order }>(`/api/v1/admin/orders/${id}`, { status })
}
