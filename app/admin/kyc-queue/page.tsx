'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react'

interface KYCUser {
  id: string
  first_name: string
  last_name: string
  email: string
  company_name: string | null
  country_origin: string | null
  kyc_document_url: string | null
  kyc_document_type: string | null
  created_at: string
}

export default function KYCQueuePage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<KYCUser[]>([])
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingKYC()
  }, [])

  const fetchPendingKYC = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('kyc_status', 'pending')
        .not('kyc_document_url', 'is', null)
        .order('created_at', { ascending: true })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching KYC queue:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string) => {
    if (!confirm('Approve this KYC application?')) return

    setProcessing(userId)
    try {
      const { data: { user: adminUser } } = await supabase.auth.getUser()

      const { error } = await (supabase
        .from('users')
        .update({
          kyc_status: 'verified',
          kyc_reviewed_at: new Date().toISOString(),
          kyc_reviewed_by: adminUser?.id,
        }) as any)
        .eq('id', userId)

      if (error) throw error

      alert('KYC approved successfully!')
      await fetchPendingKYC()
    } catch (error: any) {
      alert('Approval failed: ' + error.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (userId: string) => {
    const reason = prompt('Rejection reason:')
    if (!reason) return

    setProcessing(userId)
    try {
      const { data: { user: adminUser } } = await supabase.auth.getUser()

      const { error } = await (supabase
        .from('users')
        .update({
          kyc_status: 'rejected',
          kyc_rejection_reason: reason,
          kyc_reviewed_at: new Date().toISOString(),
          kyc_reviewed_by: adminUser?.id,
        }) as any)
        .eq('id', userId)

      if (error) throw error

      alert('KYC rejected')
      await fetchPendingKYC()
    } catch (error: any) {
      alert('Rejection failed: ' + error.message)
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
            <h1 className="text-2xl font-bold text-slate-900">KYC Verification Queue</h1>
            <a href="/admin/dashboard" className="text-blue-600 hover:text-blue-700">
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {users.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">All Verified!</h2>
            <p className="text-slate-600">No pending KYC applications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* User Info */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">User Information</h3>
                    <p className="text-sm mb-1">
                      <strong>Name:</strong> {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Email:</strong> {user.email}
                    </p>
                    {user.company_name && (
                      <p className="text-sm mb-1">
                        <strong>Company:</strong> {user.company_name}
                      </p>
                    )}
                    {user.country_origin && (
                      <p className="text-sm mb-1">
                        <strong>Country:</strong> {user.country_origin}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">
                      Submitted: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Document */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Document</h3>
                    <p className="text-sm mb-3">
                      <strong>Type:</strong> {user.kyc_document_type?.toUpperCase()}
                    </p>
                    {user.kyc_document_url && (
                      <a
                        href={user.kyc_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition text-sm"
                      >
                        <FileText className="h-4 w-4" />
                        View Document
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleApprove(user.id)}
                        disabled={processing === user.id}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-green-300 font-semibold flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {processing === user.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        disabled={processing === user.id}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-red-300 font-semibold flex items-center justify-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
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
