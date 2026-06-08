import WelcomeHeader from '../widgets/WelcomeHeader'
import PortfolioKpis from '../widgets/PortfolioKpis'
import BenchmarkChart from '../widgets/BenchmarkChart'
import TemporalHeatmap from '../widgets/TemporalHeatmap'
import HeatmapDetails from '../widgets/HeatmapDetails'
import AssetList from '../widgets/AssetList'
import IndicesLive from '../widgets/IndicesLive'
import NewsFeed from '../widgets/NewsFeed'

export default function MainDashboard() {
  return (
    <div className="flex flex-col gap-6 pb-12 w-full">
      
      {/* ROW 1: HEADER */}
      <section>
        <WelcomeHeader />
      </section>

      {/* ROW 2: KPIs */}
      <section>
        <PortfolioKpis />
      </section>

      {/* ROW 3: MAIN CHART */}
      <section className="w-full">
        <BenchmarkChart />
      </section>

      {/* ROW 4: HEATMAP CALENDAR */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <TemporalHeatmap />
        </div>
        <div className="lg:col-span-4">
          <HeatmapDetails />
        </div>
      </section>

      {/* ROW 5: BOTTOM MODULES */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[400px]">
        <div className="lg:col-span-8 h-full">
          <AssetList />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          <IndicesLive />
          <NewsFeed />
        </div>
      </section>
      
    </div>
  )
}
