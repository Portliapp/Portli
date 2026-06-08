import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Briefcase, DollarSign, PieChart, Shield } from 'lucide-react';
import { PortfolioAsset } from '../types';

interface KpiCardsProps {
  assets: PortfolioAsset[];
  totalValue: number;
  totalCost: number;
}

export default function KpiCards({ assets, totalValue, totalCost }: KpiCardsProps) {
  // P&L metrics
  const totalPnL = useMemo(() => totalValue - totalCost, [totalValue, totalCost]);
  const totalPnLPercent = useMemo(() => {
    if (totalCost === 0) return 0;
    return (totalPnL / totalCost) * 100;
  }, [totalPnL, totalCost]);

  const pnlPositive = totalPnL >= 0;

  // Asset type weights for the progress bar
  const typeWeights = useMemo(() => {
    const weights = { STOCK: 0, ETF: 0, CRYPTO: 0, CASH: 0 };
    assets.forEach((asset) => {
      weights[asset.assetType] = (weights[asset.assetType] || 0) + asset.weight;
    });
    return weights;
  }, [assets]);

  // Max weight asset
  const maxWeightAsset = useMemo(() => {
    if (assets.length === 0) return null;
    return [...assets]
      .filter((a) => a.ticker !== 'EUR') // Focus on investments
      .sort((a, b) => b.weight - a.weight)[0] || assets[0];
  }, [assets]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      
      {/* CARD 1: PATRIMONIO TOTALE */}
      <div 
        id="kpi-total-wealth" 
        className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col justify-between"
      >
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.1em] block mb-1">
            PATRIMONIO TOTALE €
          </span>
          <div className="text-3xl font-black text-white font-sans tracking-tight mb-2">
            €{totalValue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Weights Mini Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1.5">
            <span>Ripartizione Asset</span>
            <span className="text-white text-[9px] font-bold">
              EQ:{typeWeights.STOCK.toFixed(0)}% • ETF:{typeWeights.ETF.toFixed(0)}% • CRY:{typeWeights.CRYPTO.toFixed(0)}% • LIQ:{typeWeights.CASH.toFixed(0)}%
            </span>
          </div>
          
          <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-[#1a2332]">
            <div style={{ width: `${typeWeights.STOCK}%` }} className="bg-[#00c2ff]" title="Azioni" />
            <div style={{ width: `${typeWeights.ETF}%` }} className="bg-[#a78bfa]" title="ETF" />
            <div style={{ width: `${typeWeights.CRYPTO}%` }} className="bg-[#f59e0b]" title="Crypto" />
            <div style={{ width: `${typeWeights.CASH}%` }} className="bg-[#00e5a0]" title="Cash" />
          </div>
        </div>
      </div>

      {/* CARD 2: CAPITALE INVESTITO & P&L GLOBALE */}
      <div 
        id="kpi-investments" 
        className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.1em] block mb-1">
              CAPITALE INVESTITO
            </span>
            <div className="text-2xl font-black text-white font-sans tracking-tight">
              €{totalCost.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.1em] block mb-1">
              PROFITTABILITÀ ATTUALE (PnL)
            </span>
            <span
              className={`inline-flex items-center gap-1 font-bold text-sm px-2.5 py-1 rounded-md ${
                pnlPositive
                  ? 'bg-[#00e5a0]/10 text-[#00e5a0] border border-[#00e5a0]/20'
                  : 'bg-[#ff3d6b]/10 text-[#ff3d6b] border border-[#ff3d6b]/20'
              }`}
            >
              {pnlPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {pnlPositive ? '+' : ''}
              {totalPnLPercent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Absolute Performance Indicator */}
        <div className="mt-4 flex items-center justify-between border-t border-[#1a2332]/60 pt-3">
          <span className="text-[10px] font-mono text-gray-400">Rendimento Assoluto Virtuale</span>
          <span className={`font-mono font-bold text-xs ${pnlPositive ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'}`}>
            {pnlPositive ? '▲' : '▼'} €
            {Math.abs(totalPnL).toLocaleString('it-IT', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* CARD 3: ASSET PIÙ RILEVANTE (MAX KEY ALLOCATION) */}
      <div 
        id="kpi-allocation" 
        className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col justify-between"
      >
        {maxWeightAsset ? (
          <>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.1em] block mb-1">
                TOP ALLOCATION (MAX PESO)
              </span>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-mono text-white" style={{ backgroundColor: maxWeightAsset.colorCode }}>
                    {maxWeightAsset.ticker[0]}
                  </div>
                  <span className="text-lg font-black text-white font-sans">{maxWeightAsset.ticker}</span>
                  <span className="text-gray-400 text-xs hidden sm:inline truncate max-w-[120px]">{maxWeightAsset.name}</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {maxWeightAsset.weight.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Allocation weight track */}
            <div className="mt-4">
              <div className="flex justify-between text-[9px] font-mono text-gray-500 mb-1">
                <span>Esposizione Singola</span>
                <span>Valore: €{maxWeightAsset.currentValue.toLocaleString('it-IT', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="w-full bg-[#1a2332] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${maxWeightAsset.weight}%`,
                    backgroundColor: maxWeightAsset.colorCode || '#a78bfa'
                  }} 
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-4">
            <span className="text-gray-500 text-xs">Nessun asset inserito nel portafoglio</span>
          </div>
        )}
      </div>

    </div>
  );
}
