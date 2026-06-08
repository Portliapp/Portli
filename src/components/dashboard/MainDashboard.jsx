import HeroSummary from '../widgets/HeroSummary'
import BenchmarkChart from '../widgets/BenchmarkChart'
import HeatmapTreemap from '../widgets/HeatmapTreemap'
import CompactKpi from '../widgets/CompactKpi'
import RiskTable from '../widgets/RiskTable'
import EventCalendar from '../widgets/EventCalendar'
import LastTransactions from '../widgets/LastTransactions'

export default function MainDashboard() {
  return (
    <div className="flex flex-col gap-6 h-full pb-12">
      
      {/* RIGA 1: HERO SECTION MASSICCIA */}
      <section className="w-full shrink-0">
        <HeroSummary />
      </section>

      {/* RIGA 2: GRID ASIMMETRICA (8 sx / 4 dx) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLONNA SINISTRA (8) - Focus Visivo (Grafici) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Immersive Chart */}
          <div className="w-full">
            <BenchmarkChart />
          </div>
          
          {/* Heatmap espansa per dominare la parte bassa */}
          <div className="w-full">
            <HeatmapTreemap />
          </div>
        </div>

        {/* COLONNA DESTRA (4) - Feed Dati in Tempo Reale & Risk */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-6">
          <CompactKpi />
          <RiskTable />
          <EventCalendar />
          
          {/* Sezione transazioni con scroll interno limitato */}
          <div className="flex-1 min-h-[300px]">
            <LastTransactions />
          </div>
        </div>

      </section>
      
    </div>
  )
}
