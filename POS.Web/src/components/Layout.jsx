import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Modal from './Modal'

const navLinks = [
  { to: '/',           label: '📊 Dashboard'  },
  { to: '/pos',        label: '🛒 New Sale'    },
  { to: '/sales',      label: '🧾 Sales'       },
  { to: '/products',   label: '📦 Products'   },
  { to: '/categories', label: '🗂 Categories'  },
  { to: '/suppliers',  label: '🚚 Suppliers'   },
  { to: '/customers',  label: '👤 Customers'   },
]

function getUserIdFromToken(token) {
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.userId
  } catch {
    return null
  }
}

export default function Layout() {
  const { logout, token, businessName } = useAuth()
  const navigate = useNavigate()

  const [showModal, setShowModal]       = useState(false)
  const [newPassword, setNewPassword]   = useState('')
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  async function handleChangePassword() {
    if (!newPassword.trim() || newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const userId = getUserIdFromToken(token)
      await api.put(`/User/${userId}/change-password`, { newPassword })
      setSuccess(true)
      setNewPassword('')
      setTimeout(() => {
        setSuccess(false)
        setShowModal(false)
      }, 2000)
    } catch {
      setError('Failed to change password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-teal-900 text-white flex flex-col">

        <div className="px-6 py-5 border-b border-teal-700">
          <h1 className="text-xl font-bold tracking-wide">🏪 Meraj-POS</h1>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-teal-600 text-white' : 'text-teal-100 hover:bg-teal-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-teal-700 space-y-1">
          <button
            onClick={() => { setShowModal(true); setError(''); setSuccess(false) }}
            className="w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-teal-100 hover:bg-teal-800 transition"
          >
            🔑 Change Password
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-teal-100 hover:bg-red-600 hover:text-white transition"
          >
            🚪 Logout
          </button>
        </div>

      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-700 font-semibold text-lg">{businessName || 'Welcome back 👋'}</h2>
          <span className="text-sm text-gray-400">Meraj POS Management System</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

      {/* Change Password Modal */}
      {showModal && (
        <Modal title="🔑 Change Password" onClose={() => setShowModal(false)}>
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Min. 6 characters"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
                ✅ Password changed successfully!
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition"
              >
                {saving ? 'Saving...' : 'Change Password'}
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  )
}