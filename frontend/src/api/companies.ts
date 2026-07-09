import { adminApiClient } from './client'
import type { Company, CompanyFormValues } from '../types/company'

function toFormData(values: CompanyFormValues): FormData {
  const formData = new FormData()
  formData.append('name', values.name)
  if (values.note) formData.append('note', values.note)
  if (values.image) formData.append('image', values.image)
  return formData
}

export async function fetchCompanies(): Promise<Company[]> {
  const { data } = await adminApiClient.get<Company[]>('/companies')
  return data
}

export async function createCompany(values: CompanyFormValues): Promise<Company> {
  const { data } = await adminApiClient.post<Company>('/companies', toFormData(values), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateCompany(
  id: number,
  values: CompanyFormValues,
): Promise<Company> {
  const { data } = await adminApiClient.patch<Company>(`/companies/${id}`, toFormData(values), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteCompany(id: number): Promise<void> {
  await adminApiClient.delete(`/companies/${id}`)
}
