'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash2, Wrench } from 'lucide-react'
import Link from 'next/link'

export default function AdminToolsPage() {
  const [loading, setLoading] = useState(true)
  const [tools, setTools] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('name')

      if (error) throw error
      setTools(data || [])
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete tool "${name}"? This cannot be undone.`)) return

    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('Tool deleted successfully')
      await fetchTools()
    } catch (error: any) {
      alert('Delete failed: ' + error.message)
    }
  }

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <h1 className="text-2xl font-bold text-slate-900">Manage Tools</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/tools/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Tool
              </Link>
              <Link href="/admin/dashboard" className="text-slate-700 hover:text-blue-600">
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Tool</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Price/Day</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTools.map((tool) => (
                <tr key={tool.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-200 rounded flex items-center justify-center flex-shrink-0">
                        {tool.image_urls?.[0] ? (
                          <img src={tool.image_urls[0]} alt={tool.name} className="h-full w-full object-cover rounded" />
                        ) : (
                          <Wrench className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{tool.name}</p>
                        {tool.model_number && (
                          <p className="text-xs text-slate-500">{tool.model_number}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{tool.category}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">${tool.rental_price_per_day}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${
                      tool.available_quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tool.available_quantity} / {tool.total_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/tools/${tool.id}/edit`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(tool.id, tool.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTools.length === 0 && (
            <div className="text-center py-12 text-slate-600">
              No tools found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
