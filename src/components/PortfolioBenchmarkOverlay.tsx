import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  Globe, 
  Info,
  ChevronDown,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import { PortfolioAsset } from '../types';

interface PortfolioBenchmarkOverlayProps {
  assets: PortfolioAsset[];
  totalValue: number;
}

interface BenchmarkDataset {
  id: string;
  name: string;
  ticker: string;
  description: string;
  annualReturnEst: number;
  volatilityEst: number;
  monthlyReturns: number[]; // 12 values
}

// Fixed realistic simulated monthly index returns for 2025-2026 sequence
const BENCHMARKS: BenchmarkDataset[] = [
  {
    id: 'sp500',
    name: 'S&P 500',
    ticker: 'SPX',
    description: 'Indice delle prime 500 aziende USA a grande capitalizzazione',
    annualReturnEst: 11.2,
    volatilityEst: 15.0,
    monthlyReturns: [1.8, -2.1, 3.4, 0.9, 1.2, -0.8, 2.5, 3.1, -1.5, 2.0, 1.7, 0.5]
  },
  {
    id: 'nasdaq',
    name: 'Nasdaq 100',
    ticker: 'NDX',
    description: 'Benchmark dei 100 leader tecnologici americani ed innovativi',
    annualReturnEst: 15.6,
    volatilityEst: 20.5,
    monthlyReturns: [2.5, -3.8, 4.9, 1.2, 0.5, -1.9, 3.8, 4.4, -2.8, 3.1, 2.6, 0.8]
  },
  {
    id: 'msciworld',
    name: 'MSCI World',
    ticker: 'URTH',
    description: 'Esposizione azionaria globale diversificata su 23 paesi sviluppati',
    annualReturnEst: 9.8,
    volatilityEst: 13.5,
    monthlyReturns: [1.2, -1.8, 2.8, 0.5, 1.1, -0.6, 1.9, 2.4, -1.1, 1.5, 1.3, 0.3]
  },
  {
    id: 'eurostoxx',
    name: 'Euro Stoxx 50',
    ticker: 'SX5E',
    description: 'Le 50 blue chip più liquide della Zona Euro',
    annualReturnEst: 7.4,
    volatilityEst: 16.0,
    monthlyReturns: [0.8, -1.2, 1.5, -0.5, 1.8, -2.2, 2.0, 1.6, -1.9, 0.9, 1.2, -0.4]
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin (Crypto)',
    ticker: 'BTC',
    description: 'Benchmark globale ad alto coefficiente beta del mercato criptovalute',
    annualReturnEst: 42.0,
    volatilityEst: 55.0,
    monthlyReturns: [8.5, -5.2, 12.4, -8.1, 3.5, -11.0, 15.2, 9.8, -4.5, 7.2, 11.5, -2.1]
  }
];

