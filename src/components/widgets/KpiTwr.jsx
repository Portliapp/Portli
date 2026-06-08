export default function KpiTwr() {
  return (
    <div className="card h-full flex flex-col justify-between">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono">KPI • TWR & XIRR</div>
      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold font-mono">14.2%</span>
          <span className="text-xs text-profit font-mono font-bold">+2.1% M</span>
        </div>
        <div className="mt-1 text-xs text-textSecondary">XIRR Annualizzato: 16.5%</div>
      </div>
    </div>
  )
}
