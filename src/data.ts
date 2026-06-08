import { Transaction, HistoricalDataPoint, MarketIndex, TickerPrice } from './types';

// Initial pre-loaded transaction history (last 5 years) representing a diversified high-performance portfolio
export const initialTransactions: Transaction[] = [];

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    type: 'ACQUISTO',
    assetType: 'STOCK',
    quantity: 15,
    price: 112.50, // Back in early 2021
    date: '2021-03-12',
    fee: 5.00
  },
  {
    id: 'tx-2',
    ticker: 'NVDA',
    name: 'NVIDIA Corp.',
    type: 'ACQUISTO',
    assetType: 'STOCK',
    quantity: 200,
    price: 32.40, // Stock-adjusted price for late 2021
    date: '2021-11-10',
    fee: 5.00
  },
  {
    id: 'tx-3',
    ticker: 'SWDA.MI',
    name: 'iShares MSCI World ETF',
    type: 'ACQUISTO',
    assetType: 'ETF',
    quantity: 120,
    price: 68.20,
    date: '2021-06-20',
    fee: 2.50
  },
  {
    id: 'tx-4',
    ticker: 'BTC',
    name: 'Bitcoin',
    type: 'ACQUISTO',
    assetType: 'CRYPTO',
    quantity: 0.15,
    price: 16800.00, // Crypto winters late 2022
    date: '2022-12-05',
    fee: 12.00
  },
  {
    id: 'tx-5',
    ticker: 'SWDA.MI',
    name: 'iShares MSCI World ETF',
    type: 'ACQUISTO',
    assetType: 'ETF',
    quantity: 80,
    price: 77.40,
    date: '2023-01-10',
    fee: 2.50
  },
  {
    id: 'tx-6',
    ticker: 'US90.DE',
    name: 'Lyxor S&P 500 UCITS ETF',
    type: 'ACQUISTO',
    assetType: 'ETF',
    quantity: 150,
    price: 38.10,
    date: '2022-05-18',
    fee: 2.50
  },
  {
    id: 'tx-7',
    ticker: 'ETH',
    name: 'Ethereum',
    type: 'ACQUISTO',
    assetType: 'CRYPTO',
    quantity: 1.5,
    price: 1540.00,
    date: '2023-04-12',
    fee: 8.50
  },
  {
    id: 'tx-8',
    ticker: 'BTC',
    name: 'Bitcoin',
    type: 'ACQUISTO',
    assetType: 'CRYPTO',
    quantity: 0.12,
    price: 26400.00, // Late 2023 accumulation
    date: '2023-11-15',
    fee: 15.00
  },
  {
    id: 'tx-9',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    type: 'ACQUISTO',
    assetType: 'STOCK',
    quantity: 20,
    price: 172.80,
    date: '2024-02-19',
    fee: 5.00
  },
  {
    id: 'tx-10',
    ticker: 'EUR',
    name: 'Euro Cash Liquidity',
    type: 'DEPOSITO',
    assetType: 'CASH',
    quantity: 4500,
    price: 1.00,
    date: '2021-01-01',
    fee: 0.00
  }
];

// Seed reference prices for our calculation
export const CURRENT_ASSET_PRICES: Record<string, { name: string, price: number, assetType: 'STOCK' | 'ETF' | 'CRYPTO' | 'CASH', color: string }> = {
  AAPL: { name: 'Apple Inc.', price: 181.18, assetType: 'STOCK', color: '#00c2ff' },
  NVDA: { name: 'NVIDIA Corp.', price: 124.50, assetType: 'STOCK', color: '#10b981' },
  'SWDA.MI': { name: 'iShares MSCI World ETF', price: 98.40, assetType: 'ETF', color: '#a78bfa' },
  'US90.DE': { name: 'Lyxor S&P 500 UCITS ETF', price: 54.80, assetType: 'ETF', color: '#fbbf24' },
  BTC: { name: 'Bitcoin', price: 95420.00, assetType: 'CRYPTO', color: '#f59e0b' },
  ETH: { name: 'Ethereum', price: 3420.00, assetType: 'CRYPTO', color: '#6366f1' },
  EUR: { name: 'Euro Cash Liquidity', price: 1.00, assetType: 'CASH', color: '#6b7280' }
};

