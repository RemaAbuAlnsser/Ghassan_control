import { useEffect, useState } from 'react'
import type { DashboardStats } from '../types/dashboard'
import { fetchDashboardStats } from '../api/dashboard'
import './DashboardPage.css'

function formatMoney(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => setError('تعذر تحميل الإحصائيات'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="categories-page">
      <header className="page-header">
        <h1>الصفحة الرئيسية</h1>
      </header>

      {loading && <p>جارٍ التحميل...</p>}
      {error && <p className="form-error">{error}</p>}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">المبيعات</span>
            <span className="stat-value">{formatMoney(stats.totalSales)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">عدد الطلبات</span>
            <span className="stat-value">{stats.ordersCount}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">عدد المنتجات</span>
            <span className="stat-value">{stats.productsCount}</span>
          </div>
          <div className={stats.pendingOrdersCount > 0 ? 'stat-card highlight' : 'stat-card'}>
            <span className="stat-label">طلبات قيد الانتظار</span>
            <span className="stat-value">{stats.pendingOrdersCount}</span>
          </div>
        </div>
      )}
    </div>
  )
}
