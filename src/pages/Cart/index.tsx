import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { formatCurrency, generateOrderId, generateWhatsAppMessage, getWhatsAppLink } from '../../utils/whatsapp'

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems } = useCart()
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

  const handleCheckout = () => {
    setIsCheckoutLoading(true)
    
    // In a real app we might want to log this event to Supabase first before opening WhatsApp
    // For now we just generate the ID and open the link
    const orderId = generateOrderId()
    const message = generateWhatsAppMessage(orderId, cart, totalAmount)
    const whatsappUrl = getWhatsAppLink(message)
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
    
    // Clear cart or keep it? PRD implies keeping it or clearing it. We'll leave it for now.
    // clearCart()
    
    setTimeout(() => setIsCheckoutLoading(false), 1000)
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white rounded-lg border border-border-gray p-12 max-w-2xl mx-auto shadow-sm">
          <h2 className="text-3xl font-bold text-charcoal mb-4">Your cart is empty</h2>
          <p className="text-secondary-charcoal mb-8 text-lg">Looks like you haven't added any products to your cart yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange hover:bg-orange-dark transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center mb-8">
        <Link to="/shop" className="text-charcoal hover:text-orange flex items-center mr-4">
          <FiArrowLeft className="mr-2" /> Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold text-charcoal flex-grow">Shopping Cart</h1>
        <span className="text-secondary-charcoal font-medium">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-border-gray overflow-hidden shadow-sm">
            <ul className="divide-y divide-border-gray">
              {cart.map((item) => (
                <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row">
                  <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-light-gray rounded-md overflow-hidden mb-4 sm:mb-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-border-gray text-xs">No image</div>
                    )}
                  </div>
                  
                  <div className="sm:ml-6 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-charcoal">
                          <Link to={`/shop/${item.slug}`} className="hover:text-orange">{item.name}</Link>
                        </h3>
                        <p className="mt-1 text-sm text-secondary-charcoal">Unit Price: {formatCurrency(item.price)}</p>
                      </div>
                      <p className="text-lg font-bold text-charcoal">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border-gray rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-secondary-charcoal hover:text-orange focus:outline-none"
                        >
                          <FiMinus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-1 text-charcoal font-medium border-x border-border-gray min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-secondary-charcoal hover:text-orange focus:outline-none"
                        >
                          <FiPlus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-2 flex items-center text-sm font-medium transition-colors"
                      >
                        <FiTrash2 className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="p-4 bg-light-gray border-t border-border-gray flex justify-between items-center">
              <button 
                onClick={clearCart}
                className="text-secondary-charcoal hover:text-red-600 text-sm font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-lg border border-border-gray p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-charcoal mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-secondary-charcoal">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-secondary-charcoal">
                <span>Shipping</span>
                <span>Calculated on WhatsApp</span>
              </div>
              <div className="border-t border-border-gray pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-charcoal">Total</span>
                <span className="text-2xl font-bold text-orange">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
              className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-md font-bold text-lg flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {isCheckoutLoading ? 'Opening WhatsApp...' : 'Order via WhatsApp'}
            </button>
            <p className="mt-4 text-xs text-center text-secondary-charcoal">
              Clicking this will open WhatsApp with your order details pre-filled. No payment is taken online.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
