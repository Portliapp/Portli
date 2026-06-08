import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Radio } from 'lucide-react';
import { liveTickerItems } from '../data';
import { TickerPrice } from '../types';

function TickerItem({ item }: { item: TickerPrice; key?: string }) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevPrice = useRef(item.price);

  useEffect(() => {
    if (item.price > prevPrice.current) {
      setFlash('up');
      const t = setTimeout(() => setFlash(null), 1000);
      return () => clearTimeout(t);
    } else if (item.price < prevPrice.current) {
      setFlash('down');
      const t = setTimeout(() => setFlash(null), 1000);
      return () => clearTimeout(t);
    }
    prevPrice.current = item.price;
  }, [item.price]);

  const isPositive = item.change >= 0;

  return (
    <div
      className="inline-flex items-center gap-2 hover:bg-[#111927] px-2 py-1 rounded transition duration-250 cursor-pointer"
    >
      <span className="text-gray-400 font-bold">{item.symbol}</span>
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
        className="px-1.5 py-0.5 rounded font-semibold text-white"
      >
        {item.symbol.includes("EUR/USD") || item.symbol.includes("US10Y")
          ? ""
          : "€"}
        {item.price.toLocaleString('it-IT', {
          minimumFractionDigits: item.price < 5 ? 4 : 2,
          maximumFractionDigits: item.price < 5 ? 4 : 2,
        })}
      </motion.span>
      
      <span
        className={`flex items-center gap-0.5 text-[10px] font-bold ${
          isPositive ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'
        }`}
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {isPositive ? '+' : ''}
        {item.changePercent}%
      </span>
    </div>
  );
}

export default function HeaderTicker() {
  const [tickerItems, setTickerItems] = useState<TickerPrice[]>(liveTickerItems);

  // Simulate ultra-realistic live ticking of currency and asset prices
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerItems((prev) =>
        prev.map((item) => {
          // Adjust price slightly as a random walk of +/- 0.05%
          const changePercent = (Math.random() - 0.5) * 0.001; 
          const prevPrice = item.price;
          const newPrice = +(prevPrice * (1 + changePercent)).toFixed(
            item.price > 1000 ? 2 : item.price < 5 ? 4 : 2
          );
          const rawDiff = +(newPrice - prevPrice).toFixed(4);
          const accumulatedChange = +(item.change + rawDiff).toFixed(2);
          const accumulatedPercent = +(
            (accumulatedChange / (newPrice - accumulatedChange)) *
            100
          ).toFixed(2);

          return {
            ...item,
            price: newPrice,
            change: accumulatedChange,
            changePercent: accumulatedPercent,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="ticker-bar" className="w-full bg-[#0a0f1d] border-b border-[#1a2332] py-2 px-4 shadow-lg overflow-hidden flex items-center justify-between text-xs font-mono">
      {/* Scrollable Container with Gradient Masks for High Fidelity */}
      <div className="flex-1 flex items-center overflow-x-auto scrollbar-none gap-8 pr-4">
        <div className="flex items-center gap-2 text-[#00c2ff] font-semibold shrink-0 uppercase tracking-wider text-[10px]">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#00c2ff] animate-ping" />
          Live Tickers:
        </div>
        
        <div className="flex items-center gap-8 animate-[marquee_50s_linear_infinite] whitespace-nowrap">
          {tickerItems.map((item, idx) => (
            <TickerItem key={`${item.symbol}-${idx}`} item={item} />
          ))}
        </div>
      </div>

      {/* Connected Network Status Panel */}
      <div className="shrink-0 flex items-center gap-2 pl-4 border-l border-[#1a2332]">
        <span className="hidden sm:inline text-gray-400 text-[10px] tracking-wider uppercase">
          Feed API:
        </span>
        <div className="flex items-center gap-1.5 bg-[#00e5a0]/10 border border-[#00e5a0]/30 text-[#00e5a0] px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] tracking-wider relative overflow-hidden">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00e5a0] inline-block animate-[pulse_1.5s_infinite]" />
          <span>Connected</span>
        </div>
      </div>
    </div>
  );
}
