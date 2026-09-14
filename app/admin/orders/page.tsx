'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Package, Eye, Truck, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('orders')
        .select('*, users(first_name, last_name, email, phone, whatsapp_contact)')
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      alert('Order status updated!')
      await fetchOrders()
    } catch (error: any) {
      alert('Update failed: ' + error.message)
    }
  }

  const markAsReturned = async (orderId: string) => {
    const notes = prompt('Representative notes on tool condition:')
    if (!notes) return

    try {
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'returned',
          return_date: new Date().toISOString(),
          return_notes: notes,
        })
        .eq('id', orderId)

      if (orderError) throw orderError

      // Update deposit status to held (ready for refund)
      const { error: depositError } = await supabase
        .from('deposit_ledger')
        .update({ status: 'held' })
        .eq('order_id', orderId)

      if (depositError) throw depositError

      alert('Order marked as returned! Deposit is now in refund queue.')
      await fetchOrders()
    } catch (error: any) {
      alert('Failed: ' + error.message)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: any = {
      pending_kyc: 'bg-yellow-100 text-yellow-800',
      pending_payment: 'bg-orange-100 text-orange-800',
      confirmed: 'bg-blue-100 text-blue-800',
      dispatched: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      returned: 'bg-slate-100 text-slate-800',
      completed: 'bg-green-600 text-white',
      cancelled: 'bg-red-100 text-red-800',
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status] || 'bg-slate-100'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
            <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-700">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Orders</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="confirmed">Confirmed</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="returned">Returned</option>
            </select>
            <span className="text-sm text-slate-600">Total: {orders.length} orders</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Order Info</h3>
                    <p className="text-sm text-slate-600 mb-1">
                      <strong>{order.order_number}</strong>
                    </p>
                    <p className="text-sm text-slate-600 mb-2">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                    {getStatusBadge(order.status)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Customer</h3>
                    <p className="text-sm text-slate-700 mb-1">
                      {order.users.first_name} {order.users.last_name}
                    </p>
                    <p className="text-sm text-slate-600 mb-1">{order.users.email}</p>
                    {order.users.whatsapp_contact && (
                      <p className="text-sm text-green-600">
                        WhatsApp: {order.users.whatsapp_contact}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Details</h3>
                    <p className="text-sm text-slate-600 mb-1">
                      <strong>Total:</strong> ${order.total_amount}
                    </p>
                    <p className="text-sm text-slate-600 mb-1">
                      <strong>Deposit:</strong> ${order.insurance_deposit}
                    </p>
                    <p className="text-sm text-slate-600 mb-1">
                      <strong>Duration:</strong> {order.rental_duration_days} days
                    </p>
                    <p className="text-sm text-slate-600">
                      {new Date(order.rental_start_date).toLocaleDateString()} - {new Date(order.rental_end_date).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Actions</h3>
                    <div className="space-y-2">
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'dispatched')}
                          className="w-full bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 text-sm font-semibold flex items-center justify-center gap-2"
                        >
                          <Truck className="h-4 w-4" />
                          Mark Dispatched
                        </button>
                      )}
                      {order.status === 'dispatched' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Delivered
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => markAsReturned(order.id)}
                          className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
                        >
                          Mark Returned
                        </button>
                      )}
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="w-full bg-slate-600 text-white px-3 py-2 rounded-lg hover:bg-slate-700 text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>

                {order.location_details && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-slate-600">
                      <strong>Delivery:</strong> {order.delivery_address}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
