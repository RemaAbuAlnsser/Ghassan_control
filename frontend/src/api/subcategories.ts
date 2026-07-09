import { adminApiClient } from './client'
import type { Subcategory, SubcategoryFormValues } from '../types/category'

function toFormData(values: SubcategoryFormValues): FormData {
  const formData = new FormData()
  formData.append('name', values.name)
  if (values.description) formData.append('description', values.description)
  formData.append('categoryId', String(values.categoryId))
  if (values.image) formData.append('image', values.image)
  return formData
}

export async function createSubcategory(
  values: SubcategoryFormValues,
): Promise<Subcategory> {
  const { data } = await adminApiClient.post<Subcategory>('/subcategories', toFormData(values), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateSubcategory(
  id: number,
  values: SubcategoryFormValues,
): Promise<Subcategory> {
  const { data } = await adminApiClient.patch<Subcategory>(
    `/subcategories/${id}`,
    toFormData(values),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}

export async function deleteSubcategory(id: number): Promise<void> {
  await adminApiClient.delete(`/subcategories/${id}`)
}
