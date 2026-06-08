export default function HeatmapTreemap() {
  // Placeholder generico
  return (
    <div className="card h-full flex flex-col border-0 ring-1 ring-white/5 bg-gradient-to-b from-surface/50 to-transparent">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mb-4 flex justify-between">
        <span>Heatmap & Treemap</span>
        <span className="text-primary animate-pulse">LIVE</span>
      </div>
      <div className="flex-1 min-h-[300px] grid grid-cols-4 gap-2">
        <div className="col-span-2 row-span-2 bg-success/20 border border-success/30 rounded-lg flex items-center justify-center font-mono text-xl font-bold text-success shadow-[var(--shadow-glow-profit)] transition-transform hover:scale-[1.02] cursor-pointer">AAPL +4%</div>
        <div className="bg-danger/20 border border-danger/30 rounded-lg flex items-center justify-center font-mono text-sm font-bold text-danger shadow-[var(--shadow-glow-loss)] transition-transform hover:scale-[1.02] cursor-pointer">TSLA -2%</div>
        <div className="bg-success/10 border border-success/20 rounded-lg flex items-center justify-center font-mono text-sm font-bold text-success transition-transform hover:scale-[1.02] cursor-pointer">MSFT +1%</div>
        <div className="bg-surface border border-borderAccent rounded-lg flex items-center justify-center font-mono text-xs text-textSecondary transition-transform hover:scale-[1.02] cursor-pointer">V 0%</div>
        <div className="col-span-2 bg-danger/10 border border-danger/20 rounded-lg flex items-center justify-center font-mono text-xs text-danger transition-transform hover:scale-[1.02] cursor-pointer">META -1%</div>
      </div>
    </div>
  )
}
