import React, { useMemo, useState, useEffect } from 'react';
import ThreeDDonutChart from './ThreeDDonutChart';
import { PortfolioAsset } from '../types';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  PieChart as PieIcon,
  ShieldAlert,
  HelpCircle,
  Zap
} from 'lucide-react';

interface DashboardAllocationCardProps {
  assets: PortfolioAsset[];
  totalValue: number;
  onSelectAsset: (ticker: string) => void;
}

export default function DashboardAllocationCard({ 
  assets, 
  totalValue, 
  onSelectAsset 
}: DashboardAllocationCardProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter out cash for a pure investment-focused visual split if desired,
  // but let's include all assets to represent exact cash weight as well.
  const chartData = useMemo(() => {
    if (assets.length === 0) return [];
    return assets.map(asset => ({
      name: asset.ticker,
      value: Math.round(asset.currentValue),
      percentage: asset.weight,
      color: asset.colorCode || '#00c2ff',
    }));
  }, [assets]);

  // Compute portfolio's top return drivers (best 2 and worst 2 performers)
  const stats = useMemo(() => {
    if (assets.length === 0) return { gainers: [], losers: [] };
    
    // Sort assets that are not EUR (cash) by absolute yield
    const activeInvestments = [...assets]
      .filter(a => a.ticker !== 'EUR')
      .sort((a, b) => b.pnlPercent - a.pnlPercent);

    const gainers = activeInvestments.filter(a => a.pnl > 0).slice(0, 2);
    const losers = activeInvestments.filter(a => a.pnl < 0).reverse().slice(0, 2);

    return { gainers, losers };
  }, [assets]);

  // Dynamic Portfolio Diversification Score calculation
  const diversificationLabel = useMemo(() => {
    if (assets.length === 0) return { score: 0, title: 'Inattivo', desc: 'Aggiungi transazioni per calcolare...', color: 'text-gray-500', bgClass: 'bg-gray-500/10 border-gray-500/20' };
    
    const uniqueHoldingsCount = assets.filter(a => a.ticker !== 'EUR' && a.currentValue > 1).length;
    const maxWeight = assets.length > 0 ? Math.max(...assets.map(a => a.weight)) : 0;
    
    let score = 0;
    // Base weight from counts: 1 asset = 25 pts, 2 = 50 pts, 3 = 70 pts, 4+ = 100 pts
    if (uniqueHoldingsCount === 1) score += 25;
    else if (uniqueHoldingsCount === 2) score += 55;
    else if (uniqueHoldingsCount === 3) score += 80;
    else if (uniqueHoldingsCount >= 4) score += 95;

    // Penalty for overconcentration (if any asset has >45% weight, reduce score)
    if (maxWeight > 60) score -= 30;
    else if (maxWeight > 40) score -= 15;
    else if (maxWeight > 10) score += 5; // positive bonus for balanced weight

    const finalScore = Math.min(100, Math.max(10, score));

    if (finalScore >= 80) {
      return {
        score: finalScore,
        title: 'Eccellente',
        desc: 'Asset ben distribuiti. Rischi di mercato ampiamente mitigati.',
        color: 'text-[#00e5a0]',
        bgClass: 'bg-[#00e5a0]/10 border-[#00e5a0]/20 text-[#00e5a0]'
      };
    } else if (finalScore >= 50) {
      return {
        score: finalScore,
        title: 'Moderata',
        desc: 'Pochi cluster concentrati. Potresti aumentare i comparti ETF.',
        color: 'text-[#00c2ff]',
        bgClass: 'bg-[#00c2ff]/10 border-[#00c2ff]/20 text-[#00c2ff]'
      };
    } else {
      return {
        score: finalScore,
        title: 'Concentrata (Elevata)',
        desc: 'Forte esposizione su singoli asset. Vulnerabile a picchi di volatilità.',
        color: 'text-[#ff3d6b]',
        bgClass: 'bg-[#ff3d6b]/10 border-[#ff3d6b]/20 text-[#ff3d6b]'
      };
    }
  }, [assets]);

  // Render a custom tooltip for the Donut segments is now handled internally by ThreeDDonutChart

  return (
    <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col justify-between relative overflow-hidden group/alloc select-none">
      {/* Visual glowing underline */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#a78bfa] to-transparent opacity-40 group-hover/alloc:opacity-85 transition duration-500" />

      {/* Title block */}
      <div className="flex justify-between items-center border-b border-[#1a2332]/60 pb-3.5 mb-4 font-mono">
        <div className="flex items-center gap-2">
          <PieIcon className="h-4.5 w-4.5 text-[#a78bfa] animate-pulse" />
          <h3 className="text-xs font-black text-white uppercase tracking-wider text-[11px]">
            RIPARTIZIONE & DRIVER PERFORMANCE
          </h3>
        </div>
        <div className="relative group">
          <HelpCircle className="h-3.5 w-3.5 text-gray-500 hover:text-gray-400 cursor-pointer" />
          <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-[#07090f] border border-[#1a2332] text-gray-400 p-2.5 text-[9px] rounded-lg w-52 leading-relaxed shadow-2xl z-30">
            Fornisce un'istantanea interattiva dei pesi del portafoglio correnti e dei segmenti che spingono verso l'alto o verso il basso il tuo utile storico.
          </div>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <ShieldAlert className="h-9 w-9 text-gray-600 mb-2 animate-bounce" />
          <span className="text-xs text-gray-400 font-mono">Nessun dato di bilancio</span>
          <p className="text-[10px] text-gray-500 mt-1 max-w-xs font-mono">
            Registra i tuoi primi scambi per renderizzare la torta d'esposizione.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          
          {/* COLUMN 1: INTERACTIVE PIE DONUT CONTAINER */}
          <div className="relative flex justify-center items-center">
            {isMounted ? (
              <ThreeDDonutChart
                data={chartData}
                totalValue={totalValue}
                assetsLength={assets.length}
                onHoverSegment={setHoveredSegment}
              />
            ) : (
              <div className="text-[10px] text-gray-500 font-mono">Calcolando asset...</div>
            )}
          </div>

          {/* COLUMN 2: EXPOSURE LEDGER & HIGHLIGHTS */}
          <div className="space-y-4">
            
            {/* Diversification Status Box */}
            <div className={`p-3 rounded-lg border flex flex-col gap-1 ${diversificationLabel.bgClass}`}>
              <div className="flex items-center justify-between text-[10px] font-mono font-black uppercase">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3 inline shrink-0 text-amber-400 animate-pulse" />
                  Diversificazione:
                </span>
                <span className="font-bold underline italic">{diversificationLabel.title}</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-normal font-sans">
                {diversificationLabel.desc}
              </p>
            </div>

            {/* Top Drivers List */}
            <div className="space-y-2">
              <span className="text-[8.5px] font-mono text-gray-500 uppercase font-bold tracking-wider block">
                Migliori comparti d'impatto (P&L)
              </span>

              {/* Render positive and negative drivers side by side or vertically */}
              <div className="grid grid-cols-1 gap-1.5">
                
                {/* 1. Best performing holdings */}
                {stats.gainers.slice(0, 2).map(a => (
                  <div 
                    key={a.ticker} 
                    onClick={() => onSelectAsset(a.ticker)}
                    className="flex justify-between items-center bg-[#07090f]/50 border border-[#1a2332] p-2 rounded-lg cursor-pointer hover:border-[#00e5a0]/30 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.colorCode }} />
                      <span className="text-[10.5px] font-mono font-bold text-white uppercase">{a.ticker}</span>
                    </div>
                    <span className="text-[#00e5a0] font-mono font-black text-[10px] flex items-center">
                      <ArrowUpRight className="h-3 w-3" />
                      +{a.pnlPercent.toFixed(1)}%
                    </span>
                  </div>
                ))}

                {/* 2. Worst performing holdings */}
                {stats.losers.slice(0, 1).map(a => (
                  <div 
                    key={a.ticker} 
                    onClick={() => onSelectAsset(a.ticker)}
                    className="flex justify-between items-center bg-[#07090f]/50 border border-[#1a2332] p-2 rounded-lg cursor-pointer hover:border-[#ff3d6b]/30 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.colorCode }} />
                      <span className="text-[10.5px] font-mono font-bold text-white uppercase">{a.ticker}</span>
                    </div>
                    <span className="text-[#ff3d6b] font-mono font-black text-[10px] flex items-center">
                      <ArrowDownRight className="h-3 w-3" />
                      {a.pnlPercent.toFixed(1)}%
                    </span>
                  </div>
                ))}

                {stats.gainers.length === 0 && stats.losers.length === 0 && (
                  <span className="text-[10px] text-gray-500 font-mono italic">No allocation metrics calculated.</span>
                )}

              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
