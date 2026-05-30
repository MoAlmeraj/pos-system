import { useEffect, useState } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [saving, setSaving]       = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ name: '', phone: '', email: '' })

  async function fetchSuppliers() {
    try {
      const res = await api.get('/Supplier')
      setSuppliers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSuppliers() }, [])

  function openAdd() {
    setEditing(null)
    setForm({ name: '', phone: '', email: '' })
    setShowModal(true)
  }

  function openEdit(supplier) {
    setEditing(supplier)
    setForm({ name: supplier.name, phone: supplier.phone || '', email: supplier.email || '' })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditing(null)
    setForm({ name: '', phone: '', email: '' })
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
        name:  form.name.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        }
        if (editing) {
        await api.put(`/Supplier/${editing.id}`, payload)
        } else {
        await api.post('/Supplier', payload)
        }
        await fetchSuppliers()
        closeModal()
    } catch (err) {
        setError(err.response?.data?.title || 'Something went wrong.')
    } finally {
        setSaving(false)
    }
    }

  async function handleDelete(id) {
    if (!confirm('Delete this supplier?')) return
    try {
      await api.delete(`/Supplier/${id}`)
      await fetchSuppliers()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
        <button
          onClick={openAdd}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition"
        >
          + Add Supplier
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
              <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">No suppliers yet.</td>
              </tr>
            ) : (
              suppliers.map((s, index) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{s.name}</td>
                  <td className="px-6 py-4 text-gray-500">{s.phone || '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{s.email || '—'}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEdit(s)} className="text-teal-600 hover:text-teal-800 font-medium">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Supplier' : 'Add Supplier'} onClose={closeModal}>
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name <span className="text-red-400">*</span></label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Supplier name"
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
                placeholder="supplier@example.com"
              />
            </div>
                 {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
            </div>
            )}

<div className="flex gap-3 justify-end pt-2"></div>
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