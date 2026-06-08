import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, Sparkles, Filter, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioAsset, AssetType } from '../types';

interface PriceCellProps {
  asset: PortfolioAsset;
  editingTicker: string | null;
  editVal: string;
  setEditVal: (val: string) => void;
  setEditingTicker: (val: string | null) => void;
  handleSavePrice: (ticker: string) => void;
  isCash: boolean;
}

function PriceCell({
  asset,
  editingTicker,
  editVal,
  setEditVal,
  setEditingTicker,
  handleSavePrice,
  isCash
}: PriceCellProps) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevPrice = useRef(asset.currentPrice);

  useEffect(() => {
    if (asset.currentPrice > prevPrice.current) {
      setFlash('up');
      const t = setTimeout(() => setFlash(null), 1000);
      return () => clearTimeout(t);
    } else if (asset.currentPrice < prevPrice.current) {
      setFlash('down');
      const t = setTimeout(() => setFlash(null), 1000);
      return () => clearTimeout(t);
    }
    prevPrice.current = asset.currentPrice;
  }, [asset.currentPrice]);

  if (isCash) return <span className="text-gray-500">-</span>;

  if (editingTicker === asset.ticker) {
    return (
      <div className="flex items-center gap-1 justify-end">
        <input
          type="number"
          step="any"
          value={editVal}
          onChange={(e) => setEditVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSavePrice(asset.ticker);
            } else if (e.key === 'Escape') {
              setEditingTicker(null);
            }
          }}
          className="bg-[#07090f] border border-[#00c2ff]/80 text-right rounded py-0.5 px-1.5 text-xs text-white max-w-[80px] font-mono focus:outline-none"
          autoFocus
        />
        <button
          onClick={() => handleSavePrice(asset.ticker)}
          className="text-[#00e5a0] hover:text-white bg-[#00e5a0]/15 hover:bg-[#00e5a0] border border-[#00e5a0]/20 font-black p-0.5 px-1.5 rounded text-[10px] transition cursor-pointer"
        >
          ✓
        </button>
      </div>
    );
  }

  return (
    <div 
      onClick={() => {
        setEditingTicker(asset.ticker);
        setEditVal(asset.currentPrice.toString());
      }}
      className="flex items-center justify-end gap-1.5 group/price cursor-pointer h-7"
      title="Fai click per modificare il prezzo attuale"
    >
      <motion.span
        animate={{
          color: flash === 'up' ? '#00e5a0' : flash === 'down' ? '#ff3d6b' : '#ffffff',
          backgroundColor: flash === 'up' ? 'rgba(0, 229, 160, 0.2)' : flash === 'down' ? 'rgba(255, 61, 107, 0.2)' : 'rgba(0,0,0,0)',
        }}
        transition={{
          type: "tween",
          duration: flash ? 0.08 : 0.8,
          ease: "easeOut"
        }}
        className="px-1.5 py-0.5 rounded transition duration-200 font-bold"
      >
        €{asset.currentPrice.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
      </motion.span>
      <span className="opacity-0 group-hover/price:opacity-100 text-gray-500 hover:text-[#00c2ff] text-[9px] transition font-normal font-sans">
        [Modifica]
      </span>
    </div>
  );
}

interface AssetsTableProps {
  assets: PortfolioAsset[];
  onSelectAsset: (ticker: string) => void;
  customPrices?: Record<string, number>;
  onUpdatePrice?: (ticker: string, newPrice: number) => void;
}

