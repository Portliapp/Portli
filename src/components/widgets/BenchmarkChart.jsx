import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', port: 100, sp500: 100 },
  { name: 'Feb', port: 105, sp500: 102 },
  { name: 'Mar', port: 102, sp500: 104 },
  { name: 'Apr', port: 110, sp500: 106 },
  { name: 'May', port: 115, sp500: 108 },
  { name: 'Jun', port: 112, sp500: 107 },
]

export default function BenchmarkChart() {
  return (
    <div className="card h-full flex flex-col border-0 ring-1 ring-white/5 bg-gradient-to-br from-surface/40 to-transparent">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mb-6">Benchmark Compilator</div>
      <div className="flex-1 min-h-[350px] -ml-6 -mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-surfaceHover)', borderColor: 'var(--color-borderAccent)', fontSize: '12px', borderRadius: '8px', backdropFilter: 'blur(8px)' }}
              itemStyle={{ color: 'var(--color-textPrimary)', fontWeight: 'bold' }}
            />
            <Line type="monotone" dataKey="sp500" stroke="var(--color-textSecondary)" strokeWidth={2} dot={false} strokeDasharray="4 4" opacity={0.5} />
            <Line type="monotone" dataKey="port" stroke="var(--color-primary)" strokeWidth={4} dot={false} style={{ filter: 'drop-shadow(var(--shadow-glow-accent)) drop-shadow(0 10px 10px rgba(var(--color-primary), 0.2))' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
