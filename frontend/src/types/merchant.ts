export type MerchantRegion = 'west_bank' | 'israel'

export interface Merchant {
  id: number
  name: string
  address: string
  phone: string
  region: MerchantRegion
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MerchantFormValues {
  name: string
  address: string
  phone: string
  region: MerchantRegion
  password: string
}

export interface MerchantSessionInfo {
  id: number
  name: string
  phone: string
  region: MerchantRegion
}

export interface MerchantSession {
  token: string
  merchant: MerchantSessionInfo
}
