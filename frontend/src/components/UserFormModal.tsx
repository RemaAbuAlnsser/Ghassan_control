import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { User, UserFormValues } from '../types/user'
import './CategoryFormModal.css'

interface Props {
  user: User | null
  onSubmit: (values: UserFormValues) => Promise<void>
  onClose: () => void
}

export default function UserFormModal({ user, onSubmit, onClose }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setUsername(user?.username ?? '')
    setPassword('')
  }, [user])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!username.trim()) {
      setError('اسم المستخدم مطلوب')
      return
    }
    if (!user && password.trim().length < 6) {
      setError('كلمة السر يجب أن تكون 6 أحرف على الأقل')
      return
    }
    if (user && password.trim() && password.trim().length < 6) {
      setError('كلمة السر يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ username: username.trim(), password: password.trim() })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'حدث خطأ أثناء الحفظ'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{user ? 'تعديل مستخدم' : 'إضافة مستخدم'}</h2>
        <form onSubmit={handleSubmit}>
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
            <span>{user ? 'كلمة سر جديدة (اختياري)' : 'كلمة السر'}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={user ? 'اتركها فارغة لعدم التغيير' : 'كلمة السر'}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose} disabled={submitting}>
              إلغاء
            </button>
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? 'جارٍ الحفظ...' : 'حفظ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
