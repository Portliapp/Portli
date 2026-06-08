export default function KpiTopFlop() {
  return (
    <div className="card h-full flex flex-col justify-between">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono">Day Movers</div>
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">NVDA</span>
          <span className="text-profit font-mono font-bold">+5.4%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">AAPL</span>
          <span className="text-loss font-mono font-bold">-1.2%</span>
        </div>
      </div>
    </div>
  )
}
