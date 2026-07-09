import { adminApiClient } from './client'
import type { Merchant, MerchantFormValues } from '../types/merchant'

export async function fetchMerchants(): Promise<Merchant[]> {
  const { data } = await adminApiClient.get<Merchant[]>('/merchants')
  return data
}

export async function createMerchant(values: MerchantFormValues): Promise<Merchant> {
  const { data } = await adminApiClient.post<Merchant>('/merchants', {
    name: values.name,
    address: values.address,
    phone: values.phone,
    region: values.region,
    password: values.password,
  })
  return data
}

export async function updateMerchant(
  id: number,
  values: MerchantFormValues,
): Promise<Merchant> {
  const payload: Partial<MerchantFormValues> = {
    name: values.name,
    address: values.address,
    phone: values.phone,
    region: values.region,
  }
  if (values.password) payload.password = values.password

  const { data } = await adminApiClient.patch<Merchant>(`/merchants/${id}`, payload)
  return data
}

export async function setMerchantActive(id: number, isActive: boolean): Promise<Merchant> {
  const { data } = await adminApiClient.patch<Merchant>(`/merchants/${id}`, { isActive })
  return data
}

export async function deleteMerchant(id: number): Promise<void> {
  await adminApiClient.delete(`/merchants/${id}`)
}
