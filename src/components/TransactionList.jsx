import { format } from 'date-fns'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function TransactionList({ transactions }) {
  if (!transactions?.length) {
    return (
      <div className="text-center py-8 text-textSecondary">
        No transactions yet. Add your first trade to get started!
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-textSecondary border-b border-border">
          <tr>
            <th className="pb-3 font-medium">Asset</th>
            <th className="pb-3 font-medium">Type</th>
            <th className="pb-3 font-medium text-right">Price</th>
            <th className="pb-3 font-medium text-right">Quantity</th>
            <th className="pb-3 font-medium text-right">Total Value</th>
            <th className="pb-3 font-medium text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="py-4">
                <div className="font-semibold text-white">{tx.ticker}</div>
                <div className="text-xs text-textSecondary">{tx.asset_name}</div>
              </td>
              <td className="py-4">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                  tx.operation_type === 'BUY' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                }`}>
                  {tx.operation_type === 'BUY' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                  {tx.operation_type}
                </div>
              </td>
              <td className="py-4 text-right tabular-nums">
                {tx.price.toLocaleString('en-US', { style: 'currency', currency: tx.currency })}
              </td>
              <td className="py-4 text-right tabular-nums">
                {tx.quantity}
              </td>
              <td className="py-4 text-right tabular-nums font-medium">
                {(tx.price * tx.quantity).toLocaleString('en-US', { style: 'currency', currency: tx.currency })}
              </td>
              <td className="py-4 text-right text-textSecondary">
                {format(new Date(tx.transaction_date), 'MMM d, yyyy')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
