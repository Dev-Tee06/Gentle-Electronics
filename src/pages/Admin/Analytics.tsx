import React, { useEffect, useState } from 'react'
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiPackage, FiRefreshCw, FiAlertCircle } from 'react-icons/fi'
import { supabase } from '../../services/supabase/client'
import { formatCurrency } from '../../utils/whatsapp'

type DateRange = '7d' | '30d' | '90d' | 'all'

interface AnalyticsData {
  totalRevenue: number
  totalSales: number
  avgOrderValue: number
  totalItemsSold: number
  recentSales: any[]
  topProducts: { product_name: string; total_qty: number; total_revenue: number }[]
}

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getDateFilter = (range: DateRange): string | null => {
    const now = new Date()
    switch (range) {
      case '7d': return new Date(now.getTime() - 7 * 86400000).toISOString()
      case '30d': return new Date(now.getTime() - 30 * 86400000).toISOString()
      case '90d': return new Date(now.getTime() - 90 * 86400000).toISOString()
      case 'all': return null
    }
  }

  const fetchAnalytics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const dateFilter = getDateFilter(dateRange)

      // Fetch sales
      let salesQuery = supabase.from('sales').select('id, reference, total_amount, customer_name, created_at')
        .order('created_at', { ascending: false })
      if (dateFilter) salesQuery = salesQuery.gte('created_at', dateFilter)
      const { data: salesData, error: salesErr } = await salesQuery

      if (salesErr) throw salesErr

      const sales = salesData || []
      const totalRevenue = sales.reduce((sum: number, s: any) => sum + Number(s.total_amount), 0)
      const totalSales = sales.length
      const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0

      // Fetch sale items for the period
      let itemsQuery = supabase.from('sale_items').select('product_name, quantity, unit_price, subtotal, sale_id')
      if (dateFilter && sales.length > 0) {
        const saleIds = sales.map((s: any) => s.id)
        itemsQuery = itemsQuery.in('sale_id', saleIds)
      } else if (dateFilter && sales.length === 0) {
        // No sales in period, no items
        setData({
          totalRevenue: 0,
          totalSales: 0,
          avgOrderValue: 0,
          totalItemsSold: 0,
          recentSales: [],
          topProducts: []
        })
        setIsLoading(false)
        return
      }

      const { data: itemsData, error: itemsErr } = await itemsQuery
      if (itemsErr) throw itemsErr

      const items = itemsData || []
      const totalItemsSold = items.reduce((sum: number, i: any) => sum + Number(i.quantity), 0)

      // Top products by quantity
      const productMap = new Map<string, { total_qty: number; total_revenue: number }>()
      items.forEach((item: any) => {
        const existing = productMap.get(item.product_name) || { total_qty: 0, total_revenue: 0 }
        existing.total_qty += Number(item.quantity)
        existing.total_revenue += Number(item.subtotal)
        productMap.set(item.product_name, existing)
      })
      const topProducts = Array.from(productMap.entries())
        .map(([product_name, vals]) => ({ product_name, ...vals }))
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, 10)

      setData({
        totalRevenue,
        totalSales,
        avgOrderValue,
        totalItemsSold,
        recentSales: sales.slice(0, 10),
        topProducts
      })
    } catch (err: any) {
      console.error('Analytics error:', err)
      setError("We couldn't load analytics data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const dateRangeOptions: { value: DateRange; label: string }[] = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' },
  ]

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-charcoal mb-6">Analytics</h1>
        <div className="bg-white rounded-lg border border-border-gray shadow-sm p-12 text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-bold text-charcoal mb-2">Error Loading Analytics</h3>
          <p className="text-secondary-charcoal mb-6">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-dark transition-colors"
          >
            <FiRefreshCw className="mr-2" /> Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-charcoal">Analytics</h1>
        <div className="flex items-center gap-2">
          {dateRangeOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDateRange(opt.value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                dateRange === opt.value
                  ? 'bg-orange text-white'
                  : 'bg-white text-charcoal border border-border-gray hover:bg-light-gray'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white p-6 rounded-lg border border-border-gray shadow-sm h-28 animate-pulse">
              <div className="bg-light-gray h-4 w-20 mb-4 rounded"></div>
              <div className="bg-light-gray h-8 w-28 rounded"></div>
            </div>
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Revenue', value: formatCurrency(data.totalRevenue), icon: FiDollarSign, color: 'bg-green-100 text-green-600' },
              { title: 'Total Sales', value: data.totalSales.toString(), icon: FiShoppingCart, color: 'bg-blue-100 text-blue-600' },
              { title: 'Avg Order Value', value: formatCurrency(data.avgOrderValue), icon: FiTrendingUp, color: 'bg-orange/10 text-orange' },
              { title: 'Items Sold', value: data.totalItemsSold.toString(), icon: FiPackage, color: 'bg-purple-100 text-purple-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-border-gray shadow-sm flex items-center">
                <div className={`p-3 rounded-full mr-4 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-secondary-charcoal">{stat.title}</h3>
                  <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Sales */}
            <div className="bg-white rounded-lg border border-border-gray shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-gray">
                <h2 className="text-lg font-bold text-charcoal">Recent Sales</h2>
              </div>
              {data.recentSales.length === 0 ? (
                <div className="p-8 text-center text-secondary-charcoal">
                  <p>No sales data available for this period.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-light-gray text-secondary-charcoal text-xs uppercase tracking-wider">
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium">Reference</th>
                        <th className="px-6 py-3 font-medium">Customer</th>
                        <th className="px-6 py-3 font-medium text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-gray">
                      {data.recentSales.map((sale: any) => (
                        <tr key={sale.id} className="hover:bg-light-gray/50 transition-colors">
                          <td className="px-6 py-3 text-sm text-secondary-charcoal whitespace-nowrap">
                            {new Date(sale.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3 text-sm font-medium text-charcoal">{sale.reference}</td>
                          <td className="px-6 py-3 text-sm text-secondary-charcoal">{sale.customer_name || '-'}</td>
                          <td className="px-6 py-3 text-sm font-bold text-orange text-right">{formatCurrency(sale.total_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg border border-border-gray shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-gray">
                <h2 className="text-lg font-bold text-charcoal">Top Products</h2>
              </div>
              {data.topProducts.length === 0 ? (
                <div className="p-8 text-center text-secondary-charcoal">
                  <p>No product sales data available for this period.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-light-gray text-secondary-charcoal text-xs uppercase tracking-wider">
                        <th className="px-6 py-3 font-medium">Product</th>
                        <th className="px-6 py-3 font-medium text-right">Qty Sold</th>
                        <th className="px-6 py-3 font-medium text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-gray">
                      {data.topProducts.map((product, i) => (
                        <tr key={i} className="hover:bg-light-gray/50 transition-colors">
                          <td className="px-6 py-3 text-sm font-medium text-charcoal">{product.product_name}</td>
                          <td className="px-6 py-3 text-sm text-secondary-charcoal text-right">{product.total_qty}</td>
                          <td className="px-6 py-3 text-sm font-bold text-orange text-right">{formatCurrency(product.total_revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Analytics
