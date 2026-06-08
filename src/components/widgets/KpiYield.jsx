export default function KpiYield() {
  return (
    <div className="card h-full flex flex-col justify-between">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono">KPI • Yield Annuo</div>
      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold font-mono">€4,250</span>
          <span className="text-xs text-profit font-mono font-bold">4.8% YLD</span>
        </div>
        <div className="mt-1 text-xs text-textSecondary">Prossimo div: TSLA (12 Mag)</div>
      </div>
    </div>
  )
}
