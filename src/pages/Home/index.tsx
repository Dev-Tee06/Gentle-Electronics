import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheckCircle, FiHeadphones, FiShield } from 'react-icons/fi'
import { supabase } from '../../services/supabase/client'
import type { Database } from '../../types/supabase'
import { getProductImage } from '../../utils/imageFallback'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true)
      
      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('is_available', true),
        supabase
          .from('categories')
          .select('*')
      ])

      if (productsRes.data) setProducts(productsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      
      setIsLoading(false)
    }

    fetchHomeData()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative bg-light-gray overflow-hidden border-b border-border-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 pr-0 md:pr-12 text-center md:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-orange/10 text-orange-dark text-sm font-semibold tracking-wider uppercase mb-6 border border-orange/20">
              Featured Collection
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-charcoal tracking-tight mb-6 leading-tight">
              Power Up Your World With <span className="text-orange">Better Technology.</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-secondary-charcoal max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed">
              Explore smartphones, laptops, accessories, smart devices and more — carefully selected to bring quality technology closer to you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-md text-white bg-orange hover:bg-orange-dark transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Shop Now
                <FiArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-border-gray text-base font-medium rounded-md text-charcoal bg-white hover:bg-light-gray transition-colors shadow-sm"
              >
                Explore Products
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-16 md:mt-0 relative">
            <div className="absolute inset-0 bg-orange/10 rounded-full blur-3xl filter"></div>
            <img 
              src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1000" 
              alt="Premium Electronics" 
              className="relative z-10 w-full h-auto object-cover rounded-2xl shadow-2xl border border-white"
            />
          </div>
        </div>
      </section>

      {/* Trust/Value Indicators */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-border-gray">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-light-gray flex items-center justify-center text-orange mb-4 border border-border-gray">
                <FiCheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-charcoal mb-2">Quality Products</h3>
              <p className="text-sm text-secondary-charcoal">Carefully selected electronics from trusted brands.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-light-gray flex items-center justify-center text-orange mb-4 border border-border-gray">
                <span className="font-bold text-xl">₦</span>
              </div>
              <h3 className="text-lg font-bold text-charcoal mb-2">Competitive Pricing</h3>
              <p className="text-sm text-secondary-charcoal">Great technology at competitive prices.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-light-gray flex items-center justify-center text-orange mb-4 border border-border-gray">
                <FiShield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-charcoal mb-2">Secure Shopping</h3>
              <p className="text-sm text-secondary-charcoal">A smooth and secure shopping experience.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-light-gray flex items-center justify-center text-orange mb-4 border border-border-gray">
                <FiHeadphones className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-charcoal mb-2">Reliable Support</h3>
              <p className="text-sm text-secondary-charcoal">Customer assistance when you need it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-light-orange text-charcoal relative overflow-hidden border-b border-border-gray">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-orange/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-orange/20 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">Upgrade Your Tech Setup</h2>
          <p className="text-lg md:text-xl text-secondary-charcoal mb-10 max-w-2xl mx-auto leading-relaxed">
            Find the devices and accessories that fit your lifestyle, work, entertainment, and everyday needs. Experience premium quality.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-md text-white bg-orange hover:bg-orange-dark transition-all shadow-lg transform hover:-translate-y-0.5"
          >
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">Shop by Category</h2>
            <p className="mt-2 text-secondary-charcoal">Browse our extensive catalog.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {isLoading ? (
               [1, 2, 3].map(n => (
                <div key={n} className="bg-white rounded-2xl shadow-sm border border-border-gray p-4 h-72 animate-pulse">
                  <div className="bg-light-gray h-48 rounded-xl mb-4"></div>
                  <div className="bg-light-gray h-6 rounded-md w-1/2"></div>
                </div>
               ))
            ) : categories.length > 0 ? (
              categories.map(category => {
                const categoryProduct = products.find(p => p.category_id === category.id)
                const imageSrc = category.image_url || categoryProduct?.image_url || getProductImage(category.id, null)
                return (
                  <Link 
                    key={category.id} 
                    to={`/shop?category=${category.slug}`}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-border-gray hover:border-orange/50 overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="h-56 bg-light-gray overflow-hidden relative">
                      <img 
                        src={imageSrc} 
                        alt={category.name} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow bg-white border-t border-border-gray">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-charcoal group-hover:text-orange transition-colors">
                          {category.name}
                        </h3>
                        <FiArrowRight className="h-4 w-4 text-orange transform group-hover:translate-x-1 transition-transform" />
                      </div>
                      {category.description && (
                        <p className="text-sm text-secondary-charcoal mt-1 line-clamp-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })
            ) : (
               <div className="col-span-full text-center py-10">
                 <p className="text-secondary-charcoal">Categories loading or unavailable.</p>
               </div>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
