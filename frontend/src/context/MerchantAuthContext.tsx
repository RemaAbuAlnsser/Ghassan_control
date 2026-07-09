import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { merchantLogin } from '../api/auth'
import type { MerchantSession } from '../types/merchant'

const STORAGE_KEY = 'merchant_session'

interface MerchantAuthContextValue {
  session: MerchantSession | null
  login: (phone: string, password: string) => Promise<void>
  logout: () => void
}

const MerchantAuthContext = createContext<MerchantAuthContextValue | null>(null)

export function MerchantAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<MerchantSession | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setSession(JSON.parse(raw))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  async function login(phone: string, password: string) {
    const result = await merchantLogin(phone, password)
    const newSession: MerchantSession = {
      token: result.accessToken,
      merchant: result.merchant,
    }
    setSession(newSession)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession))
  }

  function logout() {
    setSession(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <MerchantAuthContext.Provider value={{ session, login, logout }}>
      {children}
    </MerchantAuthContext.Provider>
  )
}

export function useMerchantAuth(): MerchantAuthContextValue {
  const ctx = useContext(MerchantAuthContext)
  if (!ctx) throw new Error('useMerchantAuth must be used within MerchantAuthProvider')
  return ctx
}
