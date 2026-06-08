import React, { useMemo, useState } from 'react';
import { PortfolioAsset, AssetType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Sliders, 
  TrendingUp, 
  RefreshCw, 
  AlertTriangle, 
  Percent, 
  Cpu, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip 
} from 'recharts';

interface RiskAttributionModelProps {
  assets: PortfolioAsset[];
  totalValue: number;
}

// Standalone volatility coefficients (Annualized standard deviations)
const VOLATILITIES: Record<AssetType, number> = {
  STOCK: 0.22,  // 22% volatility
  ETF: 0.12,    // 12% volatility
  CRYPTO: 0.68, // 68% volatility
  CASH: 0.015,  // 1.5% volatility
};

// Return expectation assumptions for Sharpe Ratio calculations
const EXPECTED_RETURNS: Record<AssetType, number> = {
  STOCK: 0.095,  // 9.5% annual expected return
  ETF: 0.068,    // 6.8% annual expected return
  CRYPTO: 0.22,   // 22% annual expected return
  CASH: 0.025,   // 2.5% annual expected return
};

const RISK_FREE_RATE = 0.02; // 2% Risk-Free Rate

// Asset correlation matrix (historical average estimates)
const CORRELATIONS: Record<AssetType, Record<AssetType, number>> = {
  STOCK:  { STOCK: 1.0,  ETF: 0.75, CRYPTO: 0.38, CASH: 0.0 },
  ETF:    { STOCK: 0.75, ETF: 1.0,  CRYPTO: 0.28, CASH: 0.0 },
  CRYPTO: { STOCK: 0.38, ETF: 0.28, CRYPTO: 1.0,  CASH: 0.0 },
  CASH:   { STOCK: 0.0,  ETF: 0.0,  CRYPTO: 0.0,  CASH: 1.0 },
};

