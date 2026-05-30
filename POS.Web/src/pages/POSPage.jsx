import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function POSPage() {
  const [products, setProducts]     = useState([])
  const [customers, setCustomers]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [cart, setCart]             = useState([])
  const [customerId, setCustomerId] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess]       = useState(false)
  const [search, setSearch]         = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')

  useEffect(() => {
    async function fetchData() {
      try {
        const [prod, cust] = await Promise.all([
          api.get('/Product'),
          api.get('/Customer'),
        ])
        setProducts(prod.data)
        setCustomers(cust.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function addToCart(product) {
    const existing = cart.find(item => item.product.id === product.id)
    if (existing) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    setCart(cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ))
  }

  function removeFromCart(productId) {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.barcode && p.barcode.includes(search))
  )

  async function handleCheckout() {
    if (cart.length === 0) return
    setProcessing(true)
    try {
      await api.post('/Sale', {
        customerId: customerId ? parseInt(customerId) : null,
        paymentMethod: paymentMethod,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity:  item.quantity,
        }))
      })
      setCart([])
      setCustomerId('')
      setSearch('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">

      {/* Left — Products */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        <h1 className="text-2xl font-bold text-gray-800">New Sale</h1>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or barcode..."
          className="w-full border border-gray-200 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pb-2">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={`bg-white rounded-xl shadow-sm p-4 text-left border transition
                ${product.stock === 0
                  ? 'opacity-40 cursor-not-allowed border-transparent'
                  : 'hover:shadow-md hover:border-teal-400 border-transparent cursor-pointer'
                }`}
            >
              <div className="font-medium text-gray-800 text-sm">{product.name}</div>
              <div className="text-teal-600 font-bold mt-1">${product.price.toFixed(2)}</div>
              <div className={`text-xs mt-1 ${product.stock <= 5 ? 'text-red-400' : 'text-gray-400'}`}>
                Stock: {product.stock}
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* Right — Cart */}
      <div className="w-80 bg-white rounded-xl shadow-sm flex flex-col shrink-0">

        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold text-gray-700 text-lg">🛒 Cart</h2>
        </div>

        {/* Customer selector */}
        <div className="px-5 py-3 border-b">
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Walk-in Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Payment method */}
        <div className="px-5 py-3 border-b">
        <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
            <option value="Cash">💵 Cash</option>
            <option value="Card">💳 Card</option>
            <option value="Credit">📋 Credit</option>
        </select>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {cart.length === 0 ? (
            <p className="text-gray-400 text-sm text-center pt-10">
              Click a product to add it to the cart.
            </p>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-700 truncate">{item.product.name}</div>
                  <div className="text-xs text-teal-600">${item.product.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center"
                  >−</button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center"
                  >+</button>
                </div>
                <div className="text-sm font-semibold text-gray-700 w-14 text-right">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600">✕</button>
              </div>
            ))
          )}
        </div>

        {/* Total + Checkout */}
        <div className="px-5 py-4 border-t space-y-3">

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="text-2xl font-bold text-teal-600">${total.toFixed(2)}</span>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-3 py-2 rounded-lg text-center">
              ✅ Sale completed successfully!
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition"
          >
            {processing ? 'Processing...' : `Checkout — $${total.toFixed(2)}`}
          </button>

        </div>

      </div>

    </div>
  )
}