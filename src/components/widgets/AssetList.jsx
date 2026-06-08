import { useState, useEffect } from 'react'
import { getLiveMockAssets } from '../../services/dataService'

export default function AssetList() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAssets() {
      const liveAssets = await getLiveMockAssets()
      setAssets(liveAssets)
      setLoading(false)
    }
    loadAssets()
  }, [])

  return (
    <div className="card h-full flex flex-col">
      <div className="flex justify-between items-center border-b border-borderAccent pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[var(--shadow-glow-accent)] animate-pulse"></div>
          <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono font-bold">
            I MIEI ASSET CORRENTI ({assets.length})
          </div>
        </div>
        <button className="text-[10px] text-primary font-mono font-bold hover:underline">VEDI TUTTI →</button>
      </div>
      
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-none pr-1">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-textSecondary text-[10px] font-mono">
            Connessione a Finnhub e Supabase in corso...
          </div>
        ) : (
          assets.map(asset => (
            <div key={asset.ticker} className="flex justify-between items-center p-3 rounded-lg bg-surface hover:bg-borderAccent/30 transition-colors border border-transparent hover:border-borderAccent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-xs font-bold border border-borderAccent text-textPrimary">
                  {asset.ticker.substring(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-bold text-textPrimary">{asset.ticker}</div>
                  <div className="text-[10px] text-textSecondary font-mono">{asset.quantity} quote a ${asset.avgPrice.toFixed(2)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-textPrimary">${asset.totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                <div className={`text-[10px] font-mono font-bold ${asset.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {asset.pnl >= 0 ? '+' : ''}${asset.pnl.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ({asset.pnlPercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="text-[9px] font-mono text-textSecondary/70 mt-4 pt-3 border-t border-borderAccent flex items-center gap-2">
        <span className="text-primary">⚡</span> I prezzi sono reali. Fetch da Finnhub, salvati nella cache di Supabase.
      </div>
    </div>
  )
}
