import { useEffect, useState } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'

export default function SalesPage() {
  const [sales, setSales]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await api.get('/Sale')
        setSales(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSales()
  }, [])

  if (loading) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Sales History</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Sale #</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Customer</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Payment</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Total</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
              <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">No sales yet.</td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700 font-medium">#{sale.id}</td>
                  <td className="px-6 py-4 text-gray-500">{sale.customerName || 'Walk-in'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sale.paymentMethod === 'Cash'   ? 'bg-green-100 text-green-600'  :
                      sale.paymentMethod === 'Card'   ? 'bg-blue-100 text-blue-600'    :
                                                        'bg-orange-100 text-orange-600'
                    }`}>
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-teal-600">${sale.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelected(sale)} className="text-teal-600 hover:text-teal-800 font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal title={`Sale #${selected.id} Details`} onClose={() => setSelected(null)}>
          <div className="space-y-4">

            <div className="flex justify-between text-sm text-gray-500">
              <span>Customer: <strong className="text-gray-700">{selected.customerName || 'Walk-in'}</strong></span>
              <span>{new Date(selected.saleDate).toLocaleDateString()}</span>
            </div>

            <div className="text-sm text-gray-500">
              Payment: <strong className="text-gray-700">{selected.paymentMethod}</strong>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 text-gray-500">Product</th>
                  <th className="text-center px-3 py-2 text-gray-500">Qty</th>
                  <th className="text-right px-3 py-2 text-gray-500">Unit Price</th>
                  <th className="text-right px-3 py-2 text-gray-500">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selected.items?.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-3 py-2 text-gray-700">{item.productName}</td>
                    <td className="px-3 py-2 text-center text-gray-500">{item.quantity}</td>
                    <td className="px-3 py-2 text-right text-gray-500">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-teal-600">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end border-t pt-3">
              <span className="text-lg font-bold text-gray-800">
                Total: <span className="text-teal-600">${selected.total.toFixed(2)}</span>
              </span>
            </div>

          </div>
        </Modal>
      )}

    </div>
  )
}