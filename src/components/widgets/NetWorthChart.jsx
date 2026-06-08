import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', capital: 10000, nw: 10000 },
  { name: 'Feb', capital: 11000, nw: 11500 },
  { name: 'Mar', capital: 11000, nw: 11200 },
  { name: 'Apr', capital: 12000, nw: 12800 },
  { name: 'May', capital: 12000, nw: 13500 },
  { name: 'Jun', capital: 12000, nw: 13100 },
]

export default function NetWorthChart() {
  return (
    <div className="card h-full flex flex-col">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mb-4">Net Worth vs Capital</div>
      <div className="flex-1 min-h-[200px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="name" stroke="var(--color-borderAccent)" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-borderAccent)" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-borderAccent)' }} />
            <Area type="stepAfter" dataKey="capital" stroke="var(--color-textSecondary)" fill="transparent" />
            <Area type="monotone" dataKey="nw" stroke="var(--color-success)" fill="var(--color-success)" fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
