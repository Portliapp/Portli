import { Activity } from 'lucide-react'

export default function IndicesLive() {
  const indices = [
    { name: 'S&P 500', value: '5310,72', change: '+0.77%', pos: true },
    { name: 'NASDAQ 100', value: '18.672,16', change: '+1.89%', pos: true },
    { name: 'EURO STOXX 50', value: '5042,44', change: '-0.36%', pos: false },
    { name: 'FTSE MIB', value: '34.543,36', change: '+0.39%', pos: true },
  ]

  return (
    <div className="card flex flex-col h-[200px]">
      <div className="flex justify-between items-center border-b border-borderAccent pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-primary" />
          <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono font-bold">INDICI GLOBALI LIVE</div>
        </div>
        <div className="text-[9px] font-mono text-textSecondary">⟳ RETE SINLAPI</div>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 flex-1">
        {indices.map(idx => (
          <div key={idx.name} className="flex flex-col justify-between border-b border-borderAccent/50 pb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-mono font-bold text-textSecondary">{idx.name}</span>
              <span className={`text-[9px] font-mono font-bold ${idx.pos ? 'text-profit' : 'text-loss'}`}>{idx.change}</span>
            </div>
            <div className="text-sm font-mono font-bold">{idx.value}</div>
            <div className="w-full h-0.5 mt-1 bg-background rounded overflow-hidden">
              <div className={`h-full ${idx.pos ? 'bg-profit' : 'bg-loss'}`} style={{ width: `${Math.random() * 60 + 20}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
