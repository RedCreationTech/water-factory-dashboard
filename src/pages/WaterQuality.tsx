import { useState, useCallback } from 'react'
import Panel from '@/components/Panel'
import KPICard from '@/components/KPICard'
import PlantDiagram from '@/components/water-quality/PlantDiagram'
import RiskGauge from '@/components/water-quality/RiskGauge'
import TrendChart from '@/components/water-quality/TrendChart'
import ComparisonTable from '@/components/water-quality/ComparisonTable'
import AlarmTable from '@/components/water-quality/AlarmTable'

/* ── KPI Icons ── */

function HexCodIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L20.66 7v10L12 22l-8.66-5V7L12 2z"
        fill="rgba(0, 229, 255, 0.2)"
        stroke="#00e5ff"
        strokeWidth="1.2"
      />
      <text x="12" y="15.5" textAnchor="middle" fill="#00e5ff" fontSize="8" fontWeight="bold" fontFamily="Roboto Mono, monospace">COD</text>
    </svg>
  )
}

function DropletIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
        fill="rgba(0, 170, 255, 0.2)"
        stroke="#00aaff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function P_Icon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="rgba(255, 204, 0, 0.15)" stroke="#ffcc00" strokeWidth="1.2" />
      <text x="12" y="16.5" textAnchor="middle" fill="#ffcc00" fontSize="10" fontWeight="bold" fontFamily="Roboto Mono, monospace">P</text>
    </svg>
  )
}

function N_Icon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="rgba(170, 102, 255, 0.15)" stroke="#aa66ff" strokeWidth="1.2" />
      <text x="12" y="16.5" textAnchor="middle" fill="#aa66ff" fontSize="10" fontWeight="bold" fontFamily="Roboto Mono, monospace">N</text>
    </svg>
  )
}

function ShieldCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        fill="rgba(0, 255, 136, 0.15)"
        stroke="#00ff88"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline points="9 12 11 14 15 10" stroke="#00ff88" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── KPI Data ── */

const kpiData = [
  {
    icon: <HexCodIcon />,
    iconBg: 'rgba(0, 229, 255, 0.2)',
    label: '进水COD',
    value: '268',
    unit: 'mg/L',
    changePercent: '6.9%',
    positive: true,
  },
  {
    icon: <DropletIcon />,
    iconBg: 'rgba(0, 170, 255, 0.2)',
    label: '出水氨氮',
    value: '0.482',
    unit: 'mg/L',
    changePercent: '10.4%',
    positive: true,
  },
  {
    icon: <P_Icon />,
    iconBg: 'rgba(255, 204, 0, 0.2)',
    label: '出水总磷',
    value: '0.23',
    unit: 'mg/L',
    changePercent: '11.5%',
    positive: true,
  },
  {
    icon: <N_Icon />,
    iconBg: 'rgba(170, 102, 255, 0.2)',
    label: '出水总氮',
    value: '8.46',
    unit: 'mg/L',
    changePercent: '12.3%',
    positive: true,
  },
  {
    icon: <ShieldCheckIcon />,
    iconBg: 'rgba(0, 255, 136, 0.2)',
    label: '出水达标率',
    value: '100',
    unit: '%',
    changePercent: '2.1%',
    positive: true,
  },
]

/* ── Risk Assessment Data ── */

const riskMetrics = [
  { label: '超标风险指数', value: 18, level: '低' },
  { label: '水质波动指数', value: 22, level: '低' },
  { label: '关键因子负荷', value: 24, level: '低' },
  { label: '工艺运行稳定性', value: 16, level: '低' },
]

/* ── Time Range Selector ── */

const timeRanges = ['近6小时', '近12小时', '近24小时', '近7天']

function TimeRangeSelector({
  active,
  onChange,
}: {
  active: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-1">
      {timeRanges.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`
            px-2 py-0.5 rounded-sm text-[10px] transition-all duration-200
            ${active === range
              ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
              : 'text-text-tertiary border border-transparent hover:text-text-secondary hover:bg-white/5'
            }
          `}
        >
          {range}
        </button>
      ))}
    </div>
  )
}

/* ── Main Page ── */

export default function WaterQuality() {
  const [activeTimeRange, setActiveTimeRange] = useState('近24小时')
  const handleTimeRangeChange = useCallback((v: string) => setActiveTimeRange(v), [])

  return (
    <div className="flex flex-col gap-3 p-3 h-full overflow-hidden">
      {/* ── Top KPI Row ── */}
      <div className="grid grid-cols-5 gap-3 flex-shrink-0">
        {kpiData.map((kpi, idx) => (
          <KPICard
            key={idx}
            icon={kpi.icon}
            iconBg={kpi.iconBg}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            changePercent={kpi.changePercent}
            positive={kpi.positive}
          />
        ))}
      </div>

      {/* ── Middle Row: Plant Diagram + Risk Assessment ── */}
      <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
        {/* Left-Center: Plant Diagram */}
        <Panel title="厂区工艺流程与水质监测" className="col-span-2">
          <PlantDiagram />
        </Panel>

        {/* Right: Risk Assessment */}
        <Panel title="出水风险评估" className="col-span-1">
          <div className="flex flex-col h-full">
            {/* Gauge */}
            <RiskGauge value={18} />

            {/* Assessment conclusion */}
            <div className="text-center -mt-1 mb-2">
              <div className="text-[11px] text-text-secondary mb-0.5">综合评估结论</div>
              <div className="text-[13px] font-medium text-status-normal">
                出水水质稳定，达标风险低
              </div>
            </div>

            {/* Metrics Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse text-[11px]">
                <tbody>
                  {riskMetrics.map((m, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? 'bg-[#0a1a2e]' : 'bg-[#0d1f35]'}
                      style={{ height: 28 }}
                    >
                      <td className="px-3 py-1 text-text-secondary">{m.label}</td>
                      <td className="px-3 py-1 text-right font-data text-text-primary">
                        <span className="text-accent-cyan">{m.value}</span>
                        <span className="text-text-tertiary">/100</span>
                      </td>
                      <td className="px-3 py-1 text-right">
                        <span className="text-status-normal font-medium">{m.level}</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[#0a1a2e]" style={{ height: 28 }}>
                    <td className="px-3 py-1 text-text-secondary">评估时间</td>
                    <td colSpan={2} className="px-3 py-1 text-right font-data text-text-tertiary">
                      2025-05-15 10:36:30
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Panel>
      </div>

      {/* ── Bottom Row: 3 Panels ── */}
      <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
        {/* A. Trend Chart */}
        <Panel
          title="水质指标24小时趋势曲线"
          className="col-span-1"
          rightAction={
            <TimeRangeSelector active={activeTimeRange} onChange={handleTimeRangeChange} />
          }
        >
          <TrendChart />
        </Panel>

        {/* B. Comparison Table */}
        <Panel title="关键指标分段对比(mg/L)" className="col-span-1">
          <ComparisonTable />
        </Panel>

        {/* C. Alarm Table */}
        <Panel title="水质告警信息" className="col-span-1">
          <AlarmTable />
        </Panel>
      </div>
    </div>
  )
}
