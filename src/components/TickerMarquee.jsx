import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const TICKERS = [
  { symbol: 'S&P 500', price: '5,234.18', change: '+1.24%', isPositive: true },
  { symbol: 'MSCI WORLD', price: '3,412.90', change: '+0.85%', isPositive: true },
  { symbol: 'EUR/USD', price: '1.0845', change: '-0.12%', isPositive: false },
  { symbol: 'BTC/EUR', price: '62,140.00', change: '+4.50%', isPositive: true },
  { symbol: 'ETH/EUR', price: '3,210.50', change: '+2.10%', isPositive: true },
  { symbol: 'GOLD', price: '2,345.60', change: '-0.45%', isPositive: false },
  { symbol: 'AAPL', price: '173.50', change: '+1.05%', isPositive: true },
  { symbol: 'NVDA', price: '880.08', change: '+3.40%', isPositive: true },
  { symbol: 'TSLA', price: '175.22', change: '-2.15%', isPositive: false },
]

export default function TickerMarquee() {
  // Duplicate the array to create a seamless infinite scroll effect
  const marqueeItems = [...TICKERS, ...TICKERS]

  return (
    <div className="w-full bg-surface border-b border-border overflow-hidden whitespace-nowrap h-10 flex items-center shrink-0">
      <div className="flex animate-marquee min-w-max">
        {marqueeItems.map((ticker, index) => (
          <div 
            key={`${ticker.symbol}-${index}`} 
            className="flex items-center gap-2 px-6 border-r border-border/50 last:border-r-0"
          >
            <span className="text-xs font-bold text-textPrimary tracking-wider">{ticker.symbol}</span>
            <span className="text-xs text-textSecondary tabular-nums">{ticker.price}</span>
            <span className={`text-xs flex items-center font-medium ${ticker.isPositive ? 'text-success' : 'text-danger'}`}>
              {ticker.isPositive ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
              {ticker.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
