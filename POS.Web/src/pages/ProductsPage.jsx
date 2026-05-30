import { useEffect, useState } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'

export default function ProductsPage() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editing, setEditing]       = useState(null)
  const [saving, setSaving]         = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '', barcode: '', price: '', stock: '', categoryId: '', supplierIds: []
  })

  async function fetchAll() {
    try {
      const [prod, cat, sup] = await Promise.all([
        api.get('/Product'),
        api.get('/Category'),
        api.get('/Supplier'),
      ])
      setProducts(prod.data)
      setCategories(cat.data)
      setSuppliers(sup.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  function openAdd() {
    setEditing(null)
    setForm({ name: '', barcode: '', price: '', stock: '', categoryId: '', supplierIds: [] })
    setShowModal(true)
  }

  function openEdit(product) {
    setEditing(product)
    setForm({
      name:        product.name,
      barcode:     product.barcode || '',
      price:       product.price.toString(),
      stock:       product.stock.toString(),
      categoryId:  product.categoryId?.toString() || '',
      supplierIds: product.productSuppliers?.map(ps => ps.supplierId) || [],
    })
    setShowModal(true)
  }

    function closeModal() {
        setShowModal(false)
        setEditing(null)
        setForm({ name: '', barcode: '', price: '', stock: '', categoryId: '', supplierIds: [] })
        setError('')
    }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSupplierToggle(supplierId) {
    const exists = form.supplierIds.includes(supplierId)
    if (exists) {
      setForm({ ...form, supplierIds: form.supplierIds.filter(id => id !== supplierId) })
    } else {
      setForm({ ...form, supplierIds: [...form.supplierIds, supplierId] })
    }
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const payload = {
        name:        form.name,
        barcode:     form.barcode || null,
        price:       parseFloat(form.price) || 0,
        stock:       parseInt(form.stock) || 0,
        categoryId:  form.categoryId ? parseInt(form.categoryId) : null,
        supplierIds: form.supplierIds,
      }
      if (editing) {
        await api.put(`/Product/${editing.id}`, payload)
      } else {
        await api.post('/Product', payload)
      }
      await fetchAll()
      closeModal()
    } catch (err) {
  setError(err.response?.data?.title || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/Product/${id}`)
      await fetchAll()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button onClick={openAdd} className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition">
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">#</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Barcode</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Price</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Stock</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Category</th>
              <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">No products yet.</td>
              </tr>
            ) : (
              products.map((p, index) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{p.name}</td>
                  <td className="px-6 py-4 text-gray-500">{p.barcode || '—'}</td>
                  <td className="px-6 py-4 font-semibold text-teal-600">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.stock <= 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{p.category?.name || '—'}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEdit(p)} className="text-teal-600 hover:text-teal-800 font-medium">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Product' : 'Add Product'} onClose={closeModal}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name <span className="text-red-400">*</span></label>
              <input name="name" value={form.name} onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Product name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Barcode</label>
              <input name="barcode" value={form.barcode} onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. 1234567890" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Price <span className="text-red-400">*</span></label>
                <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Stock <span className="text-red-400">*</span></label>
                <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">— No category —</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Suppliers</label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {suppliers.length === 0 ? (
                  <p className="text-gray-400 text-xs">No suppliers available.</p>
                ) : (
                  suppliers.map(sup => (
                    <label key={sup.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.supplierIds.includes(sup.id)}
                        onChange={() => handleSupplierToggle(sup.id)}
                        className="accent-teal-600"
                      />
                      <span className="text-sm text-gray-700">{sup.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
            </div>
            )}
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  )
}