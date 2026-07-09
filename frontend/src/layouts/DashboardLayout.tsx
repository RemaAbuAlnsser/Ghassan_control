import { NavLink, Outlet } from 'react-router-dom'
import logo from '../assets/logo.png'
import './DashboardLayout.css'

const navItems = [{ to: '/categories', label: 'الأصناف' }]

export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Ghassan Aljamal Company" />
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
