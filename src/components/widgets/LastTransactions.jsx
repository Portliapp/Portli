export default function LastTransactions() {
  return (
    <div className="card h-full flex flex-col">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mb-4">Ultime Transazioni</div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-[10px] text-textSecondary uppercase tracking-widest border-b border-borderAccent">
            <tr>
              <th className="pb-2 font-medium">Data</th>
              <th className="pb-2 font-medium">Asset</th>
              <th className="pb-2 font-medium">Tipo</th>
              <th className="pb-2 font-medium text-right">Importo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono text-xs">
            <tr>
              <td className="py-2">08-Jun</td>
              <td className="py-2 font-bold">TSLA</td>
              <td className="py-2 text-success">BUY</td>
              <td className="py-2 text-right">€1,200.00</td>
            </tr>
            <tr>
              <td className="py-2">05-Jun</td>
              <td className="py-2 font-bold">AAPL</td>
              <td className="py-2 text-loss">SELL</td>
              <td className="py-2 text-right">€3,450.00</td>
            </tr>
            <tr>
              <td className="py-2">01-Jun</td>
              <td className="py-2 font-bold">BTC</td>
              <td className="py-2 text-success">BUY</td>
              <td className="py-2 text-right">€500.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
