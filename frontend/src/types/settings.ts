export interface Settings {
  id: number
  siteName: string
  logo: string | null
  favicon: string | null
  phone: string | null
  email: string | null
  whatsapp: string | null
  facebookUrl: string | null
  instagramUrl: string | null
  heroTitle: string
  heroDescription: string | null
  heroLoopWords: string | null
  updatedAt: string
}

export interface SettingsFormValues {
  siteName: string
  phone: string
  email: string
  whatsapp: string
  facebookUrl: string
  instagramUrl: string
  heroTitle: string
  heroDescription: string
  heroLoopWords: string
  logo: File | null
  favicon: File | null
}
