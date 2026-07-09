export interface Company {
  id: number
  name: string
  image: string | null
  note: string | null
  createdAt: string
  updatedAt: string
}

export interface CompanyFormValues {
  name: string
  note: string
  image: File | null
}
