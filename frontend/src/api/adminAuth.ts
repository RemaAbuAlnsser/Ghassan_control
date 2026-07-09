import { apiClient } from './client'
import type { AdminSessionInfo } from '../types/user'

interface AdminLoginResponse {
  accessToken: string
  user: AdminSessionInfo
}

export async function adminLogin(username: string, password: string): Promise<AdminLoginResponse> {
  const { data } = await apiClient.post<AdminLoginResponse>('/auth/admin/login', {
    username,
    password,
  })
  return data
}
