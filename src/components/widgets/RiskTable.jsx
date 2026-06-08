export default function RiskTable() {
  return (
    <div className="card h-full flex flex-col justify-between">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono">Risk Metrics</div>
      <div className="mt-2 text-xs font-mono grid grid-cols-2 gap-y-2">
        <div className="text-textSecondary">Sharpe</div>
        <div className="text-right font-bold text-profit">1.84</div>
        <div className="text-textSecondary">Beta</div>
        <div className="text-right font-bold">0.85</div>
        <div className="text-textSecondary">Max DD</div>
        <div className="text-right font-bold text-loss">-12.4%</div>
      </div>
    </div>
  )
}
