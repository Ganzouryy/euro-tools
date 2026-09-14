'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Package, MapPin, CreditCard, Shield, AlertCircle } from 'lucide-react'
import { calculateRentalPrice, getDaysBetween, generateOrderNumber } from '@/lib/utils'
import { DEMO_MODE, PAYMENT_MESSAGES } from '@/lib/payment'

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [locationDetails, setLocationDetails] = useState({
    deliveryType: 'hotel' as 'hotel' | 'plant' | 'gps',
    locationName: '',
    address: '',
    gpsLink: '',
    city: '',
    contactPerson: '',
    contactPhone: '',
  })
  const [rentalDates, setRentalDates] = useState({
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    checkUser()
    loadCart()
  }, [])

  const checkUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      router.push('/auth/login')
      return
    }

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (userData?.kyc_status !== 'verified') {
      alert('Please complete KYC verification before placing orders')
      router.push('/auth/kyc')
      return
    }

    setUser(userData)
  }

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (cart.length === 0) {
      router.push('/catalog')
      return
    }
    setCartItems(cart)
  }

  const calculateTotals = () => {
    const rentalFee = cartItems.reduce((sum, item) => {
      return sum + calculateRentalPrice(
        item.price_per_day,
        null,
        null,
        item.rental_days
      ) * item.quantity
    }, 0)

    const deposit = cartItems.reduce((sum, item) => {
      return sum + (item.insurance_deposit * item.quantity)
    }, 0)

    return { rentalFee, deposit, total: rentalFee + deposit }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!rentalDates.startDate || !rentalDates.endDate) {
        throw new Error('Please select rental dates')
      }

      const startDate = new Date(rentalDates.startDate)
      const endDate = new Date(rentalDates.endDate)
      const rentalDays = getDaysBetween(startDate, endDate)

      const totals = calculateTotals()

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: generateOrderNumber(),
          status: 'pending_payment',
          items: cartItems,
          rental_start_date: rentalDates.startDate,
          rental_end_date: rentalDates.endDate,
          rental_duration_days: rentalDays,
          rental_fee: totals.rentalFee,
          insurance_deposit: totals.deposit,
          total_amount: totals.total,
          location_details: locationDetails,
          delivery_address: `${locationDetails.locationName}, ${locationDetails.address}, ${locationDetails.city}`,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create deposit ledger entry
      await supabase
        .from('deposit_ledger')
        .insert({
          order_id: order.id,
          user_id: user.id,
          amount: totals.deposit,
          status: 'pending',
        })

      // Clear cart
      localStorage.removeItem('cart')

      if (DEMO_MODE) {
        alert('Order created successfully! (Demo mode - payment integration pending)')
      } else {
        alert('Order created! Redirecting to payment...')
      }
      router.push(`/dashboard`)
    } catch (error: any) {
      alert('Order failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const totals = calculateTotals()

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
            <button onClick={() => router.back()} className="text-slate-700 hover:text-blue-600">
              ← Back
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rental Dates */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Rental Period
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={rentalDates.startDate}
                      onChange={(e) => setRentalDates({ ...rentalDates, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={rentalDates.startDate || new Date().toISOString().split('T')[0]}
                      value={rentalDates.endDate}
                      onChange={(e) => setRentalDates({ ...rentalDates, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Location */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Delivery Location
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Delivery Type *
                    </label>
                    <select
                      required
                      value={locationDetails.deliveryType}
                      onChange={(e) => setLocationDetails({ ...locationDetails, deliveryType: e.target.value as any })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hotel">Hotel</option>
                      <option value="plant">Manufacturing Plant</option>
                      <option value="gps">GPS Coordinates</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {locationDetails.deliveryType === 'hotel' ? 'Hotel Name' :
                       locationDetails.deliveryType === 'plant' ? 'Plant Name' : 'Location Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={locationDetails.locationName}
                      onChange={(e) => setLocationDetails({ ...locationDetails, locationName: e.target.value })}
                      placeholder="e.g., Marriott Cairo, Cement Factory Zone B"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={locationDetails.address}
                      onChange={(e) => setLocationDetails({ ...locationDetails, address: e.target.value })}
                      placeholder="Street address or area description"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={locationDetails.city}
                      onChange={(e) => setLocationDetails({ ...locationDetails, city: e.target.value })}
                      placeholder="e.g., Cairo, Alexandria"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {locationDetails.deliveryType === 'gps' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Google Maps Link
                      </label>
                      <input
                        type="url"
                        value={locationDetails.gpsLink}
                        onChange={(e) => setLocationDetails({ ...locationDetails, gpsLink: e.target.value })}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        required
                        value={locationDetails.contactPerson}
                        onChange={(e) => setLocationDetails({ ...locationDetails, contactPerson: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Contact Phone (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={locationDetails.contactPhone}
                        onChange={(e) => setLocationDetails({ ...locationDetails, contactPhone: e.target.value })}
                        placeholder="+20 XXX XXX XXXX"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 text-lg flex items-center justify-center gap-2"
              >
                <CreditCard className="h-5 w-5" />
                {loading ? 'Processing...' : DEMO_MODE ? 'Create Order (Demo)' : 'Proceed to Payment'}
              </button>

              {DEMO_MODE && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">Demo Mode</p>
                      <p>{PAYMENT_MESSAGES.demo}</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div>
                      <p className="font-semibold text-slate-900">{item.tool_name}</p>
                      <p className="text-slate-600">{item.rental_days} days × {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      ${(calculateRentalPrice(item.price_per_day, null, null, item.rental_days) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Rental Fee</span>
                  <span className="font-semibold">${totals.rentalFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Insurance Deposit</span>
                  <span className="font-semibold">${totals.deposit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">${totals.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-green-800">
                    <p className="font-semibold mb-1">Deposit Protection</p>
                    <p>Your ${totals.deposit.toFixed(2)} deposit is fully refundable upon clean tool return.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
