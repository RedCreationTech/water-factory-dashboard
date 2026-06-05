import { useEffect, useRef } from 'react'
import {
  Zap,
  Droplets,
  Wind,
  Pill,
  DollarSign,
  Leaf,
  Target,
  Trash2,
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import Panel from '@/components/Panel'
import SavingsPanel from '@/components/energy/SavingsPanel'
import ROI from '@/components/energy/ROI'
import EnergyDistribution from '@/components/energy/EnergyDistribution'
import ContributionChart from '@/components/energy/ContributionChart'
import OptimizationAreas from '@/components/energy/OptimizationAreas'
import PowerTrendChart from '@/components/energy/PowerTrendChart'
import TimePriceChart from '@/components/energy/TimePriceChart'
import RankingTable from '@/components/energy/RankingTable'
import EventTable from '@/components/energy/EventTable'

const kpiData = [
  {
    icon: <Zap className="w-4 h-4 text-white" />,
    iconBg: '#004488',
    label: '今日总电耗',
    value: '68,450',
    unit: 'kWh',
    changePercent: '8.6%',
    positive: false,
  },
  {
    icon: <Droplets className="w-4 h-4 text-white" />,
    iconBg: '#006680',
    label: '吨水电耗',
    value: '0.332',
    unit: 'kWh/m³',
    changePercent: '7.2%',
    positive: true,
  },
  {
    icon: <Wind className="w-4 h-4 text-white" />,
    iconBg: '#668800',
    label: '曝气能耗占比',
    value: '42.8',
    unit: '%',
    changePercent: '3.6%',
    positive: true,
  },
  {
    icon: <Pill className="w-4 h-4 text-white" />,
    iconBg: '#008866',
    label: '药耗成本',
    value: '¥8,345',
    unit: '',
    changePercent: '6.1%',
    positive: true,
  },
  {
    icon: <DollarSign className="w-4 h-4 text-white" />,
    iconBg: '#006633',
    label: '当日节省费用',
    value: '¥12,680',
    unit: '',
    changePercent: '18.7%',
    positive: true,
  },
  {
    icon: <Leaf className="w-4 h-4 text-white" />,
    iconBg: '#006644',
    label: '碳减排量',
    value: '32.45',
    unit: 'tCO₂e',
    changePercent: '16.2%',
    positive: true,
  },
  {
    icon: <Target className="w-4 h-4 text-white" />,
    iconBg: '#006688',
    label: '月度节能目标达成率',
    value: '76.3',
    unit: '%',
    changePercent: '16.2%',
    positive: true,
    hasProgress: true,
    progressValue: 76.3,
    progressTarget: 85.0,
  },
]

function ProgressKPI({
  icon,
  iconBg,
  label,
  value,
  unit,
  changePercent,
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string
  unit: string
  changePercent: string
}) {
  return (
    <div className="rounded-md border border-border-primary bg-bg-card backdrop-blur-sm p-3 flex flex-col justify-between gap-2 transition-all duration-250 hover:border-border-glow hover:shadow-glow-cyan cursor-default select-none">
      {/* Top: icon + label */}
      <div className="flex items-center gap-2">
        <span
          className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </span>
        <span className="text-label text-text-secondary truncate">{label}</span>
      </div>

      {/* Middle: value + unit */}
      <div className="flex items-baseline gap-1.5 px-1">
        <span className="text-[28px] font-bold leading-tight tracking-tight text-text-primary font-mono-data">
          {value}
        </span>
        <span className="text-sm text-text-secondary">{unit}</span>
      </div>

      {/* Progress bar */}
      <div className="px-1">
        <div className="w-full h-1.5 rounded-full bg-[#0f2540] overflow-hidden">
          <div
            className="h-full rounded-full bg-accent-cyan transition-all duration-1000"
            style={{ width: `${Math.min(76.3, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-text-tertiary">目标 85.0%</span>
          <span className="text-[10px] text-text-success">同比 ↑ {changePercent}</span>
        </div>
      </div>
    </div>
  )
}

/* ── Carbon Breakdown sub-panel ── */
function CarbonBreakdownPanel() {
  const items = [
    {
      icon: <Zap className="w-3.5 h-3.5" />,
      name: '电耗碳排放',
      value: '18.6',
      pct: '57.3%',
      color: '#00e5ff',
      widthPct: 57.3,
    },
    {
      icon: <Pill className="w-3.5 h-3.5" />,
      name: '药剂碳排放',
      value: '8.2',
      pct: '25.3%',
      color: '#4488ff',
      widthPct: 25.3,
    },
    {
      icon: <Trash2 className="w-3.5 h-3.5" />,
      name: '污泥处置碳排放',
      value: '5.65',
      pct: '17.4%',
      color: '#ff8844',
      widthPct: 17.4,
    },
  ]

  return (
    <div className="flex flex-col gap-3 py-1">
      {items.map((item) => (
        <div key={item.name} className="flex flex-col gap-1.5">
          {/* icon + name + pct */}
          <div className="flex items-center gap-2">
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color + '20', color: item.color }}
            >
              {item.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary truncate">{item.name}</span>
                <span className="text-[10px] font-medium font-mono-data flex-shrink-0 ml-1" style={{ color: item.color }}>
                  {item.pct}
                </span>
              </div>
            </div>
          </div>
          {/* value */}
          <div className="pl-9">
            <span className="text-xl font-bold text-text-primary font-mono-data leading-tight">
              {item.value}
            </span>
          </div>
          {/* progress bar */}
          <div className="pl-9">
            <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: item.color + '15' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: item.widthPct + '%', backgroundColor: item.color }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Energy() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Staggered fade-in animation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const panels = container.querySelectorAll('.animate-panel')
    panels.forEach((panel, idx) => {
      const el = panel as HTMLElement
      el.style.opacity = '0'
      el.style.transform = 'translateY(20px)'
      el.style.transition = `opacity 0.5s ease-out ${idx * 0.08}s, transform 0.5s ease-out ${idx * 0.08}s`
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        })
      })
    })
  }, [])

  return (
    <div ref={containerRef} className="flex flex-col gap-2.5 p-3 h-full overflow-hidden">
      {/* KPI Row */}
      <div className="grid grid-cols-7 gap-2 flex-shrink-0">
        {kpiData.slice(0, 6).map((kpi, idx) => (
          <div key={idx} className="animate-panel">
            <KPICard
              icon={kpi.icon}
              iconBg={kpi.iconBg}
              label={kpi.label}
              value={kpi.value}
              unit={kpi.unit}
              changePercent={kpi.changePercent}
              positive={kpi.positive}
            />
          </div>
        ))}
        <div className="animate-panel">
          <ProgressKPI
            icon={kpiData[6].icon}
            iconBg={kpiData[6].iconBg}
            label={kpiData[6].label}
            value={kpiData[6].value}
            unit={kpiData[6].unit}
            changePercent={kpiData[6].changePercent}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex gap-2.5 min-h-0">
        {/* Left Column */}
        <div className="w-[280px] flex-shrink-0 flex flex-col gap-2.5">
          <Panel title="节能收益看板" className="flex-1 animate-panel">
            <div className="h-full flex flex-col">
              <SavingsPanel />
              <ROI />
            </div>
          </Panel>
        </div>

        {/* Carbon Breakdown */}
        <div className="w-[160px] flex-shrink-0 animate-panel">
          <Panel title="碳排放拆解" rightAction={<span className="text-[10px] text-text-tertiary">单位: tCO₂e</span>} className="h-full">
            <CarbonBreakdownPanel />
          </Panel>
        </div>

        {/* Center: Energy Distribution */}
        <div className="flex-1 min-w-0 animate-panel">
          <Panel className="h-full">
            <EnergyDistribution />
          </Panel>
        </div>

        {/* Right Column */}
        <div className="w-[280px] flex-shrink-0 flex flex-col gap-2.5">
          <Panel title="优化贡献分析" className="flex-1 animate-panel">
            <div className="h-full flex flex-col">
              <ContributionChart />
            </div>
          </Panel>
          <Panel title="" className="animate-panel" style={{ flex: 0.8 }}>
            <OptimizationAreas />
          </Panel>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-4 gap-2.5 flex-shrink-0" style={{ height: 240 }}>
        <Panel className="animate-panel h-full">
          <PowerTrendChart />
        </Panel>
        <Panel className="animate-panel h-full">
          <TimePriceChart />
        </Panel>
        <Panel className="animate-panel h-full">
          <RankingTable />
        </Panel>
        <Panel className="animate-panel h-full">
          <EventTable />
        </Panel>
      </div>
    </div>
  )
}
