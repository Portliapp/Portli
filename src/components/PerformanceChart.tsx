import { useState, useMemo, useEffect } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { HistoricalDataPoint, Transaction } from '../types';
import { Calendar, Info, Loader2, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRENT_ASSET_PRICES } from '../data';

interface PerformanceChartProps {
  historicalData: HistoricalDataPoint[];
  transactions?: Transaction[];
}

type Timeframe = '1G' | '3G' | '1S' | '1M' | '6M' | 'YTD' | '1A' | '2A' | '5A' | 'ALL';

export default function PerformanceChart({ historicalData, transactions }: PerformanceChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1A');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Trigger brief simulation of AI analytics calculation on timeframe switch
  useEffect(() => {
    if (!isMounted) return;
    setIsCalculating(true);
    setLoadingProgress(0);

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 12;
      });
    }, 35);

    const timer = setTimeout(() => {
      setIsCalculating(false);
      setLoadingProgress(100);
    }, 350);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [timeframe]);

  // Filter and generate historical data points dynamically based on selected range and ledger
  const filteredData = useMemo(() => {
    const activeTransactions = transactions || [];
    const now = new Date();
    
    // Determine startDate and step count based on timeframe
    let startDate = new Date();
    let numPoints = 30; // default number of steps
    let intervalMs = 0;
    
    switch (timeframe) {
      case '1G':
        startDate.setTime(now.getTime() - 24 * 60 * 60 * 1000);
        numPoints = 25; // hourly
        intervalMs = (24 * 60 * 60 * 1000) / (numPoints - 1);
        break;
      case '3G':
        startDate.setTime(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        numPoints = 19; // every 4 hours
        intervalMs = (3 * 24 * 60 * 60 * 1000) / (numPoints - 1);
        break;
      case '1S':
        startDate.setTime(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        numPoints = 15; // every 12 hours
        intervalMs = (7 * 24 * 60 * 60 * 1000) / (numPoints - 1);
        break;
      case '1M':
        startDate.setTime(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        numPoints = 31; // daily format
        intervalMs = (30 * 24 * 60 * 60 * 1000) / (numPoints - 1);
        break;
      case '6M':
        startDate.setTime(now.getTime() - 182 * 24 * 60 * 60 * 1000);
        numPoints = 26; // weekly blocks
        intervalMs = (182 * 24 * 60 * 60 * 1000) / (numPoints - 1);
        break;
      case 'YTD': {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        startDate = startOfYear;
        const diffMs = now.getTime() - startOfYear.getTime();
        numPoints = Math.max(12, Math.min(30, Math.floor(diffMs / (4 * 24 * 60 * 60 * 1000)))); // point every 4 days
        intervalMs = diffMs / (numPoints - 1);
        break;
      }
      case '1A':
        startDate.setTime(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        numPoints = 24; // bi-weekly representation
        intervalMs = (365 * 24 * 60 * 60 * 1000) / (numPoints - 1);
        break;
      case '2A':
        startDate.setTime(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
        numPoints = 24; // monthly blocks
        intervalMs = (2 * 365 * 24 * 60 * 60 * 1000) / (numPoints - 1);
        break;
      case '5A':
        startDate.setTime(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
        numPoints = 60; // monthly density
        intervalMs = (5 * 365 * 24 * 60 * 60 * 1000) / (numPoints - 1);
        break;
      case 'ALL':
      default:
        startDate = new Date(2021, 0, 1);
        const totalDiff = now.getTime() - startDate.getTime();
        numPoints = 65;
        intervalMs = totalDiff / (numPoints - 1);
        break;
    }

    // 1. Pre-calculate average buy prices for custom/unknown tickers
    const tickerAvgBuyPrices: Record<string, number> = {};
    const tickerTotalCost: Record<string, number> = {};
    const tickerTotalQty: Record<string, number> = {};

    activeTransactions.forEach(tx => {
      if (tx.type === 'ACQUISTO' || tx.type === 'DEPOSITO') {
        const ticker = tx.ticker.toUpperCase().trim();
        tickerTotalCost[ticker] = (tickerTotalCost[ticker] || 0) + (tx.quantity * tx.price);
        tickerTotalQty[ticker] = (tickerTotalQty[ticker] || 0) + tx.quantity;
      }
    });

    Object.keys(tickerTotalQty).forEach(ticker => {
      tickerAvgBuyPrices[ticker] = tickerTotalQty[ticker] > 0 
        ? tickerTotalCost[ticker] / tickerTotalQty[ticker] 
        : 0;
    });

    const result: HistoricalDataPoint[] = [];
    const absoluteStart5Years = new Date();
    absoluteStart5Years.setTime(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);

    // Prepare temporary raw timeframe details
    const rawPoints: Array<{
      dateLabel: string;
      targetDate: Date;
      t: number;
      sp500Value: number;
      msciValue: number;
      portfolioValue: number;
      hasActiveAssets: boolean;
    }> = [];

    for (let i = 0; i < numPoints; i++) {
      const targetDate = new Date(startDate.getTime() + i * intervalMs);
      
      let dateLabel = '';
      if (timeframe === '1G') {
        dateLabel = targetDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      } else if (timeframe === '3G' || timeframe === '1S') {
        dateLabel = targetDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) + ' ' + targetDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      } else if (timeframe === '1M' || timeframe === '6M' || timeframe === 'YTD') {
        dateLabel = targetDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
      } else {
        dateLabel = targetDate.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' });
      }

      // Progress 't' relative to 5 year range
      const t = Math.max(0, Math.min(1, (targetDate.getTime() - absoluteStart5Years.getTime()) / (now.getTime() - absoluteStart5Years.getTime())));

      // Realistic model index functions
      const sp500Value = 3800 + (1500 * t) + (Math.sin(t * 12) * 350) + (Math.cos(t * 4) * 150) + (t > 0.85 ? (t - 0.85) * 800 : 0);
      const msciValue = 2550 + (900 * t) + (Math.sin(t * 12) * 230) + (Math.cos(t * 4) * 90) + (t > 0.85 ? (t - 0.85) * 450 : 0);

      // Active transactions balance at target date
      let portfolioValue = 0;
      const assetsBalance: Record<string, { quantity: number; cost: number; type: string }> = {};

      activeTransactions.forEach(tx => {
        const txTime = new Date(tx.date).getTime();
        if (txTime <= targetDate.getTime()) {
          const ticker = tx.ticker.toUpperCase().trim();
          if (!assetsBalance[ticker]) {
            assetsBalance[ticker] = { quantity: 0, cost: 0, type: tx.assetType };
          }
          
          if (tx.type === 'ACQUISTO' || tx.type === 'DEPOSITO') {
            assetsBalance[ticker].quantity += tx.quantity;
            assetsBalance[ticker].cost += tx.quantity * tx.price;
          } else if (tx.type === 'VENDITA') {
            assetsBalance[ticker].quantity = Math.max(0, assetsBalance[ticker].quantity - tx.quantity);
          }
        }
      });

      let hasActiveAssets = false;

      Object.keys(assetsBalance).forEach(ticker => {
        const asset = assetsBalance[ticker];
        if (asset.quantity <= 0) return;
        hasActiveAssets = true;

        const currentRef = CURRENT_ASSET_PRICES[ticker];
        const currentPrice = currentRef ? currentRef.price : (tickerAvgBuyPrices[ticker] || 100);
        let simulatedAssetPrice = currentPrice;

        if (ticker === 'BTC') {
          const curve = 0.3 + (1.2 * Math.pow(t, 2.5)) + (Math.sin(t * 8) * 0.4) * (1 - t * 0.5);
          simulatedAssetPrice = currentPrice * Math.max(0.12, Math.min(1.2, curve));
        } else if (ticker === 'ETH') {
          const curve = 0.4 + (1.1 * Math.pow(t, 2.2)) + (Math.sin(t * 7) * 0.35);
          simulatedAssetPrice = currentPrice * Math.max(0.15, Math.min(1.15, curve));
        } else if (ticker === 'NVDA') {
          const curve = 0.04 + (0.96 * Math.pow(t, 5));
          simulatedAssetPrice = currentPrice * Math.max(0.03, Math.min(1.05, curve));
        } else if (ticker === 'AAPL') {
          const curve = 0.65 + (0.35 * t) + (Math.sin(t * 10) * 0.1);
          simulatedAssetPrice = currentPrice * Math.max(0.5, Math.min(1.1, curve));
        } else if (ticker === 'SWDA.MI' || ticker === 'US90.DE') {
          const curve = 0.7 + (0.3 * t) + (Math.sin(t * 4) * 0.05);
          simulatedAssetPrice = currentPrice * Math.max(0.6, Math.min(1.05, curve));
        } else {
          // Organic general asset tracker curve for custom stocks
          const curve = 0.75 + (0.25 * t) + (Math.sin(t * 6) * 0.04);
          simulatedAssetPrice = currentPrice * Math.max(0.65, Math.min(1.1, curve));
        }

        portfolioValue += asset.quantity * simulatedAssetPrice;
      });

      // Lock current values to the exact present moment balance on the last point
      if (i === numPoints - 1 && hasActiveAssets) {
        let finalPortfolioVal = 0;
        Object.keys(assetsBalance).forEach(ticker => {
          const asset = assetsBalance[ticker];
          if (asset.quantity <= 0) return;
          const currentRef = CURRENT_ASSET_PRICES[ticker];
          const currentPrice = currentRef ? currentRef.price : (tickerAvgBuyPrices[ticker] || 100);
          finalPortfolioVal += asset.quantity * currentPrice;
        });
        if (finalPortfolioVal > 0) {
          portfolioValue = finalPortfolioVal;
        }
      }

      rawPoints.push({
        dateLabel,
        targetDate,
        t,
        sp500Value,
        msciValue,
        portfolioValue,
        hasActiveAssets
      });
    }

    // 3. Resolve starting asset values smoothly back through history to keep portfolios continuous
    let firstActiveIdx = rawPoints.findIndex(pt => pt.hasActiveAssets);
    let firstActiveValue = 0;
    let firstActiveMsci = 1;

    if (firstActiveIdx !== -1) {
      firstActiveValue = rawPoints[firstActiveIdx].portfolioValue;
      firstActiveMsci = rawPoints[firstActiveIdx].msciValue;
    } else {
      // Graceful fallback for empty transactions list
      firstActiveIdx = 0;
      firstActiveValue = 0;
      firstActiveMsci = rawPoints[0].msciValue;
    }

    rawPoints.forEach((raw, idx) => {
      let finalValue = raw.portfolioValue;

      if (idx < firstActiveIdx) {
        const growthRatio = raw.msciValue / firstActiveMsci;
        finalValue = firstActiveValue * growthRatio;
      }

      // Add high-fidelity micro-scale fluctuations based on the zoom context
      const timestampSec = raw.targetDate.getTime() / 1000;
      let scale = 0.008; // default variation scale
      if (timeframe === '1G') scale = 0.005;
      else if (timeframe === '3G') scale = 0.008;
      else if (timeframe === '1S') scale = 0.012;
      else if (timeframe === '1M') scale = 0.015;
      else if (timeframe === '6M') scale = 0.022;
      else if (timeframe === 'YTD') scale = 0.028;
      else if (timeframe === '1A') scale = 0.032;
      else if (timeframe === '2A') scale = 0.042;
      else if (timeframe === '5A' || timeframe === 'ALL') scale = 0.052;

      // Unique non-aligned noise walks per curve
      const pNoise = (Math.sin(timestampSec / 12000) * 0.6 + Math.cos(timestampSec / 34000) * 0.4) * scale;
      const spNoise = (Math.sin(timestampSec / 15000) * 0.6 + Math.cos(timestampSec / 45000) * 0.4) * (scale * 0.85);
      const msciNoise = (Math.sin(timestampSec / 19000) * 0.6 + Math.cos(timestampSec / 38000) * 0.4) * (scale * 0.75);

      finalValue *= (1 + pNoise);

      // Sincronizziamo i benchmark in modo uniforme
      const startSp500 = rawPoints[0].sp500Value;
      const growthSp500 = raw.sp500Value / startSp500;
      const startMsci = rawPoints[0].msciValue;
      const growthMsci = raw.msciValue / startMsci;

      const initialPortfolioBase = firstActiveIdx === 0 
        ? firstActiveValue 
        : firstActiveValue * (rawPoints[0].msciValue / firstActiveMsci);
      const normalizedBase = Math.max(1000, initialPortfolioBase);

      const normalizedSp500 = normalizedBase * growthSp500 * (1 + spNoise);
      const normalizedMsci = normalizedBase * growthMsci * (1 + msciNoise);

      result.push({
        date: raw.dateLabel,
        portfolio: Math.round(finalValue),
        sp500: Math.round(normalizedSp500),
        msci: Math.round(normalizedMsci)
      });
    });
    
    if (result.length === 0) {
      return historicalData;
    }
    
    return result;
  }, [historicalData, transactions, timeframe]);

  // Dynamic returns calculations for the active period
  const statistics = useMemo(() => {
    if (filteredData.length < 2) return { portfolioGainPercent: 0, spGainPercent: 0, msciGainPercent: 0 };
    const startPoint = filteredData[0];
    const endPoint = filteredData[filteredData.length - 1];

    // Find first non-zero portfolio value to preserve percentage dynamics
    const firstNonNull = filteredData.find(pt => pt.portfolio > 0) || startPoint;
    const initialVal = firstNonNull.portfolio > 0 ? firstNonNull.portfolio : 1;

    const pGain = ((endPoint.portfolio - firstNonNull.portfolio) / initialVal) * 100;
    const spGain = ((endPoint.sp500 - startPoint.sp500) / (startPoint.sp500 || 1)) * 100;
    const msciGain = ((endPoint.msci - startPoint.msci) / (startPoint.msci || 1)) * 100;

    return {
      portfolioGainPercent: pGain,
      spGainPercent: spGain,
      msciGainPercent: msciGain,
    };
  }, [filteredData]);

  // Custom high-density Tooltip component in complete alignment with our dark UI design
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b1223]/95 border border-[#00c2ff]/30 p-4 rounded-xl shadow-2xl text-xs font-mono backdrop-blur-md">
          <p className="text-gray-400 font-extrabold mb-2 border-b border-[#1a2e4c] pb-1.5 uppercase text-[9px] tracking-widest flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-[#00c2ff]" />
            {label}
          </p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => {
              const isPortfolio = entry.name === "Portafoglio";
              return (
                <div key={index} className="flex justify-between gap-10 items-center">
                  <span className="flex items-center gap-2 text-gray-300">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-[11px] font-bold">{entry.name}:</span>
                  </span>
                  <span
                    className={`font-black tracking-tight text-[11.5px] ${
                      isPortfolio ? 'text-[#00c2ff]' : 'text-white'
                    }`}
                  >
                    €{entry.value.toLocaleString('it-IT')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const availableTimeframes: Timeframe[] = ['1G', '3G', '1S', '1M', '6M', 'YTD', '1A', '2A', '5A', 'ALL'];

  return (
    <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col justify-between relative overflow-hidden group/main">
      {/* Decorative neon linear top light */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00c2ff] to-transparent opacity-40 group-hover/main:opacity-85 transition duration-500" />
      
      {/* Chart Header Controls */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 border-b border-[#1a2332]/60 pb-4 mb-4 select-none">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00c2ff] animate-pulse shrink-0" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider text-[11px] font-mono">
              TREND RENDIMENTO & BENCHMARK COMPILATOR
            </h3>
            <div className="group relative">
              <Info className="h-3.5 w-3.5 text-gray-500 hover:text-gray-400 cursor-pointer" />
              <div className="absolute z-30 bottom-full mb-2 left-0 hidden group-hover:block bg-[#07090f] border border-[#1a2332] text-gray-400 p-2.5 text-[10px] rounded-lg w-56 leading-relaxed shadow-2xl">
                Rendimento cumulativo calcolato in tempo reale sull'intervallo temporale selezionato.
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Confronto storico con S&P 500 e MSCI World Index
          </p>
        </div>

        {/* Timeframe Toggles with Scrollbars Hidden and Wrap Prevention */}
        <div className="flex items-center bg-[#07090f] border border-[#1a2332] rounded-lg p-0.5 overflow-x-auto max-w-full scrollbar-none gap-0.5 self-start lg:self-center">
          {availableTimeframes.map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-mono font-black transition-all duration-200 uppercase tracking-widest relative cursor-pointer whitespace-nowrap ${
                timeframe === tf
                  ? 'bg-[#1a2a44] text-[#00c2ff] border border-[#00c2ff]/30 shadow-lg shadow-[#00c2ff]/10'
                  : 'text-gray-500 hover:text-white hover:bg-[#121f37]/30'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Interval Yield Indicators with sleek Motion enter animation */}
      <div className="relative mb-4">
        <AnimatePresence mode="wait">
          <motion.div 
            key={timeframe}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-3 gap-2 bg-[#07090f]/74 border border-[#1a2332]/40 rounded-lg p-3 text-[10px] font-mono relative overflow-hidden"
          >
            <div className="text-center border-r border-[#1a2332]/50">
              <span className="text-gray-500 block uppercase text-[8.5px] font-extrabold tracking-wider">RENDIMENTO REGISTRATO</span>
              <span className={`font-black block text-xs mt-1 tracking-tight flex items-center justify-center gap-1 ${statistics.portfolioGainPercent >= 0 ? "text-[#00e5a0]" : "text-[#ff3d6b]"}`}>
                {statistics.portfolioGainPercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {statistics.portfolioGainPercent >= 0 ? '+' : ''}{statistics.portfolioGainPercent.toFixed(2)}%
              </span>
            </div>
            <div className="text-center border-r border-[#1a2332]/50">
              <span className="text-gray-500 block uppercase text-[8.5px] font-extrabold tracking-wider">S&P 500 BENCHMARK</span>
              <span className={`font-black block text-xs mt-1 tracking-tight flex items-center justify-center gap-1 ${statistics.spGainPercent >= 0 ? "text-[#00e5a0]" : "text-[#ff3d6b]"}`}>
                {statistics.spGainPercent >= 0 ? <TrendingUp className="h-3 w-3 text-[8px]" /> : <TrendingDown className="h-3 w-3 text-[8px]" />}
                {statistics.spGainPercent >= 0 ? '+' : ''}{statistics.spGainPercent.toFixed(2)}%
              </span>
            </div>
            <div className="text-center">
              <span className="text-gray-500 block uppercase text-[8.5px] font-extrabold tracking-wider">MSCI WORLD INDEX</span>
              <span className={`font-black block text-xs mt-1 tracking-tight flex items-center justify-center gap-1 ${statistics.msciGainPercent >= 0 ? "text-[#00e5a0]" : "text-[#ff3d6b]"}`}>
                {statistics.msciGainPercent >= 0 ? <TrendingUp className="h-3 w-3 text-[8px]" /> : <TrendingDown className="h-3 w-3 text-[8px]" />}
                {statistics.msciGainPercent >= 0 ? '+' : ''}{statistics.msciGainPercent.toFixed(2)}%
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-72 min-w-0 relative">
        <AnimatePresence>
          {isCalculating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#111927]/80 backdrop-blur-md z-10 flex flex-col justify-center items-center rounded-xl pointer-events-none gap-2 select-none"
            >
              <div className="flex flex-col items-center gap-3 bg-[#070d19]/95 border border-[#00c2ff]/40 p-5 rounded-2xl shadow-3xl max-w-xs w-11/12">
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-[#00c2ff] animate-spin" />
                    <Sparkles className="h-2.5 w-2.5 text-violet-400 absolute animate-pulse" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-200 font-extrabold tracking-widest uppercase">
                    Neural Analytics
                  </span>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="w-full h-1.5 bg-[#121c2c] rounded-full overflow-hidden border border-[#1a2b44]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    className="h-full bg-gradient-to-r from-[#00c2ff] to-[#00e5a0]"
                  />
                </div>
                
                <div className="flex justify-between w-full text-[9px] font-mono text-gray-400 font-bold uppercase tracking-wider">
                  <span>Ricalcolo Curve...</span>
                  <span className="text-[#00c2ff]">{loadingProgress}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={timeframe}
          initial={{ opacity: 0, y: 12, scale: 0.985 }}
          animate={{ opacity: isCalculating ? 0.3 : 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full"
        >
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={20}>
              <ComposedChart
                data={filteredData}
                margin={{ top: 10, right: 5, left: -22, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradientPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00c2ff" stopOpacity={0.48} />
                    <stop offset="55%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.00} />
                  </linearGradient>

                  {/* High-voltage Horizontal Gradient for the line path */}
                  <linearGradient id="strokePortfolioGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00f2ff" />
                    <stop offset="40%" stopColor="#00c2ff" />
                    <stop offset="75%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>

                  {/* Standard neon glow filter */}
                  <filter id="neonGlow" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" opacity={0.3} />
                
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                  fontFamily="monospace"
                />
                
                <YAxis
                  stroke="#64748b"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="monospace"
                  tickFormatter={(value) => `€${value >= 1000 ? (value / 1000).toLocaleString('it-IT', { maximumFractionDigits: 0 }) + 'k' : value}`}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconSize={10}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingBottom: '10px' }}
                />

                {/* User Portfolio Area Chart with smooth Cyan gradient & Draw animations */}
                <Area
                  name="Portafoglio"
                  type="monotone"
                  dataKey="portfolio"
                  stroke="url(#strokePortfolioGradient)"
                  strokeWidth={3.8}
                  fillOpacity={1}
                  fill="url(#gradientPortfolio)"
                  color="#00c2ff"
                  animationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                  activeDot={{ r: 7, strokeWidth: 0, fill: '#00f2ff', style: { filter: 'drop-shadow(0 0 8px #00f2ff)' } }}
                  style={{ filter: 'drop-shadow(0px 0px 5px rgba(0, 194, 255, 0.45))' }}
                />

                {/* S&P 500 Index Line */}
                <Line
                  name="S&P 500 Real-Adj"
                  type="monotone"
                  dataKey="sp500"
                  stroke="#fbbf24"
                  strokeDasharray="4 4"
                  strokeWidth={1.8}
                  dot={false}
                  activeDot={false}
                  color="#fbbf24"
                  animationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                />

                {/* MSCI World Index Line */}
                <Line
                  name="MSCI World Real-Adj"
                  type="monotone"
                  dataKey="msci"
                  stroke="#a78bfa"
                  strokeDasharray="4 4"
                  strokeWidth={1.8}
                  dot={false}
                  activeDot={false}
                  color="#a78bfa"
                  animationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-mono">
              Inizializzazione del Canvas...
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
