import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Merchant, MerchantFormValues, MerchantRegion } from '../types/merchant'
import '../components/CategoryFormModal.css'

interface Props {
  merchant: Merchant | null
  onSubmit: (values: MerchantFormValues) => Promise<void>
  onClose: () => void
}

export default function MerchantFormModal({ merchant, onSubmit, onClose }: Props) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [region, setRegion] = useState<MerchantRegion>('west_bank')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setName(merchant?.name ?? '')
    setAddress(merchant?.address ?? '')
    setPhone(merchant?.phone ?? '')
    setRegion(merchant?.region ?? 'west_bank')
    setPassword('')
  }, [merchant])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !address.trim() || !phone.trim()) {
      setError('الاسم والعنوان والرقم كلها مطلوبة')
      return
    }
    if (!merchant && password.trim().length < 6) {
      setError('كلمة السر يجب أن تكون 6 أحرف على الأقل')
      return
    }
    if (merchant && password.trim() && password.trim().length < 6) {
      setError('كلمة السر يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
        region,
        password: password.trim(),
      })
    } catch {
      setError('حدث خطأ أثناء الحفظ، حاول مرة أخرى')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{merchant ? 'تعديل تاجر الجملة' : 'إضافة تاجر جملة'}</h2>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>الاسم</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسم تاجر الجملة"
              autoFocus
            />
          </label>

          <label className="field">
            <span>العنوان</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="العنوان"
            />
          </label>

          <label className="field">
            <span>الرقم</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم الهاتف"
            />
          </label>

          <label className="field">
            <span>المنطقة</span>
            <select value={region} onChange={(e) => setRegion(e.target.value as MerchantRegion)}>
              <option value="west_bank">الضفة</option>
              <option value="israel">إسرائيل</option>
            </select>
          </label>

          <label className="field">
            <span>{merchant ? 'كلمة سر جديدة (اختياري)' : 'كلمة السر'}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={merchant ? 'اتركها فارغة لعدم التغيير' : 'كلمة السر'}
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