// Default index parameters
export const defaultMarketIndices: MarketIndex[] = [
  { name: "S&P 500", value: 5312.44, change: 42.15, changePercent: 0.80, sparkline: [5250, 5262, 5280, 5275, 5290, 5302, 5312] },
  { name: "NASDAQ 100", value: 18672.90, change: 198.40, changePercent: 1.07, sparkline: [18320, 18410, 18500, 18460, 18580, 18610, 18672] },
  { name: "EURO STOXX 50", value: 5042.18, change: -12.45, changePercent: -0.25, sparkline: [5070, 5062, 5055, 5040, 5045, 5048, 5042] },
  { name: "FTSE MIB", value: 34520.10, change: 112.50, changePercent: 0.33, sparkline: [34250, 34310, 34400, 34360, 34480, 34500, 34520] }
];

export const liveTickerItems: TickerPrice[] = [
  { symbol: "BTC/EUR", name: "Bitcoin", price: 95420.00, change: 1845.00, changePercent: 1.97 },
  { symbol: "ETH/EUR", name: "Ethereum", price: 3420.00, change: 84.50, changePercent: 2.53 },
  { symbol: "EUR/USD", name: "Euro / US Dollar", price: 1.0824, change: -0.0012, changePercent: -0.11 },
  { symbol: "GOLD", name: "Oro Spot (g)", price: 74.82, change: 0.64, changePercent: 0.86 },
  { symbol: "AAPL", name: "Apple Inc.", price: 181.18, change: 2.44, changePercent: 1.37 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 124.50, change: 1.85, changePercent: 1.50 },
  { symbol: "US10Y", name: "Bund 10Y US", price: 4.425, change: 0.015, changePercent: 0.34 }
];

export const initialNews = [
  {
    id: 'n-1',
    time: "14:22",
    title: "La Federal Reserve mantiene i tassi stabili ma apre a tagli nel Q3",
    source: "Bloomberg",
    sentiment: "BULLISH" as const,
    impact: "I mercati reagiscono positivamente con il NASDAQ in rialzo dell'1.2%."
  },
  {
    id: 'n-2',
    time: "11:05",
    title: "NVIDIA svela la nuova architettura Blackwell Ultra: forte domanda dai Cloud Provider",
    source: "Reuters",
    sentiment: "BULLISH" as const,
    impact: "Pre-market alle stelle per i produttori di semiconduttori globali."
  },
  {
    id: 'n-3',
    time: "08:15",
    title: "L'inflazione in Eurozona scende al 2.1%, oltre le stime degli analisti BCE",
    source: "Il Sole 24 Ore",
    sentiment: "BULLISH" as const,
    impact: "Crescono le aspettative per un taglio dei tassi di 25bps a Giugno."
  },
  {
    id: 'n-4',
    time: "Ieri",
    title: "Regolamentazione Cripto USA: approvato disegno di legge bipartitico per la custodia di asset",
    source: "CoinDesk",
    sentiment: "BULLISH" as const,
    impact: "Grande afflusso istituzionale negli ETF spot Bitcoin ed Ethereum."
  },
  {
    id: 'n-5',
    time: "Ieri",
    title: "Pressioni geopolitiche sullo Stretto di Taiwan pesano sui titoli tech integrati",
    source: "Financial Times",
    sentiment: "BEARISH" as const,
    impact: "Flessione tecnica per le fonderie TSMC e i partner logistici occidentali."
  },
  {
    id: 'n-6',
    time: "2 giorni fa",
    title: "Raccolta record per gli ETF azionari globali ad accumulazione, trainata dai canali retail",
    source: "Morningstar",
    sentiment: "NEUTRAL" as const,
    impact: "L'esposizione azionaria globale MSCI World si consolida sui massimi di sempre."
  }
];

/**
 * Super dynamic retro-simulation engine that models the portfolio's last 5 years evolution.
 * It is calculated based on the custom list of transactions to be 100% reactive!
 * If the user edits/adds transactions, this chart modifies the historic shape logically.
 */
