'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Package, FileText, User, AlertCircle, CheckCircle, Clock } from 'lucide-react'

export default function UserDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
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

      if (userData?.is_admin) {
        router.push('/admin/dashboard')
        return
      }

      setUser(userData)
      await fetchUserData(authUser.id)
    } catch (error) {
      console.error('Error:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserData = async (userId: string) => {
    try {
      const [ordersRes, requestsRes] = await Promise.all([
        supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('custom_requests')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      setOrders(ordersRes.data || [])
      setRequests(requestsRes.data || [])
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const getKYCBadge = () => {
    switch (user?.kyc_status) {
      case 'verified':
        return (
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Verified</span>
          </div>
        )
      case 'rejected':
        return (
          <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Rejected</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
            <Clock className="h-4 w-4" />
            <span>Pending Review</span>
          </div>
        )
    }
  }

  const getOrderStatusBadge = (status: string) => {
    const statusColors: any = {
      pending_kyc: 'bg-yellow-100 text-yellow-800',
      pending_payment: 'bg-orange-100 text-orange-800',
      confirmed: 'bg-blue-100 text-blue-800',
      dispatched: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      returned: 'bg-slate-100 text-slate-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[status] || 'bg-slate-100 text-slate-800'}`}>
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

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-slate-900">
              Euro-Tools
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/catalog" className="text-slate-700 hover:text-blue-600">
                Browse Tools
              </Link>
              <Link href="/dashboard/orders" className="text-slate-700 hover:text-blue-600">
                My Orders
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/')
                }}
                className="text-slate-700 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, {user.first_name}!
              </h1>
              <p className="text-slate-600">
                {user.company_name && `${user.company_name} • `}
                {user.email}
              </p>
            </div>
            {getKYCBadge()}
          </div>

          {user.kyc_status === 'pending' && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Your identity verification is under review. You'll be able to place orders once approved.
              </p>
            </div>
          )}

          {user.kyc_status === 'rejected' && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 mb-2">
                Your KYC application was rejected: {user.kyc_rejection_reason}
              </p>
              <Link
                href="/auth/kyc"
                className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold"
              >
                Resubmit Documents
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/catalog"
            className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition"
          >
            <Package className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Browse Tools</h3>
            <p className="text-blue-100 text-sm">Find equipment for your project</p>
          </Link>

          <Link
            href="/dashboard/custom-requests/new"
            className="bg-purple-600 text-white rounded-lg p-6 hover:bg-purple-700 transition"
          >
            <FileText className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Custom Request</h3>
            <p className="text-purple-100 text-sm">Need a specific tool?</p>
          </Link>

          <Link
            href="/dashboard/profile"
            className="bg-slate-600 text-white rounded-lg p-6 hover:bg-slate-700 transition"
          >
            <User className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-1">My Profile</h3>
            <p className="text-slate-100 text-sm">Update your information</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
              <Link href="/dashboard/orders" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                View All →
              </Link>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="p-6 text-center text-slate-600">
              <p>No orders yet</p>
              <Link href="/catalog" className="text-blue-600 hover:text-blue-700 font-semibold">
                Browse our catalog
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{order.order_number}</p>
                      <p className="text-sm text-slate-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getOrderStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Total: ${order.total_amount}</span>
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Requests */}
        {requests.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Custom Requests</h2>
                <Link href="/dashboard/custom-requests" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                  View All →
                </Link>
              </div>
            </div>

            <div className="divide-y">
              {requests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{request.tool_name}</p>
                      <p className="text-sm text-slate-600">{request.request_number}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      request.status === 'quote_sent' ? 'bg-green-100 text-green-800' :
                      request.status === 'in_sourcing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
