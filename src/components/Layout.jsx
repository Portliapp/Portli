import { useState } from 'react'
import { LayoutDashboard, Wallet, ArrowRightLeft, Activity, PieChart, FileText, Settings, LogOut, Search, Sparkles } from 'lucide-react'

export default function Layout({ children }) {
  const navItems = [
    { label: 'DASHBOARD', icon: LayoutDashboard, active: true },
    { label: 'HOLDINGS', icon: Wallet, active: false },
    { label: 'TRANSAZIONI', icon: ArrowRightLeft, active: false },
    { label: 'ANALYTICS', icon: Activity, active: false },
    { label: 'CONFRONTO ASSET', icon: PieChart, active: false },
    { label: 'REPORT DECA', icon: FileText, active: false },
    { label: 'IMPOSTAZIONI', icon: Settings, active: false },
  ]

  const tickers = [
    { symbol: 'EUR/USD', price: '1.0838', change: '+0%', positive: true },
    { symbol: 'GOLD', price: '€74.82', change: '-0.06%', positive: false },
    { symbol: 'AAPL', price: '€381.19', change: '+1.37%', positive: true },
    { symbol: 'NVDA', price: '€124.64', change: '+1.62%', positive: true },
    { symbol: 'US10Y', price: '4.424%', change: '+0.48%', positive: true },
    { symbol: 'BTC', price: '€64,210', change: '-1.20%', positive: false },
    { symbol: 'ETH', price: '€3,450', change: '+2.10%', positive: true },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-textPrimary selection:bg-primary/30">
      
      {/* Ticker Marquee Bar */}
      <div className="h-6 bg-[#03060a] border-b border-borderAccent overflow-hidden flex items-center shrink-0">
        <div className="flex animate-marquee whitespace-nowrap text-[10px] font-mono font-bold">
          {/* Ripetiamo i ticker due volte per l'effetto loop continuo */}
          {[...tickers, ...tickers].map((t, i) => (
            <div key={i} className="flex items-center gap-2 mx-6">
              <span className="text-textSecondary">{t.symbol}</span>
              <span className="text-textPrimary">{t.price}</span>
              <span className={t.positive ? 'text-profit' : 'text-loss'}>{t.change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Topbar */}
      <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0 z-20 shadow-sm relative">
        <div className="flex items-center gap-4 w-1/3">
          <div className="text-[10px] uppercase font-mono tracking-widest text-textSecondary flex items-center gap-2">
            <span className="animate-pulse w-2 h-2 bg-success rounded-full"></span>
            ACTIVE NETWORK
          </div>
          <div className="text-xs font-mono">Quantum Cognitive Engine Live</div>
        </div>

        {/* AI Search Bar Centrale */}
        <div className="flex-1 flex justify-center w-1/3">
          <div className="relative w-full max-w-lg flex items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-magenta/20 to-primary/20 rounded-full blur-md"></div>
            <div className="relative flex items-center w-full bg-[#0a0f1a] border border-borderAccent rounded-full p-1 pl-4 shadow-inner">
              <Search size={14} className="text-textSecondary mr-3" />
              <input 
                type="text" 
                placeholder="ANALIZZA TICKER CON AI..." 
                className="bg-transparent border-none outline-none text-xs font-mono w-full text-textPrimary placeholder:text-textSecondary/50"
              />
              <button className="bg-gradient-to-r from-primary to-magenta text-black font-bold text-[10px] px-4 py-1.5 rounded-full ml-2 flex items-center gap-1 hover:brightness-110 transition-all">
                <Sparkles size={12} /> ANALYZE
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-6 w-1/3">
          <div className="text-[10px] font-mono font-bold px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded uppercase tracking-wider flex items-center gap-2">
            PREMIUM ELITE
          </div>
          <div className="text-xs font-mono text-textSecondary flex items-center gap-2">
            <Activity size={12} className="text-primary" /> 20:07:41 UTC <span className="text-success ml-2">• LIVE</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-64 bg-surface border-r border-border shrink-0 flex flex-col py-4">
          
          <div className="px-6 mb-8 mt-2">
            <div className="flex items-center gap-2 font-mono mb-8">
              <div className="w-6 h-6 rounded-md bg-primary/20 border border-primary flex items-center justify-center text-primary shadow-[0_0_10px_rgba(var(--color-primary),0.3)]">
                <Activity size={14} />
              </div>
              <h1 className="text-xl font-bold tracking-widest uppercase">PORTLI</h1>
            </div>

            <div className="bg-[#060b13] border border-borderAccent rounded-lg p-3 mb-4">
              <div className="text-[10px] uppercase font-mono tracking-widest text-textSecondary mb-2">TOTALE PORTAFOGLIO</div>
              <div className="text-lg font-bold font-mono">€ 0,00</div>
              <div className="text-[10px] text-profit font-mono mt-1">+0.00%</div>
            </div>
          </div>

          <div className="space-y-1 px-3 flex-1 overflow-y-auto">
            {navItems.map((item, index) => (
              <button 
                key={index}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-md text-[11px] uppercase tracking-wider font-medium transition-colors ${
                  item.active 
                    ? 'bg-primary/10 text-primary border border-primary/30' 
                    : 'text-textSecondary hover:bg-background hover:text-textPrimary'
                }`}
              >
                <item.icon size={16} className={item.active ? 'text-primary' : ''} />
                <span>{item.label}</span>
              </button>
            ))}
            
            <button className="w-full flex items-center gap-4 px-4 py-3 mt-4 text-[11px] uppercase tracking-wider font-medium text-textSecondary hover:text-danger hover:bg-danger/10 rounded-md transition-colors">
              <LogOut size={16} />
              <span>DISCONNETTI</span>
            </button>
          </div>

          <div className="px-6 pt-4 border-t border-border mt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center font-bold text-xs text-primary">D</div>
              <div>
                <div className="text-xs font-bold text-textPrimary">Davide</div>
                <div className="text-[9px] text-textSecondary uppercase tracking-widest font-mono">Piano Custom Premium</div>
              </div>
            </div>
          </div>
        </nav>

        {/* Area Contenuto Principale */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-[1600px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  )
}
