'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Package, Users, FileText, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'
import { User } from '@/lib/types'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingKYC: 0,
    activeRentals: 0,
    pendingRefunds: 0,
    totalRevenue: 0,
    customRequests: 0,
  })

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single() as { data: User | null }

      if (!userData?.is_admin) {
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
      await fetchStats()
    } catch (error) {
      console.error('Error:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch various statistics
      const [ordersRes, kycRes, activeRes, refundsRes, requestsRes] = await Promise.all([
        supabase.from('orders').select('id, total_amount', { count: 'exact' }),
        supabase.from('users').select('id', { count: 'exact' }).eq('kyc_status', 'pending'),
        supabase.from('orders').select('id', { count: 'exact' }).in('status', ['confirmed', 'dispatched', 'delivered']),
        supabase.from('deposit_ledger').select('id', { count: 'exact' }).eq('status', 'held'),
        supabase.from('custom_requests').select('id', { count: 'exact' }).eq('status', 'submitted'),
      ])

      const totalRevenue = (ordersRes.data as Array<{ id: string; total_amount: number }> | null)?.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      ) || 0

      setStats({
        totalOrders: ordersRes.count || 0,
        pendingKYC: kycRes.count || 0,
        activeRentals: activeRes.count || 0,
        pendingRefunds: refundsRes.count || 0,
        totalRevenue,
        customRequests: requestsRes.count || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Link href="/catalog" className="text-slate-700 hover:text-blue-600">
                View Catalog
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
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalOrders}</p>
              </div>
              <Package className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Active Rentals</p>
                <p className="text-3xl font-bold text-slate-900">{stats.activeRentals}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-slate-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pending KYC</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingKYC}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pending Refunds</p>
                <p className="text-3xl font-bold text-blue-600">{stats.pendingRefunds}</p>
              </div>
              <DollarSign className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Custom Requests</p>
                <p className="text-3xl font-bold text-purple-600">{stats.customRequests}</p>
              </div>
              <FileText className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link
              href="/admin/kyc-queue"
              className="bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded-lg hover:bg-yellow-100 transition font-semibold text-center"
            >
              Review KYC ({stats.pendingKYC})
            </Link>
            <Link
              href="/admin/orders"
              className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-lg hover:bg-blue-100 transition font-semibold text-center"
            >
              Manage Orders
            </Link>
            <Link
              href="/admin/refunds"
              className="bg-green-50 border border-green-200 text-green-900 px-4 py-3 rounded-lg hover:bg-green-100 transition font-semibold text-center"
            >
              Process Refunds ({stats.pendingRefunds})
            </Link>
            <Link
              href="/admin/tools"
              className="bg-purple-50 border border-purple-200 text-purple-900 px-4 py-3 rounded-lg hover:bg-purple-100 transition font-semibold text-center"
            >
              Manage Tools
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Operations</h3>
            <div className="space-y-2">
              <Link href="/admin/custom-requests" className="block text-blue-600 hover:text-blue-700">
                → Custom Tool Requests
              </Link>
              <Link href="/admin/analytics" className="block text-blue-600 hover:text-blue-700">
                → Analytics & Reports
              </Link>
              <Link href="/admin/users" className="block text-blue-600 hover:text-blue-700">
                → User Management
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">System</h3>
            <div className="space-y-2">
              <Link href="/admin/settings" className="block text-blue-600 hover:text-blue-700">
                → Platform Settings
              </Link>
              <Link href="/admin/representatives" className="block text-blue-600 hover:text-blue-700">
                → Representatives
              </Link>
              <Link href="/admin/audit-log" className="block text-blue-600 hover:text-blue-700">
                → Audit Log
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
