import PortfolioSummary from './PortfolioSummary'
import TransactionList from './TransactionList'
import PerformanceChart from './PerformanceChart'
import AssetAllocation from './AssetAllocation'
import HoldingsList from './HoldingsList'
import Benchmarking from './Benchmarking'
import PortliAIInsights from './PortliAIInsights'

export default function Dashboard({ transactions, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Calculate portfolio metrics
  // Using some baseline logic and mock additions for visual perfection
  const metrics = transactions.reduce((acc, tx) => {
    const value = tx.quantity * tx.price
    const fee = tx.fee || 0
    
    if (tx.operation_type === 'BUY') {
      acc.totalInvested += value + fee
      acc.currentValue += value 
    } else if (tx.operation_type === 'SELL') {
      acc.totalInvested -= value 
      acc.currentValue -= (value - fee)
    }
    
    return acc
  }, { totalInvested: 0, currentValue: 0 })

  // Se non ci sono transazioni, mostriamo un mock di partenza per mostrare la UI "futuristica"
  const hasTx = transactions.length > 0;
  const totalInvested = hasTx ? metrics.totalInvested : 12000;
  const currentValue = hasTx ? metrics.currentValue : 13500;
  
  const totalProfit = currentValue - totalInvested
  const profitPercentage = totalInvested > 0 
    ? (totalProfit / totalInvested) * 100 
    : 0

  return (
    <div className="space-y-6">
      {/* 1. CARTE SINTETICHE DEI KPI */}
      <PortfolioSummary 
        currentValue={currentValue}
        totalInvested={totalInvested}
        totalProfit={totalProfit}
        profitPercentage={profitPercentage}
      />
      
      {/* 2. MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Performance Chart + Transactions */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="h-[450px]">
            <PerformanceChart />
          </div>
          
          <div className="card bg-surface/50 border-border/50 backdrop-blur-sm">
            <h3 className="text-sm font-bold tracking-widest text-white uppercase mb-4 flex items-center gap-2">
              <div className="w-2 h-4 bg-primary/80 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.4)]"></div>
              Ultime Transazioni
            </h3>
            <TransactionList transactions={transactions} />
          </div>
        </div>

        {/* RIGHT COLUMN: Holdings + Asset Allocation */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="flex-1 min-h-[300px]">
            <HoldingsList transactions={transactions} />
          </div>
          <div className="flex-1 min-h-[300px]">
            <AssetAllocation />
          </div>
        </div>
      </div>

      {/* 3. TERZA RIGA: Benchmarking & AI Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Competitor Benchmarking */}
        <div className="xl:col-span-8 flex flex-col gap-6 h-[400px]">
          <Benchmarking />
        </div>

        {/* RIGHT COLUMN: Portli AI Insights */}
        <div className="xl:col-span-4 flex flex-col gap-6 h-[400px]">
          <PortliAIInsights />
        </div>

      </div>
    </div>
  )
}
