import { apiClient } from './client'
import type { Category, CategoryFormValues } from '../types/category'

function toFormData(values: CategoryFormValues): FormData {
  const formData = new FormData()
  formData.append('name', values.name)
  if (values.description) formData.append('description', values.description)
  if (values.image) formData.append('image', values.image)
  return formData
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>('/categories')
  return data
}

export async function createCategory(values: CategoryFormValues): Promise<Category> {
  const { data } = await apiClient.post<Category>('/categories', toFormData(values), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateCategory(
  id: number,
  values: CategoryFormValues,
): Promise<Category> {
  const { data } = await apiClient.patch<Category>(`/categories/${id}`, toFormData(values), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/categories/${id}`)
}
