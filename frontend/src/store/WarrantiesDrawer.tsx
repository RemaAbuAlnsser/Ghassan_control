import { useEffect, useState } from 'react'
import type { Order } from '../types/order'
import { fetchMyOrders } from '../api/orders'
import { resolveImageUrl } from '../api/client'
import './WarrantiesDrawer.css'

interface WarrantyEntry {
  key: string
  productName: string
  image: string | null
  purchaseDate: Date
  warrantyMonths: number
  expiryDate: Date
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ar-EG', { dateStyle: 'medium' })
}

function calendarDiff(earlier: Date, later: Date): { months: number; days: number } {
  let months = (later.getFullYear() - earlier.getFullYear()) * 12 + (later.getMonth() - earlier.getMonth())
  let days = later.getDate() - earlier.getDate()

  if (days < 0) {
    months -= 1
    const daysInPrevMonth = new Date(later.getFullYear(), later.getMonth(), 0).getDate()
    days += daysInPrevMonth
  }

  return { months, days }
}

function countdownParts(target: Date): { months: number; days: number; expired: boolean } {
  const now = new Date()
  const expired = target.getTime() < now.getTime()
  const [earlier, later] = expired ? [target, now] : [now, target]
  return { ...calendarDiff(earlier, later), expired }
}

interface Props {
  onClose: () => void
}

export default function WarrantiesDrawer({ onClose }: Props) {
  const [entries, setEntries] = useState<WarrantyEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMyOrders()
      .then((orders: Order[]) => {
        const list: WarrantyEntry[] = []
        for (const order of orders) {
          if (order.status !== 'completed') continue
          for (const item of order.items) {
            if (!item.hasWarranty || !item.warrantyMonths) continue
            const purchaseDate = new Date(order.createdAt)
            list.push({
              key: `${order.id}-${item.id}`,
              productName: item.productName,
              image: item.product?.image ?? null,
              purchaseDate,
              warrantyMonths: item.warrantyMonths,
              expiryDate: addMonths(purchaseDate, item.warrantyMonths),
            })
          }
        }
        list.sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime())
        setEntries(list)
      })
      .catch(() => setError('تعذر تحميل الكفالات'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="warranties-overlay" onClick={onClose}>
      <aside className="warranties-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="warranties-header">
          <h2>الكفالات</h2>
          <button className="warranties-close" onClick={onClose} aria-label="إغلاق">
            ×
          </button>
        </div>

        {loading && <p>جارٍ التحميل...</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && entries.length === 0 && (
          <p className="warranties-empty">لا يوجد منتجات مكفولة ضمن طلباتك المكتملة.</p>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="warranties-list">
            {entries.map((entry) => {
              const { months, days, expired } = countdownParts(entry.expiryDate)
              return (
                <div key={entry.key} className="warranty-item">
                  {entry.image ? (
                    <img
                      className="warranty-item-image"
                      src={resolveImageUrl(entry.image)!}
                      alt={entry.productName}
                    />
                  ) : (
                    <div className="warranty-item-image placeholder" />
                  )}
                  <div className="warranty-item-body">
                    <h3>{entry.productName}</h3>
                    <p className="warranty-item-meta">
                      تاريخ الشراء: {formatDate(entry.purchaseDate)} · الكفالة {entry.warrantyMonths} شهر
                    </p>
                    <span className={expired ? 'warranty-badge expired' : 'warranty-badge active'}>
                      {expired
                        ? `انتهت الكفالة منذ ${months} شهر و ${days} يوم`
                        : `متبقي ${months} شهر و ${days} يوم`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </aside>
    </div>
  )
}
