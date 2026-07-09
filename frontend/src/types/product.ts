import type { Category, Subcategory } from './category'
import type { Company } from './company'

export interface Product {
  id: number
  name: string
  description: string | null
  image: string | null
  sku: string
  wholesalePriceWestBank: number
  wholesalePriceIsrael: number
  quantity: number
  hasWarranty: boolean
  warrantyMonths: number | null
  companyId: number
  company: Company
  categoryId: number
  category: Category
  subcategoryId: number | null
  subcategory: Subcategory | null
  createdAt: string
  updatedAt: string
}

export interface StoreProduct {
  id: number
  name: string
  description: string | null
  image: string | null
  sku: string
  quantity: number
  hasWarranty: boolean
  warrantyMonths: number | null
  companyId: number
  company: Company
  categoryId: number
  category: Category
  subcategoryId: number | null
  subcategory: Subcategory | null
  createdAt: string
  updatedAt: string
  price?: number
}

export interface ProductFormValues {
  name: string
  description: string
  sku: string
  wholesalePriceWestBank: number
  wholesalePriceIsrael: number
  quantity: number
  hasWarranty: boolean
  companyId: number | null
  categoryId: number | null
  subcategoryId: number | null
  image: File | null
}
