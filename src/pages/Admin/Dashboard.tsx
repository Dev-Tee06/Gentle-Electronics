import React, { useEffect, useState } from 'react'
import { FiBox, FiList, FiDollarSign, FiShoppingCart } from 'react-icons/fi'
import { supabase } from '../../services/supabase/client'
import { formatCurrency } from '../../utils/whatsapp'

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    outOfStock: 0,
    totalCategories: 0,
    totalSalesCount: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      
      const [products, categories, sales] = await Promise.all([
        supabase.from('products').select('id, is_available'),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('sales').select('id, total_amount'),
      ])

      const totalProducts = products.data?.length || 0
      const availableProducts = products.data?.filter((p: { id: string; is_available: boolean }) => p.is_available).length || 0
      
      const totalSalesCount = sales.data?.length || 0
      const totalRevenue = sales.data?.reduce((sum: number, sale: { id: string; total_amount: number }) => sum + Number(sale.total_amount), 0) || 0

      setStats({
        totalProducts,
        availableProducts,
        outOfStock: totalProducts - availableProducts,
        totalCategories: categories.count || 0,
        totalSalesCount,
        totalRevenue,
      })

      setIsLoading(false)
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: FiDollarSign, color: 'bg-green-100 text-green-600' },
    { title: 'Confirmed Sales', value: stats.totalSalesCount.toString(), icon: FiShoppingCart, color: 'bg-blue-100 text-orange-dark' },
    { title: 'Total Products', value: stats.totalProducts.toString(), icon: FiBox, color: 'bg-purple-100 text-purple-600' },
    { title: 'Categories', value: stats.totalCategories.toString(), icon: FiList, color: 'bg-orange-100 text-orange-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-charcoal mb-6">Dashboard Overview</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white p-6 rounded-lg border border-border-gray shadow-sm h-32 animate-pulse">
              <div className="bg-light-gray h-4 w-24 mb-4 rounded"></div>
              <div className="bg-light-gray h-8 w-32 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-border-gray shadow-sm flex items-center">
              <div className={`p-4 rounded-full mr-4 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-secondary-charcoal mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-border-gray shadow-sm">
          <h2 className="text-lg font-bold text-charcoal mb-4">Inventory Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary-charcoal">Available Products</span>
              <span className="font-bold text-charcoal">{stats.availableProducts}</span>
            </div>
            <div className="w-full bg-light-gray rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${stats.totalProducts > 0 ? (stats.availableProducts / stats.totalProducts) * 100 : 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <span className="text-secondary-charcoal">Out of Stock / Hidden</span>
              <span className="font-bold text-charcoal">{stats.outOfStock}</span>
            </div>
            <div className="w-full bg-light-gray rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${stats.totalProducts > 0 ? (stats.outOfStock / stats.totalProducts) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-border-gray shadow-sm flex flex-col justify-center items-center text-center">
           <div className="p-4 bg-light-gray rounded-full mb-4">
             <FiDollarSign className="h-8 w-8 text-secondary-charcoal" />
           </div>
           <h3 className="text-lg font-bold text-charcoal mb-2">Ready for Sales</h3>
           <p className="text-sm text-secondary-charcoal max-w-xs">
             Your dashboard is ready. When customers checkout via WhatsApp and confirm payment, you can record sales in the Sales tab to track revenue.
           </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
