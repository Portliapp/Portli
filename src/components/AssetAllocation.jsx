import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'

const allocationData = [
  { name: 'Azioni (EQ)', value: 45, color: '#06b6d4' },
  { name: 'ETF', value: 30, color: '#8b5cf6' },
  { name: 'Crypto (CRY)', value: 15, color: '#eab308' },
  { name: 'Liquidità (LIQ)', value: 10, color: '#10b981' },
]

export default function AssetAllocation() {
  return (
    <div className="card bg-surface/50 border-border/50 backdrop-blur-sm p-6 flex flex-col h-full">
      <h3 className="text-sm font-bold tracking-widest text-white uppercase mb-6 flex items-center gap-2">
        <div className="w-2 h-4 bg-accent rounded-sm shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
        Ripartizione & Driver Performance
      </h3>
      
      <div className="flex-1 min-h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                color: '#fff'
              }} 
              itemStyle={{ color: '#fff' }}
              formatter={(value) => [`${value}%`, 'Allocazione']}
            />
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {allocationData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  style={{ filter: `drop-shadow(0 0 5px ${entry.color}80)` }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-white font-mono">100%</span>
          <span className="text-[10px] text-textSecondary uppercase tracking-widest">Asset</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {allocationData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` }}></div>
              <span className="text-xs font-medium text-textSecondary">{item.name}</span>
            </div>
            <span className="text-xs font-bold text-white font-mono">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
