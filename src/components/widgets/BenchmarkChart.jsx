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
    <div className="card h-full flex flex-col">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mb-4">Benchmark Compilator</div>
      <div className="flex-1 min-h-[200px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="var(--color-borderAccent)" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-borderAccent)" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-borderAccent)', fontSize: '12px' }}
              itemStyle={{ color: 'var(--color-textPrimary)' }}
            />
            <Line type="monotone" dataKey="sp500" stroke="var(--color-textSecondary)" strokeWidth={2} dot={false} strokeDasharray="3 3" />
            <Line type="monotone" dataKey="port" stroke="var(--color-primary)" strokeWidth={3} dot={false} style={{ filter: 'drop-shadow(var(--shadow-glow-accent))' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