export function generateHistoricalData(transactions: Transaction[]): HistoricalDataPoint[] {
  // Let's create a list of historical months over the past 5 years (60 data points)
  // Ending at current month 2026-05.
  const dataPointsCount = 60;
  const result: HistoricalDataPoint[] = [];

  const baseDate = new Date(2021, 5, 20); // 5 years back approximately

  // 1. Pre-calculate average buy prices for any tickers, including those not in CURRENT_ASSET_PRICES
  const tickerAvgBuyPrices: Record<string, number> = {};
  const tickerTotalCost: Record<string, number> = {};
  const tickerTotalQty: Record<string, number> = {};

  transactions.forEach(tx => {
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

  // 2. Prepare temporary raw historical points
  const rawPoints: Array<{
    date: Date;
    dateLabel: string;
    t: number;
    sp500Value: number;
    msciValue: number;
    portfolioValue: number;
    hasActiveAssets: boolean;
  }> = [];

  for (let i = 0; i < dataPointsCount; i++) {
    // Fraction representing timeline progress from 0 (past) to 1 (present day)
    const t = i / (dataPointsCount - 1);

    // Compute month date
    const d = new Date(baseDate.getTime());
    d.setMonth(baseDate.getMonth() + i);
    const dateStr = d.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' });

    // Benchmark modeling:
    // S&P 500 starting from a base index around 3800 to 5300
    const sp500Value = 3800 + (1500 * t) + (Math.sin(t * 12) * 350) + (Math.cos(t * 4) * 150) + (t > 0.85 ? (t - 0.85) * 800 : 0);
    // MSCI World: Base around 2550 to 3450
    const msciValue = 2550 + (900 * t) + (Math.sin(t * 12) * 230) + (Math.cos(t * 4) * 90) + (t > 0.85 ? (t - 0.85) * 450 : 0);

    // Dynamic Portfolio calculation based on active transactions at this point in time
    let portfolioValue = 0;
    const currentSimulatedTime = d.getTime();

    // Group assets owned at this simulated point
    const assetsBalance: Record<string, { quantity: number; cost: number; type: string }> = {};

    transactions.forEach(tx => {
      const txTime = new Date(tx.date).getTime();
      if (txTime <= currentSimulatedTime) {
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

    // Calculate simulated value for each asset based on realistic historical curves
    Object.keys(assetsBalance).forEach(ticker => {
      const asset = assetsBalance[ticker];
      if (asset.quantity <= 0) return;
      hasActiveAssets = true;

      const currentRef = CURRENT_ASSET_PRICES[ticker];
      const currentPrice = currentRef ? currentRef.price : (tickerAvgBuyPrices[ticker] || 100);

      let simulatedAssetPrice = currentPrice;

      // Model historical price curves dynamically relative to t (0 to 1)
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
        // Organic general asset tracker curve to prevent boring perfectly flat custom stocks
        const curve = 0.75 + (0.25 * t) + (Math.sin(t * 6) * 0.04);
        simulatedAssetPrice = currentPrice * Math.max(0.65, Math.min(1.1, curve));
      }

      portfolioValue += asset.quantity * simulatedAssetPrice;
    });

    // Lock exact present values on the final calculation point
    if (i === dataPointsCount - 1 && hasActiveAssets) {
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
      date: d,
      dateLabel: dateStr,
      t,
      sp500Value,
      msciValue,
      portfolioValue,
      hasActiveAssets
    });
  }

  // 3. Resolve starting asset values smoothly back through history to keep portfolios continuous
  // Locate the index of the first month that has active user transactions
  let firstActiveIdx = rawPoints.findIndex(pt => pt.hasActiveAssets);
  let firstActiveValue = 0;
  let firstActiveMsci = 1;

  if (firstActiveIdx !== -1) {
    firstActiveValue = rawPoints[firstActiveIdx].portfolioValue;
    firstActiveMsci = rawPoints[firstActiveIdx].msciValue;
  } else {
    // If user has zero total transactions, fallback gracefully to a 0 baseline
    firstActiveIdx = 0;
    firstActiveValue = 0;
    firstActiveMsci = rawPoints[0].msciValue;
  }

  // 4. Fill output points and apply relative normalization on benchmarks
  rawPoints.forEach((raw, idx) => {
    let finalValue = raw.portfolioValue;

    if (idx < firstActiveIdx) {
      // Extrapolate backward dynamically using the MSCI World growth factor
      const growthRatio = raw.msciValue / firstActiveMsci;
      finalValue = firstActiveValue * growthRatio;
    }

    // Benchmark normalization: Scaled starting at the initial relative base of portfolio
    const startSp500 = rawPoints[0].sp500Value;
    const growthSp500 = raw.sp500Value / startSp500;

    const startMsci = rawPoints[0].msciValue;
    const growthMsci = raw.msciValue / startMsci;

    // Settle beautiful comparison scaling
    const initialPortfolioBase = firstActiveIdx === 0 
      ? firstActiveValue 
      : firstActiveValue * (rawPoints[0].msciValue / firstActiveMsci);
    
    const normalizedBase = Math.max(1000, initialPortfolioBase);

    result.push({
      date: raw.dateLabel,
      portfolio: Math.round(finalValue),
      sp500: Math.round(normalizedBase * growthSp500),
      msci: Math.round(normalizedBase * growthMsci)
    });
  });

  return result;
}