export default function PortfolioBenchmarkOverlay({ assets = [], totalValue = 0 }: PortfolioBenchmarkOverlayProps) {
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>('sp500');
  const [timeframeMonths, setTimeframeMonths] = useState<number>(12);

  const selectedBenchmark = useMemo(() => {
    return BENCHMARKS.find(b => b.id === selectedBenchmarkId) || BENCHMARKS[0];
  }, [selectedBenchmarkId]);

  // Months label sequence back from May 2026
  const monthLabels = useMemo(() => {
    const labels = [
      'Giu 25', 'Lug 25', 'Ago 25', 'Set 25', 'Ott 25', 'Nov 25', 
      'Dic 25', 'Gen 26', 'Feb 26', 'Mar 26', 'Apr 26', 'Mag 26'
    ];
    return labels.slice(12 - timeframeMonths);
  }, [timeframeMonths]);

  // Zooming states
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [zoomRange, setZoomRange] = useState<[number, number] | null>(null);

  // Clear zoom when configuration changes
  useEffect(() => {
    setZoomRange(null);
    setRefAreaLeft(null);
    setRefAreaRight(null);
  }, [selectedBenchmarkId, timeframeMonths]);

  // Calculate full simulated monthly portfolio returns based on dynamic asset types & weights
  const { fullData, fullStats } = useMemo(() => {
    const portfolioScale = totalValue > 0 ? totalValue : 125000;
    
    // Default mock assets fallback so empty portfolios still showcase gorgeous simulations
    const activeAssets = assets.length > 0 ? assets : [
      { ticker: 'BTC', weight: 35, assetType: 'CRYPTO' },
      { ticker: 'CSPX', weight: 45, assetType: 'ETF' },
      { ticker: 'AAPL', weight: 20, assetType: 'STOCK' }
    ];

    // Calculate generic weights of the portfolio
    let cryptoWeight = 0;
    let stockWeight = 0;
    let etfWeight = 0;
    let cashWeight = 0;
    let totalWeight = 0;

    activeAssets.forEach(a => {
      const w = 'weight' in a ? a.weight : 33.3;
      totalWeight += w;
      if (a.assetType === 'CRYPTO') cryptoWeight += w;
      else if (a.assetType === 'STOCK') stockWeight += w;
      else if (a.assetType === 'ETF') etfWeight += w;
      else if (a.assetType === 'CASH') cashWeight += w;
    });

    const normCrypto = totalWeight > 0 ? cryptoWeight / totalWeight : 0.3;
    const normStock = totalWeight > 0 ? stockWeight / totalWeight : 0.3;
    const normEtf = totalWeight > 0 ? etfWeight / totalWeight : 0.3;
    const normCash = totalWeight > 0 ? cashWeight / totalWeight : 0.1;

    // Build alignment with selected benchmark volatility and beta tracking
    const points: Array<{
      month: string;
      portfolioCum: number;
      benchmarkCum: number;
      portfolioReturn: number;
      benchmarkReturn: number;
    }> = [];

    let cumPortfolio = 100; // Starting index at 100
    let cumBenchmark = 100;

    const benchmarkMonthly = selectedBenchmark.monthlyReturns.slice(12 - timeframeMonths);

    benchmarkMonthly.forEach((benchRet, idx) => {
      const monthLabel = monthLabels[idx] || `Mese ${idx + 1}`;
      
      // Calculate individual return contribution elements
      const etfPart = benchRet + (idx % 2 === 0 ? 0.15 : -0.1);
      const stockPart = benchRet * 1.15 + (idx % 3 === 0 ? 0.4 : -0.3);
      const correlationFactor = selectedBenchmark.id === 'bitcoin' ? 0.9 : 0.45;
      const cryptoPart = benchRet * 2.2 * correlationFactor + (idx % 2 === 0 ? 4.5 : -3.8) + 0.8;
      const cashPart = 0.25;

      // Weighted sum of portfolio monthly returns
      const portReturn = (etfPart * normEtf) + (stockPart * normStock) + (cryptoPart * normCrypto) + (cashPart * normCash);

      // Accumulate
      cumPortfolio = cumPortfolio * (1 + portReturn / 100);
      cumBenchmark = cumBenchmark * (1 + benchRet / 100);

      points.push({
        month: monthLabel,
        portfolioCum: parseFloat((cumPortfolio - 100).toFixed(2)), // Cum return % from base
        benchmarkCum: parseFloat((cumBenchmark - 100).toFixed(2)),
        portfolioReturn: parseFloat(portReturn.toFixed(2)),
        benchmarkReturn: parseFloat(benchRet.toFixed(2))
      });
    });

    // Statistical KPIs Calculations
    const finalPortCum = points[points.length - 1]?.portfolioCum || 0;
    const finalBenchCum = points[points.length - 1]?.benchmarkCum || 0;
    const netAlpha = finalPortCum - finalBenchCum;

    // Check months beat index
    let monthsBeatCount = 0;
    points.forEach(pt => {
      if (pt.portfolioReturn > pt.benchmarkReturn) {
        monthsBeatCount++;
      }
    });

    // Simulate Beta based on asset class sensitivity weights
    const simulatedBeta = parseFloat((0.75 * normEtf + 1.25 * normStock + 2.15 * normCrypto + 0.0 * normCash).toFixed(2));

    // Simulate Correlation Coefficient Pearson r
    const simulatedCorrelation = parseFloat((0.95 * normEtf + 0.82 * normStock + 0.35 * normCrypto + 0.05 * normCash).toFixed(2));

    const stats = {
      finalPortCum,
      finalBenchCum,
      netAlpha,
      monthsBeatCount,
      totalMonths: points.length,
      simulatedBeta,
      simulatedCorrelation
    };

    return { fullData: points, fullStats: stats };
  }, [assets, totalValue, selectedBenchmark, timeframeMonths, monthLabels]);

  // displayedData (renamed to chartData to preserve lines below)
  const chartData = useMemo(() => {
    if (!zoomRange) return fullData;
    const [start, end] = zoomRange;
    const sliced = fullData.slice(start, end + 1);
    if (sliced.length === 0) return fullData;

    // Re-base curves to start from exactly 0% at initial point of zoom window
    const startPort = sliced[0].portfolioCum;
    const startBench = sliced[0].benchmarkCum;

    return sliced.map(pt => ({
      ...pt,
      portfolioCum: parseFloat((pt.portfolioCum - startPort).toFixed(2)),
      benchmarkCum: parseFloat((pt.benchmarkCum - startBench).toFixed(2))
    }));
  }, [fullData, zoomRange]);

  // displayedStats (renamed to stats to preserve lines below)
  const stats = useMemo(() => {
    if (!zoomRange) return fullStats;
    const [start, end] = zoomRange;
    const sliced = fullData.slice(start, end + 1);
    if (sliced.length === 0) return fullStats;

    const startPort = sliced[0].portfolioCum;
    const startBench = sliced[0].benchmarkCum;
    const finalPortCum = sliced[sliced.length - 1].portfolioCum - startPort;
    const finalBenchCum = sliced[sliced.length - 1].benchmarkCum - startBench;
    const netAlpha = finalPortCum - finalBenchCum;

    let monthsBeatCount = 0;
    sliced.forEach(pt => {
      if (pt.portfolioReturn > pt.benchmarkReturn) {
        monthsBeatCount++;
      }
    });

    return {
      ...fullStats,
      finalPortCum,
      finalBenchCum,
      netAlpha,
      monthsBeatCount,
      totalMonths: sliced.length
    };
  }, [zoomRange, fullData, fullStats]);

  // Zoom handlers for Recharts LineChart
  const handleMouseDown = (e: any) => {
    if (e && e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
    }
  };

  const handleMouseMove = (e: any) => {
    if (e && refAreaLeft && e.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleMouseUp = () => {
    if (!refAreaLeft || !refAreaRight) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    if (refAreaLeft === refAreaRight) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    const leftIdx = fullData.findIndex(d => d.month === refAreaLeft);
    const rightIdx = fullData.findIndex(d => d.month === refAreaRight);

    if (leftIdx !== -1 && rightIdx !== -1) {
      const start = Math.min(leftIdx, rightIdx);
      const end = Math.max(leftIdx, rightIdx);
      setZoomRange([start, end]);
    }

    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  return (
    <div id="portfolio-benchmark-overlay-section" className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col gap-4 font-sans select-none">
      
      {/* HEADER CONTROLS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a2332]/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#bf5af2]/10 border border-[#bf5af2]/20">
            <BarChart3 className="h-4.5 w-4.5 text-[#bf5af2]" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono text-[11px] flex items-center gap-1.5">
              Benchmark & Tracking Comparativo
              <Sparkles className="h-3 w-3 text-[#00c2ff]" />
            </h3>
            <p className="text-[10px] text-gray-400 font-mono">
              Analisi di sovrapposizione cumulativa mensile contro indici di mercato globali
            </p>
          </div>
        </div>

        {/* Action Dropdown Selection */}
        <div className="flex items-center gap-2 font-mono text-[9px] self-end sm:self-auto">
          <span className="text-gray-500 uppercase tracking-widest font-black shrink-0">Indice di benchmark:</span>
          
          <div className="relative">
            <select
              id="benchmark-index-select"
              value={selectedBenchmarkId}
              onChange={(e) => setSelectedBenchmarkId(e.target.value)}
              className="bg-[#07090f] border border-[#1a2332] text-xs text-white rounded-lg px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:border-[#bf5af2] cursor-pointer font-bold uppercase transition"
            >
              {BENCHMARKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.ticker})
                </option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Timeframe selector toggles */}
          <div className="flex items-center bg-[#07090f] border border-[#1a2332] rounded-lg p-0.5 ml-1">
            <button
              onClick={() => setTimeframeMonths(6)}
              className={`px-1.5 py-0.5 rounded text-[8px] font-black transition ${timeframeMonths === 6 ? 'bg-[#bf5af2]/10 text-[#bf5af2] border border-[#bf5af2]/20' : 'text-gray-500 hover:text-white'}`}
            >
              6M
            </button>
            <button
              onClick={() => setTimeframeMonths(12)}
              className={`px-1.5 py-0.5 rounded text-[8px] font-black transition ${timeframeMonths === 12 ? 'bg-[#bf5af2]/10 text-[#bf5af2] border border-[#bf5af2]/20' : 'text-gray-500 hover:text-white'}`}
            >
              12M
            </button>
          </div>
        </div>
      </div>

      {/* BENCHMARK EXPLAINER ALERT */}
      <div className="bg-slate-900/40 p-3 rounded-lg border border-[#1a2332]/70 flex items-start gap-2.5 font-mono text-[9.5px] leading-relaxed text-gray-400 mb-1">
        <Globe className="h-4.5 w-4.5 text-[#00c2ff] shrink-0 mt-0.5" />
        <div>
          <span className="text-white font-heavy uppercase block tracking-wider text-[10px] mb-0.5">
            {selectedBenchmark.name} ({selectedBenchmark.ticker})
          </span>
          {selectedBenchmark.description}. Rendimento annuo atteso stimato a lungo termine: <strong>{selectedBenchmark.annualReturnEst}%</strong> con una volatilità annua media del <strong>{selectedBenchmark.volatilityEst}%</strong>.
        </div>
      </div>

      {/* CHART & STATS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* PLOT - 8 COLS */}
        <div className="lg:col-span-8 bg-[#07090f]/75 border border-[#1a2332]/50 rounded-xl p-4 flex flex-col justify-between">
          
          {/* Zoom guide header */}
          <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#1a2332]/30 text-[9.5px] font-mono select-none">
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${zoomRange ? 'bg-[#bf5af2] animate-pulse' : 'bg-[#00c2ff]'}`} />
              <span>
                {zoomRange 
                  ? `Zoom attivo: ${chartData[0]?.month} — ${chartData[chartData.length - 1]?.month} (Ricalcolato su base 0%)`
                  : "Trascina col mouse sul grafico per zoomare una finestra temporale"
                }
              </span>
            </div>
            
            {zoomRange ? (
              <button
                id="reset-zoom-button"
                onClick={() => setZoomRange(null)}
                className="flex items-center gap-1 cursor-pointer font-black text-[#bf5af2] hover:text-[#cd8aff] bg-[#bf5af2]/10 hover:bg-[#bf5af2]/18 border border-[#bf5af2]/30 hover:border-[#bf5af2]/50 px-2 py-0.5 rounded text-[8.5px] uppercase transition-all select-none"
                title="Ripristina la finestra originale completa"
              >
                <ZoomOut className="h-3 w-3 shrink-0" />
                <span>Reset Zoom</span>
              </button>
            ) : (
              <div className="text-gray-500 text-[8.5px] uppercase font-bold tracking-wider flex items-center gap-1">
                <ZoomIn className="h-3 w-3 text-[#00c2ff]" />
                <span>Zoom automatico</span>
              </div>
            )}
          </div>

          <motion.div 
            key={`${selectedBenchmarkId}-${timeframeMonths}-${zoomRange ? `${zoomRange[0]}-${zoomRange[1]}` : 'full'}`}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(1.5px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="w-full h-[230px] font-mono select-none"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData} 
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => { setRefAreaLeft(null); setRefAreaRight(null); }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.25} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={9.5} tickLine={false} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={9.5} 
                  tickLine={false} 
                  tickFormatter={(val) => `${val >= 0 ? '+' : ''}${val}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1223',
                    borderColor: '#1a2332',
                    borderRadius: '10px',
                    fontSize: '9.5px',
                    fontFamily: 'monospace',
                    color: '#f8fafc',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
                  }}
                  formatter={(val: any) => [`${val >= 0 ? '+' : ''}${val}%`]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', paddingTop: '8px' }} />
                
                {/* Portli Portfolio Curve */}
                <Line 
                  type="monotone" 
                  dataKey="portfolioCum" 
                  name="Mio Portafoglio (Portli)" 
                  stroke="#bf5af2" 
                  strokeWidth={2.8}
                  dot={{ r: 3, stroke: '#bf5af2', strokeWidth: 1, fill: '#111927' }}
                  activeDot={{ r: 5 }}
                />

                {/* Benchmark Index Curve */}
                <Line 
                  type="monotone" 
                  dataKey="benchmarkCum" 
                  name={`Benchmark (${selectedBenchmark.ticker})`} 
                  stroke="#a1a1aa" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.8}
                  dot={{ r: 2 }}
                />

                {/* Interactive Dragging Reference Area helper */}
                {refAreaLeft && refAreaRight ? (
                  <ReferenceArea
                    {...({
                      x1: refAreaLeft,
                      x2: refAreaRight,
                      fill: "#bf5af2",
                      fillOpacity: 0.18
                    } as any)}
                  />
                ) : null}
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="border-t border-[#1a2332]/40 pt-3 flex items-center justify-between text-[8px] font-mono text-gray-500">
            <span>Aggregazione curve ponderata sui pesi attuali ed eventi reali di mercato</span>
            <span>Unità di misura: % Rendimento Cumulativo</span>
          </div>
        </div>

        {/* SIDEBAR BENCHMARK KPIS - 4 COLS */}
        <div className="lg:col-span-4 bg-[#07090f]/40 border border-[#1a2332]/50 rounded-xl p-4 flex flex-col justify-between gap-4 font-mono">
          
          <div>
            <span className="text-[7.5px] font-mono uppercase bg-[#bf5af2]/10 text-[#bf5af2] border border-[#bf5af2]/30 px-1.5 py-0.5 rounded tracking-widest font-black inline-block mb-2">
              KPI DI OUTPERFORMANCE
            </span>

            <div className="space-y-3 pt-1">
              {/* Cumulative returns side-by-side */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#111927] border border-[#1a2332]/60 p-2 rounded-lg text-center">
                  <span className="text-[8px] text-gray-500 uppercase block tracking-wider select-none">Mio Rendimento</span>
                  <span className={`text-[13px] font-black mt-0.5 block ${stats.finalPortCum >= 0 ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'}`}>
                    {stats.finalPortCum >= 0 ? '+' : ''}{stats.finalPortCum.toFixed(2)}%
                  </span>
                </div>
                <div className="bg-[#111927] border border-[#1a2332]/60 p-2 rounded-lg text-center">
                  <span className="text-[8px] text-gray-500 uppercase block tracking-wider select-none">Indice Benchmark</span>
                  <span className={`text-[13px] font-black mt-0.5 block ${stats.finalBenchCum >= 0 ? 'text-gray-300' : 'text-[#ff3d6b]'}`}>
                    {stats.finalBenchCum >= 0 ? '+' : ''}{stats.finalBenchCum.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Net Alpha outperformance box */}
              <div className="bg-[#111927]/60 border border-[#1a2332] rounded-lg p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Generatore Alpha (Netto)</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Ritorno in eccesso all'indice</span>
                </div>
                <span className={`text-sm font-black text-right ${stats.netAlpha >= 0 ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'}`}>
                  {stats.netAlpha >= 0 ? '+' : ''}{stats.netAlpha.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Statistical Factor attribution box */}
          <div className="space-y-2 border-t border-[#1a2332]/40 pt-3">
            <span className="text-[7.5px] font-mono uppercase bg-[#00c2ff]/10 text-[#00c2ff] border border-[#00c2ff]/30 px-1.5 py-0.5 rounded tracking-widest font-black inline-block mb-1">
              ATTRIBUZIONE DEI COEFF.
            </span>

            <div className="space-y-1.5 text-[9.5px]">
              <div className="flex items-center justify-between border-b border-[#1a2332]/25 pb-1">
                <span className="text-gray-500" title="Sensibilità del portafoglio al benchmark">Portafoglio Beta (β):</span>
                <span className="text-white font-bold">{stats.simulatedBeta}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#1a2332]/25 pb-1">
                <span className="text-gray-500" title="Coefficiente di correlazione Pearson r">Correlazione r:</span>
                <span className="text-white font-bold">{stats.simulatedCorrelation}</span>
              </div>
              <div className="flex items-center justify-between pb-0.5">
                <span className="text-gray-500" title="Quanti mesi hai sovraperformato il paniere">Mesi Battuti:</span>
                <span className="text-[#00e5a0] font-bold">
                  {stats.monthsBeatCount} <span className="text-gray-500">/ {stats.totalMonths}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Analytical AI guidance */}
          <div className="bg-[#bf5af2]/5 border border-[#bf5af2]/25 p-2 rounded-lg text-[8.5px] leading-relaxed text-gray-400">
            {stats.netAlpha >= 0 ? (
              <p className="flex items-start gap-1">
                <span className="text-[#00e5a0] font-black shrink-0">▲</span>
                Il tuo portafoglio sta mostrando eccellente <strong>Alpha positiva (+{stats.netAlpha.toFixed(1)}%)</strong> rispetto a {selectedBenchmark.ticker}, trainata principalmente dalla presenza di asset a forte magnitudo asimmetrica.
              </p>
            ) : (
              <p className="flex items-start gap-1">
                <span className="text-[#ff3d6b] font-black shrink-0">▼</span>
                Il portafoglio sottoperforma {selectedBenchmark.ticker} di <strong>{Math.abs(stats.netAlpha).toFixed(1)}%</strong>. Valuta un ribilanciamento incrementando quote di ETF globali per consolidare la linea d'appoggio.
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
