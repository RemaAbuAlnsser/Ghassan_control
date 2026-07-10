import { useEffect, useState } from 'react'
import type { Partner, PartnerFormValues } from '../types/partner'
import { createPartner, deletePartner, fetchPartners, updatePartner } from '../api/partners'
import { resolveImageUrl } from '../api/client'
import PartnerFormModal from '../components/PartnerFormModal'
import './CategoriesPage.css'

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPartners()
      setPartners(data)
    } catch {
      setError('تعذر تحميل المحلات، تأكد أن السيرفر يعمل')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreateModal() {
    setEditingPartner(null)
    setModalOpen(true)
  }

  function openEditModal(partner: Partner) {
    setEditingPartner(partner)
    setModalOpen(true)
  }

  async function handleSubmit(values: PartnerFormValues) {
    if (editingPartner) {
      await updatePartner(editingPartner.id, values)
    } else {
      await createPartner(values)
    }
    setModalOpen(false)
    await load()
  }

  async function handleDelete(partner: Partner) {
    if (!confirm(`هل أنت متأكد من حذف "${partner.name}"؟`)) return
    try {
      await deletePartner(partner.id)
      await load()
    } catch {
      alert('تعذر حذف المحل')
    }
  }

  return (
    <div className="categories-page">
      <header className="page-header">
        <h1>تعاملت مع</h1>
        <button className="btn primary" onClick={openCreateModal}>
          + إضافة محل
        </button>
      </header>

      {loading && <p>جارٍ التحميل...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && partners.length === 0 && (
        <p className="empty-state">لا يوجد محلات بعد، ابدأ بإضافة أول محل.</p>
      )}

      {!loading && partners.length > 0 && (
        <div className="table-wrapper">
          <table className="categories-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>اسم المحل</th>
                <th>ملاحظة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner.id}>
                  <td>
                    {partner.image ? (
                      <img
                        className="thumb"
                        src={resolveImageUrl(partner.image)!}
                        alt={partner.name}
                      />
                    ) : (
                      <div className="thumb placeholder" />
                    )}
                  </td>
                  <td>{partner.name}</td>
                  <td className="description-cell">{partner.note || '—'}</td>
                  <td className="actions-cell">
                    <button className="btn secondary" onClick={() => openEditModal(partner)}>
                      تعديل
                    </button>
                    <button className="btn danger" onClick={() => handleDelete(partner)}>
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
        <PartnerFormModal
          partner={editingPartner}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
