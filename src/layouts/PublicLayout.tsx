import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi'
import { useCart } from '../context/CartContext'

export const PublicLayout: React.FC = () => {
  const { totalItems } = useCart()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className="flex flex-col min-h-screen bg-white text-charcoal">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-border-gray shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-charcoal hover:text-orange transition-colors">
                Gentle Electronics
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-charcoal hover:text-orange px-3 py-2 text-sm font-medium transition-colors">Home</Link>
              <Link to="/shop" className="text-charcoal hover:text-orange px-3 py-2 text-sm font-medium transition-colors">Shop</Link>
              <Link to="/contact" className="text-charcoal hover:text-orange px-3 py-2 text-sm font-medium transition-colors">Contact</Link>
            </nav>

            <div className="hidden md:flex items-center">
              <Link to="/cart" className="relative p-2 text-charcoal hover:text-orange transition-colors">
                <FiShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-4">
              <Link to="/cart" className="relative p-2 text-charcoal hover:text-orange transition-colors">
                <FiShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleMenu}
                className="text-charcoal hover:text-orange focus:outline-none p-2"
              >
                {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-border-gray">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-charcoal hover:bg-light-gray rounded-md">Home</Link>
              <Link to="/shop" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-charcoal hover:bg-light-gray rounded-md">Shop</Link>
              <Link to="/contact" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-charcoal hover:bg-light-gray rounded-md">Contact</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="bg-light-gray text-charcoal pt-16 pb-8 border-t-4 border-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-extrabold mb-4 text-orange tracking-tight">Gentle Electronics</h3>
              <p className="text-secondary-charcoal text-sm leading-relaxed mb-6">
                Premium electronics, intelligent devices, and modern appliances. Find exactly what you need to elevate your lifestyle.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 text-charcoal uppercase tracking-wider text-sm">Quick Links</h3>
              <ul className="space-y-3 text-sm text-secondary-charcoal">
                <li><Link to="/" className="hover:text-orange transition-colors inline-block transform hover:translate-x-1 duration-200">Home</Link></li>
                <li><Link to="/shop" className="hover:text-orange transition-colors inline-block transform hover:translate-x-1 duration-200">Shop All</Link></li>
                <li><Link to="/contact" className="hover:text-orange transition-colors inline-block transform hover:translate-x-1 duration-200">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 text-charcoal uppercase tracking-wider text-sm">Customer</h3>
              <ul className="space-y-3 text-sm text-secondary-charcoal">
                <li><Link to="/cart" className="hover:text-orange transition-colors inline-block transform hover:translate-x-1 duration-200">Your Cart</Link></li>
                <li><Link to="/contact" className="hover:text-orange transition-colors inline-block transform hover:translate-x-1 duration-200">Track Order</Link></li>
                <li><Link to="/contact" className="hover:text-orange transition-colors inline-block transform hover:translate-x-1 duration-200">Support</Link></li>
                <li><Link to="/contact" className="hover:text-orange transition-colors inline-block transform hover:translate-x-1 duration-200">FAQs</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 text-charcoal uppercase tracking-wider text-sm">Contact & Social</h3>
              <ul className="space-y-3 text-sm text-secondary-charcoal">
                <li className="flex items-center">
                  <span className="text-orange mr-2">WhatsApp:</span> 
                  <a href="https://wa.me/2347061158745" target="_blank" rel="noopener noreferrer" className="hover:text-charcoal transition-colors">0706 115 8745</a>
                </li>
                <li className="flex items-center mt-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center text-orange hover:bg-orange hover:text-white transition-all duration-300 mr-3">
                    <span className="sr-only">Facebook</span>
                    FB
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center text-orange hover:bg-orange hover:text-white transition-all duration-300 mr-3">
                    <span className="sr-only">Instagram</span>
                    IG
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center text-orange hover:bg-orange hover:text-white transition-all duration-300">
                    <span className="sr-only">Twitter</span>
                    TW
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border-gray flex flex-col md:flex-row justify-center items-center text-xs text-secondary-charcoal">
            <p>&copy; {new Date().getFullYear()} Gentle Electronics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
