import KpiTwr from '../widgets/KpiTwr'
import KpiYield from '../widgets/KpiYield'
import KpiTopFlop from '../widgets/KpiTopFlop'
import RiskTable from '../widgets/RiskTable'
import BenchmarkChart from '../widgets/BenchmarkChart'
import NetWorthChart from '../widgets/NetWorthChart'
import DrawdownChart from '../widgets/DrawdownChart'
import HeatmapTreemap from '../widgets/HeatmapTreemap'
import BreakdownLevel from '../widgets/BreakdownLevel'
import LastTransactions from '../widgets/LastTransactions'
import EventCalendar from '../widgets/EventCalendar'

export default function MainDashboard() {
  return (
    <div className="flex flex-col gap-4 h-full pb-8">
      
      {/* RIGA 1: KPI (4 colonne) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-32 shrink-0">
        <KpiTwr />
        <KpiYield />
        <KpiTopFlop />
        <RiskTable />
      </div>

      {/* RIGA 2: Grafici Principali (8 + 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[300px] shrink-0">
        <div className="lg:col-span-8 h-full">
          <BenchmarkChart />
        </div>
        <div className="lg:col-span-4 h-full">
          <NetWorthChart />
        </div>
      </div>

      {/* RIGA 3: Drawdown & Heatmap (6 + 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[250px] shrink-0">
        <div className="lg:col-span-6 h-full">
          <DrawdownChart />
        </div>
        <div className="lg:col-span-6 h-full">
          <HeatmapTreemap />
        </div>
      </div>

      {/* RIGA 4: Dati e Eventi (4 + 4 + 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[300px]">
        <div className="lg:col-span-4 h-full">
          <BreakdownLevel />
        </div>
        <div className="lg:col-span-4 h-full">
          <EventCalendar />
        </div>
        <div className="lg:col-span-4 h-full">
          <LastTransactions />
        </div>
      </div>

    </div>
  )
}
