import { useState } from 'react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts'

const mockData = [
  { name: 'Gen', portafoglio: 10000, sp500: 10000, msci: 10000 },
  { name: 'Feb', portafoglio: 10500, sp500: 10200, msci: 10150 },
  { name: 'Mar', portafoglio: 10800, sp500: 10400, msci: 10300 },
  { name: 'Apr', portafoglio: 10600, sp500: 10350, msci: 10250 },
  { name: 'Mag', portafoglio: 11200, sp500: 10600, msci: 10400 },
  { name: 'Giu', portafoglio: 11500, sp500: 10800, msci: 10550 },
  { name: 'Lug', portafoglio: 11800, sp500: 11000, msci: 10700 },
  { name: 'Ago', portafoglio: 12100, sp500: 10950, msci: 10650 },
  { name: 'Set', portafoglio: 11900, sp500: 10800, msci: 10500 },
  { name: 'Ott', portafoglio: 12400, sp500: 11200, msci: 10800 },
  { name: 'Nov', portafoglio: 13000, sp500: 11500, msci: 11000 },
  { name: 'Dic', portafoglio: 13500, sp500: 11800, msci: 11200 },
]

const timeframes = ['1G', '3G', '1S', '1M', '6M', 'YTD', '1A', '2A', '5A', 'ALL']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/95 border border-border p-4 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-white font-semibold mb-3 border-b border-border/50 pb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-textSecondary">{entry.name}</span>
            </div>
            <span className="font-mono font-medium text-white">
              €{entry.value.toLocaleString('it-IT')}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function PerformanceChart() {
  const [activeTimeframe, setActiveTimeframe] = useState('1A')

  return (
    <div className="card bg-surface/50 border-border/50 backdrop-blur-sm p-0 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-border/50">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
          <h3 className="text-sm font-bold tracking-widest text-white uppercase flex items-center gap-2">
            <div className="w-2 h-4 bg-primary rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            Trend Rendimento & Benchmark Compilator
            <span className="text-xs font-normal text-textSecondary normal-case hidden sm:inline-block ml-2">
              (Confronto storico con S&P 500 e MSCI World)
            </span>
          </h3>
          
          <div className="flex bg-background/50 p-1 rounded-lg border border-border/50 overflow-x-auto max-w-full hide-scrollbar">
            {timeframes.map(tf => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  activeTimeframe === tf 
                    ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                    : 'text-textSecondary hover:text-white hover:bg-white/5'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-2">
          <div>
            <div className="text-[10px] text-textSecondary uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
              Rendimento Registrato
            </div>
            <div className="text-xl font-bold font-mono text-white">+35.00%</div>
          </div>
          <div>
            <div className="text-[10px] text-textSecondary uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
              S&P 500 Benchmark
            </div>
            <div className="text-xl font-bold font-mono text-white">+18.00%</div>
          </div>
          <div>
            <div className="text-[10px] text-textSecondary uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
              MSCI World Index
            </div>
            <div className="text-xl font-bold font-mono text-white">+12.00%</div>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPortafoglio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `€${value/1000}k`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line 
              type="monotone" 
              dataKey="msci" 
              name="MSCI World"
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#8b5cf6' }}
            />
            <Line 
              type="monotone" 
              dataKey="sp500" 
              name="S&P 500"
              stroke="#eab308" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#eab308' }}
            />
            <Line 
              type="monotone" 
              dataKey="portafoglio" 
              name="Portafoglio"
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#020617', fill: '#06b6d4' }}
              style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.4))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
