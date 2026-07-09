import { adminApiClient } from './client'
import type { User, UserFormValues } from '../types/user'

export async function fetchUsers(): Promise<User[]> {
  const { data } = await adminApiClient.get<User[]>('/users')
  return data
}

export async function createUser(values: UserFormValues): Promise<User> {
  const { data } = await adminApiClient.post<User>('/users', values)
  return data
}

export async function updateUser(id: number, values: Partial<UserFormValues>): Promise<User> {
  const { data } = await adminApiClient.patch<User>(`/users/${id}`, values)
  return data
}

export async function deleteUser(id: number): Promise<void> {
  await adminApiClient.delete(`/users/${id}`)
}
