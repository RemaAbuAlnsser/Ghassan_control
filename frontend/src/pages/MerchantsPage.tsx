import { useEffect, useState } from 'react'
import type { Merchant, MerchantFormValues } from '../types/merchant'
import {
  createMerchant,
  deleteMerchant,
  fetchMerchants,
  setMerchantActive,
  updateMerchant,
} from '../api/merchants'
import MerchantFormModal from '../components/MerchantFormModal'
import './CategoriesPage.css'

const regionLabels: Record<Merchant['region'], string> = {
  west_bank: 'الضفة',
  israel: 'إسرائيل',
}

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null)
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMerchants()
      setMerchants(data)
    } catch {
      setError('تعذر تحميل تجار الجملة، تأكد أن السيرفر يعمل')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreateModal() {
    setEditingMerchant(null)
    setModalOpen(true)
  }

  function openEditModal(merchant: Merchant) {
    setEditingMerchant(merchant)
    setModalOpen(true)
  }

  async function handleSubmit(values: MerchantFormValues) {
    if (editingMerchant) {
      await updateMerchant(editingMerchant.id, values)
    } else {
      await createMerchant(values)
    }
    setModalOpen(false)
    await load()
  }

  async function handleDelete(merchant: Merchant) {
    if (!confirm(`هل أنت متأكد من حذف "${merchant.name}"؟`)) return
    try {
      await deleteMerchant(merchant.id)
      await load()
    } catch {
      alert('تعذر حذف تاجر الجملة')
    }
  }

  async function handleToggleActive(merchant: Merchant) {
    try {
      await setMerchantActive(merchant.id, !merchant.isActive)
      await load()
    } catch {
      alert('تعذر تغيير حالة الحساب')
    }
  }

  const normalizedSearch = search.trim().toLowerCase()
  const filteredMerchants = normalizedSearch
    ? merchants.filter(
        (m) =>
          m.name.toLowerCase().includes(normalizedSearch) || m.phone.includes(normalizedSearch),
      )
    : merchants

  return (
    <div className="categories-page">
      <header className="page-header">
        <h1>تجار الجملة</h1>
        <button className="btn primary" onClick={openCreateModal}>
          + إضافة تاجر جملة
        </button>
      </header>

      {!loading && !error && merchants.length > 0 && (
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الرقم..."
          />
        </div>
      )}

      {loading && <p>جارٍ التحميل...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && merchants.length === 0 && (
        <p className="empty-state">لا يوجد تجار جملة بعد، ابدأ بإضافة أول تاجر.</p>
      )}

      {!loading && !error && merchants.length > 0 && filteredMerchants.length === 0 && (
        <p className="empty-state">لا يوجد نتائج مطابقة لبحثك.</p>
      )}

      {!loading && filteredMerchants.length > 0 && (
        <div className="table-wrapper">
          <table className="categories-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>العنوان</th>
                <th>الرقم</th>
                <th>المنطقة</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredMerchants.map((merchant) => (
                <tr key={merchant.id}>
                  <td>{merchant.name}</td>
                  <td>{merchant.address}</td>
                  <td>{merchant.phone}</td>
                  <td>{regionLabels[merchant.region]}</td>
                  <td>
                    <span className={merchant.isActive ? 'status-badge active' : 'status-badge inactive'}>
                      {merchant.isActive ? 'فعال' : 'معطل'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn secondary" onClick={() => handleToggleActive(merchant)}>
                      {merchant.isActive ? 'تعطيل' : 'تفعيل'}
                    </button>
                    <button className="btn secondary" onClick={() => openEditModal(merchant)}>
                      تعديل
                    </button>
                    <button className="btn danger" onClick={() => handleDelete(merchant)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <MerchantFormModal
          merchant={editingMerchant}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
