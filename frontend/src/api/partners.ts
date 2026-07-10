import { adminApiClient } from './client'
import type { Partner, PartnerFormValues } from '../types/partner'

function toFormData(values: PartnerFormValues): FormData {
  const formData = new FormData()
  formData.append('name', values.name)
  if (values.note) formData.append('note', values.note)
  if (values.image) formData.append('image', values.image)
  return formData
}

export async function fetchPartners(): Promise<Partner[]> {
  const { data } = await adminApiClient.get<Partner[]>('/partners')
  return data
}

export async function createPartner(values: PartnerFormValues): Promise<Partner> {
  const { data } = await adminApiClient.post<Partner>('/partners', toFormData(values), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updatePartner(id: number, values: PartnerFormValues): Promise<Partner> {
  const { data } = await adminApiClient.patch<Partner>(`/partners/${id}`, toFormData(values), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deletePartner(id: number): Promise<void> {
  await adminApiClient.delete(`/partners/${id}`)
}
