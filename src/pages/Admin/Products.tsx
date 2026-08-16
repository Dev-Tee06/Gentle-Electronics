import React, { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiImage } from 'react-icons/fi'
import { supabase } from '../../services/supabase/client'
import type { Database } from '../../types/supabase'
import { formatCurrency } from '../../utils/whatsapp'
import { getProductImage } from '../../utils/imageFallback'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    const [pRes, cRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name')
    ])
    if (pRes.data) setProducts(pRes.data)
    if (cRes.data) setCategories(cRes.data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const resetForm = () => {
    setName('')
    setSlug('')
    setPrice('')
    setDescription('')
    setCategoryId('')
    setImageUrl('')
    setIsAvailable(true)
    setIsFeatured(false)
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleEdit = (product: Product) => {
    setName(product.name)
    setSlug(product.slug)
    setPrice(product.price.toString())
    setDescription(product.description || '')
    setCategoryId(product.category_id || '')
    setImageUrl(product.image_url || '')
    setIsAvailable(product.is_available)
    setIsFeatured(product.is_featured)
    setEditingId(product.id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchData()
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `product-images/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('products') // Assuming a bucket named 'products'
        .upload(filePath, file)
        
      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message + '\n\nPlease ensure the "products" storage bucket exists in Supabase and is public.')
        return
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)
        
      setImageUrl(publicUrl)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    const productPayload = {
      name,
      slug: slug || autoSlug,
      price: parseFloat(price),
      description,
      category_id: categoryId || null,
      image_url: imageUrl || null,
      is_available: isAvailable,
      is_featured: isFeatured,
    }

    if (editingId) {
      await supabase.from('products').update(productPayload).eq('id', editingId)
    } else {
      await supabase.from('products').insert([productPayload])
    }

    setIsSaving(false)
    resetForm()
    fetchData()
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-charcoal">Products</h1>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-dark transition-colors whitespace-nowrap"
          >
            <FiPlus className="mr-2" /> Add Product
          </button>
        )}
      </div>

      {!isFormOpen && (
        <div className="bg-white p-4 rounded-lg border border-border-gray shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-border-gray rounded-md"
            />
          </div>
          <div className="w-full md:w-48">
            <select 
              value={filterCategory} 
              onChange={e => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border-gray rounded-md bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="w-full md:w-48">
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-border-gray rounded-md bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      )}


      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg border border-border-gray shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-charcoal">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={resetForm} className="text-secondary-charcoal hover:text-charcoal"><FiX className="h-6 w-6" /></button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Name *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-border-gray rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Slug (URL)</label>
                <input type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="Auto-generated if empty" className="w-full px-3 py-2 border border-border-gray rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Price (₦) *</label>
                <input required type="number" min="0" step="1" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-2 border border-border-gray rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Category</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-3 py-2 border border-border-gray rounded-md bg-white">
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-border-gray rounded-md" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal mb-2">Product Image</label>
                
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image Preview */}
                  <div className="w-full md:w-1/3 aspect-video bg-light-gray rounded-lg border border-border-gray flex flex-col items-center justify-center overflow-hidden relative">
                    {imageUrl ? (
                      <>
                        <img src={imageUrl} alt="Product preview" className="w-full h-full object-contain" />
                        <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-red-50">
                          <FiTrash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="text-secondary-charcoal flex flex-col items-center">
                        <FiImage size={32} className="mb-2 opacity-50" />
                        <span className="text-sm">No image provided</span>
                        {editingId && <span className="text-xs text-orange mt-1">Fallback will be used</span>}
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Controls */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-charcoal mb-1">Upload from Computer</label>
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          disabled={isUploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                        />
                        <div className={`w-full px-4 py-3 border border-dashed border-border-gray rounded-lg flex items-center justify-center transition-colors ${isUploading ? 'bg-light-gray' : 'hover:bg-orange/5 hover:border-orange'}`}>
                          {isUploading ? (
                            <span className="text-charcoal font-medium">Uploading...</span>
                          ) : (
                            <>
                              <FiUpload className="mr-2 text-orange" />
                              <span className="text-charcoal font-medium">Click to browse or drag file</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-border-gray"></div>
                      <span className="flex-shrink-0 mx-4 text-xs text-secondary-charcoal uppercase">OR</span>
                      <div className="flex-grow border-t border-border-gray"></div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-charcoal mb-1">Image URL</label>
                      <input 
                        type="url" 
                        value={imageUrl} 
                        onChange={e => setImageUrl(e.target.value)} 
                        placeholder="https://example.com/image.jpg" 
                        className="w-full px-3 py-2 border border-border-gray rounded-md focus:outline-none focus:ring-1 focus:ring-orange" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 md:col-span-2 pt-2">
                <label className="flex items-center">
                  <input type="checkbox" checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} className="mr-2 rounded text-orange focus:ring-orange" />
                  <span className="text-sm font-medium text-charcoal">Available (In Stock)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="mr-2 rounded text-orange focus:ring-orange" />
                  <span className="text-sm font-medium text-charcoal">Featured</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-light-gray mt-6">
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-border-gray rounded-md text-charcoal hover:bg-light-gray transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving || isUploading} className="px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-dark transition-colors disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-lg border border-border-gray shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-light-gray border-b border-border-gray text-secondary-charcoal text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-gray">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-secondary-charcoal">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-6 w-24 bg-border-gray rounded mb-4"></div>
                      <div className="text-sm">Loading products...</div>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-secondary-charcoal">
                    <div className="flex flex-col items-center">
                      <FiImage size={32} className="mb-3 opacity-20" />
                      <p>No products found. Add your first product.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products
                  .filter(product => {
                    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
                    const matchesCategory = filterCategory ? product.category_id === filterCategory : true
                    const matchesStatus = filterStatus === 'all' 
                      ? true 
                      : filterStatus === 'available' 
                        ? product.is_available 
                        : !product.is_available
                    
                    return matchesSearch && matchesCategory && matchesStatus
                  })
                  .map((product) => {
                  const category = categories.find(c => c.id === product.category_id)
                  return (
                    <tr key={product.id} className="hover:bg-light-gray/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 bg-light-gray rounded-md border border-border-gray overflow-hidden">
                            <img src={getProductImage(product.id, product.image_url)} alt="" className="h-full w-full object-cover object-top" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-charcoal">{product.name}</div>
                            {product.is_featured && <span className="text-xs text-orange font-bold uppercase tracking-wide">Featured</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-charcoal font-medium">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-secondary-charcoal">
                        {category ? category.name : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_available ? 'Available' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(product)} className="text-orange hover:text-orange-dark mr-4 inline-flex items-center transition-colors">
                          <FiEdit2 className="mr-1.5" /> Edit
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 inline-flex items-center transition-colors">
                          <FiTrash2 className="mr-1.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Products
