import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'


export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/Auth/login', { email, password })
      login(response.data.token, response.data.tenantName)
      navigate('/')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Top teal header */}
        <div className="bg-teal-600 px-8 py-8 text-center">
          <div className="text-5xl mb-3">🏪</div>
          <h1 className="text-2xl font-bold text-white">Meraj POS</h1>
          <p className="text-teal-100 text-sm mt-1">Point of Sale Management</p>
        </div>

        {/* Form section */}
        <div className="px-8 py-8">
          <h2 className="text-gray-700 font-semibold text-lg mb-6">Welcome back</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                placeholder="••••••••"
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
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition shadow-md hover:shadow-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 text-center space-y-2">
        <p className="text-gray-500 text-sm mb-2">
            <Link to="/forgot-password" className="text-teal-600 font-semibold hover:underline">
                Forgot your password?
            </Link>
        </p>
        <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-600 font-semibold hover:underline">Register</Link>
        </p>
        <p className="text-gray-400 text-xs">© 2025 POS System. All rights reserved.</p>
        </div>

      </div>
    </div>
  )
}