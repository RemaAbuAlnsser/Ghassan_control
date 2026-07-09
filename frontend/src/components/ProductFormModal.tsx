import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Product, ProductFormValues } from '../types/product'
import type { Category } from '../types/category'
import type { Company } from '../types/company'
import { fetchCategories } from '../api/categories'
import { fetchCompanies } from '../api/companies'
import { resolveImageUrl } from '../api/client'
import './CategoryFormModal.css'
import './ProductFormModal.css'

interface Props {
  product: Product | null
  onSubmit: (values: ProductFormValues) => Promise<void>
  onClose: () => void
}

export default function ProductFormModal({ product, onSubmit, onClose }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sku, setSku] = useState('')
  const [wholesaleWestBank, setWholesaleWestBank] = useState('')
  const [wholesaleIsrael, setWholesaleIsrael] = useState('')
  const [quantity, setQuantity] = useState('')
  const [hasWarranty, setHasWarranty] = useState(false)
  const [companyId, setCompanyId] = useState<number | null>(null)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [subcategoryId, setSubcategoryId] = useState<number | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([fetchCategories(), fetchCompanies()])
      .then(([cats, comps]) => {
        setCategories(cats)
        setCompanies(comps)
      })
      .finally(() => setLoadingOptions(false))
  }, [])

  useEffect(() => {
    setName(product?.name ?? '')
    setDescription(product?.description ?? '')
    setSku(product?.sku ?? '')
    setWholesaleWestBank(product ? String(product.wholesalePriceWestBank) : '')
    setWholesaleIsrael(product ? String(product.wholesalePriceIsrael) : '')
    setQuantity(product ? String(product.quantity) : '')
    setHasWarranty(product?.hasWarranty ?? false)
    setCompanyId(product?.companyId ?? null)
    setCategoryId(product?.categoryId ?? null)
    setSubcategoryId(product?.subcategoryId ?? null)
    setPreview(resolveImageUrl(product?.image ?? null))
    setImage(null)
  }, [product])

  const subcategoryOptions = useMemo(
    () => categories.find((c) => c.id === categoryId)?.subcategories ?? [],
    [categories, categoryId],
  )

  function handleCategoryChange(value: string) {
    const nextCategoryId = value ? Number(value) : null
    setCategoryId(nextCategoryId)
    setSubcategoryId(null)
  }

  function handleImageChange(file: File | null) {
    setImage(file)
    setPreview(file ? URL.createObjectURL(file) : resolveImageUrl(product?.image ?? null))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!name.trim() || !sku.trim()) {
      setError('اسم المنتج وكود المنتج (SKU) مطلوبان')
      return
    }
    if (!companyId || !categoryId) {
      setError('اختر الشركة والصنف')
      return
    }
    if (wholesaleWestBank === '' || wholesaleIsrael === '' || quantity === '') {
      setError('الأسعار والكمية مطلوبة')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        sku: sku.trim(),
        wholesalePriceWestBank: Number(wholesaleWestBank),
        wholesalePriceIsrael: Number(wholesaleIsrael),
        quantity: Number(quantity),
        hasWarranty,
        companyId,
        categoryId,
        subcategoryId,
        image,
      })
    } catch {
      setError('حدث خطأ أثناء الحفظ، تأكد أن كود المنتج (SKU) غير مستخدم')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal product-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{product ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>

        {loadingOptions ? (
          <p>جارٍ التحميل...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="field">
              <span>اسم المنتج</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: فرن كهربائي"
                autoFocus
              />
            </label>

            <label className="field">
              <span>الوصف</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف مختصر عن المنتج"
                rows={3}
              />
            </label>

            <label className="field">
              <span>كود المنتج (SKU)</span>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="مثال: OVEN-001"
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span>سعر جملة الضفة</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={wholesaleWestBank}
                  onChange={(e) => setWholesaleWestBank(e.target.value)}
                />
              </label>
              <label className="field">
                <span>سعر جملة إسرائيل</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={wholesaleIsrael}
                  onChange={(e) => setWholesaleIsrael(e.target.value)}
                />
              </label>
            </div>

            <label className="field">
              <span>الكمية</span>
              <input
                type="number"
                min="0"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </label>

            <label className="field">
              <span>الشركة</span>
              <select
                value={companyId ?? ''}
                onChange={(e) => setCompanyId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">اختر الشركة</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="field-row">
              <label className="field">
                <span>الصنف</span>
                <select value={categoryId ?? ''} onChange={(e) => handleCategoryChange(e.target.value)}>
                  <option value="">اختر الصنف</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>الصنف الفرعي</span>
                <select
                  value={subcategoryId ?? ''}
                  onChange={(e) => setSubcategoryId(e.target.value ? Number(e.target.value) : null)}
                  disabled={!categoryId || subcategoryOptions.length === 0}
                >
                  <option value="">بدون</option>
                  {subcategoryOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span>صورة المنتج</span>
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

            <label className="warranty-toggle">
              <input
                type="checkbox"
                checked={hasWarranty}
                onChange={(e) => setHasWarranty(e.target.checked)}
              />
              <span>تفعيل الكفالة</span>
              {hasWarranty && <span className="warranty-months">مدة الكفالة: 12 شهر</span>}
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
        )}
      </div>
    </div>
  )
}
