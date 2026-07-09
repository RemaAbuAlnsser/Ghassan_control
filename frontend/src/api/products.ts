import { apiClient, adminApiClient } from './client'
import type { Product, ProductFormValues, StoreProduct } from '../types/product'

function toFormData(values: ProductFormValues): FormData {
  const formData = new FormData()
  formData.append('name', values.name)
  if (values.description) formData.append('description', values.description)
  formData.append('sku', values.sku)
  formData.append('wholesalePriceWestBank', String(values.wholesalePriceWestBank))
  formData.append('wholesalePriceIsrael', String(values.wholesalePriceIsrael))
  formData.append('quantity', String(values.quantity))
  formData.append('hasWarranty', String(values.hasWarranty))
  if (values.companyId !== null) formData.append('companyId', String(values.companyId))
  if (values.categoryId !== null) formData.append('categoryId', String(values.categoryId))
  if (values.subcategoryId !== null) formData.append('subcategoryId', String(values.subcategoryId))
  if (values.image) formData.append('image', values.image)
  return formData
}

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await adminApiClient.get<Product[]>('/products')
  return data
}

export async function createProduct(values: ProductFormValues): Promise<Product> {
  const { data } = await adminApiClient.post<Product>('/products', toFormData(values), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateProduct(
  id: number,
  values: ProductFormValues,
): Promise<Product> {
  const { data } = await adminApiClient.patch<Product>(`/products/${id}`, toFormData(values), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteProduct(id: number): Promise<void> {
  await adminApiClient.delete(`/products/${id}`)
}

export async function fetchPublicProducts(): Promise<StoreProduct[]> {
  const { data } = await apiClient.get<StoreProduct[]>('/products/public')
  return data
}

export async function fetchMerchantProducts(): Promise<StoreProduct[]> {
  const { data } = await apiClient.get<StoreProduct[]>('/products/merchant')
  return data
}
