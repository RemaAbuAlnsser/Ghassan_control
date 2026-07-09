import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'
import logo from '../assets/logo.png'
import '../components/CategoryFormModal.css'
import './AdminLoginPage.css'

export default function AdminLoginPage() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('اسم المستخدم وكلمة السر مطلوبان')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await login(username.trim(), password.trim())
      navigate('/admin', { replace: true })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'تعذر تسجيل الدخول'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <img src={logo} alt="Ghassan Aljamal Company" className="admin-login-logo" />
        <h1>تسجيل دخول لوحة التحكم</h1>

        <label className="field">
          <span>اسم المستخدم</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
            autoFocus
          />
        </label>

        <label className="field">
          <span>كلمة السر</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة السر"
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn primary admin-login-submit" disabled={submitting}>
          {submitting ? 'جارٍ الدخول...' : 'دخول'}
        </button>
      </form>
    </div>
  )
}
