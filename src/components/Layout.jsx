import { useState, useEffect } from 'react'
import { LayoutDashboard, Wallet, ArrowRightLeft, Activity, PieChart, FileText, Settings, Moon, Sun, Zap, LogOut } from 'lucide-react'

export default function Layout({ children }) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, active: true },
    { label: 'Holdings', icon: Wallet, active: false },
    { label: 'Transazioni', icon: ArrowRightLeft, active: false },
    { label: 'Analytics', icon: Activity, active: false },
    { label: 'Report', icon: FileText, active: false },
    { label: 'Impostazioni', icon: Settings, active: false },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-textPrimary selection:bg-primary/30">
      
      {/* Topbar Globale */}
      <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0 z-20 shadow-sm relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono">
            <div className="w-6 h-6 rounded-md bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(var(--color-primary),0.3)]">
              <Activity size={14} />
            </div>
            <h1 className="text-lg font-bold tracking-tight">PORTLI</h1>
          </div>
          
          <div className="hidden md:flex items-center bg-background border border-border px-3 py-1 rounded text-xs font-mono text-textSecondary gap-2">
            <span className="animate-pulse w-2 h-2 bg-success rounded-full"></span>
            LIVE FEED: S&P500 5,310.72 (+0.77%) • NASDAQ 18,672.16 (+1.89%)
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          {/* Theme Switcher */}
          <div className="flex bg-background border border-border rounded-lg p-1">
            <button 
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-md transition-all ${theme === 'light' ? 'bg-surface shadow-sm text-primary' : 'text-textSecondary hover:text-textPrimary'}`}
              title="Light Mode"
            >
              <Sun size={14} />
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-md transition-all ${theme === 'dark' ? 'bg-surface shadow-sm text-primary' : 'text-textSecondary hover:text-textPrimary'}`}
              title="Dark Mode"
            >
              <Moon size={14} />
            </button>
            <button 
              onClick={() => setTheme('neon')}
              className={`p-1.5 rounded-md transition-all ${theme === 'neon' ? 'bg-surface shadow-sm text-primary border-glow-accent' : 'text-textSecondary hover:text-textPrimary'}`}
              title="Neon Mode"
            >
              <Zap size={14} />
            </button>
          </div>

          <div className="h-4 w-px bg-border"></div>
          
          <div className="text-xs font-mono font-bold px-2 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 border border-amber-500/30 rounded uppercase tracking-wider">
            Premium Elite
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Compatta */}
        <nav className="w-16 md:w-64 bg-surface border-r border-border shrink-0 flex flex-col justify-between py-4">
          <div className="space-y-1 px-2 md:px-3">
            {navItems.map((item, index) => (
              <button 
                key={index}
                className={`w-full flex items-center md:justify-start justify-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-textSecondary hover:bg-background hover:text-textPrimary'
                }`}
              >
                <item.icon size={16} className={item.active ? 'text-primary' : ''} />
                <span className="hidden md:block">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="px-2 md:px-3">
            <button className="w-full flex items-center md:justify-start justify-center gap-3 px-3 py-2.5 text-textSecondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors text-sm font-medium">
              <LogOut size={16} />
              <span className="hidden md:block">Disconnetti</span>
            </button>
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center font-bold text-xs text-primary">D</div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-textPrimary">Davide</div>
                <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono">Piano Custom</div>
              </div>
            </div>
          </div>
        </nav>

        {/* Area Contenuto Principale */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  )
}
