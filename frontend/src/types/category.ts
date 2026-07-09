export interface Subcategory {
  id: number
  name: string
  description: string | null
  image: string | null
  categoryId: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  description: string | null
  image: string | null
  subcategories: Subcategory[]
  createdAt: string
  updatedAt: string
}

export interface CategoryFormValues {
  name: string
  description: string
  image: File | null
}

export interface SubcategoryFormValues {
  name: string
  description: string
  categoryId: number
  image: File | null
}
