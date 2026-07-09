import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchSettings } from '../api/settings'
import { resolveImageUrl } from '../api/client'
import type { Settings } from '../types/settings'

interface SettingsContextValue {
  settings: Settings | null
  reload: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null)

  function load() {
    fetchSettings()
      .then(setSettings)
      .catch(() => undefined)
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (!settings) return

    document.title = settings.siteName

    const faviconUrl = resolveImageUrl(settings.favicon)
    if (faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>("link[rel='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = faviconUrl
    }
  }, [settings])

  return (
    <SettingsContext.Provider value={{ settings, reload: load }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
