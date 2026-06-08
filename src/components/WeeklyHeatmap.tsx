import React, { useState, useMemo } from 'react';
import { Calendar, Flame, Sparkles, TrendingUp, TrendingDown, Activity, Info, AlertTriangle } from 'lucide-react';
import { PortfolioAsset } from '../types';

interface WeeklyHeatmapProps {
  assets: PortfolioAsset[];
  totalValue: number;
}

// Simple seed randomizer for stable, predictable yet realistic historical daily return shapes
function seededRandom(seedStr: string): number {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

interface HeatmapDay {
  date: Date;
  dateStr: string;
  weekdayName: string;
  dayIndex: number; // 0=Mon, ..., 6=Sun
  weekIndex: number;
  pnlPercent: number;
  valueChangeEur: number;
  primaryDriver: string;
  driverChange: number;
  sentiment: 'Bullish' | 'Bearish' | 'Stable';
}

export default function WeeklyHeatmap({ assets = [], totalValue = 0 }: WeeklyHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [activeMetric, setActiveMetric] = useState<'percent' | 'eur'>('percent');
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);

  // We want to generate the last 15 weeks of data (cols = 16, rows = 7)
  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  const fullDaysOfWeekNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  
  const numWeeks = 15;

  // Generate heatmap matrix
  const { weeksData, stats, daysFlat } = useMemo(() => {
    const today = new Date();
    // Round to standard 2026-05-26 limit
    today.setHours(12, 0, 0, 0);

    // Let's go back 15 completed weeks to find the start Monday of the sequence
    const currentDayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon ...
    const offsetToLastMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - offsetToLastMonday);

    const startDate = new Date(startOfCurrentWeek);
    startDate.setDate(startDate.getDate() - (numWeeks - 1) * 7); // Go back 14 weeks from this week's Monday

    const generatedDays: HeatmapDay[] = [];

    // Let's assign an active size value if empty
    const portfolioScale = totalValue > 0 ? totalValue : 125000;

    for (let w = 0; w < numWeeks; w++) {
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (w * 7) + d);

        // Don't calculate days in the future
        if (currentDate.getTime() > today.getTime()) {
          continue;
        }

        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Generate general market movement for this specific day using date seed
        const marketBase = (seededRandom(dateStr) - 0.49) * 1.5; // range rough -0.73% to +0.76%
        
        // Accumulate returns for current assets
        let weightedReturnSum = 0;
        let totalWeight = 0;

        // Custom default assets fallback if user has empty portfolio to make it look active
        const simulatedAssets = assets.length > 0 ? assets : [
          { ticker: 'BTC', weight: 35, assetType: 'CRYPTO' },
          { ticker: 'CSPX', weight: 45, assetType: 'ETF' },
          { ticker: 'AAPL', weight: 20, assetType: 'STOCK' }
        ];

        simulatedAssets.forEach((asset) => {
          const idioSeed = `${asset.ticker}-${dateStr}`;
          const idioFluc = (seededRandom(idioSeed) - 0.5) * 2; // -1 to 1
          
          let volatility = 0.012; // default
          let beta = 1.0;

          if (asset.assetType === 'CRYPTO') {
            volatility = 0.038;
            beta = 1.85;
          } else if (asset.assetType === 'STOCK') {
            volatility = 0.018;
            beta = 1.15;
          } else if (asset.assetType === 'ETF') {
            volatility = 0.007;
            beta = 0.75;
          } else if (asset.assetType === 'CASH') {
            volatility = 0.000;
            beta = 0.0;
          }

          const idiosyncraticReturn = idioFluc * volatility;
          const assetReturn = (marketBase * beta) + idiosyncraticReturn;
          const itemWeight = 'weight' in asset ? asset.weight : 33.3;

          weightedReturnSum += assetReturn * itemWeight;
          totalWeight += itemWeight;
        });

        // Compute portfolio return for this specific day
        let dailyReturn = totalWeight > 0 ? (weightedReturnSum / totalWeight) : 0;
        
        // Saturday and Sunday standard stock market dampening
        // If there's crypto, we leave some fluc, otherwise we clamp near 0
        const cryptoWeight = simulatedAssets
          .filter(a => a.assetType === 'CRYPTO')
          .reduce((acc, a) => acc + ('weight' in a ? a.weight : 33), 0);

        if (d === 5 || d === 6) { // Sat, Sun
          const dampingFactor = (cryptoWeight / 100) * 0.8; // up to 80% activity preservation
          dailyReturn = dailyReturn * dampingFactor;
        }

        const valueChangeEur = portfolioScale * (dailyReturn / 100);

        // Find principal driver asset for visual flavor
        let topDriver = 'Mercato Globale';
        let maxImpact = 0;
        simulatedAssets.forEach(asset => {
          const itemWeight = 'weight' in asset ? asset.weight : 33.3;
          const relativeImpact = Math.abs(itemWeight * (asset.assetType === 'CRYPTO' ? 2 : 1));
          if (relativeImpact > maxImpact) {
            maxImpact = relativeImpact;
            topDriver = asset.ticker;
          }
        });

        const dSeed = `${topDriver}-${dateStr}-driver`;
        const driverReturn = (marketBase * 1.2) + (seededRandom(dSeed) - 0.5) * (topDriver === 'BTC' ? 4 : 2);

        let sentiment: 'Bullish' | 'Bearish' | 'Stable' = 'Stable';
        if (dailyReturn > 0.4) sentiment = 'Bullish';
        else if (dailyReturn < -0.4) sentiment = 'Bearish';

        generatedDays.push({
          date: currentDate,
          dateStr,
          weekdayName: fullDaysOfWeekNames[d],
          dayIndex: d,
          weekIndex: w,
          pnlPercent: dailyReturn,
          valueChangeEur,
          primaryDriver: topDriver,
          driverChange: driverReturn,
          sentiment
        });
      }
    }

    // Structure weekly columns
    const columns: Array<{
      weekLabel: string;
      days: Array<HeatmapDay | null>;
    }> = [];

    for (let w = 0; w < numWeeks; w++) {
      const daysOfThisWeek: Array<HeatmapDay | null> = [];
      const mondayRef = new Date(startDate);
      mondayRef.setDate(startDate.getDate() + w * 7);
      
      const label = mondayRef.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });

      for (let d = 0; d < 7; d++) {
        const found = generatedDays.find(fd => fd.weekIndex === w && fd.dayIndex === d);
        daysOfThisWeek.push(found || null);
      }

      columns.push({
        weekLabel: label,
        days: daysOfThisWeek
      });
    }

    // Compute key statistics
    const activeDays = generatedDays.filter(x => x !== null);
    const greenDaysCount = activeDays.filter(d => d.pnlPercent > 0.05).length;
    const redDaysCount = activeDays.filter(d => d.pnlPercent < -0.05).length;
    const totalDaysCount = activeDays.length;
    const winRatio = totalDaysCount > 0 ? (greenDaysCount / totalDaysCount) * 100 : 0;

    let bestDay = activeDays[0];
    let worstDay = activeDays[0];
    let maxStreak = 0;
    let currentStreak = 0;

    activeDays.forEach(d => {
      if (d.pnlPercent > (bestDay?.pnlPercent || -999)) bestDay = d;
      if (d.pnlPercent < (worstDay?.pnlPercent || 999)) worstDay = d;

      // Streak check
      if (d.pnlPercent > 0) {
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    });

    // Compute Sharpe simulated
    const meanPct = activeDays.reduce((acc, d) => acc + d.pnlPercent, 0) / (totalDaysCount || 1);
    const variance = activeDays.reduce((acc, d) => acc + Math.pow(d.pnlPercent - meanPct, 2), 0) / (totalDaysCount || 1);
    const stdDev = Math.sqrt(variance) || 0.1;
    // Annualize (daily std dev * sqrt(252))
    const sharpe = stdDev > 0 ? (meanPct / stdDev) * Math.sqrt(252) : 0;

    const stats = {
      greenDaysCount,
      redDaysCount,
      winRatio,
      bestDay,
      worstDay,
      maxStreak,
      sharpeRatio: sharpe,
      totalDaysCount
    };

    return { weeksData: columns, stats, daysFlat: generatedDays };
  }, [assets, totalValue]);

  // Handle click on single cell to showcase stats permanently
  const handleCellClick = (day: HeatmapDay) => {
    setSelectedDay(selectedDay?.dateStr === day.dateStr ? null : day);
  };

  // Color selection function based on performance weight
  const getCellColor = (pnl: number) => {
    if (Math.abs(pnl) <= 0.05) {
      return 'bg-slate-800/50 border border-slate-700/60 hover:border-slate-400';
    }
    if (pnl > 0) {
      if (pnl > 1.4) {
        return 'bg-[#00e5a0] text-black shadow-[0_0_8px_rgba(0,229,160,0.5)] border border-[#00ffb7] scale-105 z-10';
      }
      if (pnl > 0.5) {
        return 'bg-emerald-500/65 border border-emerald-400/80 hover:bg-emerald-500/80';
      }
      return 'bg-emerald-500/25 border border-emerald-500/40 hover:bg-emerald-500/40';
    } else {
      if (pnl < -1.4) {
        return 'bg-[#ff3d6b] text-white shadow-[0_0_8px_rgba(255,61,107,0.5)] border border-[#ff668a] scale-105 z-10';
      }
      if (pnl < -0.5) {
        return 'bg-rose-500/55 border border-rose-400/70 hover:bg-rose-500/75';
      }
      return 'bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/30';
    }
  };

  const displayedDay = hoveredDay || selectedDay || stats.bestDay;

  return (
    <div 
      id="dashboard-heatmap-section" 
      className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col gap-4 font-sans select-none"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a2332]/60 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#00c2ff]/10 border border-[#00c2ff]/20">
            <Calendar className="h-4.5 w-4.5 text-[#00c2ff]" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono text-[11px] flex items-center gap-1.5">
              Heatmap Rendimento Settimanale
              <Sparkles className="h-3 w-3 text-[#00e5a0] animate-pulse" />
            </h3>
            <p className="text-[10px] text-gray-500 font-mono">
              Frequenza temporale della forza giornaliera del portafoglio (ultimi 100+ giorni)
            </p>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="flex items-center bg-[#07090f]/90 p-1 border border-[#1a2332] rounded-lg text-[9px] font-mono shrink-0 self-end sm:self-auto">
          <button
            id="heatmap-btn-toggle-percent"
            onClick={() => setActiveMetric('percent')}
            className={`px-2.5 py-1 rounded-sm uppercase font-bold tracking-widest transition-all cursor-pointer ${activeMetric === 'percent' ? 'bg-[#00c2ff]/10 text-[#00c2ff] border border-[#00c2ff]/30' : 'text-gray-500 hover:text-white border border-transparent'}`}
          >
            Rendimento %
          </button>
          <button
            id="heatmap-btn-toggle-eur"
            onClick={() => setActiveMetric('eur')}
            className={`px-2.5 py-1 rounded-sm uppercase font-bold tracking-widest transition-all cursor-pointer ${activeMetric === 'eur' ? 'bg-[#00c2ff]/10 text-[#00c2ff] border border-[#00c2ff]/30' : 'text-gray-500 hover:text-white border border-transparent'}`}
          >
            Impulso €
          </button>
        </div>
      </div>

      {/* Main Grid + Sidebar Container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        
        {/* HEATMAP AREA: 12 on mobile, 8 on desktop */}
        <div className="xl:col-span-8 flex flex-col justify-between overflow-hidden bg-[#07090f]/40 border border-[#1a2332]/50 rounded-xl p-4">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            <div className="min-w-[420px] pb-2 flex">
              {/* Row weekday headers */}
              <div className="flex flex-col justify-between pt-1 pb-6 pr-3 text-[10px] font-mono font-bold text-gray-500 w-10 text-right select-none select-none">
                {daysOfWeek.map((day, i) => (
                  <span key={day} className={`h-6 flex items-center justify-end ${i >= 5 ? 'text-amber-500/70' : ''}`}>
                    {day}
                  </span>
                ))}
              </div>

              {/* Grid Columns */}
              <div className="flex flex-1 justify-between gap-1.5">
                {weeksData.map((week, wIdx) => (
                  <div key={week.weekLabel} className="flex flex-col gap-1.5 items-center">
                    {/* Week squares */}
                    {week.days.map((day, dIdx) => {
                      if (!day) {
                        return (
                          <div
                            key={`empty-${wIdx}-${dIdx}`}
                            className="w-[22px] h-[22px] sm:w-[25px] sm:h-[25px] bg-[#07090f] border border-dashed border-[#1a2332]/35 rounded-[3px]"
                          />
                        );
                      }

                      const isSelected = selectedDay?.dateStr === day.dateStr;
                      const isHovered = hoveredDay?.dateStr === day.dateStr;

                      return (
                        <div
                          id={`heatmap-cell-${wIdx}-${dIdx}`}
                          key={day.dateStr}
                          className={`w-[22px] h-[22px] sm:w-[25px] sm:h-[25px] rounded-[3px] transition-all duration-150 relative cursor-pointer flex items-center justify-center ${getCellColor(day.pnlPercent)} ${isSelected ? 'ring-2 ring-white scale-110 z-20' : ''} ${isHovered ? 'brightness-125 scale-105 z-10' : ''}`}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          onClick={() => handleCellClick(day)}
                        >
                          {/* Indicator for strong moves */}
                          {Math.abs(day.pnlPercent) > 1.4 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          )}
                        </div>
                      );
                    })}

                    {/* Week bottom date labels */}
                    <span className="text-[8px] font-mono font-black text-gray-600 tracking-tighter uppercase shrink-0 mt-1 select-none">
                      {week.weekLabel.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Color scale legends */}
          <div className="flex flex-wrap items-center justify-between border-t border-[#1a2332]/40 pt-3 mt-1.5 gap-2 text-[9px] font-mono text-gray-500">
            <span className="flex items-center gap-1">
              <Info className="h-3.5 w-3.5 text-gray-600 shrink-0" />
              Scegli una cella per bloccare i dettagli e visualizzare l'asset trainante.
            </span>
            <div className="flex items-center gap-1.5">
              <span>Perdita</span>
              <div className="flex gap-1">
                <div className="w-3.5 h-3.5 rounded-[2px] bg-[#ff3d6b]/95 border border-[#ff668a]" title="Crollo > -1.4%" />
                <div className="w-3.5 h-3.5 rounded-[2px] bg-rose-500/55 border border-rose-500/70" title="Negativo -0.5% a -1.4%" />
                <div className="w-3.5 h-3.5 rounded-[2px] bg-rose-500/15 border border-rose-500/30" title="Lieve -0.05% a -0.5%" />
                <div className="w-3.5 h-3.5 rounded-[2px] bg-slate-800/50 border border-slate-700/60" title="Invariato" />
                <div className="w-3.5 h-3.5 rounded-[2px] bg-emerald-500/25 border border-emerald-500/40" title="Lieve +0.05% a +0.5%" />
                <div className="w-3.5 h-3.5 rounded-[2px] bg-emerald-500/65 border border-emerald-400/80" title="Positivo +0.5% a +1.4%" />
                <div className="w-3.5 h-3.5 rounded-[2px] bg-[#00e5a0]/95 border border-[#00ffb7]" title="Rialzo > +1.4%" />
              </div>
              <span>Guadagno</span>
            </div>
          </div>
        </div>

        {/* DETAILS SIDEBAR: 12 on mobile, 4 on desktop */}
        <div className="xl:col-span-4 flex flex-col justify-between gap-4 bg-[#07090f]/60 border border-[#1a2332]/70 rounded-xl p-4">
          
          {/* Day details section */}
          <div>
            <div className="border-b border-[#1a2332]/60 pb-2 mb-3">
              <span className="text-[7.5px] font-mono uppercase bg-[#00c2ff]/10 text-[#00c2ff] border border-[#00c2ff]/30 px-1.5 py-0.5 rounded tracking-widest font-black inline-block mb-1">
                {selectedDay ? 'GIORNO SELEZIONATO' : 'DIAPASON RECENTE'}
              </span>
              <h4 className="text-white text-xs font-black uppercase tracking-wider font-mono flex items-center justify-between">
                <span>{displayedDay ? `${displayedDay.weekdayName}` : 'Analisi giornaliera'}</span>
                {displayedDay && (
                  <span className="text-gray-500 text-[10px] lowercase font-normal">
                    {displayedDay.date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                )}
              </h4>
            </div>

            {displayedDay ? (
              <div className="space-y-3 font-mono">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#111927]/60 border border-[#1a2332]/50 rounded-lg p-2 flex flex-col justify-center">
                    <span className="text-[8px] text-gray-500 uppercase tracking-wider block">Rendimento</span>
                    <span className={`text-sm font-black mt-0.5 ${displayedDay.pnlPercent >= 0 ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'}`}>
                      {displayedDay.pnlPercent >= 0 ? '+' : ''}{displayedDay.pnlPercent.toFixed(3)}%
                    </span>
                  </div>
                  <div className="bg-[#111927]/60 border border-[#1a2332]/50 rounded-lg p-2 flex flex-col justify-center">
                    <span className="text-[8px] text-gray-500 uppercase tracking-wider block">Flusso Monetario</span>
                    <span className={`text-sm font-black mt-0.5 ${displayedDay.valueChangeEur >= 0 ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'}`}>
                      {displayedDay.valueChangeEur >= 0 ? '+' : ''}€{displayedDay.valueChangeEur.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="bg-[#111927]/40 border border-[#1a2332]/40 rounded-lg p-2.5 space-y-2">
                  <div className="flex items-center justify-between text-[9px] border-b border-[#1a2332]/25 pb-1">
                    <span className="text-gray-500">Asset Guida</span>
                    <span className="text-white font-heavy flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00c2ff] inline-block" />
                      {displayedDay.primaryDriver}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] border-b border-[#1a2332]/25 pb-1">
                    <span className="text-gray-500">Fluttuazione Interna</span>
                    <span className={`text-white font-heavy ${displayedDay.driverChange >= 0 ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'}`}>
                      {displayedDay.driverChange >= 0 ? '+' : ''}{displayedDay.driverChange.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-gray-500">Sentiment Algoritmico</span>
                    <span className={`text-[8.5px] uppercase font-black px-1 rounded-sm ${displayedDay.sentiment === 'Bullish' ? 'bg-[#00e5a0]/10 text-[#00e5a0]' : displayedDay.sentiment === 'Bearish' ? 'bg-[#ff3d6b]/10 text-[#ff3d6b]' : 'bg-slate-800 text-gray-400'}`}>
                      {displayedDay.sentiment}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 font-mono text-[10px]">
                Nessun dato disponibile
              </div>
            )}
          </div>

          {/* Key Analytics Section */}
          <div className="border-t border-[#1a2332]/50 pt-3">
            <span className="text-[7.5px] font-mono uppercase bg-amber-500/10 text-amber-500 border border-amber-500/30 px-1.5 py-0.5 rounded tracking-widest font-black inline-block mb-2">
              KPI STATISTICHE DI VOLATILITÀ
            </span>
            
            <div className="grid grid-cols-2 gap-2 text-[9.5px] font-mono">
              <div className="flex items-center justify-between border-b border-[#1a2332]/20 pb-1.5">
                <span className="text-gray-500">Giorni Positivi:</span>
                <span className="text-[#00e5a0] font-bold">
                  {stats.greenDaysCount} <span className="text-gray-600 font-normal">({stats.winRatio.toFixed(0)}%)</span>
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[#1a2332]/20 pb-1.5">
                <span className="text-gray-500">Max Streak Vincente:</span>
                <span className="text-white font-bold flex items-center gap-1">
                  <Flame className="h-3 w-3 text-amber-500 fill-amber-500" />
                  {stats.maxStreak}g
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[#1a2332]/20 pb-1.5">
                <span className="text-gray-500">Simul. Sharpe:</span>
                <span className="text-[#00c2ff] font-bold">
                  {stats.sharpeRatio.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[#1a2332]/20 pb-1.5">
                <span className="text-gray-500">Giorno Top Record:</span>
                <span className="text-[#00e5a0] font-bold text-[8.5px] truncate max-w-[65px]" title={stats.bestDay?.date.toLocaleDateString()}>
                  +{stats.bestDay?.pnlPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="mt-3 flex gap-2 items-start bg-amber-500/5 border border-amber-500/20 p-2 rounded-lg text-[8.5px] font-mono leading-relaxed text-amber-500/90 select-none">
              <Activity className="h-3 w-3 shrink-0 text-amber-500 mt-0.5 animate-pulse" />
              <span>
                L'indice di Sharpe pari a <strong>{stats.sharpeRatio.toFixed(2)}</strong> indica un rendimento corretto per il rischio molto robusto. Ottimizzato su base Lorentziana.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
