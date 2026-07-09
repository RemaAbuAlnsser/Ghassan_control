import { apiClient, adminApiClient } from './client'
import type { Order, OrderItemInput, OrderStatus } from '../types/order'

export async function createOrder(items: OrderItemInput[]): Promise<Order> {
  const { data } = await apiClient.post<Order>('/orders', { items })
  return data
}

export async function fetchMyOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>('/orders/mine')
  return data
}

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await adminApiClient.get<Order[]>('/orders')
  return data
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const { data } = await adminApiClient.patch<Order>(`/orders/${id}/status`, { status })
  return data
}

export async function deleteOrder(id: number): Promise<void> {
  await adminApiClient.delete(`/orders/${id}`)
}
