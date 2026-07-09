import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import defaultLogo from '../assets/logo.png'
import { fetchDashboardStats } from '../api/dashboard'
import { useTheme } from '../context/ThemeContext'
import { useSettings } from '../context/SettingsContext'
import { useAdminAuth } from '../context/AdminAuthContext'
import { resolveImageUrl } from '../api/client'
import './DashboardLayout.css'

const navItems = [
  { to: '/admin', label: 'الرئيسية', end: true },
  { to: '/admin/categories', label: 'الأصناف' },
  { to: '/admin/companies', label: 'الشركات' },
  { to: '/admin/merchants', label: 'تجار الجملة' },
  { to: '/admin/products', label: 'المنتجات' },
  { to: '/admin/orders', label: 'الطلبات' },
  { to: '/admin/settings', label: 'الإعدادات' },
  { to: '/admin/users', label: 'المستخدمين' },
]

const PENDING_ORDERS_POLL_MS = 20000

export default function DashboardLayout() {
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { settings } = useSettings()
  const { session, logout } = useAdminAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const logo = resolveImageUrl(settings?.logo ?? null) ?? defaultLogo

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  useEffect(() => {
    let cancelled = false

    function poll() {
      fetchDashboardStats()
        .then((stats) => {
          if (!cancelled) setPendingOrdersCount(stats.pendingOrdersCount)
        })
        .catch(() => undefined)
    }

    poll()
    const interval = setInterval(poll, PENDING_ORDERS_POLL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  return (
    <div className="dashboard">
      <header className="mobile-topbar">
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileNavOpen(true)}
          aria-label="فتح القائمة"
        >
          ☰
        </button>
        <img className="mobile-topbar-logo" src={logo} alt="Ghassan Aljamal Company" />
        {pendingOrdersCount > 0 && <span className="nav-badge">{pendingOrdersCount}</span>}
      </header>

      {mobileNavOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileNavOpen(false)} />
      )}

      <aside className={mobileNavOpen ? 'sidebar open' : 'sidebar'}>
        <button
          className="mobile-nav-close"
          onClick={() => setMobileNavOpen(false)}
          aria-label="إغلاق القائمة"
        >
          ×
        </button>
        <div className="sidebar-brand">
          <img src={logo} alt="Ghassan Aljamal Company" />
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
              {item.to === '/admin/orders' && pendingOrdersCount > 0 && (
                <span className="nav-badge">{pendingOrdersCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {session && <div className="sidebar-username">{session.admin.username}</div>}

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ الوضع الصباحي' : '🌙 الوضع الليلي'}
        </button>

        <button className="theme-toggle logout-btn" onClick={handleLogout}>
          تسجيل خروج
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
