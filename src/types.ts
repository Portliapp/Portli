export type AssetType = 'STOCK' | 'ETF' | 'CRYPTO' | 'CASH';

export interface Transaction {
  id: string;
  ticker: string;
  name: string;
  type: 'ACQUISTO' | 'VENDITA' | 'DEPOSITO';
  assetType: AssetType;
  quantity: number;
  price: number; // unit price
  date: string;
  fee?: number;
}

export interface PortfolioAsset {
  ticker: string;
  name: string;
  assetType: AssetType;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  currentValue: number;
  totalCost: number;
  pnl: number;        // absolute profit/loss in €
  pnlPercent: number; // profit/loss in %
  weight: number;     // percent of overall portfolio value (0 - 100)
  colorCode: string;  // visual accent color code
}

export interface AIAnalysisResult {
  ticker: string;
  name: string;
  fairValue: number;
  currentPriceReference: number;
  valuationStatus: 'UNDERVALUED' | 'OVERVALUED' | 'FAIR_VALUE';
  sector: string;
  industry: string;
  businessModel: string;
  risks: string[];
  aiInsights: string[];
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

export interface TickerPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface HistoricalDataPoint {
  date: string;
  portfolio: number;
  sp500: number;
  msci: number;
}
