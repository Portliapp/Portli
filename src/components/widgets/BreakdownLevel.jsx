export default function BreakdownLevel() {
  return (
    <div className="card h-full flex flex-col">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mb-4">Breakdown: Asset Class</div>
      <div className="flex-1 space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Equities</span>
            <span className="font-mono">65%</span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '65%', filter: 'drop-shadow(var(--shadow-glow-accent))' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Fixed Income</span>
            <span className="font-mono">20%</span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5">
            <div className="bg-accent h-1.5 rounded-full" style={{ width: '20%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Crypto</span>
            <span className="font-mono">10%</span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5">
            <div className="bg-success h-1.5 rounded-full" style={{ width: '10%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Cash</span>
            <span className="font-mono">5%</span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5">
            <div className="bg-textSecondary h-1.5 rounded-full" style={{ width: '5%' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
