import { useEffect, useState } from 'react'
import type { Order } from '../types/order'
import { deleteOrder, fetchOrders, updateOrderStatus } from '../api/orders'
import './CategoriesPage.css'
import './OrdersPage.css'

const regionLabels: Record<string, string> = {
  west_bank: 'الضفة',
  israel: 'إسرائيل',
}

function formatMoney(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchOrders()
      setOrders(data)
    } catch {
      setError('تعذر تحميل الطلبات، تأكد أن السيرفر يعمل')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleToggleStatus(order: Order) {
    try {
      await updateOrderStatus(order.id, order.status === 'pending' ? 'completed' : 'pending')
      await load()
    } catch {
      alert('تعذر تحديث حالة الطلب')
    }
  }

  async function handleDelete(order: Order) {
    if (!confirm(`هل أنت متأكد من حذف الطلب #${order.id}؟`)) return
    try {
      await deleteOrder(order.id)
      await load()
    } catch {
      alert('تعذر حذف الطلب')
    }
  }

  return (
    <div className="categories-page">
      <header className="page-header">
        <h1>الطلبات</h1>
      </header>

      {loading && <p>جارٍ التحميل...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="empty-state">لا يوجد طلبات بعد.</p>
      )}

      {!loading && orders.length > 0 && (
        <div className="table-wrapper">
          <table className="categories-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>التاجر</th>
                <th>المنطقة</th>
                <th>المنتجات</th>
                <th>الإجمالي</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.merchant.name}</td>
                  <td>{regionLabels[order.merchant.region]}</td>
                  <td>
                    <button className="btn secondary" onClick={() => setDetailsOrder(order)}>
                      {order.items.length} منتج
                    </button>
                  </td>
                  <td>{formatMoney(order.total)}</td>
                  <td>
                    <span
                      className={order.status === 'completed' ? 'status-badge active' : 'status-badge inactive'}
                    >
                      {order.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                    </span>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td className="actions-cell">
                    <button className="btn secondary" onClick={() => handleToggleStatus(order)}>
                      {order.status === 'completed' ? 'إعادة لقيد الانتظار' : 'وضع علامة مكتمل'}
                    </button>
                    <button className="btn danger" onClick={() => handleDelete(order)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detailsOrder && (
        <div className="modal-overlay" onClick={() => setDetailsOrder(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>تفاصيل الطلب #{detailsOrder.id}</h2>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>المنتج</th>
                  <th>الكمية</th>
                  <th>سعر الوحدة</th>
                  <th>الإجمالي الفرعي</th>
                </tr>
              </thead>
              <tbody>
                {detailsOrder.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{formatMoney(item.unitPrice)}</td>
                    <td>{formatMoney(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="order-details-total">
              <span>الإجمالي الكلي</span>
              <span>{formatMoney(detailsOrder.total)}</span>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setDetailsOrder(null)}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
