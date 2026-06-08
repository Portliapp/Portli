import { useEffect, useState } from 'react';
import { defaultMarketIndices, initialNews } from '../data';
import { MarketIndex } from '../types';
import { Globe, RefreshCw, Flame, AlertCircle } from 'lucide-react';

export default function NewsFeed() {
  const [indices, setIndices] = useState<MarketIndex[]>(defaultMarketIndices);
  const [isUpdating, setIsUpdating] = useState(false);

  // Slowly fluctuate market indices in real-time to simulate active trading
  useEffect(() => {
    const timer = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => setIsUpdating(false), 500);

      setIndices((prev) =>
        prev.map((idx) => {
          const delta = (Math.random() - 0.48) * (idx.value * 0.0003); // Slight upward bias
          const newValue = +(idx.value + delta).toFixed(2);
          const rawDiff = +(newValue - idx.value).toFixed(2);
          const accumulatedChange = +(idx.change + rawDiff).toFixed(2);
          const accumPercent = +((accumulatedChange / (newValue - accumulatedChange)) * 100).toFixed(2);

          // Rotate sparkline queue
          const copySparkline = [...idx.sparkline.slice(1), Math.round(newValue * (1 + (Math.random() - 0.5) * 0.001))];

          return {
            ...idx,
            value: newValue,
            change: accumulatedChange,
            changePercent: accumPercent,
            sparkline: copySparkline,
          };
        })
      );
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col gap-5">
      
      {/* SECTION A: INDICI DI BORSA GLOBALI */}
      <div>
        <div className="flex justify-between items-center border-b border-[#1a2332]/60 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2">
            <Globe className="h-4.5 w-4.5 text-[#00c2ff]" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Indici Globali Live
            </h3>
          </div>
          
          <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5 progress-rot">
            <RefreshCw className={`h-3 w-3 ${isUpdating ? 'animate-spin' : ''}`} />
            AUTO SIM_API
          </span>
        </div>

        {/* Indices Grid layout */}
        <div className="grid grid-cols-2 gap-2.5">
          {indices.map((index) => {
            const isPositive = index.change >= 0;
            return (
              <div
                key={index.name}
                className="bg-[#07090f]/70 border border-[#1a2332] rounded-lg p-3 hover:border-gray-700/50 transition cursor-default"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 font-mono mb-1">
                  <span>{index.name}</span>
                  <span className={`${isPositive ? 'text-[#00e5a0]' : 'text-[#ff3d6b]'}`}>
                    {isPositive ? '+' : ''}
                    {index.changePercent}%
                  </span>
                </div>
                
                <div className="text-sm font-black text-white font-mono tracking-tight">
                  {index.value.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>

                {/* Simulated static SVG sparkline inside indices card */}
                <div className="h-4 mt-2 opacity-50">
                  <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path
                      d={`M 0,10 Q 25,${isPositive ? 5 : 15} 50,10 T 100,${isPositive ? 2 : 18}`}
                      fill="none"
                      stroke={isPositive ? '#00e5a0' : '#ff3d6b'}
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION B: NOTIZIE MACROECONOMICE CON SENTIMENT */}
      <div>
        <div className="flex justify-between items-center border-b border-[#1a2332]/60 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2">
            <Flame className="h-4.5 w-4.5 text-amber-500" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Sentiment Flash & Market Feed
            </h3>
          </div>
        </div>

        {/* Feed List */}
        <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-1 scrollbar-thin">
          {initialNews.map((news) => {
            const isBullish = news.sentiment === 'BULLISH';
            const isBearish = news.sentiment === 'BEARISH';
            
            return (
              <div
                key={news.id}
                className="group border-b border-[#1a2332]/50 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-center gap-2 text-[10px] font-mono text-gray-500 mb-1">
                  <span className="font-bold flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-gray-600 inline-block" />
                    {news.source} • {news.time}
                  </span>
                  
                  {/* Sentiments Tag */}
                  <span
                    className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                      isBullish
                        ? 'bg-[#00e5a0]/10 text-[#00e5a0] border border-[#00e5a0]/20'
                        : isBearish
                        ? 'bg-[#ff3d6b]/10 text-[#ff3d6b] border border-[#ff3d6b]/20'
                        : 'bg-gray-800 text-gray-400 border border-gray-700/30'
                    }`}
                  >
                    {news.sentiment}
                  </span>
                </div>
                
                <h4 className="text-[11.5px] font-bold text-white leading-snug group-hover:text-[#00c2ff] transition cursor-help">
                  {news.title}
                </h4>
                
                <p className="text-[10px] text-gray-500 leading-relaxed mt-1 bg-[#07090f]/30 border-l border-gray-800 pl-1.5">
                  {news.impact}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
