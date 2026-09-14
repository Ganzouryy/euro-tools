'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { generateRequestNumber } from '@/lib/utils'
import { Wrench, AlertCircle } from 'lucide-react'

export default function NewCustomRequestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    toolName: '',
    technicalSpecs: '',
    useCase: '',
    estimatedDuration: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'critical',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const requestNumber = generateRequestNumber()

      const { error } = await supabase
        .from('custom_requests')
        .insert({
          user_id: user.id,
          request_number: requestNumber,
          tool_name: formData.toolName,
          technical_specs: formData.technicalSpecs ? JSON.parse(JSON.stringify({ raw: formData.technicalSpecs })) : null,
          use_case_description: formData.useCase,
          estimated_rental_duration_days: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : null,
          urgency_level: formData.urgency,
          status: 'submitted',
        })

      if (error) throw error

      alert('Custom request submitted successfully! We will contact you with a quote within 24-48 hours.')
      router.push('/dashboard')
    } catch (error: any) {
      alert('Submission failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">Euro-Tools</span>
            </div>
            <button
              onClick={() => router.back()}
              className="text-slate-700 hover:text-blue-600"
            >
              ← Back
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Request a Custom Tool</h1>
            <p className="text-slate-600">
              Can't find what you need? We'll source it for you.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">How it works:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Submit your tool requirements</li>
                  <li>Our team sources the equipment</li>
                  <li>You receive a custom quote within 24-48 hours</li>
                  <li>Approve the quote and we deliver</li>
                </ol>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tool Name / Description *
              </label>
              <input
                type="text"
                required
                value={formData.toolName}
                onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
                placeholder="e.g., Siemens PLC S7-1200 Programming Cable"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Technical Specifications
              </label>
              <textarea
                rows={4}
                value={formData.technicalSpecs}
                onChange={(e) => setFormData({ ...formData, technicalSpecs: e.target.value })}
                placeholder="Model numbers, voltage requirements, connector types, etc."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Use Case / Application *
              </label>
              <textarea
                rows={3}
                required
                value={formData.useCase}
                onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                placeholder="What will you use this tool for? (e.g., PLC diagnostics at cement plant)"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estimated Rental Duration (days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                  placeholder="e.g., 7"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Urgency Level *
                </label>
                <select
                  required
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low - Within 1 week</option>
                  <option value="medium">Medium - Within 3 days</option>
                  <option value="high">High - Within 24 hours</option>
                  <option value="critical">Critical - ASAP</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
