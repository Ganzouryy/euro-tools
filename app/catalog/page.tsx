'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Search, Filter, Wrench } from 'lucide-react'
import { TOOL_CATEGORIES } from '@/lib/constants'

interface Tool {
  id: string
  name: string
  description: string
  category: string
  rental_price_per_day: number
  insurance_deposit: number
  available_quantity: number
  image_urls: string[]
  condition: string
}

export default function CatalogPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    fetchTools()
  }, [selectedCategory, sortBy])

  const fetchTools = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('tools')
        .select('*')
        .gt('available_quantity', 0)

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      if (sortBy === 'price_low') {
        query = query.order('rental_price_per_day', { ascending: true })
      } else if (sortBy === 'price_high') {
        query = query.order('rental_price_per_day', { ascending: false })
      } else {
        query = query.order('name', { ascending: true })
      }

      const { data, error } = await query

      if (error) throw error
      setTools(data || [])
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">Euro-Tools</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-slate-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/custom-request" className="text-slate-700 hover:text-blue-600">
                Custom Request
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Tool Catalog</h1>
          <p className="text-lg text-slate-600">Browse our professional-grade equipment</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search tools by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {TOOL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort: Name</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading tools...</p>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No tools found matching your criteria</p>
            <Link
              href="/custom-request"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Request a custom tool →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="aspect-video bg-slate-200 flex items-center justify-center">
                  {tool.image_urls && tool.image_urls.length > 0 ? (
                    <img
                      src={tool.image_urls[0]}
                      alt={tool.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Wrench className="h-16 w-16 text-slate-400" />
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 text-lg">{tool.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {tool.condition}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-500">From</p>
                      <p className="text-xl font-bold text-blue-600">
                        ${tool.rental_price_per_day}
                        <span className="text-sm font-normal text-slate-600">/day</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Available</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {tool.available_quantity} units
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/catalog/${tool.id}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
