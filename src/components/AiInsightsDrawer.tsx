import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Sparkles, TrendingUp, TrendingDown, Target, Building2, 
  AlertTriangle, Cpu, Loader2, Landmark, HelpCircle, Users, 
  Layers, ChevronRight, BarChart3, PieChart as PieIcon, LineChart as LineIcon,
  Maximize2, Minimize2, Check, ExternalLink, HelpCircle as HelpIcon, ArrowRight,
  Eye, EyeOff, ArrowLeft, RotateCw, Info, Calendar, Briefcase, Home, Shield, Tv,
  Crown, Newspaper, Flame, Terminal
} from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine
} from 'recharts';
import { initialNews } from '../data';

interface AiInsightsDrawerProps {
  ticker: string | null;
  onClose: () => void;
}

// Complex mock analytics generator designed to return hyper-realistic asset evaluations Matching the User's exact Dashboard expectations
const getHighPrecisionAssetAnalysis = (tickerSymbol: string) => {
  const symbol = (tickerSymbol || '').toUpperCase().trim();

  if (!symbol) {
    return {
      ticker: "---",
      name: "Seleziona un asset",
      exchange: "---",
      sector: "---",
      industry: "---",
      indices: [],
      exDividendDate: "---",
      paymentDate: "---",
      annualDividend: "0.00 USD",
      dividendYield: "0.00%",
      shareholdersYield: "0.00%",
      nextEarnings: "---",
      marketCap: "---",
      epsTTM: "0.00",
      peTTM: "0.00",
      lastClose: "1.00",
      currency: "USD",
      
      dcfValue: 0,
      peterLynchValue: 0,
      evaValue: 0,
      ddmValue: 0,
      averageFairValue: 0,
      altmanZScore: 0,

      financialHistory: [],
      altmanHistory: [],
      productRevenue: [],
      geographicRevenue: [],
      aiNarrative: "Nessun asset selezionato per l'analisi."
    };
  }

  // Baseline templates for major tickers to guarantee exact visual fit
  if (symbol.includes('NVDA') || symbol.includes('NVIDIA')) {
    return {
      ticker: "NVDA",
      name: "NVIDIA Corporation",
      exchange: "NASDAQ (Stati Uniti)",
      sector: "Tecnologia",
      industry: "Semiconduttori",
      indices: ["S&P 500", "Dow Jones Industrial Average", "NASDAQ 100", "SOXX Semiconductor"],
      exDividendDate: "11/03/2026",
      paymentDate: "27/03/2026",
      annualDividend: "0.04 USD",
      dividendYield: "0.02%",
      shareholdersYield: "1.18%",
      nextEarnings: "24/05/2026",
      marketCap: "2.43T USD",
      epsTTM: "3.42",
      peTTM: "34.12",
      lastClose: "124.50",
      currency: "USD",
      
      // Fair values corresponding to user's screenshot
      dcfValue: 145.20,
      peterLynchValue: 132.40,
      evaValue: 128.50,
      ddmValue: 112.00,
      averageFairValue: 129.53,
      altmanZScore: 52.85,

      // Historical financials (Double columns)
      financialHistory: [
        { year: '2020', sales: 10.9, netIncome: 2.8, cashFlow: 4.2, margin: 25.6, debt: 6.9, equity: 12.2, shares: 25.1 },
        { year: '2021', sales: 16.6, netIncome: 4.3, cashFlow: 5.6, margin: 26.2, debt: 7.2, equity: 16.8, shares: 24.9 },
        { year: '2022', sales: 26.9, netIncome: 9.7, cashFlow: 9.1, margin: 36.1, debt: 11.5, equity: 26.6, shares: 24.7 },
        { year: '2023', sales: 27.0, netIncome: 4.3, cashFlow: 5.1, margin: 16.1, debt: 12.0, equity: 22.1, shares: 24.6 },
        { year: '2024', sales: 60.9, netIncome: 29.7, cashFlow: 28.0, margin: 48.8, debt: 11.0, equity: 42.9, shares: 24.4 },
        { year: '2025', sales: 96.3, netIncome: 53.0, cashFlow: 46.8, margin: 55.0, debt: 10.5, equity: 71.0, shares: 24.1 },
        { year: '2026', sales: 120.4, netIncome: 68.2, cashFlow: 58.1, margin: 56.6, debt: 9.8, equity: 94.5, shares: 24.0 },
        { year: 'TTM', sales: 135.2, netIncome: 78.4, cashFlow: 65.2, margin: 58.0, debt: 9.2, equity: 112.4, shares: 23.9 },
      ],

      altmanHistory: [
        { year: '2019', score: 18.5 },
        { year: '2020', score: 19.8 },
        { year: '2021', score: 22.4 },
        { year: '2022', score: 24.1 },
        { year: '2023', score: 20.8 },
        { year: '2024', score: 38.2 },
        { year: '2025', score: 48.5 },
        { year: '2026', score: 51.2 },
        { year: 'TTM', score: 52.85 },
      ],

      productRevenue: [
        { name: 'Data Center AI', value: 87.2, percentage: 72 },
        { name: 'Gaming (GeForce)', value: 24.1, percentage: 18 },
        { name: 'Prototypes & Robotics', value: 6.5, percentage: 5 },
        { name: 'Automotive AI', value: 4.8, percentage: 3 },
        { name: 'Professional Viz', value: 2.8, percentage: 2 },
      ],

      geographicRevenue: [
        { name: 'Stati Uniti', value: 45 },
        { name: 'Cina', value: 22 },
        { name: 'Asia Pacifico', value: 18 },
        { name: 'Europa / MEA', value: 15 },
      ],
      aiNarrative: "NVIDIA opera con un imponente monopolio nel mercato degli acceleratori hardware e delle suite software CUDA. La focalizzazione globale sui modelli LLM generativi e sul supercalcolo estende barriere all'entrata inarrivabili per concorrenti come AMD ed Intel."
    };
  }

  if (symbol.includes('LVMH') || symbol.includes('MC.PA')) {
    return {
      ticker: "MC.PA",
      name: "LVMH Moët Hennessy Louis Vuitton",
      exchange: "Euronext Paris (Francia)",
      sector: "Beni di Lusso",
      industry: "Moda, Pelletteria e Champagne",
      indices: ["CAC 40", "Euro Stoxx 50", "Euronext 100", "S&P Global Luxury"],
      exDividendDate: "18/04/2026",
      paymentDate: "25/04/2026",
      annualDividend: "13.00 EUR",
      dividendYield: "1.65%",
      shareholdersYield: "2.10%",
      nextEarnings: "12/07/2026",
      marketCap: "392.5B EUR",
      epsTTM: "30.40",
      peTTM: "25.80",
      lastClose: "785.40",
      currency: "EUR",
      
      dcfValue: 920.50,
      peterLynchValue: 840.00,
      evaValue: 790.30,
      ddmValue: 720.10,
      averageFairValue: 817.70,
      altmanZScore: 12.45,

      financialHistory: [
        { year: '2020', sales: 44.6, netIncome: 4.7, cashFlow: 6.1, margin: 10.5, debt: 24.0, equity: 38.8, shares: 1.0 },
        { year: '2021', sales: 64.2, netIncome: 12.0, cashFlow: 13.5, margin: 18.7, debt: 22.1, equity: 48.9, shares: 1.0 },
        { year: '2022', sales: 79.2, netIncome: 14.1, cashFlow: 15.6, margin: 17.8, debt: 20.4, equity: 56.5, shares: 0.99 },
        { year: '2023', sales: 86.2, netIncome: 15.2, cashFlow: 16.8, margin: 17.6, debt: 21.0, equity: 62.7, shares: 0.99 },
        { year: '2024', sales: 90.1, netIncome: 15.8, cashFlow: 17.4, margin: 17.5, debt: 19.8, equity: 68.2, shares: 0.98 },
        { year: '2025', sales: 94.5, netIncome: 16.5, cashFlow: 18.2, margin: 17.4, debt: 18.5, equity: 74.5, shares: 0.98 },
        { year: '2026', sales: 102.1, netIncome: 18.1, cashFlow: 19.8, margin: 17.7, debt: 17.2, equity: 82.1, shares: 0.97 },
        { year: 'TTM', sales: 105.8, netIncome: 19.0, cashFlow: 20.4, margin: 17.9, debt: 16.5, equity: 86.0, shares: 0.97 },
      ],

      altmanHistory: [
        { year: '2019', score: 8.4 },
        { year: '2020', score: 7.9 },
        { year: '2021', score: 10.2 },
        { year: '2022', score: 11.5 },
        { year: '2023', score: 11.0 },
        { year: '2024', score: 11.8 },
        { year: '2025', score: 12.1 },
        { year: '2026', score: 12.3 },
        { year: 'TTM', score: 12.45 },
      ],

      productRevenue: [
        { name: 'Moda e Pelletteria (Vuitton, Dior)', value: 48.5, percentage: 46 },
        { name: 'Orologi e Gioielli (Tiffany, Bulgari)', value: 16.8, percentage: 16 },
        { name: 'Profumi e Cosmetici', value: 12.6, percentage: 12 },
        { name: 'Vini e Liquori (Moët, Dom Pérignon)', value: 10.5, percentage: 10 },
        { name: 'Selettiva (Sephora)', value: 17.4, percentage: 16 },
      ],

      geographicRevenue: [
        { name: 'Asia (Giappone escl.)', value: 38 },
        { name: 'Stati Uniti', value: 24 },
        { name: 'Europa', value: 22 },
        { name: 'Giappone / Altri', value: 16 },
      ],
      aiNarrative: "LVMH possiede una combinazione formidabile di marchi iconici ereditari operanti con eccezionale potere di determinazione dei prezzi (pricing power). Il margine lordo si attesta sopra l'80% configurando un fossato solido che respinge minacce competitive nel settore lusso."
    };
  }

  // High quality generic simulation for other inputs
  const seedNum = symbol.charCodeAt(0) + (symbol.charCodeAt(1) || 65);
  const priceVal = (seedNum * 1.8) + 30;
  const dcfVal = priceVal * 1.25;
  const plVal = priceVal * 1.1;
  const evaVal = priceVal * 1.05;
  const ddmVal = priceVal * 0.9;
  const avgFV = (dcfVal + plVal + evaVal + ddmVal) / 4;

  return {
    ticker: symbol,
    name: `${symbol.charAt(0) + symbol.slice(1).toLowerCase()} Corp. Holdings`,
    exchange: symbol.includes('.') ? "Mercato Regionale Europeo" : "NYSE / NASDAQ (Stati Uniti)",
    sector: "Investimenti Diversificati",
    industry: "Management & Finanza Integrata",
    indices: ["S&P Composite Group", "Global Equity Indexes"],
    exDividendDate: "12/03/2026",
    paymentDate: "05/04/2026",
    annualDividend: "1.24 USD",
    dividendYield: "1.45%",
    shareholdersYield: "1.80%",
    nextEarnings: "15/06/2026",
    marketCap: "52.4B USD",
    epsTTM: (priceVal / 18).toFixed(2),
    peTTM: "18.40",
    lastClose: priceVal.toFixed(2),
    currency: symbol.includes('.') ? "EUR" : "USD",
    
    dcfValue: parseFloat(dcfVal.toFixed(2)),
    peterLynchValue: parseFloat(plVal.toFixed(2)),
    evaValue: parseFloat(evaVal.toFixed(2)),
    ddmValue: parseFloat(ddmVal.toFixed(2)),
    averageFairValue: parseFloat(avgFV.toFixed(2)),
    altmanZScore: 5.82,

    financialHistory: [
      { year: '2020', sales: 12.0, netIncome: 1.1, cashFlow: 1.5, margin: 9.1, debt: 5.2, equity: 18.0, shares: 12.0 },
      { year: '2021', sales: 14.5, netIncome: 1.4, cashFlow: 1.8, margin: 9.6, debt: 4.8, equity: 20.4, shares: 11.9 },
      { year: '2022', sales: 18.2, netIncome: 2.1, cashFlow: 2.5, margin: 11.5, debt: 5.1, equity: 22.8, shares: 11.8 },
      { year: '2023', sales: 17.8, netIncome: 1.8, cashFlow: 2.1, margin: 10.1, debt: 5.5, equity: 21.0, shares: 11.7 },
      { year: '2024', sales: 22.4, netIncome: 2.8, cashFlow: 3.1, margin: 12.5, debt: 4.9, equity: 25.1, shares: 11.5 },
      { year: '2025', sales: 26.8, netIncome: 3.4, cashFlow: 3.9, margin: 12.6, debt: 4.5, equity: 29.8, shares: 11.4 },
      { year: '2026', sales: 31.2, netIncome: 4.2, cashFlow: 4.6, margin: 13.4, debt: 4.1, equity: 35.5, shares: 11.2 },
      { year: 'TTM', sales: 34.1, netIncome: 4.8, cashFlow: 5.2, margin: 14.0, debt: 3.8, equity: 39.0, shares: 11.0 },
    ],

    altmanHistory: [
      { year: '2019', score: 3.8 },
      { year: '2020', score: 4.1 },
      { year: '2021', score: 4.4 },
      { year: '2022', score: 4.8 },
      { year: '2023', score: 4.5 },
      { year: '2024', score: 5.1 },
      { year: '2025', score: 5.4 },
      { year: '2026', score: 5.7 },
      { year: 'TTM', score: 5.82 },
    ],

    productRevenue: [
      { name: 'Divisione Retail', value: 15.2, percentage: 44 },
      { name: 'Servizi B2B Cloud', value: 10.3, percentage: 30 },
      { name: 'Licenze e Software IP', value: 5.8, percentage: 17 },
      { name: 'Consulenza Direzionale', value: 3.1, percentage: 9 },
    ],

    geographicRevenue: [
      { name: 'Europa', value: 40 },
      { name: 'Stati Uniti', value: 35 },
      { name: 'Asia Pacifico', value: 15 },
      { name: 'Sud America', value: 10 },
    ],
    aiNarrative: `${symbol} mostra solidità operativa e crescita progressiva dei flussi di cassa operativi. La posizione debitoria equilibrata favorisce investimenti strutturati in mercati emergenti con ritorni incrementali soddisfacenti.`
  };
};

// Helper to get deterministic seed from ticker symbol
const getTickerSeed = (ticker: string): number => {
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) {
    hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Seeded deterministic seasonality data generator showing monthly returns over years
const generateSeasonalityData = (symbol: string) => {
  const seed = getTickerSeed(symbol);
  const currentYear = 2026;
  const startYear = 2018;
  const years = [];
  
  const monthsAbbr = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  
  const symbolUpper = symbol.toUpperCase();
  // Classic baseline monthly returns for standard assets: strong Q4, weak September, etc.
  let defaultBiases = [1.5, 0.9, -0.4, 2.8, -0.8, 0.7, 1.9, -1.5, -2.8, 2.2, 4.1, 3.2];
  
  if (symbolUpper.includes('NVDA')) {
    defaultBiases = [5.1, 3.8, 2.2, 5.8, -1.2, 6.9, 3.8, 1.3, -4.6, 5.2, 8.8, 6.4];
  } else if (symbolUpper.includes('BTC') || symbolUpper.includes('ETH')) {
    defaultBiases = [7.2, 13.1, 2.8, 8.9, -4.5, -2.5, 3.5, -7.1, -8.8, 15.2, 11.8, 5.3];
  } else if (symbolUpper.includes('AAPL')) {
    defaultBiases = [0.9, -1.4, 1.8, 3.1, -0.3, 2.1, 3.5, 2.0, -2.4, 1.8, 4.5, 2.3];
  } else {
    // Deterministic organic monthly bias based on ticker seed
    defaultBiases = Array.from({ length: 12 }, (_, idx) => {
      const sinVal = Math.sin(seed + idx * 1.8);
      // Average return between -4% and +4.5%
      return Math.round((sinVal * 4.25 + 0.5) * 10) / 10;
    });
  }

  for (let yr = currentYear; yr >= startYear; yr--) {
    const monthlyPerformance: Record<string, number | null> = {};
    monthsAbbr.forEach((m, mIdx) => {
      // In simulated 21 May 2026, we don't have simulated data for June onwards in 2026
      if (yr === 2026 && mIdx >= 5) {
        monthlyPerformance[m] = null;
        return;
      }

      // Add year specific noise and wave cyclic adjustments
      const yrNoise = Math.sin(yr * 13.17 + mIdx * 2.7 + seed * 0.5) * 6.2;
      const trendAdjust = (yr - 2021) * 0.45;
      let perf = defaultBiases[mIdx] + yrNoise + trendAdjust;
      
      if (symbolUpper.includes('BTC') || symbolUpper.includes('ETH')) {
        perf = Math.max(-48, Math.min(92, perf));
      } else {
        perf = Math.max(-28, Math.min(38, perf));
      }

      monthlyPerformance[m] = Math.round(perf * 10) / 10;
    });

    years.push({
      year: yr,
      performances: monthlyPerformance
    });
  }

  return years;
};

// Seeded deterministic price curves generator for any ticker & timeframe
const generatePriceDataForOverview = (symbol: string, timeframe: string, currentPrice: number) => {
  const seed = getTickerSeed(symbol);
  let pointsCount = 30;
  let daysOffset = 1;
  const now = new Date(2026, 4, 21); // Simulated 21 May 2026

  switch (timeframe) {
    case '1M':
      pointsCount = 30;
      daysOffset = 1;
      break;
    case '3M':
      pointsCount = 45;
      daysOffset = 2;
      break;
    case '6M':
      pointsCount = 60;
      daysOffset = 3;
      break;
    case 'YTD':
      pointsCount = 40;
      daysOffset = 3.5;
      break;
    case '1A':
      pointsCount = 52;
      daysOffset = 7;
      break;
    case '3A':
      pointsCount = 75;
      daysOffset = 14;
      break;
    case '5A':
      pointsCount = 100;
      daysOffset = 18;
      break;
    case '10A':
      pointsCount = 120;
      daysOffset = 30;
      break;
    case 'ALL':
      pointsCount = 150;
      daysOffset = 40;
      break;
  }

  const result = [];
  const uppercaseTicker = symbol.toUpperCase();
  let growthTrend = 0.0003;
  let volatility = 0.012;

  if (uppercaseTicker.includes('NVDA')) {
    growthTrend = (timeframe.endsWith('A') || timeframe === 'ALL') ? 0.0035 : 0.0015;
    volatility = 0.022;
  } else if (uppercaseTicker.includes('AAPL')) {
    growthTrend = 0.00045;
    volatility = 0.009;
  } else if (uppercaseTicker.includes('BTC')) {
    growthTrend = 0.0012;
    volatility = 0.035;
  } else if (uppercaseTicker.includes('ETH')) {
    growthTrend = 0.001;
    volatility = 0.038;
  } else if (uppercaseTicker.includes('MC.PA') || uppercaseTicker.includes('LVMH')) {
    growthTrend = 0.0004;
    volatility = 0.008;
  } else {
    // Generate organic relative trends based on ticker seed
    growthTrend = ((seed % 10) - 3) * 0.00015;
    volatility = 0.008 + ((seed % 12) * 0.0015);
  }

  let decayFactor = 0.0003;
  if (uppercaseTicker.includes('NVDA')) {
    decayFactor = 0.0016;
  } else if (uppercaseTicker.includes('AAPL')) {
    decayFactor = 0.0004;
  } else if (uppercaseTicker.includes('BTC')) {
    decayFactor = 0.0011;
  } else if (uppercaseTicker.includes('ETH')) {
    decayFactor = 0.0009;
  } else if (uppercaseTicker.includes('MC.PA') || uppercaseTicker.includes('LVMH')) {
    decayFactor = 0.0003;
  } else {
    decayFactor = 0.0002 + ((seed % 5) * 0.0001);
  }

  const tempPoints = [];

  for (let i = 0; i < pointsCount; i++) {
    const d = new Date(now.getTime());
    const daysAgo = Math.round(i * daysOffset);
    d.setDate(now.getDate() - daysAgo);
    
    let dateStr = "";
    if (timeframe === '1M' || timeframe === '3M') {
      dateStr = d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    } else if (timeframe === '6M' || timeframe === 'YTD' || timeframe === '1A') {
      dateStr = d.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' });
    } else {
      dateStr = d.toLocaleDateString('it-IT', { year: 'numeric' });
    }

    let basePrice = currentPrice * Math.pow(1 - decayFactor, daysAgo);
    
    // Split-adjusted historical floors to provide premium professional-grade realism
    let floor = 0.20;
    if (uppercaseTicker.includes('NVDA')) {
      const yearsAgo = daysAgo / 365;
      if (yearsAgo <= 1.2) {
        floor = 80.0;
      } else if (yearsAgo <= 2.2) {
        floor = 42.0;
      } else if (yearsAgo <= 3.2) {
        floor = 20.0;
      } else if (yearsAgo <= 5.2) {
        floor = 11.5;
      } else if (yearsAgo <= 10.2) {
        floor = 1.1;
      } else {
        floor = 0.15;
      }
    } else if (uppercaseTicker.includes('AAPL')) {
      const yearsAgo = daysAgo / 365;
      if (yearsAgo <= 1.2) {
        floor = 145.0;
      } else if (yearsAgo <= 3.2) {
        floor = 105.0;
      } else if (yearsAgo <= 5.2) {
        floor = 60.0;
      } else {
        floor = 8.0;
      }
    } else if (uppercaseTicker.includes('BTC')) {
      const yearsAgo = daysAgo / 365;
      if (yearsAgo <= 1.2) {
        floor = 42000.0;
      } else if (yearsAgo <= 3.2) {
        floor = 18000.0;
      } else if (yearsAgo <= 5.2) {
        floor = 6500.0;
      } else {
        floor = 250.0;
      }
    }

    if (basePrice < floor) {
      basePrice = floor;
    }

    const waveValue = Math.sin((seed + i) * 0.3) * volatility;
    const seedRandom = Math.sin(seed * (i + 1) * 23.111) * 0.5;
    const organicNoise = seedRandom * volatility;
    
    let finalPrice = basePrice * (1 + waveValue + organicNoise);
    if (finalPrice < floor) {
      finalPrice = floor;
    }

    tempPoints.push({
      date: dateStr,
      timestamp: d.getTime(),
      price: Math.round(finalPrice * 100) / 100
    });
  }

  const sortedPoints = tempPoints.reverse();
  if (sortedPoints.length > 0) {
    sortedPoints[sortedPoints.length - 1].price = currentPrice;
  }

  return sortedPoints.map(p => ({
    date: p.date,
    timestamp: p.timestamp,
    price: Math.round(p.price * 100) / 100
  }));
};

// Dynamically breakdown annual results into quarterly representations with slight seasonal variations
const getQuarterlyHistory = (annualHistory: any[]) => {
  if (!annualHistory || annualHistory.length === 0) return [];
  const actuals = annualHistory.filter(h => h.year !== 'TTM');
  const lastThree = actuals.slice(-3); // e.g. last 3 active years
  
  const quarters: any[] = [];
  lastThree.forEach((h) => {
    const yearNum = parseInt(h.year) || 2025;
    const qShares = h.shares || 1.0;
    const qDebt = h.debt || 0;
    const qEquity = h.equity || 0;

    // Split year into Q1, Q2, Q3, Q4 with slightly different weights (seasonality!)
    const weights = [0.22, 0.24, 0.26, 0.28];
    for (let q = 1; q <= 4; q++) {
      const w = weights[q - 1];
      const qSales = h.sales * w;
      const qNetIncome = h.netIncome * w;
      const qCashFlow = h.cashFlow * w;
      const qMargin = qSales > 0 ? (qNetIncome / qSales) * 100 : h.margin;
      
      quarters.push({
        year: `Q${q} ${yearNum}`,
        sales: Number(qSales.toFixed(2)),
        netIncome: Number(qNetIncome.toFixed(2)),
        cashFlow: Number(qCashFlow.toFixed(2)),
        margin: Number(qMargin.toFixed(1)),
        debt: Number(qDebt.toFixed(2)),
        equity: Number(qEquity.toFixed(2)),
        shares: Number(qShares.toFixed(2))
      });
    }
  });
  return quarters;
};

// Data validation layer for identifying outdated, inconsistent or anomalous financial disclosures
const performFinancialAudits = (history: any[], isQuarterMode: boolean) => {
  const issues: Array<{
    id: string;
    period?: string;
    field?: string;
    severity: 'warning' | 'info';
    message: string;
    details: string;
  }> = [];

  if (!history || history.length === 0) return issues;

  // Rule 1: Outdated Data Check
  const actualYears = history.map(h => {
    const yrStr = h.year.replace(/^[Q1-4 ]+/, '');
    return parseInt(yrStr) || 2020;
  });
  const maxYear = Math.max(...actualYears, 2020);
  
  if (maxYear < 2026) {
    issues.push({
      id: 'outdated_dataset',
      severity: 'warning',
      field: 'sales',
      message: `Rendiconto Incompleto (Pre-2026)`,
      details: `I dati societari si arrestano all'anno fiscale ${maxYear}. I rendiconti finanziari per l'anno corrente 2026 non sono ancora completamente consolidati o fusi nel database principale.`
    });
  }

  // Row-by-row checks
  history.forEach((pt, index) => {
    const periodName = pt.year;

    // Rule 2: Profit Margin Inconsistency
    const expectedMargin = pt.sales > 0 ? (pt.netIncome / pt.sales) * 100 : 0;
    if (pt.netIncome > pt.sales && pt.sales > 0) {
      issues.push({
        id: `net_exceeds_sales_${periodName}`,
        period: periodName,
        field: 'netIncome',
        severity: 'warning',
        message: 'Utile superiore al fatturato',
        details: `Nel periodo ${periodName}, l'Utile Netto (${pt.netIncome}B) supera i Ricavi Totali (${pt.sales}B). Questa anomalia suggerisce o svalutazioni fiscali attive eccezionali o proventi non-operativi straordinari fuori bilancio.`
      });
    }

    const marginDiff = Math.abs(pt.margin - expectedMargin);
    if (pt.sales > 0 && marginDiff > 2.5) {
      issues.push({
        id: `margin_inconsistency_${periodName}`,
        period: periodName,
        field: 'netIncome',
        severity: 'warning',
        message: 'Scostamento Margine Netto',
        details: `Il margine netto dichiarato (${pt.margin.toFixed(1)}%) devia del ${marginDiff.toFixed(1)}% rispetto al valore calcolato sui flussi ricavi/utile (Valore teorico atteso: ${expectedMargin.toFixed(1)}%).`
      });
    }

    // Rule 3: Extreme growth outliers
    if (index > 0) {
      const prev = history[index - 1];
      if (prev.sales > 0) {
        const salesGrowth = ((pt.sales - prev.sales) / prev.sales) * 100;
        const limit = isQuarterMode ? 170 : 100;
        if (Math.abs(salesGrowth) > limit) {
          issues.push({
            id: `extreme_growth_${periodName}`,
            period: periodName,
            field: 'sales',
            severity: 'info',
            message: `Variazione di fatturato anomala (${salesGrowth > 0 ? '+' : ''}${Math.round(salesGrowth)}%)`,
            details: `I ricavi denotano una variazione pari al ${Math.round(salesGrowth)}% rispetto al periodo precedente (${prev.year}). Possibile impatto da fusioni straordinarie (M&A) o rettifiche contabili periodiche.`
          });
        }
      }

      if (prev.netIncome > 0) {
        const incomeGrowth = ((pt.netIncome - prev.netIncome) / prev.netIncome) * 100;
        const limit = isQuarterMode ? 220 : 120;
        if (Math.abs(incomeGrowth) > limit) {
          issues.push({
            id: `extreme_income_growth_${periodName}`,
            period: periodName,
            field: 'netIncome',
            severity: 'info',
            message: `Oscillazione utile straordinaria (${incomeGrowth > 0 ? '+' : ''}${Math.round(incomeGrowth)}%)`,
            details: `L'utile netto oscilla in misura straordinaria (${Math.round(incomeGrowth)}%) rispetto al periodo precedente (${prev.year}), indicando potenziali rettifiche straordinarie o proventi transitori.`
          });
        }
      }

      // Rule 3.5: Shares Outstanding Dilution Inconsistency
      if (prev.shares > 0) {
        const shareGrowth = ((pt.shares - prev.shares) / prev.shares) * 100;
        if (shareGrowth > 10.0) {
          issues.push({
            id: `share_dilution_${periodName}`,
            period: periodName,
            field: 'shares',
            severity: 'warning',
            message: `Diluizione azionaria elevata (+${shareGrowth.toFixed(1)}%)`,
            details: `Le azioni in circolazione sono aumentate del ${shareGrowth.toFixed(1)}% in un singolo periodo. Questo rallenta la crescita dell'EPS e diluisce l'equity del piccolo azionista senza corrispondenti apporti di cassa visibili.`
          });
        }
      }
    }

    // Rule 4: Heavy Free Cash Flow divergence
    if (pt.netIncome > 2.0 && pt.cashFlow < pt.netIncome * 0.15) {
      issues.push({
        id: `fcf_divergence_${periodName}`,
        period: periodName,
        field: 'cashFlow',
        severity: 'warning',
        message: 'Divergenza tra Utile e FCF',
        details: `Nel periodo ${periodName}, a fronte di un Utile Netto importante pari a ${pt.netIncome}B, il Free Cash Flow si attesta a soli ${pt.cashFlow}B (meno del 15%). Possibili problemi di incasso crediti o accumulo anomalo a magazzino.`
      });
    }

    // Rule 4.5: Outflow/Negative Cash Flow Warning
    if (pt.cashFlow < 0 && pt.netIncome > 0.1) {
      issues.push({
        id: `negative_fcf_earnings_${periodName}`,
        period: periodName,
        field: 'cashFlow',
        severity: 'warning',
        message: 'Flusso di Cassa Negativo con Utile di Bilancio',
        details: `Discrepanza di bilancio: la società registra utili cartolari ma brucia liquidità operativa (${pt.cashFlow}B FCF). Questo divario temporale svela problemi di ritardo nei pagamenti dai clienti (DSO elevati) o rimesse CapEx imponenti.`
      });
    }

    // Rule 5: Insolvency Risk (High Debito / Patrimonio)
    if (pt.equity > 0) {
      const debtToEquity = pt.debt / pt.equity;
      if (debtToEquity > 3.0) {
        issues.push({
          id: `high_debt_equity_${periodName}`,
          period: periodName,
          field: 'debt',
          severity: 'warning',
          message: 'Leva Finanziaria Elevata',
          details: `Il rapporto Debito su Patrimonio Netto si attesta a ${debtToEquity.toFixed(2)}x, superando la soglia prudenziale di 3.0x. Questo espone la società a tensioni finanziarie in contesti di tassi crescenti.`
        });
      }
    }

    // Rule 5.5: Negative Shareholders Equity Checklist
    if (pt.equity <= 0) {
      issues.push({
        id: `negative_equity_warning_${periodName}`,
        period: periodName,
        field: 'equity',
        severity: 'warning',
        message: 'Patrimonio Netto Negativo o Azzerato',
        details: `Insolvenza patrimoniale tecnica nel periodo ${periodName}: i debiti cumulati superano il valore degli asset societari liquidabili. La società opera sotto stress finanziario con leva illimitata.`
      });
    }

    // Rule 6: Double-entry Balance Sheet Equation Mismatch Audit
    // Total Assets = Total Liabilities + Equity
    // In our model structure:
    // Theoretical Assets = Active Correnti + Attivo Fisso = 0.6 * equity + 1.2 * equity = 1.8 * equity
    // Theoretical Liabilities + Equity = Debt + Equity
    // Let's check if the ratio 1.8 * equity is balanced with (debt + equity).
    // If debt is very high or equity changes abnormally, there could be a discrepancy.
    const theoreticalAssets = 1.8 * Math.abs(pt.equity);
    const theoreticalClaims = Math.abs(pt.debt) + Math.abs(pt.equity);
    const auditGap = Math.abs(theoreticalAssets - theoreticalClaims);
    const auditThreshold = theoreticalClaims * 0.18; // 18% tolerance check
    
    if (auditGap > auditThreshold && pt.equity > 0.05 && pt.debt > 0.05) {
      issues.push({
        id: `balance_sheet_mismatch_${periodName}`,
        period: periodName,
        field: 'equity',
        severity: 'info',
        message: 'Mancato pareggio di sbilancio contabile',
        details: `Le attività calcolate (${theoreticalAssets.toFixed(1)}B) divergono dalle passività e patrimonio unificati (${theoreticalClaims.toFixed(1)}B). Questa asimmetria riflette discrepanze di arrotondamento e svalutazioni fiscali non aggregate.`
      });
    }
  });

  return issues;
};

// --- QUANTITATIVE ALGORITHMS FOR DPO & WYCKOFF DETECTOR ---

interface PriceDataPoint {
  price: number;
  volume?: number;
  [key: string]: any;
}

/**
 * DETRENDED PRICE OSCILLATOR (DPO)
 * Rimuove i trend a lungo termine per identificare cicli e condizioni di ipercomprato/ipervenduto.
 * Formula: DPO = Prezzo(t) - SMA(n) impostata a (n / 2 + 1) periodi indietro.
 * Ovvero, DPO(t) = Price(t) - SMA_n(t - shift) dove shift = n / 2 + 1.
 */
export function calculateDPO(data: PriceDataPoint[], period: number = 20): (PriceDataPoint & { dpo: number })[] {
  const shift = Math.floor(period / 2) + 1;
  return data.map((item, i) => {
    const smaIndex = i - shift;
    let dpoValue = 0;
    
    // Calcoliamo la Media Mobile Semplice (SMA) a 'n' periodi terminante all'indice 'smaIndex'
    if (smaIndex >= period - 1 && smaIndex < data.length) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[smaIndex - j].price;
      }
      const sma = sum / period;
      dpoValue = item.price - sma;
    }
    
    return {
      ...item,
      dpo: Math.round(dpoValue * 100) / 100
    };
  });
}

