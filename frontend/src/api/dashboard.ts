import { adminApiClient } from './client'
import type { DashboardStats } from '../types/dashboard'

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await adminApiClient.get<DashboardStats>('/dashboard/stats')
  return data
}
