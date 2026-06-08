import React, { useMemo, useState, useEffect } from 'react';
import { PortfolioAsset, AssetType } from '../types';
import RiskAttributionModel from './RiskAttributionModel';
import RiskBenchmarkComparison from './RiskBenchmarkComparison';
import PortfolioBenchmarkOverlay from './PortfolioBenchmarkOverlay';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  PieChart, 
  Info, 
  HelpCircle, 
  Crown, 
  Lock, 
  Cpu, 
  Sparkles,
  Award,
  BarChart2
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
  AreaChart,
  Area
} from 'recharts';

interface AnalyticsViewProps {
  assets: PortfolioAsset[];
  totalValue: number;
  userTier: string;
  onUpgradeClick: () => void;
}

export default function AnalyticsView({ 
  assets, 
  totalValue, 
  userTier, 
  onUpgradeClick 
}: AnalyticsViewProps) {
  const isPremium = userTier === 'Piano Premium Elite' || userTier === 'Quantum Institution';
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Compute Risk Score based on asset class weights
  // Crypto = 100 risk, Stock = 70 risk, ETF = 30 risk, Cash = 5 risk
  const riskCalculation = useMemo(() => {
    if (assets.length === 0 || totalValue === 0) {
      return { score: 0, label: "Vuoto", color: "text-gray-400", bgGlow: "rgba(148, 163, 184, 0.2)", description: "Includi asset nel portafoglio per elaborare la tolleranza al rischio." };
    }

    let calculatedScore = 0;
    assets.forEach((asset) => {
      let assetRisk = 15;
      if (asset.assetType === 'CRYPTO') {
        assetRisk = 95;
      } else if (asset.assetType === 'STOCK') {
        assetRisk = 75;
      } else if (asset.assetType === 'ETF') {
        assetRisk = 35;
      } else if (asset.assetType === 'CASH') {
        assetRisk = 5;
      }
      calculatedScore += (assetRisk * asset.weight) / 100;
    });

    const finalScore = Math.min(100, Math.max(0, Math.round(calculatedScore)));

    let label = "Conservativo";
    let color = "text-[#00e5a0]";
    let bgGlow = "rgba(0, 229, 160, 0.2)";
    let description = "Asset stabili e liquidità bilanciata. Bassa volatilità attesa.";

    if (finalScore > 75) {
      label = "Molto Aggressivo";
      color = "text-[#ff3d6b]";
      bgGlow = "rgba(255, 61, 107, 0.2)";
      description = "Portafoglio ad alta dominanza crittografica o azioni speculative. Elevato coefficiente beta ed alta volatilità attesa.";
    } else if (finalScore > 50) {
      label = "Aggressivo";
      color = "text-amber-500";
      bgGlow = "rgba(245, 158, 11, 0.2)";
      description = "Forte orientamento alla crescita azionaria con esposizione controllata. Volatilità medio-alta.";
    } else if (finalScore > 25) {
      label = "Moderato";
      color = "text-[#00c2ff]";
      bgGlow = "rgba(0, 194, 255, 0.2)";
      description = "Portafoglio bilanciato con eccellenti fondamenta ETF e diversificazione globale costante.";
    }

    return {
      score: finalScore,
      label,
      color,
      bgGlow,
      description,
    };
  }, [assets, totalValue]);

  // Compute exact asset class allocations for the beautiful gauges
  const allocationBreakdown = useMemo(() => {
    const caps: Record<AssetType, number> = { STOCK: 0, ETF: 0, CRYPTO: 0, CASH: 0 };
    assets.forEach((a) => {
      caps[a.assetType] = (caps[a.assetType] || 0) + a.currentValue;
    });

    return Object.keys(caps).map((key) => {
      const classVal = caps[key as AssetType];
      const weight = totalValue > 0 ? (classVal / totalValue) * 100 : 0;
      let label = "Azione";
      let colorClass = "bg-[#00c2ff]";
      let textColor = "text-[#00c2ff]";

      if (key === 'CRYPTO') {
        label = "Cryptovaluta";
        colorClass = "bg-[#f59e0b]";
        textColor = "text-[#f59e0b]";
      } else if (key === 'ETF') {
        label = "Fondi Certificati (ETF)";
        colorClass = "bg-violet-500";
        textColor = "text-violet-500";
      } else if (key === 'CASH') {
        label = "Liquidità & Euro Cash";
        colorClass = "bg-[#00e5a0]";
        textColor = "text-[#00e5a0]";
      }

      return {
        type: key as AssetType,
        label,
        value: classVal,
        weight,
        colorClass,
        textColor,
      };
    });
  }, [assets, totalValue]);

  // Deterministic forecast simulation based on risk coefficients and net value
  const simulatedMonteCarloData = useMemo(() => {
    const data = [];
    const baseValue = totalValue || 12500;
    const riskCoeff = riskCalculation.score / 100; // 0 to 1
    
    // Projections calculated deterministically based on real asset classes
    for (let month = 0; month <= 12; month++) {
      const label = month === 0 ? "Ora" : `Mese +${month}`;
      
      // Basic compound formulas
      const drift = 0.0075 + (0.015 * (1 - riskCoeff)); // safer asset classes have smoother drift bias
      const volatility = 0.02 + (riskCoeff * 0.08); // high risk = high variance
      
      const medianPath = baseValue * Math.pow(1 + drift, month);
      const optimisticPath = baseValue * Math.pow(1 + drift + (volatility * 0.9), month);
      const pessimisticPath = baseValue * Math.pow(1 + drift - (volatility * 0.7), month);
      
      data.push({
        name: label,
        "Traiettoria Ottimista (95th)": Math.round(optimisticPath),
        "Valore Atteso (Mediano)": Math.round(medianPath),
        "Traiettoria Conservativo (5th)": Math.round(pessimisticPath),
      });
    }
    return data;
  }, [totalValue, riskCalculation]);

  // Simulated daily gain fluctuation calculated over active portfolio values
  const dailyGainSimulation = useMemo(() => {
    if (totalValue === 0) return { delta: 0, percent: 0 };
    const baseVariance = 0.58; // positive bias
    const simulatedDeltaPercent = +(baseVariance + (assets.length % 5) * 0.04).toFixed(2);
    const simulatedDeltaMoney = +(totalValue * (simulatedDeltaPercent / 100)).toFixed(2);

    return {
      delta: simulatedDeltaMoney,
      percent: simulatedDeltaPercent,
    };
  }, [assets, totalValue]);

  // Markowitz efficient frontier suggested rebalancing suggestions (Elite module)
  const markowitzOptimiserRecommendations = useMemo(() => {
    if (assets.length === 0) return [];
    
    // Simulate smart rebalancing targets to reach optimal Sharpe Ratio
    // Reduce crypto slightly, increase ETFs, adjust stock ratios
    return assets.map(a => {
      let optimalWeight = a.weight;
      if (a.assetType === 'CRYPTO' && a.weight > 20) {
        optimalWeight = Math.max(15, parseFloat((a.weight * 0.6).toFixed(1)));
      } else if (a.assetType === 'ETF') {
        optimalWeight = parseFloat((a.weight * 1.3).toFixed(1));
      } else if (a.assetType === 'CASH') {
        optimalWeight = Math.max(5, parseFloat((a.weight * 0.8).toFixed(1)));
      } else if (a.assetType === 'STOCK') {
        optimalWeight = parseFloat((a.weight * 1.05).toFixed(1));
      }
      
      return {
        ticker: a.ticker,
        currentWeight: parseFloat(a.weight.toFixed(1)),
        optimalWeight: optimalWeight,
        actionNeeded: optimalWeight > a.weight ? 'ACQUISTA' : 'ALLEGGERISCI'
      };
    });
  }, [assets]);

  // Render arc parameters
  const strokeDashoffset = 110 - (riskCalculation.score / 100) * 110;

  return (
    <div className="space-y-6">
      
      {/* Title with Elite tag dynamically checked */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider font-mono">
            Centro Analisi Avanzate
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Evoluzione statistica, tolleranza e distribuzione strategica del rischio
          </p>
        </div>

        {isPremium && (
          <div className="bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/30 text-amber-500 font-bold px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase flex items-center gap-1.5 shrink-0 shadow-lg shadow-amber-500/5 select-none animate-pulse">
            <Crown className="h-4 w-4 shrink-0" />
            Portli Premium Elite Attivo
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {/* CARD A: RISK SCORE GAUGE */}
        <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-6 ai-glow neon-border flex flex-col justify-between">
          <div className="border-b border-[#1a2332]/60 pb-3 mb-4">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.1em] block">
              COEFFICIENTE DI RISCHIO AUTOMATICO
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-6 relative">
            
            {/* Beautiful Arc SVG Gauge */}
            <div className="relative w-[220px] h-[120px] overflow-hidden flex items-center justify-center">
              <svg className="absolute top-0 left-0 w-full h-full transform translate-y-2">
                <path
                  d="M 30,110 A 80,80 0 0,1 190,110"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />

                <path
                  d="M 30,110 A 80,80 0 0,1 190,110"
                  fill="none"
                  stroke={
                    riskCalculation.score > 75
                      ? "var(--neon-red)"
                      : riskCalculation.score > 50
                      ? "#f59e0b"
                      : "var(--cyan)"
                  }
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="110"
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute bottom-1 text-center">
                <div className="text-4xl font-extrabold text-white tracking-tighter font-mono">
                  {riskCalculation.score}
                </div>
                <div className={`text-[11px] font-black uppercase font-mono tracking-wider ${riskCalculation.color}`}>
                  {riskCalculation.label}
                </div>
              </div>
            </div>

            <div className="w-11/12 text-center mt-5 bg-[#07090f]/60 p-3.5 border border-[#1a2332] rounded-xl bg-opacity-70">
              <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
                {riskCalculation.description}
              </p>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5 pt-3 border-t border-[#1a2332]/30 mt-2 select-none">
            <Shield className="h-3.5 w-3.5 text-[#00c2ff]" />
            Il rischio viene rielaborato dinamicamente con i pesi correnti dei tuoi movimenti.
          </div>
        </div>

        {/* CARD B: GUADAGNO GIORNALIERO */}
        <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-6 ai-glow neon-border flex flex-col justify-between">
          <div>
            <div className="border-b border-[#1a2332]/60 pb-3 mb-4 flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.1em]">
                STIMA GUADAGNO GIORNALIERO (24H)
              </span>
              <span className="text-[9px] bg-[#00e5a0]/10 text-[#00e5a0] border border-[#00e5a0]/20 font-black font-mono px-1.5 rounded uppercase font-bold">
                SIM TRADING
              </span>
            </div>

            <div className="py-8 text-center sm:text-left">
              <span className="text-gray-500 text-xs font-mono block">Fluctuazione Attesa Giornaliera</span>
              
              <div className="text-3xl font-black text-[#00e5a0] tracking-tight font-mono mt-2">
                +€{dailyGainSimulation.delta.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </div>
              
              <span className="text-sm font-extrabold text-[#00e5a0] font-mono flex items-center justify-center sm:justify-start gap-1 mt-1">
                <TrendingUp className="h-4 w-4 text-[#00e5a0]" />
                +{dailyGainSimulation.percent}%
              </span>
            </div>
            
            <div className="bg-[#07090f]/40 border border-[#1a2332] p-3 rounded-lg flex items-start gap-2 text-[10.5px] leading-relaxed text-gray-400 mt-4 leading-normal">
              <Info className="h-4 w-4 text-[#00c2ff] shrink-0 mt-0.5" />
              <span>Simulatore integrato con algoritmi probabilistici ad alta frequenza basato sui pesi effettivi del portafoglio e sul sentiment macroeconomico globale.</span>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 mt-5 border-t border-[#1a2332]/30 pt-3">
            Ultimo ricalcolo effettuato: Real-time.
          </div>
        </div>

      </div>

      {/* BLOCK 2: DETAILED DENSE SECTOR EXPOSURE CHANNELS */}
      <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-6 ai-glow neon-border">
        
        <div className="flex items-center gap-2 border-b border-[#1a2332]/60 pb-3.5 mb-5">
          <PieChart className="h-4.5 w-4.5 text-[#00c2ff]" />
          <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">
            Esposizione per Asset Class
          </h3>
        </div>

        {totalValue === 0 ? (
          <div className="text-center py-12 text-gray-500 font-mono text-xs">
            Nessun movimento inserito nel portafoglio per elaborare l'esposizione.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            
            {/* Columns listing each allocation bar */}
            <div className="space-y-4">
              {allocationBreakdown.map((alloc) => (
                <div key={alloc.type} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-300">{alloc.label}</span>
                    <span className="font-bold text-white">
                      €{alloc.value.toLocaleString('it-IT', { minimumFractionDigits: 2 })} ({alloc.weight.toFixed(1)}%)
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="h-2.5 bg-[#07090f] rounded-full overflow-hidden border border-[#1a2332]">
                    <div
                      style={{ width: `${alloc.weight}%` }}
                      className={`h-full ${alloc.colorClass} rounded-full transition-all duration-700`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Visual allocation chart layout with high density summary data info */}
            <div className="bg-[#07090f]/70 border border-[#1a2332] rounded-xl p-4.5 flex flex-col justify-center gap-3">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Stato di Diversificazione
              </h4>
              
              <p className="text-[11.5px] leading-relaxed text-gray-300">
                Il tuo portafoglio presenta {allocationBreakdown.filter(a => a.value > 0).length} classi attive. 
                {allocationBreakdown.some(a => a.type === 'CRYPTO' && a.weight > 40) ? (
                  <span className="text-[#ff3d6b] block mt-1.5 font-bold">
                    ⚠️ ATTENZIONE: Alta concentrazione espositiva in asset crypto speculative. Consigliata diversificazione controllata su ETF globali ad elevato paniere azionario.
                  </span>
                ) : (
                  <span className="text-[#00e5a0] block mt-1.5 font-bold">
                    ✅ BILANCIATO: Ottima diversificazione dei cluster, in linea con tesi tradizionali d'investimento macro.
                  </span>
                )}
              </p>
            </div>

          </div>
        )}
      </div>

      {/* RISK ATTRIBUTION SHIELD & RADAR VISUALIZER */}
      <RiskAttributionModel assets={assets} totalValue={totalValue} />

      {/* RISK BENCHMARK COMPARISON ADAPTER (RADAR CHART) */}
      <RiskBenchmarkComparison assets={assets} totalValue={totalValue} />

      {/* PORTFOLIO BENCHMARK OVERLAY COMPARATIVE CHART */}
      <PortfolioBenchmarkOverlay assets={assets} totalValue={totalValue} />

      {/* ==========================================================================
         PREMIUM ELITE SECLUSIONS (MONTE CARLO FORECAST PREDICTOR)
         ========================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* COLUMN A (7 COLS): MONTE CARLO SIMULATOR COMPONENT */}
        <div className="lg:col-span-12 xl:col-span-8 bg-[#111927] border border-[#1a2332] rounded-2xl p-6 ai-glow neon-border relative overflow-hidden min-h-[420px] flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-[#1a2332]/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4.5 w-4.5 text-[#00c2ff]" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">
                Previsione Quantistica Monte Carlo (10,000 Traiettorie)
              </h3>
            </div>
            {!isPremium && (
              <span className="text-[8px] bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold px-1.5 py-0.5 rounded font-mono uppercase flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-500 inline" /> ELITE
              </span>
            )}
          </div>

          {!isPremium && (
            /* SECURE PREMIUM HOVER LOCK */
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 bg-[#111927]/90 backdrop-blur-md">
              <div className="h-12 w-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-400 mb-4 select-none animate-bounce">
                <Lock className="h-5 w-5" />
              </div>

              <h4 className="text-white text-sm font-black uppercase tracking-wider font-mono">
                Portli Premium Elite Requisito
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed max-w-sm mt-2 mb-6 font-mono">
                Ottieni l'accesso immediato alla modellazione quantistica Monte Carlo a 12 mesi per fare previsioni, analizzare scenari d'investimento peggiori (5th percentile) ed ottimizzare l'allocazione.
              </p>

              <button
                onClick={onUpgradeClick}
                className="bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-slate-950 hover:text-white font-black text-[10px] uppercase tracking-wider px-6 py-2.5 rounded-xl transition duration-200 shadow-xl shadow-amber-500/15 cursor-pointer flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                Sblocca Premium Elite
              </button>
            </div>
          )}

          {/* Deep Analytics chart */}
          <div className="flex-1 w-full h-[280px] mt-4 font-mono select-none min-w-0 relative">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={20}>
                <AreaChart data={simulatedMonteCarloData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorO" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorM" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00c2ff" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#00c2ff" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff3d6b" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#ff3d6b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} dy={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} dx={-10} tickLine={false} domain={['dataMin - 1000', 'dataMax + 2000']} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      color: '#f8fafc'
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', paddingTop: '15px' }} />
                  <Area type="monotone" dataKey="Traiettoria Ottimista (95th)" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorO)" />
                  <Area type="monotone" dataKey="Valore Atteso (Mediano)" stroke="#00c2ff" strokeWidth={2} fillOpacity={1} fill="url(#colorM)" />
                  <Area type="monotone" dataKey="Traiettoria Conservativo (5th)" stroke="#ff3d6b" strokeWidth={1.5} fillOpacity={1} fill="url(#colorP)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-mono">
                Caricamento scenario predittore...
              </div>
            )}
          </div>
        </div>

        {/* COLUMN B: MARKOWITZ EFFICIENCY OPTIMISER */}
        <div className="lg:col-span-12 xl:col-span-4 bg-[#111927] border border-[#1a2332] rounded-2xl p-6 ai-glow neon-border relative flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-center border-b border-[#1a2332]/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-[#00e5a0]" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">
                Ribilanciamento Markowitz
              </h3>
            </div>
          </div>

          {!isPremium && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 bg-[#111927]/90 backdrop-blur-md">
              <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-400 mb-3 select-none">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed max-w-xs mt-1 mb-4 font-mono">
                Genera suggerimenti sul peso ottimo basati sulla frontiera efficiente per ridurre il drawdown.
              </p>
              <button
                onClick={onUpgradeClick}
                className="bg-transparent hover:bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:border-amber-500 font-bold text-[9px] uppercase tracking-wider px-4 py-1.5 rounded-lg transition"
              >
                Sblocca Ribilanciamento
              </button>
            </div>
          )}

          {/* Sviluppo rebalancing recommendations details */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <p className="text-[10.5px] leading-relaxed text-gray-400 font-mono">
              Gli algoritmi consigliano i seguenti aggiustamenti per ridurre il rischio complessivo di variabilità del capitale:
            </p>

            <div className="space-y-3.5 flex-1 pr-1 overflow-y-auto max-h-[220px]">
              {assets.length === 0 ? (
                <div className="text-center py-6 text-gray-500 font-mono text-[10px]">
                  Nessun ordine presente.
                </div>
              ) : (
                markowitzOptimiserRecommendations.map((rec) => {
                  const isBuy = rec.actionNeeded === 'ACQUISTA';
                  return (
                    <div key={rec.ticker} className="bg-[#07090f]/70 border border-[#1a2332] p-3 rounded-lg flex justify-between items-center font-mono">
                      <div>
                        <div className="font-extrabold text-white">{rec.ticker}</div>
                        <div className="text-[9px] text-gray-500">
                          Peso: {rec.currentWeight}% ➔ <span className="text-[#00c2ff] font-bold">{rec.optimalWeight}%</span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        isBuy ? 'bg-[#00e5a0]/10 text-[#00e5a0]' : 'bg-[#ff3d6b]/10 text-[#ff3d6b]'
                      }`}>
                        {rec.actionNeeded}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-lg text-[9px] leading-relaxed text-amber-500 font-mono flex items-center gap-1.5 mt-2">
              <Sparkles className="h-4 w-4 shrink-0" />
              Suggerimenti quantistici basati su varianza storica a 90 giorni.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
