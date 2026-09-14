'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Upload, CheckCircle, Clock, XCircle } from 'lucide-react'

export default function KYCPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [kycStatus, setKycStatus] = useState<string>('pending')
  const [documentType, setDocumentType] = useState<string>('passport')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    checkUser()
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

    setUser(userData)
    setKycStatus(userData?.kyc_status || 'pending')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !user) return

    setUploading(true)

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(filePath)

      // Update user record
      const { error: updateError } = await supabase
        .from('users')
        .update({
          kyc_document_url: urlData.publicUrl,
          kyc_document_type: documentType,
          kyc_status: 'pending',
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      alert('KYC document uploaded successfully! Our team will review it within 24 hours.')
      router.push('/dashboard')
    } catch (error: any) {
      alert('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const getStatusBadge = () => {
    switch (kycStatus) {
      case 'verified':
        return (
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Verified</span>
          </div>
        )
      case 'rejected':
        return (
          <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg">
            <XCircle className="h-5 w-5" />
            <span className="font-semibold">Rejected</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Under Review</span>
          </div>
        )
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (kycStatus === 'verified') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Identity Verified!</h1>
          <p className="text-slate-600 mb-6">You can now browse and rent tools</p>
          <button
            onClick={() => router.push('/catalog')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse Tools
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Identity Verification</h1>
          <p className="text-slate-600">Upload your identification document for verification</p>
          <div className="mt-4 flex justify-center">
            {getStatusBadge()}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Accepted Documents:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Passport (with Egyptian visa)</li>
            <li>• European Company ID</li>
            <li>• National ID (for EU citizens)</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="passport">Passport</option>
              <option value="company_id">Company ID</option>
              <option value="visa">Visa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload Document
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
                id="file-upload"
                required
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 hover:text-blue-700 font-semibold"
              >
                Click to upload
              </label>
              <p className="text-sm text-slate-500 mt-2">PNG, JPG, or PDF (max 10MB)</p>
              {file && (
                <p className="text-sm text-green-600 mt-2 font-semibold">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Submit for Verification'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Your document will be reviewed within 24 business hours
        </p>
      </div>
    </div>
  )
}
