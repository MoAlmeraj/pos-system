import { useEffect, useState } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editing, setEditing]       = useState(null)
  const [name, setName]             = useState('')
  const [saving, setSaving]         = useState(false)

  async function fetchCategories() {
    try {
      const res = await api.get('/Category')
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  function openAdd() {
    setEditing(null)
    setName('')
    setShowModal(true)
  }

  function openEdit(category) {
    setEditing(category)
    setName(category.name)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setName('')
    setEditing(null)
  }

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/Category/${editing.id}`, { name })
      } else {
        await api.post('/Category', { name })
      }
      await fetchCategories()
      closeModal()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category?')) return
    try {
      await api.delete(`/Category/${id}`)
      await fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={openAdd}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition"
        >
          + Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">#</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-400">No categories yet.</td>
              </tr>
            ) : (
              categories.map((cat, index) => (
                <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEdit(cat)} className="text-teal-600 hover:text-teal-800 font-medium">Edit</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title={editing ? 'Edit Category' : 'Add Category'} onClose={closeModal}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Electronics"
              />
            </div>
            <div className="flex gap-3 justify-end">
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