import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Q1', dd: 0 },
  { name: 'Q2', dd: -5 },
  { name: 'Q3', dd: -2 },
  { name: 'Q4', dd: -12 },
  { name: 'Q1', dd: -4 },
  { name: 'Q2', dd: 0 },
]

export default function DrawdownChart() {
  return (
    <div className="card h-full flex flex-col">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mb-4">Drawdown Storico</div>
      <div className="flex-1 min-h-[150px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="name" stroke="var(--color-borderAccent)" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-borderAccent)" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-borderAccent)' }} />
            <Area type="monotone" dataKey="dd" stroke="var(--color-danger)" fill="var(--color-danger)" fillOpacity={0.2} style={{ filter: 'drop-shadow(var(--shadow-glow-loss))' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
