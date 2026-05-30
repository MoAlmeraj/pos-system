import { useEffect, useState } from 'react'
import api from '../api/axios'

const statCards = [
  { label: 'Products',   icon: '📦', key: 'products',   color: 'text-blue-600 bg-blue-50'   },
  { label: 'Customers',  icon: '👤', key: 'customers',  color: 'text-green-600 bg-green-50'  },
  { label: 'Suppliers',  icon: '🚚', key: 'suppliers',  color: 'text-purple-600 bg-purple-50' },
  { label: 'Categories', icon: '🗂', key: 'categories', color: 'text-teal-600 bg-teal-50'    },
]

export default function DashboardPage() {
  const [counts, setCounts] = useState({ products: 0, customers: 0, suppliers: 0, categories: 0 })
  const [recentSales, setRecentSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [products, customers, suppliers, categories, sales] = await Promise.all([
          api.get('/Product'),
          api.get('/Customer'),
          api.get('/Supplier'),
          api.get('/Category'),
          api.get('/Sale'),
        ])
        setCounts({
          products:   products.data.length,
          customers:  customers.data.length,
          suppliers:  suppliers.data.length,
          categories: categories.data.length,
        })
        setRecentSales(sales.data.slice(0, 5))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="text-gray-400 p-4">Loading...</div>

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className={`text-3xl p-3 rounded-xl ${card.color}`}>{card.icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{counts[card.key]}</div>
              <div className="text-sm text-gray-500">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent sales */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Sales</h2>

        {recentSales.length === 0 ? (
          <p className="text-gray-400 text-sm">No sales recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Sale #</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 text-gray-700">#{sale.id}</td>
                  <td className="py-3 font-semibold text-teal-600">${sale.total.toFixed(2)}</td>
                  <td className="py-3 text-gray-400">
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}