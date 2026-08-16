import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiFilter } from 'react-icons/fi'
import { supabase } from '../../services/supabase/client'
import type { Database } from '../../types/supabase'
import { ProductCard } from '../../components/ProductCard'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const currentCategorySlug = searchParams.get('category') || 'all'

  useEffect(() => {
    const fetchShopData = async () => {
      setIsLoading(true)
      
      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('is_available', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
      ])

      if (productsRes.data) setProducts(productsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      
      setIsLoading(false)
    }

    fetchShopData()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filter by category
      let categoryMatch = true
      if (currentCategorySlug !== 'all') {
        const cat = categories.find(c => c.slug === currentCategorySlug)
        if (cat) {
          categoryMatch = product.category_id === cat.id
        } else {
          categoryMatch = false
        }
      }

      // Filter by search
      const searchLower = searchQuery.toLowerCase()
      const searchMatch = 
        product.name.toLowerCase().includes(searchLower) ||
        (product.description?.toLowerCase() || '').includes(searchLower)

      return categoryMatch && searchMatch
    })
  }, [products, categories, currentCategorySlug, searchQuery])

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', slug)
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-charcoal mb-8">Shop All Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-border-gray rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center">
              <FiFilter className="mr-2" /> Filters
            </h2>
            
            <div className="mb-6">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="focus:ring-orange focus:border-orange block w-full pl-10 sm:text-sm border-border-gray rounded-md py-2 border"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-3">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`text-left w-full text-sm ${currentCategorySlug === 'all' ? 'text-orange font-bold' : 'text-secondary-charcoal hover:text-charcoal'}`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryChange(category.slug)}
                      className={`text-left w-full text-sm ${currentCategorySlug === category.slug ? 'text-orange font-bold' : 'text-secondary-charcoal hover:text-charcoal'}`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white rounded-lg shadow-sm border border-border-gray p-4 h-80 animate-pulse">
                  <div className="bg-light-gray h-48 rounded-md mb-4"></div>
                  <div className="bg-light-gray h-6 rounded-md w-3/4 mb-2"></div>
                  <div className="bg-light-gray h-4 rounded-md w-1/4"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => {
                const category = categories.find(c => c.id === product.category_id)
                return (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    categoryName={category?.name} 
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg border border-border-gray">
              <h3 className="text-xl font-medium text-charcoal mb-2">No products found</h3>
              <p className="text-secondary-charcoal">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => { setSearchQuery(''); handleCategoryChange('all') }}
                className="mt-4 text-orange hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop
