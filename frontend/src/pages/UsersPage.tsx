import { useEffect, useState } from 'react'
import type { User, UserFormValues } from '../types/user'
import { createUser, deleteUser, fetchUsers, updateUser } from '../api/users'
import { useAdminAuth } from '../context/AdminAuthContext'
import UserFormModal from '../components/UserFormModal'
import './CategoriesPage.css'

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('ar-EG', { dateStyle: 'medium' })
}

export default function UsersPage() {
  const { session } = useAdminAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch {
      setError('تعذر تحميل المستخدمين')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreateModal() {
    setEditingUser(null)
    setModalOpen(true)
  }

  function openEditModal(user: User) {
    setEditingUser(user)
    setModalOpen(true)
  }

  async function handleSubmit(values: UserFormValues) {
    if (editingUser) {
      await updateUser(editingUser.id, values)
    } else {
      await createUser(values)
    }
    setModalOpen(false)
    await load()
  }

  async function handleDelete(user: User) {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${user.username}"؟`)) return
    try {
      await deleteUser(user.id)
      await load()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'تعذر حذف المستخدم'
      alert(message)
    }
  }

  return (
    <div className="categories-page">
      <header className="page-header">
        <h1>المستخدمين</h1>
        <button className="btn primary" onClick={openCreateModal}>
          + إضافة مستخدم
        </button>
      </header>

      {loading && <p>جارٍ التحميل...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && users.length > 0 && (
        <div className="table-wrapper">
          <table className="categories-table">
            <thead>
              <tr>
                <th>اسم المستخدم</th>
                <th>تاريخ الإنشاء</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.username}
                    {session?.admin.id === user.id && ' (أنت)'}
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td className="actions-cell">
                    <button className="btn secondary" onClick={() => openEditModal(user)}>
                      تعديل
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => handleDelete(user)}
                      disabled={session?.admin.id === user.id}
                    >
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
        <UserFormModal user={editingUser} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}
