import React, { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage } from 'react-icons/fi'
import { supabase } from '../../services/supabase/client'

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const fetchCategories = async () => {
    setIsLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) setCategories(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const resetForm = () => {
    setName('')
    setDescription('')
    setImageUrl('')
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleEdit = (category: Category) => {
    setName(category.name)
    setDescription(category.description || '')
    setImageUrl(category.image_url || '')
    setEditingId(category.id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? Products in this category will become uncategorized.')) {
      await supabase.from('categories').delete().eq('id', id)
      fetchCategories()
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `category-images/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)
        
      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message)
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
    const categoryPayload = { 
      name, 
      slug: autoSlug, 
      description,
      image_url: imageUrl || null
    }

    if (editingId) {
      await supabase.from('categories').update(categoryPayload).eq('id', editingId)
    } else {
      await supabase.from('categories').insert([categoryPayload])
    }

    setIsSaving(false)
    resetForm()
    fetchCategories()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Categories</h1>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-dark transition-colors"
          >
            <FiPlus className="mr-2" /> Add Category
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg border border-border-gray shadow-sm mb-8 max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-charcoal">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
            <button onClick={resetForm} className="text-secondary-charcoal hover:text-charcoal"><FiX className="h-6 w-6" /></button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Name *</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-border-gray rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
              <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-border-gray rounded-md" />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Category Image</label>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 aspect-video bg-light-gray rounded-lg border border-border-gray flex flex-col items-center justify-center overflow-hidden relative">
                  {imageUrl ? (
                    <>
                      <img src={imageUrl} alt="Category preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-red-50">
                        <FiTrash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-secondary-charcoal flex flex-col items-center">
                      <FiImage size={32} className="mb-2 opacity-50" />
                      <span className="text-sm">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-secondary-charcoal mb-1">Upload File</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      disabled={isUploading}
                      className="text-sm text-secondary-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange/10 file:text-orange hover:file:bg-orange/20 cursor-pointer" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-secondary-charcoal mb-1">Or Image URL</label>
                    <input 
                      type="url" 
                      value={imageUrl} 
                      onChange={e => setImageUrl(e.target.value)} 
                      placeholder="https://example.com/image.jpg" 
                      className="w-full px-3 py-2 border border-border-gray rounded-md text-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-light-gray mt-6">
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-border-gray rounded-md text-charcoal hover:bg-light-gray transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving || isUploading} className="px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-dark transition-colors disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category List */}
      <div className="bg-white rounded-lg border border-border-gray shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-light-gray border-b border-border-gray text-secondary-charcoal text-sm uppercase">
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-gray">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-secondary-charcoal">Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-secondary-charcoal">No categories found.</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-light-gray/50">
                    <td className="px-6 py-4 font-medium text-charcoal">
                      <div className="flex items-center">
                        {category.image_url && (
                          <img src={category.image_url} alt="" className="h-8 w-8 rounded-full object-cover mr-3 border border-border-gray" />
                        )}
                        <span>{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary-charcoal">{category.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(category)} className="text-orange hover:text-orange-dark mr-3 inline-flex items-center">
                        <FiEdit2 className="mr-1" /> Edit
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:text-red-700 inline-flex items-center">
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Categories
