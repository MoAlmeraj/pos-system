import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', newPassword: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/Auth/reset-password', form)
      navigate('/login')
    } catch {
      setError('Email not found. Please check and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        <div className="bg-teal-600 px-8 py-8 text-center">
          <div className="text-5xl mb-3">🔑</div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-teal-100 text-sm mt-1">Enter your email and a new password</p>
        </div>

        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
              <input
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                placeholder="Min. 6 characters"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition shadow-md"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

          </form>
        </div>

        <div className="px-8 pb-6 text-center">
          <p className="text-gray-500 text-sm">
            Remember your password?{' '}
            <Link to="/login" className="text-teal-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>

      </div>
    </div>
  )
}