/**
 * WYCKOFF PHASE DETECTOR (QUANTITATIVE METHOD)
 * Classifica lo stato di mercato in Accumulazione, Markup, Distribuzione o Markdown
 * basandosi su SMA veloce, SMA lenta, Slope (linea di regressione) e Volatilità (Deviazione Standard).
 */
export function detectWyckoffPhase(data: PriceDataPoint[]): {
  currentPhase: "Accumulazione" | "Markup" | "Distribuzione" | "Markdown";
  confidence: string;
  signal: "BUY" | "HOLD" | "SELL";
  details: string;
} {
  const len = data.length;
  if (len < 10) {
    return {
      currentPhase: "Accumulazione",
      confidence: "55%",
      signal: "HOLD",
      details: "Dati storici insufficienti per l'analisi quantitativa Wyckoff."
    };
  }

  // Definiamo i periodi per le medie mobili adattivi rispetto alla lunghezza dell'array
  const pShort = Math.min(20, Math.floor(len / 4)) || 5;
  const pLong = Math.min(50, Math.floor(len / 2)) || 10;

  // Calcolo della SMA
  const getSMA = (index: number, period: number): number => {
    if (index < period - 1) return data[index].price;
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[index - j].price;
    }
    return sum / period;
  };

  // Regressione lineare per calcolare la pendenza (Slope)
  const getSlope = (prices: number[]): number => {
    const n = prices.length;
    if (n < 2) return 0;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += prices[i];
      sumXY += i * prices[i];
      sumXX += i * i;
    }
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  };

  // Deviazione Standard per la volatilità
  const getStdDev = (prices: number[]): number => {
    const n = prices.length;
    if (n === 0) return 0;
    const mean = prices.reduce((a, b) => a + b, 0) / n;
    const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    return Math.sqrt(variance);
  };

  // Calcoliamo le SMA correnti per gli ultimi punti
  const currentPrice = data[len - 1].price;
  const smaShortCurr = getSMA(len - 1, pShort);
  const smaLongCurr = getSMA(len - 1, pLong);

  // Consideriamo una finestra recente di candele per la deviazione standard e range
  const recentWindow = Math.min(15, len);
  const recentSlice = data.slice(-recentWindow);
  const recentPrices = recentSlice.map(p => p.price);
  const stdDev = getStdDev(recentPrices);
  const avgPrice = recentPrices.reduce((a, b) => a + b, 0) / recentWindow;
  const relativeStdDev = (stdDev / avgPrice) * 100; // in percentuale %

  // Pendenza della SMA corta negli ultimi 5 periodi
  const lastSMAValues: number[] = [];
  for (let i = len - Math.min(5, len); i < len; i++) {
    lastSMAValues.push(getSMA(i, pShort));
  }
  const smaSlope = getSlope(lastSMAValues);

  // Range di oscillazione complessivo
  const allPrices = data.map(p => p.price);
  const maxPrice = Math.max(...allPrices);
  const minPrice = Math.min(...allPrices);
  const priceRange = maxPrice - minPrice || 1.0;
  const positionPercent = (currentPrice - minPrice) / priceRange;

  // Analisi dei volumi
  const recentVolumes = recentSlice.map(p => p.volume || 1000);
  const avgVolume = recentVolumes.reduce((a, b) => a + b, 0) / recentWindow;
  const lastVolume = recentVolumes[recentVolumes.length - 1];
  const isAbnormalVolume = lastVolume > avgVolume * 1.35;

  let currentPhase: "Accumulazione" | "Markup" | "Distribuzione" | "Markdown" = "Accumulazione";
  let confidenceVal = 70;
  let signal: "BUY" | "HOLD" | "SELL" = "HOLD";
  let details = "";

  // 1. MARKUP: Prezzo sopra SMA corta, SMA corta > SMA lunga, pendenza positiva
  if (currentPrice > smaShortCurr && smaShortCurr > smaLongCurr && smaSlope > 0) {
    currentPhase = "Markup";
    confidenceVal = 80 + Math.min(18, Math.floor(smaSlope * 60));
    signal = "BUY";
    details = "Prezzo stabilmente sopra la SMA50, con pendenza positiva lineare in accelerazione ciclica (Markup Phase).";
  }
  // 2. MARKDOWN: Prezzo sotto SMA corta, SMA corta < SMA lunga, pendenza negativa
  else if (currentPrice < smaShortCurr && smaShortCurr < smaLongCurr && smaSlope < 0) {
    currentPhase = "Markdown";
    confidenceVal = 80 + Math.min(18, Math.floor(Math.abs(smaSlope) * 60));
    signal = "SELL";
    details = "Tendenza ribassista marcata sotto le medie mobili brevi e lunghe. Liquidità in deflusso continuo (Markdown Phase).";
  }
  // 3. DISTRIBUZIONE: Oscillazione vicino ai massimi, volumi instabili e medie piatte/curvanti
  else if (positionPercent > 0.65 && (relativeStdDev < 4.8 || isAbnormalVolume)) {
    currentPhase = "Distribuzione";
    confidenceVal = 75 + Math.floor((4.8 - Math.min(4.8, relativeStdDev)) * 3);
    signal = "SELL";
    details = "Compressione laterale nei pressi dei massimi con volumi anomali non direzionali. Distribuzione istituzionale in atto.";
  }
  // 4. ACCUMULAZIONE: Oscillazione vicino ai minimi storici, bassa volatilità, medie intrecciate
  else {
    currentPhase = "Accumulazione";
    const factorDev = Math.max(0, 4.5 - relativeStdDev);
    confidenceVal = 78 + Math.floor(factorDev * 4);
    signal = "BUY";
    details = "Fase di accumulazione laterale vicina ai minimi di periodo. Deviazione standard contenuta che indica assorbimento dell'offerta.";
  }

  // Proteggiamo i confini
  confidenceVal = Math.min(99, Math.max(60, confidenceVal));

  return {
    currentPhase,
    confidence: `${confidenceVal}%`,
    signal,
    details
  };
}

// Seeded deterministic indicator data generator for Overbought/Oversold dashboard
const generateOverboughtOversoldData = (symbol: string, timeframe: string, currentPrice: number) => {
  const seed = getTickerSeed(symbol);
  let pointsCount = 60;
  let intervalDays = 7;
  const now = new Date(2026, 4, 21); // simulated date May 2026

  switch (timeframe) {
    case '1M':
      pointsCount = 30;
      intervalDays = 1;
      break;
    case '6M':
      pointsCount = 45;
      intervalDays = 4;
      break;
    case '1Y':
    case '1A':
    default:
      pointsCount = 60;
      intervalDays = 6;
      break;
    case '3Y':
      pointsCount = 80;
      intervalDays = 14;
      break;
    case '5Y':
      pointsCount = 100;
      intervalDays = 18;
      break;
    case '10Y':
      pointsCount = 120;
      intervalDays = 30;
      break;
  }

  const rawPoints: { date: string; timestamp: number; price: number; volume: number }[] = [];
  let price = currentPrice * 0.45; // Start earlier at lower price
  
  // Custom drift rate per asset class
  let drift = 0.0012;
  let volatility = 0.018;
  const tickerUpper = symbol.toUpperCase();
  if (tickerUpper.includes('NVDA')) {
    drift = 0.0045;
    volatility = 0.025;
  } else if (tickerUpper.includes('AAPL')) {
    drift = 0.0010;
    volatility = 0.011;
  } else if (tickerUpper.includes('BTC') || tickerUpper.includes('ETH')) {
    drift = 0.0035;
    volatility = 0.040;
  }

  for (let i = 0; i < pointsCount; i++) {
    const d = new Date(now.getTime());
    d.setDate(now.getDate() - (pointsCount - i) * intervalDays);

    let dateStr = "";
    if (timeframe === '1M') {
      dateStr = d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    } else if (timeframe === '6M' || timeframe === '1Y' || timeframe === '1A') {
      dateStr = d.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' });
    } else {
      dateStr = d.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' });
    }

    // Generate price curve
    const cycleFactor = Math.sin(i * 0.25 + seed * 0.4) * 0.45;
    const secondaryCycle = Math.cos(i * 0.08 + seed) * 0.15;
    const randomNoise = Math.sin(i * seed * 1.7) * 0.12;
    
    // Smooth price calculation
    const currentDriftValue = (1 + drift * intervalDays + cycleFactor * volatility + secondaryCycle * volatility + randomNoise * volatility);
    price = price * currentDriftValue;
    if (price < 1) price = 1;

    // Volume generation
    const volumeBase = 50000 + Math.abs(Math.sin(i * 0.18 + seed)) * 150000;
    const isOutlier = Math.sin(i * seed) > 0.8;
    const volume = Math.round(volumeBase * (isOutlier ? 1.9 : 1.0));

    rawPoints.push({
      date: dateStr,
      timestamp: d.getTime(),
      price: Math.round(price * 100) / 100,
      volume
    });
  }

  // Adjust final point to match today's actual live price precisely
  if (rawPoints.length > 0) {
    const lastPoint = rawPoints[rawPoints.length - 1];
    const correctionRatio = currentPrice / lastPoint.price;
    rawPoints.forEach(pt => {
      pt.price = Math.round(pt.price * correctionRatio * 100) / 100;
    });
  }

  // --- ORA CALCOLIAMO GLI INDICATORI UTILIZZANDO GLI ALGORITMI REALI RICHIESTI ---
  // Calcolo DPO reale per tutti i punti
  const pointsWithDPO = calculateDPO(rawPoints, 14);

  // Calcoliamo lo score Wyckoff point-by-point per disegnarlo nell'oscillatore
  const finalResult = pointsWithDPO.map((pt, index) => {
    // Per ogni punto, definiamo la "Wyckoff value" cumulativa basata sul sotto-array fino a quell'indice
    const subset = pointsWithDPO.slice(0, index + 1);
    const analysis = detectWyckoffPhase(subset);
    
    // Convertiamo la fase rilevata in un valore oscillatore da -100 a +100
    let wyckoffScore = 0;
    const confValue = parseInt(analysis.confidence) || 75;
    if (analysis.currentPhase === "Markup") {
      wyckoffScore = confValue; // da +60 a +99
    } else if (analysis.currentPhase === "Markdown") {
      wyckoffScore = -confValue; // da -60 a -99
    } else if (analysis.currentPhase === "Accumulazione") {
      // Wyckoff Accumulation ranges between -50 and 0
      wyckoffScore = -Math.round(confValue * 0.4);
    } else { // Distribuzione
      // Wyckoff Distribution ranges between 0 and +50
      wyckoffScore = Math.round(confValue * 0.4);
    }

    // Trend Speed: calcolato in base alla pendenza recente della media
    const speedBase = 100 + (pt.dpo * 0.6);
    const speed = Math.min(200, Math.max(0, Math.round(speedBase)));

    return {
      date: pt.date,
      timestamp: pt.timestamp,
      price: pt.price,
      dpo: pt.dpo || 0,
      wyckoff: wyckoffScore,
      speed
    };
  });

  return finalResult;
};

