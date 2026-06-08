export default function HeatmapDetails() {
  return (
    <div className="card h-full flex flex-col justify-between">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono font-bold mb-4 border-b border-borderAccent pb-2">
        SELEZIONE CORRENTE
      </div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-sm font-bold text-primary mb-1">MARTEDÌ</div>
          <div className="text-2xl font-bold font-mono text-profit drop-shadow-[var(--shadow-glow-profit)]">+0.921%</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-mono text-textSecondary mb-1">26 marzo 2024</div>
          <div className="text-xl font-bold font-mono text-profit">+€1151,52</div>
        </div>
      </div>

      <div className="space-y-2 text-[9px] font-mono">
        <div className="flex justify-between border-b border-borderAccent/50 pb-1">
          <span className="text-textSecondary">Asset Guida</span>
          <span className="font-bold text-primary">BTC</span>
        </div>
        <div className="flex justify-between border-b border-borderAccent/50 pb-1">
          <span className="text-textSecondary">Fluttuazione Odierna</span>
          <span className="font-bold text-loss">-0.15%</span>
        </div>
        <div className="flex justify-between border-b border-borderAccent/50 pb-1">
          <span className="text-textSecondary">Sentiment Algoritmico</span>
          <span className="font-bold text-success">BULLISH</span>
        </div>
      </div>
      
      <div className="mt-4 p-2 border border-amber-500/30 bg-amber-500/5 rounded text-[9px] font-mono text-amber-500 flex items-start gap-2">
        <span>⚠</span> L'indice di Sharpe scende a -2.04 a causa del rendimento anomalo per la stabilità media. Rivisitare la leva direzionale.
      </div>
    </div>
  )
}
