import type { StoreProduct } from '../types/product'
import { resolveImageUrl } from '../api/client'
import './CartDrawer.css'

export interface CartLine {
  product: StoreProduct
  quantity: number
}

interface Props {
  lines: CartLine[]
  submitting: boolean
  error: string | null
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
  onSubmit: () => void
  onClose: () => void
}

export default function CartDrawer({
  lines,
  submitting,
  error,
  onUpdateQuantity,
  onRemove,
  onSubmit,
  onClose,
}: Props) {
  const total = lines.reduce((sum, line) => sum + (line.product.price ?? 0) * line.quantity, 0)

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>سلة الطلبات</h2>
          <button className="cart-close" onClick={onClose} aria-label="إغلاق">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="cart-empty">السلة فارغة، أضف منتجات أولاً.</p>
        ) : (
          <div className="cart-lines">
            {lines.map((line) => (
              <div className="cart-line" key={line.product.id}>
                {line.product.image ? (
                  <img
                    className="cart-line-thumb"
                    src={resolveImageUrl(line.product.image)!}
                    alt={line.product.name}
                  />
                ) : (
                  <div className="cart-line-thumb placeholder" />
                )}
                <div className="cart-line-info">
                  <span className="cart-line-name">{line.product.name}</span>
                  <span className="cart-line-price">
                    {(line.product.price ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} × {line.quantity}
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  className="cart-line-qty"
                  value={line.quantity}
                  onChange={(e) => onUpdateQuantity(line.product.id, Math.max(1, Number(e.target.value)))}
                />
                <button className="cart-line-remove" onClick={() => onRemove(line.product.id)} aria-label="حذف">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="cart-footer">
          <div className="cart-total">
            <span>الإجمالي</span>
            <span>{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <button
            className="btn primary cart-submit"
            disabled={lines.length === 0 || submitting}
            onClick={onSubmit}
          >
            {submitting ? 'جارٍ إرسال الطلب...' : 'إرسال الطلب'}
          </button>
        </div>
      </aside>
    </div>
  )
}
