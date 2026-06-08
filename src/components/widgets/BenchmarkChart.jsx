import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity } from 'lucide-react'

const data = [
  { name: 'Jan', port: 100, sp500: 100, msci: 100 },
  { name: 'Feb', port: 105, sp500: 102, msci: 101 },
  { name: 'Mar', port: 102, sp500: 104, msci: 103 },
  { name: 'Apr', port: 110, sp500: 106, msci: 105 },
  { name: 'May', port: 115, sp500: 108, msci: 106 },
  { name: 'Jun', port: 112, sp500: 107, msci: 105 },
]

export default function BenchmarkChart() {
  return (
    <div className="card w-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-primary" />
          <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono font-bold">
            TREND RENDIMENTO & BENCHMARK COMPILATOR
          </div>
        </div>
        <div className="flex items-center gap-1 bg-background border border-borderAccent rounded p-1">
          {['1D', '3D', '1W', '1M', '6M', 'YTD', '1A', '2A', '5A', 'ALL'].map((tf, i) => (
            <button 
              key={tf} 
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${tf === '1A' ? 'bg-primary text-black font-bold' : 'text-textSecondary hover:text-textPrimary hover:bg-surfaceHover'}`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 border-b border-borderAccent pb-4 mb-6">
        <div className="text-center border-r border-borderAccent">
          <div className="text-[9px] uppercase font-mono text-textSecondary mb-1">RENDIMENTO PORTAFOGLIO</div>
          <div className="text-sm font-bold font-mono text-profit">+0.00%</div>
        </div>
        <div className="text-center border-r border-borderAccent">
          <div className="text-[9px] uppercase font-mono text-textSecondary mb-1">S&P 500 BENCHMARK</div>
          <div className="text-sm font-bold font-mono text-profit">+3.94%</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] uppercase font-mono text-textSecondary mb-1">MSCI WORLD INDEX</div>
          <div className="text-sm font-bold font-mono text-profit">+4.36%</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mb-4 text-[9px] font-mono text-textSecondary">
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-magenta rounded-full"></span> MSCI World (eur-hdg)</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-primary rounded-full"></span> Portafoglio</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> S&P 500 (eur-hdg)</div>
      </div>

      <div className="w-full min-h-[250px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="var(--color-borderAccent)" fontSize={9} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-borderAccent)" fontSize={9} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-surfaceHover)', borderColor: 'var(--color-borderAccent)', fontSize: '10px', borderRadius: '4px' }}
              itemStyle={{ color: 'var(--color-textPrimary)' }}
            />
            <Line type="monotone" dataKey="msci" stroke="var(--color-magenta)" strokeWidth={1} dot={{r: 1}} strokeDasharray="2 2" />
            <Line type="monotone" dataKey="sp500" stroke="#f59e0b" strokeWidth={1} dot={{r: 1}} strokeDasharray="2 2" />
            <Line type="monotone" dataKey="port" stroke="var(--color-primary)" strokeWidth={2} dot={{r: 2}} style={{ filter: 'drop-shadow(var(--shadow-glow-accent))' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
