import React, { useEffect, useState } from 'react'
import { FiPlus, FiX } from 'react-icons/fi'
import { supabase } from '../../services/supabase/client'
import { formatCurrency } from '../../utils/whatsapp'

type Sale = {
  id: string
  reference: string
  sale_date: string
  total_amount: number
  customer_name: string | null
  customer_phone: string | null
  notes: string | null
  created_at: string
}

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  const [reference, setReference] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [notes, setNotes] = useState('')
  
  const [isSaving, setIsSaving] = useState(false)

  const fetchSales = async () => {
    setIsLoading(true)
    const { data } = await supabase.from('sales').select('*').order('created_at', { ascending: false })
    if (data) setSales(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSales()
  }, [])

  const resetForm = () => {
    setReference('')
    setTotalAmount('')
    setCustomerName('')
    setNotes('')
    setIsFormOpen(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const insertData = {
      reference,
      total_amount: parseFloat(totalAmount),
      customer_name: customerName,
      notes,
    }
    await supabase.from('sales').insert([insertData])

    setIsSaving(false)
    resetForm()
    fetchSales()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Confirmed Sales</h1>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-dark transition-colors"
          >
            <FiPlus className="mr-2" /> Record Sale
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg border border-border-gray shadow-sm mb-8 max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-charcoal">Record Confirmed Sale</h2>
            <button onClick={resetForm} className="text-secondary-charcoal hover:text-charcoal"><FiX className="h-6 w-6" /></button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Order Reference *</label>
                <input required type="text" value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g. GE-20260815-001" className="w-full px-3 py-2 border border-border-gray rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Total Amount (₦) *</label>
                <input required type="number" min="0" step="1" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} className="w-full px-3 py-2 border border-border-gray rounded-md" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal mb-1">Customer Name</label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-3 py-2 border border-border-gray rounded-md" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal mb-1">Notes</label>
                <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-3 py-2 border border-border-gray rounded-md" />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-light-gray mt-6">
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-border-gray rounded-md text-charcoal hover:bg-light-gray transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving} className="px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-dark transition-colors disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Record Sale'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sales List */}
      <div className="bg-white rounded-lg border border-border-gray shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-light-gray border-b border-border-gray text-secondary-charcoal text-sm uppercase">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Reference</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-gray">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-secondary-charcoal">Loading sales...</td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-secondary-charcoal">No sales recorded yet.</td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-light-gray/50">
                    <td className="px-6 py-4 whitespace-nowrap text-secondary-charcoal text-sm">
                      {new Date(sale.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-charcoal">{sale.reference}</td>
                    <td className="px-6 py-4 text-secondary-charcoal">{sale.customer_name || '-'}</td>
                    <td className="px-6 py-4 font-bold text-orange">{formatCurrency(sale.total_amount)}</td>
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

export default Sales
