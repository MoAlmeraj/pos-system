import { useEffect, useState } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [saving, setSaving]       = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ name: '', phone: '', email: '', balance: '' })

  async function fetchCustomers() {
    try {
      const res = await api.get('/Customer')
      setCustomers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCustomers() }, [])

  function openAdd() {
    setEditing(null)
    setForm({ name: '', phone: '', email: '', balance: '' })
    setShowModal(true)
  }

  function openEdit(customer) {
    setEditing(customer)
    setForm({
      name:    customer.name,
      phone:   customer.phone || '',
      email:   customer.email || '',
      balance: customer.balance.toString(),
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditing(null)
    setForm({ name: '', phone: '', email: '', balance: '' })
    setError('')
 }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    setError('')
    try {
        const payload = {
        name:    form.name.trim(),
        phone:   form.phone.trim()  || null,
        email:   form.email.trim()  || null,
        balance: parseFloat(form.balance) || 0,
        }
        if (editing) {
        await api.put(`/Customer/${editing.id}`, payload)
        } else {
        await api.post('/Customer', payload)
        }
        await fetchCustomers()
        closeModal()
    } catch (err) {
        setError(err.response?.data?.title || 'Something went wrong.')
    } finally {
        setSaving(false)
    }
}

  async function handleDelete(id) {
    if (!confirm('Delete this customer?')) return
    try {
      await api.delete(`/Customer/${id}`)
      await fetchCustomers()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <button
          onClick={openAdd}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition"
        >
          + Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">#</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Phone</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Balance</th>
              <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">No customers yet.</td>
              </tr>
            ) : (
              customers.map((c, index) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{c.name}</td>
                  <td className="px-6 py-4 text-gray-500">{c.phone || '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{c.email || '—'}</td>
                  <td className="px-6 py-4 font-semibold text-teal-600">${c.balance.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEdit(c)} className="text-teal-600 hover:text-teal-800 font-medium">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Customer' : 'Add Customer'} onClose={closeModal}>
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name <span className="text-red-400">*</span></label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="+966 5xxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="customer@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Balance</label>
              <input
                name="balance"
                type="number"
                min="0"
                step="0.01"
                value={form.balance}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0.00"
              />
            </div>
            {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
            </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  )
}