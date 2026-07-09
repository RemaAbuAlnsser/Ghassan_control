import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMerchantAuth } from '../context/MerchantAuthContext'
import '../components/CategoryFormModal.css'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function MerchantLoginModal({ onClose, onSuccess }: Props) {
  const { login } = useMerchantAuth()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!phone.trim() || !password.trim()) {
      setError('رقم الهاتف وكلمة السر مطلوبان')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await login(phone.trim(), password.trim())
      onSuccess()
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>تسجيل دخول كتاجر جملة</h2>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>رقم الهاتف</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم الهاتف"
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

          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose} disabled={submitting}>
              إلغاء
            </button>
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? 'جارٍ الدخول...' : 'دخول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
