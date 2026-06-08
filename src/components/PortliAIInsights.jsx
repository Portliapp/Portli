import { Sparkles, ArrowRight, Zap, AlertTriangle, TrendingUp } from 'lucide-react'

export default function PortliAIInsights() {
  return (
    <div className="card bg-surface/80 border-accent/30 backdrop-blur-sm p-0 flex flex-col h-full relative overflow-hidden group shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]">
      
      {/* Animated Gradient Border Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/10 opacity-50 pointer-events-none"></div>
      
      {/* Top Header */}
      <div className="p-5 border-b border-border/50 relative z-10 flex items-center justify-between bg-surface/50">
        <h3 className="text-sm font-bold tracking-widest text-white uppercase flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-70 animate-pulse"></div>
            <Sparkles size={18} className="text-accent relative z-10" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-fuchsia-400">
            Portli AI Insights
          </span>
        </h3>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
        </span>
      </div>

      {/* Feed Content */}
      <div className="p-5 flex-1 overflow-y-auto space-y-4 hide-scrollbar relative z-10">
        
        {/* Insight 1 */}
        <div className="bg-background/50 border border-border/50 rounded-xl p-4 hover:border-accent/30 transition-colors cursor-pointer group/item relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/80 rounded-l-xl"></div>
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-accent/10 rounded-lg text-accent mt-0.5">
              <Zap size={14} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-white tracking-wide">Opportunità AAPL</h4>
                <span className="text-[10px] text-textSecondary uppercase tracking-widest">2 min fa</span>
              </div>
              <p className="text-xs text-textSecondary leading-relaxed">
                Il volume di trading per Apple Inc. è salito del <span className="text-success font-bold">+34%</span> nell'ultima ora. Storicamente, questo setup precede un rimbalzo tecnico.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-accent opacity-0 group-hover/item:opacity-100 transition-opacity">
                Analizza Setup <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="bg-background/50 border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-colors cursor-pointer group/item relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/80 rounded-l-xl"></div>
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary mt-0.5">
              <TrendingUp size={14} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-white tracking-wide">Ribilanciamento</h4>
                <span className="text-[10px] text-textSecondary uppercase tracking-widest">1 ora fa</span>
              </div>
              <p className="text-xs text-textSecondary leading-relaxed">
                L'esposizione su <span className="text-white font-medium">Azioni (EQ)</span> ha superato il tuo target del 40%. Valuta la chiusura parziale di TSLA per re-investire in liquidità.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary opacity-0 group-hover/item:opacity-100 transition-opacity">
                Esegui ribilanciamento <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="bg-background/50 border border-border/50 rounded-xl p-4 hover:border-yellow-500/30 transition-colors cursor-pointer group/item relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500/80 rounded-l-xl"></div>
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-yellow-500/10 rounded-lg text-yellow-500 mt-0.5">
              <AlertTriangle size={14} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-white tracking-wide">Avviso Volatilità</h4>
                <span className="text-[10px] text-textSecondary uppercase tracking-widest">Ieri</span>
              </div>
              <p className="text-xs text-textSecondary leading-relaxed">
                Si attende alta volatilità sui mercati per il report FED di stasera. Copertura consigliata tramite opzioni per il <span className="text-white font-medium">15%</span> del portafoglio.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
