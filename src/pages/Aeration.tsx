import {
  TrendingUp,
  Wind,
  BrainCircuit,
  ShieldCheck,
  Banknote,
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import InfluentLoadPanel from '@/components/aeration/InfluentLoadPanel'
import ModelStatusPanel from '@/components/aeration/ModelStatusPanel'
import ZoneMonitor from '@/components/aeration/ZoneMonitor'
import AIOptimizationPanel from '@/components/aeration/AIOptimizationPanel'
import BottomCharts from '@/components/aeration/BottomCharts'

// ─── KPI Data ───────────────────────────────────────────
const kpiData = [
  {
    icon: <TrendingUp size={16} />,
    iconBg: '#006644',
    label: '曝气系统节电率',
    value: '18.6',
    unit: '%',
    changePercent: '6.2%',
    positive: true,
  },
  {
    icon: <span className="text-[10px] font-bold">DO</span>,
    iconBg: '#006688',
    label: '当前DO均值',
    value: '2.21',
    unit: 'mg/L',
    changePercent: '目标 2.0~3.0',
    positive: true,
  },
  {
    icon: <Wind size={16} />,
    iconBg: '#006688',
    label: '风机总功率',
    value: '612.8',
    unit: 'kW',
    changePercent: '8.7%',
    positive: true,
  },
  {
    icon: <BrainCircuit size={16} />,
    iconBg: '#553388',
    label: 'AI建议执行率',
    value: '92.3',
    unit: '%',
    changePercent: '今日执行 92.3%',
    positive: true,
  },
  {
    icon: <ShieldCheck size={16} />,
    iconBg: '#006644',
    label: '出水风险评分',
    value: '26',
    unit: '/100',
    changePercent: '风险 低',
    positive: true,
  },
  {
    icon: <Banknote size={16} />,
    iconBg: '#006644',
    label: '当日节省电费',
    value: '¥8,724',
    unit: '',
    changePercent: '¥2,138',
    positive: true,
  },
]

export default function Aeration() {
  return (
    <div className="flex flex-col gap-2 px-3 py-2 h-full overflow-hidden">
      {/* ── Section 1: Page Title ──────────────────────── */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0 py-1">
        <div
          className="w-48 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #00e5ff 50%, transparent 100%)',
          }}
        />
        <h2 className="text-lg font-semibold text-text-primary tracking-wide">
          精准曝气AI优化控制
        </h2>
        <p className="text-label text-text-secondary">
          基于进水预测 + 机理约束 + 强化学习的多目标优化控制
        </p>
        <div
          className="w-48 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #00e5ff 50%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Section 2: KPI Cards ───────────────────────── */}
      <div className="grid grid-cols-6 gap-2 flex-shrink-0">
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

      {/* ── Section 3-6: Main Content Area ─────────────── */}
      <div className="flex-1 flex gap-2 min-h-0">
        {/* Left Column */}
        <div className="w-[260px] flex flex-col gap-2 flex-shrink-0">
          <InfluentLoadPanel />
          <ModelStatusPanel />
        </div>

        {/* Center: Zone Monitor */}
        <ZoneMonitor />

        {/* Right Column: AI Optimization */}
        <AIOptimizationPanel />
      </div>

      {/* ── Section 7: Bottom Charts ───────────────────── */}
      <BottomCharts />
    </div>
  )
}
