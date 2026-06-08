import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, Coins, Banknote } from 'lucide-react'

export default function PortfolioSummary({ 
  currentValue, 
  totalInvested, 
  totalProfit, 
  profitPercentage,
  assetAllocation = { eq: 45, etf: 30, cry: 15, liq: 10 } // Mock default allocation
}) {
  const isPositive = totalProfit >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Patrimonio Totale */}
      <div className="card bg-surface border-border/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-primary/10"></div>
        <div className="flex items-center gap-3 text-textSecondary mb-2">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <DollarSign size={18} className="text-primary" />
          </div>
          <span className="font-medium text-xs tracking-wider uppercase">Patrimonio Totale €</span>
        </div>
        <div className="text-3xl lg:text-4xl font-bold tracking-tight text-white mt-4 font-mono">
          €{currentValue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center text-[10px] sm:text-xs text-textSecondary font-medium tracking-widest">
          <span>EQ:{assetAllocation.eq}%</span>
          <span>•</span>
          <span>ETF:{assetAllocation.etf}%</span>
          <span>•</span>
          <span>CRY:{assetAllocation.cry}%</span>
          <span>•</span>
          <span>LIQ:{assetAllocation.liq}%</span>
        </div>
      </div>

      {/* Card 2: Capitale Investito */}
      <div className="card bg-surface border-border/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent/10"></div>
        <div className="flex items-center gap-3 text-textSecondary mb-2">
          <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
            <Banknote size={18} className="text-accent" />
          </div>
          <span className="font-medium text-xs tracking-wider uppercase">Capitale Investito</span>
        </div>
        <div className="text-3xl lg:text-4xl font-bold tracking-tight text-white mt-4 font-mono">
          €{totalInvested.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
          <span className="text-xs text-textSecondary uppercase tracking-wider font-medium">Rendimento Assoluto Virtuale</span>
        </div>
      </div>

      {/* Card 3: Profittabilità Attuale */}
      <div className="card bg-surface border-border/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-success/10"></div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 text-textSecondary">
            <div className={`p-2 rounded-lg border ${isPositive ? 'bg-success/10 border-success/20' : 'bg-danger/10 border-danger/20'}`}>
              <Activity size={18} className={isPositive ? 'text-success' : 'text-danger'} />
            </div>
            <span className="font-medium text-xs tracking-wider uppercase">Profittabilità (PNL)</span>
          </div>
        </div>
        <div className="mt-4 flex items-end gap-3">
          <div className={`text-3xl lg:text-4xl font-bold tracking-tight font-mono ${isPositive ? 'text-success drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-danger drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}>
            {isPositive ? '+' : ''}€{totalProfit.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wider ${isPositive ? 'bg-success/20 text-success border border-success/30' : 'bg-danger/20 text-danger border border-danger/30'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? '+' : ''}{profitPercentage.toFixed(2)}%
          </div>
        </div>
      </div>

    </div>
  )
}
