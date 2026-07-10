import { Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import CategoriesPage from './pages/CategoriesPage'
import CompaniesPage from './pages/CompaniesPage'
import PartnersPage from './pages/PartnersPage'
import MerchantsPage from './pages/MerchantsPage'
import ProductsPage from './pages/ProductsPage'
import OrdersPage from './pages/OrdersPage'
import SettingsPage from './pages/SettingsPage'
import UsersPage from './pages/UsersPage'
import AdminLoginPage from './pages/AdminLoginPage'
import RequireAdminAuth from './components/RequireAdminAuth'
import StorePage from './store/StorePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<RequireAdminAuth />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="merchants" element={<MerchantsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
