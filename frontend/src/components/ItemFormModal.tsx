import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import './CategoryFormModal.css'

export interface ItemFormSubmitValues {
  name: string
  description: string
  image: File | null
}

interface Props {
  title: string
  namePlaceholder?: string
  descriptionLabel?: string
  descriptionPlaceholder?: string
  initialName?: string
  initialDescription?: string
  initialImageUrl?: string | null
  extraContent?: ReactNode
  onSubmit: (values: ItemFormSubmitValues) => Promise<void>
  onClose: () => void
}

export default function ItemFormModal({
  title,
  namePlaceholder = 'مثال: أجهزة قهوة',
  descriptionLabel = 'الوصف',
  descriptionPlaceholder = 'وصف مختصر',
  initialName = '',
  initialDescription = '',
  initialImageUrl = null,
  extraContent,
  onSubmit,
  onClose,
}: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setName(initialName)
    setDescription(initialDescription)
    setPreview(initialImageUrl)
    setImage(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialName, initialDescription, initialImageUrl])

  function handleImageChange(file: File | null) {
    setImage(file)
    setPreview(file ? URL.createObjectURL(file) : initialImageUrl)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('الاسم مطلوب')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ name: name.trim(), description: description.trim(), image })
    } catch {
      setError('حدث خطأ أثناء الحفظ، حاول مرة أخرى')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          {extraContent}

          <label className="field">
            <span>الاسم</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={namePlaceholder}
              autoFocus
            />
          </label>

          <label className="field">
            <span>{descriptionLabel}</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={descriptionPlaceholder}
              rows={3}
            />
          </label>

          <label className="field">
            <span>الصورة</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            />
          </label>

          {preview && (
            <div className="image-preview">
              <img src={preview} alt="معاينة الصورة" />
            </div>
          )}

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
