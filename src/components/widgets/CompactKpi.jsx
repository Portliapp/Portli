export default function CompactKpi() {
  return (
    <div className="card h-full flex flex-col space-y-4">
      <div>
        <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mb-1">Reddito Generato (YLD)</div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono">€4,250</span>
          <span className="text-xs text-profit font-mono font-bold drop-shadow-[var(--shadow-glow-profit)]">4.8%</span>
        </div>
      </div>
      <div className="h-px bg-border/50 w-full"></div>
      <div>
        <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mb-2">Day Movers</div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold">NVDA</span>
            <span className="text-profit font-mono font-bold drop-shadow-[var(--shadow-glow-profit)]">+5.4%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold">AAPL</span>
            <span className="text-loss font-mono font-bold drop-shadow-[var(--shadow-glow-loss)]">-1.2%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
