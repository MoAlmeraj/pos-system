import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    businessName: '', businessEmail: '', businessPhone: '',
    adminName: '', adminEmail: '', adminPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await api.post('/Auth/register', form)
      login(response.data.token, response.data.tenantName)
      navigate('/')
    } catch {
      setError('Registration failed. Email may already be in use.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        <div className="bg-teal-600 px-8 py-6 text-center">
          <div className="text-4xl mb-2">🏪</div>
          <h1 className="text-2xl font-bold text-white">POS System</h1>
          <p className="text-teal-100 text-sm mt-1">Create your account</p>
        </div>

        <div className="px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide">Business Info</p>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Business Name <span className="text-red-400">*</span></label>
              <input name="businessName" value={form.businessName} onChange={handleChange} autoComplete="off"
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                placeholder="e.g. Meraj Store" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Business Email <span className="text-red-400">*</span></label>
              <input name="businessEmail" type="email" value={form.businessEmail} onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                placeholder="business@example.com" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Business Phone</label>
              <input name="businessPhone" value={form.businessPhone} onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                placeholder="+966 5xxxxxxxx" />
            </div>

            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide pt-2">Admin Account</p>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Your Name <span className="text-red-400">*</span></label>
              <input name="adminName" value={form.adminName} onChange={handleChange} autoComplete="off"
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                placeholder="Your full name" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Admin Email <span className="text-red-400">*</span></label>
              <input name="adminEmail" type="email" value={form.adminEmail} onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                placeholder="admin@example.com" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password <span className="text-red-400">*</span></label>
              <input name="adminPassword" type="password" value={form.adminPassword} onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                placeholder="••••••••" required />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition shadow-md">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

          </form>
        </div>

        <div className="px-8 pb-6 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>

      </div>
    </div>
  )
}