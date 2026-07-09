import { useEffect, useState } from 'react'
import type { Company, CompanyFormValues } from '../types/company'
import { createCompany, deleteCompany, fetchCompanies, updateCompany } from '../api/companies'
import { resolveImageUrl } from '../api/client'
import CompanyFormModal from '../components/CompanyFormModal'
import './CategoriesPage.css'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCompanies()
      setCompanies(data)
    } catch {
      setError('تعذر تحميل الشركات، تأكد أن السيرفر يعمل')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreateModal() {
    setEditingCompany(null)
    setModalOpen(true)
  }

  function openEditModal(company: Company) {
    setEditingCompany(company)
    setModalOpen(true)
  }

  async function handleSubmit(values: CompanyFormValues) {
    if (editingCompany) {
      await updateCompany(editingCompany.id, values)
    } else {
      await createCompany(values)
    }
    setModalOpen(false)
    await load()
  }

  async function handleDelete(company: Company) {
    if (!confirm(`هل أنت متأكد من حذف "${company.name}"؟`)) return
    try {
      await deleteCompany(company.id)
      await load()
    } catch {
      alert('تعذر حذف الشركة')
    }
  }

  return (
    <div className="categories-page">
      <header className="page-header">
        <h1>الشركات</h1>
        <button className="btn primary" onClick={openCreateModal}>
          + إضافة شركة
        </button>
      </header>

      {loading && <p>جارٍ التحميل...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && companies.length === 0 && (
        <p className="empty-state">لا يوجد شركات بعد، ابدأ بإضافة أول شركة.</p>
      )}

      {!loading && companies.length > 0 && (
        <div className="table-wrapper">
          <table className="categories-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>الاسم</th>
                <th>ملاحظة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>
                    {company.image ? (
                      <img
                        className="thumb"
                        src={resolveImageUrl(company.image)!}
                        alt={company.name}
                      />
                    ) : (
                      <div className="thumb placeholder" />
                    )}
                  </td>
                  <td>{company.name}</td>
                  <td className="description-cell">{company.note || '—'}</td>
                  <td className="actions-cell">
                    <button className="btn secondary" onClick={() => openEditModal(company)}>
                      تعديل
                    </button>
                    <button className="btn danger" onClick={() => handleDelete(company)}>
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
        <CompanyFormModal
          company={editingCompany}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
