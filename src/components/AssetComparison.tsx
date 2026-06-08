import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Scale, 
  Zap, 
  Sparkles, 
  BarChart3, 
  Percent, 
  Activity, 
  AlertTriangle, 
  Compass,
  ArrowRightLeft
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { PortfolioAsset } from '../types';
import { CURRENT_ASSET_PRICES } from '../data';
import CompoundSimulator from './CompoundSimulator';

interface AssetComparisonProps {
  assets: PortfolioAsset[];
  userTier: string;
  totalValue?: number;
}

interface HistoricalEvent {
  id: string;
  name: string;
  period: string;
  description: string;
  lessons: string;
}

const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'none',
    name: 'Nessuno (Dati Correnti)',
    period: 'Standard',
    description: 'Rendimento dinamico cumulativo calcolato in base alle condizioni attuali di mercato.',
    lessons: 'Ideale per monitorare l\'andamento attuale e proiettare performance a lungo termine.'
  },
  {
    id: 'covid_2020',
    name: '2020 Crollo COVID-19',
    period: 'Feb 2020 - Gen 2021',
    description: 'La pandemia globale innesca un crollo lampo dei mercati finanziari a marzo 2020 seguito da un eccezionale stimolo monetario che alimenta un rally tecnologico senza precedenti.',
    lessons: 'I mercati tendono a reagire in modo eccessivo agli shock sistemici non economici; la liquidità governativa successiva ha favorito asset growth.'
  },
  {
    id: 'inflation_2022',
    name: '2022 Shock Inflazione & Tassi',
    period: 'Gen 2022 - Dic 2022',
    description: 'L\'impennata dell\'inflazione globale costringe le banche centrali ad alzare i tassi a ritmo record. Crollo diffuso di bond e azioni growth, con criptovalute entrate in "crypto winter".',
    lessons: 'I tassi elevati sgonfiano i multipli delle growth stock speculative; asset fisici ed ETF diversificati limitano i danni strutturali.'
  },
  {
    id: 'ai_2023',
    name: '2023 Boom Intelligenza Artificiale',
    period: 'Nov 2022 - Nov 2023',
    description: 'Il lancio di ChatGPT scatena la febbre per l\'IA. Gli investitori si focalizzano sui Magnifici 7, spingendo NVDA e aziende leader di semiconduttori a ritorni epici.',
    lessons: 'I catalizzatori tecnologici reali creano divergenze macroscopiche tra vincitori infrastrutturali e il resto del mercato azionario classico.'
  },
  {
    id: 'crypto_2021',
    name: '2021 Bolla Cripto & Liquidità',
    period: 'Giu 2020 - Dic 2021',
    description: 'La combinazione di stimoli monetari diretti, tassi a zero e adozione retail spinge Bitcoin, Ethereum ed altcoin a massimi storici storici con enorme euforia speculativa.',
    lessons: 'La liquidità abbondante gonfia i ritorni degli asset digitali ad alta beta; il corretto ribilanciamento consente di capitalizzare la speculazione.'
  }
];