export default function AssetsTable({ 
  assets, 
  onSelectAsset,
  customPrices,
  onUpdatePrice
}: AssetsTableProps) {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Inline pricing edits states
  const [editingTicker, setEditingTicker] = useState<string | null>(null);
  const [editVal, setEditVal] = useState<string>('');

  const handleSavePrice = (ticker: string) => {
    const val = parseFloat(editVal);
    if (!isNaN(val) && val >= 0 && onUpdatePrice) {
      onUpdatePrice(ticker, val);
    }
    setEditingTicker(null);
  };

  // Filter assets by selection & search
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesFilter =
        activeFilter === 'ALL' || asset.assetType === activeFilter;
      const matchesSearch =
        asset.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [assets, activeFilter, searchQuery]);

  return (
    <div className="bg-[#111927] border border-[#1a2332] rounded-xl overflow-hidden ai-glow neon-border flex flex-col justify-between">
      
      {/* Header and Filter Controls */}
      <div className="p-4 bg-[#0a0f1d]/40 border-b border-[#1a2332] flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3 bg-[#00c2ff] rounded-sm" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Composizione del Portafoglio ({filteredAssets.length})
            </h3>
          </div>

          {/* Micro Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500" />
            <input
              type="text"
              placeholder="Cerca asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#07090f] border border-[#1a2332] rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00c2ff]/50 w-full sm:w-48 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Filter categories tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <Filter className="h-3.5 w-3.5 text-gray-500 shrink-0 mr-1 hidden sm:inline" />
          {[
            { id: 'ALL', label: 'Tutti' },
            { id: 'STOCK', label: 'Azioni' },
            { id: 'ETF', label: 'ETF' },
            { id: 'CRYPTO', label: 'Crypto' },
            { id: 'CASH', label: 'Liquidità' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-3 py-1 rounded-md text-[10px] uppercase font-mono tracking-wider font-bold shrink-0 transition ${
                activeFilter === cat.id
                  ? 'bg-[#1a2332] text-[#00c2ff] border border-[#2d3a4e]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a2332]/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto max-h-[390px] scrollbar-thin">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="border-b border-[#1a2332] text-gray-400 uppercase tracking-wider font-mono text-[9px] font-black h-9 select-none bg-[#0a0f1d]/20">
              <th className="px-4 py-2 font-bold">Asset / Ticker</th>
              <th className="px-3 py-2 text-right font-bold">Prezzo Attuale</th>
              <th className="px-3 py-2 text-right font-bold">PM di Carico</th>
              <th className="px-3 py-2 text-right font-bold">Quantità</th>
              <th className="px-3 py-2 text-right font-bold">Valore Corrente</th>
              <th className="px-3 py-2 text-right font-bold">Rendimento (P&L)</th>
              <th className="px-4 py-2 text-center font-bold">Analisi AI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a2332]/50">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500 text-xs font-mono">
                  Nessun asset corrisponde alla query selezionata.
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => {
                const isPositive = asset.pnl >= 0;
                const isCash = asset.assetType === 'CASH';

                return (
                  <tr
                    key={asset.ticker}
                    className="hover:bg-[#162134]/30 transition group select-none text-xs"
                  >
                    {/* Ticker and Logo Icon */}
                    <td className="px-4 py-2.5 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-black font-mono text-white text-[11px] shrink-0"
                          style={{
                            backgroundColor: `${asset.colorCode}22`,
                            border: `1px solid ${asset.colorCode}55`,
                            color: asset.colorCode,
                          }}
                        >
                          {asset.ticker.slice(0, 3)}
                        </div>
                        <div className="truncate max-w-[150px]">
                          <div className="font-extrabold text-white group-hover:text-[#00c2ff] transition flex items-center gap-1.5">
                            {asset.ticker}
                            <span className="text-[8px] bg-[#1a2332] text-gray-400 py-0.5 px-1 rounded uppercase font-mono">
                              {asset.assetType}
                            </span>
                          </div>
                          <div className="text-gray-500 font-medium text-[10px] truncate max-w-[130px]" title={asset.name}>
                            {asset.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Prezzo attuale */}
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-white max-w-[130px]">
                      <PriceCell
                        asset={asset}
                        editingTicker={editingTicker}
                        editVal={editVal}
                        setEditVal={setEditVal}
                        setEditingTicker={setEditingTicker}
                        handleSavePrice={handleSavePrice}
                        isCash={isCash}
                      />
                    </td>

                    {/* Prezzo Medio di Carico */}
                    <td className="px-3 py-2.5 text-right font-mono text-gray-400">
                      {isCash ? '-' : `€${asset.averageBuyPrice.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </td>

                    {/* Quantità */}
                    <td className="px-3 py-2.5 text-right font-mono text-white">
                      {isCash
                        ? asset.quantity.toLocaleString('it-IT')
                        : asset.quantity.toLocaleString('it-IT', { maximumFractionDigits: 4 })}
                    </td>

                    {/* Valore Corrente */}
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-white">
                      €{asset.currentValue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <div className="text-[9px] text-gray-500 font-medium font-sans">
                        Peso: {asset.weight.toFixed(1)}%
                      </div>
                    </td>

                    {/* Rendimento Unitario / P&L */}
                    <td className="px-3 py-2.5 text-right font-mono">
                      {isCash ? (
                        <span className="text-gray-500">-</span>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span
                            className={`font-black flex items-center text-[11px] ${
                              isPositive ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'
                            }`}
                          >
                            {isPositive ? (
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                            ) : (
                              <ArrowDownRight className="h-3.5 w-3.5 shrink-0" />
                            )}
                            €{Math.abs(asset.pnl).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                          </span>
                          <span
                            className={`text-[9px] font-bold ${
                              isPositive ? 'text-[#00e5a0]/80' : 'text-[#ff3d6b]/80'
                            }`}
                          >
                            {isPositive ? '+' : ''}
                            {asset.pnlPercent.toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </td>

                    {/* AI Analyzer Action Button */}
                    <td className="px-4 py-2.5 text-center">
                      {isCash ? (
                        <span className="text-gray-600 text-[10px] font-mono select-none">-</span>
                      ) : (
                        <button
                          onClick={() => onSelectAsset(asset.ticker)}
                          aria-label={`Analyze ${asset.ticker} with AI`}
                          className="inline-flex items-center gap-1 bg-[#1a2332]/50 hover:bg-[#00c2ff]/10 hover:text-[#00c2ff] border border-[#232e41] hover:border-[#00c2ff]/30 text-gray-400 py-1 px-2.5 rounded-lg transition duration-200"
                        >
                          <Sparkles className="h-3 w-3 inline cursor-pointer text-[#00c2ff] group-hover:scale-110" />
                          <span className="text-[9px] font-bold font-mono tracking-tight uppercase cursor-pointer">
                            Insights
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}
