import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiPlus, FiMinus, FiCheck, FiTruck, FiShield } from 'react-icons/fi'
import { supabase } from '../../services/supabase/client'
import type { Database } from '../../types/supabase'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/whatsapp'
import { getProductImage } from '../../utils/imageFallback'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

const ProductDetails: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) return
      
      setIsLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', productSlug)
        .single()

      if (error) {
        setIsLoading(false)
        return
      }

      const productData = data as Product | null

      if (!productData) {
        setIsLoading(false)
        return
      }

      setProduct(productData)

      if (productData.category_id) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('*')
          .eq('id', productData.category_id)
          .single()
        
        if (categoryData) {
          setCategory(categoryData as Category)
        }
      }

      setIsLoading(false)
    }

    fetchProduct()
  }, [productSlug])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="animate-pulse flex flex-col md:flex-row gap-12 w-full">
          <div className="bg-light-gray h-96 w-full md:w-1/2 rounded-lg"></div>
          <div className="flex-1 space-y-6 py-4">
            <div className="h-4 bg-light-gray w-1/4 rounded"></div>
            <div className="h-10 bg-light-gray w-3/4 rounded"></div>
            <div className="h-8 bg-light-gray w-1/3 rounded"></div>
            <div className="h-24 bg-light-gray w-full rounded"></div>
            <div className="h-12 bg-light-gray w-1/2 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-charcoal mb-4">Product Not Found</h2>
        <p className="text-secondary-charcoal mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/shop')} className="text-orange hover:underline flex items-center justify-center mx-auto">
          <FiArrowLeft className="mr-2" /> Back to Shop
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/shop" className="text-secondary-charcoal hover:text-orange flex items-center mb-8 inline-flex">
        <FiArrowLeft className="mr-2" /> Back to Shop
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-border-gray overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-1/2 h-96 md:h-auto bg-light-gray relative">
            <img src={getProductImage(product.id, product.image_url)} alt={product.name} className="w-full h-full object-cover object-top absolute inset-0" />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
            {category && (
              <Link to={`/shop?category=${category.slug}`} className="text-sm font-medium text-orange mb-2 hover:underline">
                {category.name}
              </Link>
            )}
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-charcoal mb-4">
              {product.name}
            </h1>
            
            <p className="text-2xl font-bold text-charcoal mb-6">
              {formatCurrency(product.price)}
            </p>

            <div className="prose prose-sm text-secondary-charcoal mb-8 flex-grow">
              {product.description ? (
                <p className="whitespace-pre-wrap">{product.description}</p>
              ) : (
                <p className="italic">No description provided.</p>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-charcoal">Quantity:</span>
                <div className="flex items-center border border-border-gray rounded-md bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-secondary-charcoal hover:text-orange focus:outline-none"
                  >
                    <FiMinus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-charcoal font-medium border-x border-border-gray min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-secondary-charcoal hover:text-orange focus:outline-none"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.is_available}
                className={`w-full py-4 rounded-md font-bold text-lg flex items-center justify-center transition-all ${
                  isAdded 
                    ? 'bg-green-500 text-white' 
                    : !product.is_available 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange hover:bg-orange-dark text-white'
                }`}
              >
                {isAdded ? (
                  <><FiCheck className="mr-2" /> Added to Cart</>
                ) : !product.is_available ? (
                  'Out of Stock'
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-light-gray grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-secondary-charcoal">
                <FiTruck className="mr-2 h-5 w-5 text-orange" />
                Delivery arranged via WhatsApp
              </div>
              <div className="flex items-center text-sm text-secondary-charcoal">
                <FiShield className="mr-2 h-5 w-5 text-orange" />
                Quality Guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
