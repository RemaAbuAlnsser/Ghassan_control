import type { Merchant } from './merchant'

export type OrderStatus = 'pending' | 'completed'

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  productName: string
  unitPrice: number
  quantity: number
  subtotal: number
  hasWarranty: boolean
  warrantyMonths: number | null
  product?: {
    id: number
    image: string | null
  }
}

export interface Order {
  id: number
  merchantId: number
  merchant: Merchant
  status: OrderStatus
  total: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItemInput {
  productId: number
  quantity: number
}
