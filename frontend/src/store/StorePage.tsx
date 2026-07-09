import { useEffect, useMemo, useState } from 'react'
import type { StoreProduct } from '../types/product'
import { fetchMerchantProducts, fetchPublicProducts } from '../api/products'
import { createOrder } from '../api/orders'
import { resolveImageUrl } from '../api/client'
import { useMerchantAuth } from '../context/MerchantAuthContext'
import { useSettings } from '../context/SettingsContext'
import { useTheme } from '../context/ThemeContext'
import MerchantLoginModal from './MerchantLoginModal'
import CartDrawer from './CartDrawer'
import type { CartLine } from './CartDrawer'
import WarrantiesDrawer from './WarrantiesDrawer'
import StoreHero from './StoreHero'
import StoreFooter from './StoreFooter'
import defaultLogo from '../assets/logo.png'
import './StorePage.css'

export default function StorePage() {
  const { session, logout } = useMerchantAuth()
  const { settings } = useSettings()
  const { theme, toggleTheme } = useTheme()
  const logo = resolveImageUrl(settings?.logo ?? null) ?? defaultLogo
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null)
  const [subcategoryFilter, setSubcategoryFilter] = useState<number | null>(null)

  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [warrantiesOpen, setWarrantiesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<CartLine[]>([])
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderSuccess, setOrderSuccess] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = session ? await fetchMerchantProducts() : await fetchPublicProducts()
      setProducts(data)
    } catch {
      setError('تعذر تحميل المنتجات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    setCart([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token])

  function addToCart(product: StoreProduct, quantity: number) {
    setCart((prev) => {
      const existing = prev.find((l) => l.product.id === product.id)
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, quantity: l.quantity + quantity } : l,
        )
      }
      return [...prev, { product, quantity }]
    })
    setCartOpen(true)
  }

  function updateCartQuantity(productId: number, quantity: number) {
    setCart((prev) => prev.map((l) => (l.product.id === productId ? { ...l, quantity } : l)))
  }

  function removeFromCart(productId: number) {
    setCart((prev) => prev.filter((l) => l.product.id !== productId))
  }

  async function submitOrder() {
    setOrderSubmitting(true)
    setOrderError(null)
    try {
      await createOrder(cart.map((l) => ({ productId: l.product.id, quantity: l.quantity })))
      setCart([])
      setCartOpen(false)
      setOrderSuccess(true)
      setTimeout(() => setOrderSuccess(false), 4000)
    } catch {
      setOrderError('تعذر إرسال الطلب، حاول مرة أخرى')
    } finally {
      setOrderSubmitting(false)
    }
  }

  function handleLogout() {
    logout()
    setCart([])
    setMobileMenuOpen(false)
  }

  const categoryOptions = useMemo(() => {
    const map = new Map<number, string>()
    for (const p of products) map.set(p.category.id, p.category.name)
    return Array.from(map, ([id, name]) => ({ id, name }))
  }, [products])

  const subcategoryOptions = useMemo(() => {
    const map = new Map<number, string>()
    for (const p of products) {
      if (p.subcategory && (categoryFilter === null || p.categoryId === categoryFilter)) {
        map.set(p.subcategory.id, p.subcategory.name)
      }
    }
    return Array.from(map, ([id, name]) => ({ id, name }))
  }, [products, categoryFilter])

  function handleCategoryFilterChange(id: number | null) {
    setCategoryFilter(id)
    setSubcategoryFilter(null)
  }

  const normalizedSearch = search.trim().toLowerCase()
  const filteredProducts = products.filter((p) => {
    if (normalizedSearch && !p.name.toLowerCase().includes(normalizedSearch)) return false
    if (categoryFilter !== null && p.categoryId !== categoryFilter) return false
    if (subcategoryFilter !== null && p.subcategoryId !== subcategoryFilter) return false
    return true
  })

  return (
    <div className="store-page">
      <header className="store-header">
        <img className="store-logo" src={logo} alt="Ghassan Aljamal Company" />

        <div className="store-header-search">
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن منتج..."
          />
        </div>

        <div className="store-header-actions">
          {session && (
            <button
              className="btn secondary menu-toggle-btn"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="القائمة"
              aria-expanded={mobileMenuOpen}
            >
              ☰
            </button>
          )}

          <div className={mobileMenuOpen ? 'header-menu open' : 'header-menu'}>
            <button className="btn secondary theme-toggle-btn" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {session && (
              <button
                className="btn secondary icon-btn cart-btn"
                onClick={() => {
                  setCartOpen(true)
                  setMobileMenuOpen(false)
                }}
                aria-label="السلة"
                title="السلة"
              >
                <svg
                  className="cart-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
              </button>
            )}

            {session && (
              <span className="store-merchant-info">مرحبا، {session.merchant.name}</span>
            )}

            {session && (
              <button
                className="btn secondary"
                onClick={() => {
                  setWarrantiesOpen(true)
                  setMobileMenuOpen(false)
                }}
              >
                الكفالات
              </button>
            )}

            {session && (
              <button className="btn secondary" onClick={handleLogout}>
                تسجيل خروج
              </button>
            )}
          </div>

          {!session && (
            <button className="btn primary login-btn" onClick={() => setLoginModalOpen(true)}>
              تسجيل دخول كتاجر جملة
            </button>
          )}
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {orderSuccess && <div className="store-toast">تم إرسال الطلب بنجاح</div>}

      <StoreHero />

      <main className="store-content" id="products">
        <h2>منتجاتنا</h2>

        {categoryOptions.length > 0 && (
          <div className="filter-pills">
            <button
              className={categoryFilter === null ? 'pill active' : 'pill'}
              onClick={() => handleCategoryFilterChange(null)}
            >
              الكل
            </button>
            {categoryOptions.map((c) => (
              <button
                key={c.id}
                className={categoryFilter === c.id ? 'pill active' : 'pill'}
                onClick={() => handleCategoryFilterChange(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {subcategoryOptions.length > 0 && (
          <div className="filter-pills subcategory-pills">
            <button
              className={subcategoryFilter === null ? 'pill small active' : 'pill small'}
              onClick={() => setSubcategoryFilter(null)}
            >
              الكل
            </button>
            {subcategoryOptions.map((s) => (
              <button
                key={s.id}
                className={subcategoryFilter === s.id ? 'pill small active' : 'pill small'}
                onClick={() => setSubcategoryFilter(s.id)}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}

        {loading && <p>جارٍ التحميل...</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="empty-state">لا يوجد نتائج مطابقة لبحثك.</p>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="store-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        )}
      </main>

      <StoreFooter />

      {loginModalOpen && (
        <MerchantLoginModal
          onClose={() => setLoginModalOpen(false)}
          onSuccess={() => setLoginModalOpen(false)}
        />
      )}

      {cartOpen && (
        <CartDrawer
          lines={cart}
          submitting={orderSubmitting}
          error={orderError}
          onUpdateQuantity={updateCartQuantity}
          onRemove={removeFromCart}
          onSubmit={submitOrder}
          onClose={() => setCartOpen(false)}
        />
      )}

      {warrantiesOpen && <WarrantiesDrawer onClose={() => setWarrantiesOpen(false)} />}
    </div>
  )
}

function ProductCard({
  product,
  onAdd,
}: {
  product: StoreProduct
  onAdd: (product: StoreProduct, quantity: number) => void
}) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        {product.image ? (
          <img className="product-card-image" src={resolveImageUrl(product.image)!} alt={product.name} />
        ) : (
          <div className="product-card-image placeholder" />
        )}
        {product.hasWarranty && <span className="product-card-badge">كفالة {product.warrantyMonths} شهر</span>}
      </div>

      <div className="product-card-body">
        <p className="product-card-meta">
          {product.category.name}
          {product.subcategory ? ` ↳ ${product.subcategory.name}` : ''}
        </p>
        <h3>{product.name}</h3>
        <p className="product-card-desc">{product.description || '—'}</p>
        <p className="product-card-company">{product.company.name}</p>

        <div className="product-card-footer">
          {product.price !== undefined ? (
            product.quantity > 0 ? (
              <>
                <div className="product-card-buy">
                  <span className="product-card-price">
                    {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    className="product-card-qty"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.min(product.quantity, Math.max(1, Number(e.target.value))))
                    }
                  />
                </div>
                <button className="btn primary product-card-add" onClick={() => onAdd(product, quantity)}>
                  أضف للسلة
                </button>
              </>
            ) : (
              <p className="product-card-out-of-stock">نفذت الكمية</p>
            )
          ) : (
            <p className="product-card-locked">سجل دخول كتاجر جملة لعرض السعر</p>
          )}
        </div>
      </div>
    </div>
  )
}