// Deterministic mock history curve generator matching data.ts profiles with support for historical crises simulation
function generateAssetHistory(ticker: string, monthsCount: number, currentPrice: number, eventId?: string) {
  const result: number[] = [];
  const basePrice = currentPrice || 100;
  
  // Force 12-month standard frame for precise historical event zoom simulation
  const span = eventId && eventId !== 'none' ? 12 : monthsCount;

  // Let's model a realistic back-simulation
  for (let i = 0; i < span; i++) {
    const t = i / (span - 1); // 0 (past) to 1 (present)

    let curve = 1.0;

    if (eventId === 'covid_2020') {
      // Month 0: start. Month 2-3 (t=0.2): sharp drop of 30-40%. Month 4-11: massive parabolic growth.
      let baseline = 1.0;
      if (t < 0.25) {
        baseline = 1.0 - t * 1.3; // 30% crash
      } else {
        const recoveryProgress = (t - 0.25) / 0.75; // 0 to 1
        baseline = 0.67 + (recoveryProgress * 0.95); // recovers and finishes at 1.62x
      }
      
      if (ticker === 'BTC' || ticker === 'ETH') {
        curve = baseline * (0.9 + Math.pow(t, 2) * 1.6);
      } else if (ticker === 'NVDA') {
        curve = baseline * (0.92 + Math.pow(t, 2.5) * 2.3);
      } else if (ticker === 'AAPL') {
        curve = baseline * (1.0 + Math.pow(t, 2) * 0.65);
      } else if (ticker === 'SWDA.MI' || ticker === 'US90.DE') {
        curve = baseline * (1.0 + t * 0.22);
      } else {
        curve = baseline * (0.85 + t * 0.45);
      }
      curve = Math.max(0.35, curve);

    } else if (eventId === 'inflation_2022') {
      // Painful market slide with multiple bear rallies
      const downwardSlope = 1.0 - (t * 0.32) + Math.sin(t * 11) * 0.07;
      
      if (ticker === 'BTC' || ticker === 'ETH') {
        curve = 1.0 - (t * 0.64) + Math.sin(t * 8) * 0.11;
      } else if (ticker === 'NVDA') {
        curve = 1.0 - (t * 0.48) + Math.sin(t * 9) * 0.09;
      } else if (ticker === 'AAPL') {
        curve = 1.0 - (t * 0.24) + Math.sin(t * 6) * 0.06;
      } else if (ticker === 'SWDA.MI' || ticker === 'US90.DE') {
        curve = 1.0 - (t * 0.16) + Math.sin(t * 5) * 0.03;
      } else {
        curve = downwardSlope;
      }
      curve = Math.max(0.18, curve);

    } else if (eventId === 'ai_2023') {
      // Tech magnificent 7 super-rally
      if (ticker === 'NVDA') {
        curve = 1.0 + Math.pow(t, 2.2) * 2.7 + Math.sin(t * 13) * 0.12;
      } else if (ticker === 'AAPL') {
        curve = 1.0 + t * 0.42 + Math.sin(t * 7) * 0.04;
      } else if (ticker === 'BTC' || ticker === 'ETH') {
        curve = 1.0 + t * 0.95 + Math.sin(t * 10) * 0.20;
      } else if (ticker === 'SWDA.MI' || ticker === 'US90.DE') {
        curve = 1.0 + t * 0.20 + Math.sin(t * 4) * 0.02;
      } else {
        curve = 1.0 + t * 0.32 + Math.sin(t * 7) * 0.05;
      }

    } else if (eventId === 'crypto_2021') {
      // Parabolic speculative crypto run-up to peak around t=0.75, then correct.
      if (ticker === 'BTC' || ticker === 'ETH') {
        if (t < 0.75) {
          curve = 1.0 + Math.pow(t, 1.4) * 3.1 + Math.sin(t * 9) * 0.25;
        } else {
          const decay = (t - 0.75) / 0.25;
          curve = 3.5 - decay * 1.1 + Math.sin(t * 7) * 0.08;
        }
      } else if (ticker === 'NVDA') {
        curve = 1.0 + t * 1.1 + Math.sin(t * 7) * 0.08;
      } else if (ticker === 'AAPL') {
        curve = 1.0 + t * 0.38 + Math.sin(t * 5) * 0.04;
      } else if (ticker === 'SWDA.MI' || ticker === 'US90.DE') {
        curve = 1.0 + t * 0.22 + Math.sin(t * 4) * 0.01;
      } else {
        curve = 1.0 + t * 0.45 + Math.sin(t * 5) * 0.04;
      }

    } else {
      // Standard / Current Period matching regular curves
      if (ticker === 'BTC') {
        curve = 0.3 + (1.2 * Math.pow(t, 2.5)) + (Math.sin(t * 8) * 0.4) * (1 - t * 0.5);
        curve = Math.max(0.12, Math.min(1.2, curve));
      } else if (ticker === 'ETH') {
        curve = 0.4 + (1.1 * Math.pow(t, 2.2)) + (Math.sin(t * 7) * 0.35);
        curve = Math.max(0.15, Math.min(1.15, curve));
      } else if (ticker === 'NVDA') {
        curve = 0.04 + (0.96 * Math.pow(t, 5));
        curve = Math.max(0.03, Math.min(1.05, curve));
      } else if (ticker === 'AAPL') {
        curve = 0.65 + (0.35 * t) + (Math.sin(t * 10) * 0.1);
        curve = Math.max(0.5, Math.min(1.1, curve));
      } else if (ticker === 'SWDA.MI' || ticker === 'US90.DE') {
        curve = 0.7 + (0.3 * t) + (Math.sin(t * 4) * 0.05);
        curve = Math.max(0.6, Math.min(1.05, curve));
      } else {
        const charWeight = ticker.charCodeAt(0) % 4;
        const tModifier = 0.2 + (charWeight * 0.08);
        const sineFrequency = 5 + (charWeight * 2);
        curve = (1 - tModifier) + (tModifier * t) + (Math.sin(t * sineFrequency) * 0.06);
        curve = Math.max(0.4, Math.min(1.15, curve));
      }
    }

    // Add deterministic wiggle to simulate days/months movements
    let hash = 0;
    const key = ticker + '-' + i + '-' + (eventId || 'none');
    for (let j = 0; j < key.length; j++) {
      hash = key.charCodeAt(j) + ((hash << 5) - hash);
    }
    const noise = ((Math.abs(hash) % 100) / 1250) - 0.04;

    // Scale final price
    let simulatedPrice = basePrice * (curve + noise);
    if (eventId && eventId !== 'none') {
      // Historical scenarios compare visual progression starting on $100 base
      simulatedPrice = 100 * (curve + noise);
    }
    result.push(simulatedPrice);
  }

  // Final force for standard mode
  if (result.length > 0 && (!eventId || eventId === 'none')) {
    result[result.length - 1] = basePrice;
  }

  return result;
}

