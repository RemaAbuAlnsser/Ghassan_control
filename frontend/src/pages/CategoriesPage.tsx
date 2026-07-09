import { Fragment, useEffect, useState } from 'react'
import type { Category, CategoryFormValues, Subcategory, SubcategoryFormValues } from '../types/category'
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../api/categories'
import { createSubcategory, deleteSubcategory, updateSubcategory } from '../api/subcategories'
import { resolveImageUrl } from '../api/client'
import CategoryFormModal from '../components/CategoryFormModal'
import SubcategoryFormModal from '../components/SubcategoryFormModal'
import './CategoriesPage.css'

type SubcategoryModalState = {
  category: Category
  subcategory: Subcategory | null
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [subcategoryModal, setSubcategoryModal] = useState<SubcategoryModalState | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  function toggleExpanded(categoryId: number) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  function expand(categoryId: number) {
    setExpandedIds((prev) => new Set(prev).add(categoryId))
  }

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCategories()
      setCategories(data)
    } catch {
      setError('تعذر تحميل الأصناف، تأكد أن السيرفر يعمل')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreateCategoryModal() {
    setEditingCategory(null)
    setCategoryModalOpen(true)
  }

  function openEditCategoryModal(category: Category) {
    setEditingCategory(category)
    setCategoryModalOpen(true)
  }

  async function handleCategorySubmit(values: CategoryFormValues) {
    if (editingCategory) {
      await updateCategory(editingCategory.id, values)
    } else {
      await createCategory(values)
    }
    setCategoryModalOpen(false)
    await load()
  }

  async function handleDeleteCategory(category: Category) {
    if (category.subcategories.length > 0) {
      alert('لا يمكن حذف صنف يحتوي على أصناف فرعية، احذف الأصناف الفرعية أولاً')
      return
    }
    if (!confirm(`هل أنت متأكد من حذف "${category.name}"؟`)) return
    try {
      await deleteCategory(category.id)
      await load()
    } catch {
      alert('تعذر حذف الصنف')
    }
  }

  async function handleSubcategorySubmit(values: SubcategoryFormValues) {
    if (!subcategoryModal) return
    if (subcategoryModal.subcategory) {
      await updateSubcategory(subcategoryModal.subcategory.id, values)
    } else {
      await createSubcategory(values)
    }
    expand(subcategoryModal.category.id)
    setSubcategoryModal(null)
    await load()
  }

  async function handleDeleteSubcategory(subcategory: Subcategory) {
    if (!confirm(`هل أنت متأكد من حذف "${subcategory.name}"؟`)) return
    try {
      await deleteSubcategory(subcategory.id)
      await load()
    } catch {
      alert('تعذر حذف الصنف الفرعي')
    }
  }

  return (
    <div className="categories-page">
      <header className="page-header">
        <h1>الأصناف</h1>
        <button className="btn primary" onClick={openCreateCategoryModal}>
          + إضافة صنف جديد
        </button>
      </header>

      {loading && <p>جارٍ التحميل...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && categories.length === 0 && (
        <p className="empty-state">لا يوجد أصناف بعد، ابدأ بإضافة أول صنف.</p>
      )}

      {!loading && categories.length > 0 && (
        <div className="table-wrapper">
          <table className="categories-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>الاسم</th>
                <th>الوصف</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <Fragment key={category.id}>
                  <tr className="category-row">
                    <td>
                      {category.image ? (
                        <img
                          className="thumb"
                          src={resolveImageUrl(category.image)!}
                          alt={category.name}
                        />
                      ) : (
                        <div className="thumb placeholder" />
                      )}
                    </td>
                    <td>
                      <span className="name-cell">
                        {category.subcategories.length > 0 ? (
                          <button
                            type="button"
                            className={
                              expandedIds.has(category.id) ? 'expand-toggle expanded' : 'expand-toggle'
                            }
                            onClick={() => toggleExpanded(category.id)}
                            aria-label="إظهار/إخفاء الأصناف الفرعية"
                          >
                            ▸
                          </button>
                        ) : (
                          <span className="expand-toggle-spacer" />
                        )}
                        {category.name}
                      </span>
                    </td>
                    <td className="description-cell">{category.description || '—'}</td>
                    <td className="actions-cell">
                      <button
                        className="btn secondary"
                        onClick={() => setSubcategoryModal({ category, subcategory: null })}
                      >
                        + إضافة صنف فرعي
                      </button>
                      <button className="btn secondary" onClick={() => openEditCategoryModal(category)}>
                        تعديل
                      </button>
                      <button className="btn danger" onClick={() => handleDeleteCategory(category)}>
                        حذف
                      </button>
                    </td>
                  </tr>
                  {expandedIds.has(category.id) && category.subcategories.map((sub) => (
                    <tr key={`sub-${sub.id}`} className="subcategory-row">
                      <td>
                        {sub.image ? (
                          <img className="thumb" src={resolveImageUrl(sub.image)!} alt={sub.name} />
                        ) : (
                          <div className="thumb placeholder" />
                        )}
                      </td>
                      <td>
                        <span className="subcategory-name">↳ {sub.name}</span>
                      </td>
                      <td className="description-cell">{sub.description || '—'}</td>
                      <td className="actions-cell">
                        <button
                          className="btn secondary"
                          onClick={() => setSubcategoryModal({ category, subcategory: sub })}
                        >
                          تعديل
                        </button>
                        <button className="btn danger" onClick={() => handleDeleteSubcategory(sub)}>
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {categoryModalOpen && (
        <CategoryFormModal
          category={editingCategory}
          onSubmit={handleCategorySubmit}
          onClose={() => setCategoryModalOpen(false)}
        />
      )}

      {subcategoryModal && (
        <SubcategoryFormModal
          category={subcategoryModal.category}
          subcategory={subcategoryModal.subcategory}
          onSubmit={handleSubcategorySubmit}
          onClose={() => setSubcategoryModal(null)}
        />
      )}
    </div>
  )
}
