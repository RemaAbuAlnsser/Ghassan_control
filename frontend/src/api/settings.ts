import { apiClient, adminApiClient } from './client'
import type { Settings, SettingsFormValues } from '../types/settings'

export async function fetchSettings(): Promise<Settings> {
  const { data } = await apiClient.get<Settings>('/settings')
  return data
}

export async function updateSettings(values: Partial<SettingsFormValues>): Promise<Settings> {
  const formData = new FormData()
  if (values.siteName !== undefined) formData.append('siteName', values.siteName)
  if (values.phone) formData.append('phone', values.phone)
  if (values.email) formData.append('email', values.email)
  if (values.whatsapp) formData.append('whatsapp', values.whatsapp)
  if (values.facebookUrl) formData.append('facebookUrl', values.facebookUrl)
  if (values.instagramUrl) formData.append('instagramUrl', values.instagramUrl)
  if (values.heroTitle) formData.append('heroTitle', values.heroTitle)
  if (values.heroDescription !== undefined) formData.append('heroDescription', values.heroDescription)
  if (values.heroLoopWords !== undefined) formData.append('heroLoopWords', values.heroLoopWords)
  if (values.logo) formData.append('logo', values.logo)
  if (values.favicon) formData.append('favicon', values.favicon)

  const { data } = await adminApiClient.patch<Settings>('/settings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
