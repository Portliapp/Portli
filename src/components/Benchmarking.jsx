import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Target } from 'lucide-react'

const benchmarkData = [
  { subject: 'Rendimento', portafoglio: 85, benchmark: 65, fullMark: 100 },
  { subject: 'Volatilità', portafoglio: 60, benchmark: 85, fullMark: 100 },
  { subject: 'Dividendi', portafoglio: 75, benchmark: 45, fullMark: 100 },
  { subject: 'Diversificazione', portafoglio: 90, benchmark: 70, fullMark: 100 },
  { subject: 'Liquidità', portafoglio: 80, benchmark: 90, fullMark: 100 },
  { subject: 'Rischio', portafoglio: 40, benchmark: 75, fullMark: 100 }, // Rischio più basso è migliore (visivamente inverso)
]

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
              {entry.value}/100
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function Benchmarking() {
  return (
    <div className="card bg-surface/50 border-border/50 backdrop-blur-sm p-6 flex flex-col h-full relative overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none transition-all duration-700 group-hover:bg-primary/10"></div>
      
      <div className="flex items-center justify-between mb-2 relative z-10">
        <h3 className="text-sm font-bold tracking-widest text-white uppercase flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md border border-primary/20 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Target size={16} className="text-primary" />
          </div>
          Competitor Benchmarking
        </h3>
        <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-md uppercase">
          Pro Feature
        </span>
      </div>
      <p className="text-xs text-textSecondary mb-6 relative z-10">Confronto metriche avanzate del portafoglio vs S&P 500.</p>

      <div className="flex-1 min-h-[300px] w-full relative z-10 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={benchmarkData}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            
            <Radar
              name="S&P 500"
              dataKey="benchmark"
              stroke="#eab308"
              fill="#eab308"
              fillOpacity={0.2}
            />
            <Radar
              name="Il tuo Portafoglio"
              dataKey="portafoglio"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="#06b6d4"
              fillOpacity={0.4}
              style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.5))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
