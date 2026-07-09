import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function RequireAdminAuth() {
  const { session } = useAdminAuth()

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
