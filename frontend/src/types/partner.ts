export interface Partner {
  id: number
  name: string
  image: string | null
  note: string | null
  createdAt: string
  updatedAt: string
}

export interface PartnerFormValues {
  name: string
  note: string
  image: File | null
}
