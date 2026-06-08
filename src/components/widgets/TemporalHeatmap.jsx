import { Calendar } from 'lucide-react'

export default function TemporalHeatmap() {
  const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
  const cols = Array.from({ length: 15 }) // 15 settimane simulate
  
  // Funzione mock per generare colori casuali della heatmap
  const getCellColor = () => {
    const val = Math.random()
    if (val > 0.8) return 'bg-profit shadow-[var(--shadow-glow-profit)]'
    if (val > 0.6) return 'bg-profit/50'
    if (val > 0.4) return 'bg-loss/50'
    if (val > 0.2) return 'bg-loss shadow-[var(--shadow-glow-loss)]'
    return 'bg-borderAccent/30'
  }

  return (
    <div className="card h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-primary" />
          <div>
            <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono font-bold">
              HEATMAP RENDIMENTO SETTIMANALE
            </div>
            <div className="text-[9px] text-textSecondary/70 font-mono">
              Frequenza temporale della PnL giornaliera del portafoglio (ultimi 100+ giorni)
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="border border-primary text-primary px-2 py-1 rounded text-[9px] font-mono hover:bg-primary/10">RENDIMENTO %</button>
          <button className="border border-borderAccent text-textSecondary px-2 py-1 rounded text-[9px] font-mono hover:bg-surfaceHover">CAPITALE ($)</button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-4 overflow-x-auto">
        <div className="flex gap-2">
          <div className="flex flex-col justify-between text-[9px] font-mono text-textSecondary pr-2 py-1">
            {days.map(d => <div key={d}>{d}</div>)}
          </div>
          {cols.map((_, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1.5">
              {days.map((_, rowIdx) => (
                <div 
                  key={`${colIdx}-${rowIdx}`} 
                  className={`w-4 h-4 rounded-sm ${getCellColor()} cursor-pointer hover:ring-1 hover:ring-white transition-all`}
                  title="Valore simulato"
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2 text-[9px] font-mono text-textSecondary">
        <div>ⓘ Scegli una cella per scansionare i dettagli e visualizzare i trend performance.</div>
        <div className="flex items-center gap-1">
          <span>Peggiore</span>
          <div className="w-3 h-3 rounded-sm bg-loss"></div>
          <div className="w-3 h-3 rounded-sm bg-loss/50"></div>
          <div className="w-3 h-3 rounded-sm bg-borderAccent/30"></div>
          <div className="w-3 h-3 rounded-sm bg-profit/50"></div>
          <div className="w-3 h-3 rounded-sm bg-profit"></div>
          <span>Migliore</span>
        </div>
      </div>
    </div>
  )
}
