'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { DollarSign, User, Phone, CheckCircle, XCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface PendingRefund {
  id: string
  order_id: string
  user_id: string
  amount: number
  order: {
    order_number: string
    return_notes: string | null
    return_condition: string | null
    items: any
  }
  user: {
    first_name: string
    last_name: string
    email: string
    phone: string | null
    whatsapp_contact: string | null
  }
}

export default function RefundsPage() {
  const [loading, setLoading] = useState(true)
  const [pendingRefunds, setPendingRefunds] = useState<PendingRefund[]>([])
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingRefunds()
  }, [])

  const fetchPendingRefunds = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('deposit_ledger')
        .select(`
          *,
          order:orders(order_number, return_notes, return_condition, items),
          user:users(first_name, last_name, email, phone, whatsapp_contact)
        `)
        .eq('status', 'held')
        .order('created_at', { ascending: true })

      if (error) throw error
      setPendingRefunds(data as any || [])
    } catch (error) {
      console.error('Error fetching refunds:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFullRefund = async (depositId: string, orderId: string, userId: string, amount: number) => {
    if (!confirm('Process full refund? This will refund the entire deposit amount.')) return

    setProcessing(depositId)
    try {
      // Update deposit ledger
      const { error: depositError } = await supabase
        .from('deposit_ledger')
        .update({
          status: 'released',
          release_reason: 'clean_return',
          deduction_amount: 0,
          processed_at: new Date().toISOString(),
        })
        .eq('id', depositId)

      if (depositError) throw depositError

      // Update order deposit status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ deposit_status: 'refunded' })
        .eq('id', orderId)

      if (orderError) throw orderError

      alert('Full refund processed successfully!')
      await fetchPendingRefunds()
    } catch (error: any) {
      alert('Refund failed: ' + error.message)
    } finally {
      setProcessing(null)
    }
  }

  const handlePartialRefund = async (depositId: string, orderId: string, amount: number) => {
    const deductionInput = prompt(`Deduction amount (max $${amount}):`)
    if (!deductionInput) return

    const deduction = parseFloat(deductionInput)
    if (isNaN(deduction) || deduction < 0 || deduction > amount) {
      alert('Invalid deduction amount')
      return
    }

    const reason = prompt('Reason for deduction:')
    if (!reason) return

    setProcessing(depositId)
    try {
      const { error: depositError } = await supabase
        .from('deposit_ledger')
        .update({
          status: 'released',
          release_reason: 'minor_damage_deducted',
          deduction_amount: deduction,
          processed_at: new Date().toISOString(),
        })
        .eq('id', depositId)

      if (depositError) throw depositError

      const { error: orderError } = await supabase
        .from('orders')
        .update({
          deposit_status: 'refunded',
          inspection_notes: reason,
        })
        .eq('id', orderId)

      if (orderError) throw orderError

      alert(`Partial refund processed! Refunding $${(amount - deduction).toFixed(2)}`)
      await fetchPendingRefunds()
    } catch (error: any) {
      alert('Refund failed: ' + error.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleForfeit = async (depositId: string, orderId: string) => {
    const reason = prompt('Reason for forfeiting deposit:')
    if (!reason) return

    if (!confirm('Forfeit entire deposit? This cannot be undone.')) return

    setProcessing(depositId)
    try {
      const { error: depositError } = await supabase
        .from('deposit_ledger')
        .update({
          status: 'forfeited',
          release_reason: 'tool_missing',
          deduction_amount: 0,
          processed_at: new Date().toISOString(),
        })
        .eq('id', depositId)

      if (depositError) throw depositError

      const { error: orderError } = await supabase
        .from('orders')
        .update({
          deposit_status: 'forfeited',
          inspection_notes: reason,
        })
        .eq('id', orderId)

      if (orderError) throw orderError

      alert('Deposit forfeited')
      await fetchPendingRefunds()
    } catch (error: any) {
      alert('Failed: ' + error.message)
    } finally {
      setProcessing(null)
    }
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
            <h1 className="text-2xl font-bold text-slate-900">Pending Refunds</h1>
            <a href="/admin/dashboard" className="text-blue-600 hover:text-blue-700">
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pendingRefunds.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All Caught Up!</h2>
            <p className="text-slate-600">No pending refunds to process</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRefunds.map((refund) => (
              <div key={refund.id} className="bg-white rounded-lg shadow p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Order Info */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Order Details</h3>
                    <p className="text-sm text-slate-600 mb-1">
                      <strong>Order:</strong> {refund.order.order_number}
                    </p>
                    <p className="text-sm text-slate-600 mb-1">
                      <strong>Deposit:</strong> {formatCurrency(refund.amount, 'USD')}
                    </p>
                    {refund.order.return_condition && (
                      <p className="text-sm text-slate-600 mb-1">
                        <strong>Condition:</strong> {refund.order.return_condition}
                      </p>
                    )}
                    {refund.order.return_notes && (
                      <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
                        <strong>Rep Notes:</strong>
                        <p className="text-slate-700 mt-1">{refund.order.return_notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Customer Info</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-900">
                        {refund.user.first_name} {refund.user.last_name}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{refund.user.email}</p>
                    {refund.user.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-4 w-4" />
                        {refund.user.phone}
                      </div>
                    )}
                    {refund.user.whatsapp_contact && (
                      <p className="text-sm text-green-600 mt-1">
                        WhatsApp: {refund.user.whatsapp_contact}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleFullRefund(refund.id, refund.order_id, refund.user_id, refund.amount)}
                        disabled={processing === refund.id}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-green-300 font-semibold text-sm"
                      >
                        {processing === refund.id ? 'Processing...' : `Refund Full $${refund.amount}`}
                      </button>
                      <button
                        onClick={() => handlePartialRefund(refund.id, refund.order_id, refund.amount)}
                        disabled={processing === refund.id}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 font-semibold text-sm"
                      >
                        Deduct & Refund
                      </button>
                      <button
                        onClick={() => handleForfeit(refund.id, refund.order_id)}
                        disabled={processing === refund.id}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-red-300 font-semibold text-sm"
                      >
                        Forfeit Deposit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
