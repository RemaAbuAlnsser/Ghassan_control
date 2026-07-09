export interface User {
  id: number
  username: string
  createdAt: string
  updatedAt: string
}

export interface UserFormValues {
  username: string
  password: string
}

export interface AdminSessionInfo {
  id: number
  username: string
}

export interface AdminSession {
  token: string
  admin: AdminSessionInfo
}
