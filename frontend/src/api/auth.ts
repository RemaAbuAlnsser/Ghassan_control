import { apiClient } from './client'
import type { MerchantSessionInfo } from '../types/merchant'

interface MerchantLoginResponse {
  accessToken: string
  merchant: MerchantSessionInfo
}

export async function merchantLogin(phone: string, password: string): Promise<MerchantLoginResponse> {
  const { data } = await apiClient.post<MerchantLoginResponse>('/auth/merchant/login', {
    phone,
    password,
  })
  return data
}
