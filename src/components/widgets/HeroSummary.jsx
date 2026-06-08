import { Activity, Zap } from 'lucide-react'

export default function HeroSummary() {
  return (
    <div className="card relative overflow-hidden bg-gradient-to-br from-surface/80 to-background/90 border-0 shadow-none ring-1 ring-white/5">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-primary animate-pulse" style={{ filter: 'drop-shadow(var(--shadow-glow-accent))' }} />
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-bold">Portafoglio Quantitativo Live</span>
          </div>
          
          <div className="text-textSecondary text-sm mb-1 font-medium">Net Worth Totale</div>
          
          <div className="flex items-baseline gap-4">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white font-mono drop-shadow-xl">
              $142,504<span className="text-3xl text-textSecondary/50">.00</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-background/50 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-inner">
          <div>
            <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mb-1">Time-Weighted Return</div>
            <div className="text-2xl font-bold font-mono text-profit drop-shadow-[var(--shadow-glow-profit)]">
              +14.2%
            </div>
          </div>
          <div className="w-px h-10 bg-borderAccent mx-2"></div>
          <div>
            <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mb-1">Alpha vs S&P500</div>
            <div className="text-2xl font-bold font-mono text-primary drop-shadow-[var(--shadow-glow-accent)]">
              +3.4%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
