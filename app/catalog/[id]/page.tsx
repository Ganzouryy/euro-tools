'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Wrench, ShoppingCart, Info, Shield } from 'lucide-react'
import { calculateRentalPrice, formatCurrency } from '@/lib/utils'

export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [tool, setTool] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [rentalDays, setRentalDays] = useState(7)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchTool()
  }, [params.id])

  const fetchTool = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setTool(data)
    } catch (error) {
      console.error('Error fetching tool:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    if (!tool) return { rental: 0, deposit: 0, total: 0 }

    const rentalFee = calculateRentalPrice(
      tool.rental_price_per_day,
      tool.rental_price_per_week,
      tool.rental_price_per_month,
      rentalDays
    ) * quantity

    const deposit = tool.insurance_deposit * quantity

    return {
      rental: rentalFee,
      deposit: deposit,
      total: rentalFee + deposit,
    }
  }

  const handleAddToCart = () => {
    // Store in localStorage for now
    const cartItem = {
      tool_id: tool.id,
      tool_name: tool.name,
      quantity,
      rental_days: rentalDays,
      price_per_day: tool.rental_price_per_day,
      insurance_deposit: tool.insurance_deposit,
      image_url: tool.image_urls?.[0] || null,
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push(cartItem)
    localStorage.setItem('cart', JSON.stringify(cart))

    alert('Added to cart!')
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Tool Not Found</h1>
          <Link href="/catalog" className="text-blue-600 hover:text-blue-700">
            ← Back to Catalog
          </Link>
        </div>
      </div>
    )
  }

  const totals = calculateTotal()

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">Euro-Tools</span>
            </Link>
            <Link href="/catalog" className="text-slate-700 hover:text-blue-600">
              ← Back to Catalog
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center mb-4">
              {tool.image_urls && tool.image_urls.length > 0 ? (
                <img
                  src={tool.image_urls[0]}
                  alt={tool.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Wrench className="h-32 w-32 text-slate-400" />
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {tool.image_urls?.slice(1, 5).map((url: string, idx: number) => (
                <div key={idx} className="aspect-square bg-slate-200 rounded-lg overflow-hidden">
                  <img src={url} alt={`${tool.name} ${idx + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{tool.name}</h1>
                  <p className="text-slate-600">{tool.category}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {tool.condition}
                </span>
              </div>

              <p className="text-slate-700 mb-6">{tool.description}</p>

              {tool.model_number && (
                <p className="text-sm text-slate-600 mb-2">
                  <strong>Model:</strong> {tool.model_number}
                </p>
              )}

              <div className="border-t pt-4 mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-blue-600">
                    ${tool.rental_price_per_day}
                  </span>
                  <span className="text-slate-600">/day</span>
                </div>
                {tool.rental_price_per_week && (
                  <p className="text-sm text-slate-600">
                    ${tool.rental_price_per_week}/week (save {Math.round((1 - (tool.rental_price_per_week / (tool.rental_price_per_day * 7))) * 100)}%)
                  </p>
                )}
                {tool.rental_price_per_month && (
                  <p className="text-sm text-slate-600">
                    ${tool.rental_price_per_month}/month (save {Math.round((1 - (tool.rental_price_per_month / (tool.rental_price_per_day * 30))) * 100)}%)
                  </p>
                )}
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">Insurance Deposit: ${tool.insurance_deposit}</span>
                </div>
                <p className="text-xs text-slate-600">Fully refundable upon clean return</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rental Duration (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={rentalDays}
                    onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quantity (Available: {tool.available_quantity})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={tool.available_quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, tool.available_quantity))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Rental Fee ({rentalDays} days × {quantity})</span>
                    <span className="font-semibold">${totals.rental.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Insurance Deposit (refundable)</span>
                    <span className="font-semibold">${totals.deposit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total Due Now</span>
                    <span className="text-blue-600">${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={tool.available_quantity === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {tool.available_quantity === 0 ? 'Out of Stock' : 'Proceed to Checkout'}
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-2">What's Included:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Direct delivery to your location in Egypt</li>
                    <li>Full insurance coverage during rental period</li>
                    <li>24/7 technical support</li>
                    <li>Free return pickup</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
