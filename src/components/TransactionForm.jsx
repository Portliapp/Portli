import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { X } from 'lucide-react'

export default function TransactionForm({ onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    ticker: '',
    asset_name: '',
    operation_type: 'BUY',
    quantity: '',
    price: '',
    currency: 'USD',
    fee: '0',
    transaction_date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      
      const payload = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        price: parseFloat(formData.price),
        fee: parseFloat(formData.fee),
      }

      const { error } = await supabase
        .from('transactions')
        .insert([payload])

      if (error) throw error
      onSuccess()
    } catch (error) {
      console.error('Error adding transaction:', error.message)
      alert('Failed to add transaction. Check console for details.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="card w-full max-w-lg bg-surface relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-textSecondary hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-6 text-white">Add Transaction</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Ticker</label>
              <input 
                required
                name="ticker"
                value={formData.ticker}
                onChange={handleChange}
                placeholder="e.g. AAPL"
                className="input uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Asset Name</label>
              <input 
                required
                name="asset_name"
                value={formData.asset_name}
                onChange={handleChange}
                placeholder="Apple Inc."
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Type</label>
              <select 
                name="operation_type"
                value={formData.operation_type}
                onChange={handleChange}
                className="input appearance-none"
              >
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Date</label>
              <input 
                required
                type="date"
                name="transaction_date"
                value={formData.transaction_date}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Quantity</label>
              <input 
                required
                type="number"
                step="any"
                min="0"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0.0"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Price</label>
              <input 
                required
                type="number"
                step="any"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">Currency</label>
              <select 
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="input appearance-none"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">Fee</label>
            <input 
              type="number"
              step="any"
              min="0"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              placeholder="0.00"
              className="input"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 btn bg-white/5 hover:bg-white/10 text-white"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 btn btn-primary"
            >
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