export default function AiInsightsDrawer({ ticker, onClose }: AiInsightsDrawerProps) {
  const [currentTicker, setCurrentTicker] = useState<string>(ticker || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [position, setPosition] = useState({ x: 100, y: 40 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Custom states matching the image segments
  const [activeSegmentTab, setActiveSegmentTab] = useState<'Overview' | 'Seasonality' | 'Overbought/Oversold' | 'Dividends' | 'Fundamentals' | 'News' | 'Multi-AI'>('Overview');
  const [overviewTimeframe, setOverviewTimeframe] = useState<'1M' | '3M' | '6M' | 'YTD' | '1A' | '3A' | '5A' | '10A' | 'ALL'>('1A');
  const [aiPrompterText, setAiPrompterText] = useState<string | null>(null);
  const [activePrompterLabel, setActivePrompterLabel] = useState<string | null>(null);
  const [activeStatementTab, setActiveStatementTab] = useState<'Analysis' | 'Financial Statements' | 'Transcripts'>('Analysis');
  const [financialHighlightsToggle, setFinancialHighlightsToggle] = useState<'Annual' | 'Quarterly'>('Annual');
  const [reliabilityTab, setReliabilityTab] = useState<'Reliability' | 'Altman Z' | 'Ratios' | 'Distress'>('Altman Z');
  const [statementSheetMode, setStatementSheetMode] = useState<'Income' | 'Balance' | 'CashFlow'>('Income');

  // Overbought/Oversold custom states
  const [activeIndicator, setActiveIndicator] = useState<'DPO' | 'Wyckoff' | 'Speed'>('DPO');
  const [indicatorTimeframe, setIndicatorTimeframe] = useState<'10Y' | '5Y' | '3Y' | '1Y' | '6M' | '1M'>('1Y');
  const [indicatorChartMode, setIndicatorChartMode] = useState<'Line' | 'Area' | 'Candle'>('Line');
  const [indicatorTooltipEnabled, setIndicatorTooltipEnabled] = useState<boolean>(true);
  const [indicatorHoveredIndex, setIndicatorHoveredIndex] = useState<number | null>(null);

  // Dividends custom interactive states
  const [dripInitial, setDripInitial] = useState<number>(10000);
  const [dripMonthly, setDripMonthly] = useState<number>(250);
  const [dripYears, setDripYears] = useState<number>(15);
  const [dripReinvestEnabled, setDripReinvestEnabled] = useState<boolean>(true);
  const [dripGrowthRate, setDripGrowthRate] = useState<number>(6.5);
  const [dripDivGrowth, setDripDivGrowth] = useState<number>(7.5);
  const [simulateOnGrowth, setSimulateOnGrowth] = useState<boolean>(false);
  const [dripTaxRate, setDripTaxRate] = useState<number>(26);

  // Real backend search data states
  const [apiData, setApiData] = useState<any | null>(null);
  const [isBackendLoading, setIsBackendLoading] = useState<boolean>(false);

  // Consensus Multi-AI states
  const [coordinatedAiData, setCoordinatedAiData] = useState<any | null>(null);
  const [isConsensusLoading, setIsConsensusLoading] = useState<boolean>(false);

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Load and change simulated ticker on initial prop sync
  useEffect(() => {
    if (ticker) {
      const cleanSym = ticker.toUpperCase().trim();
      setCurrentTicker(cleanSym);
      setApiData(null);
      setCoordinatedAiData(null);
      if (searchInputRef.current) {
        searchInputRef.current.value = cleanSym;
      }
      // Center position initially on launch relative to workspace container
      const computedX = Math.max(20, Math.min(window.innerWidth - 960, (window.innerWidth / 2) - 480));
      setPosition({ x: computedX, y: 60 });
      setAiPrompterText(null);
      setActivePrompterLabel(null);
    }
  }, [ticker]);

  // Fetch real-time AI metrics from backend when the current ticker undergoes shift
  useEffect(() => {
    if (!currentTicker) return;

    let active = true;
    const fetchTickerDetails = async () => {
      setIsBackendLoading(true);
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticker: currentTicker })
        });
        if (response.ok && active) {
          const data = await response.json();
          setApiData(data);
        }
      } catch (err) {
        console.error("Failed to fetch custom ticker insights:", err);
      } finally {
        if (active) {
          setIsBackendLoading(false);
        }
      }
    };

    fetchTickerDetails();
    return () => {
      active = false;
    };
  }, [currentTicker]);

  // Fetch coordinated consensus data from server endpoint
  const fetchCoordinatedAiConsensus = useCallback(async (forcedTicker?: string) => {
    const targetTicker = forcedTicker || currentTicker;
    if (!targetTicker) return;

    setIsConsensusLoading(true);
    try {
      const res = await fetch("/api/coordinated-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: targetTicker })
      });
      if (res.ok) {
        const data = await res.json();
        setCoordinatedAiData(data);
      } else {
        console.error("Coordinated AI request failed");
      }
    } catch (err) {
      console.error("Error retrieving multi-AI consensus:", err);
    } finally {
      setIsConsensusLoading(false);
    }
  }, [currentTicker]);

  // Trigger consensus calculation automatically when clicking Multi-AI tab for the first time
  useEffect(() => {
    if (activeSegmentTab === 'Multi-AI' && !coordinatedAiData && !isConsensusLoading && currentTicker) {
      fetchCoordinatedAiConsensus();
    }
  }, [activeSegmentTab, coordinatedAiData, isConsensusLoading, currentTicker, fetchCoordinatedAiConsensus]);

  // Lightweight dragging logic on header
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('select') || isMaximized) {
      return;
    }
    setDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, dragStart]);

  // Compute merged and unified details from default profile and live backend analyze APIs
  const assetDetails = React.useMemo(() => {
    const defaultDetails = getHighPrecisionAssetAnalysis(currentTicker);
    try {
      if (!apiData || apiData.error) return defaultDetails;

      const apiTickerClean = apiData.ticker ? apiData.ticker.toUpperCase().trim() : '';
      const currentTickerClean = currentTicker ? currentTicker.toUpperCase().trim() : '';

      // If the apiData is stale (belongs to previous ticker) and we haven't loaded the matching one yet, ignore it
      if (apiTickerClean && currentTickerClean && apiTickerClean !== currentTickerClean) {
        return defaultDetails;
      }

      const lastCloseStr = apiData.currentPriceReference !== undefined && apiData.currentPriceReference !== null
        ? apiData.currentPriceReference.toString() 
        : defaultDetails.lastClose;
      
      const fairVal = apiData.fairValue !== undefined && apiData.fairValue !== null && !isNaN(Number(apiData.fairValue))
        ? Number(apiData.fairValue) 
        : defaultDetails.averageFairValue;

      const originalPrice = parseFloat(defaultDetails.lastClose) || 1;
      const currentPriceFloat = parseFloat(lastCloseStr) || originalPrice;
      let ratio = currentPriceFloat / originalPrice;
      if (isNaN(ratio) || !isFinite(ratio)) {
        ratio = 1;
      }

      const scaledFinancialHistory = (defaultDetails.financialHistory || []).map(item => ({
        ...item,
        sales: Math.round((item.sales || 0) * ratio * 10) / 10,
        netIncome: Math.round((item.netIncome || 0) * ratio * 10) / 10,
        cashFlow: Math.round((item.cashFlow || 0) * ratio * 10) / 10,
        equity: Math.round((item.equity || 0) * ratio * 10) / 10,
        debt: Math.round((item.debt || 0) * ratio * 10) / 10,
      }));

      return {
        ...defaultDetails,
        name: apiData.name || defaultDetails.name,
        ticker: apiData.ticker || defaultDetails.ticker,
        sector: apiData.sector || defaultDetails.sector,
        industry: apiData.industry || defaultDetails.industry,
        lastClose: lastCloseStr,
        averageFairValue: fairVal,
        dcfValue: fairVal * 1.05,
        peterLynchValue: fairVal * 0.95,
        evaValue: fairVal * 0.98,
        ddmValue: fairVal * 0.88,
        aiNarrative: apiData.businessModel || defaultDetails.aiNarrative,
        financialHistory: scaledFinancialHistory,
      };
    } catch (e) {
      console.error("Error computing precision live details, fallback used: ", e);
      return defaultDetails;
    }
  }, [currentTicker, apiData]);

  // Trigger simulated AI prompt answering
  const handleTriggerAiPrompt = (promptLabel: string) => {
    setActivePrompterLabel(promptLabel);
    setLoading(true);

    const responses: { [key: string]: string } = {
      "What's happening?": apiData?.aiInsights?.[1] || `I dati di borsa in tempo reale indicano che ${assetDetails.name} sta consolidando il trend rialzista sul mercato di riferimento (${assetDetails.exchange}). Gli acquisti istituzionali si concentrano su supporti chiave grazie a risultati di bilancio trimestrali superiori alle stime di consenso.`,
      
      "Business explained simple": apiData?.businessModel || `${assetDetails.name} progetta soluzioni finanziarie o tecnologiche globali ad alta complessità tecnologica. Spiegato in breve: produce infrastrutture, piattaforme software o prodotti di fascia premium con margini incredibilmente alti e li distribuisce in tutto il mondo con una forza vendita d'elite, mantenendo clienti vincolati da barriere tecniche all'uscita elevatissime.`,
      
      "Competitors": `I rivali primari di ${assetDetails.name} all'interno del comparto "${assetDetails.industry}" mostrano multipli medi di P/E superiori, confermando che l'asset analizzato gode di una valutazione premium sensata dovuta ad una maggiore profittabilità netta e minori tassi di leva finanziaria rispetto ai pari gruppo.`,
      
      "Suppliers/Clients": `La rete logistica globale mostra una forte diversificazione territoriale. I clienti primari includono colossi iperscalabili di cloud computing, istituzioni finanziarie di massimo rango e distributori autorizzati. La concentrazione del rischio è ritenuta 'Bassa' dagli indicatori predittivi AI.`,
      
      "Future Expectations": apiData?.aiInsights?.[2] || `Le stime degli analisti indicano una crescita tendenziale dei ricavi netti superiore al +16.8% CAGR per i prossimi tre esercizi fiscali, consolidando flussi di cassa liberi (FCF) additivi in grado di estendere i piani azionari di buyback e incremento del dividendo annuo.`,
      
      "Full Analysis": `Sintesi Fondamentale: ${apiData?.aiInsights?.[0] || 'Indicatori globali di liquidità ottimali'}. Altman Z-Score a ${assetDetails.altmanZScore}, multipli corretti per la crescita storica, ed eccezionale posizionamento competitivo nel settore ${assetDetails.sector}. Il Fair Value indica uno scostamento rilevante rispetto alla chiusura ultima di ${assetDetails.lastClose}.`,
      
      "Qualitative Summary": `${apiData?.businessModel || assetDetails.aiNarrative} Rischi societari identificati: ${apiData?.risks ? apiData.risks.join(', ') : 'Volatilità macroeconomica e variazioni improvvise dei tassi d\'interesse centrali.'}`,
      
      "Investor Sentiment": `L'indice di Sentiment Cognitivo AI si attesta a 88/100 ("Estremamente Bullish"). Le opzioni aperte e gli acquisti dei fondi istituzionali indicano un forte accumulo su orizzonti temporali superiori ai 180 giorni fisici.`
    };

    setTimeout(() => {
      setAiPrompterText(responses[promptLabel] || "Analisi cognitiva in corso per il parametro richiamato...");
      setLoading(false);
    }, 850);
  };

  const handleCustomSearch = (newTicker: string) => {
    if (newTicker.trim()) {
      setCurrentTicker(newTicker.toUpperCase().trim());
      setApiData(null);
      setAiPrompterText(null);
      setActivePrompterLabel(null);
    }
  };

  const pricePerformanceMap = React.useMemo(() => {
    let currentVal = parseFloat(assetDetails.lastClose) || 100;
    const timeframes: Array<'1M' | '3M' | '6M' | 'YTD' | '1A' | '3A' | '5A' | '10A' | 'ALL'> = [
      '1M', '3M', '6M', 'YTD', '1A', '3A', '5A', '10A', 'ALL'
    ];

    const map: Record<string, { startPrice: number; endPrice: number; diff: number; percent: number }> = {};

    timeframes.forEach(tf => {
      const data = generatePriceDataForOverview(currentTicker, tf, currentVal);
      if (data.length > 0) {
        const start = data[0].price;
        const end = data[data.length - 1].price;
        const diff = end - start;
        const percent = (diff / start) * 100;

        map[tf] = {
          startPrice: Math.round(start * 100) / 100,
          endPrice: Math.round(end * 100) / 100,
          diff: Math.round(diff * 100) / 100,
          percent: Math.round(percent * 100) / 100
        };
      } else {
        map[tf] = { startPrice: currentVal, endPrice: currentVal, diff: 0, percent: 0 };
      }
    });

    return map;
  }, [currentTicker, assetDetails.lastClose]);

  const paysDividends = React.useMemo(() => {
    const isCrypto = currentTicker.toUpperCase().includes('BTC') || 
                     currentTicker.toUpperCase().includes('ETH') || 
                     currentTicker.toUpperCase().includes('SOL') || 
                     currentTicker.toUpperCase().includes('USDT');
    const parsedAnnualDiv = parseFloat(assetDetails.annualDividend);
    return !isCrypto && !isNaN(parsedAnnualDiv) && parsedAnnualDiv > 0;
  }, [currentTicker, assetDetails.annualDividend]);

  const dividendHistoryPoints = React.useMemo(() => {
    if (!paysDividends) return [];
    
    const currentAnnualDiv = parseFloat(assetDetails.annualDividend) || 1.0;
    const history = assetDetails.financialHistory || [];
    const closePrice = parseFloat(assetDetails.lastClose) || 100;
    
    return history.map((item, index) => {
      const yearsAgo = history.length - 1 - index;
      const simulatedDiv = currentAnnualDiv / Math.pow(1.075, yearsAgo); // assume robust 7.5% avg dividend increase
      const simulatedYield = (simulatedDiv / (closePrice / Math.pow(1.04, yearsAgo))) * 100;
      return {
        year: item.year,
        dividend: parseFloat(simulatedDiv.toFixed(3)),
        yield: parseFloat(simulatedYield.toFixed(2))
      };
    });
  }, [paysDividends, assetDetails.annualDividend, assetDetails.financialHistory, assetDetails.lastClose]);

  const lastCloseNum = parseFloat(assetDetails.lastClose) || 1;
  const upsidePercent = ((assetDetails.averageFairValue - lastCloseNum) / lastCloseNum) * 100;

  // Pie chart variables
  const PIE_COLORS = ['#00c2ff', '#00e5a0', '#ff3d6b', '#f59e0b', '#a855f7'];

  if (!ticker) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-start justify-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            left: isMaximized ? '0px' : `${position.x}px`,
            top: isMaximized ? '0px' : `${position.y}px`,
            width: isMaximized ? '100vw' : '940px',
            height: isMaximized ? '100vh' : '820px',
          }}
          className="pointer-events-auto bg-[#070d19] border border-[#00c2ff]/30 shadow-2xl rounded-2xl flex flex-col overflow-hidden text-sm font-sans select-none"
        >
          {/* DRAGGABLE BAR HEADER */}
          <div 
            onMouseDown={handleMouseDown}
            className={`px-4 py-3 bg-[#0a1223] border-b border-[#1a2e4c] flex justify-between items-center shrink-0 cursor-move ${isMaximized ? 'cursor-default' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00c2ff] animate-pulse" />
                <span className="text-[9px] font-mono tracking-widest text-[#00c2ff] font-extrabold uppercase">
                  COGNITIVE AI ANALYST TERMINAL Pro
                </span>
              </div>
              <span className="text-gray-500 font-mono text-xs">|</span>
              <div className="flex items-center gap-1 bg-[#1a2332] px-2 py-0.5 rounded text-[10px] text-gray-400 font-mono">
                <span>DRAG TERMINALBAR TO ADJUST POSITION</span>
              </div>
            </div>

            {/* Minimizer & Window Actions */}
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1 hover:bg-[#15243f] text-gray-400 hover:text-white rounded transition"
                title={isMaximized ? "Ripristina Dimensioni" : "Massimizza"}
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="p-1 bg-[#ff3d6b]/10 hover:bg-[#ff3d6b]/20 text-[#ff3d6b]/90 hover:text-[#ff3d6b] rounded transition"
                title="Chiudi Terminale"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* INTERNAL CONTENT CONTAINER (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin bg-[#070c17]">
            
            {/* STEROID OPTIMIZED SEARCH BAR & SYNC */}
            <div className="bg-[#0b1426] border border-[#1b2f50] rounded-xl p-3 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00c2ff]/10 text-[#00c2ff] rounded-lg">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-white font-mono tracking-wider">
                    Analisi In Tempo Reale Sulla Borsa Di Riferimento
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                    Modello neurale AI calibrato sui conti societari, ex-dividendos, flussi di buyback e Fair Value DCF.
                  </p>
                </div>
              </div>

              {/* Action input to quickly test other tickers directly */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Es. TSLA, ENEL.MI, AAPL..."
                  defaultValue={currentTicker}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomSearch(e.currentTarget.value);
                    }
                  }}
                  className="bg-[#040811] text-xs font-mono font-black border border-[#1a2e4c] hover:border-[#00c2ff]/30 text-white rounded-lg px-3 py-2 w-full md:w-[170px] uppercase text-center focus:outline-none focus:border-[#00c2ff]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (searchInputRef.current) {
                      handleCustomSearch(searchInputRef.current.value);
                    }
                  }}
                  className="bg-[#00c2ff] hover:bg-[#00c2ff]/90 text-slate-950 font-black px-4 py-2 text-xs rounded-lg uppercase tracking-wider transition cursor-pointer font-bold shrink-0"
                >
                  Analizza
                </button>
              </div>
            </div>

            {/* STEROID HEADER GRID AS PER THE PROVIDED DESIGN PRESET */}
            <div className="bg-[#091122] border border-[#1b2d4c] rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-black text-white hover:text-[#00c2ff] transition font-sans tracking-tight">
                      {assetDetails.name}
                    </h1>
                    <span className="text-xl font-mono text-gray-400 font-bold">
                      - {assetDetails.ticker}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-[#00c2ff]/15 text-[#00c2ff] border border-[#00c2ff]/30 px-2 py-0.5 rounded font-black tracking-wide">
                      {assetDetails.exchange.split(' ')[0]}
                    </span>
                    {isBackendLoading && (
                      <span className="text-[9px] font-mono uppercase bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded font-black tracking-wide animate-pulse flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
                        AI RECALIBRATING...
                      </span>
                    )}
                    {!isBackendLoading && apiData && (
                      <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded font-black tracking-wide flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-emerald-400" />
                        LIVE AI DATA
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-gray-400">
                    <span className="text-gray-500 font-bold uppercase">Indices:</span>
                    {assetDetails.indices.map((idx, index) => (
                      <span key={index} className="bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded text-gray-300">
                        {idx}
                      </span>
                    ))}
                    <span className="text-gray-600 block sm:inline">|</span>
                    <span className="text-gray-500 font-bold uppercase">Settore:</span>
                    <span className="text-[#00c2ff] font-bold">{assetDetails.sector}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500 font-bold uppercase">Industria:</span>
                    <span className="text-gray-300 font-bold">{assetDetails.industry}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTriggerAiPrompt("Full Analysis")}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-[#ff3d6b] hover:opacity-90 font-mono font-black text-[10px] text-white uppercase tracking-wider py-1.5 px-3.5 rounded-lg transition shadow-md shadow-[#ff3d6b]/10 animate-pulse cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Resume AI AGENT
                  </button>
                </div>
              </div>

              {/* Navigation segment Tabs */}
              <div className="border-b border-[#1b2e4c] flex flex-wrap gap-1 select-none">
                {['Overview', 'Seasonality', 'Overbought/Oversold', 'Stock split/Dividends', 'Fundamentals', 'News', 'Multi-AI'].map((tab) => {
                  const isActive = activeSegmentTab === (tab.startsWith('Stock') ? 'Dividends' : tab as any);
                  const displayTabName = tab === 'Overbought/Oversold' ? 'Overbought - Oversold' : (tab === 'Multi-AI' ? 'Consensus Multi-AI' : (tab.startsWith('Stock') ? 'Dividends' : tab));
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveSegmentTab(tab.startsWith('Stock') ? 'Dividends' : tab as any)}
                      className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide rounded-t-lg transition relative -mb-[1px] cursor-pointer ${
                        isActive 
                          ? 'bg-[#1b2f51] border-t border-x border-[#1b2e4c] text-white font-extrabold' 
                          : 'text-gray-400 hover:text-white hover:bg-[#121f37]'
                      }`}
                    >
                      {displayTabName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI ACTIONS GRID (2 Rows of 4 Buttons as shown in user's layout) */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-gray-400 font-mono uppercase tracking-widest block">
                🧠 INTERAGISCI CON GLI AGENTI COGNITIVI AI
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {[
                  { label: "What's happening?", desc: "Novità ed Eventi Chiave" },
                  { label: "Business explained simple", desc: "Business Spiegato Semplice" },
                  { label: "Competitors", desc: "Analisi della Concorrenza" },
                  { label: "Suppliers/Clients", desc: "Fornitori e Catena di Valore" },
                  { label: "Future Expectations", desc: "Previsioni sui conti futuri" },
                  { label: "Full Analysis", desc: "Analisi di Bilancio Completa" },
                  { label: "Qualitative Summary", desc: "Modello Business & Rischi" },
                  { label: "Investor Sentiment", desc: "Sentimento del mercato retail/istituzioni" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTriggerAiPrompt(item.label)}
                    className={`p-3 text-left border rounded-xl transition duration-150 flex flex-col justify-between h-[65px] group cursor-pointer ${
                      activePrompterLabel === item.label
                        ? 'bg-[#00c2ff]/10 border-[#00c2ff] text-white shadow-lg shadow-[#00c2ff]/5'
                        : 'bg-[#09101f] border-[#162742] hover:bg-[#101b33] hover:border-[#00c2ff]/30 text-gray-300'
                    }`}
                  >
                    <span className="text-[11px] font-black uppercase tracking-tight font-sans block group-hover:text-[#00c2ff] transition">
                      {item.label}
                    </span>
                    <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-wide block truncate">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI INTERACTIVE PANEL DISPLAY BOX */}
            {activePrompterLabel && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0c162b] border border-[#00c2ff]/30 rounded-xl p-4 space-y-2 font-mono text-xs leading-relaxed"
              >
                <div className="flex justify-between items-center text-[10px] text-[#00c2ff] font-extrabold border-b border-[#00c2ff]/15 pb-1.5">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                    RISPOSTA AI AGENT: {activePrompterLabel.toUpperCase()}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setAiPrompterText(null);
                      setActivePrompterLabel(null);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    Chiudi tab
                  </button>
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 py-2 text-gray-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Generazione analisi fondamentale strutturata...
                  </div>
                ) : (
                  <p className="text-gray-200 text-[11px] leading-relaxed">
                    {aiPrompterText}
                  </p>
                )}
              </motion.div>
            )}

            {/* KEY METRICS GRID STATS BLOCK - REALISTIC FIN-INFO BAR FROM PHOTO */}
            <div className="bg-[#09101f] border border-[#172741] p-4.5 rounded-xl">
              <span className="text-[#00c2ff] font-mono font-black text-[9px] block uppercase tracking-wider mb-2.5">
                📊 DETTAGLI FINANZIARI GENERALI E SCADENZIARIO UTILI / DIVIDENDI
              </span>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 font-mono">
                <div className="border border-[#14233c] bg-[#050812] p-2.5 rounded-lg">
                  <span className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider block">Ex-Dividend date</span>
                  <strong className="text-gray-200 text-[11px] block mt-0.5">{assetDetails.exDividendDate}</strong>
                </div>
                <div className="border border-[#14233c] bg-[#050812] p-2.5 rounded-lg">
                  <span className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider block">Payment date</span>
                  <strong className="text-gray-200 text-[11px] block mt-0.5">{assetDetails.paymentDate}</strong>
                </div>
                <div className="border border-[#14233c] bg-[#050812] p-2.5 rounded-lg">
                  <span className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider block">Annual Dividend</span>
                  <strong className="text-amber-500 text-[11px] block mt-0.5">{assetDetails.annualDividend}</strong>
                </div>
                <div className="border border-[#14233c] bg-[#050812] p-2.5 rounded-lg">
                  <span className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider block">Dividend Yield</span>
                  <strong className="text-emerald-500 text-[11px] block mt-0.5">{assetDetails.dividendYield}</strong>
                </div>
                <div className="border border-[#14233c] bg-[#050812] p-2.5 rounded-lg">
                  <span className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider block">Shareholders Yield</span>
                  <strong className="text-sky-400 text-[11px] block mt-0.5">{assetDetails.shareholdersYield}</strong>
                </div>
                <div className="border border-[#14233c] bg-[#050812] p-2.5 rounded-lg">
                  <span className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider block">Next Earnings</span>
                  <strong className="text-gray-200 text-[11px] block mt-0.5">{assetDetails.nextEarnings}</strong>
                </div>
                <div className="border border-[#14233c] bg-[#050812] p-2.5 rounded-lg">
                  <span className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider block">Market Cap</span>
                  <strong className="text-gray-200 text-[11px] block mt-0.5">{assetDetails.marketCap}</strong>
                </div>
                <div className="border border-[#14233c] bg-[#050812] p-2.5 rounded-lg">
                  <span className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider block">EPS (TTM)</span>
                  <strong className="text-gray-200 text-[11px] block mt-0.5">{assetDetails.epsTTM}</strong>
                </div>
                <div className="border border-[#14233c] bg-[#050812] p-2.5 rounded-lg">
                  <span className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider block">P/E (TTM)</span>
                  <strong className="text-gray-200 text-[11px] block mt-0.5">{assetDetails.peTTM}</strong>
                </div>
                <div className="border border-[#14233c] bg-[#050812] p-2.5 rounded-lg">
                  <span className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider block">Last Close</span>
                  <strong className="text-emerald-400 text-[11px] block mt-0.5">{assetDetails.currency === 'USD' ? '$' : '€'}{assetDetails.lastClose}</strong>
                </div>
              </div>
            </div>

            {/* OVERVIEW SEGMENT TAB CONTENT */}
            {activeSegmentTab === 'Overview' && (() => {
              const symbolToUse = currentTicker.toUpperCase();
              const timeframeData = generatePriceDataForOverview(symbolToUse, overviewTimeframe, lastCloseNum);
              const performanceInfo = pricePerformanceMap[overviewTimeframe] || { startPrice: lastCloseNum, endPrice: lastCloseNum, diff: 0, percent: 0 };
              const currentCurrencySym = assetDetails.currency === 'USD' ? '$' : '€';
              
              const isBullishTf = performanceInfo.percent >= 0;
              const chartColor = isBullishTf ? '#00e5a0' : '#ff3d6b';
              const chartGradientId = `overviewChartGrad-${symbolToUse}-${overviewTimeframe}`;

              return (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* PRICE AREA CHART INTEGRATED CARD */}
                  <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest block font-bold">
                          📈 ANDAMENTO PREZZO TEMPO REALE ({overviewTimeframe})
                        </span>
                        <div className="flex items-baseline gap-2.5">
                          <h2 className="text-3xl font-black text-white font-mono tracking-tight leading-none">
                            {currentCurrencySym}{lastCloseNum}
                          </h2>
                          <div className={`flex items-center gap-1 text-[11px] font-black font-mono px-2 py-0.5 rounded ${isBullishTf ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {isBullishTf ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            <span>
                              {isBullishTf ? '+' : ''}{performanceInfo.percent.toFixed(2)}%
                            </span>
                            <span className="text-[9px] opacity-70 ml-0.5 font-medium">
                              ({isBullishTf ? '+' : ''}{performanceInfo.diff.toFixed(2)} {assetDetails.currency})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Professional TradingView-Style Timeframe Tabs selector */}
                      <div className="flex bg-[#050812] border border-[#14233c] p-1 rounded-xl self-start sm:self-auto flex-wrap gap-0.5 select-none font-mono text-[10px] font-extrabold max-w-full">
                        {(['1M', '3M', '6M', 'YTD', '1A', '3A', '5A', '10A', 'ALL'] as const).map((tf) => {
                          const isActive = overviewTimeframe === tf;
                          return (
                            <button
                              key={tf}
                              type="button"
                              onClick={() => setOverviewTimeframe(tf)}
                              className={`px-3 py-1.5 rounded-lg transition uppercase duration-150 cursor-pointer ${
                                isActive 
                                  ? 'bg-[#00c2ff] text-slate-950 font-black shadow-lg shadow-[#00c2ff]/10' 
                                  : 'text-gray-400 hover:text-white hover:bg-[#111927]'
                              }`}
                            >
                              {tf}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* PRICE CHART CANVAS */}
                    <div className="h-64 w-full bg-[#050811] border border-[#14233c] rounded-xl p-3 relative overflow-hidden">
                      {/* Ambient glow behind the chart */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 rounded-full blur-3xl opacity-[0.035] pointer-events-none transition-colors duration-500"
                           style={{ backgroundColor: chartColor }} />

                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart 
                          data={timeframeData}
                          margin={{ top: 12, right: 10, left: -22, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={chartColor} stopOpacity={0.35}/>
                              <stop offset="100%" stopColor={chartColor} stopOpacity={0.00}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#162238" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            stroke="#4a5568" 
                            tickLine={false}
                            style={{ fontSize: '9px', fontFamily: 'monospace' }} 
                          />
                          <YAxis 
                            stroke="#4a5568" 
                            tickLine={false}
                            domain={['auto', 'auto']}
                            style={{ fontSize: '9px', fontFamily: 'monospace' }} 
                            tickFormatter={(v) => `${currentCurrencySym}${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#09101f', 
                              borderColor: '#1c2e4f', 
                              borderRadius: '10px', 
                              color: '#fff', 
                              fontSize: '10px',
                              fontFamily: 'monospace',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
                            }} 
                            itemStyle={{ color: '#00c2ff', fontWeight: 'bold' }}
                            formatter={(value) => [`${currentCurrencySym}${value}`, 'Prezzo']}
                            labelFormatter={(label) => `Data: ${label}`}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke={chartColor} 
                            strokeWidth={2.2} 
                            fillOpacity={1} 
                            fill={`url(#${chartGradientId})`} 
                            animationDuration={1000} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* COMPREHENSIVE PERFORMANCE SUMMARY WIDGET */}
                  <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl space-y-3.5">
                    <span className="text-[#00c2ff] font-mono font-black text-[9.5px] block uppercase tracking-wider">
                      📊 WIDGET RIASSUNTIVO DELLE PERFORMANCE PERIODICHE
                    </span>

                    <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                      {(['1M', '3M', '6M', 'YTD', '1A', '3A', '5A', '10A', 'ALL'] as const).map((tf) => {
                        const tfPerf = pricePerformanceMap[tf] || { startPrice: lastCloseNum, endPrice: lastCloseNum, diff: 0, percent: 0 };
                        const isBullishValue = tfPerf.percent >= 0;
                        const isChosenTimeframe = overviewTimeframe === tf;

                        return (
                          <button
                            key={tf}
                            type="button"
                            onClick={() => setOverviewTimeframe(tf)}
                            className={`p-2.5 rounded-xl border text-center transition flex flex-col justify-between h-[82px] font-mono select-none cursor-pointer group ${
                              isChosenTimeframe 
                                ? 'bg-slate-900 border-[#00c2ff]/60 shadow-lg shadow-[#00c2ff]/5' 
                                : 'bg-[#050812] border-[#14233c] hover:border-gray-600/35 hover:bg-[#070c18]'
                            }`}
                          >
                            <span className={`text-[9.5px] font-black uppercase block ${isChosenTimeframe ? 'text-[#00c2ff]' : 'text-gray-400 group-hover:text-white'}`}>
                              {tf}
                            </span>
                            
                            <div className="space-y-0.5 my-1">
                              <span className={`text-[12px] font-extrabold block truncate leading-none ${isBullishValue ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'}`}>
                                {isBullishValue ? '+' : ''}{tfPerf.percent.toFixed(1)}%
                              </span>
                              <span className="text-[7.5px] text-gray-500 block truncate font-medium">
                                {isBullishValue ? '+' : ''}{tfPerf.diff.toFixed(1)} {assetDetails.currency}
                              </span>
                            </div>

                            <span className="text-[7px] text-gray-600 uppercase font-bold tracking-tight block">
                              {tf === 'ALL' ? 'Totale' : tf === 'YTD' ? 'Da Gen' : `Val ${tf}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* DIVIDENDS STRATEGIC ANALYTICS COMPONENT */}
                  <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl space-y-4">
                    <div className="border-b border-[#14233c] pb-2 text-[12px] font-black uppercase text-white font-mono tracking-wider flex items-center gap-1.5">
                      <Landmark className="h-4 w-4 text-[#f59e0b]" />
                      Storico Dividendi & Rendimenti di Distribuzione
                    </div>

                    {paysDividends ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        
                        {/* CHART COLUMN: HISTORICAL GROWTH OF DIVIDEND PER SHARE */}
                        <div className="lg:col-span-2 bg-[#050812] border border-[#14233c] p-3 rounded-xl flex flex-col justify-between">
                          <div className="flex justify-between items-center mb-1.5 select-none font-mono text-[9px] text-gray-400 uppercase tracking-wider">
                            <span>📈 Trend di Crescita Cedolare ({currentCurrencySym} / Azione)</span>
                            <span className="text-[#00c2ff] font-bold">DATI STORICI DISTRIBUITI</span>
                          </div>

                          <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart 
                                data={dividendHistoryPoints}
                                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                              >
                                <defs>
                                  <linearGradient id="divBarGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.95}/>
                                    <stop offset="100%" stopColor="#b45309" stopOpacity={0.25}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#162238" vertical={false} />
                                <XAxis dataKey="year" stroke="#4a5568" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                                <YAxis stroke="#4a5568" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#09101f', 
                                    borderColor: '#1b2f51', 
                                    borderRadius: '8px', 
                                    color: '#fff', 
                                    fontSize: '10px', 
                                    fontFamily: 'monospace' 
                                  }} 
                                  formatter={(value) => [`${currentCurrencySym}${value}`, 'Dividendo Annuale']}
                                />
                                <Bar dataKey="dividend" name="Dividendo Cedola" fill="url(#divBarGrad)" radius={[4, 4, 0, 0]} animationDuration={1000} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* KEY STATS CARD */}
                        <div className="bg-[#050812] border border-[#14233c] p-4 rounded-xl flex flex-col justify-between font-mono gap-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] border-b border-[#14233c] pb-1.5">
                              <span className="text-gray-400 font-medium font-sans">Dividendo Corrente</span>
                              <strong className="text-amber-500 font-bold">{assetDetails.annualDividend}</strong>
                            </div>
                            <div className="flex justify-between items-center text-[10px] border-b border-[#14233c] pb-1.5">
                              <span className="text-gray-400 font-medium font-sans">Dividend Yield (Rend.)</span>
                              <strong className="text-emerald-400 font-bold">{assetDetails.dividendYield}</strong>
                            </div>
                            <div className="flex justify-between items-center text-[10px] border-b border-[#14233c] pb-1.5">
                              <span className="text-gray-400 font-medium font-sans">Shareholders Yield</span>
                              <strong className="text-sky-400 font-bold">{assetDetails.shareholdersYield}</strong>
                            </div>
                            <div className="flex justify-between items-center text-[10px] border-b border-[#14233c] pb-1.5">
                              <span className="text-gray-400 font-medium font-sans">Frequenza Pagamento</span>
                              <strong className="text-gray-200">Semestrale</strong>
                            </div>
                            <div className="flex justify-between items-center text-[10px] border-b border-[#14233c] pb-1.5">
                              <span className="text-gray-400 font-medium font-sans">Ex-Dividend Date</span>
                              <strong className="text-gray-200">{assetDetails.exDividendDate}</strong>
                            </div>
                          </div>

                          <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-white p-3 rounded-lg text-center leading-normal text-[10px] font-sans">
                            <strong className="block text-amber-400 font-bold text-[10.5px] mb-1 uppercase tracking-wider">Crescita Contenuta</strong>
                            L'asset mostra un payout ratio sano sul fatturato, a garanzia di sicurezza e margini di stabilità futuri.
                          </div>
                        </div>

                      </div>
                    ) : (
                      /* INFORMATIONAL BLOCK FOR ASSETS WITH NO DIVIDENDS */
                      <div className="bg-[#050812] border border-[#1b2a45]/60 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
                        <div className="space-y-1 md:max-w-xl text-center md:text-left">
                          <h4 className="text-[11px] font-black uppercase text-amber-500">
                            🛡️ Asset Focalizzato su Crescita di Capitale (Accumulazione)
                          </h4>
                          <p className="text-[10px] text-gray-400 leading-relaxed font-sans font-medium">
                            {assetDetails.name} non distribuisce cedole periodiche. Questo indica che la società reinveste il 100% dei profitti generati nello sviluppo tecnologico, buyback e fusione quote, accelerando l'apprezzamento dell'asset nel lungo termine.
                          </p>
                        </div>
                        <div className="bg-[#00c2ff]/5 border border-[#00c2ff]/15 px-4.5 py-3 rounded-xl text-center shrink-0 w-full md:w-auto">
                          <span className="text-[8px] text-gray-500 block uppercase tracking-wide">Tasso CAGR Stimato 5A</span>
                          <strong className="text-base text-[#00c2ff] font-extrabold font-mono block mt-0.5">
                            +14.85%
                          </strong>
                          <span className="text-[7.5px] text-emerald-400 font-bold block mt-0.5 uppercase">Crescita Composta</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}

            {/* DIVIDENDS SECURE INTERACTIVE TAB CONTENT */}
            {activeSegmentTab === 'Dividends' && (() => {
              const currentCurrencySym = assetDetails.currency === 'USD' ? '$' : '€';
              const parsedAnnualDiv = parseFloat(assetDetails.annualDividend) || 0;
              const parsedYield = parseFloat(assetDetails.dividendYield) || 0;
              const hasNativePeriodics = paysDividends;
              const activeCompoundMode = hasNativePeriodics || simulateOnGrowth;

              const activeAnnualDiv = hasNativePeriodics ? parsedAnnualDiv : (simulateOnGrowth ? (lastCloseNum * 0.035) : 0);
              const activeAnnualYield = hasNativePeriodics ? parsedYield : (simulateOnGrowth ? 3.5 : 0);
              const epsNum = parseFloat(assetDetails.epsTTM) || 5.0;
              const payoutRatioVal = epsNum > 0 && activeAnnualDiv > 0 ? (activeAnnualDiv / epsNum) * 100 : 35;
              
              let dividendScore = 82;
              let dividendSafetyStatus = 'SICURO & EQUILIBRATO';
              let safetyColorBorder = 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
              let safetyGaugeStroke = '#10b981';
              let safetyFeedbackMsg = "Incontro ideale di rendimento e conservazione del capitale. Copertura robusta.";

              if (activeCompoundMode) {
                if (activeAnnualYield > 9.0) {
                  dividendScore -= 24;
                  dividendSafetyStatus = 'YIELD TRAP / RISCHIO ALTO';
                  safetyColorBorder = 'border-rose-500/20 bg-rose-500/10 text-rose-400';
                  safetyGaugeStroke = '#ef4444';
                  safetyFeedbackMsg = "Rendimento insolitamente elevato. Controllare payout societario e stabilità utili.";
                } else if (activeAnnualYield > 6.0) {
                  dividendScore -= 8;
                  dividendSafetyStatus = 'RENDIMENTO AGGRESSIVO';
                  safetyColorBorder = 'border-amber-500/20 bg-amber-500/10 text-amber-400';
                  safetyGaugeStroke = '#f59e0b';
                  safetyFeedbackMsg = "Fornisce flussi di cassa importanti ma con margini di sicurezza più contratti.";
                } else if (activeAnnualYield >= 1.5 && activeAnnualYield <= 5.0) {
                  dividendScore += 8;
                }
                if (payoutRatioVal > 85) {
                  dividendScore -= 18;
                  dividendSafetyStatus = 'PAYOUT ECCESSIVO';
                  safetyColorBorder = 'border-red-500/20 bg-red-500/10 text-red-400';
                  safetyGaugeStroke = '#ef4444';
                  safetyFeedbackMsg = "La società distribuisce quasi tutti gli utili. Probabile riduzione della cedola in futuro.";
                } else if (payoutRatioVal > 0 && payoutRatioVal <= 45) {
                  dividendScore += 6;
                }
              } else {
                dividendScore = 0;
                dividendSafetyStatus = 'NESSUN DIVIDENDO';
                safetyColorBorder = 'border-slate-500/20 bg-slate-500/10 text-slate-400';
                safetyGaugeStroke = '#475569';
                safetyFeedbackMsg = "Questo strumento non paga dividendi (accumulazione pura per crescita capitale).";
              }

              const finalSafetyScore = activeCompoundMode ? Math.max(10, Math.min(99, Math.round(dividendScore))) : 0;

              // Seasonality integration
              const seasonalityYears = generateSeasonalityData(currentTicker);
              const monthsKeys = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
              const monthlyMetrics = monthsKeys.map((m) => {
                let sum = 0, count = 0, wins = 0;
                seasonalityYears.forEach(y => {
                  const val = y.performances[m];
                  if (val !== null && val !== undefined) {
                    sum += val; count++;
                    if (val > 0) wins++;
                  }
                });
                return { month: m, avg: count > 0 ? sum / count : 0, winRate: count > 0 ? (wins / count) * 100 : 0 };
              });

              let exDivMonthIndex: number | null = null;
              let exDivMonthNameIT = '';
              let synergyItem: any = null;

              if (assetDetails.exDividendDate && assetDetails.exDividendDate !== '---') {
                const dateParts = assetDetails.exDividendDate.split('/');
                if (dateParts.length >= 2) {
                  exDivMonthIndex = (parseInt(dateParts[1], 10) - 1);
                  const itMonths = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
                  exDivMonthNameIT = itMonths[exDivMonthIndex] || '';
                  synergyItem = monthlyMetrics[exDivMonthIndex];
                }
              }

              const hasSynergyFavorableSeason = synergyItem && (synergyItem.winRate >= 55 || synergyItem.avg > 0.5);

              // Compound DRIP Ledger computing net cashflows after taxation
              const dripLedger = [];
              let sharesDRIP = activeCompoundMode ? (dripInitial / lastCloseNum) : 0;
              let sharesNoDRIP = activeCompoundMode ? (dripInitial / lastCloseNum) : 0;
              let activePrice = lastCloseNum;
              let cumulativeDividendsDRIP_Gross = 0;
              let cumulativeDividendsDRIP_Net = 0;
              let cumulativeDividendsNoDRIP_Gross = 0;
              let cumulativeDividendsNoDRIP_Net = 0;
              let cumCashSpent = dripInitial;

              for (let y = 0; y <= dripYears; y++) {
                const currentAnnualDivPerShare = activeAnnualDiv * Math.pow(1 + (dripDivGrowth / 100), y);
                const currentPortValueDRIP = sharesDRIP * activePrice;
                const currentPortValueNoDRIP = sharesNoDRIP * activePrice;
                const grandTotalValueNoDRIP_Gross = currentPortValueNoDRIP + cumulativeDividendsNoDRIP_Gross;
                const grandTotalValueNoDRIP_Net = currentPortValueNoDRIP + cumulativeDividendsNoDRIP_Net;

                dripLedger.push({
                  year: `Anno ${y}`,
                  "Con DRIP Attivo": Math.round(currentPortValueDRIP),
                  "Senza DRIP (Lordo)": Math.round(grandTotalValueNoDRIP_Gross),
                  "Con DRIP Attivo (Netto)": Math.round(currentPortValueDRIP * (1 - dripTaxRate / 100) + (dripInitial * (dripTaxRate / 100))),
                  "Senza DRIP (Netto)": Math.round(grandTotalValueNoDRIP_Net),
                  sharesWithReinvest: parseFloat(sharesDRIP.toFixed(2)),
                  sharesWithoutReinvest: parseFloat(sharesNoDRIP.toFixed(2)),
                  annualIncomeWithDRIP: Math.round(sharesDRIP * currentAnnualDivPerShare),
                  netAnnualIncomeWithDRIP: Math.round(sharesDRIP * currentAnnualDivPerShare * (1 - dripTaxRate / 100)),
                });

                if (y < dripYears) {
                  const annualPayoutDRIP_Gross = sharesDRIP * currentAnnualDivPerShare;
                  const annualPayoutDRIP_Net = annualPayoutDRIP_Gross * (1 - dripTaxRate / 100);
                  const annualPayoutNoDRIP_Gross = sharesNoDRIP * currentAnnualDivPerShare;
                  const annualPayoutNoDRIP_Net = annualPayoutNoDRIP_Gross * (1 - dripTaxRate / 100);

                  cumulativeDividendsDRIP_Gross += annualPayoutDRIP_Gross;
                  cumulativeDividendsDRIP_Net += annualPayoutDRIP_Net;
                  cumulativeDividendsNoDRIP_Gross += annualPayoutNoDRIP_Gross;
                  cumulativeDividendsNoDRIP_Net += annualPayoutNoDRIP_Net;

                  if (dripReinvestEnabled) {
                    sharesDRIP += annualPayoutDRIP_Net / activePrice;
                  }

                  const yearlySavings = dripMonthly * 12;
                  cumCashSpent += yearlySavings;
                  const estimatedAvgPrice = activePrice * (1 + (dripGrowthRate / 100) / 2);
                  sharesDRIP += yearlySavings / estimatedAvgPrice;
                  sharesNoDRIP += yearlySavings / estimatedAvgPrice;
                  activePrice = activePrice * (1 + (dripGrowthRate / 100));
                }
              }

              const targetYearEndPoints = dripLedger[dripLedger.length - 1] || { "Con DRIP Attivo": 0, "Senza DRIP (Lordo)": 0, "Con DRIP Attivo (Netto)": 0, annualIncomeWithDRIP: 0, netAnnualIncomeWithDRIP: 0, sharesWithReinvest: 0 };
              const totalNetPrincipal = cumCashSpent;
              
              const dripFinalWealthRealized = targetYearEndPoints["Con DRIP Attivo"] || 0;
              const noDripFinalWealthRealized = targetYearEndPoints["Senza DRIP (Lordo)"] || 0;
              const dripIncrementalBenefit = dripFinalWealthRealized - noDripFinalWealthRealized;
              const dripProfitPercentage = totalNetPrincipal > 0 ? ((dripFinalWealthRealized - totalNetPrincipal) / totalNetPrincipal) * 100 : 0;
              const returnOnCostDRIP = activeCompoundMode && totalNetPrincipal > 0 ? (targetYearEndPoints.annualIncomeWithDRIP / totalNetPrincipal) * 100 : 0;

              const grossMonthlyPassive = Math.round(targetYearEndPoints.annualIncomeWithDRIP / 12);
              const netMonthlyPassive = Math.round(targetYearEndPoints.netAnnualIncomeWithDRIP / 12);

              // FREEDOM MILESTONES DEFINITION
              const freedomMilestones = [
                { id: 'coffee', label: 'Caffè Quotidiano', cost: 15, icon: '☕', desc: 'Espresso + cornetto al bar' },
                { id: 'streaming', label: 'Cinema & Streaming', cost: 40, icon: '🎬', desc: 'Netflix, Prime & Spotify Premium' },
                { id: 'utilities', label: 'Bollette & Utenze', cost: 180, icon: '⚡', desc: 'Luce, gas, acqua e cellulari' },
                { id: 'groceries', label: 'Spesa Alimentare', cost: 250, icon: '🛒', desc: 'Spesa mensile di sussistenza' },
                { id: 'leisure', label: 'Svago & Ristoranti', cost: 350, icon: '🍕', desc: 'Cene fuori, weekend e hobby' },
                { id: 'transport', label: 'Mobilità & Auto', cost: 500, icon: '🚗', desc: 'Rata veicolo, carburanti, polizza' },
                { id: 'housing', label: 'Affitto o Mutuo', cost: 1100, icon: '🏠', desc: 'Costo medio locazione o rata casa' },
                { id: 'living', label: 'Costo Vita Base', cost: 1800, icon: '💼', desc: 'Standard vitale minimo indipendente' },
                { id: 'freedom', label: 'Libertà Finanziaria', cost: 3500, icon: '🌴', desc: 'Rendimento passivo totale di vita' }
              ];

              return (
                <div className="space-y-4 animate-fadeIn">

                  {/* HEADER STATUS BAR */}
                  <div className="bg-[#09101f] border border-[#172741] p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 p-2.5 rounded-lg shrink-0">
                        <Landmark className="h-6 w-6 text-[#f59e0b]" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-[#00c2ff] tracking-widest uppercase block font-black">
                          CEDOLE & INDIPENDENZA FINANZIARIA
                        </span>
                        <h3 className="text-white text-base font-extrabold flex items-center gap-2">
                          Politica di Dividendi e Libera Sinergia: {assetDetails.name} ({currentTicker})
                          {hasNativePeriodics ? (
                            <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-black font-mono">
                              Attivo {assetDetails.dividendYield}
                            </span>
                          ) : (
                            <span className="text-[9px] bg-sky-500/15 border border-sky-500/30 text-sky-400 px-1.5 py-0.5 rounded uppercase font-black font-mono">
                              Accumulazione (0.00%)
                            </span>
                          )}
                        </h3>
                      </div>
                    </div>

                    {!hasNativePeriodics && (
                      <div className="flex items-center gap-2.5 bg-[#0b1427] border border-[#1b2f51] p-2 rounded-xl">
                        <span className="text-[10px] text-gray-400 font-mono font-bold">Simulare dividendo al 3.5%?</span>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={simulateOnGrowth}
                            onChange={(e) => setSimulateOnGrowth(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-[#14233c] hover:bg-[#1a2e4b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00c2ff]" />
                        </label>
                      </div>
                    )}
                  </div>

                  {activeCompoundMode ? (
                    <>
                      {/* STATS & CARDS */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        
                        {/* SAFETY CIRCULAR PROGRESS */}
                        <div className="bg-[#09101f] border border-[#172741] p-4 rounded-xl flex flex-col justify-between h-[230px]">
                          <span className="text-[#00c2ff] font-mono font-black text-[9px] block uppercase tracking-wider">
                            🛡️ DIVIDEND SAFETY RATING (AI AUDIT)
                          </span>
                          
                          <div className="flex items-center justify-around my-2.5">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" stroke="#101b33" strokeWidth="8" fill="transparent" />
                                <circle 
                                  cx="50" 
                                  cy="50" 
                                  r="42" 
                                  stroke={safetyGaugeStroke} 
                                  strokeWidth="8" 
                                  fill="transparent" 
                                  strokeDasharray={263.8} 
                                  strokeDashoffset={263.8 - (finalSafetyScore / 100) * 263.8} 
                                  strokeLinecap="round"
                                  className="transition-all duration-1000 ease-out" 
                                />
                              </svg>
                              <div className="absolute text-center animate-pulse">
                                <span className="text-xl font-black text-white font-mono block leading-none">{finalSafetyScore}</span>
                                <span className="text-[7.5px] text-gray-500 font-bold uppercase block mt-1 tracking-wider">Punteggio</span>
                              </div>
                            </div>

                            <div className="space-y-1 text-left flex-1 pl-4">
                              <span className="text-[8px] text-gray-400 font-mono uppercase tracking-wider block">Livello Rischio</span>
                              <div className={`text-[9px] font-black uppercase inline-block px-1.5 py-0.5 rounded border ${safetyColorBorder}`}>
                                {dividendSafetyStatus}
                              </div>
                              <span className="text-[8.5px] text-gray-500 font-mono block mt-1 leading-none">Payout Ratio: {payoutRatioVal.toFixed(1)}%</span>
                              <span className="text-[8.5px] text-gray-500 font-mono block leading-none mt-1">Yield Annuo: {activeAnnualYield.toFixed(2)}%</span>
                            </div>
                          </div>

                          <div className="text-[9.5px] text-gray-400 font-sans leading-relaxed border-t border-[#14233c] pt-2 text-center font-medium italic">
                            "{safetyFeedbackMsg}"
                          </div>
                        </div>

                        {/* EX-DIVIDEND SPECIFICS */}
                        <div className="bg-[#09101f] border border-[#172741] p-4 rounded-xl flex flex-col justify-between h-[230px] font-mono">
                          <span className="text-[#00c2ff] font-black text-[9px] block uppercase tracking-wider pb-1 border-b border-[#14233c]">
                            📅 CONDIZIONI DI STACCO & DISTRIBUZIONE
                          </span>

                          <div className="space-y-2.5 my-2">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-gray-400 font-sans flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-[#f59e0b]" /> Data Ex-Dividendo</span>
                              <strong className="text-amber-500 font-bold">{assetDetails.exDividendDate || '---'}</strong>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-gray-400 font-sans flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-emerald-400" /> Data Pagamento</span>
                              <strong className="text-emerald-400 font-bold">{assetDetails.paymentDate || '---'}</strong>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-gray-400 font-sans flex items-center gap-1"><Info className="h-3.5 w-3.5 text-sky-400" /> Frequenza Cedola</span>
                              <strong className="text-gray-200 uppercase">Trimestrale / Semestrale</strong>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-gray-400 font-sans flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5 text-[#00c2ff]" /> Dividendo per Azione</span>
                              <strong className="text-[#00c2ff] font-bold">{currentCurrencySym}{activeAnnualDiv.toFixed(2)} / Anno</strong>
                            </div>
                          </div>

                          {exDivMonthIndex !== null ? (
                            <div className="bg-[#121c2e] border border-[#1b2f51] p-2.5 rounded-lg text-[9.5px] text-gray-300 leading-tight">
                              <span className="text-gray-400 font-sans block mb-1">Stagionalità in Mese di Stacco ({exDivMonthNameIT}):</span>
                              Performance media del mese: <strong className={synergyItem?.avg >= 0 ? "text-emerald-400" : "text-rose-400"}>{synergyItem?.avg?.toFixed(2)}%</strong> con win rate pari al <strong className="text-[#00e5a0]">{synergyItem?.winRate}%</strong>.
                            </div>
                          ) : (
                            <div className="bg-[#121c2e]/40 border border-[#14233c] p-2.5 rounded-lg text-center text-[9px] text-gray-500">
                              Usa un asset con data ex-cedola dichiarata per sincronizzare l'analisi ciclica di stagionalità DPO.
                            </div>
                          )}
                        </div>

                        {/* COGNITIVE MATRIX SYNERGY */}
                        <div className="bg-[#09101f] border border-[#172741] p-4 rounded-xl flex flex-col justify-between h-[230px]">
                          <span className="text-[#00c2ff] font-mono font-black text-[9px] block uppercase tracking-wider">
                            🎯 COMBO SINERGICA DPO & STAGIONALITÀ
                          </span>

                          <div className="my-2 bg-[#050812] border border-[#14233c] p-3 rounded-lg flex flex-col justify-center h-28 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${hasSynergyFavorableSeason ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                              <strong className="text-[10px] font-mono uppercase tracking-wide text-white">
                                {hasSynergyFavorableSeason ? 'CONFLUENZA OPERATIVA ALTA' : 'SINERGIA NEUTRALE / ATTESA'}
                              </strong>
                            </div>
                            <p className="text-[9.5px] text-gray-400 leading-relaxed font-sans font-medium">
                              Se l'indicatore proprietario <strong className="text-[#00e5a0]/90">Forecaster DPO</strong> rileva uno stato di sottovalutazione (Fascia Green) ed il mese dello stacco cedola è storicamente bull, l'efficienza contrarian dell'accumulo composto aumenta drammaticamente.
                            </p>
                          </div>

                          {hasSynergyFavorableSeason ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-[9px] flex items-center gap-2 font-mono">
                              <Sparkles className="h-4 w-4 shrink-0 text-emerald-400 animate-pulse" />
                              <div className="leading-tight font-sans">
                                <strong>STRATEGIA SUGGERITA:</strong> Reinvestimento aggressivo confermato. Il mese corrente mostra solidità strutturale.
                              </div>
                            </div>
                          ) : (
                            <div className="bg-[#15243f] border border-[#21385d] text-slate-300 px-3 py-1.5 rounded-lg text-[9px] flex items-center gap-2 font-mono">
                              <Info className="h-4 w-4 shrink-0 text-amber-500" />
                              <div className="leading-tight font-sans">
                                <strong>STILE DI REINVESIMENTINO:</strong> Accumulo frazionato "Dollar-Cost Average" sul fondo delle bande Bollinger del DPO.
                              </div>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* THE GAMIFIED MILESTONES DASHBOARD - IL RISULTATO PAZZESCO! */}
                      <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl space-y-4">
                        <div className="border-b border-[#14233c] pb-2 text-[11px] font-black uppercase text-white font-mono tracking-wider flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Crown className="h-4 w-4 text-[#f59e0b] animate-bounce" />
                            Roadmap per la Libertà Finanziaria: Copertura Spese con Dividendi Netti
                          </span>
                          <span className="text-[#00e5a0] text-[9.5px]">TASSAZIONE REALE DETRATTA: {dripTaxRate}%</span>
                        </div>

                        <div className="bg-[#050811] p-4.5 rounded-xl border border-[#13213a] flex flex-col md:flex-row items-center justify-between gap-4 font-mono select-none">
                          <div className="text-center md:text-left space-y-1">
                            <span className="text-[9px] text-[#00c2ff] font-extrabold uppercase tracking-widest">
                              Proiezione Rendita Mensile Netta a {dripYears} Anni
                            </span>
                            <div className="text-3xl font-black text-rose-400 flex items-baseline justify-center md:justify-start gap-1">
                              {currentCurrencySym}{netMonthlyPassive.toLocaleString('it-IT')}
                              <span className="text-xs font-semibold text-gray-500">/ mese netti</span>
                            </div>
                            <span className="text-[10px] text-gray-400 block pt-0.5">
                              Entrata Lorda: {currentCurrencySym}{grossMonthlyPassive}/mese • Tasse Totali Simulate: {currentCurrencySym}{(grossMonthlyPassive - netMonthlyPassive).toLocaleString('it-IT')}
                            </span>
                          </div>

                          <div className="bg-[#0b1427] border border-[#1b2f51] p-3 rounded-lg flex items-center gap-3">
                            <p className="text-[10.5px] text-right text-gray-400 font-sans leading-tight">
                              Accumulo azioni totali finale di:<br/>
                              <strong className="text-[#00c2ff] text-sm font-mono font-black">{targetYearEndPoints.sharesWithReinvest} pz</strong>
                            </p>
                          </div>
                        </div>

                        {/* Bento Grid layout of the Financial Milestones */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                          {freedomMilestones.map((ms) => {
                            const progress = Math.min(100, Math.round((netMonthlyPassive / ms.cost) * 100));
                            const isAchieved = progress >= 100;
                            const neededMoreIncome = Math.max(0, ms.cost - netMonthlyPassive);
                            // Shares needed to close the remaining gap, based on net return per share:
                            const annualNetPerShare = activeAnnualDiv * (1 - dripTaxRate / 100);
                            const sharesNeeded = annualNetPerShare > 0 ? Math.ceil((neededMoreIncome * 12) / annualNetPerShare) : 0;

                            return (
                              <div 
                                key={ms.id} 
                                className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between h-[120px] ${
                                  isAchieved 
                                    ? 'bg-[#10b981]/5 border-emerald-500/35 shadow-[0_0_15px_rgba(16,185,129,0.06)]' 
                                    : 'bg-[#050811] border-[#182a47] hover:border-[#213a61]'
                                }`}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <div className="space-y-0.5 pointer-events-none">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-base">{ms.icon}</span>
                                      <span className="text-white text-[11px] font-black tracking-tight">{ms.label}</span>
                                    </div>
                                    <span className="text-[8.5px] text-gray-400 block leading-tight">{ms.desc}</span>
                                  </div>
                                  <div className="text-right font-mono shrink-0">
                                    <span className="text-[10px] text-slate-300 font-bold block">{currentCurrencySym}{ms.cost}/mese</span>
                                    <span className={`text-[9px] font-extrabold block uppercase ${isAchieved ? 'text-emerald-400' : 'text-gray-500'}`}>
                                      {isAchieved ? '✅ SBLOCCATO' : `${progress}%`}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-1.5 pt-1.5 select-none font-mono">
                                  {/* Milestone progress bar component */}
                                  <div className="w-full bg-[#14233c] h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-1000 ${
                                        isAchieved ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-[#3b82f6]'
                                      }`}
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>

                                  <div className="flex justify-between items-center text-[8.5px]">
                                    {isAchieved ? (
                                      <span className="text-emerald-400 font-bold flex items-center gap-0.5 animate-pulse">
                                        ⭐ Coperto al 100% passivamente!
                                      </span>
                                    ) : (
                                      <span className="text-slate-400">GAP: +{currentCurrencySym}{neededMoreIncome}/mese</span>
                                    )}
                                    {!isAchieved && sharesNeeded > 0 && (
                                      <span className="text-amber-500 font-bold">Servono altri {sharesNeeded} pz</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* WEALTH ACCUMULATION ADJUSTABLE SLIDERS */}
                      <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl space-y-4">
                        <div className="border-b border-[#14233c] pb-2 text-[11px] font-black uppercase text-white font-mono tracking-wider flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 text-[#00c2ff]" />
                            Configura Parametri Accumulazione & Simulatore Fiscale Reattivo
                          </span>
                          <span className="text-[#00c2ff] text-[9.5px]">CONTINGENCY STRATEGY DRIP</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                          
                          {/* SLIDERS COLUMN - CONTROLS */}
                          <div className="lg:col-span-5 bg-[#050811] border border-[#14233c] p-4 rounded-xl space-y-4">
                            <h4 className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest block pb-1 border-b border-[#14233c] mb-2">
                              ⚙️ PARAMETRI DI CONFIGURAZIONE ACCUMULO
                            </h4>

                            {/* Slider 1: Capitale Iniziale */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between font-mono text-[10px]">
                                <span className="text-gray-400 font-sans">Capitale Iniziale:</span>
                                <strong className="text-white font-bold">{currentCurrencySym}{dripInitial.toLocaleString('it-IT')}</strong>
                              </div>
                              <input 
                                type="range" 
                                min="1000" 
                                max="150000" 
                                step="1000"
                                value={dripInitial}
                                onChange={(e) => setDripInitial(Number(e.target.value))}
                                className="w-full accent-[#00c2ff] h-1.5 bg-[#14233c] rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            {/* Slider 2: Risparmio Mensile */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between font-mono text-[10px]">
                                <span className="text-gray-400 font-sans">Piano Accumulo Mensile (PAC):</span>
                                <strong className="text-white font-bold">{currentCurrencySym}{dripMonthly.toLocaleString('it-IT')} / mese</strong>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="5000" 
                                step="50"
                                value={dripMonthly}
                                onChange={(e) => setDripMonthly(Number(e.target.value))}
                                className="w-full accent-[#00e5a0] h-1.5 bg-[#14233c] rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            {/* Slider 3: Orizzonte Temporale */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between font-mono text-[10px]">
                                <span className="text-gray-400 font-sans">Orizzonte Investimento (Anni):</span>
                                <strong className="text-[#00c2ff] font-bold">{dripYears} Anni</strong>
                              </div>
                              <input 
                                type="range" 
                                min="3" 
                                max="40" 
                                step="1"
                                value={dripYears}
                                onChange={(e) => setDripYears(Number(e.target.value))}
                                className="w-full accent-[#00c2ff] h-1.5 bg-[#14233c] rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            {/* Slider 4: Stock Annual growth */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between font-mono text-[10px]">
                                <span className="text-gray-400 font-sans">Apprezzamento Azione (Crescita Capitale):</span>
                                <strong className="text-gray-300 font-bold">{dripGrowthRate.toFixed(1)}% / Anno</strong>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="20" 
                                step="0.5"
                                value={dripGrowthRate}
                                onChange={(e) => setDripGrowthRate(Number(e.target.value))}
                                className="w-full accent-[#a855f7] h-1.5 bg-[#14233c] rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            {/* Slider 5: Dividend Growth */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between font-mono text-[10px]">
                                <span className="text-gray-400 font-sans">Crescita Annua della Cedola:</span>
                                <strong className="text-[#f59e0b] font-bold">{dripDivGrowth.toFixed(1)}% / Anno</strong>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="18" 
                                step="0.5"
                                value={dripDivGrowth}
                                onChange={(e) => setDripDivGrowth(Number(e.target.value))}
                                className="w-full accent-[#f59e0b] h-1.5 bg-[#14233c] rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            {/* Slider 6: Fiscale Cedole (Tax Rate) */}
                            <div className="space-y-1.5 bg-[#0a1122] border border-[#1a3054] p-3 rounded-lg">
                              <div className="flex justify-between font-mono text-[10px]">
                                <span className="text-[#fb7185] font-bold flex items-center gap-0.5">⚠️ Aliquota Fiscale Dividendi:</span>
                                <strong className="text-[#fb7185] font-black">{dripTaxRate}%</strong>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="50" 
                                step="1"
                                value={dripTaxRate}
                                onChange={(e) => setDripTaxRate(Number(e.target.value))}
                                className="w-full accent-[#fb7185] h-1.5 bg-[#15243f] rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-[7.5px] text-gray-400 block font-sans">Esempio: 26% (Italia), 15%/30% (USA con ritenuta), 0% (PEA / ISA / No tax)</span>
                            </div>

                            {/* Toggle Reinvestment */}
                            <div className="pt-2 px-3 py-2.5 rounded-lg bg-[#0c162b] border border-[#1b2f51] flex justify-between items-center select-none">
                              <div className="space-y-0.5 animate-fadeIn">
                                <span className="text-[10px] text-white font-bold block">Reinvestimento Assistito (DRIP)</span>
                                <span className="text-[7.5px] text-gray-500 font-medium block">Acquista in automatico altre frazioni di quote</span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={dripReinvestEnabled}
                                  onChange={(e) => setDripReinvestEnabled(e.target.checked)}
                                  className="sr-only peer"
                                  disabled={!activeCompoundMode}
                                />
                                <div className="w-9 h-5 bg-[#14233c] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00e5a0]" />
                              </label>
                            </div>
                          </div>

                          {/* PROJECTION CHART - GROSS VS NET FOR PERFECT VALUE DENSITY */}
                          <div className="lg:col-span-7 bg-[#050811] border border-[#14233c] p-4 rounded-xl flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-2 select-none font-mono text-[9px] text-gray-400 uppercase tracking-wider">
                              <span>📈 PROIEZIONE DI CRESCITA PATRIMONIALE SU RENDITA</span>
                              <span className="text-[#00e5a0] font-bold">Lordo VS Netto Fiscale</span>
                            </div>

                            <div className="h-60 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart 
                                  data={dripLedger}
                                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                  <defs>
                                    <linearGradient id="dripGrossGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#00e5a0" stopOpacity={0.30}/>
                                      <stop offset="100%" stopColor="#00e5a0" stopOpacity={0.00}/>
                                    </linearGradient>
                                    <linearGradient id="dripNetGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#fb7185" stopOpacity={0.20}/>
                                      <stop offset="100%" stopColor="#fb7185" stopOpacity={0.00}/>
                                    </linearGradient>
                                    <linearGradient id="noDripGrossGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15}/>
                                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.00}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#162238" vertical={false} />
                                  <XAxis dataKey="year" stroke="#4a5568" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                                  <YAxis stroke="#4a5568" style={{ fontSize: '9px', fontFamily: 'monospace' }} tickFormatter={(val) => `${currentCurrencySym}${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: '#09101f', 
                                      borderColor: '#1c2e4f', 
                                      borderRadius: '10px', 
                                      color: '#fff', 
                                      fontSize: '10.5px',
                                      fontFamily: 'monospace' 
                                    }} 
                                    formatter={(value) => [`${currentCurrencySym}${Number(value).toLocaleString('it-IT')}`, '']}
                                  />
                                  <Legend verticalAlign="top" height={25} wrapperStyle={{ fontSize: '9.5px', fontFamily: 'monospace' }} />
                                  <Area type="monotone" name="con DRIP (Lordo)" dataKey="Con DRIP Attivo" stroke="#00e5a0" strokeWidth={2.5} fillOpacity={1} fill="url(#dripGrossGrad)" />
                                  <Area type="monotone" name="con DRIP (Al Netto)" dataKey="Con DRIP Attivo (Netto)" stroke="#fb7185" strokeWidth={2} fillOpacity={1} fill="url(#dripNetGrad)" />
                                  <Area type="monotone" name="Senza DRIP (Lordo)" dataKey="Senza DRIP (Lordo)" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#noDripGrossGrad)" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>

                            {/* OUTPUT METRICS */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 font-mono border-t border-[#14233c] pt-3.5 mt-2">
                              <div className="bg-[#09101f] border border-[#14233c] p-2 rounded-lg">
                                <span className="text-[7.5px] text-gray-500 block uppercase font-bold">Investito PAC Totale</span>
                                <strong className="text-gray-200 text-[11px] font-bold block mt-0.5">{currentCurrencySym}{totalNetPrincipal.toLocaleString('it-IT')}</strong>
                              </div>
                              <div className="bg-[#09101f] border border-[#14233c] p-2 rounded-lg">
                                <span className="text-[7.5px] text-gray-500 block uppercase font-bold">Capitale Netto Stimato</span>
                                <strong className="text-emerald-400 text-[11px] font-bold block mt-0.5">{currentCurrencySym}{targetYearEndPoints["Con DRIP Attivo (Netto)"].toLocaleString('it-IT')}</strong>
                                <span className="text-[7px] text-gray-400 block">Tasse già pagate sulle cedole</span>
                              </div>
                              <div className="bg-[#09101f] border border-[#14233c] p-2 rounded-lg">
                                <span className="text-[7.5px] text-gray-500 block uppercase font-bold">Beneficio Reinvestimento</span>
                                <strong className="text-amber-500 text-[11px] font-bold block mt-0.5">+{currentCurrencySym}{dripIncrementalBenefit.toLocaleString('it-IT')}</strong>
                                <span className="text-[7px] text-gray-400 block">Surplus reale accumulato</span>
                              </div>
                              <div className="bg-[#09101f] border border-[#14233c] p-2 rounded-lg">
                                <span className="text-[7.5px] text-gray-500 block uppercase font-bold">Tasso Ritorno su Costo</span>
                                <strong className="text-[#00c2ff] text-[11px] font-bold block mt-0.5">{returnOnCostDRIP.toFixed(2)}%</strong>
                                <span className="text-[7px] text-sky-400 block">Yield On Cost cumulato</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* DETAILED LEDGER TABLE SHEET */}
                      <div className="bg-[#09101f] border border-[#172741] p-4.5 rounded-xl">
                        <span className="text-[#00c2ff] font-mono font-black text-[9px] block uppercase tracking-widest mb-2 pb-1 border-b border-[#14233c]">
                          📋 RENDICONTO DETTAGLIATO E MATRICE FLUSSI ANNUALE
                        </span>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left font-mono text-[10px] text-gray-400 border-collapse">
                            <thead>
                              <tr className="border-b border-[#1b2f51] text-gray-500 text-[8.5px] uppercase">
                                <th className="py-2">Periodo</th>
                                <th className="py-2 text-right">Patrimonio Lordo (DRIP)</th>
                                <th className="py-2 text-right">Patrimonio Netto (DRIP)</th>
                                <th className="py-2 text-right">Senza DRIP (Lordo)</th>
                                <th className="py-2 text-right">Quantità Azioni</th>
                                <th className="py-2 text-right">Cedola Annua Lorda</th>
                                <th className="py-2 text-right">Cedola Annua Netta</th>
                                <th className="py-2 text-right">Cashflow Mese Netto</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dripLedger.filter((_, idx) => idx % Math.max(1, Math.round(dripYears / 6)) === 0 || idx === dripLedger.length - 1).map((pt, i) => {
                                const grossMo = Math.round(pt.annualIncomeWithDRIP / 12);
                                const netMo = Math.round(pt.netAnnualIncomeWithDRIP / 12);
                                return (
                                  <tr key={pt.year} className="border-b border-[#14233c]/60 hover:bg-[#0c162b] transition">
                                    <td className="py-2 text-white font-bold">{pt.year}</td>
                                    <td className="py-2 text-right text-emerald-400 font-extrabold">{currentCurrencySym}{pt["Con DRIP Attivo"].toLocaleString('it-IT')}</td>
                                    <td className="py-2 text-right text-rose-300 font-bold">{currentCurrencySym}{pt["Con DRIP Attivo (Netto)"].toLocaleString('it-IT')}</td>
                                    <td className="py-2 text-right text-slate-300">{currentCurrencySym}{pt["Senza DRIP (Lordo)"].toLocaleString('it-IT')}</td>
                                    <td className="py-2 text-right text-sky-400">{pt.sharesWithReinvest} pz</td>
                                    <td className="py-2 text-right text-gray-200">{currentCurrencySym}{pt.annualIncomeWithDRIP.toLocaleString('it-IT')}</td>
                                    <td className="py-2 text-right text-amber-500 font-bold">{currentCurrencySym}{pt.netAnnualIncomeWithDRIP.toLocaleString('it-IT')}</td>
                                    <td className="py-2 text-right text-rose-400 font-black">{currentCurrencySym}{netMo}/mese</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </>
                  ) : (
                    /* GROWTH ONLY ASSET */
                    <div className="bg-[#0c162b] border border-[#1c2f52] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-5 font-mono">
                      <div className="bg-amber-500/10 p-4 rounded-full border border-amber-500/20 animate-pulse">
                        <Landmark className="h-9 w-9 text-amber-500" />
                      </div>
                      <div className="space-y-2 max-w-xl">
                        <h4 className="text-white text-base font-black uppercase">
                          🛡️ ASSET CALIBRATO PER COMPRESSION E CRESCITA (ACCUMULAZIONE)
                        </h4>
                        <p className="text-[11.5px] text-gray-400 font-sans leading-relaxed font-semibold">
                          Lo strumento finanziario <span className="text-[#00c2ff] font-extrabold">{assetDetails.name}</span> non distribuisce flussi cedolari periodici (Dividendo Corrente: 0.00). 
                          Questo significa che il management investe il 100% degli utili netti aziendali per favorire l'espansione e piani strategici di Buyback (riacquisto quote), accelerando l'apprezzamento dell'azione nel lungo periodo.
                        </p>
                      </div>
                      
                      <div className="bg-[#050811] border border-[#13213a] p-4.5 rounded-xl space-y-3.5 max-w-sm w-full">
                        <div className="text-center">
                          <span className="text-[8.5px] text-gray-500 block uppercase font-bold tracking-widest">Tasso CAGR 5A Stimato</span>
                          <strong className="text-2xl text-[#00c2ff] font-black tracking-tight block mt-1">+14.85% / Anno</strong>
                          <span className="text-[7.5px] text-emerald-400 font-extrabold block uppercase mt-0.5">Apprezzamento Composto di Capitale</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSimulateOnGrowth(true)}
                          className="w-full bg-[#00c2ff] hover:bg-[#009bcf] text-slate-950 font-black tracking-wider uppercase py-2.5 cursor-pointer rounded-lg font-mono text-[9.5px] transition shadow-md hover:shadow-[#00c2ff]/10"
                        >
                          ⚡ Attiva Simulatore Cedole Ipotetiche
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })()}

            {/* SEASONALITY SEGMENT TAB CONTENT */}
            {activeSegmentTab === 'Seasonality' && (() => {
              const seasonalityYears = generateSeasonalityData(currentTicker);
              const monthsKeys = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

              // Calculate aggregate metrics
              const monthlyMetrics = monthsKeys.map((m) => {
                let sum = 0;
                let count = 0;
                let wins = 0;
                seasonalityYears.forEach(y => {
                  const val = y.performances[m];
                  if (val !== null && val !== undefined) {
                    sum += val;
                    count++;
                    if (val > 0) wins++;
                  }
                });
                const avg = count > 0 ? sum / count : 0;
                const winRate = count > 0 ? (wins / count) * 100 : 0;
                return {
                  month: m,
                  avg: avg,
                  winRate: Math.round(winRate)
                };
              });

              // Find best/worst/most reliable months
              const sortedByAvg = [...monthlyMetrics].sort((a, b) => b.avg - a.avg);
              const sortedByWinRate = [...monthlyMetrics].sort((a, b) => b.winRate - a.winRate);

              const bestMonth = sortedByAvg[0];
              const worstMonth = sortedByAvg[sortedByAvg.length - 1];
              const mostReliableMonth = sortedByWinRate[0];

              const getSeasonalityAIInsight = () => {
                const symbolUpper = currentTicker.toUpperCase();
                if (symbolUpper.includes('NVDA')) {
                  return "NVIDIA (NVDA) evidenzia un forte impulso stagionale nel quarto trimestre (Q4), storicamente guidato dalla crescita della domanda tecnologica e dal posizionamento pre-natalizio, con il mese di Novembre che registra una media straordinaria del +8.8%. Agosto e Settembre si confermano i mesi più volatili, ideali storicamente per ingressi strategici ponderati.";
                }
                if (symbolUpper.includes('BTC') || symbolUpper.includes('ETH')) {
                  return "Le criptovalute mostrano cicli stagionali accentuati determinati dalla liquidità globale e dal sentiment retail. Ottobre (+15.2%) e Febbraio (+13.1%) trainano storicamente il mercato verso performance estremamente rialziste. Settembre (-8.8%) rappresenta invece la finestra di debolezza stagionale più pronunciata e statisticamente affidabile come correzione.";
                }
                if (symbolUpper.includes('AAPL')) {
                  return "Apple (AAPL) segue un pattern legato strettamente ai cicli di rilascio dei prodotti (solitamente a metà Settembre). Le performance di Novembre (+4.5%) beneficiano storicamente dell'ottimismo post-lancio e del Black Friday, mentre Febbraio presenta contrazioni post-feste. Settembre registra una debolezza ricorrente legata all'attesa del reveal degli iPhone.";
                }
                return `${assetDetails.name} (${currentTicker.toUpperCase()}) mostra una stagionalità interessante, con il mese di ${bestMonth?.month} che si distingue storicamente per la performance media più elevata (+${bestMonth?.avg.toFixed(1)}%) e una costanza notevole. Al contrario, ${worstMonth?.month} si attesta come il periodo più complesso con una performance media del ${worstMonth?.avg.toFixed(1)}%. Il mese di ${mostReliableMonth?.month} è statisticamente il più solido, chiudendo in positivo nel ${mostReliableMonth?.winRate}% degli anni analizzati.`;
              };

              // Helper for styling heat map cells
              const getHeatmapCellStyle = (val: number | null) => {
                if (val === null) {
                  return "bg-[#0c1322] text-gray-600 border border-dashed border-[#1e2f47]/50 text-center font-mono text-[10.5px]";
                }
                if (val === 0) {
                  return "bg-[#111e35] text-gray-300 font-mono text-[10.5px] text-center border border-[#142642]";
                }
                if (val > 0) {
                  if (val < 2) return "bg-emerald-500/10 text-emerald-400 font-medium font-mono text-[10.5px] text-center border border-emerald-500/15";
                  if (val >= 2 && val < 5) return "bg-emerald-500/20 text-emerald-300 font-bold font-mono text-[10.5px] text-center border border-emerald-500/25";
                  if (val >= 5 && val < 10) return "bg-emerald-500/35 text-emerald-200 font-extrabold font-mono text-[10.5px] text-center border border-emerald-500/40";
                  return "bg-emerald-500/50 text-emerald-100 font-black font-mono text-[10.5px] text-center border border-emerald-500/60";
                } else {
                  if (val > -2) return "bg-rose-500/10 text-rose-400 font-medium font-mono text-[10.5px] text-center border border-rose-500/15";
                  if (val <= -2 && val > -5) return "bg-rose-500/20 text-rose-300 font-bold font-mono text-[10.5px] text-center border border-rose-500/25";
                  if (val <= -5 && val > -10) return "bg-rose-500/35 text-rose-200 font-extrabold font-mono text-[10.5px] text-center border border-rose-500/40";
                  return "bg-rose-500/50 text-rose-100 font-black font-mono text-[10.5px] text-center border border-rose-500/60";
                }
              };

              return (
                <div className="space-y-4 animate-fadeIn font-sans">
                  
                  {/* HERO INTRO CARD */}
                  <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <Sparkles className="h-24 w-24 text-[#00c2ff]" />
                    </div>
                    <div className="space-y-1 relative z-10">
                      <span className="text-[9px] text-[#00c2ff] font-mono uppercase tracking-widest block font-bold">
                        🗓️ STATISTICHE STAGIONALI ASSET
                      </span>
                      <h3 className="text-white text-base font-black uppercase tracking-tight">
                        Cicli Temporali e Stabilità Storica
                      </h3>
                      <p className="text-gray-400 text-[11px] leading-relaxed max-w-2xl font-medium">
                        Mappa termica dei rendimenti percentuali mese per mese dal 2018 ad oggi per <strong className="text-white">{assetDetails.name} ({currentTicker.toUpperCase()})</strong>. I rendimenti sono calcolati storicamente per identificare pattern ricorrenti e anomalie di mercato.
                      </p>
                    </div>
                  </div>

                  {/* MINI KPI STATUS ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="bg-[#0b1426] border border-[#1b2f4e] p-3 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[8px] text-gray-500 uppercase tracking-widest font-mono font-bold block">
                          Miglior Mese Medio
                        </span>
                        <strong className="text-emerald-400 text-sm font-black font-mono block">
                          {bestMonth?.month}
                        </strong>
                      </div>
                      <div className="shrink-0 text-emerald-400/20">
                        <TrendingUp className="h-7 w-7" />
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-white font-mono font-black">+{bestMonth?.avg.toFixed(1)}%</span>
                        <span className="text-[7.5px] text-gray-500 font-mono block">Media Storica</span>
                      </div>
                    </div>

                    <div className="bg-[#0b1426] border border-[#1b2f4e] p-3 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[8px] text-gray-500 uppercase tracking-widest font-mono font-bold block">
                          Peggior Mese Medio
                        </span>
                        <strong className="text-rose-400 text-sm font-black font-mono block">
                          {worstMonth?.month}
                        </strong>
                      </div>
                      <div className="shrink-0 text-rose-400/20">
                        <TrendingDown className="h-7 w-7" />
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-white font-mono font-black">{worstMonth?.avg.toFixed(1)}%</span>
                        <span className="text-[7.5px] text-gray-500 font-mono block">Media Storica</span>
                      </div>
                    </div>

                    <div className="bg-[#0b1426] border border-[#1b2f4e] p-3 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[8px] text-gray-500 uppercase tracking-widest font-mono font-bold block">
                          Mese più Costante
                        </span>
                        <strong className="text-[#00c2ff] text-sm font-black font-mono block">
                          {mostReliableMonth?.month}
                        </strong>
                      </div>
                      <div className="shrink-0 text-[#00c2ff]/20">
                        <Sparkles className="h-7 w-7" />
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-white font-mono font-black">{mostReliableMonth?.winRate}%</span>
                        <span className="text-[7.5px] text-gray-500 font-mono block">Win Rate</span>
                      </div>
                    </div>
                  </div>

                  {/* HEATMAP GRID TABLE */}
                  <div className="bg-[#09101f] border border-[#172741] p-4.5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center select-none">
                      <span className="text-[9.5px] font-black font-mono uppercase tracking-wider text-gray-300 block">
                        Matrice Storica delle Performance Mensili (%)
                      </span>
                      <span className="text-[8px] font-mono text-gray-500 uppercase">
                        Heatmap Dinamica
                      </span>
                    </div>

                    <div className="overflow-x-auto overflow-y-hidden border border-[#1b2e4c] rounded-xl bg-[#050912]">
                      <table className="w-full min-w-[720px] border-collapse table-fixed">
                        <thead>
                          <tr className="border-b border-[#1b2e4c] bg-[#0c1424]">
                            <th className="py-2.5 px-2 text-left text-[9px] font-bold text-gray-400 uppercase tracking-wider w-15 font-mono border-r border-[#1b2e4c]">Anno</th>
                            {monthsKeys.map(m => (
                              <th key={m} className="py-2.5 px-1 text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono">{m}</th>
                            ))}
                            <th className="py-2.5 px-2 text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider w-20 font-mono border-l border-[#1b2e4c]">Cumul.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {seasonalityYears.map((yrData) => {
                            // Calculate year cumulative sum of valid performances
                            let yrSum = 0;
                            let hasValid = false;
                            monthsKeys.forEach(m => {
                              const val = yrData.performances[m];
                              if (val !== null) {
                                yrSum += val;
                                hasValid = true;
                              }
                            });

                            return (
                              <tr key={yrData.year} className="border-b border-[#15243c] hover:bg-[#121e35]/35 transition">
                                <td className="py-2 px-2 text-left text-[11px] font-extrabold text-[#00c2ff] font-mono border-r border-[#15243c]">{yrData.year}</td>
                                {monthsKeys.map(m => {
                                  const val = yrData.performances[m];
                                  return (
                                    <td key={m} className={`py-2 px-1 transition duration-150`}>
                                      <div className={`py-1 rounded-md text-[10.5px] ${getHeatmapCellStyle(val)}`}>
                                        {val === null ? 'N/D' : `${val > 0 ? '+' : ''}${val.toFixed(1)}%`}
                                      </div>
                                    </td>
                                  );
                                })}
                                <td className="py-2 px-2 text-center border-l border-[#15243c]">
                                  <span className={`text-[11px] font-black font-mono ${yrSum >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {hasValid ? `${yrSum >= 0 ? '+' : ''}${yrSum.toFixed(1)}%` : '---'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}

                          {/* STATS ROWS: AVERAGE RENDIMENTO */}
                          <tr className="border-t border-[#1b2e4c] bg-[#0c1424]">
                            <td className="py-2.5 px-2 text-left text-[9.5px] font-black text-emerald-400 uppercase tracking-wider font-mono border-r border-[#1b2e4c]">Avg. Ret</td>
                            {monthlyMetrics.map(m => (
                              <td key={m.month} className="py-2.5 px-1 text-center">
                                <span className={`text-[10.5px] font-black font-mono ${m.avg >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {m.avg >= 0 ? '+' : ''}{m.avg.toFixed(1)}%
                                </span>
                              </td>
                            ))}
                            <td className="py-2.5 px-2 text-center border-l border-[#1b2e4c]">
                              <span className="text-[9.5px] font-bold text-gray-500 font-mono">Media</span>
                            </td>
                          </tr>

                          {/* STATS ROWS: WIN RATE */}
                          <tr className="bg-[#0b1220]">
                            <td className="py-2.5 px-2 text-left text-[9.5px] font-black text-[#00c2ff] uppercase tracking-wider font-mono border-r border-[#1b2e4c]">Win Rate</td>
                            {monthlyMetrics.map(m => (
                              <td key={m.month} className="py-2.5 px-1 text-center">
                                <span className="text-[10.5px] font-black font-mono text-[#00c2ff]">
                                  {m.winRate}%
                                </span>
                              </td>
                            ))}
                            <td className="py-2.5 px-2 text-center border-l border-[#1b2e4c]">
                              <span className="text-[9.5px] font-bold text-gray-500 font-mono">Vittorie</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* SCALE CAPTION */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-gray-400 font-mono pt-1 select-none">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="mr-1">Legenda:</span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/50 text-rose-100 font-bold border border-rose-500/60">&lt; -10%</span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/25">Drawdown</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-[#1b2e4c]">Nullo/Neutro</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/25">Crescita</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/50 text-emerald-100 font-bold border border-emerald-500/60">&gt; +10%</span>
                      </div>
                      <div>
                        <span>* Anno 2026 parziale</span>
                      </div>
                    </div>
                  </div>

                  {/* SEASONAL INSIGHT FROM AI */}
                  <div className="bg-[#09101f] border border-[#172741] p-4.5 rounded-2xl relative overflow-hidden font-sans">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-[#00c2ff]" />
                      <span className="text-[10px] font-black font-mono uppercase tracking-widest text-[#00c2ff]">
                        ANALISI STAGIONALE QUANTITATIVA AI
                      </span>
                    </div>
                    <blockquote className="text-gray-300 text-[11px] leading-relaxed font-sans font-medium pl-3 border-l-2 border-[#00c2ff]/50">
                      {getSeasonalityAIInsight()}
                    </blockquote>
                  </div>

                </div>
              );
            })()}

            {/* OVERBOUGHT / OVERSOLD SEGMENT TAB CONTENT */}
            {activeSegmentTab === 'Overbought/Oversold' && (() => {
              // Get ticker seed for deterministic parameters
              const seed = getTickerSeed(currentTicker);
              
              // Days to ex-dividend alert
              const daysToExDiv = (seed % 25) + 3;
              
              // Calcoliamo i dati storici effettivi con gli indicatori quantitativi reali!
              const chartData = generateOverboughtOversoldData(currentTicker, indicatorTimeframe, parseFloat(assetDetails.lastClose) || 120);
              const lastPoint = chartData[chartData.length - 1] || { dpo: 0, wyckoff: 0, speed: 100 };
              
              // Seeded indicators estratti dal calcolo reale!
              const dpoVal = lastPoint.dpo;
              const wyckoffVal = lastPoint.wyckoff;
              const speedVal = lastPoint.speed;
              
              // Calcolo analisi di Wyckoff complessivo/corrente sui dati reali
              const wyckoffAnalysis = detectWyckoffPhase(chartData);
              
              // Active value & bounds
              const maxAbsDpoVal = chartData.length > 0 
                ? Math.max(...chartData.map(pt => Math.abs(pt.dpo)), 1.0)
                : 100;

              let activeValCurrent = dpoVal;
              let activeMin = -maxAbsDpoVal;
              let activeMax = maxAbsDpoVal;
              let activeLabel = 'Forecaster Advanced DPO';
              
              if (activeIndicator === 'Wyckoff') {
                activeValCurrent = wyckoffVal;
                activeMin = -100;
                activeMax = 100;
                activeLabel = 'Wyckoff';
              } else if (activeIndicator === 'Speed') {
                activeValCurrent = speedVal;
                activeMin = 0;
                activeMax = 200;
                activeLabel = 'Speed';
              }
              
              // Calculate percentage for active indicator
              const activePercent = Math.min(100, Math.max(0, ((activeValCurrent - activeMin) / (activeMax - activeMin)) * 100));
              
              // Mood description helpers (aggiornate in sincronia con i calcoli del Phase Detector)
              let activeMood: string = wyckoffAnalysis.currentPhase;
              let activeMoodDesc = wyckoffAnalysis.details;
              
              if (activeIndicator === 'DPO') {
                const valRatio = dpoVal / maxAbsDpoVal;
                if (valRatio < -0.70) {
                  activeMood = 'GREEN: Strong Buy';
                  activeMoodDesc = `Forecaster Advanced DPO a ${dpoVal.toFixed(2)} (Fascia Sotto-Bollinger 2SD). Lo strumento è eccezionalmente sottovalutato. Se la Stagionalità corrente è favorevole, le probabilità di successo per un'operazione di acquisto aumentano in maniera esponenziale!`;
                } else if (valRatio < -0.35) {
                  activeMood = 'GREEN: Buy';
                  activeMoodDesc = `Forecaster Advanced DPO a ${dpoVal.toFixed(2)} (Fascia Accumulazione 1SD). Lo strumento è in zona di acquisto con rapporto rischio/rendimento estremamente vantaggioso.`;
                } else if (valRatio >= -0.35 && valRatio <= 0.35) {
                  activeMood = 'BLUE: Hold';
                  activeMoodDesc = `Forecaster Advanced DPO a ${dpoVal.toFixed(2)} (Fascia di Equilibrio / Bande 1SD). Consolidamento sano senza eccessi sul trend decennale. Si consiglia il mantenimento.`;
                } else if (valRatio < 0.70) {
                  activeMood = 'ORANGE: Sell';
                  activeMoodDesc = `Forecaster Advanced DPO a ${dpoVal.toFixed(2)} (Fascia di Distribuzione 1SD). Lo strumento è surriscaldato e in territorio di ipercomprato ciclico. Considerare la presa di profitto parziale.`;
                } else {
                  activeMood = 'RED: Strong Sell';
                  activeMoodDesc = `Forecaster Advanced DPO a ${dpoVal.toFixed(2)} (Fascia Sovra-Bollinger 2SD). Forte sopravvalutazione ciclica. Ottimo punto di uscita tattico sul picco ciclico di breve termine.`;
                }
              } else if (activeIndicator === 'Wyckoff') {
                activeMood = wyckoffAnalysis.currentPhase;
                activeMoodDesc = `Modello Wyckoff: ${wyckoffAnalysis.details} (Segnale: ${wyckoffAnalysis.signal}, Affidabilità: ${wyckoffAnalysis.confidence})`;
              } else if (activeIndicator === 'Speed') {
                if (activeValCurrent < 85) {
                  activeMood = 'Rallentamento';
                  activeMoodDesc = `Velocità di trend ridotta (${activeValCurrent}). Bassa spinta direzionale, contrazione tipica della transizione di Wyckoff.`;
                } else if (activeValCurrent > 125) {
                  activeMood = 'Accelerazione';
                  activeMoodDesc = `Velocità di trend elevata (${activeValCurrent}). Forte momentum che supporta il Markup rialzista corrente.`;
                } else {
                  activeMood = 'Momento Lineare';
                  activeMoodDesc = `Velocità di trend bilanciata (${activeValCurrent}). Flusso direzionale ordinato senza accenni di esaurimento immediato.`;
                }
              }
              
              return (
                <div className="space-y-6 animate-fadeIn font-sans p-1">
                  
                  {/* EX-DIVIDEND ALERT BANNER */}
                  {assetDetails.exDividendDate && assetDetails.exDividendDate !== '---' && (
                    <div className="bg-[#b45309]/10 border border-[#d97706]/30 text-[#fbbf24] px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 select-none justify-between hover:bg-[#b45309]/15 transition duration-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#f59e0b] animate-pulse" />
                        <span>{daysToExDiv} days to ex-dividend date! ({assetDetails.exDividendDate})</span>
                      </div>
                      <button type="button" onClick={() => setActiveSegmentTab('Dividends')} className="text-[#f59e0b] hover:underline flex items-center gap-1 text-[11px] font-black uppercase bg-transparent border-none cursor-pointer">
                        Vedi Cedole <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {/* TWO MODULES: GAUGE + CONTROL TILES */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                    
                    {/* LEFT MODULE - SVG GAUGE (SPANS 5 COLS) */}
                    <div className="lg:col-span-5 bg-[#09101f] border border-[#172741] p-5 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#00c2ff]/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="text-center relative">
                        {/* Gauge Speedometer */}
                        <svg className="mx-auto" width="260" height="150" viewBox="0 0 280 160">
                          <defs>
                            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#10b981" /> {/* Green (Oversold) */}
                              <stop offset="35%" stopColor="#22c55e" />
                              <stop offset="50%" stopColor="#3b82f6" /> {/* Blue (Neutral) */}
                              <stop offset="65%" stopColor="#f59e0b" /> {/* Orange */}
                              <stop offset="100%" stopColor="#ef4444" /> {/* Red (Overbought) */}
                            </linearGradient>
                            <linearGradient id="needleCenterGrad" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#1e3a8a" />
                              <stop offset="100%" stopColor="#020617" />
                            </linearGradient>
                          </defs>
                          
                          {/* Semicircular background arc */}
                          <path d="M 30,140 A 110,110 0 0,1 250,140" fill="none" stroke="#16223b" strokeWidth="24" strokeLinecap="round" />
                          
                          {/* Inner dashed track */}
                          <path d="M 45,140 A 95,95 0 0,1 235,140" fill="none" stroke="#2c3a54" strokeWidth="1.5" strokeDasharray="5,6" />
                          
                          {/* Colored overlay track using linearGradient */}
                          <path d="M 30,140 A 110,110 0 0,1 250,140" fill="none" stroke="url(#gaugeGrad)" strokeWidth="24" strokeLinecap="round" strokeDasharray="380" strokeDashoffset={380 - (activePercent / 100) * 380} className="transition-all duration-1000 ease-out" />
                          
                          {/* Text labels rotating matching curves */}
                          <text x="56" y="94" textAnchor="middle" fill="#10b981" fontSize="7.5" fontWeight="black" fontFamily="monospace" transform="rotate(-55 56 94)">
                            {activeIndicator === 'DPO' ? 'GREEN: Strong Buy' : 'Oversold (Panic)'}
                          </text>
                          <text x="140" y="32" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="black" fontFamily="monospace">
                            {activeIndicator === 'DPO' ? 'BLUE: Hold' : 'Neutral'}
                          </text>
                          <text x="224" y="94" textAnchor="middle" fill="#ef4444" fontSize="7.5" fontWeight="black" fontFamily="monospace" transform="rotate(55 224 94)">
                            {activeIndicator === 'DPO' ? 'RED: Strong Sell' : 'Overbought (FOMO)'}
                          </text>
                          
                          {/* Tick Labels */}
                          <text x="32" y="152" textAnchor="middle" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">{activeIndicator === 'Speed' ? '0' : activeMin.toFixed(1)}</text>
                          <text x="86" y="152" textAnchor="middle" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">{activeIndicator === 'Speed' ? '50' : (activeMin * 0.5).toFixed(1)}</text>
                          <text x="194" y="152" textAnchor="middle" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">{activeIndicator === 'Speed' ? '150' : `+${(activeMax * 0.5).toFixed(1)}`}</text>
                          <text x="248" y="152" textAnchor="middle" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="monospace">{activeIndicator === 'Speed' ? '200' : `+${activeMax.toFixed(1)}`}</text>
                          
                          {/* Speedometer Needle cap & arm rotated */}
                          <polygon 
                            points="135,140 145,140 140,48" 
                            fill="#3b82f6" 
                            stroke="#2563eb" 
                            strokeWidth="1.5" 
                            strokeLinejoin="round" 
                            transform={`rotate(${(activePercent / 100) * 180 - 90} 140 140)`} 
                            className="transition-all duration-1000 ease-out origin-[140px_140px]"
                          />
                          <circle cx="140" cy="140" r="18" fill="url(#needleCenterGrad)" stroke="#3b82f6" strokeWidth="2" />
                          <circle cx="140" cy="140" r="6" fill="#020617" />
                        </svg>
                      </div>

                      {/* Horizontal slider matching gauge progress */}
                      <div className="mt-4 px-2">
                        <div className="relative h-2 w-full rounded-full bg-[#16223b] overflow-hidden">
                          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-sky-500 to-red-500" style={{ width: `${activePercent}%` }} />
                        </div>
                        <div className="mt-3 relative">
                          {/* Indicator handle bubble */}
                          <div 
                            className="absolute -top-6 h-5 w-5 rounded-full bg-slate-100 border-4 border-[#3b82f6] shadow-lg flex items-center justify-center transition-all duration-500"
                            style={{ left: `calc(${activePercent}% - 10px)` }}
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between text-[9px] font-black font-mono text-gray-500 uppercase">
                          <span>{activeIndicator === 'DPO' ? 'Green (Strong Buy)' : 'Green (Oversold)'}</span>
                          <span>{activeIndicator === 'DPO' ? 'Blue (Hold)' : 'Blue (Stable)'}</span>
                          <span>{activeIndicator === 'DPO' ? 'Red (Strong Sell)' : 'Red (FOMO Rush)'}</span>
                        </div>
                      </div>

                    </div>
                    
                    {/* RIGHT MODULE - TABS & MOOD STATS (SPANS 7 COLS) */}
                    <div className="lg:col-span-7 flex flex-col justify-between gap-4">
                      
                      {/* THREE INTERACTIVE TILES */}
                      <div className="grid grid-cols-3 gap-3">
                        
                        {/* DPO INDICATOR TILE */}
                        <button 
                          type="button"
                          onClick={() => setActiveIndicator('DPO')}
                          className={`p-4 rounded-2xl text-left border transition duration-300 relative overflow-hidden group/tile flex flex-col justify-between cursor-pointer ${
                            activeIndicator === 'DPO'
                              ? 'bg-[#0f1f3a] border-[#00c2ff] shadow-xl shadow-[#00c2ff]/5'
                              : 'bg-[#09101f] border-[#172741] hover:border-gray-500 hover:bg-[#0c1629]'
                          }`}
                        >
                          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00c2ff]/30 to-transparent opacity-0 group-hover/tile:opacity-100 transition" />
                          <span className="text-[10px] font-bold font-mono text-gray-400 block tracking-wide uppercase">Forecaster Advanced DPO</span>
                          <span className="text-2xl font-black text-white font-mono block mt-2 tracking-tight">
                            {dpoVal > 0 ? `+${dpoVal}` : dpoVal}
                          </span>
                          
                          {/* Micro sparks line */}
                          <div className="mt-3 h-1 w-full rounded-full bg-[#16223b] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-400 to-sky-450" style={{ width: `${Math.min(100, Math.max(0, ((dpoVal + 100)/200)*100))}%` }} />
                          </div>
                        </button>

                        {/* WYCKOFF TILE */}
                        <button 
                          type="button"
                          onClick={() => setActiveIndicator('Wyckoff')}
                          className={`p-4 rounded-2xl text-left border transition duration-300 relative overflow-hidden group/tile flex flex-col justify-between cursor-pointer ${
                            activeIndicator === 'Wyckoff'
                              ? 'bg-[#0f1f3a] border-[#00c2ff] shadow-xl shadow-[#00c2ff]/5'
                              : 'bg-[#09101f] border-[#172741] hover:border-gray-500 hover:bg-[#0c1629]'
                          }`}
                        >
                          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00c2ff]/30 to-transparent opacity-0 group-hover/tile:opacity-100 transition" />
                          <span className="text-[10px] font-bold font-mono text-gray-400 block tracking-wide uppercase">Wyckoff Wave</span>
                          <span className="text-2xl font-black text-white font-mono block mt-2 tracking-tight">
                            {wyckoffVal > 0 ? `+${wyckoffVal}` : wyckoffVal}
                          </span>
                          
                          {/* Micro sparks line */}
                          <div className="mt-3 h-1 w-full rounded-full bg-[#16223b] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-sky-400 to-amber-450" style={{ width: `${Math.min(100, Math.max(0, ((wyckoffVal + 100)/200)*100))}%` }} />
                          </div>
                        </button>

                        {/* SPEED INDICATOR TILE */}
                        <button 
                          type="button"
                          onClick={() => setActiveIndicator('Speed')}
                          className={`p-4 rounded-2xl text-left border transition duration-300 relative overflow-hidden group/tile flex flex-col justify-between cursor-pointer ${
                            activeIndicator === 'Speed'
                              ? 'bg-[#0f1f3a] border-[#00c2ff] shadow-xl shadow-[#00c2ff]/5'
                              : 'bg-[#09101f] border-[#172741] hover:border-gray-500 hover:bg-[#0c1629]'
                          }`}
                        >
                          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00c2ff]/30 to-transparent opacity-0 group-hover/tile:opacity-100 transition" />
                          <span className="text-[10px] font-bold font-mono text-gray-400 block tracking-wide uppercase">Trend Speed</span>
                          <span className="text-2xl font-black text-white font-mono block mt-2 tracking-tight">
                            {speedVal}
                          </span>
                          
                          {/* Micro sparks line */}
                          <div className="mt-3 h-1 w-full rounded-full bg-[#16223b] overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#00c2ff] to-rose-450" style={{ width: `${Math.min(100, Math.max(0, (speedVal/200)*100))}%` }} />
                          </div>
                        </button>

                      </div>

                       {/* MARKET MOOD METER DISPLAY HERO CARD */}
                      <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden shadow-lg">
                        <div className="absolute inset-y-0 left-0 w-1.5 bg-[#3b82f6]" />
                        <div className="flex items-start gap-3.5">
                          <div className="p-3.5 rounded-xl bg-[#1b2f51]/60 text-[#00c2ff] flex items-center justify-center border border-[#1d355c]">
                            <Info className="h-5 w-5 animate-pulse" />
                          </div>
                          <div>
                            <span className="text-[11px] font-black font-mono text-gray-500 uppercase tracking-widest block font-bold">Metrica Mood di Mercato</span>
                            <blockquote className="text-gray-200 text-sm font-sans font-medium mt-1 pr-4">
                              {activeMoodDesc}
                            </blockquote>
                          </div>
                        </div>

                        {/* Embedded Badge representing active mood status */}
                        <div className="shrink-0 flex flex-col items-center justify-center p-4 bg-[#111c33]/75 border border-[#213554] rounded-2xl text-center min-w-[150px]">
                          <span className="text-[9px] font-black font-mono text-sky-400 uppercase tracking-wider block">Market Mood Meter</span>
                          <div className="mt-2 text-2xl font-extrabold text-[#00c2ff]">
                            {activeMood.split(' ')[0]}
                          </div>
                          <span className="text-[9.5px] font-bold font-mono text-gray-400 block mt-2">Valore: {activeValCurrent > 0 ? `+${activeValCurrent}` : activeValCurrent}</span>
                        </div>
                      </div>

                      {/* DETTAGLIO ANALISI QUANTITATIVA WYCKOFF */}
                      <div className="bg-[#0b1329] border border-[#1e2d4d] p-5 rounded-2xl relative overflow-hidden shadow-lg flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4.5 w-4.5 text-[#00c2ff]" />
                            <span className="text-[10px] font-black font-mono text-[#00c2ff] uppercase tracking-wider block">
                              RILEVATORE QUANTITATIVO FASI DI WYCKOFF
                            </span>
                          </div>
                          
                          <div className={`px-2.5 py-1 rounded-xl text-[9.5px] font-black tracking-wider uppercase font-mono border ${
                            wyckoffAnalysis.signal === "BUY"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : wyckoffAnalysis.signal === "SELL"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}>
                            Segnale: {wyckoffAnalysis.signal}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="bg-[#050914] p-3 rounded-xl border border-[#15233c] text-center">
                            <span className="text-[9px] font-bold font-mono text-gray-500 uppercase tracking-tight block">Fase Corrente</span>
                            <span className="text-sm font-black text-white mt-1 block">
                              {wyckoffAnalysis.currentPhase}
                            </span>
                          </div>
                          <div className="bg-[#050914] p-3 rounded-xl border border-[#15233c] text-center">
                            <span className="text-[9px] font-bold font-mono text-gray-500 uppercase tracking-tight block">Accuratezza Modello</span>
                            <span className="text-sm font-black text-[#00c2ff] mt-1 block">
                              {wyckoffAnalysis.confidence}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-300 font-sans leading-relaxed pl-2.5 border-l-2 border-[#00c2ff]/30">
                          {wyckoffAnalysis.details}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* BOTTOM SECTION: CHART & TOOLBAR */}
                  <div className="bg-[#09101f] border border-[#172741] rounded-2xl p-4 shadow-xl select-none space-y-4">
                    
                    {/* TOOLBAR CONTROLS HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#14233c]">
                      
                      {/* Left Side Tab title */}
                      <div className="flex items-center gap-2">
                        <button type="button" className="px-3.5 py-1.5 rounded-xl bg-[#1d355c] text-white font-extrabold text-[11px] tracking-wide uppercase border border-[#00c2ff]/30 flex items-center gap-1.5 select-none pointer-events-none">
                          <span>{activeLabel}</span>
                          <Info className="h-3.5 w-3.5 text-gray-400" />
                        </button>
                      </div>

                      {/* Right side interactive tools */}
                      <div className="flex flex-wrap items-center gap-2">
                        
                        {/* Timeframe selector items */}
                        <div className="flex rounded-lg bg-[#050811] p-0.5 border border-[#14233c]">
                          {(['10Y', '5Y', '3Y', '1Y', '6M', '1M'] as const).map((tf) => {
                            const isSelected = indicatorTimeframe === tf;
                            return (
                              <button
                                key={tf}
                                type="button"
                                onClick={() => setIndicatorTimeframe(tf)}
                                className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-tight transition cursor-pointer ${
                                  isSelected 
                                    ? 'bg-[#00c2ff] text-slate-950 font-black' 
                                    : 'text-gray-400 hover:text-white'
                                }`}
                              >
                                {tf}
                              </button>
                            );
                          })}
                        </div>

                        {/* Chart visual types */}
                        <div className="flex rounded-lg bg-[#050811] p-0.5 border border-[#14233c]">
                          {(['Line', 'Area', 'Candle'] as const).map((mode) => {
                            const isSelected = indicatorChartMode === mode;
                            return (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => setIndicatorChartMode(mode)}
                                className={`px-2 py-1 rounded text-[10px] font-bold tracking-tight transition cursor-pointer flex items-center justify-center gap-1 ${
                                  isSelected ? 'bg-[#1b2f51] text-white border-b border-[#00c2ff]' : 'text-gray-400 hover:text-white'
                                }`}
                              >
                                {mode === 'Line' && <LineIcon className="h-3 w-3" />}
                                {mode === 'Area' && <BarChart3 className="h-3 w-3" />}
                                {mode === 'Candle' && <Layers className="h-3 w-3" />}
                                {mode}
                              </button>
                            );
                          })}
                        </div>

                        {/* Tooltip visualization toggling */}
                        <button
                          type="button"
                          onClick={() => setIndicatorTooltipEnabled(!indicatorTooltipEnabled)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 text-[10px] font-bold leading-none ${
                            indicatorTooltipEnabled 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                              : 'bg-transparent border-[#14233c] text-gray-400 hover:text-white'
                          }`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Tooltip {indicatorTooltipEnabled ? 'ON' : 'OFF'}</span>
                        </button>

                        {/* Auxiliary buttons */}
                        <div className="flex gap-1">
                          <button type="button" onClick={() => setIndicatorHoveredIndex(null)} className="p-1.5 rounded-lg border border-[#14233c] text-gray-400 hover:text-white hover:bg-slate-900 cursor-pointer bg-transparent">
                            <RotateCw className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg border border-[#14233c] text-gray-400 hover:text-white hover:bg-slate-900 cursor-pointer bg-transparent">
                            <ArrowLeft className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg border border-[#14233c] text-gray-400 hover:text-white hover:bg-slate-900 cursor-pointer bg-transparent">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* DUAL LINE & VOLUME BAR CHART CANVAS (RESPONSIVE SVG CANVAS) */}
                    <div className="relative w-full h-80 bg-[#050811] border border-[#14233c] rounded-xl p-3 overflow-hidden select-none">
                      
                      {/* Ambient background glow */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-44 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
                      
                      {/* Grid background + charts */}
                      {(() => {
                        const width = 800;
                        const height = 290;
                        const mainChartHeight = 180;
                        const bottomChartY = 210;
                        const bottomChartHeight = 70;
                        const paddingX = 45;
                        const paddingY = 15;

                        // Find min/max for scaling
                        const prices = chartData.map(pt => pt.price);
                        const maxPrice = Math.max(...prices);
                        const minPrice = Math.min(...prices);
                        const priceDelta = maxPrice - minPrice || 1.0;

                        // Normalize active indicator values
                        const indValues = chartData.map(pt => pt[activeIndicator === 'DPO' ? 'dpo' : activeIndicator === 'Wyckoff' ? 'wyckoff' : 'speed']);
                        const maxInd = Math.max(...indValues, 10);
                        const minInd = Math.min(...indValues, -10);
                        const indDelta = maxInd - minInd || 1.0;
                        const maxAbsInd = activeIndicator !== 'Speed'
                          ? Math.max(...indValues.map(v => Math.abs(v)), 1.0)
                          : 1.0;

                        // Calculate visual coordinates for points
                        const points = chartData.map((pt, index) => {
                          const x = paddingX + (index / (chartData.length - 1)) * (width - paddingX * 2);
                          // price scale (y goes down as value goes up)
                          const yPrice = paddingY + (1 - (pt.price - minPrice) / priceDelta) * (mainChartHeight - paddingY * 2);
                          
                          // indicator values
                          const indVal = pt[activeIndicator === 'DPO' ? 'dpo' : activeIndicator === 'Wyckoff' ? 'wyckoff' : 'speed'];
                          
                          let yInd = bottomChartY + bottomChartHeight / 2;
                          if (activeIndicator !== 'Speed') {
                            yInd = bottomChartY + (bottomChartHeight / 2) - (indVal / maxAbsInd) * (bottomChartHeight / 2);
                          } else {
                            const minSp = Math.min(...chartData.map(p => p.speed), 0);
                            const maxSp = Math.max(...chartData.map(p => p.speed), 200);
                            const spDelta = maxSp - minSp || 1.0;
                            yInd = bottomChartY + bottomChartHeight - ((indVal - minSp) / spDelta) * bottomChartHeight;
                          }

                          return {
                            x,
                            yPrice,
                            yInd,
                            ptPrice: pt.price,
                            ptInd: indVal,
                            ptDate: pt.date
                          };
                        });

                        // Trace standard SVG paths
                        let pathD = "";
                        if (points.length > 0) {
                          pathD = `M ${points[0].x},${points[0].yPrice} ` + points.slice(1).map(p => `L ${p.x},${p.yPrice}`).join(" ");
                        }

                        // Trace area path if area mode is selected
                        let areaD = "";
                        if (points.length > 0 && indicatorChartMode === 'Area') {
                          areaD = `M ${points[0].x},${mainChartHeight} ` + points.map(p => `L ${p.x},${p.yPrice}`).join(" ") + ` L ${points[points.length - 1].x},${mainChartHeight} Z`;
                        }

                        // Horizontal guide line values
                        const guides = [
                          minPrice,
                          minPrice + priceDelta * 0.33,
                          minPrice + priceDelta * 0.66,
                          maxPrice
                        ];

                        const hoveredPt = indicatorHoveredIndex !== null && points[indicatorHoveredIndex] ? points[indicatorHoveredIndex] : null;

                        return (
                          <div className="w-full h-full relative cursor-crosshair"
                            onMouseMove={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              // Estimate nearest dataset index
                              const relativeX = e.clientX - rect.left - paddingX;
                              const stepWidth = (rect.width - paddingX * 2) / (chartData.length - 1);
                              let nearestIndex = Math.round(relativeX / stepWidth);
                              if (nearestIndex < 0) nearestIndex = 0;
                              if (nearestIndex >= chartData.length) nearestIndex = chartData.length - 1;
                              setIndicatorHoveredIndex(nearestIndex);
                            }}
                            onMouseLeave={() => setIndicatorHoveredIndex(null)}
                          >
                            <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                              
                              <defs>
                                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" /> {/* Red FOMO top */}
                                  <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.85" /> {/* Orange warning */}
                                  <stop offset="65%" stopColor="#3b82f6" strokeOpacity="0.85" /> {/* Blue Neutral */}
                                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.95" /> {/* Green Oversold */}
                                </linearGradient>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#3182ce" stopOpacity="0.30"/>
                                  <stop offset="100%" stopColor="#3182ce" stopOpacity="0.00"/>
                                </linearGradient>
                              </defs>

                              {/* Horizontal Cartesian Grid lines */}
                              {guides.map((gVal, idx) => {
                                const yCoord = paddingY + (1 - (gVal - minPrice) / priceDelta) * (mainChartHeight - paddingY * 2);
                                return (
                                  <g key={idx}>
                                    <line x1={paddingX} y1={yCoord} x2={width - paddingX} y2={yCoord} stroke="#172236" strokeWidth="1" strokeDasharray="3,3" />
                                    {/* Left Price labels */}
                                    <text x={paddingX - 8} y={yCoord + 3} textAnchor="end" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="monospace">
                                      {gVal.toFixed(2)}
                                    </text>
                                  </g>
                                );
                              })}

                              {/* Background color-coded zones for Bollinger Bands of Forecaster Advanced DPO */}
                              {activeIndicator === 'DPO' && (() => {
                                const yCenter = bottomChartY + bottomChartHeight / 2;
                                const yUpper2 = yCenter - 0.70 * (bottomChartHeight / 2);
                                const yUpper1 = yCenter - 0.35 * (bottomChartHeight / 2);
                                const yLower1 = yCenter + 0.35 * (bottomChartHeight / 2);
                                const yLower2 = yCenter + 0.70 * (bottomChartHeight / 2);
                                return (
                                  <g opacity="0.10">
                                    {/* RED: Strong Sell Zone (above +2SD) */}
                                    <rect x={paddingX} y={bottomChartY} width={width - paddingX * 2} height={yUpper2 - bottomChartY} fill="#ef4444" />
                                    {/* ORANGE: Sell Zone (between +1SD and +2SD) */}
                                    <rect x={paddingX} y={yUpper2} width={width - paddingX * 2} height={yUpper1 - yUpper2} fill="#f59e0b" />
                                    {/* BLUE: Hold Zone (between -1SD and +1SD) */}
                                    <rect x={paddingX} y={yUpper1} width={width - paddingX * 2} height={yLower1 - yUpper1} fill="#3b82f6" />
                                    {/* GREEN (Light/Strong): Buy & Strong Buy Zone (below -1SD) */}
                                    <rect x={paddingX} y={yLower1} width={width - paddingX * 2} height={(bottomChartY + bottomChartHeight) - yLower1} fill="#10b981" />
                                  </g>
                                );
                              })()}

                              {/* Bottom Chart Zero baseline and limits */}
                              {activeIndicator !== 'Speed' ? (
                                <>
                                  <line x1={paddingX} y1={bottomChartY} x2={width - paddingX} y2={bottomChartY} stroke="#172236" strokeDasharray="3,3" strokeWidth="1" />
                                  <text x={paddingX - 8} y={bottomChartY + 3} textAnchor="end" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="monospace">
                                    +{maxAbsInd.toFixed(1)}
                                  </text>
                                  
                                  <line x1={paddingX} y1={bottomChartY + bottomChartHeight / 2} x2={width - paddingX} y2={bottomChartY + bottomChartHeight / 2} stroke="#2c3a54" strokeWidth="1" />
                                  <text x={paddingX - 8} y={bottomChartY + bottomChartHeight/2 + 3} textAnchor="end" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="monospace">0.00</text>
                                  
                                  <line x1={paddingX} y1={bottomChartY + bottomChartHeight} x2={width - paddingX} y2={bottomChartY + bottomChartHeight} stroke="#172236" strokeDasharray="3,3" strokeWidth="1" />
                                  <text x={paddingX - 8} y={bottomChartY + bottomChartHeight + 3} textAnchor="end" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="monospace">
                                    -{maxAbsInd.toFixed(1)}
                                  </text>

                                  {/* Visual Bollinger Bands guides applied to Forecaster Advanced DPO */}
                                  {activeIndicator === 'DPO' && (
                                    <>
                                      {/* BB Upper Outer +2SD */}
                                      <line x1={paddingX} y1={bottomChartY + (bottomChartHeight / 2) - 0.70 * (bottomChartHeight / 2)} x2={width - paddingX} y2={bottomChartY + (bottomChartHeight / 2) - 0.70 * (bottomChartHeight / 2)} stroke="#ef4444" strokeDasharray="3,3" strokeWidth="1" opacity="0.6" />
                                      <text x={width - paddingX - 10} y={bottomChartY + (bottomChartHeight / 2) - 0.70 * (bottomChartHeight / 2) - 3} textAnchor="end" fill="#ef4444" fontSize="7.5" fontWeight="black" fontFamily="monospace">BB +2SD (Strong Sell Zone)</text>

                                      {/* BB Upper Inner +1SD */}
                                      <line x1={paddingX} y1={bottomChartY + (bottomChartHeight / 2) - 0.35 * (bottomChartHeight / 2)} x2={width - paddingX} y2={bottomChartY + (bottomChartHeight / 2) - 0.35 * (bottomChartHeight / 2)} stroke="#f59e0b" strokeDasharray="2,2" strokeWidth="0.8" opacity="0.5" />
                                      <text x={width - paddingX - 10} y={bottomChartY + (bottomChartHeight / 2) - 0.35 * (bottomChartHeight / 2) - 3} textAnchor="end" fill="#f59e0b" fontSize="7" fontWeight="bold" fontFamily="monospace">BB +1SD (Sell Zone)</text>

                                      {/* BB Lower Inner -1SD */}
                                      <line x1={paddingX} y1={bottomChartY + (bottomChartHeight / 2) + 0.35 * (bottomChartHeight / 2)} x2={width - paddingX} y2={bottomChartY + (bottomChartHeight / 2) + 0.35 * (bottomChartHeight / 2)} stroke="#22c55e" strokeDasharray="2,2" strokeWidth="0.8" opacity="0.5" />
                                      <text x={width - paddingX - 10} y={bottomChartY + (bottomChartHeight / 2) + 0.35 * (bottomChartHeight / 2) + 10} textAnchor="end" fill="#22c55e" fontSize="7" fontWeight="bold" fontFamily="monospace">BB -1SD (Buy Zone)</text>

                                      {/* BB Lower Outer -2SD */}
                                      <line x1={paddingX} y1={bottomChartY + (bottomChartHeight / 2) + 0.70 * (bottomChartHeight / 2)} x2={width - paddingX} y2={bottomChartY + (bottomChartHeight / 2) + 0.70 * (bottomChartHeight / 2)} stroke="#10b981" strokeDasharray="3,3" strokeWidth="1" opacity="0.6" />
                                      <text x={width - paddingX - 10} y={bottomChartY + (bottomChartHeight / 2) + 0.70 * (bottomChartHeight / 2) + 10} textAnchor="end" fill="#10b981" fontSize="7.5" fontWeight="bold" fontFamily="monospace">BB -2SD (Strong Buy Zone)</text>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  <line x1={paddingX} y1={bottomChartY} x2={width - paddingX} y2={bottomChartY} stroke="#172236" strokeDasharray="3,3" strokeWidth="1" />
                                  <text x={paddingX - 8} y={bottomChartY + 3} textAnchor="end" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="monospace">
                                    {Math.max(...chartData.map(p => p.speed), 200).toFixed(1)}
                                  </text>
                                  
                                  <line x1={paddingX} y1={bottomChartY + bottomChartHeight / 2} x2={width - paddingX} y2={bottomChartY + bottomChartHeight / 2} stroke="#172236" strokeDasharray="3,3" strokeWidth="1" />
                                  <text x={paddingX - 8} y={bottomChartY + bottomChartHeight/2 + 3} textAnchor="end" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="monospace">
                                    {((Math.max(...chartData.map(p => p.speed), 200) + Math.min(...chartData.map(p => p.speed), 0)) / 2).toFixed(1)}
                                  </text>
                                  
                                  <line x1={paddingX} y1={bottomChartY + bottomChartHeight} x2={width - paddingX} y2={bottomChartY + bottomChartHeight} stroke="#172236" strokeDasharray="3,3" strokeWidth="1" />
                                  <text x={paddingX - 8} y={bottomChartY + bottomChartHeight + 3} textAnchor="end" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="monospace">
                                    {Math.min(...chartData.map(p => p.speed), 0).toFixed(1)}
                                  </text>
                                </>
                              )}

                              {/* A flowing elegant trendline overlay specifically for the DPO oscillator path */}
                              {activeIndicator === 'DPO' && (() => {
                                const dpoPathD = points.length > 0 ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.yInd}`).join(" ") : "";
                                return (
                                  <path 
                                    d={dpoPathD} 
                                    stroke="#ffffff" 
                                    strokeWidth="1.6" 
                                    fill="none" 
                                    opacity="0.90"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]"
                                  />
                                );
                              })()}
                              
                              {/* Bottom Oscillators: DPO or Wyckoff rect blocks */}
                              {points.map((p, idx) => {
                                const isPositive = p.ptInd >= 0;
                                const barWidth = Math.max(2, (width - paddingX * 2) / chartData.length * 0.6);
                                const xOffset = p.x - barWidth / 2;
                                
                                let yOrigin = bottomChartY + bottomChartHeight / 2;
                                let barHeight = 0;
                                
                                if (activeIndicator !== 'Speed') {
                                  barHeight = Math.abs(p.yInd - yOrigin);
                                  yOrigin = isPositive ? p.yInd : yOrigin;
                                } else {
                                  yOrigin = p.yInd;
                                  barHeight = (bottomChartY + bottomChartHeight) - p.yInd;
                                }

                                let barColor = '#3b82f6';
                                if (activeIndicator === 'Speed') {
                                  barColor = '#3182ce';
                                } else if (activeIndicator === 'DPO') {
                                  const valRatio = p.ptInd / maxAbsInd;
                                  if (valRatio < -0.70) {
                                    barColor = '#10b981'; // GREEN - Strong Buy
                                  } else if (valRatio >= -0.70 && valRatio < -0.35) {
                                    barColor = '#22c55e'; // GREEN/Light green - Buy
                                  } else if (valRatio >= -0.35 && valRatio <= 0.35) {
                                    barColor = '#3b82f6'; // BLUE - Hold
                                  } else if (valRatio > 0.35 && valRatio < 0.70) {
                                    barColor = '#f59e0b'; // ORANGE - Sell
                                  } else {
                                    barColor = '#ef4444'; // RED - Strong Sell
                                  }
                                } else {
                                  barColor = isPositive ? '#10b981' : '#ef4444';
                                }

                                return (
                                  <rect
                                    key={idx}
                                    x={xOffset}
                                    y={yOrigin}
                                    width={barWidth}
                                    height={Math.max(1, barHeight)}
                                    fill={barColor}
                                    opacity={indicatorHoveredIndex === idx ? 1.0 : 0.65}
                                    rx="1"
                                  />
                                );
                              })}

                              {/* Price Area chart underfill if active */}
                              {areaD && (
                                <path d={areaD} fill="url(#areaGrad)" />
                              )}

                              {/* Multi-colored Price line path leveraging vertical color-changing gradient */}
                              {pathD && (
                                <path d={pathD} fill="none" stroke="url(#priceGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              )}

                              {/* X Axis Date labels at the very bottom */}
                              {points.filter((_, i) => i % Math.ceil(chartData.length / 6) === 0).map((p, idx) => (
                                <g key={idx}>
                                  <line x1={p.x} y1={height - 22} x2={p.x} y2={height - 26} stroke="#172236" />
                                  <text x={p.x} y={height - 8} textAnchor="middle" fill="#4a5568" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                                    {p.ptDate}
                                  </text>
                                </g>
                              ))}

                              {/* Cursor Tracking Crosshair Vertical Line on Hover */}
                              {hoveredPt && (
                                <g>
                                  <line x1={hoveredPt.x} y1={0} x2={hoveredPt.x} y2={height - 20} stroke="#3182ce" strokeWidth="1.5" strokeDasharray="4,4" />
                                  <circle cx={hoveredPt.x} cy={hoveredPt.yPrice} r="5" fill="#3182ce" stroke="#ffffff" strokeWidth="1.5" />
                                  <circle cx={hoveredPt.x} cy={hoveredPt.yInd} r="3.5" fill="#9f7aea" stroke="#ffffff" strokeWidth="1" />
                                </g>
                              )}
                            </svg>

                            {/* HOVER FLOOR TOOLTIP POPUP OVERLAY */}
                            {indicatorTooltipEnabled && hoveredPt && (
                              <div 
                                className="absolute bg-[#0b1329]/95 border border-[#1b2e4c] text-white p-3 rounded-xl shadow-2xl z-25 font-sans pointer-events-none space-y-1 w-44 animate-fadeIn"
                                style={{
                                  left: `${hoveredPt.x > width * 0.7 ? hoveredPt.x / width * 100 - 45 : hoveredPt.x / width * 100 + 3}%`,
                                  top: '15%'
                                }}
                              >
                                <span className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-wide block">{hoveredPt.ptDate}</span>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-400 text-[10.5px]">Price:</span>
                                  <strong className="text-white font-mono text-[11px]">€{hoveredPt.ptPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</strong>
                                </div>
                                <div className="flex items-center justify-between pt-0.5 border-t border-[#13233c]">
                                  <span className="text-gray-400 text-[10.5px]">{activeLabel}:</span>
                                  <strong className="font-mono text-[11px]" style={{
                                    color: activeIndicator === 'Speed' ? '#63b3ed' : hoveredPt.ptInd >= 0 ? '#48bb78' : '#f56565'
                                  }}>
                                    {hoveredPt.ptInd > 0 ? `+${hoveredPt.ptInd}` : hoveredPt.ptInd}
                                  </strong>
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })()}

                    </div>
                    
                    {/* Footnote matching real market indicator definitions */}
                    <div className="flex items-center gap-1.5 text-[9.5px] text-gray-400 font-medium">
                      <span className="text-[#00c2ff]">●</span>
                      <span>Gli indicatori oscillano dinamicamente per calcolare i punti di svolta macro, trend di accumulo/distribuzione Wyckoff e coefficienti di ipercomprato. Il Fair Value è calibrato in tempo reale.</span>
                    </div>

                  </div>

                </div>
              );
            })()}

            {/* FALLBACK FOR OTHER COGNITIVE SEGMENTS */}
            {activeSegmentTab !== 'Overview' && activeSegmentTab !== 'Seasonality' && activeSegmentTab !== 'Overbought/Oversold' && activeSegmentTab !== 'Fundamentals' && (
              <div className="bg-[#09101f] border border-[#172741] p-10 rounded-2xl text-center space-y-4 animate-fadeIn font-mono">
                <div className="inline-flex p-3 bg-slate-900 border border-[#1c2e4f] rounded-full text-amber-500">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-white text-[13px] font-black uppercase tracking-wider">
                    Analisi Cognitiva AI in Preparazione ({activeSegmentTab})
                  </h3>
                  <p className="text-gray-400 text-[11px] font-sans max-w-md mx-auto leading-relaxed">
                    I nostri agenti AI stanno raccogliendo ed elaborando dati in tempo reale per la sezione <strong className="text-[#00c2ff]">{activeSegmentTab}</strong> di <strong className="text-white">{assetDetails.name} ({assetDetails.ticker})</strong>. 
                  </p>
                </div>
                <div className="flex justify-center gap-2 max-w-sm mx-auto pt-2">
                  <button
                    type="button"
                    onClick={() => handleTriggerAiPrompt("Full Analysis")}
                    className="w-full bg-[#1b2f51]/60 hover:bg-[#00c2ff]/30 text-white hover:text-slate-950 font-sans font-bold text-[10.5px] py-2 rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Chiedi all'Agente AI
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSegmentTab('Overview')}
                    className="w-full border border-[#1b2e4c] hover:border-[#00c2ff]/55 text-gray-300 hover:text-white font-sans font-bold text-[10.5px] py-2 rounded-lg transition-all duration-150 cursor-pointer uppercase"
                  >
                    Torna alla Panoramica
                  </button>
                </div>
              </div>
            )}

            {/* FUNDAMENTALS SEGMENT TAB CONTENT */}
            {activeSegmentTab === 'Fundamentals' && (() => {
              const currentCurrencySym = assetDetails.currency === 'USD' ? '$' : '€';

              // Sparklines renderer helper for visual financial sheets rows
              const renderSparkline = (values: number[], color: string = '#00c2ff') => {
                if (values.length <= 1) return null;
                const max = Math.max(...values);
                const min = Math.min(...values);
                const range = max - min === 0 ? 1 : max - min;
                
                const width = 60;
                const height = 18;
                const points = values.map((val, idx) => {
                  const x = (idx / (values.length - 1)) * width;
                  const y = height - ((val - min) / range) * height;
                  return `${x},${y}`;
                }).join(' ');

                return (
                  <svg className="overflow-visible inline-block shrink-0" width={width} height={height}>
                    <polyline
                      fill="none"
                      stroke={color}
                      strokeWidth="1.8"
                      points={points}
                    />
                    <circle
                      cx={width}
                      cy={height - ((values[values.length - 1] - min) / range) * height}
                      r="2"
                      fill={color}
                    />
                  </svg>
                );
              };

              // Data validation layer: resolve active data history and compile audit reports
              const activeHistory = financialHighlightsToggle === 'Quarterly'
                ? getQuarterlyHistory(assetDetails.financialHistory)
                : assetDetails.financialHistory;

              const validationIssues = performFinancialAudits(activeHistory, financialHighlightsToggle === 'Quarterly');
              const hasAlerts = validationIssues.length > 0;

              return (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* THREE-WAY SUB-TAB NAVIGATION */}
                  <div className="flex border-b border-[#172741] gap-1 select-none">
                    {[
                      { id: 'Analysis', label: 'Analisi KPI & Grafici', icon: BarChart3 },
                      { id: 'Financial Statements', label: 'Rendiconti Finanziari', icon: Landmark },
                      { id: 'Transcripts', label: 'AI Transcripts (Call)', icon: Sparkles }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveStatementTab(tab.id as any)}
                          className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider rounded-t-xl transition-all duration-200 flex items-center gap-2 border-t-2 ${
                            activeStatementTab === tab.id
                              ? 'bg-[#09101f] border-t-[#00c2ff] text-[#00c2ff] font-extrabold shadow-[0_-4px_12px_rgba(0,194,255,0.05)]'
                              : 'border-t-transparent text-gray-400 hover:text-white hover:bg-[#121f37]/30'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* ACTIVE VIEW CARD ROTOR */}
                  
                  {/* TAB 1: VISUAL KPI ANALYSIS & PERFORMANCE GRAPHICS */}
                  {activeStatementTab === 'Analysis' && (
                    <div className="space-y-5">
                      
                      {/* SECTION: FINANCIAL HIGHLIGHTS WITH ANUAL / QUARTERLY TOGGLE */}
                      <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-[#14233c] gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-[#00c2ff]/10 p-2 rounded-lg border border-[#00c2ff]/20">
                              <BarChart3 className="h-4 w-4 text-[#00c2ff]" />
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-[#00c2ff] font-bold block uppercase tracking-widest leading-none mb-1">STRUTTURA ECONOMICA</span>
                              <h3 className="text-white text-[13px] font-extrabold uppercase tracking-wide">
                                Financial Highlights (Simulatore Bilanci)
                              </h3>
                            </div>
                          </div>
                          
                          <div className="flex bg-[#050812] border border-[#14233c] p-0.5 rounded-lg select-none self-end sm:self-auto">
                            <button 
                              type="button"
                              onClick={() => setFinancialHighlightsToggle('Annual')}
                              className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-md transition-all duration-150 ${financialHighlightsToggle === 'Annual' ? 'bg-[#00c2ff] text-slate-950 font-extrabold' : 'text-gray-400 hover:text-white'}`}
                            >
                              Annual
                            </button>
                            <button 
                              type="button"
                              onClick={() => setFinancialHighlightsToggle('Quarterly')}
                              className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-md transition-all duration-150 ${financialHighlightsToggle === 'Quarterly' ? 'bg-[#00c2ff] text-slate-950 font-extrabold' : 'text-gray-400 hover:text-white'}`}
                            >
                              Quarterly
                            </button>
                          </div>
                        </div>

                        {/* DATA AUDITOR & QUALITY GUARD AUDIT REPORT */}
                        {hasAlerts && (
                          <div className="bg-amber-950/15 border border-amber-500/20 p-4 rounded-xl space-y-3 font-sans">
                            <div className="flex items-center justify-between border-b border-amber-500/10 pb-2">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500 animate-pulse shrink-0" />
                                <div>
                                  <strong className="text-white text-xs block font-bold">Data Quality & Validation Audit State</strong>
                                  <span className="text-[10.5px] text-amber-400/80 font-mono">
                                    Rilevate {validationIssues.length} segnalazioni sulla coerenza e integrità dei bilanci.
                                  </span>
                                </div>
                              </div>
                              <span className="text-[8.5px] font-mono text-amber-400 border border-amber-500/25 bg-amber-500/5 px-2 py-0.5 rounded font-black uppercase">
                                Audit Attivo
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] leading-relaxed">
                              {validationIssues.map((issue) => (
                                <div key={issue.id} className="flex gap-2 p-2.5 rounded-lg bg-[#050812]/50 border border-[#14233c] transition-colors hover:border-amber-500/20">
                                  <div className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${issue.severity === 'warning' ? 'bg-amber-400 animate-pulse' : 'bg-blue-400'}`} />
                                  <div>
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                      <span className="font-bold text-gray-200">{issue.message}</span>
                                      {issue.period && (
                                        <span className="text-[8px] font-mono font-bold text-[#00c2ff] border border-[#00c2ff]/25 bg-[#00c2ff]/5 px-1 rounded">
                                          {issue.period}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-gray-400">{issue.details}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* REFINED FINANCIAL DYNAMIC CHARTS GRID */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                          
                          {/* Left Chart: Composed Sales / Net Income / Free Cash Flow */}
                          <div className="bg-[#050812] border border-[#14233c] p-4 rounded-xl flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-3 select-none">
                              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                                📊 Ricavi, Reddito Netto & Cassa operativa ({currentCurrencySym}/B)
                              </span>
                              <span className="text-[8.5px] font-mono text-[#00c2ff] font-bold border border-[#00c2ff]/20 bg-[#00c2ff]/5 px-1.5 py-0.5 rounded uppercase">KPI Economici</span>
                            </div>
                            
                            <div className="h-52 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart 
                                  data={activeHistory}
                                  margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                                >
                                  <defs>
                                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#00c2ff" stopOpacity={0.25}/>
                                      <stop offset="100%" stopColor="#00c2ff" stopOpacity={0.00}/>
                                    </linearGradient>
                                    <linearGradient id="netIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#00e5a0" stopOpacity={0.95}/>
                                      <stop offset="100%" stopColor="#009e6c" stopOpacity={0.25}/>
                                    </linearGradient>
                                    <linearGradient id="cashFlowGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.95}/>
                                      <stop offset="100%" stopColor="#b45309" stopOpacity={0.25}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" opacity={0.4} vertical={false} />
                                  <XAxis dataKey="year" stroke="#4a5568" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                                  <YAxis stroke="#4a5568" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: '#09101f', 
                                      borderColor: '#172741', 
                                      borderRadius: '10px', 
                                      color: '#fff', 
                                      fontSize: '11px', 
                                      fontFamily: 'monospace',
                                      boxShadow: '0 8px 30px rgb(0 0 0 / 0.7)'
                                    }} 
                                    formatter={(value) => [`${currentCurrencySym}${Number(value).toFixed(1)}B`, '']}
                                    itemStyle={{ color: '#fff' }}
                                  />
                                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px', fontFamily: 'monospace', opacity: 0.8 }} />
                                  <Area type="monotone" dataKey="sales" name="Fatturato (Sales)" stroke="#00c2ff" strokeWidth={2.2} fillOpacity={1} fill="url(#salesGrad)" />
                                  <Bar dataKey="netIncome" name="Utile Netto" fill="url(#netIncomeGrad)" radius={[3, 3, 0, 0]} maxBarSize={16} />
                                  <Bar dataKey="cashFlow" name="FCF Cassa" fill="url(#cashFlowGrad)" radius={[3, 3, 0, 0]} maxBarSize={16} />
                                </ComposedChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Right Chart: Custom Dual Y-Axis Debt / Equity & Profit Margin */}
                          <div className="bg-[#050812] border border-[#14233c] p-4 rounded-xl flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-3 select-none">
                              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                                📈 Dual-Axis: Leva Debito & Margine Netto (%)
                              </span>
                              <span className="text-[8.5px] font-mono text-purple-400 font-bold border border-purple-500/20 bg-purple-500/5 px-1.5 py-0.5 rounded uppercase">Dual Axis KPI</span>
                            </div>
                            
                            <div className="h-52 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart 
                                  data={activeHistory}
                                  margin={{ top: 10, right: -5, left: -25, bottom: 0 }}
                                >
                                  <defs>
                                    <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#ff3d6b" stopOpacity={0.95}/>
                                      <stop offset="100%" stopColor="#9f1239" stopOpacity={0.25}/>
                                    </linearGradient>
                                    <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.95}/>
                                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.25}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" opacity={0.4} vertical={false} />
                                  <XAxis dataKey="year" stroke="#4a5568" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                                  
                                  {/* Left axis for Billion numbers */}
                                  <YAxis yAxisId="moneyAxis" stroke="#4a5568" style={{ fontSize: '9px', fontFamily: 'monospace' }} tickFormatter={(val) => `${currentCurrencySym}${val}B`} />
                                  
                                  {/* Right axis for percentage margin */}
                                  <YAxis yAxisId="percentAxis" orientation="right" stroke="#a855f7" style={{ fontSize: '9px', fontFamily: 'monospace' }} tickFormatter={(val) => `${val}%`} />
                                  
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: '#09101f', 
                                      borderColor: '#172741', 
                                      borderRadius: '10px', 
                                      color: '#fff', 
                                      fontSize: '11px', 
                                      fontFamily: 'monospace',
                                      boxShadow: '0 8px 30px rgb(0 0 0 / 0.7)'
                                    }} 
                                    formatter={(value, name) => {
                                      if (name === 'Margine Netto (%)') return [`${Number(value).toFixed(1)}%`, name];
                                      return [`${currentCurrencySym}${Number(value).toFixed(1)}B`, name];
                                    }}
                                  />
                                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px', fontFamily: 'monospace', opacity: 0.8 }} />
                                  <Bar yAxisId="moneyAxis" dataKey="debt" name="Debito Totale" fill="url(#debtGrad)" radius={[3, 3, 0, 0]} maxBarSize={16} />
                                  <Bar yAxisId="moneyAxis" dataKey="equity" name="Patrimonio Netto" fill="url(#equityGrad)" radius={[3, 3, 0, 0]} maxBarSize={16} />
                                  <Line yAxisId="percentAxis" type="monotone" dataKey="margin" name="Margine Netto (%)" stroke="#a855f7" strokeWidth={2.4} dot={{ r: 3, fill: '#120d24', stroke: '#a855f7', strokeWidth: 1.5 }} activeDot={{ r: 5, strokeWidth: 2 }} />
                                </ComposedChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                        </div>

                        {/* KPI SUMMARY RAW METRICS MINI-TABLE - WITH HIGHLIGHTS AND DYNAMIC COMPREHENSION */}
                        <div className="border-t border-[#14233c] pt-4 overflow-x-auto">
                          <table className="w-full text-left font-mono text-[10.5px] border-collapse select-none">
                            <thead>
                              <tr className="border-b border-[#14233c] text-gray-500 uppercase text-[8.5px] tracking-wider">
                                <th className="pb-2">Periodo</th>
                                <th className="pb-2 text-right">Ricavi ({currentCurrencySym}/B)</th>
                                <th className="pb-2 text-right">Utile Netto ({currentCurrencySym}/B)</th>
                                <th className="pb-2 text-right">FCF ({currentCurrencySym}/B)</th>
                                <th className="pb-2 text-right">M. Netto (%)</th>
                                <th className="pb-2 text-right">Cash-to-Debt Ratio</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeHistory.slice(financialHighlightsToggle === 'Quarterly' ? -6 : -4).map((pt: any) => {
                                const cashToDebt = pt.debt > 0 ? (pt.cashFlow / pt.debt).toFixed(2) : '∞';
                                
                                // Fetch cell issues to render warnings
                                const rowIssues = validationIssues.filter(i => i.period === pt.year);
                                const salesIssue = validationIssues.find(i => i.period === pt.year && i.field === 'sales');
                                const netIncomeIssue = validationIssues.find(i => i.period === pt.year && i.field === 'netIncome');
                                const cashFlowIssue = validationIssues.find(i => i.period === pt.year && i.field === 'cashFlow');
                                const marginIssue = validationIssues.find(i => i.period === pt.year && i.field === 'margin');

                                return (
                                  <tr key={pt.year} className="border-b border-[#14233c]/45 hover:bg-[#121f37]/15 transition duration-150">
                                    <td className="py-2.5 font-sans font-bold text-white flex items-center gap-1.5">
                                      <span>{pt.year}</span>
                                      {rowIssues.length > 0 && (
                                        <div className="relative group inline-block">
                                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 animate-pulse cursor-help shrink-0" />
                                          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 w-64 bg-[#0a101f] border border-amber-500/30 p-2 text-[9.5px] rounded-lg shadow-2xl text-gray-200 normal-case tracking-normal">
                                            <div className="text-amber-400 font-bold border-b border-amber-500/10 pb-0.5 mb-1.5 flex items-center gap-1">
                                              <AlertTriangle className="h-2.5 w-2.5" /> Anomalie Periodo {pt.year}
                                            </div>
                                            <ul className="space-y-1 list-disc pl-3">
                                              {rowIssues.map((ri, riIdx) => (
                                                <li key={riIdx} className="text-gray-300">
                                                  <strong className="text-white">{ri.message}:</strong> {ri.details}
                                                </li>
                                              ))}
                                            </ul>
                                            <div className="absolute top-full left-2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#0a101f]" />
                                          </div>
                                        </div>
                                      )}
                                    </td>
                                    
                                    {/* Sales Cell */}
                                    <td className={`py-2.5 text-right font-semibold transition-colors duration-150 ${salesIssue ? 'text-amber-400 font-bold' : 'text-gray-200'}`}>
                                      <div className="inline-flex items-center gap-1.5 justify-end w-full">
                                        <span>{pt.sales.toFixed(1)}B</span>
                                        {salesIssue && (
                                          <div className="relative group inline-block">
                                            <AlertTriangle className="h-3 w-3 text-amber-500 animate-pulse cursor-help shrink-0" />
                                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50 w-56 bg-[#0a101f] border border-amber-500/30 p-2 rounded-lg shadow-2xl text-[9.5px] font-mono text-gray-300 normal-case tracking-normal">
                                              <div className="text-amber-400 font-bold border-b border-amber-500/10 pb-0.5 mb-1 flex items-center gap-1">
                                                <AlertTriangle className="h-2.5 w-2.5" /> Anomalia Ricavi
                                              </div>
                                              {salesIssue.details}
                                              <div className="absolute top-full right-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#0a101f]" />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </td>

                                    {/* Net Income Cell */}
                                    <td className={`py-2.5 text-right font-bold transition-colors duration-150 ${netIncomeIssue ? 'text-amber-400' : 'text-emerald-400'}`}>
                                      <div className="inline-flex items-center gap-1.5 justify-end w-full">
                                        <span>{pt.netIncome.toFixed(1)}B</span>
                                        {netIncomeIssue && (
                                          <div className="relative group inline-block">
                                            <AlertTriangle className="h-3 w-3 text-amber-500 animate-pulse cursor-help shrink-0" />
                                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50 w-56 bg-[#0a101f] border border-amber-500/30 p-2 rounded-lg shadow-2xl text-[9.5px] font-mono text-gray-300 normal-case tracking-normal">
                                              <div className="text-amber-400 font-bold border-b border-amber-500/10 pb-0.5 mb-1 flex items-center gap-1">
                                                <AlertTriangle className="h-2.5 w-2.5" /> Anomalia Utile
                                              </div>
                                              {netIncomeIssue.details}
                                              <div className="absolute top-full right-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#0a101f]" />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </td>

                                    {/* Cash Flow Cell */}
                                    <td className="py-2.5 text-right font-bold transition-colors duration-150">
                                      <div className="inline-flex items-center gap-1.5 justify-end w-full">
                                        <span className={cashFlowIssue ? 'text-amber-400 underline decoration-dotted decoration-amber-500/50' : 'text-amber-500'}>{pt.cashFlow.toFixed(1)}B</span>
                                        {cashFlowIssue && (
                                          <div className="relative group inline-block">
                                            <AlertTriangle className="h-3 w-3 text-amber-500 animate-pulse cursor-help shrink-0" />
                                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50 w-56 bg-[#0a101f] border border-amber-500/30 p-2 rounded-lg shadow-2xl text-[9.5px]/relaxed font-mono text-gray-300 normal-case tracking-normal">
                                              <div className="text-amber-400 font-bold border-b border-amber-500/10 pb-0.5 mb-1 flex items-center gap-1">
                                                <AlertTriangle className="h-2.5 w-2.5" /> Anomalia Cash Flow
                                              </div>
                                              {cashFlowIssue.details}
                                              <div className="absolute top-full right-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#0a101f]" />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </td>

                                    {/* Net Margin Cell */}
                                    <td className={`py-2.5 text-right transition-colors duration-150 ${marginIssue ? 'text-amber-400 font-bold' : 'text-purple-400'}`}>
                                      <div className="inline-flex items-center gap-1.5 justify-end w-full">
                                        <span>{pt.margin.toFixed(1)}%</span>
                                        {marginIssue && (
                                          <div className="relative group inline-block">
                                            <AlertTriangle className="h-3 w-3 text-amber-500 animate-pulse cursor-help shrink-0" />
                                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50 w-56 bg-[#0a101f] border border-amber-500/30 p-2 rounded-lg shadow-2xl text-[9.5px]/relaxed font-mono text-gray-300 normal-case tracking-normal">
                                              <div className="text-amber-400 font-bold border-b border-amber-500/10 pb-0.5 mb-1 flex items-center gap-1">
                                                <AlertTriangle className="h-2.5 w-2.5" /> Anomalia Margine
                                              </div>
                                              {marginIssue.details}
                                              <div className="absolute top-full right-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#0a101f]" />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    
                                    <td className={`py-2.5 text-right font-bold ${Number(cashToDebt) > 1.5 || cashToDebt === '∞' ? 'text-[#00e5a0]' : 'text-amber-500'}`}>{cashToDebt}x</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* SECTION: FAIR VALUE CALCULATIONS & CALCULATOR WIDGET */}
                      <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00e5a0]/3 rounded-full blur-3xl" />
                        
                        <div className="border-b border-[#14233c] pb-2.5 text-[12px] font-black uppercase text-white font-mono tracking-wider flex items-center gap-2 mb-4">
                          <div className="bg-[#00e5a0]/10 p-1.5 rounded-lg border border-[#00e5a0]/20">
                            <Target className="h-4 w-4 text-[#00e5a0]" />
                          </div>
                          Fair Value Models & Calculations (Valore Intrinseco)
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                          
                          {/* 4 Fair Value Box column */}
                          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                            
                            <div className="bg-[#050812] border border-[#14233c] hover:border-[#00c2ff]/30 p-3.5 rounded-xl flex flex-col justify-between transition group">
                              <div className="flex justify-between items-start">
                                <span className="text-[8px] uppercase text-gray-400 font-bold tracking-wider">Discounted Cash Flow (DCF)</span>
                                <span className="text-[7px] text-[#00c2ff] border border-[#00c2ff]/30 bg-[#00c2ff]/5 px-1 rounded font-bold uppercase">Cashflow</span>
                              </div>
                              <strong className="text-white text-lg group-hover:text-[#00c2ff] transition-colors duration-150">
                                {currentCurrencySym}{assetDetails.dcfValue.toFixed(2)}
                              </strong>
                              <span className="text-[8px] text-gray-500 font-bold uppercase mt-1">Valutazione dei Flussi di cassa attualizzati</span>
                            </div>

                            <div className="bg-[#050812] border border-[#14233c] hover:border-[#00c2ff]/30 p-3.5 rounded-xl flex flex-col justify-between transition group">
                              <div className="flex justify-between items-start">
                                <span className="text-[8px] uppercase text-gray-400 font-bold tracking-wider">Lynch PEG Valuation</span>
                                <span className="text-[7px] text-[#a855f7] border border-[#a855f7]/30 bg-[#a855f7]/5 px-1 rounded font-bold uppercase">PEG EPS</span>
                              </div>
                              <strong className="text-white text-lg group-hover:text-purple-400 transition-colors duration-150">
                                {currentCurrencySym}{assetDetails.peterLynchValue.toFixed(2)}
                              </strong>
                              <span className="text-[8px] text-gray-500 font-bold uppercase mt-1">Multiplo PE pesato sul tasso CAGR EPS</span>
                            </div>

                            <div className="bg-[#050812] border border-[#14233c] hover:border-[#00c2ff]/30 p-3.5 rounded-xl flex flex-col justify-between transition group">
                              <div className="flex justify-between items-start">
                                <span className="text-[8px] uppercase text-gray-400 font-bold tracking-wider">Economic Value Added (EVA)</span>
                                <span className="text-[7px] text-[#00e5a0] border border-[#00e5a0]/30 bg-[#00e5a0]/5 px-1 rounded font-bold uppercase">ROIC-WACC</span>
                              </div>
                              <strong className="text-white text-lg group-hover:text-[#00e5a0] transition-colors duration-150">
                                {currentCurrencySym}{assetDetails.evaValue.toFixed(2)}
                              </strong>
                              <span className="text-[8px] text-gray-500 font-bold uppercase mt-1">Surplus di rendimento oltre costo capitale</span>
                            </div>

                            <div className="bg-[#050812] border border-[#14233c] hover:border-[#00c2ff]/30 p-3.5 rounded-xl flex flex-col justify-between transition group">
                              <div className="flex justify-between items-start">
                                <span className="text-[8px] uppercase text-gray-400 font-bold tracking-wider">Dividend Discount Model (DDM)</span>
                                <span className="text-[7px] text-[#f59e0b] border border-[#f59e0b]/30 bg-[#f59e0b]/5 px-1 rounded font-bold uppercase">Gordon Model</span>
                              </div>
                              <strong className="text-white text-lg group-hover:text-[#f59e0b] transition-colors duration-150">
                                {currentCurrencySym}{assetDetails.ddmValue.toFixed(2)}
                              </strong>
                              <span className="text-[8px] text-gray-500 font-bold uppercase mt-1">Spiegato tramite distribuzione dei flussi cedola</span>
                            </div>

                          </div>

                          {/* Right Average Fair Value Box Block - Redesigned to look extremely premium */}
                          <div className="bg-[#0b1427] border border-[#00c2ff]/40 shadow-[inset_0_1px_20px_rgba(0,194,255,0.06)] rounded-xl p-5 flex flex-col justify-between text-center min-h-[175px] relative">
                            <span className="absolute top-2 right-2 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5a0] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5a0]"></span>
                            </span>
                            
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono uppercase tracking-widest text-[#00c2ff] font-black block">
                                Valore Medio Stimato Intrinseco
                              </span>
                              <h2 className="text-4xl font-black text-[#00e5a0] font-mono tracking-tight leading-none mt-2">
                                {currentCurrencySym}{assetDetails.averageFairValue.toFixed(2)}
                              </h2>
                            </div>

                            <div className="bg-[#050812] border border-[#14233c] py-2 px-3 rounded-lg mt-3 text-[10.5px] text-gray-300 leading-normal font-sans font-medium">
                              L'attuale quotazione di chiusura ({currentCurrencySym}{assetDetails.lastClose}) si posiziona{' '}
                              <strong className={upsidePercent > 0 ? "text-[#00e5a0]" : "text-[#ff3d6b]"}>
                                {Math.abs(upsidePercent).toFixed(1)}% {upsidePercent > 0 ? "al di SOTTO" : "al di SOPRA"}
                              </strong>{' '}
                              del Fair Value medio ponderato.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SECTION: RELIABILITY / ALTMAN Z-SCORE */}
                      <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-[#14233c] gap-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-rose-500/10 p-1.5 border border-rose-500/20 rounded-lg">
                              <Landmark className="h-4 w-4 text-[#ff3d6b]" />
                            </div>
                            <h3 className="text-white text-[13px] font-extrabold uppercase tracking-wide">
                              Analisi di Solvibilità & Altman Z-Score
                            </h3>
                          </div>
                          
                          <div className="flex bg-[#050812] border border-[#14233c] p-0.5 rounded-lg select-none self-end sm:self-auto font-mono">
                            {['Altman Z', 'Ratios', 'Distress'].map((tab) => (
                              <button
                                key={tab}
                                type="button"
                                onClick={() => setReliabilityTab(tab as any)}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all duration-150 ${
                                  reliabilityTab === tab 
                                    ? 'bg-[#1a2e4c] text-[#00c2ff] font-black' 
                                    : 'text-gray-400 hover:text-white hover:bg-[#111927]'
                                }`}
                              >
                                {tab}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Solvability Router Content */}
                        {reliabilityTab === 'Altman Z' && (
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* Z SCORE HISTORICAL BAR CHART */}
                            <div className="lg:col-span-2 bg-[#050812] border border-[#14233c] p-4 rounded-xl flex flex-col justify-between">
                              <div className="flex justify-between items-center mb-3 select-none">
                                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                                  📊 Trend Altman Z-Score Storico con Bande di Controllo
                                </span>
                                <span className="text-[8px] font-mono text-emerald-400 font-bold border border-emerald-500/20 bg-emerald-500/5 px-1.5 py-0.5 rounded uppercase">SOLVENCY FACTOR</span>
                              </div>
                              
                              <div className="h-44 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart 
                                    data={assetDetails.altmanHistory}
                                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                                  >
                                    <defs>
                                      {/* Gradient markers for score heights */}
                                      <linearGradient id="altmanSafeGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00e5a0" stopOpacity={0.95}/>
                                        <stop offset="100%" stopColor="#005b3c" stopOpacity={0.45}/>
                                      </linearGradient>
                                      <linearGradient id="altmanDangerGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ff3d6b" stopOpacity={0.95}/>
                                        <stop offset="100%" stopColor="#880022" stopOpacity={0.45}/>
                                      </linearGradient>
                                      <linearGradient id="altmanGreyGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.95}/>
                                        <stop offset="100%" stopColor="#92400e" stopOpacity={0.45}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" opacity={0.4} vertical={false} />
                                    <XAxis dataKey="year" stroke="#4a5568" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                                    <YAxis stroke="#4a5568" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                                    <Tooltip 
                                      contentStyle={{ 
                                        backgroundColor: '#09101f', 
                                        borderColor: '#172741', 
                                        borderRadius: '10px', 
                                        color: '#fff', 
                                        fontSize: '11px',
                                        fontFamily: 'monospace' 
                                      }} 
                                      formatter={(value) => [`${Number(value).toFixed(2)}`, 'Z-Score']}
                                    />
                                    
                                    {/* Visual reference boundaries for security bands */}
                                    <ReferenceLine y={3.0} stroke="#10b981" strokeDasharray="3 3" opacity={0.5} strokeWidth={1} label={{ value: 'Safe Zone (>3.0)', fill: '#10b981', fontSize: 7, position: 'top', fontFamily: 'monospace' }} />
                                    <ReferenceLine y={1.8} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} strokeWidth={1} label={{ value: 'Distress Zone (<1.8)', fill: '#ef4444', fontSize: 7, position: 'top', fontFamily: 'monospace' }} />

                                    <Bar dataKey="score" name="Altman Z-Score" radius={[3, 3, 0, 0]} maxBarSize={18} animationDuration={1000}>
                                      {assetDetails.altmanHistory.map((entry: any, index: number) => {
                                        let activeGrad = 'url(#altmanSafeGrad)';
                                        if (entry.score < 1.8) activeGrad = 'url(#altmanDangerGrad)';
                                        else if (entry.score <= 3.0) activeGrad = 'url(#altmanGreyGrad)';
                                        return (
                                          <Cell key={`cell-${index}`} fill={activeGrad} />
                                        );
                                      })}
                                    </Bar>
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            {/* Solvency feedback details */}
                            <div className="bg-[#050812] border border-[#14233c] rounded-xl p-5 flex flex-col justify-between text-center min-h-[175px]">
                              <div>
                                <span className="text-[9px] font-mono uppercase tracking-widest text-[#00e5a0] block font-black leading-none mb-1">
                                  Altman Z-Score Corrente
                                </span>
                                <h2 className="text-4xl font-extrabold text-white font-mono mt-2">
                                  {assetDetails.altmanZScore}
                                </h2>
                              </div>

                              <div className={`mt-3 border py-2.5 px-3 rounded-lg text-left font-sans text-[10.5px] leading-relaxed ${assetDetails.altmanZScore > 3.0 ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-400' : (assetDetails.altmanZScore >= 1.8 ? 'bg-amber-500/5 border-amber-500/25 text-amber-400' : 'bg-rose-500/5 border-rose-500/25 text-rose-400')}`}>
                                <strong className="block text-[11px] font-mono font-black uppercase tracking-wider mb-0.5">
                                  {assetDetails.altmanZScore > 3.0 ? 'ZONA DI SICUREZZA ELEVATA' : (assetDetails.altmanZScore >= 1.8 ? 'ZONA DI TRANSITO GREY' : 'ZONA DI DISTRETTO (DISTRESS)')}
                                </strong>
                                {assetDetails.altmanZScore > 3.0 
                                  ? 'La società dispone di una struttura patrimoniale robusta. Rischio di squilibrio societario o insolvenza praticamente nullo.' 
                                  : (assetDetails.altmanZScore >= 1.8 
                                    ? 'La posizione finanziaria è stabile, ma richiede una vigilanza periodica sui flussi commerciali e debito.' 
                                    : 'Configurazione finanziaria ad alta leva. Rischi significativi legati agli oneri e coperture operative nel breve.')}
                              </div>
                            </div>
                          </div>
                        )}

                        {reliabilityTab === 'Ratios' && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
                            {[
                              { label: 'Current Ratio', val: '2.84x', status: 'Ottimo', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: 'Indice di liquidità operativa di breve termine' },
                              { label: 'Quick Ratio (Acid)', val: '2.15x', status: 'Liquido', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: 'Liquidità immediata esclusi i magazzini' },
                              { label: 'Debt/Equity Ratio', val: '0.14', status: 'Deleva', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: 'Rapporto debito/patrimonio della società' },
                              { label: 'Return on Equity (ROE)', val: '28.45%', status: 'Ottimo', color: 'text-[#00c2ff] border-[#00c2ff]/20 bg-[#00c2ff]/3', desc: 'Rendimento sul capitale netto investito' },
                              { label: 'Return on Assets (ROA)', val: '14.20%', status: 'Efficiente', color: 'text-[#00c2ff] border-[#00c2ff]/20 bg-[#00c2ff]/3', desc: 'Efficienza dello sfruttamento dei cespiti' },
                              { label: 'Asset Turnover', val: '1.24x', status: 'Medio', color: 'text-gray-300 border-[#14233c] bg-slate-500/5', desc: 'Vendite effettuate su totale attivo impiegato' },
                              { label: 'Interest Coverage', val: '18.42x', status: 'Sicuro', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: 'Copertura degli interessi sul debito con EBIT' },
                              { label: 'Net Debt / EBITDA', val: '-0.45', status: 'Net Cash', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: 'Tempo necessario a coprire il debito' },
                            ].map((rit) => (
                              <div key={rit.label} className="bg-[#050812] border border-[#14233c] p-3 rounded-xl flex flex-col justify-between hover:border-slate-700/60 transition group">
                                <span className="text-[7.5px] text-gray-400 uppercase font-bold tracking-wider">{rit.label}</span>
                                <div className="flex items-baseline justify-between mt-1 mb-1">
                                  <strong className="text-white text-base font-extrabold tracking-tight">{rit.val}</strong>
                                  <span className={`text-[7px] uppercase font-bold px-1 rounded border ${rit.color}`}>{rit.status}</span>
                                </div>
                                <span className="text-[8px] text-gray-500 leading-tight font-sans">{rit.desc}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {reliabilityTab === 'Distress' && (
                          <div className="bg-[#050812] border border-[#14233c] p-4.5 rounded-xl space-y-4">
                            <div className="flex justify-between items-center select-none font-mono">
                              <span className="text-[10px] text-white font-bold flex items-center gap-1.5">🛡️ AI Forensic Solvency Report & Screener</span>
                              <span className="text-[8px] text-red-400 border border-red-500/25 bg-red-500/5 py-0.5 px-1.5 rounded uppercase font-bold">Audit attivo</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
                              <div className="bg-[#09101f] border border-[#172741] p-3 rounded-lg flex flex-col justify-between">
                                <span className="text-gray-400 text-[10px] block mb-1 font-mono">Piotroski F-Score</span>
                                <strong className="text-lg text-emerald-400 font-bold block leading-none mb-1">8 / 9</strong>
                                <p className="text-[10px] text-gray-500 leading-normal">
                                  Indica un posizionamento finanziario ottimale basato su trend di profitto, liquidità e leva del capitale.
                                </p>
                              </div>

                              <div className="bg-[#09101f] border border-[#172741] p-3 rounded-lg flex flex-col justify-between">
                                <span className="text-gray-400 text-[10px] block mb-1 font-mono">Beneish M-Score</span>
                                <strong className="text-lg text-[#00c2ff] font-bold block leading-none mb-1">-3.42 (Basso Rischio)</strong>
                                <p className="text-[10px] text-gray-500 leading-normal">
                                  Algoritmo predittivo di irregolarità di rendiconto. Il valore indica assenza totale di manipolazioni contabili.
                                </p>
                              </div>

                              <div className={`bg-[#09101f] border p-3 rounded-lg flex flex-col justify-between ${assetDetails.altmanZScore > 3.0 ? 'border-emerald-500/15 text-emerald-400' : 'border-amber-500/15 text-amber-500'}`}>
                                <span className="text-gray-400 text-[10px] block mb-1 font-mono">Forensic Distress Rating</span>
                                <strong className="text-lg font-bold block leading-none mb-1">SAFE (AAA)</strong>
                                <p className="text-[10px] text-gray-500 leading-normal">
                                  La probabilità statistica di fallimento aziendale nel biennio è calcolata ad un livello inferiore allo 0.08%.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SECTION: VALUE CREATION & BUYBACK & SHARES TREND */}
                      <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl space-y-4">
                        <div className="border-b border-[#14233c] pb-2.5 text-[12px] font-black uppercase text-white font-mono tracking-wider flex items-center gap-2">
                          <div className="bg-[#a855f7]/10 p-1.5 rounded-lg border border-[#a855f7]/20">
                            <Layers className="h-4 w-4 text-[#a855f7]" />
                          </div>
                          Value Creation (Trend di Riconquista Quote e Buyback)
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                          {/* Left Area Chart: Shares Outstanding decrementing */}
                          <div className="bg-[#050812] border border-[#14233c] p-4 rounded-xl col-span-1 lg:col-span-2 flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-3 select-none">
                              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                                📉 Numero di Azioni Outstanding in Circolazione (Sezionale Milioni)
                              </span>
                              <span className="text-[8.5px] font-mono text-red-400 font-bold border border-red-500/20 bg-red-500/5 px-1.5 py-0.5 rounded uppercase">SHR OUTSTANDING</span>
                            </div>
                            
                            <div className="h-44 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart 
                                  data={assetDetails.financialHistory}
                                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                                >
                                  <defs>
                                    <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#ff3d6b" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#ff3d6b" stopOpacity={0.0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" opacity={0.4} vertical={false} />
                                  <XAxis dataKey="year" stroke="#4a5568" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                                  <YAxis stroke="#4a5568" style={{ fontSize: '9px', fontFamily: 'monospace' }} domain={['auto', 'auto']} />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: '#09101f', 
                                      borderColor: '#172741', 
                                      borderRadius: '8px', 
                                      color: '#fff', 
                                      fontSize: '11px',
                                      fontFamily: 'monospace' 
                                    }} 
                                    formatter={(value) => [`${value}M pz`, 'Azioni']}
                                  />
                                  <Area type="monotone" dataKey="shares" name="Azioni in Circolazione" stroke="#ff3d6b" strokeWidth={2.2} fillOpacity={1} fill="url(#colorShares)" animationDuration={1400} />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Buyback Status report right card */}
                          <div className="bg-[#050812] border border-[#14233c] p-4 rounded-xl flex flex-col justify-between font-mono gap-4">
                            <h4 className="text-[8.5px] font-sans font-black text-gray-400 uppercase tracking-widest pb-1.5 border-b border-[#14233c]">PIANO DI ALLOCAZIONE</h4>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-[10px] border-b border-[#14233c]/60 pb-1.5">
                                <span className="text-gray-400 font-sans">Shares Outstanding</span>
                                <strong className="text-red-400 font-bold flex items-center gap-1">Decrescente <TrendingDown className="h-3.5 w-3.5" /></strong>
                              </div>
                              <div className="flex justify-between items-center text-[10px] border-b border-[#14233c]/60 pb-1.5">
                                <span className="text-gray-400 font-sans">Shareholders Yield</span>
                                <strong className="text-emerald-400 font-bold flex items-center gap-1">Crescente <TrendingUp className="h-3.5 w-3.5" /></strong>
                              </div>
                              <div className="flex justify-between items-center text-[10px] border-b border-[#14233c]/60 pb-1.5">
                                <span className="text-gray-400 font-sans">Valore di Riacquisto</span>
                                <strong className="text-[#00c2ff] font-bold">€1.45B / TTM</strong>
                              </div>
                            </div>

                            <div className="bg-[#121c2e] border border-[#1b2f51] text-gray-200 p-3 rounded-lg text-center leading-normal text-[10px] font-sans font-medium">
                              <strong className="block text-[#00c2ff] font-bold text-[11px] mb-1">Efficienza Riacquisto:</strong>
                              Ricomprare quote riduce il denominatore nel calcolo dell'EPS, guidando l'apprezzamento dell'azione anche a parità di ricavi.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SECTION: REVENUE BY PRODUCT / GEOGRAPHIES GRAPHICS */}
                      <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl space-y-4">
                        <div className="border-b border-[#14233c] pb-2.5 text-[12px] font-black uppercase text-white font-mono tracking-wider flex items-center gap-2">
                          <div className="bg-[#f59e0b]/10 p-1.5 rounded-lg border border-[#f59e0b]/20">
                            <Users className="h-4 w-4 text-[#f59e0b]" />
                          </div>
                          Diversificazione Ricavi (Prodotti & Aree Geografiche)
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          
                          {/* Product splitting Bar Chart - Reconfigured with premium shapes */}
                          <div className="bg-[#050812] border border-[#14233c] p-4 rounded-xl flex flex-col justify-between">
                            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block mb-3 select-none">
                              📊 Ripartizione del Fatturato per Linea di Prodotto ({currentCurrencySym}/B)
                            </span>
                            
                            <div className="h-48 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                  data={assetDetails.productRevenue}
                                  layout="vertical"
                                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                                >
                                  <defs>
                                    {PIE_COLORS.map((color, idx) => (
                                      <linearGradient key={`prodGrad-${idx}`} id={`prodGrad-${idx}`} x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor={color} stopOpacity={0.95}/>
                                        <stop offset="100%" stopColor={color} stopOpacity={0.25}/>
                                      </linearGradient>
                                    ))}
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} horizontal={false} />
                                  <XAxis type="number" stroke="#4a5568" style={{ fontSize: '8px', fontFamily: 'monospace' }} />
                                  <YAxis dataKey="name" type="category" stroke="#4a5568" style={{ fontSize: '8.5px', fontFamily: 'monospace' }} width={80} />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: '#09101f', 
                                      borderColor: '#172741', 
                                      borderRadius: '8px', 
                                      color: '#fff', 
                                      fontSize: '11px',
                                      fontFamily: 'monospace' 
                                    }} 
                                    formatter={(value) => [`${currentCurrencySym}${Number(value).toFixed(1)}B`, 'Quota']}
                                  />
                                  <Bar dataKey="value" name="Valore Ricavi" radius={[0, 4, 4, 0]} barSize={14} animationDuration={1100}>
                                    {assetDetails.productRevenue.map((entry: any, index: number) => (
                                      <Cell key={`cell-${index}`} fill={`url(#prodGrad-${index % PIE_COLORS.length})`} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Geography splits: Beautiful interactive donut visualization */}
                          <div className="bg-[#050812] border border-[#14233c] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-around gap-4">
                            <div className="text-center sm:text-left space-y-3 select-none">
                              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block border-b border-[#14233c] pb-1">
                                🌍 Split Geografico dei Ricavi
                              </span>
                              
                              <div className="space-y-2 text-[10px] font-mono">
                                {assetDetails.geographicRevenue.map((geo: any, index: number) => (
                                  <div key={index} className="flex items-center gap-2.5">
                                    <span className="h-2 w-2 rounded-full ring-2 ring-offset-2 ring-offset-[#050812]" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length], ringColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                                    <span className="text-gray-400 font-medium font-sans">{geo.name}:</span>
                                    <strong className="text-white text-[11px]">{geo.value}%</strong>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Rendering dynamic donut chart */}
                            <div className="h-36 w-36 relative flex items-center justify-center shrink-0">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={assetDetails.geographicRevenue}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={32}
                                    outerRadius={54}
                                    paddingAngle={3.5}
                                    dataKey="value"
                                    animationDuration={1300}
                                  >
                                    {assetDetails.geographicRevenue.map((entry: any, index: number) => (
                                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip 
                                    contentStyle={{ backgroundColor: '#0a152d', borderColor: '#172741', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }} 
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                              <div className="absolute text-center select-none pointer-events-none">
                                <span className="text-[9px] uppercase text-gray-500 font-bold block leading-none">Spread</span>
                                <strong className="text-xs font-mono font-black text-[#00c2ff] tracking-tighter mt-0.5 block leading-none">Globale</strong>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: INTERACTIVE DETAILED FINANCIAL STATEMENTS MATRIX */}
                  {activeStatementTab === 'Financial Statements' && (() => {
                    const periods = activeHistory.map((item: any) => item.year);

                    // Dynamic row mapping for Financial Statement tables
                    const generateRowData = (label: string, baseMultiplier: number, factor: 'sales' | 'netIncome' | 'cashFlow' | 'debt' | 'equity' | 'shares', formatter: (v: number) => string) => {
                      const values = activeHistory.map((pt: any) => {
                        return pt[factor] * baseMultiplier;
                      });
                      return { label, values, formatter, factor };
                    };

                    const incomeStatementRows = [
                      generateRowData("Ricavi Totali / Revenue", 1.0, 'sales', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Costo del Venduto (COGS)", 0.44, 'sales', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Profitto Lordo (Gross Profit)", 0.56, 'sales', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Spese di Ricerca & Sviluppo (R&D)", 0.12, 'sales', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Spese di Vendita & Amministrative (SG&A)", 0.14, 'sales', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("EBITDA Lordo Operativo", 0.30, 'sales', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Ammortamenti e Svalutazioni", 0.05, 'sales', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Utile Operativo (EBIT)", 0.25, 'sales', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Oneri Finanziari sul Debito", 0.02, 'debt', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Imposte sul Reddito (Taxes)", 0.21, 'netIncome', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Utile Netto (Net Income)", 1.0, 'netIncome', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Utile per Azione Diluito (EPS)", 1.0, 'netIncome', (v) => `${currentCurrencySym}${(v / 12).toFixed(2)}`),
                    ];

                    const balanceSheetRows = [
                      generateRowData("Cassa & Investimenti Correnti", 0.35, 'equity', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Crediti Commerciali", 0.15, 'equity', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Rimanenze & Magazzini", 0.10, 'equity', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Totale Attività Correnti", 0.60, 'equity', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Immobili, Impianti e Macchinari (PP&E)", 0.40, 'equity', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Altre Attività Immobilizzate", 0.20, 'equity', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Totale Attivo Fisso", 1.20, 'equity', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Debiti Commerciali a breve", 0.25, 'debt', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Debiti Finanziari a lungo termine", 0.75, 'debt', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Totale Passività", 1.0, 'debt', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Patrimonio Netto degli Azionisti", 1.0, 'equity', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                    ];

                    const cashFlowRows = [
                      generateRowData("Cassa da Attività Finanziarie", 1.15, 'cashFlow', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Spese in conto capitale (CapEx)", -0.15, 'cashFlow', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Flusso di Cassa Libero (Free Cash Flow)", 1.0, 'cashFlow', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Riacquisto Azioni proprie (Buyback)", -0.40, 'cashFlow', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Dividendi azionari pagati", -0.20, 'cashFlow', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Flussi netti di finanziamento", -0.30, 'cashFlow', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                      generateRowData("Variazione Netta della Cassa", 0.25, 'cashFlow', (v) => `${currentCurrencySym}${v.toFixed(1)}B`),
                    ];

                    let currentSheetRows = incomeStatementRows;
                    if (statementSheetMode === 'Balance') currentSheetRows = balanceSheetRows;
                    if (statementSheetMode === 'CashFlow') currentSheetRows = cashFlowRows;

                    return (
                      <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl space-y-4 animate-fadeIn">
                        
                        {/* Interactive Sheet Toggle Menu & Informative Badge */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-[#14233c] gap-3 select-none">
                          <div className="flex bg-[#050812] border border-[#14233c] p-0.5 rounded-lg font-mono">
                            {[
                              { id: 'Income', label: 'Conto Economico' },
                              { id: 'Balance', label: 'Stato Patrimoniale' },
                              { id: 'CashFlow', label: 'Rendiconto Cassa' }
                            ].map((sh) => (
                              <button
                                key={sh.id}
                                type="button"
                                onClick={() => setStatementSheetMode(sh.id as any)}
                                className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all duration-150 ${
                                  statementSheetMode === sh.id
                                    ? 'bg-[#00c2ff] text-slate-950 font-black'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                              >
                                {sh.label}
                              </button>
                            ))}
                          </div>
                          
                          <div className="text-[10px] text-gray-400 font-mono self-end sm:self-auto uppercase">
                            Sincronizzazione dati: <strong className="text-emerald-400">Verificata ({assetDetails.ticker})</strong>
                          </div>
                        </div>

                        {/* HIGH-FIDELITY INTERACTIVE TABULAR LEDGER */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left font-mono text-[10.5px] border-collapse relative">
                            <thead>
                              <tr className="border-b border-[#1b2f51] text-gray-500 text-[8.5px] uppercase tracking-wider select-none">
                                <th className="py-2.5 font-sans min-w-[200px]">Voce di Bilancio</th>
                                <th className="py-2.5 text-center px-4 w-[80px]">Trend</th>
                                {periods.map((p: any) => (
                                  <th key={p} className="py-2.5 text-right w-[85px]">{p}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {currentSheetRows.map((row) => (
                                <tr key={row.label} className="border-b border-[#14233c]/65 hover:bg-[#121f37]/15 transition duration-150 group">
                                  <td className="py-3 font-sans font-semibold text-gray-200 group-hover:text-white transition-colors duration-150 pr-2">
                                    {row.label}
                                  </td>
                                  <td className="py-3 text-center px-4">
                                    {renderSparkline(row.values, row.values[row.values.length-1] >= row.values[0] ? '#00e5a0' : '#ff3d6b')}
                                  </td>
                                  {row.values.map((v, keyIndex) => {
                                    const pName = periods[keyIndex];
                                    const cellIssue = validationIssues.find(i => i.period === pName && i.field === row.factor);

                                    return (
                                      <td key={keyIndex} className={`py-3 text-right font-bold transition duration-150 ${keyIndex === row.values.length - 1 ? 'text-[#00c2ff] bg-[#00c2ff]/3' : 'text-gray-400 hover:text-white'} ${cellIssue ? 'text-amber-400' : ''}`}>
                                        <div className="inline-flex items-center gap-1 justify-end w-full">
                                          <span>{row.formatter(v)}</span>
                                          {cellIssue && (
                                            <div className="relative group inline-block">
                                              <AlertTriangle className="h-3 w-3 text-amber-500 animate-pulse cursor-help shrink-0" />
                                              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50 w-56 bg-[#0a101f] border border-amber-500/30 p-2 rounded-lg shadow-2xl text-[9.5px]/relaxed font-mono text-gray-300 normal-case tracking-normal text-left">
                                                <div className="text-amber-400 font-bold border-b border-amber-500/10 pb-0.5 mb-1 flex items-center gap-1">
                                                  <AlertTriangle className="h-2.5 w-2.5" /> Segnale di Allerta
                                                </div>
                                                {cellIssue.details}
                                                <div className="absolute top-full right-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#0a101f]" />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="bg-[#050811] border border-[#14233c]/75 p-3 rounded-xl flex items-center gap-2.5 text-[9.5px] text-gray-400 font-sans leading-relaxed select-none">
                          <Info className="h-4.5 w-4.5 text-[#00c2ff] shrink-0" />
                          <div>
                            <strong>Modellazione Matematica Reattiva:</strong> I rendiconti soprastanti sono ricostruiti dinamicamente in base ai bilanci di chiusura storici depositati da {assetDetails.name} e scalati in proporzione geometrica per i singoli trimestri o anni fiscali.
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* TAB 3: AI EARNING PLANS & INTERACTIVE CALL TRANSCRIPTS */}
                  {activeStatementTab === 'Transcripts' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
                      
                      {/* Left Block: AI speech and tracker confidence */}
                      <div className="lg:col-span-4 bg-[#09101f] border border-[#172741] p-4 rounded-xl flex flex-col justify-between gap-4 font-mono select-none">
                        <div className="space-y-3">
                          <span className="text-[9px] font-black text-[#00c2ff] tracking-widest uppercase block border-b border-[#14233c] pb-1.5">
                            🎙️ REGISTRO DI CHIAMATA & SENTIMENT
                          </span>
                          
                          <div className="bg-[#050812] border border-[#14233c] p-3 rounded-lg text-center space-y-2">
                            <span className="text-[10px] text-gray-400 font-sans font-medium block">Management Optimism Score:</span>
                            <strong className="text-3xl text-[#00e5a0] font-black tracking-tight block">91 / 100</strong>
                            <span className="text-[8px] border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 py-0.5 px-2 rounded-full uppercase font-bold inline-block">
                              Tono Altamente Bullish
                            </span>
                          </div>

                          <div className="space-y-2 text-[10px] font-sans text-gray-400">
                            <div className="flex justify-between border-b border-[#14233c]/50 pb-1 font-mono">
                              <span>Evasività risposte:</span>
                              <strong className="text-emerald-400 uppercase">Bassissima (8%)</strong>
                            </div>
                            <div className="flex justify-between border-b border-[#14233c]/50 pb-1 font-mono">
                              <span>Strategic Trust Score:</span>
                              <strong className="text-[#00c2ff]">94%</strong>
                            </div>
                            <div className="flex justify-between border-b border-[#14233c]/50 pb-1 font-mono">
                              <span>Tendenza Guidance:</span>
                              <strong className="text-emerald-400 uppercase">Upgrade (Rialzo)</strong>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <span className="text-[8.5px] text-gray-500 font-bold uppercase tracking-wider block">Principali Termini Ricorrenti:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['IA Generativa', 'Efficieza Margini', 'Capex R&D', 'Resilienza Supply', 'Liquidità Liquid', 'Buyback Intensivo'].map((p) => (
                              <span key={p} className="text-[8.5px] border border-[#14233c] bg-[#121c2e]/45 px-2 py-0.5 rounded text-gray-300 font-sans font-semibold">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-emerald-500/5 border border-emerald-500/15 p-2.5 rounded-lg text-[9.5px] font-sans font-medium text-emerald-400 leading-normal">
                          <strong>Conclusione AI:</strong> Il comportamento comunicativo della dirigenza indica una performance futura stabile con ampie garanzie sull'allocazione di cassa per dividendi e buyback.
                        </div>
                      </div>

                      {/* Right Block: Analysts and Management answers transcript dialogues */}
                      <div className="lg:col-span-8 bg-[#09101f] border border-[#172741] p-5 rounded-2xl flex flex-col justify-between gap-4">
                        <div className="border-b border-[#14233c] pb-2 flex justify-between items-center select-none font-mono text-[9px]">
                          <span className="text-white uppercase font-black tracking-wider flex items-center gap-1.5">
                            ⚡ AI Summaries: Analyst Q&A Highlights
                          </span>
                          <span className="text-gray-400 uppercase">Call Trimestrale Q4</span>
                        </div>

                        <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1">
                          
                          {/* Dialogue 1 */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-mono">
                              <span className="bg-amber-400/10 border border-amber-400/20 text-yellow-400 px-1.5 py-0.2 rounded font-bold uppercase text-[8px]">D</span>
                              <strong className="text-slate-200">Goldman Sachs Analyst (Toni Sacconaghi)</strong>
                            </div>
                            <div className="bg-[#050812] border border-[#14233c]/85 p-3 rounded-xl text-[11px] font-sans text-gray-400 leading-relaxed font-semibold">
                              "Con l'aumento dei costi delle materie prime ed i vincoli di fornitura geografici, ritenete che i margini operativi correnti possano subire una contrazione nell'esercizio imminente?"
                            </div>
                            
                            <div className="flex items-center gap-2 text-[10px] font-mono pl-4">
                              <span className="bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold uppercase text-[8px]">R</span>
                              <strong className="text-[#00c2ff]">CEO (Risposta Diretta)</strong>
                              <span className="text-[8px] bg-[#00e5a0]/10 border border-[#00e5a0]/25 text-[#00e5a0] px-1 py-0.1 rounded font-bold uppercase font-mono">AI: confident (94%)</span>
                            </div>
                            <div className="bg-[#121c2e] border border-[#1b2f51] p-3 rounded-xl text-[11px] font-sans text-gray-200 leading-relaxed font-medium ml-4">
                              "Il nostro forte pricing power e l'ottimizzazione del footprint logistico assorbono gli incrementi del 100%. Confermiamo proiezioni di marginalità operativa superiori al 55% nel lungo termine."
                            </div>
                          </div>

                          {/* Dialogue 2 */}
                          <div className="space-y-2 pt-2 border-t border-[#14233c]/60">
                            <div className="flex items-center gap-2 text-[10px] font-mono">
                              <span className="bg-amber-400/10 border border-amber-400/20 text-yellow-400 px-1.5 py-0.2 rounded font-bold uppercase text-[8px]">D</span>
                              <strong className="text-slate-200">Morgan Stanley Analyst (Katy Huberty)</strong>
                            </div>
                            <div className="bg-[#050812] border border-[#14233c]/85 p-3 rounded-xl text-[11px] font-sans text-gray-400 leading-relaxed font-semibold">
                              "Ci può spiegare se l'importante guidance di spesa in Capex influenzerà i piani distributivi di utile cedola o rimborsi azionari buyback previsti per quest'anno?"
                            </div>
                            
                            <div className="flex items-center gap-2 text-[10px] font-mono pl-4">
                              <span className="bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold uppercase text-[8px]">R</span>
                              <strong className="text-[#00c2ff]">CFO / Financial Officer (Risposta)</strong>
                              <span className="text-[8px] bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 px-1 py-0.1 rounded font-bold uppercase font-mono">AI: solid details (91%)</span>
                            </div>
                            <div className="bg-[#121c2e] border border-[#1b2f51] p-3 rounded-xl text-[11px] font-sans text-gray-200 leading-relaxed font-medium ml-4">
                              "Il nostro flusso operativo libero (FCF) genera un surplus cassa record. Gli investimenti strategici in Capex crescono senza impattare la stabilità distributiva. Il piano di buyback prosegue indisturbato."
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })()}

            {activeSegmentTab === 'News' && (() => {
              const assetSpecificNews = [
                {
                  id: 'spec-1',
                  time: "10:30",
                  title: `Analisi Tecnica su ${assetDetails.name || 'Asset'} (${currentTicker}): Forte segnale accumulativo dei supporti storici`,
                  source: "Milano Finanza",
                  sentiment: "BULLISH" as const,
                  impact: "La pressione d'acquisto registrata rispecchia l'eccellente reattività delle basi di supporto sul grafico."
                },
                {
                  id: 'spec-2',
                  time: "Ieri",
                  title: `${assetDetails.name || 'Asset'} annuncia investimenti record in R&D per ottimizzare margini operativi globali`,
                  source: "Il Sole 24 Ore",
                  sentiment: "BULLISH" as const,
                  impact: "Gli investitori accolgono con ottimismo la spinta sull'autofinanziamento per progetti strategici ad alta redditività."
                },
                {
                  id: 'spec-3',
                  time: "2 giorni fa",
                  title: `Upgrade di Rating per ${currentTicker}: Target Price incrementato dai principali analisti globali`,
                  source: "Bloomberg Italia",
                  sentiment: "BULLISH" as const,
                  impact: "Le valutazioni sono supportate dai cash flow in crescita organica e flussi dividendi stabili."
                }
              ];

              const allNews = [...assetSpecificNews, ...initialNews];

              return (
                <div className="space-y-5 animate-fadeIn">
                  {/* Stats Cards Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 select-none">
                    <div className="bg-[#09101f] border border-[#172741] p-3.5 rounded-xl flex items-center gap-3.5">
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[#00e5a0]">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[8.5px] uppercase text-gray-400 font-bold block">News Sentiment Bullish</span>
                        <strong className="text-lg font-mono font-black text-[#00e5a0] mt-0.5 block">
                          {allNews.filter(n => n.sentiment === 'BULLISH').length} Notizie
                        </strong>
                      </div>
                    </div>

                    <div className="bg-[#09101f] border border-[#172741] p-3.5 rounded-xl flex items-center gap-3.5">
                      <div className="p-2.5 rounded-lg bg-[#00c2ff]/10 border border-[#00c2ff]/20 text-[#00c2ff]">
                        <Newspaper className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[8.5px] uppercase text-gray-400 font-bold block">Notizie Totali</span>
                        <strong className="text-lg font-mono font-black text-white mt-0.5 block">
                          {allNews.length} Articoli
                        </strong>
                      </div>
                    </div>

                    <div className="bg-[#09101f] border border-[#172741] p-3.5 rounded-xl flex items-center gap-3.5">
                      <div className="p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                        <Flame className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[8.5px] uppercase text-gray-400 font-bold block">Copertura Globale</span>
                        <strong className="text-lg font-mono font-black text-yellow-400 mt-0.5 block uppercase">
                          Alta Rilevanza
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* News list Card Container */}
                  <div className="bg-[#09101f] border border-[#172741] p-5 rounded-2xl">
                    <div className="border-b border-[#14233c] pb-3 mb-4 flex justify-between items-center select-none font-mono text-[9px]">
                      <span className="text-white uppercase font-black tracking-wider flex items-center gap-1.5">
                        <Newspaper className="h-4 w-4 text-[#00c2ff]" />
                        Sezione News e Sentiment di Mercato: {assetDetails.name || 'Asset'} ({currentTicker || '---'})
                      </span>
                      <span className="text-[#00c2ff] font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                        <Terminal className="h-3 w-3" /> Live Feed
                      </span>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                      {allNews.map((news, index) => {
                        const isBullish = news.sentiment === 'BULLISH';
                        const isBearish = news.sentiment === 'BEARISH';

                        return (
                          <div 
                            key={news.id + '-' + index}
                            className="group border-b border-[#14233c] pb-4 last:border-0 last:pb-0 hover:bg-[#121f37]/10 p-3 rounded-xl transition duration-150"
                          >
                            <div className="flex flex-wrap justify-between items-center gap-2 mb-2 select-none">
                              <div className="flex items-center gap-2 text-[10.5px] font-mono text-gray-400">
                                <span className="bg-[#121c2e] border border-[#1b2f51] px-2 py-0.5 rounded text-gray-300 font-bold">
                                  {news.source}
                                </span>
                                <span>•</span>
                                <span className="text-gray-500">{news.time}</span>
                              </div>

                              <span className={`text-[8.5px] font-black font-mono tracking-wider px-2 py-0.5 rounded border ${
                                isBullish 
                                  ? 'bg-emerald-500/10 border-emerald-500/25 text-[#00e5a0]' 
                                  : isBearish 
                                  ? 'bg-red-500/10 border-red-500/25 text-[#ff3d6b]' 
                                  : 'bg-gray-800 border-gray-700 text-gray-400'
                              }`}>
                                {news.sentiment}
                              </span>
                            </div>

                            <h4 className="text-[12px] font-extrabold text-white leading-snug group-hover:text-[#00c2ff] transition duration-150">
                              {news.title}
                            </h4>

                            <p className="text-[10.5px] text-gray-400 font-sans leading-relaxed mt-1.5 pl-3 border-l-2 border-[#1c2e4c]">
                              {news.impact}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeSegmentTab === 'Multi-AI' && (() => {
              if (isConsensusLoading && !coordinatedAiData) {
                return (
                  <div className="bg-[#09101f] border border-[#172741] p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-6 select-none animate-fadeIn">
                    <div className="relative">
                      {/* Animated rotating radial rings representing multi-party key exchange */}
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#00c2ff]/20 animate-spin" style={{ animationDuration: '8s' }}></div>
                      <div className="absolute inset-0 rounded-full border border-dashed border-[#ff3d6b]/20 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
                      <div className="p-6 bg-gradient-to-br from-violet-600/10 to-[#ff3d6b]/10 border border-[#00c2ff]/30 rounded-full text-[#00c2ff] relative">
                        <Cpu className="h-10 w-10 animate-pulse text-[#00c2ff]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-extrabold text-sm uppercase tracking-wider font-mono">
                        Sincronizzazione della Rete AI in corso...
                      </h3>
                      <p className="text-xs text-gray-400 max-w-sm">
                        L'Orchestratore sta stabilendo una connessione coordinata sicura con le API di Gemini, Claude, ChatGPT e Perplexity per elaborare stime e pareri incrociati.
                      </p>
                    </div>
                    {/* Progress steps indicators */}
                    <div className="w-full max-w-xs space-y-2 font-mono text-[9px] text-gray-500 uppercase">
                      <div className="flex justify-between items-center text-[#00e5a0] animate-pulse">
                        <span className="flex items-center gap-1">● Connessione Gemini API</span>
                        <span>Autenticato ok</span>
                      </div>
                      <div className="flex justify-between items-center text-blue-400">
                        <span className="flex items-center gap-1 animate-pulse">● Querying Claude-3.5-Sonnet</span>
                        <span>Inviato...</span>
                      </div>
                      <div className="flex justify-between items-center text-rose-400">
                        <span className="flex items-center gap-1 animate-pulse">● Ottimizzazione ChatGPT Model</span>
                        <span>Analisi...</span>
                      </div>
                      <div className="flex justify-between items-center text-yellow-500">
                        <span className="flex items-center gap-1 animate-pulse">● Perplexity Web Search Sentinel</span>
                        <span>Grounded Feed...</span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (!coordinatedAiData) {
                return (
                  <div className="bg-[#09101f] border border-[#172741] p-10 rounded-2xl text-center space-y-4">
                    <Cpu className="h-8 w-8 text-[#00c2ff] mx-auto opacity-70" />
                    <p className="text-xs text-gray-400">Consenso Coordinato Multi-AI pronto per l'elaborazione.</p>
                    <button
                      type="button"
                      onClick={() => fetchCoordinatedAiConsensus()}
                      className="px-4 py-2 bg-[#00c2ff] hover:bg-[#00c2ff]/90 text-slate-950 font-black rounded-lg uppercase font-mono text-[10px] cursor-pointer"
                    >
                      Calcola Consenso AI
                    </button>
                  </div>
                );
              }

              const { consensusRating, consensusScore, consensusConfidence, orchestratorSummary, agents } = coordinatedAiData;

              const isBullishComp = consensusRating === 'BULLISH';
              const isBearishComp = consensusRating === 'BEARISH';
              const scoreColor = isBullishComp ? 'text-emerald-400' : isBearishComp ? 'text-[#ff3d6b]' : 'text-amber-500';

              return (
                <div className="space-y-6 animate-fadeIn">
                  {/* Top Header Card - Consenso Generale */}
                  <div className="bg-gradient-to-br from-[#091122] to-[#0d162d] border border-[#1a2d48] p-5 rounded-2xl relative shadow-xl overflow-hidden animate-slideUp">
                    {/* Background glow lines */}
                    <div className="absolute right-0 top-0 h-40 w-40 bg-gradient-to-bl from-[#00c2ff]/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-[#15243d] pb-4 mb-4 select-none">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-[#00c2ff]/10 border border-[#00c2ff]/20 text-[#00c2ff] shrink-0">
                          <Cpu className="h-6 w-6 animate-pulse" />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-[#00c2ff] font-black uppercase tracking-widest block mb-0.5">CONSOLE ORCHESTRATORE</span>
                          <h2 className="text-white text-[14px] font-black uppercase tracking-tight font-sans">Consenso Multi-AI Unificato</h2>
                        </div>
                      </div>

                      {/* Display Score & Rating */}
                      <div className="flex items-center gap-4 border-l border-[#1b2a47] pl-4 md:pl-6">
                        <div className="text-right">
                          <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider block">PUNTEGGIO GENERALE</span>
                          <strong className={`text-2xl font-mono font-black ${scoreColor}`}>
                            {consensusScore.toFixed(1)}<span className="text-[10px] text-gray-500 font-medium font-sans">/10</span>
                          </strong>
                        </div>
                        <div className="px-3.5 py-1.5 rounded-xl bg-[#121f36] border border-[#1e2f4e]">
                          <span className="text-[7.5px] text-gray-400 font-bold uppercase block tracking-wider leading-none mb-0.5">RATING COMPOSITO</span>
                          <strong className={`text-[11px] font-bold tracking-tight uppercase ${scoreColor}`}>
                            ● {consensusRating === 'BULLISH' ? 'BUY / BULLISH' : consensusRating === 'BEARISH' ? 'SELL / BEARISH' : 'HOLD / NEUTRAL'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Consolidated Summary details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-center select-none font-sans">
                      <div className="lg:col-span-2 space-y-2">
                        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block font-bold">DETTAGLI DI CONSENSO:</span>
                        <p className="text-[11.5px] text-slate-200 leading-relaxed font-sans first-letter:uppercase italic">
                          "{orchestratorSummary}"
                        </p>
                      </div>

                      <div className="bg-[#050b16] border border-[#14233c] p-3.5 rounded-xl space-y-2 text-center md:text-left">
                        <span className="text-[8.5px] text-gray-500 font-bold uppercase tracking-wider block">Affidabilità Modelli Accordati</span>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-[#1b2a47] rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-violet-600 to-[#00c2ff] h-full rounded-full" style={{ width: `${consensusConfidence * 100}%` }}></div>
                          </div>
                          <span className="text-[10px] font-mono text-[#00c2ff] font-bold">{(consensusConfidence * 100).toFixed(0)}%</span>
                        </div>
                        <span className="text-[7px] text-gray-600 uppercase block tracking-widest">Confidence Score Basato su Allineamento</span>
                      </div>
                    </div>

                    {/* Refresh control button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => fetchCoordinatedAiConsensus()}
                        disabled={isConsensusLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#12203b] border border-[#00c2ff]/30 hover:border-[#00c2ff]/60 text-slate-200 hover:text-white font-mono font-bold text-[9px] uppercase tracking-wider rounded-lg transition duration-150 cursor-pointer select-none"
                      >
                        {isConsensusLoading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#00c2ff]" /> Aggiornamento...
                          </>
                        ) : (
                          <>
                            <RotateCw className="h-3 w-3 text-[#00c2ff]" /> Forza Sync Consolida
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 2x2 Grid with coordinated agents perspectives */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(agents).map(([agentKey, agentVal]: any) => {
                      const isRealVal = agentVal.isReal;
                      const agentRating = agentVal.rating;
                      const agentRatingColor = agentRating === 'BULLISH' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : agentRating === 'BEARISH' ? 'text-[#ff3d6b] border-red-500/20 bg-red-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5';
                      
                      // Assign specialized icon
                      let iconVal = <Sparkles className="h-4.5 w-4.5" />;
                      let nameVal = "Gemini";
                      let styleBorder = "border-[#152136] hover:border-[#00c2ff]/20";

                      if (agentKey === 'claude') {
                        iconVal = <Crown className="h-4.5 w-4.5 text-[#fb923c]" />;
                        nameVal = "Claude (Anthropic)";
                        styleBorder = "border-[#152136] hover:border-amber-500/20";
                      } else if (agentKey === 'chatgpt') {
                        iconVal = <Cpu className="h-4.5 w-4.5 text-[#a855f7]" />;
                        nameVal = "ChatGPT (OpenAI)";
                        styleBorder = "border-[#152136] hover:border-violet-500/20";
                      } else if (agentKey === 'perplexity') {
                        iconVal = <Newspaper className="h-4.5 w-4.5 text-[#10b981]" />;
                        nameVal = "Perplexity (Real-time)";
                        styleBorder = "border-[#152136] hover:border-emerald-500/20";
                      } else {
                        iconVal = <Sparkles className="h-4.5 w-4.5 text-[#00c2ff]" />;
                        nameVal = "Gemini (Google)";
                        styleBorder = "border-[#152136] hover:border-[#00c2ff]/20";
                      }

                      return (
                        <div key={agentKey} className={`bg-[#070d19] border ${styleBorder} p-4 rounded-xl flex flex-col justify-between space-y-3.5 transition duration-150`}>
                          <div className="flex items-center justify-between gap-2 select-none">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 shrink-0">
                                {iconVal}
                              </div>
                              <div>
                                <h4 className="text-[11.5px] font-black text-white uppercase tracking-tight font-sans">{nameVal}</h4>
                                <span className="text-[7.5px] text-gray-500 font-mono tracking-wider block leading-none">
                                  {agentKey === 'gemini' ? 'Analista Fondamentale / Stime Fair Value' : agentKey === 'claude' ? 'Analista di Moat & Rischio Aziendale' : agentKey === 'chatgpt' ? 'Multiplo P/E & Sensitività Macro' : 'Sentinel Notizie & Web Grounded Eventi'}
                                </span>
                              </div>
                            </div>

                            {/* Pill status */}
                            <span className={`text-[8.5px] font-black font-mono tracking-wide px-1.5 py-0.5 rounded border ${
                              isRealVal 
                                ? 'bg-emerald-500/10 border-emerald-500/25 text-[#00e5a0]' 
                                : 'bg-[#151f33] border-[#223354] text-gray-500'
                            }`}>
                              {isRealVal ? '🔌 REAL API' : '🤖 SIM STATS'}
                            </span>
                          </div>

                          {/* Valuation details */}
                          <div className={`p-2.5 rounded-lg border flex items-center justify-between select-none ${agentRatingColor}`}>
                            <span className="text-[9px] font-black uppercase font-mono tracking-wider leading-none">IMPATTO MODELLO</span>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-[10px] font-black text-gray-300">Punt: {agentVal.score}/10</span>
                              <span>•</span>
                              <span className="text-[10px] font-black uppercase">{agentRating}</span>
                            </div>
                          </div>

                          {/* Response Text opinion block */}
                          <div className={`pl-2.5 border-l-2 ${agentKey === 'gemini' ? 'border-[#00c2ff]' : agentKey === 'claude' ? 'border-amber-400' : agentKey === 'chatgpt' ? 'border-violet-500' : 'border-emerald-500'}`}>
                            <p className="text-[10.5px] text-slate-300 leading-relaxed font-sans font-medium">
                              {agentVal.opinion}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* LEGAL INFORMATION FOOTER NOTES */}
            <p className="text-[9.5px] text-gray-600 leading-relaxed text-center italic font-mono pt-4 border-t border-[#14233c]">
              Avviso di rischio: Le elaborazioni espresse sono stime di simulazione basate su algoritmi matematici ed analisi quantitativa. Non raccomandano investimenti o transazioni mobiliari dirette.
            </p>

          </div>
        </motion.div>
      </div>
    );
  }
