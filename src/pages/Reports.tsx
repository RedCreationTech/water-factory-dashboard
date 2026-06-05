import {
  Droplets,
  Shield,
  Zap,
  Leaf,
  CloudCog,
} from 'lucide-react';
import KPICard from '@/components/KPICard';
import Panel from '@/components/Panel';
import FilterBar from '@/components/reports/FilterBar';
import ReportOverview from '@/components/reports/ReportOverview';
import AISummary from '@/components/reports/AISummary';
import KeyMetricsTable from '@/components/reports/KeyMetricsTable';
import TrendChart from '@/components/reports/TrendChart';
import ReportTypeChart from '@/components/reports/ReportTypeChart';
import OptimizationTable from '@/components/reports/OptimizationTable';
import RecentReports from '@/components/reports/RecentReports';

export default function Reports() {
  return (
    <div className="flex flex-col h-full gap-3 px-5 py-3 overflow-y-auto custom-scrollbar">
      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 flex-shrink-0">
        <KPICard
          icon={<Droplets className="w-4 h-4" />}
          iconBg="#00aaff"
          label="今日处理量"
          value="78,895"
          unit="m³"
          changePercent="12.6%"
          positive
        />
        <KPICard
          icon={<Shield className="w-4 h-4" />}
          iconBg="#00ff88"
          label="出水达标率"
          value="99.32"
          unit="%"
          changePercent="0.82%"
          positive
        />
        <KPICard
          icon={<Zap className="w-4 h-4" />}
          iconBg="#ffcc00"
          label="综合能耗"
          value="12.4"
          unit="%"
          changePercent="2.9%"
          positive={false}
        />
        <KPICard
          icon={<Leaf className="w-4 h-4" />}
          iconBg="#00e5ff"
          label="节电率"
          value="18.6"
          unit="%"
          changePercent="2.9%"
          positive
        />
        <KPICard
          icon={<CloudCog className="w-4 h-4" />}
          iconBg="#4488ff"
          label="碳减排量"
          value="35.62"
          unit="tCO2e"
          changePercent="18.3%"
          positive
        />
      </div>

      {/* Filter Bar */}
      <div className="flex-shrink-0">
        <FilterBar />
      </div>

      {/* Middle Row: Report Overview + AI Summary + Key Metrics */}
      <div className="grid grid-cols-12 gap-3 flex-shrink-0">
        {/* A. Report Overview */}
        <div className="col-span-5">
          <Panel title="报表概览" className="h-full">
            <div className="pt-1">
              <ReportOverview />
            </div>
          </Panel>
        </div>

        {/* B. AI Summary */}
        <div className="col-span-3">
          <Panel title="AI执行摘要" className="h-full">
            <AISummary />
          </Panel>
        </div>

        {/* C. Key Metrics Table */}
        <div className="col-span-4">
          <Panel title="关键指标对比" className="h-full">
            <div className="pt-1">
              <KeyMetricsTable />
            </div>
          </Panel>
        </div>
      </div>

      {/* Bottom Row: Trend Chart + Report Type Chart + Optimization Table */}
      <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
        {/* A. Trend Chart */}
        <div className="col-span-5 flex flex-col">
          <Panel title="指标趋势分析(月度)" className="flex-1 flex flex-col">
            <div className="flex-1 min-h-0">
              <TrendChart />
            </div>
          </Panel>
        </div>

        {/* B. Report Type Distribution */}
        <div className="col-span-3 flex flex-col">
          <Panel title="报表类型分布(占比)" className="flex-1 flex flex-col">
            <div className="flex-1 min-h-0">
              <ReportTypeChart />
            </div>
          </Panel>
        </div>

        {/* C. Optimization Strategy Table */}
        <div className="col-span-4 flex flex-col">
          <Panel title="优化策略贡献分析" className="flex-1 flex flex-col">
            <div className="pt-1">
              <OptimizationTable />
            </div>
          </Panel>
        </div>
      </div>

      {/* Bottom-most: Recent Reports */}
      <div className="flex-shrink-0">
        <Panel className="py-2 px-3">
          <RecentReports />
        </Panel>
      </div>
    </div>
  );
}
