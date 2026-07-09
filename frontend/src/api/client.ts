import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const apiClient = axios.create({
  baseURL: API_URL,
})

export function resolveImageUrl(path: string | null): string | null {
  if (!path) return null
  return `${API_URL}${path}`
}
