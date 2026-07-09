import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { adminLogin } from '../api/adminAuth'
import type { AdminSession } from '../types/user'

const STORAGE_KEY = 'admin_session'

interface AdminAuthContextValue {
  session: AdminSession | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setSession(JSON.parse(raw))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setInitialized(true)
  }, [])

  async function login(username: string, password: string) {
    const result = await adminLogin(username, password)
    const newSession: AdminSession = {
      token: result.accessToken,
      admin: result.user,
    }
    setSession(newSession)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession))
  }

  function logout() {
    setSession(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  if (!initialized) return null

  return (
    <AdminAuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
