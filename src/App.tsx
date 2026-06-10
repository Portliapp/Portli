import React, { useState, useMemo, useEffect } from 'react';
import HeaderTicker from './components/HeaderTicker';
import KpiCards from './components/KpiCards';
import PerformanceChart from './components/PerformanceChart';
import AssetsTable from './components/AssetsTable';
import NewsFeed from './components/NewsFeed';
import DashboardAllocationCard from './components/DashboardAllocationCard';
import TransactionForm from './components/TransactionForm';
import AiInsightsDrawer from './components/AiInsightsDrawer';
import AnalyticsView from './components/AnalyticsView';
import AssetComparison from './components/AssetComparison';
import SettingsView from './components/SettingsView';
import PremiumModal from './components/PremiumModal';
import PDFReportSection from './components/PDFReportSection';
import AuthView from './components/AuthView';
import PortliLogo from './components/PortliLogo';
import WeeklyHeatmap from './components/WeeklyHeatmap';
import CommandPalette from './components/CommandPalette';
import SplashScreen from './components/SplashScreen';
import { motion, AnimatePresence } from 'motion/react';

import { initialTransactions, DEMO_TRANSACTIONS, CURRENT_ASSET_PRICES, generateHistoricalData } from './data';
import { Transaction, PortfolioAsset, AssetType } from './types';
import { 
  Sparkles, 
  BarChart3, 
  Clock, 
  Search, 
  LayoutDashboard, 
  Layers, 
  ArrowUpDown, 
  TrendingUp, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Sun,
  Moon,
  Zap,
  Crown,
  FileDown,
  FileText,
  Command
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Custom current market pricing state for customized dynamic rebalancing
  const [customPrices, setCustomPrices] = useState<Record<string, number>>(() => {
    const raw = localStorage.getItem('qevora_custom_prices') || localStorage.getItem('portly_custom_prices');
    return raw ? JSON.parse(raw) : {};
  });

  const handleUpdateCustomPrice = (ticker: string, newPrice: number) => {
    const updated = { ...customPrices, [ticker.toUpperCase().trim()]: newPrice };
    setCustomPrices(updated);
    localStorage.setItem('qevora_custom_prices', JSON.stringify(updated));
    localStorage.setItem('portly_custom_prices', JSON.stringify(updated));
  };

  // Dynamic Theme state with DOM class matching
  const [theme, setTheme] = useState<'neon' | 'sun' | 'dark'>(() => {
    return (localStorage.getItem('qevora_theme') as any) || (localStorage.getItem('portly_theme') as any) || 'neon';
  });

  const [themeTransition, setThemeTransition] = useState<{
    active: boolean;
    previous: 'neon' | 'sun' | 'dark' | null;
    current: 'neon' | 'sun' | 'dark' | null;
  }>({ active: false, previous: null, current: null });

  const handleThemeChange = (newTheme: 'sun' | 'dark' | 'neon') => {
    if (newTheme === theme) return;
    
    setThemeTransition({
      active: true,
      previous: theme,
      current: newTheme
    });

    // Deliberate small delay (120ms) to peak standard view colors transition behind overlay
    setTimeout(() => {
      // @ts-ignore
      if (document.startViewTransition) {
        // @ts-ignore
        document.startViewTransition(() => {
          setTheme(newTheme);
        });
      } else {
        setTheme(newTheme);
      }
    }, 120);

    // Turn off transition after total animation finishes (approx 950ms)
    setTimeout(() => {
      setThemeTransition(prev => ({ ...prev, active: false }));
    }, 950);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.className = '';
    root.classList.add(`theme-${theme}`);
    localStorage.setItem('qevora_theme', theme);
    localStorage.setItem('portly_theme', theme);
  }, [theme]);

  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Premium Modal State
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // User Profile States
  const [userName, setUserName] = useState<string>('Ospite');
  const [userTier, setUserTier] = useState<string>('Piano Base');

  useEffect(() => {
    async function initSession() {
      try {
        const { supabaseService } = await import('./services/supabaseService');
        const session = await supabaseService.getSession();
        if (session) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
          setUserName(session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Utente');
          setUserTier(session.user.user_metadata?.tier || 'Piano Base');
          
          const txs = await supabaseService.getTransactions();
          setTransactions(txs);
        } else {
          setIsAuthenticated(false);
          setUserId(null);
        }
      } catch (err) {
        console.error("Error initializing session:", err);
      } finally {
        setIsLoadingData(false);
        // Splash screen controls its own completion via onComplete callback
      }
    }
    initSession();
  }, []);

  const handleAuthSuccess = async (userObj: { name: string; tier: string; token: string }) => {
    setUserName(userObj.name);
    setUserTier(userObj.tier);
    setIsAuthenticated(true);
    
    // Reload transactions for the new user
    const { supabaseService } = await import('./services/supabaseService');
    const session = await supabaseService.getSession();
    if (session) {
      setUserId(session.user.id);
      const txs = await supabaseService.getTransactions();
      setTransactions(txs);
    }
  };

  const handleLogout = async () => {
    const { supabaseService } = await import('./services/supabaseService');
    await supabaseService.signOut();
    setIsAuthenticated(false);
    setUserId(null);
    setTransactions([]);
  };

  // activeSection view router: 'dashboard' | 'holdings' | 'transazioni' | 'analytics' | 'reports' | 'impostazioni' | 'confronto'
  const [activeSection, setActiveSection] = useState<'dashboard' | 'holdings' | 'transazioni' | 'analytics' | 'reports' | 'impostazioni' | 'confronto'>('dashboard');

  // Keyboard Quick-Jump command palette state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Global keydown listener for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Collapsible sidebar state:
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Current selected asset for the AI analysis side drawer sheet:
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  // Global search input for analyzed stock:
  const [searchVal, setSearchVal] = useState<string>('');

  // Remove old localStorage auto-sync
  // We now rely on Supabase for persistence.

  // LIVE FINNHUB INTEGRATION
  useEffect(() => {
    async function syncLivePrices() {
      const { fetchFinnhubQuote } = await import('./services/dataService');
      const uniqueTickers = [...new Set(transactions.map(t => t.ticker))];
      for (const ticker of uniqueTickers) {
        if (ticker === 'CASH') continue;
        const liveData = await fetchFinnhubQuote(ticker);
        if (liveData && liveData.price) {
          handleUpdateCustomPrice(ticker, liveData.price);
        }
      }
    }
    syncLivePrices();
    const interval = setInterval(syncLivePrices, 60000);
    return () => clearInterval(interval);
  }, [transactions]);

  // Real-time ticking system clock for superior status density
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // MATHEMATICAL FINANCIAL ENGINE (STATE CALCULATION)
  const portfolioState = useMemo(() => {
    const assetMap: Record<string, {
      ticker: string;
      name: string;
      assetType: AssetType;
      totalCost: number;
      totalShares: number;
      totalBuyQuantity: number;
    }> = {};

    transactions.forEach(tx => {
      const ticker = tx.ticker.toUpperCase().trim();
      if (!assetMap[ticker]) {
        assetMap[ticker] = {
          ticker,
          name: tx.name,
          assetType: tx.assetType,
          totalCost: 0,
          totalShares: 0,
          totalBuyQuantity: 0,
        };
      }

      const item = assetMap[ticker];

      if (tx.type === 'ACQUISTO' || tx.type === 'DEPOSITO') {
        item.totalShares += tx.quantity;
        item.totalBuyQuantity += tx.quantity;
        item.totalCost += tx.quantity * tx.price;
      } else if (tx.type === 'VENDITA') {
        item.totalShares = Math.max(0, item.totalShares - tx.quantity);
      }
    });

    const calculatedAssets: PortfolioAsset[] = [];
    let overallPortfolioValue = 0;
    let overallPortfolioCost = 0;

    Object.keys(assetMap).forEach(ticker => {
      const item = assetMap[ticker];
      if (item.totalShares <= 0) return;

      const avgBuyPrice = item.totalBuyQuantity > 0 
        ? item.totalCost / item.totalBuyQuantity 
        : 0;

      // Current pricing resolve
      const customPrice = customPrices[ticker];
      const baseInfo = CURRENT_ASSET_PRICES[ticker] || { price: avgBuyPrice, color: '#00c2ff' };
      const currentPrice = customPrice !== undefined ? customPrice : baseInfo.price;
      const currentValue = item.totalShares * currentPrice;
      const originalCostOfActiveShares = item.totalShares * avgBuyPrice;

      calculatedAssets.push({
        ticker,
        name: item.name,
        assetType: item.assetType,
        quantity: item.totalShares,
        averageBuyPrice: avgBuyPrice,
        currentPrice: currentPrice,
        currentValue: currentValue,
        totalCost: originalCostOfActiveShares,
        pnl: currentValue - originalCostOfActiveShares,
        pnlPercent: originalCostOfActiveShares > 0 
          ? ((currentValue - originalCostOfActiveShares) / originalCostOfActiveShares) * 100 
          : 0,
        weight: 0, // To fill below
        colorCode: baseInfo.color || '#00c2ff',
      });

      overallPortfolioValue += currentValue;
      overallPortfolioCost += originalCostOfActiveShares;
    });

    // Populate actual weights
    calculatedAssets.forEach(asset => {
      asset.weight = overallPortfolioValue > 0 
        ? (asset.currentValue / overallPortfolioValue) * 100 
        : 0;
    });

    return {
      assets: calculatedAssets.sort((a, b) => b.currentValue - a.currentValue),
      totalValue: overallPortfolioValue,
      totalCost: overallPortfolioCost,
    };
  }, [transactions, customPrices]);

  // Dynamically recalculate 5-year historical curve points when user changes transactions
  const historicalTimeline = useMemo(() => {
    return generateHistoricalData(transactions);
  }, [transactions]);

  // Total Performance Statistics for Left card
  const globalPerformancePercentage = useMemo(() => {
    if (portfolioState.totalCost === 0) return 0;
    return ((portfolioState.totalValue - portfolioState.totalCost) / portfolioState.totalCost) * 100;
  }, [portfolioState.totalCost, portfolioState.totalValue]);

  // Transaction Event Handlers
  const handleAddTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    if (!userId) return;
    try {
      const { supabaseService } = await import('./services/supabaseService');
      const savedTx = await supabaseService.addTransaction(newTx, userId);
      setTransactions(prev => [...prev, savedTx]);
    } catch (err) {
      console.error("Failed to save transaction to Cloud:", err);
      alert("Errore durante il salvataggio della transazione nel Cloud.");
    }
  };

  const handleRemoveTransaction = async (id: string | string[]) => {
    const idsToRemove = Array.isArray(id) ? id : [id];
    try {
      const { supabaseService } = await import('./services/supabaseService');
      for (const txId of idsToRemove) {
        await supabaseService.deleteTransaction(txId);
      }
      setTransactions(prev => prev.filter(tx => !idsToRemove.includes(tx.id)));
    } catch (err) {
      console.error("Failed to delete transaction from Cloud:", err);
      alert("Errore durante l'eliminazione della transazione.");
    }
  };

  const handleResetData = () => {
    // Legacy function, no longer used with real database
    console.warn("Reset data not supported with cloud DB.");
  };

  const handleExportReportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Font setting
    doc.setFont('helvetica', 'normal');

    // 1. HEADER (Deep slate background representing Portli's visual palette)
    doc.setFillColor(11, 15, 25); // Dark background
    doc.rect(0, 0, 210, 38, 'F');
    
    // Title in glowing Cyan style color
    doc.setTextColor(0, 194, 255); // Cyan
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('P O R T L I', 15, 18);
    
    // Subtitle
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('PORTFOLIO INTELLIGENCE & ANALYTICAL REPORT', 15, 26);
    
    // Generator Info Right aligned in Header
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    const dateStr = new Date().toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timeStr = new Date().toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generato: ${dateStr} alle ${timeStr}`, 195, 18, { align: 'right' });
    doc.text(`Destinatario: ${userName} (${userTier})`, 195, 24, { align: 'right' });
    doc.text(`Stato Rete: Quantum Cognitive Live`, 195, 30, { align: 'right' });

    // Decorative gradient bar below header
    doc.setFillColor(0, 229, 160); // Emerald bar
    doc.rect(0, 38, 210, 1.5, 'F');

    // 2. SUMMARY (KPIs)
    let y = 52;
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('1. RIEPILOGO FINANZIARIO E METRICHE DI RENDIMENTO', 15, y);
    
    y += 6;
    doc.setFillColor(248, 250, 252); // Light gray box for KPIs
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, y, 180, 24, 'FD');

    // Inside KPI box
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('VALORE ATTUALE PORTAFOGLIO', 22, y + 8);
    doc.text('CAPITALE INVESTITO (COSTO)', 80, y + 8);
    doc.text('RENDIMENTO NETTO (P&L)', 142, y + 8);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`EUR ${portfolioState.totalValue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 22, y + 17);
    doc.text(`EUR ${portfolioState.totalCost.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 80, y + 17);

    const netProfit = portfolioState.totalValue - portfolioState.totalCost;
    const isProfitable = netProfit >= 0;
    if (isProfitable) {
      doc.setTextColor(16, 185, 129); // Emerald success
      doc.text(`+EUR ${netProfit.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${globalPerformancePercentage.toFixed(2)}%)`, 142, y + 17);
    } else {
      doc.setTextColor(239, 68, 68); // Red warning
      doc.text(`-EUR ${Math.abs(netProfit).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${globalPerformancePercentage.toFixed(2)}%)`, 142, y + 17);
    }

    // 3. HOLDINGS BREAKDOWN TABLE
    y += 36;
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2. COMPOSIZIONE ATTUALE DEGLI ASSET E HOLDINGS', 15, y);

    y += 5;
    // Table Header
    doc.setFillColor(15, 23, 42); // Primary slate header
    doc.rect(15, y, 180, 7, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('TICKER', 18, y + 5);
    doc.text('NOME ASSET', 40, y + 5);
    doc.text('TIPO', 85, y + 5);
    doc.text('QUANTITÀ', 110, y + 5);
    doc.text('PESO %', 140, y + 5);
    doc.text('VALORE CORRENTE', 160, y + 5);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    
    if (portfolioState.assets.length === 0) {
      doc.text('Nessun asset attivo registrato nel database.', 20, y + 6);
      y += 10;
    } else {
      portfolioState.assets.forEach((asset, idx) => {
        // Stripe background
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(15, y, 180, 7, 'F');
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text(asset.ticker, 18, y + 5);
        doc.setFont('helvetica', 'normal');
        
        // Truncate name if it exceeds space
        const nameText = asset.name.length > 25 ? asset.name.slice(0, 23) + '..' : asset.name;
        doc.text(nameText, 40, y + 5);
        
        doc.text(asset.assetType, 85, y + 5);
        
        const isCash = asset.assetType === 'CASH';
        const qtyFormatted = isCash ? asset.quantity.toLocaleString('it-IT') : asset.quantity.toLocaleString('it-IT', { maximumFractionDigits: 4 });
        doc.text(qtyFormatted, 110, y + 5);
        
        doc.text(`${asset.weight.toFixed(1)}%`, 140, y + 5);
        
        const valFormatted = `EUR ${asset.currentValue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        doc.setFont('helvetica', 'bold');
        doc.text(valFormatted, 160, y + 5);
        doc.setFont('helvetica', 'normal');
        
        y += 7;
      });
    }

    // 4. LATEST 5 TRANSACTIONS
    y += 10;
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('3. CRONOLOGIA DEGLI ULTIMI 5 MOVIMENTI REGISTRATI', 15, y);

    y += 5;
    // Table Header
    doc.setFillColor(15, 23, 42); // Primary slate header
    doc.rect(15, y, 180, 7, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('DATA', 18, y + 5);
    doc.text('TIPO', 42, y + 5);
    doc.text('ASSET', 75, y + 5);
    doc.text('QUANTITÀ', 98, y + 5);
    doc.text('PREZZO', 130, y + 5);
    doc.text('NOTA COMPILATA', 158, y + 5);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    // Get latest 5 transactions sorted by date descending format (newest first)
    const latestTransactions = [...transactions].reverse().slice(0, 5);
    
    if (latestTransactions.length === 0) {
      doc.text('Nessuna transazione recente presente nel registro d\'uso.', 20, y + 6);
      y += 10;
    } else {
      latestTransactions.forEach((tx, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(15, y, 180, 7, 'F');
        }
        
        // Format Date
        const dateObj = new Date(tx.date);
        const txDate = dateObj.toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit' });
        doc.text(txDate, 18, y + 5);
        
        // Format Type
        doc.setFont('helvetica', 'bold');
        if (tx.type === 'ACQUISTO') {
          doc.setTextColor(16, 185, 129); // Green
          doc.text('ACQUISTO', 42, y + 5);
        } else if (tx.type === 'VENDITA') {
          doc.setTextColor(239, 68, 68); // Red
          doc.text('VENDITA', 42, y + 5);
        } else {
          doc.setTextColor(59, 130, 246); // Blue
          doc.text(tx.type, 42, y + 5);
        }
        doc.setTextColor(51, 65, 85);
        doc.setFont('helvetica', 'normal');
        
        // Ticker
        doc.setFont('helvetica', 'bold');
        doc.text(tx.ticker, 75, y + 5);
        doc.setFont('helvetica', 'normal');
        
        // Quantity
        const isTxCash = tx.assetType === 'CASH';
        const txQty = isTxCash ? tx.quantity.toLocaleString('it-IT') : tx.quantity.toLocaleString('it-IT', { maximumFractionDigits: 4 });
        doc.text(txQty, 98, y + 5);
        
        // Price
        const txPrice = `EUR ${tx.price.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        doc.text(txPrice, 130, y + 5);
        
        // Custom Note
        const noteText = tx.notes ? (tx.notes.length > 20 ? tx.notes.slice(0, 18) + '..' : tx.notes) : 'Generica';
        doc.text(noteText, 158, y + 5);
        
        y += 7;
      });
    }

    // 5. FOOTER & DISCLOSURES
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 274, 195, 274);
    
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Questo documento costituisce un rendiconto finanziario simulato ad uso esclusivo del titolare dell\'account.', 15, 278);
    doc.text('Portli Intelligence non fornisce servizi di consulenza finanziaria personalizzata. Valutazioni basate su mercati simulati in tempo reale.', 15, 282);
    doc.text('Pagina 1 di 1 • Generato per mezzo di Algoritmi Crittografici Euleriani.', 195, 282, { align: 'right' });

    // Download PDF
    doc.save(`Portli_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setSelectedTicker(searchVal.toUpperCase().trim());
      setSearchVal('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0e12] relative overflow-hidden flex items-center justify-center">
        {/* Render backend login container which emerges on slide-up curtain exit */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 40 : 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          className="w-full flex items-center justify-center"
        >
          <AuthView onAuthSuccess={handleAuthSuccess} />
        </motion.div>

        <AnimatePresence>
          {showSplash && (
            <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex overflow-x-hidden font-sans select-none selection:bg-[#00c2ff]/20 selection:text-white transition-all duration-300">
      
      {/* Animated Splash Screen Overlay */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
      
      {/* Premium Theme Switcher Seamless Wipe Overlay */}
      <AnimatePresence>
        {themeTransition.active && (
          <motion.div
            key={`theme-transition-${themeTransition.current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] pointer-events-none select-none flex items-center justify-center backdrop-blur-[2px]"
            style={{
              background: themeTransition.current === 'sun'
                ? 'radial-gradient(circle at 85% 5%, rgba(245, 158, 11, 0.25) 0%, rgba(248, 250, 252, 0.96) 65%, #f8fafc 100%)'
                : themeTransition.current === 'dark'
                ? 'radial-gradient(circle at 85% 5%, rgba(167, 139, 250, 0.2) 0%, rgba(11, 12, 16, 0.96) 65%, #0b0c10 100%)'
                : 'radial-gradient(circle at 85% 5%, rgba(0, 194, 255, 0.25) 0%, rgba(7, 9, 15, 0.96) 65%, #07090f 100%)'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center gap-3 backdrop-blur-md bg-[#111927]/30 border border-white/10 py-6 px-10 rounded-2xl shadow-2xl text-center"
            >
              {themeTransition.current === 'sun' ? (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-500 animate-pulse">
                  <Sun className="h-8 w-8" />
                </div>
              ) : themeTransition.current === 'dark' ? (
                <div className="p-3.5 bg-violet-500/10 border border-violet-500/30 rounded-full text-violet-400 animate-pulse">
                  <Moon className="h-8 w-8" />
                </div>
              ) : (
                <div className="p-3.5 bg-[#00c2ff]/10 border border-[#00c2ff]/30 rounded-full text-[#00c2ff] animate-pulse">
                  <Zap className="h-8 w-8" />
                </div>
              )}
              
              <div className="font-mono">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black block">Inizializzazione Stile</span>
                <span className="text-sm font-bold text-white block mt-1 uppercase tracking-wider">
                  {themeTransition.current === 'sun' && 'Sun Classico (Light)'}
                  {themeTransition.current === 'dark' && 'Dark Carbon'}
                  {themeTransition.current === 'neon' && 'Neon Cyberpunk'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dynamic styling tags in perfect compliance with core indicators and layouts */}
      <style>{`
        /* Custom scrollbar configurations for high density scannability */
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #07090f;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #1a2332;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #00c2ff;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        
        /* Marquee horizontal animation */
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        
        /* Custom neon pulse effects */
        @keyframes custom-neon-pulse {
          0%, 100% { box-shadow: 0 0 5px rgba(0, 194, 255, 0.2); }
          50% { box-shadow: 0 0 15px rgba(0, 194, 255, 0.4); }
        }
        .neon-status-glow {
          animation: custom-neon-pulse 2.5s infinite;
        }
      `}</style>

      {/* LEFT COLLAPSIBLE NAVIGATION SIDEBAR */}
      <aside 
        id="side-bar-navigation"
        className={`bg-[#0b0f19] border-r border-[#1a2332]/80 min-h-screen sticky top-0 flex flex-col justify-between shrink-0 transition-all duration-300 z-30 select-none ${
          isSidebarCollapsed ? 'w-20' : 'w-[280px]'
        }`}
      >
        <div className="flex flex-col">
          
          {/* LOGO & HIDE-SHOW TRIGGER CONTROLLER */}
          <div className="px-5 py-4 border-b border-[#1a2332]/60 flex items-center justify-between h-16">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2.5">
                <PortliLogo size={32} />
                <div className="flex flex-col">
                  <span className="font-extrabold text-[15px] tracking-widest text-white font-mono leading-none">
                    PORTLI
                  </span>
                  <span className="text-[7.5px] font-mono text-[#00c2ff] tracking-tight uppercase font-bold mt-0.5">
                    Track. Analyze. Grow.
                  </span>
                </div>
              </div>
            )}

            {isSidebarCollapsed && (
              <div className="mx-auto">
                <PortliLogo size={28} />
              </div>
            )}

            <button
              id="sidebar-toggle-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-gray-500 hover:text-white bg-[#111927]/60 hover:bg-[#1a2332] p-1 rounded-md transition duration-200 outline-none"
              title={isSidebarCollapsed ? "Espandi Menu" : "Riduci Menu"}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* DYNAMIC CURRENT STAT CARD INSIDE THE DRAWER */}
          {!isSidebarCollapsed ? (
            <div className="p-4 mx-4 mt-4 bg-[#111927]/70 border border-[#1a2332] rounded-xl ai-glow">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-black block mb-1">
                TOTALE PORTAFOGLIO
              </span>
              <div className="text-[17px] font-extrabold text-white font-mono tracking-tight leading-none mb-1 shadow-sm">
                € {portfolioState.totalValue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </div>
              <span className={`text-[10px] font-bold font-mono ${
                globalPerformancePercentage >= 0 ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'
              }`}>
                {globalPerformancePercentage >= 0 ? '▲ +' : '▼ '}
                {globalPerformancePercentage.toFixed(2)}%
              </span>
            </div>
          ) : (
            <div className="my-4 text-center cursor-help" title={`Totale: € ${portfolioState.totalValue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`}>
              <span className="w-2.5 h-2.5 rounded-full inline-block bg-[#00e5a0] animate-pulse" />
            </div>
          )}

          {/* SECTION TABS LIST */}
          <nav className="p-3 space-y-1 mt-4">
            
            {/* 1. Dashboard Tab */}
            <button
              id="nav-section-dashboard"
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center rounded-xl p-3 text-xs font-bold transition duration-200 uppercase tracking-wide outline-none ${
                activeSection === 'dashboard'
                  ? 'bg-[#00c2ff]/10 text-[#00c2ff] border border-[#00c2ff]/25'
                  : 'text-gray-400 hover:text-white hover:bg-[#111927]/50 border border-transparent'
              } ${isSidebarCollapsed ? 'justify-center' : 'gap-3.5'}`}
            >
              <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </button>

            {/* 2. Holdings Tab */}
            <button
              id="nav-section-holdings"
              onClick={() => setActiveSection('holdings')}
              className={`w-full flex items-center rounded-xl p-3 text-xs font-bold transition duration-200 uppercase tracking-wide outline-none ${
                activeSection === 'holdings'
                  ? 'bg-[#00c2ff]/10 text-[#00c2ff] border border-[#00c2ff]/25'
                  : 'text-gray-400 hover:text-white hover:bg-[#111927]/50 border border-transparent'
              } ${isSidebarCollapsed ? 'justify-center' : 'gap-3.5'}`}
            >
              <Layers className="h-4.5 w-4.5 shrink-0" />
              {!isSidebarCollapsed && <span>Holdings</span>}
            </button>

            {/* 3. Transazioni Tab */}
            <button
              id="nav-section-transazioni"
              onClick={() => setActiveSection('transazioni')}
              className={`w-full flex items-center rounded-xl p-3 text-xs font-bold transition duration-200 uppercase tracking-wide outline-none ${
                activeSection === 'transazioni'
                  ? 'bg-[#00c2ff]/10 text-[#00c2ff] border border-[#00c2ff]/25'
                  : 'text-gray-400 hover:text-white hover:bg-[#111927]/50 border border-transparent'
              } ${isSidebarCollapsed ? 'justify-center' : 'gap-3.5'}`}
            >
              <ArrowUpDown className="h-4.5 w-4.5 shrink-0" />
              {!isSidebarCollapsed && <span>Transazioni</span>}
            </button>

            {/* 4. Analytics Tab */}
            <button
              id="nav-section-analytics"
              onClick={() => setActiveSection('analytics')}
              className={`w-full flex items-center rounded-xl p-3 text-xs font-bold transition duration-200 uppercase tracking-wide outline-none ${
                activeSection === 'analytics'
                  ? 'bg-[#00c2ff]/10 text-[#00c2ff] border border-[#00c2ff]/25'
                  : 'text-gray-400 hover:text-white hover:bg-[#111927]/50 border border-transparent'
              } ${isSidebarCollapsed ? 'justify-center' : 'gap-3.5'}`}
            >
              <TrendingUp className="h-4.5 w-4.5 shrink-0" />
              {!isSidebarCollapsed && <span>Analytics</span>}
            </button>

            {/* 4.1. Comparison Tab */}
            <button
              id="nav-section-confronto"
              onClick={() => setActiveSection('confronto')}
              className={`w-full flex items-center rounded-xl p-3 text-xs font-bold transition duration-200 uppercase tracking-wide outline-none ${
                activeSection === 'confronto'
                  ? 'bg-[#00c2ff]/10 text-[#00c2ff] border border-[#00c2ff]/25'
                  : 'text-gray-400 hover:text-white hover:bg-[#111927]/50 border border-transparent'
              } ${isSidebarCollapsed ? 'justify-center' : 'gap-3.5'}`}
            >
              <BarChart3 className="h-4.5 w-4.5 shrink-0" />
              {!isSidebarCollapsed && <span>Confronto Asset</span>}
            </button>

            {/* 4.5. Report PDF Tab */}
            <button
              id="nav-section-reports"
              onClick={() => setActiveSection('reports')}
              className={`w-full flex items-center rounded-xl p-3 text-xs font-bold transition duration-200 uppercase tracking-wide outline-none ${
                activeSection === 'reports'
                  ? 'bg-[#00c2ff]/10 text-[#00c2ff] border border-[#00c2ff]/25'
                  : 'text-gray-400 hover:text-white hover:bg-[#111927]/50 border border-transparent'
              } ${isSidebarCollapsed ? 'justify-center' : 'gap-3.5'}`}
            >
              <FileText className="h-4.5 w-4.5 shrink-0" />
              {!isSidebarCollapsed && <span>Report DECA</span>}
            </button>

            {/* 5. Impostazioni Tab */}
            <button
              id="nav-section-impostazioni"
              onClick={() => setActiveSection('impostazioni')}
              className={`w-full flex items-center rounded-xl p-3 text-xs font-bold transition duration-200 uppercase tracking-wide outline-none ${
                activeSection === 'impostazioni'
                  ? 'bg-[#00c2ff]/10 text-[#00c2ff] border border-[#00c2ff]/25'
                  : 'text-gray-400 hover:text-white hover:bg-[#111927]/50 border border-transparent'
              } ${isSidebarCollapsed ? 'justify-center' : 'gap-3.5'}`}
            >
              <Settings className="h-4.5 w-4.5 shrink-0" />
              {!isSidebarCollapsed && <span>Impostazioni</span>}
            </button>

            {/* 6. Disconnetti Tab */}
            <button
              id="nav-section-logout"
              onClick={handleLogout}
              className={`w-full flex items-center rounded-xl p-3 text-xs font-bold transition duration-200 uppercase tracking-wide outline-none text-gray-400 hover:text-[#ff3d6b] hover:bg-red-500/5 border border-transparent ${isSidebarCollapsed ? 'justify-center' : 'gap-3.5'}`}
              title="Disconnetti sessione Portli"
            >
              <LogOut className="h-4.5 w-4.5 shrink-0" />
              {!isSidebarCollapsed && <span>Disconnetti</span>}
            </button>

          </nav>

          {/* Quick-Jump Keyboard Trigger Widget */}
          <div className="px-4 py-2.5 mx-4 mt-2 mb-4 bg-slate-900/45 border border-[#1a2332]/50 hover:border-[#00c2ff]/35 rounded-xl flex items-center justify-between text-[10px] font-mono hover:bg-[#0b1223] cursor-pointer text-gray-400 hover:text-[#00c2ff] transition-all duration-200 group"
               onClick={() => setIsCommandPaletteOpen(true)}
               title="Apri Quick-Jump (Ctrl+K)"
          >
            <div className={`flex items-center gap-2 ${isSidebarCollapsed ? 'mx-auto' : ''}`}>
              <Command className="h-4 w-4 text-[#00c2ff]/80 group-hover:text-[#00c2ff] shrink-0" />
              {!isSidebarCollapsed && (
                <span className="font-semibold text-[9.5px] uppercase font-sans tracking-wider">
                  Quick-Jump
                </span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-1 shrink-0 bg-[#07090f] border border-[#1a2332] px-1.5 py-0.5 rounded text-[8px] font-mono leading-none font-black text-[#00c2ff] shadow-sm select-none">
                <span>CTRL + K</span>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM USER PROFILE BADGE SECTION */}
        <div className="border-t border-[#1a2332]/60 p-4 shrink-0 bg-[#080d17]/50 h-16 flex items-center justify-center">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-3 w-full">
              <div className="h-9 w-9 bg-[#00c2ff]/10 border border-[#00c2ff]/40 rounded-full flex items-center justify-center text-[#00c2ff] font-extrabold font-mono text-sm uppercase">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate leading-none">{userName}</p>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5 truncate uppercase">{userTier}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Scollega Sessione Sicura"
                className="text-gray-400 hover:text-[#ff3d6b] p-1.5 rounded-lg hover:bg-red-500/10 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="h-9 w-9 bg-[#00c2ff]/15 border border-[#00c2ff]/40 rounded-full flex items-center justify-center text-[#00c2ff] hover:text-[#ff3d6b] hover:border-[#ff3d6b]/40 hover:bg-[#ff3d6b]/10 font-bold font-mono text-sm uppercase transition-all duration-200"
              title="Clicca per scollegarti"
            >
              {userName.charAt(0).toUpperCase()}
            </button>
          )}
        </div>

      </aside>

      {/* RIGHT SIDE EXPANDED WORKSPACE CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* UPPER REAL-TIME TICKER */}
        <HeaderTicker />

        {/* GLOBAL TOP NAVIGATION HEADER BAR */}
        <header className="w-full bg-[#111927] border-b border-[#1a2332] py-4 px-6 shadow-xl relative z-10 h-16 flex items-center">
          <div className="w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Branded Title and Status Info */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] bg-[#00c2ff]/10 border border-[#00c2ff]/20 text-[#00c2ff] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider font-mono">
                  ACTIVE NETWORK
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                   Quantum Cognitive Engine Live
                </span>
              </div>
            </div>

            {/* AI GLOBAL SEARCH INPUT FORM SU STEROIDI */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              {/* Quick Preset Hotstocks Buttons */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto select-none">
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider font-extrabold">Hot:</span>
                <button
                  type="button"
                  onClick={() => setSelectedTicker('NVDA')}
                  className="bg-[#00c2ff]/10 hover:bg-[#00c2ff]/20 text-[#00c2ff] border border-[#00c2ff]/30 text-[9px] font-mono font-black px-1.5 py-0.5 rounded transition cursor-pointer flex items-center gap-1"
                >
                  <span className="w-1 h-1 rounded-full bg-[#00c2ff] animate-ping" />
                  NVDA
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTicker('MC.PA')}
                  className="bg-[#00e5a0]/10 hover:bg-[#00e5a0]/20 text-[#00e5a0] border border-[#00e5a0]/30 text-[9px] font-mono font-black px-1.5 py-0.5 rounded transition cursor-pointer flex items-center gap-1"
                >
                  <span className="w-1 h-1 rounded-full bg-[#00e5a0] animate-ping" />
                  LVMH
                </button>
              </div>

              <form onSubmit={handleGlobalSearchSubmit} className="relative w-full sm:w-96 group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00c2ff] via-[#bf5af2] to-[#ff3d6b] rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500 rounded-xl" />
                <div className="relative bg-gradient-to-r from-[#00c2ff] via-[#bf5af2] to-[#ff3d6b] p-[1.5px] rounded-xl shadow-lg">
                  <div className="relative bg-[#070911] rounded-[10px] flex items-center h-10 px-3 overflow-hidden">
                    <Search className="h-4.5 w-4.5 text-[#00c2ff] mr-2 shrink-0 animate-pulse" />
                    
                    {/* Glowing neural indicator */}
                    <span className="text-[7.5px] font-mono font-black text-[#ff3d6b] border border-[#ff3d6b]/40 rounded px-1.5 py-0.2 mr-2 leading-none uppercase select-none tracking-widest bg-[#ff3d6b]/10 animate-pulse shrink-0">
                      NEURAL AI
                    </span>

                    <input
                      type="text"
                      placeholder="Analizza Ticker con AI (es. APPL, TSLA, BTC...)"
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      className="w-full bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none font-mono tracking-tight font-black uppercase text-left pr-20"
                    />

                    <button
                      type="submit"
                      className="absolute right-1.5 bg-gradient-to-r from-[#00c2ff] to-[#bf5af2] text-slate-950 font-black text-[9.5px] uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all duration-300 transform hover:scale-[1.03] active:scale-95 shadow-md shadow-[#00c2ff]/25 cursor-pointer flex items-center gap-1 hover:brightness-110"
                    >
                      <Sparkles className="h-3 w-3" />
                      ANALYZE
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Connected clock & system analytics info */}
            <div className="hidden md:flex items-center gap-3.5 text-xs font-mono">
              {/* Premium Button Trigger or Badge */}
              {userTier === 'Piano Free' ? (
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="bg-gradient-to-r from-amber-500/10 to-rose-500/10 hover:from-amber-500 hover:to-rose-500 border border-amber-500/30 text-amber-500 hover:text-slate-950 px-3 py-1.5 rounded-xl font-bold font-sans text-[10px] uppercase flex items-center gap-1.5 transition select-none cursor-pointer"
                >
                  <Crown className="h-3.5 w-3.5 shrink-0" />
                  Sblocca Premium
                </button>
              ) : (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 px-3 py-1.5 rounded-xl font-bold font-sans text-[10px] uppercase flex items-center gap-1.5 select-none">
                  <Crown className="h-3.5 w-3.5 animate-pulse shrink-0" />
                  Premium Elite
                </div>
              )}

              {/* Dynamic Theme Selection Button cluster */}
              <div className="bg-[#07090f] border border-[#1a2332] p-0.5 rounded-lg flex items-center relative z-0">
                <button
                  type="button"
                  onClick={() => handleThemeChange('sun')}
                  className={`p-1.5 rounded-md transition relative z-10 ${
                    theme === 'sun'
                      ? 'text-[#0284c7]'
                      : 'text-gray-500 hover:text-white'
                  }`}
                  title="Stile Sun Classico (Bianco)"
                >
                  {theme === 'sun' && (
                    <motion.div
                      layoutId="activeThemeBgPill"
                      className="absolute inset-0 bg-[#111927] border border-[#1a2332] rounded-md z-[-1]"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <Sun className="h-3.5 w-3.5 cursor-pointer shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`p-1.5 rounded-md transition relative z-10 ${
                    theme === 'dark'
                      ? 'text-white'
                      : 'text-gray-500 hover:text-white'
                  }`}
                  title="Stile Dark Classico (Nero)"
                >
                  {theme === 'dark' && (
                    <motion.div
                      layoutId="activeThemeBgPill"
                      className="absolute inset-0 bg-[#111927] border border-[#1a2332] rounded-md z-[-1]"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <Moon className="h-3.5 w-3.5 cursor-pointer shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeChange('neon')}
                  className={`p-1.5 rounded-md transition relative z-10 ${
                    theme === 'neon'
                      ? 'text-[#00c2ff]'
                      : 'text-gray-500 hover:text-white'
                  }`}
                  title="Stile Neon Immersivo"
                >
                  {theme === 'neon' && (
                    <motion.div
                      layoutId="activeThemeBgPill"
                      className="absolute inset-0 bg-[#111927] border border-[#1a2332] rounded-md z-[-1]"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <Zap className="h-3.5 w-3.5 cursor-pointer shrink-0" />
                </button>
              </div>

              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
                <span>{currentTime || '18:46:34'} UTC</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-[#07090f] border border-[#1a2332] py-1 px-2.5 rounded-lg text-[9px] text-[#00e5a0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] inline-block animate-[pulse_1.5s_infinite]" />
                <span>LIVE</span>
              </div>
            </div>

          </div>
        </header>

        {/* WORKSPACE DETAILED SWITCHOVER PAGE ROUTING CONTAINER */}
        <main className="flex-grow p-4 sm:p-6 overflow-y-auto w-full">
          
          {/* SECTION A: DASHBOARD VIEW COGNITION */}
          {activeSection === 'dashboard' && (
            <div id="section-view-dashboard" className="space-y-6">
              
              {/* Dynamic Welcome bar custom matching original screenshot style */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a2332]/30 pb-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans flex items-center gap-2">
                    Benvenuto, {userName} 👋
                  </h2>
                  <p className="text-xs text-gray-500 font-mono">
                    Ecco il riepilogo del tuo portafoglio oggi.
                  </p>
                </div>

                <button
                  id="btn-export-pdf-report"
                  onClick={handleExportReportPDF}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#00c2ff]/10 to-[#00e5a0]/10 hover:from-[#00c2ff]/20 hover:to-[#00e5a0]/20 text-[#00c2ff] hover:text-white border border-[#00c2ff]/30 hover:border-[#00e5a0]/40 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-mono shadow-lg shadow-[#00c2ff]/5 transition-all duration-300 select-none cursor-pointer self-start sm:self-auto hover:brightness-110 active:scale-95"
                  title="Esporta il rendiconto sintetico del portafoglio in PDF"
                >
                  <FileDown className="h-4 w-4 text-[#00c2ff]" />
                  <span>Esporta Report</span>
                </button>
              </div>

              {/* DYNAMIC KPI NET WORTH AND GAINS */}
              <KpiCards
                assets={portfolioState.assets}
                totalValue={portfolioState.totalValue}
                totalCost={portfolioState.totalCost}
              />

              {/* CORE METRICS GRID WITH TWO INTEGRATED CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                
                {/* WIDE COLS (8/12) - 5-YEAR COMPOSITE PERFORMANCE & BENCHMARK CHART */}
                <div id="dashboard-chart-performance" className="lg:col-span-8">
                  <PerformanceChart historicalData={historicalTimeline} transactions={transactions} />
                </div>

                {/* COMPACT SIDE COLS (4/12) - INTERACTIVE ASSET ALLOCATION PIE CHART */}
                <div id="dashboard-chart-allocation" className="lg:col-span-4">
                  <DashboardAllocationCard 
                    assets={portfolioState.assets}
                    totalValue={portfolioState.totalValue}
                    onSelectAsset={(ticker) => setSelectedTicker(ticker)}
                  />
                </div>

              </div>

              {/* WEEKLY PERFORMANCE HEATMAP SECTION */}
              <WeeklyHeatmap 
                assets={portfolioState.assets} 
                totalValue={portfolioState.totalValue} 
              />

              {/* SECONDARY INFO GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                
                {/* QUICK HOLDINGS SUMMARY AND ACTION DRAWER (8/12) */}
                <div className="lg:col-span-8 bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-[#1a2332]/60 pb-3.5 mb-3.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-[#00e5a0] rounded-sm" />
                        <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono text-[11px]">
                          I Miei Asset Correnti ({portfolioState.assets.length})
                        </h3>
                      </div>
                      <button 
                        onClick={() => setActiveSection('holdings')}
                        className="text-[10px] font-mono text-[#00c2ff] hover:underline hover:text-[#00c2ff]/80 font-bold uppercase tracking-wider transition"
                      >
                        Vedi Tutti ➔
                      </button>
                    </div>

                    {portfolioState.assets.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 font-mono text-xs">
                        Nessun asset presente. Aggiungi transazioni per popolarlo.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-[11px] border-collapse">
                          <thead>
                            <tr className="text-gray-500 text-[9px] uppercase tracking-wider font-black pb-2 border-b border-[#1a2332]/30 h-8">
                              <th className="pb-2">Asset</th>
                              <th className="pb-2 text-right">Quota posseduta</th>
                              <th className="pb-2 text-right">Peso %</th>
                              <th className="pb-2 text-right">Valore €</th>
                              <th className="pb-2 text-right">Rendimento (P&L)</th>
                              <th className="pb-2 text-center">AI Report</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1a2332]/20 font-sans text-xs">
                            {portfolioState.assets.slice(0, 5).map((asset) => {
                              const isPositive = asset.pnl >= 0;
                              const isCash = asset.assetType === 'CASH';
                              return (
                                <tr key={asset.ticker} className="hover:bg-[#162134]/15 transition h-10 select-none">
                                  <td className="py-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5.5 h-5.5 rounded-md flex items-center justify-center font-black font-mono text-[9px]" style={{ backgroundColor: `${asset.colorCode}22`, border: `1px solid ${asset.colorCode}44`, color: asset.colorCode }}>
                                        {asset.ticker.slice(0, 2)}
                                      </div>
                                      <div>
                                        <span className="font-bold text-white font-mono">{asset.ticker}</span>
                                        <span className="text-[9px] text-gray-500 ml-1.5 hidden sm:inline truncate max-w-[100px]">{asset.name}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2 text-right text-gray-400 font-mono text-[11px]">
                                    {isCash ? asset.quantity.toLocaleString('it-IT') : asset.quantity.toLocaleString('it-IT', { maximumFractionDigits: 4 })}
                                  </td>
                                  <td className="py-2 text-right text-[#00c2ff] font-bold font-mono text-[10px]">
                                    {asset.weight.toFixed(1)}%
                                  </td>
                                  <td className="py-2 text-right text-white font-bold font-mono text-[11px]">
                                    €{asset.currentValue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </td>
                                  <td className={`py-2 text-right font-bold text-[11px] font-mono ${isPositive ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'}`}>
                                    {isCash ? '-' : `${isPositive ? '+' : ''}${asset.pnlPercent.toFixed(2)}%`}
                                  </td>
                                  <td className="py-2 text-center">
                                    {isCash ? '-' : (
                                      <button
                                        onClick={() => setSelectedTicker(asset.ticker)}
                                        className="text-gray-500 hover:text-[#00c2ff] p-1.5 rounded-lg hover:bg-[#1a2332] inline-flex items-center transition cursor-pointer"
                                        title={`Analisi AI per ${asset.ticker}`}
                                      >
                                        <Sparkles className="h-3.5 w-3.5 text-[#00c2ff]" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#1a2332]/50 pt-3.5 mt-4 text-[10.5px] text-gray-500 font-mono flex items-center gap-1.5 select-none font-medium">
                    <Sparkles className="h-3.5 w-3.5 text-[#00c2ff]" />
                    Fai click sull'icona della scintilla AI per lanciare in tempo reale il report di analisi fondamentale.
                  </div>
                </div>

                {/* COMPACT SIDE COLS (4/12) - GLOBAL INDICES FEED & DIALOG MACROS */}
                <div className="lg:col-span-4">
                  <NewsFeed />
                </div>

              </div>

            </div>
          )}

          {/* SECTION B: HOLDINGS OVERVIEW GRID */}
          {activeSection === 'holdings' && (
            <div id="section-view-holdings" className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider font-mono">
                  Analisi delle Posizioni Attive
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  Performance singole degli asset ripartite per quotazione corrente, pesi e tassi di capitalizzazione
                </p>
              </div>

              <AssetsTable
                assets={portfolioState.assets}
                onSelectAsset={(ticker) => setSelectedTicker(ticker)}
                customPrices={customPrices}
                onUpdatePrice={handleUpdateCustomPrice}
              />

              {/* Strategic Insights Informative Block */}
              <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border text-xs flex flex-col gap-3 leading-relaxed">
                <div className="flex items-center gap-1.5 text-white font-black font-mono text-[10px] uppercase">
                  <Sparkles className="h-4 w-4 text-[#00c2ff]" />
                  Utilizza la Tecnologia Predittiva AI:
                </div>
                <p className="text-gray-400">
                  Usa il pulsante <strong className="bg-[#1a2332] text-gray-300 py-0.5 px-1.5 rounded font-mono text-[9px]">Insights</strong> all'interno della tabella qui sopra corrispondente a ciascun asset o digita il ticker nella barra di ricerca superiore per richiedere un report completo generato in tempo reale dall'intelligenza artificiale.
                </p>
              </div>
            </div>
          )}

          {/* SECTION C: TRANSIZIONI REGISTER PAGE (SPLIT ACCORDING TO USER REQUEST) */}
          {activeSection === 'transazioni' && (
            <div id="section-view-transazioni" className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider font-mono">
                  Registro Transazioni & Servizio Movimenti
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  Inserisci acquisti, vendite e depositi di liquidità per aggiornare costantemente l'esposizione
                </p>
              </div>

              <TransactionForm
                transactions={transactions}
                onAddTransaction={handleAddTransaction}
                onRemoveTransaction={handleRemoveTransaction}
              />
            </div>
          )}

          {/* SECTION D: ADVANCED ANALYTICS INTERFACES */}
          {activeSection === 'analytics' && (
            <div id="section-view-analytics" className="space-y-6">
              <AnalyticsView 
                assets={portfolioState.assets}
                totalValue={portfolioState.totalValue}
                userTier={userTier}
                onUpgradeClick={() => setShowPremiumModal(true)}
              />
            </div>
          )}

          {/* SECTION D.1: ASSET COMPARISON PANEL */}
          {activeSection === 'confronto' && (
            <div id="section-view-confronto" className="space-y-6">
              <AssetComparison 
                assets={portfolioState.assets}
                userTier={userTier}
                totalValue={portfolioState.totalValue}
              />
            </div>
          )}

          {/* SECTION D.5: PDF RAPPORTI DECA */}
          {activeSection === 'reports' && (
            <div id="section-view-reports" className="space-y-6">
              <PDFReportSection
                assets={portfolioState.assets}
                totalValue={portfolioState.totalValue}
                totalCost={portfolioState.totalCost}
                transactions={transactions}
                historicalData={historicalTimeline}
                userName={userName}
                userTier={userTier}
              />
            </div>
          )}

          {/* SECTION E: SYSTEM PREFERENCES & SETTINGS */}
          {activeSection === 'impostazioni' && (
            <div id="section-view-impostazioni" className="space-y-6">
              <SettingsView 
                onResetData={handleResetData}
                onClearAllData={() => setTransactions([])}
                transactionsCount={transactions.length}
              />
            </div>
          )}

        </main>

        {/* Global Footer info bar containing quick copyright */}
        <footer className="py-4 border-t border-[#1a2332]/40 text-center text-[10px] text-gray-500 font-mono shrink-0">
          Quantum.Trade Portal © {new Date().getFullYear()} • Securely Proxying Financial Cognitive Pipelines
        </footer>

      </div>

      {/* EXPANDED SYSTEM DRAWERS (AI BOTTOM-RIGHT INTELLECT SHEETS) */}
      <AnimatePresence>
        {selectedTicker && (
          <AiInsightsDrawer
            ticker={selectedTicker}
            onClose={() => setSelectedTicker(null)}
          />
        )}
      </AnimatePresence>

      {/* Premium upgrade subscription modal popup */}
      {showPremiumModal && (
        <PremiumModal
          onClose={() => setShowPremiumModal(false)}
          userTier={userTier}
          onUpgradeSuccess={(newTier) => {
            setUserTier(newTier);
            localStorage.setItem('qevora_tier', newTier);
            localStorage.setItem('portly_tier', newTier);
            // Dispatch storage event asynchronously to prevent concurrent update re-entry loops
            setTimeout(() => {
              window.dispatchEvent(new Event('storage'));
            }, 0);
          }}
        />
      )}

      {/* Keyboard Quick-Jump Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectSection={(section) => setActiveSection(section)}
        currentSection={activeSection}
      />

    </div>
  );
}
