export default function HeatmapTreemap() {
  // Placeholder generico
  return (
    <div className="card h-full flex flex-col">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mb-4">Heatmap & Treemap</div>
      <div className="flex-1 min-h-[150px] grid grid-cols-4 gap-2">
        <div className="col-span-2 row-span-2 bg-success/20 border border-success/30 rounded flex items-center justify-center font-mono text-xs text-success shadow-[var(--shadow-glow-profit)]">AAPL +4%</div>
        <div className="bg-danger/20 border border-danger/30 rounded flex items-center justify-center font-mono text-xs text-danger shadow-[var(--shadow-glow-loss)]">TSLA -2%</div>
        <div className="bg-success/10 border border-success/20 rounded flex items-center justify-center font-mono text-xs text-success">MSFT +1%</div>
        <div className="bg-background border border-borderAccent rounded flex items-center justify-center font-mono text-xs text-textSecondary">V 0%</div>
        <div className="bg-danger/10 border border-danger/20 rounded flex items-center justify-center font-mono text-xs text-danger">META -1%</div>
      </div>
    </div>
  )
}