export default function AssetComparison({ assets, userTier, totalValue = 0 }: AssetComparisonProps) {
  const [tickerA, setTickerA] = useState<string>('BTC');
  const [tickerB, setTickerB] = useState<string>('AAPL');
  const [timeframe, setTimeframe] = useState<number>(36); // 12, 36, or 60 months
  const [selectedEventId, setSelectedEventId] = useState<string>('none');
  const [displayType, setDisplayType] = useState<'percent' | 'absolute'>('percent');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Combined library of available tickers
  const availableTickers = useMemo(() => {
    // 1. Get tickers from active portfolio holdings
    const holdings = assets
      .filter(a => a.ticker !== 'EUR') // Filter cash if user wants active volatile products
      .map(a => ({
        ticker: a.ticker,
        name: `${a.name} (Holdings)`,
        price: a.currentPrice,
        assetType: a.assetType,
        isHolding: true
      }));

    // 2. Add prominent predefined reference symbols that aren't already in holdings
    const defaultRefs = Object.entries(CURRENT_ASSET_PRICES)
      .filter(([ticker]) => ticker !== 'EUR' && !holdings.some(h => h.ticker === ticker))
      .map(([ticker, val]) => ({
        ticker,
        name: val.name,
        price: val.price,
        assetType: val.assetType,
        isHolding: false
      }));

    // Combine them with holdings first
    return [...holdings, ...defaultRefs];
  }, [assets]);

  // Adjust defaults intelligently if active assets differ
  useEffect(() => {
    if (availableTickers.length > 0) {
      const activeHoldings = availableTickers.filter(t => t.isHolding);
      if (activeHoldings.length >= 2) {
        setTickerA(activeHoldings[0].ticker);
        setTickerB(activeHoldings[1].ticker);
      } else if (activeHoldings.length === 1) {
        setTickerA(activeHoldings[0].ticker);
        // choose a default different from A
        const alt = availableTickers.find(t => t.ticker !== activeHoldings[0].ticker);
        if (alt) setTickerB(alt.ticker);
      }
    }
  }, [availableTickers]);

  // Handle asset swap cleanly
  const handleSwapAssets = () => {
    const temp = tickerA;
    setTickerA(tickerB);
    setTickerB(temp);
  };

  // Find asset definitions
  const assetAInfo = useMemo(() => {
    return availableTickers.find(t => t.ticker === tickerA) || { ticker: '?', name: 'Unknown', price: 100, assetType: 'STOCK' as const };
  }, [availableTickers, tickerA]);

  const assetBInfo = useMemo(() => {
    return availableTickers.find(t => t.ticker === tickerB) || { ticker: '?', name: 'Unknown', price: 100, assetType: 'STOCK' as const };
  }, [availableTickers, tickerB]);

  // Compute comparative series dynamically
  const comparisonResults = useMemo(() => {
    const activeSpan = selectedEventId !== 'none' ? 12 : timeframe;
    const priceSeriesA = generateAssetHistory(tickerA, activeSpan, assetAInfo.price, selectedEventId);
    const priceSeriesB = generateAssetHistory(tickerB, activeSpan, assetBInfo.price, selectedEventId);

    // Month labels
    const monthlyLabels: string[] = [];
    if (selectedEventId === 'covid_2020') {
      const start = new Date(2020, 1, 1); // Feb 20
      for (let i = 0; i < 12; i++) {
        const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
        monthlyLabels.push(d.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' }));
      }
    } else if (selectedEventId === 'inflation_2022') {
      const start = new Date(2022, 0, 1); // Jan 22
      for (let i = 0; i < 12; i++) {
        const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
        monthlyLabels.push(d.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' }));
      }
    } else if (selectedEventId === 'ai_2023') {
      const start = new Date(2022, 10, 1); // Nov 22
      for (let i = 0; i < 12; i++) {
        const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
        monthlyLabels.push(d.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' }));
      }
    } else if (selectedEventId === 'crypto_2021') {
      const start = new Date(2020, 9, 1); // Oct 20
      for (let i = 0; i < 12; i++) {
        const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
        monthlyLabels.push(d.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' }));
      }
    } else {
      const endYear = 2026;
      const endMonth = 4; // May (0-indexed)
      for (let i = timeframe - 1; i >= 0; i--) {
        const d = new Date(endYear, endMonth - i, 1);
        const label = d.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' });
        monthlyLabels.push(label);
      }
    }

    // Initialize stat structures
    const chartData: any[] = [];
    const baseA = priceSeriesA[0] || 1;
    const baseB = priceSeriesB[0] || 1;

    for (let idx = 0; idx < activeSpan; idx++) {
      const pA = priceSeriesA[idx];
      const pB = priceSeriesB[idx];
      const relA = ((pA - baseA) / baseA) * 100;
      const relB = ((pB - baseB) / baseB) * 100;

      chartData.push({
        name: monthlyLabels[idx] || `Mese ${idx + 1}`,
        [tickerA]: displayType === 'percent' ? parseFloat(relA.toFixed(2)) : parseFloat(pA.toFixed(2)),
        [tickerB]: displayType === 'percent' ? parseFloat(relB.toFixed(2)) : parseFloat(pB.toFixed(2)),
        [`${tickerA}_price`]: parseFloat(pA.toFixed(2)),
        [`${tickerB}_price`]: parseFloat(pB.toFixed(2)),
      });
    }

    // Calculates monthly return arrays for stats
    const returnsA: number[] = [];
    const returnsB: number[] = [];
    for (let idx = 1; idx < activeSpan; idx++) {
      returnsA.push((priceSeriesA[idx] - priceSeriesA[idx - 1]) / priceSeriesA[idx - 1]);
      returnsB.push((priceSeriesB[idx] - priceSeriesB[idx - 1]) / priceSeriesB[idx - 1]);
    }

    // Helper: average
    const getAvg = (arr: number[]) => arr.reduce((acc, v) => acc + v, 0) / arr.length;

    // Helper: annualized volatility (STD Dev of monthly * sqrt(12))
    const getVolatility = (returns: number[]) => {
      if (returns.length < 2) return 0;
      const avg = getAvg(returns);
      const variance = returns.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / (returns.length - 1);
      return Math.sqrt(variance) * Math.sqrt(12);
    };

    // Helper: maximum drawdown
    const getMaxDrawdown = (series: number[]) => {
      let maxDrawdown = 0;
      let peak = -Infinity;
      series.forEach(val => {
        if (val > peak) peak = val;
        const dd = (val - peak) / peak;
        if (dd < maxDrawdown) maxDrawdown = dd;
      });
      return maxDrawdown * 100; // in percent
    };

    // Sharpe Ratio: (Annualized Return - RF Rate (2%)) / Annualized Volatility
    const getSharpeRatio = (series: number[], vol: number) => {
      if (vol <= 0) return 0;
      const startPrice = series[0] || 1;
      const endPrice = series[series.length - 1] || 1;
      const totalGrowth = endPrice / startPrice;
      const years = activeSpan / 12;
      const annualizedReturn = Math.pow(totalGrowth, 1 / years) - 1;
      return (annualizedReturn - 0.02) / vol;
    };

    // Calculate correlations (Pearson product-moment correlation coefficient)
    const computeCorrelation = (X: number[], Y: number[]) => {
      if (X.length !== Y.length || X.length === 0) return 0;
      const meanX = getAvg(X);
      const meanY = getAvg(Y);

      let num = 0;
      let denX = 0;
      let denY = 0;

      for (let i = 0; i < X.length; i++) {
        const dx = X[i] - meanX;
        const dy = Y[i] - meanY;
        num += dx * dy;
        denX += dx * dx;
        denY += dy * dy;
      }

      if (denX === 0 || denY === 0) return 0;
      return num / Math.sqrt(denX * denY);
    };

    const volA = getVolatility(returnsA);
    const volB = getVolatility(returnsB);
    const mddA = getMaxDrawdown(priceSeriesA);
    const mddB = getMaxDrawdown(priceSeriesB);
    const sharpeA = getSharpeRatio(priceSeriesA, volA);
    const sharpeB = getSharpeRatio(priceSeriesB, volB);
    const correlation = computeCorrelation(returnsA, returnsB);

    return {
      chartData,
      stats: {
        totalReturnA: ((priceSeriesA[activeSpan - 1] - priceSeriesA[0]) / priceSeriesA[0]) * 100,
        totalReturnB: ((priceSeriesB[activeSpan - 1] - priceSeriesB[0]) / priceSeriesB[0]) * 100,
        avgPriceA: getAvg(priceSeriesA),
        avgPriceB: getAvg(priceSeriesB),
        volA: volA * 100,
        volB: volB * 100,
        mddA,
        mddB,
        sharpeA,
        sharpeB,
        correlation
      }
    };
  }, [tickerA, tickerB, timeframe, assetAInfo, assetBInfo, displayType, selectedEventId]);

  const { chartData, stats } = comparisonResults;

  // Render index description of Pearson correlation
  const correlationInsight = useMemo(() => {
    const r = stats.correlation;
    if (r > 0.8) {
      return {
        label: "Correlazione Estremamente Forte",
        desc: "I due asset si muovono quasi all'unisono. Aggiungerne entrambi nel portafoglio non aumenta l'efficienza di diversificazione. Molto vulnerabili agli stessi shock di mercato.",
        color: "text-[#ff3d6b]",
        bg: "bg-[#ff3d6b]/10",
        rating: "Scarsa Diversificazione"
      };
    } else if (r > 0.4) {
      return {
        label: "Correlazione Positiva Moderata",
        desc: "I due asset tendono a seguire direzioni simili ma mantengono divergenze operative utili in determinati cicli macroeconomici. Forniscono un moderato livello di riduzione del rischio.",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        rating: "Diversificazione Accettabile"
      };
    } else if (r > -0.2 && r <= 0.4) {
      return {
        label: "Correlazione Bassa / Neutra",
        desc: "Asset non correlati. Movimenti completamente scollegati (es: Oro/Bitcoin o Azioni/Cash). Questa unione incarna la perfetta diversificazione quantistica, massimizzando l'indice di Sharpe del portafoglio globale.",
        color: "text-[#00e5a0]",
        bg: "bg-[#00e5a0]/10",
        rating: "Diversificazione Eccellente"
      };
    } else {
      return {
        label: "Correlazione Inversa (Negativa)",
        desc: "I due asset si muovono in direzioni opposte (copertura/hedge automatica). Riduce drasticamente la deviazione standard del portafoglio complessivo durante i crolli azionari sistemici.",
        color: "text-[#00c2ff]",
        bg: "bg-[#00c2ff]/10",
        rating: "Hedge Protettiva Ideale"
      };
    }
  }, [stats.correlation]);

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Scale className="h-5 w-5 text-[#00c2ff]" />
            Confronto Quantitativo Asset
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Analisi comparativa empirica e calcolo di correlazione storica tra asset class
          </p>
        </div>

        {/* Dynamic Selector Options Toolbar */}
        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[10px]">
          <span className="text-gray-500 uppercase font-bold mr-1">Orizzonte:</span>
          {selectedEventId !== 'none' ? (
            <span className="text-[#00c2ff] font-bold bg-[#00c2ff]/10 border border-[#00c2ff]/20 px-2.5 py-1.5 rounded-lg uppercase text-[9px] animate-pulse">
              Scenario Shock Attivo
            </span>
          ) : (
            [12, 36, 60].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer ${
                  timeframe === t
                    ? 'bg-[#00c2ff]/15 border-[#00c2ff]/40 text-[#00c2ff]'
                    : 'bg-[#111927] border-[#1a2332] text-gray-400 hover:text-white'
                }`}
              >
                {t === 12 && '1 Anno'}
                {t === 36 && '3 Anni'}
                {t === 60 && '5 Anni'}
              </button>
            ))
          )}
        </div>
      </div>

      {/* CHANGER SELECTORS CONTROL GRID */}
      <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Asset A selection card */}
          <div className="md:col-span-5 bg-[#07090f]/80 border border-[#1a2332] p-4 rounded-xl space-y-2">
            <span className="text-[9px] uppercase font-bold text-gray-500 font-mono tracking-wider block">Asset Principale (A)</span>
            <select
              value={tickerA}
              onChange={(e) => {
                const val = e.target.value;
                if (val === tickerB) {
                  setTickerB(tickerA); // Prevents duplicates by swapping
                }
                setTickerA(val);
              }}
              className="w-full bg-[#111927] border border-[#1a2332] rounded-lg text-white font-mono text-xs px-3 py-2 outline-none focus:border-[#00c2ff]/60"
            >
              {availableTickers.map(t => (
                <option key={`opt-A-${t.ticker}`} value={t.ticker} className="bg-[#0f172a]">
                  {t.ticker} - {t.name}
                </option>
              ))}
            </select>
            <div className="flex justify-between items-center text-[11px] font-mono pt-1 text-gray-400">
              <span className="uppercase text-[9px] px-1.5 py-0.5 bg-[#111927] border border-[#1a2332] rounded text-[#00c2ff] font-bold">
                {assetAInfo.assetType}
              </span>
              <span className="font-bold text-white">€{assetAInfo.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Swap icon container */}
          <div className="md:col-span-2 flex justify-center">
            <button
              onClick={handleSwapAssets}
              className="p-3 bg-[#111927] hover:bg-[#1a2332] border border-[#1a2332] hover:border-[#00c2ff]/40 rounded-full text-gray-400 hover:text-white transition duration-200 cursor-pointer shadow-md shadow-black/30"
              title="Scambia Asset"
            >
              <ArrowRightLeft className="h-4 w-4 rotate-90 md:rotate-0" />
            </button>
          </div>

          {/* Asset B selection card */}
          <div className="md:col-span-5 bg-[#07090f]/80 border border-[#1a2332] p-4 rounded-xl space-y-2">
            <span className="text-[9px] uppercase font-bold text-gray-500 font-mono tracking-wider block">Asset di Confronto (B)</span>
            <select
              value={tickerB}
              onChange={(e) => {
                const val = e.target.value;
                if (val === tickerA) {
                  setTickerA(tickerB); // Prevents duplicates by swapping
                }
                setTickerB(val);
              }}
              className="w-full bg-[#111927] border border-[#1a2332] rounded-lg text-white font-mono text-xs px-3 py-2 outline-none focus:border-[#00c2ff]/60"
            >
              {availableTickers.map(t => (
                <option key={`opt-B-${t.ticker}`} value={t.ticker} className="bg-[#0f172a]">
                  {t.ticker} - {t.name}
                </option>
              ))}
            </select>
            <div className="flex justify-between items-center text-[11px] font-mono pt-1 text-gray-400">
              <span className="uppercase text-[9px] px-1.5 py-0.5 bg-[#111927] border border-[#1a2332] rounded text-[#f59e0b] font-bold">
                {assetBInfo.assetType}
              </span>
              <span className="font-bold text-white">€{assetBInfo.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

        </div>
      </div>

      {/* SELETTORE EVENTI STORICI COERENTE - #section-view-confronto */}
      <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#1a2332]/60 pb-3.5 gap-3">
          <div className="flex items-center gap-2 font-mono">
            <Compass className="h-4.5 w-4.5 text-[#f59e0b]" />
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">
                Filtro Periodi Storici & Scenari di Stress
              </h3>
              <p className="text-[10px] text-gray-400">
                Seleziona un evento per isolare la performance dei due asset durante quel preciso intervallo macroeconomico
              </p>
            </div>
          </div>
          
          {/* TENDINA DI SELEZIONE RAPIDA (DROP-DOWN SELECTOR) */}
          <div className="flex items-center gap-2 font-mono shrink-0">
            <span className="text-gray-400 text-[10px] uppercase font-bold">Filtro Rapido:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-[#07090f] border border-[#1a2332] rounded-lg text-white font-mono text-xs px-3 py-1.5 outline-none focus:border-[#00c2ff]/60 cursor-pointer min-w-[200px]"
            >
              {HISTORICAL_EVENTS.map((evt) => (
                <option key={`select-evt-opt-${evt.id}`} value={evt.id} className="bg-[#0f172a]">
                  {evt.name}
                </option>
              ))}
            </select>
            {selectedEventId !== 'none' && (
              <button
                onClick={() => setSelectedEventId('none')}
                className="text-[10px] uppercase font-black font-mono text-[#ff3d6b] hover:text-white transition bg-[#ff3d6b]/15 hover:bg-[#ff3d6b] border border-[#ff3d6b]/20 py-1.5 px-2.5 rounded-lg cursor-pointer"
              >
                Annulla Filtro
              </button>
            )}
          </div>
        </div>

        {/* SET DI BOTTONI ORIZZONTALI DI SCENARIO (HORIZONTAL SCENARIO ROW BUTTONS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
          {HISTORICAL_EVENTS.map((evt) => {
            const isSelected = selectedEventId === evt.id;
            return (
              <button
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                className={`p-3.5 border rounded-xl cursor-pointer transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden select-none group/evt outline-none hover:shadow-lg ${
                  isSelected
                    ? 'bg-[#00c2ff]/12 border-[#00c2ff] shadow-md shadow-[#00c2ff]/10 scale-[1.01]'
                    : 'bg-[#07090f]/75 border-[#1a2332]/70 hover:border-[#00c2ff]/40 hover:bg-[#07090f]'
                }`}
              >
                {/* Active glow tag indicator */}
                {isSelected && (
                  <div className="absolute top-0 right-0 h-1.5 w-6 bg-[#00c2ff] rounded-bl-lg" />
                )}

                <div>
                  <div className={`text-[10.5px] font-bold leading-snug transition-colors duration-200 ${
                    isSelected ? 'text-[#00c2ff]' : 'text-gray-300 group-hover/evt:text-white'
                  }`}>
                    {evt.name}
                  </div>
                  <div className="text-[8.5px] text-gray-500 mt-1 uppercase font-semibold">
                    {evt.period}
                  </div>
                </div>

                <div className={`text-[8.5px] font-bold uppercase mt-3 flex items-center gap-1 transition-colors duration-200 ${
                  isSelected ? 'text-[#00c2ff]' : 'text-gray-400 group-hover/evt:text-[#00c2ff]'
                }`}>
                  <span>{isSelected ? 'Range Attivo' : 'Seleziona'}</span>
                  <span className="text-[7.5px] transition-transform duration-200 group-hover/evt:translate-x-0.5">➔</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Event Context Card Explainer */}
        {selectedEventId !== 'none' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#07090f]/90 border border-[#00c2ff]/20 rounded-xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-mono text-xs"
          >
            <div className="space-y-1 lg:max-w-2xl">
              <div className="flex items-center gap-1.5">
                <span className="text-[8.5px] uppercase font-black text-amber-500 tracking-wider bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">Breve Analitica Scenario</span>
                <span className="text-[8.5px] uppercase font-black text-[#00c2ff] tracking-wider bg-[#00c2ff]/10 border border-[#00c2ff]/20 px-1.5 py-0.5 rounded">Zoom 12 Mesi</span>
              </div>
              <h4 className="font-bold text-white text-xs mt-1">
                {HISTORICAL_EVENTS.find(e => e.id === selectedEventId)?.name} • Orizzonte temporale: {HISTORICAL_EVENTS.find(e => e.id === selectedEventId)?.period}
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {HISTORICAL_EVENTS.find(e => e.id === selectedEventId)?.description}
              </p>
            </div>

            <div className="bg-[#111927] border border-[#1a2332]/80 p-3 rounded-lg flex flex-col gap-1 items-start w-full lg:max-w-[320px] shrink-0">
              <span className="text-[8px] uppercase font-black text-[#00e5a0] tracking-wider mb-0.5">Lezione di diversificazione</span>
              <p className="text-[9.5px] leading-relaxed text-gray-300">
                {HISTORICAL_EVENTS.find(e => e.id === selectedEventId)?.lessons}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* MAIN PLOT & CONTROL CARD */}
      <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border">
        
        {/* Plot header controls */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-[#1a2332]/60 pb-3 mb-4 gap-3">
          <div className="flex items-center gap-2 font-mono">
            <BarChart3 className="h-4 w-4 text-[#00c2ff]" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">
              Performance Storica Cumulativa
            </h3>
          </div>

          {/* Display mode buttons */}
          <div className="flex items-center gap-1 font-mono text-[9px]">
            <button
              onClick={() => setDisplayType('percent')}
              className={`px-2 py-1 rounded transition border cursor-pointer ${
                displayType === 'percent'
                  ? 'bg-sky-500/10 border-sky-500/30 text-[#00c2ff] font-bold'
                  : 'bg-transparent border-transparent text-gray-500 hover:text-white'
              }`}
            >
              Rendimento %
            </button>
            <button
              onClick={() => setDisplayType('absolute')}
              className={`px-2 py-1 rounded transition border cursor-pointer ${
                displayType === 'absolute'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold'
                  : 'bg-transparent border-transparent text-gray-500 hover:text-white'
              }`}
            >
              Prezzo (€)
            </button>
          </div>
        </div>

        {/* Dynamic Line chart plot container */}
        <div className="w-full h-[320px] font-mono select-none relative pt-2">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%" debounce={15}>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineA-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00f2ff" />
                    <stop offset="100%" stopColor="#0066ff" />
                  </linearGradient>
                  <linearGradient id="lineB-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffd200" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} dy={10} tickLine={false} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={9} 
                  dx={-10} 
                  tickLine={false} 
                  domain={displayType === 'percent' ? ['auto', 'auto'] : ['auto', 'auto']}
                  tickFormatter={(val) => displayType === 'percent' ? `${val}%` : `€${val.toLocaleString('it-IT')}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1223',
                    borderColor: '#1a2332',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    color: '#f8fafc',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                  formatter={(val, name, props) => {
                    if (displayType === 'percent') {
                      const absolutePrice = props.payload[`${name}_price` as keyof typeof props.payload];
                      return [`${val}% (Prezzo: €${absolutePrice})`, name];
                    }
                    return [`€${val.toLocaleString('it-IT')}`, name];
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '15px' }} />
                <Line 
                  type="monotone" 
                  dataKey={tickerA} 
                  name={tickerA} 
                  stroke="url(#lineA-grad)" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#00f2ff', style: { filter: 'drop-shadow(0 0 6px #00f2ff)' } }}
                  style={{ filter: 'drop-shadow(0px 0px 4px rgba(0, 194, 255, 0.4))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey={tickerB} 
                  name={tickerB} 
                  stroke="url(#lineB-grad)" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#ffb700', style: { filter: 'drop-shadow(0 0 6px #ffd200)' } }}
                  style={{ filter: 'drop-shadow(0px 0px 4px rgba(245, 158, 11, 0.4))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-mono">
              Preparazione comparativa...
            </div>
          )}
        </div>

      </div>

      {/* STATS COMPARISON GRID CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Return KPI */}
        <div className="bg-[#111927] border border-[#1a2332] p-4 rounded-xl space-y-2 ai-glow font-mono">
          <div className="flex justify-between items-center text-gray-500 text-[9px] uppercase font-bold tracking-wider">
            <span>Rendimento Totale</span>
            <Percent className="h-3.5 w-3.5" />
          </div>
          <div className="grid grid-cols-2 divide-x divide-[#1a2332]/60 pt-1">
            <div className="pr-2">
              <span className="text-[10px] text-gray-400 block font-bold">{tickerA}</span>
              <span className={`text-sm font-black flex items-center gap-0.5 mt-0.5 ${
                stats.totalReturnA >= 0 ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'
              }`}>
                {stats.totalReturnA >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stats.totalReturnA.toFixed(1)}%
              </span>
            </div>
            <div className="pl-3">
              <span className="text-[10px] text-gray-400 block font-bold">{tickerB}</span>
              <span className={`text-sm font-black flex items-center gap-0.5 mt-0.5 ${
                stats.totalReturnB >= 0 ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'
              }`}>
                {stats.totalReturnB >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stats.totalReturnB.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Volatility stats */}
        <div className="bg-[#111927] border border-[#1a2332] p-4 rounded-xl space-y-2 ai-glow font-mono">
          <div className="flex justify-between items-center text-gray-500 text-[9px] uppercase font-bold tracking-wider">
            <span>Volatilità Annua</span>
            <Activity className="h-3.5 w-3.5" />
          </div>
          <div className="grid grid-cols-2 divide-x divide-[#1a2332]/60 pt-1">
            <div className="pr-2">
              <span className="text-[10px] text-gray-400 block font-bold">{tickerA}</span>
              <span className="text-sm font-black text-rose-400 block mt-0.5">
                {stats.volA.toFixed(1)}%
              </span>
            </div>
            <div className="pl-3">
              <span className="text-[10px] text-gray-400 block font-bold">{tickerB}</span>
              <span className="text-sm font-black text-rose-400 block mt-0.5">
                {stats.volB.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Maximum Drawdowns */}
        <div className="bg-[#111927] border border-[#1a2332] p-4 rounded-xl space-y-2 ai-glow font-mono">
          <div className="flex justify-between items-center text-gray-500 text-[9px] uppercase font-bold tracking-wider">
            <span>Drawdown Massimo</span>
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <div className="grid grid-cols-2 divide-x divide-[#1a2332]/60 pt-1">
            <div className="pr-2">
              <span className="text-[10px] text-gray-400 block font-bold">{tickerA}</span>
              <span className="text-sm font-black text-amber-500 block mt-0.5">
                {stats.mddA.toFixed(1)}%
              </span>
            </div>
            <div className="pl-3">
              <span className="text-[10px] text-gray-400 block font-bold">{tickerB}</span>
              <span className="text-sm font-black text-amber-500 block mt-0.5">
                {stats.mddB.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Sharpe Ratios */}
        <div className="bg-[#111927] border border-[#1a2332] p-4 rounded-xl space-y-2 ai-glow font-mono">
          <div className="flex justify-between items-center text-gray-500 text-[9px] uppercase font-bold tracking-wider">
            <span>Indice di Sharpe</span>
            <Compass className="h-3.5 w-3.5" />
          </div>
          <div className="grid grid-cols-2 divide-x divide-[#1a2332]/60 pt-1">
            <div className="pr-2">
              <span className="text-[10px] text-gray-400 block font-bold">{tickerA}</span>
              <span className="text-sm font-black text-[#00c2ff] block mt-0.5">
                {stats.sharpeA.toFixed(2)}
              </span>
            </div>
            <div className="pl-3">
              <span className="text-[10px] text-gray-400 block font-bold">{tickerB}</span>
              <span className="text-sm font-black text-[#00c2ff] block mt-0.5">
                {stats.sharpeB.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED STATISTICAL Pearson Correlation insight panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">
        
        {/* CORRELATION ANALYSIS GAUGE (8/12 COLS) */}
        <div className="lg:col-span-8 bg-[#111927] border border-[#1a2332] rounded-xl p-6 ai-glow neon-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-[#1a2332]/60 pb-3 mb-4">
              <Zap className="h-4 w-4 text-[#00c2ff]" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">
                Coefficiente di Correlazione Storica ({tickerA} vs {tickerB})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-4">
              {/* Left sidebar: The correlation gauge score */}
              <div className="md:col-span-4 text-center space-y-2">
                <span className="text-[11px] uppercase font-bold text-gray-500 font-mono tracking-wider block">Indice di Pearson (r)</span>
                
                <div className="relative w-32 h-20 mx-auto overflow-hidden flex items-center justify-center">
                  {/* Arc gauge track */}
                  <svg className="absolute top-0 left-0 w-full h-full transform translate-y-3">
                    <path
                      d="M 16,70 A 48,48 0 0,1 112,70"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Animated needle / arc point */}
                    <circle
                      cx={64 + 48 * Math.cos(Math.PI - ((stats.correlation + 1) / 2) * Math.PI)}
                      cy={70 - 48 * Math.sin(Math.PI - ((stats.correlation + 1) / 2) * Math.PI)}
                      r="6"
                      fill="#00c2ff"
                      className="transition-all duration-700"
                    />
                  </svg>

                  <div className="absolute bottom-1 text-center font-mono">
                    <span className="text-2xl font-black text-white">
                      {stats.correlation >= 0 ? '+' : ''}{stats.correlation.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Range bar label indicator */}
                <div className="flex justify-between text-[8px] font-mono text-gray-500 max-w-[130px] mx-auto pt-1.5 border-t border-[#1a2332]/60">
                  <span>-1.0 (Coperto)</span>
                  <span>+1.0 (Unito)</span>
                </div>
              </div>

              {/* Right explanation of the correlation values */}
              <div className="md:col-span-8 space-y-3">
                <div className={`text-xs font-black font-mono inline-block px-2.5 py-1 rounded-md ${correlationInsight.bg} ${correlationInsight.color}`}>
                  {correlationInsight.label} • {correlationInsight.rating}
                </div>

                <p className="text-[11.5px] leading-relaxed text-gray-400 font-mono">
                  {correlationInsight.desc}
                </p>
                <div className="bg-[#07090f]/50 border border-[#1a2332] p-3 rounded-lg text-[10px] leading-normal text-gray-500 font-mono select-none">
                  💡 <strong>Teoria di Portafoglio di Markowitz:</strong> Selezionare asset a bassa o negativa correlazione riduce la varianza complessiva senza alterare la riga mediana di profitto atteso.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INTEGRATED DIVERSIFICATION ADVISER CARD (4/12 COLS) */}
        <div className="lg:col-span-4 bg-[#111927] border border-[#1a2332] rounded-xl p-6 ai-glow neon-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-[#1a2332]/60 pb-3 mb-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">
                Consulenza IA Quantistica
              </h3>
            </div>

            <p className="text-[11px] leading-relaxed text-gray-400 font-mono mt-2 leading-relaxed">
              Analizzando <span className="text-white font-bold">{tickerA}</span> ({assetAInfo.assetType}) integrato con <span className="text-white font-bold">{tickerB}</span> ({assetBInfo.assetType}), gli algoritmi calcolano un indice di coerenza. 
            </p>

            <div className="mt-4 space-y-2.5 font-mono text-[10px]">
              <div className="bg-[#07090f]/70 border border-[#1a2332] p-2.5 rounded-lg flex items-start gap-2">
                <span className="text-[#00e5a0] font-black shrink-0">✓</span>
                <span className="text-gray-300">
                  Rapporto Volatilità: <strong>{(stats.volA / Math.max(1, stats.volB)).toFixed(2)}x</strong> ({tickerA} rispetto a {tickerB}).
                </span>
              </div>

              <div className="bg-[#07090f]/70 border border-[#1a2332] p-2.5 rounded-lg flex items-start gap-2">
                <span className="text-[#00c2ff] font-black shrink-0">✓</span>
                <span className="text-gray-300">
                  Massima perdita potenziale combinata attesa (Drawdown simultaneo): <strong>{Math.max(stats.mddA, stats.mddB).toFixed(1)}%</strong>.
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1a2332]/40 pt-3.5 mt-4 text-[9.5px] text-gray-500 font-mono leading-tight">
            Nota: I dati simulati derivano da serie storiche regolarizzate con pesi correnti d'investimento.
          </div>
        </div>

      </div>

      {/* COMPOUND INTEREST ACCUMULATION SIMULATOR */}
      <CompoundSimulator initialValue={totalValue} />

    </div>
  );
}