export default function RiskAttributionModel({ assets, totalValue }: RiskAttributionModelProps) {
  // Tabs for switching between Actual and Sandbox Simulation Mode
  const [activeTab, setActiveTab] = useState<'actual' | 'simulation'>('actual');

  // Interactive weights state for the Simulator Sandbox (stock, etf, crypto, cash)
  // Preset with standard balanced allocation if no assets are in the portfolio
  const [simWeights, setSimWeights] = useState<Record<AssetType, number>>({
    STOCK: 40,
    ETF: 40,
    CRYPTO: 10,
    CASH: 10
  });

  // Calculate actual weights in the portfolio
  const actualWeights = useMemo(() => {
    const weights: Record<AssetType, number> = { STOCK: 0, ETF: 0, CRYPTO: 0, CASH: 0 };
    if (assets.length === 0 || totalValue === 0) {
      // Avoid 0/0 error, fallback to balanced distribution as a reference
      return weights;
    }
    assets.forEach(a => {
      weights[a.assetType] = (weights[a.assetType] || 0) + (a.currentValue / totalValue);
    });
    return weights;
  }, [assets, totalValue]);

  // Handle weight slider changes with automatic normalized balancing
  const handleWeightChange = (type: AssetType, newValue: number) => {
    setSimWeights(prev => {
      // Restrict value to [0, 100]
      const clampedValue = Math.min(100, Math.max(0, newValue));
      const otherTypes = (Object.keys(prev) as AssetType[]).filter(t => t !== type);
      
      const sumOthers = otherTypes.reduce((sum, t) => sum + prev[t], 0);
      const targetSumOthers = 100 - clampedValue;

      let updated = { ...prev };
      updated[type] = clampedValue;

      if (sumOthers > 0) {
        // Distribute proportionally among other classes
        otherTypes.forEach(t => {
          updated[t] = parseFloat(((prev[t] / sumOthers) * targetSumOthers).toFixed(2));
        });
      } else {
        // If others were all zero, split the remaining weight evenly
        const evenValue = parseFloat((targetSumOthers / otherTypes.length).toFixed(2));
        otherTypes.forEach(t => {
          updated[t] = evenValue;
        });
      }

      // Do a tiny final adjustment to guarantee they sum to precisely 100%
      const finalSum = (['STOCK', 'ETF', 'CRYPTO', 'CASH'] as AssetType[]).reduce(
        (sum, k) => sum + updated[k],
        0
      );
      const error = 100 - finalSum;
      if (Math.abs(error) > 0.001) {
        // Adjust the first other asset class with the error margins
        updated[otherTypes[0]] = parseFloat((updated[otherTypes[0]] + error).toFixed(2));
      }

      return updated;
    });
  };

  // Run the core covariance matrix calculations & Euler Risk Decomposition
  const riskMetrics = useMemo(() => {
    // Decide which weights to use: Actual or Simulated
    const isSim = activeTab === 'simulation';
    const weightsVector: Record<AssetType, number> = isSim 
      ? {
          STOCK: simWeights.STOCK / 100,
          ETF: simWeights.ETF / 100,
          CRYPTO: simWeights.CRYPTO / 100,
          CASH: simWeights.CASH / 100
        }
      : actualWeights;

    const classes: AssetType[] = ['STOCK', 'ETF', 'CRYPTO', 'CASH'];

    // 1. Compile Covariance Matrix Sigma: S_{ij} = Vol_i * Vol_j * Corr_{ij}
    const sigma: Record<AssetType, Record<AssetType, number>> = {
      STOCK:  { STOCK: 0, ETF: 0, CRYPTO: 0, CASH: 0 },
      ETF:    { STOCK: 0, ETF: 0, CRYPTO: 0, CASH: 0 },
      CRYPTO: { STOCK: 0, ETF: 0, CRYPTO: 0, CASH: 0 },
      CASH:   { STOCK: 0, ETF: 0, CRYPTO: 0, CASH: 0 },
    };

    classes.forEach(i => {
      classes.forEach(j => {
        sigma[i][j] = VOLATILITIES[i] * VOLATILITIES[j] * CORRELATIONS[i][j];
      });
    });

    // 2. Calculate Portfolio Variance: w^T * Sigma * w
    let varSum = 0;
    classes.forEach(i => {
      classes.forEach(j => {
        varSum += weightsVector[i] * weightsVector[j] * sigma[i][j];
      });
    });

    const portfolioVolatility = Math.sqrt(varSum);
    const safeVol = portfolioVolatility > 0.0001 ? portfolioVolatility : 0.0001;

    // 3. Compute Marginal Risk Contribution (MRC): (Sigma * w) / Vol_p
    const marginalContribution: Record<AssetType, number> = { STOCK: 0, ETF: 0, CRYPTO: 0, CASH: 0 };
    classes.forEach(i => {
      let sum = 0;
      classes.forEach(j => {
        sum += weightsVector[j] * sigma[i][j];
      });
      marginalContribution[i] = sum / safeVol;
    });

    // 4. Compute Absolute Risk Contribution (ARC): w_i * MRC_i
    const absoluteContribution: Record<AssetType, number> = { STOCK: 0, ETF: 0, CRYPTO: 0, CASH: 0 };
    classes.forEach(i => {
      absoluteContribution[i] = weightsVector[i] * marginalContribution[i];
    });

    // 5. Compute Relative Risk Contribution (RRC): ARC_i / Vol_p * 100
    const relativeContribution: Record<AssetType, number> = { STOCK: 0, ETF: 0, CRYPTO: 0, CASH: 0 };
    classes.forEach(i => {
      relativeContribution[i] = portfolioVolatility > 0.0001 
        ? (absoluteContribution[i] / portfolioVolatility) * 100 
        : 0;
    });

    // 6. Compute Expected Return of Portfolio
    let expectedReturn = 0;
    classes.forEach(i => {
      expectedReturn += weightsVector[i] * EXPECTED_RETURNS[i];
    });

    // 7. Calculate Sharpe Ratio: (E[Rp] - Rf) / Vol_p
    const sharpeRatio = portfolioVolatility > 0.001 
      ? (expectedReturn - RISK_FREE_RATE) / portfolioVolatility 
      : 0;

    return {
      portfolioVolatility,
      expectedReturn,
      sharpeRatio,
      weights: weightsVector,
      marginalContribution,
      absoluteContribution,
      relativeContribution,
      isSim
    };
  }, [activeTab, actualWeights, simWeights]);

  // Construct chart dataset for Recharts Radar
  const radarChartData = useMemo(() => {
    const labelsMap: Record<AssetType, string> = {
      STOCK: 'Azioni',
      ETF: 'Fondi (ETF)',
      CRYPTO: 'Crypto',
      CASH: 'Liquidità'
    };

    return (['STOCK', 'ETF', 'CRYPTO', 'CASH'] as AssetType[]).map(type => {
      const weightPercent = parseFloat((riskMetrics.weights[type] * 100).toFixed(1));
      const riskPercent = parseFloat(riskMetrics.relativeContribution[type].toFixed(1));
      
      return {
        subject: labelsMap[type],
        'Capitale (%)': weightPercent,
        'Rischio (%)': riskPercent,
      };
    });
  }, [riskMetrics]);

  // Beautiful customizable tooltip inside Radar
  const RadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b1223]/95 border border-[#1a2332] p-3 rounded-xl shadow-xl text-[10.5px] font-mono leading-relaxed select-none backdrop-blur-md">
          <p className="font-extrabold text-white mb-2 pb-1 border-b border-[#1a2332]/50 text-xs">
            {payload[0].payload.subject}
          </p>
          <div className="space-y-1 text-gray-400">
            <p className="flex justify-between gap-6">
              Capitale allocato: 
              <strong className="text-[#00c2ff]">
                {payload[0].payload['Capitale (%)']}%
              </strong>
            </p>
            <p className="flex justify-between gap-6">
              Rapporto Rischio Volatilità: 
              <strong className="text-[#ff3d6b]">
                {payload[0].payload['Rischio (%)']}%
              </strong>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const hasEmptyPortfolio = assets.length === 0 && activeTab === 'actual';

  return (
    <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-6 ai-glow neon-border flex flex-col relative overflow-hidden group/risk select-none">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00e5a0] to-transparent opacity-30 group-hover/risk:opacity-75 transition duration-500" />
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a2332]/60 pb-4 mb-5">
        <div className="flex items-center gap-2 font-mono">
          <ShieldCheck className="h-5 w-5 text-[#00e5a0]" />
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider text-[11px] flex items-center gap-1">
              ATTRIBUZIONE DEL RISCHIO E VOLATILITÀ EURISTICA
            </h3>
            <span className="text-[9.5px] text-gray-500 lowercase">
              Analisi quantitativa Euleriana di decomposizione del rischio di portafoglio
            </span>
          </div>
        </div>

        {/* TABS TOGLE CONTROL */}
        <div className="flex bg-[#07090f]/70 border border-[#14233c] p-1 rounded-xl font-mono text-[9px] font-bold self-start sm:self-auto cursor-pointer">
          <button 
            onClick={() => setActiveTab('actual')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'actual' 
                ? 'bg-[#14233c] text-[#00e5a0]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Portafoglio Attivo
          </button>
          <button 
            onClick={() => setActiveTab('simulation')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'simulation' 
                ? 'bg-[#14233c] text-[#00e5a0]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sliders className="h-2.5 w-2.5" />
            Simulatore Sandbox
          </button>
        </div>
      </div>

      {hasEmptyPortfolio ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-500 mb-2 animate-bounce" />
          <span className="text-xs text-gray-300 font-mono">Portafoglio Attuale Vuoto</span>
          <p className="text-[10px] text-gray-500 mt-1 max-w-sm font-mono leading-relaxed">
            Nessuna transazione registrata nel database. Clicca sul tab <strong className="text-[#00e5a0] underline transition duration-150 cursor-pointer" onClick={() => setActiveTab('simulation')}>Simulatore Sandbox</strong> per disegnare un portafoglio ipotetico ed esplorare l'impatto dei pesi in tempo reale!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* RADAR CHART (5 COLS SPAN) */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center relative min-h-[260px] bg-[#07090f]/30 border border-[#14233c]/40 rounded-2xl p-4">
            
            <div className="absolute top-3 left-3 flex flex-col font-mono">
              <span className="text-[8px] text-gray-500 uppercase font-black">Total Volatility Prediction</span>
              <div className="h-5 overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.span 
                    key={`vol-${activeTab}-${riskMetrics.portfolioVolatility}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="text-sm font-black text-rose-400 block"
                  >
                    {(riskMetrics.portfolioVolatility * 100).toFixed(2)}%
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="absolute top-3 right-3 flex flex-col font-mono text-right">
              <span className="text-[8px] text-gray-500 uppercase font-black">Indice di Sharpe</span>
              <div className="h-5 overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.span 
                    key={`sharpe-${activeTab}-${riskMetrics.sharpeRatio}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="text-sm font-black text-[#00e5a0] block"
                  >
                    {riskMetrics.sharpeRatio.toFixed(2)}x
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Recharts Radar Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full h-56 mt-4"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="82%" data={radarChartData}>
                  <PolarGrid stroke="#1c2c47" opacity={0.4} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'var(--text-dim)', fontSize: 9.5, fontFamily: 'monospace', fontWeight: 'bold' }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: '#4b5563', fontSize: 8 }}
                    axisLine={false} 
                  />
                  
                  <Tooltip content={<RadarTooltip />} />
                  <Legend 
                    iconType="circle" 
                    iconSize={8}
                    wrapperStyle={{ fontSize: '9px', fontFamily: 'monospace', bottom: 0 }} 
                  />
                  
                  <Radar
                    name="Capitale Allocato (%)"
                    dataKey="Capitale (%)"
                    stroke="#00c2ff"
                    fill="#00c2ff"
                    fillOpacity={0.12}
                    strokeWidth={1.5}
                    isAnimationActive={true}
                    animationDuration={650}
                    animationEasing="ease-out"
                  />
                  <Radar
                    name="Quota Rischio Volatilità (%)"
                    dataKey="Rischio (%)"
                    stroke="#ff3d6b"
                    fill="#ff3d6b"
                    fillOpacity={0.16}
                    strokeWidth={1.5}
                    isAnimationActive={true}
                    animationDuration={650}
                    animationEasing="ease-out"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* LEDGER & SLIDERS INTERACTIVE ACTIONS BLOCK (7 COLS SPAN) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
            
            {/* VOLATILITY MULTIPLIER REPORT SUMMARY */}
            <div className="bg-[#050811]/70 border border-[#14233c] p-3 rounded-xl flex items-start gap-2.5 font-sans leading-relaxed text-gray-400 text-[10.5px]">
              <Cpu className="h-4.5 w-4.5 text-[#00e5a0] mt-0.5 shrink-0 animate-pulse" />
              <div>
                <p className="text-white font-bold leading-normal">
                  {riskMetrics.isSim ? 'Modellazione Sandbox in Tempo Reale' : 'Valutazione della Concentrazione del Drawdown'}
                </p>
                <p className="mt-0.5 text-gray-400 font-mono text-[10px]">
                  {riskMetrics.isSim 
                    ? 'Regola i regolatori sottostanti per ribilanciare il capitale e osserva come l\'allocazione incrociata sposta l\'esposizione complessiva alla volatilità storica.' 
                    : 'Questa vista confronta il peso monetario con l\'effettiva attribuzione del rischio. Un asset a basso peso e alta deviazione standard (es. BTC/ETH) può accentrare la volatilità totale.'}
                </p>
              </div>
            </div>

            {/* SANDBOX SLIDERS RENDER */}
            {riskMetrics.isSim && (
              <div className="bg-[#07090f]/50 border border-[#1a2332]/60 p-4 rounded-xl space-y-3 font-mono">
                <div className="flex items-center justify-between text-[10px] text-[#00c2ff] border-b border-[#14233c] pb-2 font-black uppercase">
                  <span className="flex items-center gap-1">
                    <Sliders className="h-3 w-3 inline" /> Strumenti di Distribuzione
                  </span>
                  <span>Totale: 100%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Stocks input slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-gray-300">Azioni (STOCK)</span>
                      <span className="text-white font-bold">{simWeights.STOCK.toFixed(1)}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={simWeights.STOCK}
                      onChange={(e) => handleWeightChange('STOCK', parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#14233c] rounded-lg appearance-none cursor-pointer accent-[#00c2ff]"
                    />
                  </div>

                  {/* ETF input slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-gray-300">Fondi (ETF)</span>
                      <span className="text-white font-bold">{simWeights.ETF.toFixed(1)}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={simWeights.ETF}
                      onChange={(e) => handleWeightChange('ETF', parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#14233c] rounded-lg appearance-none cursor-pointer accent-[#00c2ff]"
                    />
                  </div>

                  {/* Crypto input slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-gray-300">Crypto (CRYPTO)</span>
                      <span className="text-white font-bold">{simWeights.CRYPTO.toFixed(1)}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={simWeights.CRYPTO}
                      onChange={(e) => handleWeightChange('CRYPTO', parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#14233c] rounded-lg appearance-none cursor-pointer accent-[#ff3d6b]"
                    />
                  </div>

                  {/* Cash input slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-gray-300">Liquidità (CASH)</span>
                      <span className="text-white font-bold">{simWeights.CASH.toFixed(1)}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={simWeights.CASH}
                      onChange={(e) => handleWeightChange('CASH', parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#14233c] rounded-lg appearance-none cursor-pointer accent-[#00e5a0]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DETAILED LEDGER TABLE EXHAUST */}
            <div className="border border-[#1a2332] rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px] border-collapse bg-[#07090f]/20">
                <thead>
                  <tr className="bg-[#14233c]/35 border-b border-[#1a2332] text-gray-500 font-extrabold select-none h-8">
                    <th className="px-3">Asset Class</th>
                    <th className="px-2 text-right">Peso Capitale</th>
                    <th className="px-2 text-right">Vol Annua</th>
                    <th className="px-2 text-right text-rose-400">Quota Volatilità</th>
                    <th className="px-3 text-right">Moltiplicatore</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a2332]/40 text-gray-300">
                  {(['STOCK', 'ETF', 'CRYPTO', 'CASH'] as AssetType[]).map((type) => {
                    const weightVal = riskMetrics.weights[type];
                    const weightPercent = weightVal * 100;
                    const relativeRisk = riskMetrics.relativeContribution[type];
                    const standaloneVol = VOLATILITIES[type] * 100;
                    
                    // Ratio of Risk contribution / Weight (Ratio of Marginal Volatility Contribution)
                    const multiplier = weightPercent > 0.05 
                      ? (relativeRisk / weightPercent).toFixed(2) 
                      : '0.00';

                    let label = 'STOCK (Azioni)';
                    let colorCode = '#00c2ff';
                    if (type === 'CRYPTO') {
                      label = 'Crypto';
                      colorCode = '#ff3d6b';
                    } else if (type === 'ETF') {
                      label = 'Fondi (ETF)';
                      colorCode = '#a78bfa';
                    } else if (type === 'CASH') {
                      label = 'CASH / Euro';
                      colorCode = '#00e5a0';
                    }

                    return (
                      <tr 
                        key={type} 
                        className="h-8 hover:bg-[#121f37]/10 transition duration-150"
                      >
                        <td className="px-3 font-semibold text-white flex items-center gap-1.5 h-8">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: colorCode }} />
                          {label}
                        </td>
                        <td className="px-2 text-right font-medium text-gray-300">
                          {weightPercent.toFixed(1)}%
                        </td>
                        <td className="px-2 text-right text-gray-400">
                          {standaloneVol.toFixed(1)}%
                        </td>
                        <td className="px-2 text-right font-bold text-rose-300">
                          {relativeRisk.toFixed(1)}%
                        </td>
                        <td className="px-3 text-right font-black">
                          <span className={`px-1 rounded ${
                            parseFloat(multiplier) > 1.5 
                              ? 'bg-red-500/10 text-red-400 font-extrabold' 
                              : parseFloat(multiplier) > 0.8 
                              ? 'bg-amber-500/10 text-amber-400' 
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {multiplier}x
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* DIVERSIFICATION TIPS AND SAFEGUARDS */}
            <div className="bg-[#14233c]/10 border border-[#14233c]/50 p-3 rounded-lg flex items-center gap-2 text-[10px] leading-relaxed text-gray-400 font-mono">
              <Info className="h-4 w-4 text-[#00c2ff] shrink-0" />
              <span>
                Un moltiplicatore <strong>&gt; 1.0x</strong> indica che l'asset class contribuisce al rischio del portafoglio in modo sovradimensionato rispetto al capitale investito. Recluta asset in ETF globali per comprimerlo.
              </span>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
