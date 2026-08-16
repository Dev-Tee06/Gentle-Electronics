import React from 'react'
import { Link } from 'react-router-dom'
import type { Database } from '../types/supabase'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/whatsapp'
import { getProductImage } from '../utils/imageFallback'

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
  product: Product
  categoryName?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, categoryName }) => {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border-gray overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <Link to={`/shop/${product.slug}`} className="block h-56 bg-light-gray overflow-hidden relative">
        <img 
          src={getProductImage(product.id, product.image_url)} 
          alt={product.name} 
          className="w-full h-full object-cover object-top" 
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        {categoryName && <span className="text-xs text-secondary-charcoal mb-1">{categoryName}</span>}
        <Link to={`/shop/${product.slug}`}>
          <h3 className="text-lg font-bold text-charcoal mb-1 line-clamp-1 hover:text-orange">{product.name}</h3>
        </Link>
        <p className="text-orange font-semibold mb-4">{formatCurrency(product.price)}</p>
        
        {product.description && (
          <p className="text-sm text-secondary-charcoal line-clamp-2 mb-4 flex-grow">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-light-gray">
          <button 
            onClick={() => addToCart(product)}
            className="w-full py-2 bg-charcoal text-white rounded hover:bg-secondary-charcoal transition-colors font-medium text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
