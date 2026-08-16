import React, { useEffect, useState } from 'react'
import { FiBox, FiDollarSign, FiShoppingCart, FiUsers } from 'react-icons/fi'
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
    totalCustomers: 0,
  })
  const [recentProducts, setRecentProducts] = useState<any[]>([])
  const [recentSales, setRecentSales] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      
      const [products, categories, sales, recentP, recentS] = await Promise.all([
        supabase.from('products').select('id, is_available'),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('sales').select('id, total_amount, customer_phone'),
        supabase.from('products').select('id, name, price, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('sales').select('id, customer_name, total_amount, created_at').order('created_at', { ascending: false }).limit(5),
      ])

      const totalProducts = products.data?.length || 0
      const availableProducts = products.data?.filter((p: { id: string; is_available: boolean }) => p.is_available).length || 0
      
      const totalSalesCount = sales.data?.length || 0
      const totalRevenue = sales.data?.reduce((sum: number, sale: { id: string; total_amount: number }) => sum + Number(sale.total_amount), 0) || 0
      
      const uniquePhones = new Set(sales.data?.map(s => s.customer_phone).filter(Boolean))
      const totalCustomers = uniquePhones.size

      if (recentP.data) setRecentProducts(recentP.data)
      if (recentS.data) setRecentSales(recentS.data)

      setStats({
        totalProducts,
        availableProducts,
        outOfStock: totalProducts - availableProducts,
        totalCategories: categories.count || 0,
        totalSalesCount,
        totalRevenue,
        totalCustomers,
      })

      setIsLoading(false)
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: FiDollarSign, color: 'bg-green-100 text-green-600' },
    { title: 'Confirmed Sales', value: stats.totalSalesCount.toString(), icon: FiShoppingCart, color: 'bg-blue-100 text-orange-dark' },
    { title: 'Total Customers', value: stats.totalCustomers.toString(), icon: FiUsers, color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Total Products', value: stats.totalProducts.toString(), icon: FiBox, color: 'bg-purple-100 text-purple-600' },
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg border border-border-gray shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border-gray flex justify-between items-center">
            <h2 className="text-lg font-bold text-charcoal">Recent Sales</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-light-gray/50 text-secondary-charcoal text-xs uppercase tracking-wider border-b border-border-gray">
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray">
                {recentSales.length > 0 ? recentSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-light-gray/50">
                    <td className="px-6 py-3 font-medium text-charcoal text-sm">{sale.customer_name}</td>
                    <td className="px-6 py-3 font-medium text-green-600 text-sm">{formatCurrency(sale.total_amount)}</td>
                    <td className="px-6 py-3 text-secondary-charcoal text-sm">{new Date(sale.created_at).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="px-6 py-4 text-center text-secondary-charcoal text-sm">No recent sales</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border-gray shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border-gray flex justify-between items-center">
            <h2 className="text-lg font-bold text-charcoal">Recently Added Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-light-gray/50 text-secondary-charcoal text-xs uppercase tracking-wider border-b border-border-gray">
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray">
                {recentProducts.length > 0 ? recentProducts.map(product => (
                  <tr key={product.id} className="hover:bg-light-gray/50">
                    <td className="px-6 py-3 font-medium text-charcoal text-sm">{product.name}</td>
                    <td className="px-6 py-3 font-medium text-orange text-sm">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-3 text-secondary-charcoal text-sm">{new Date(product.created_at).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="px-6 py-4 text-center text-secondary-charcoal text-sm">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
