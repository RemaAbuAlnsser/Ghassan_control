import { useEffect, useState } from 'react'
import type { Product, ProductFormValues } from '../types/product'
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../api/products'
import { resolveImageUrl } from '../api/client'
import ProductFormModal from '../components/ProductFormModal'
import './CategoriesPage.css'

function formatPrice(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch {
      setError('تعذر تحميل المنتجات، تأكد أن السيرفر يعمل')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreateModal() {
    setEditingProduct(null)
    setModalOpen(true)
  }

  function openEditModal(product: Product) {
    setEditingProduct(product)
    setModalOpen(true)
  }

  async function handleSubmit(values: ProductFormValues) {
    if (editingProduct) {
      await updateProduct(editingProduct.id, values)
    } else {
      await createProduct(values)
    }
    setModalOpen(false)
    await load()
  }

  async function handleDelete(product: Product) {
    if (!confirm(`هل أنت متأكد من حذف "${product.name}"؟`)) return
    try {
      await deleteProduct(product.id)
      await load()
    } catch {
      alert('تعذر حذف المنتج')
    }
  }

  const normalizedSearch = search.trim().toLowerCase()
  const filteredProducts = normalizedSearch
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedSearch) ||
          p.sku.toLowerCase().includes(normalizedSearch),
      )
    : products

  return (
    <div className="categories-page">
      <header className="page-header">
        <h1>المنتجات</h1>
        <button className="btn primary" onClick={openCreateModal}>
          + إضافة منتج جديد
        </button>
      </header>

      {!loading && !error && products.length > 0 && (
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو كود المنتج (SKU)..."
          />
        </div>
      )}

      {loading && <p>جارٍ التحميل...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="empty-state">لا يوجد منتجات بعد، ابدأ بإضافة أول منتج.</p>
      )}

      {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
        <p className="empty-state">لا يوجد نتائج مطابقة لبحثك.</p>
      )}

      {!loading && filteredProducts.length > 0 && (
        <div className="table-wrapper">
          <table className="categories-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>الاسم</th>
                <th>SKU</th>
                <th>الشركة</th>
                <th>الصنف</th>
                <th>سعر جملة الضفة</th>
                <th>سعر جملة إسرائيل</th>
                <th>الكمية</th>
                <th>الكفالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.image ? (
                      <img
                        className="thumb"
                        src={resolveImageUrl(product.image)!}
                        alt={product.name}
                      />
                    ) : (
                      <div className="thumb placeholder" />
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.company.name}</td>
                  <td>
                    {product.category.name}
                    {product.subcategory ? ` ↳ ${product.subcategory.name}` : ''}
                  </td>
                  <td>{formatPrice(product.wholesalePriceWestBank)}</td>
                  <td>{formatPrice(product.wholesalePriceIsrael)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <span
                      className={product.hasWarranty ? 'status-badge active' : 'status-badge inactive'}
                    >
                      {product.hasWarranty ? `${product.warrantyMonths} شهر` : 'بدون'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn secondary" onClick={() => openEditModal(product)}>
                      تعديل
                    </button>
                    <button className="btn danger" onClick={() => handleDelete(product)}>
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
        <ProductFormModal
          product={editingProduct}
          onSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
