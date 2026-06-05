import { useState } from 'react'
import ReactEChartsCore from 'echarts-for-react'
import * as echarts from 'echarts'
import {
  Droplets,
  ShieldCheck,
  Fan,
  Zap,
  Pill,
  Leaf,
  Hand,
  Cpu,
  BrainCircuit,
  ChevronDown,
  AlertTriangle,
  Info,
  ArrowRight,
  Shield,
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import Panel from '@/components/Panel'
import StatusLight from '@/components/StatusLight'

// ─── Types ──────────────────────────────────────────────
interface PlantZone {
  id: string
  name: string
  params: { label: string; value: string }[]
  status: 'normal' | 'warning' | 'danger'
  highlighted?: boolean
  x: number
  y: number
}

interface AlarmItem {
  key: string
  time: string
  level: '预警' | '信息'
  content: string
  location: string
  status: string
}

// ─── Mock Data ──────────────────────────────────────────
const kpiData = [
  { icon: <Droplets size={16} />, iconBg: '#004488', label: '今日处理水量', value: '78,895', unit: 'm³', changePercent: '12.6%', positive: true },
  { icon: <ShieldCheck size={16} />, iconBg: '#006644', label: '出水达标率', value: '99.32', unit: '%', changePercent: '0.82%', positive: true },
  { icon: <Fan size={16} />, iconBg: '#006688', label: '曝气系统节电率', value: '16.8', unit: '%', changePercent: '3.7%', positive: true },
  { icon: <Zap size={16} />, iconBg: '#006644', label: '综合能耗下降', value: '12.4', unit: '%', changePercent: '2.9%', positive: true },
  { icon: <Pill size={16} />, iconBg: '#557700', label: '药耗下降', value: '9.6', unit: '%', changePercent: '1.8%', positive: true },
  { icon: <Leaf size={16} />, iconBg: '#006644', label: '碳减排量', value: '35.62', unit: '吨', changePercent: '18.3%', positive: true },
]

const plantZones: PlantZone[] = [
  { id: '1', name: '进水泵房', params: [{ label: '流量', value: '12,680 m³/h' }], status: 'normal', x: 45, y: 12 },
  { id: '2', name: '预处理', params: [{ label: '去除率', value: '32%' }], status: 'normal', x: 72, y: 22 },
  { id: '3', name: '初沉池', params: [{ label: '液位', value: '2.35 m' }], status: 'normal', x: 18, y: 32 },
  { id: '4', name: '生化池/精准曝气区', params: [{ label: 'DO', value: '2.15 mg/L' }, { label: '溶解氧', value: '62%' }], status: 'normal', highlighted: true, x: 50, y: 50 },
  { id: '5', name: '二沉池', params: [{ label: 'SS', value: '12.6 mg/L' }], status: 'normal', x: 78, y: 55 },
  { id: '6', name: '鼓风机房', params: [{ label: '风压', value: '58.6 kPa' }], status: 'normal', x: 18, y: 68 },
  { id: '7', name: '污泥处理', params: [{ label: '含水率', value: '78.5%' }], status: 'normal', x: 35, y: 82 },
  { id: '8', name: '出水口', params: [{ label: '流量', value: '12,480 m³/h' }], status: 'normal', x: 82, y: 80 },
  { id: '9', name: '加药间', params: [{ label: 'PAC', value: '2.35 mg/L' }], status: 'normal', x: 12, y: 52 },
]

const aiSuggestions = [
  { title: '风机最优频率', current: '46.5 Hz', aiValue: '52.0 Hz', saving: '8.6%' },
  { title: '曝气阀门最优开度', current: '62%', aiValue: '70%', saving: '6.3%' },
  { title: '碳源投加建议', current: '1.85 mg/L', aiValue: '2.20 mg/L', saving: '15.9%' },
  { title: '回流泵建议', current: '45.0 Hz', aiValue: '50.0 Hz', saving: '5.1%' },
]

const alarmData: AlarmItem[] = [
  { key: '1', time: '10:31:22', level: '预警', content: 'DO低于阈值(<1.5 mg/L)', location: '生化池3区', status: '未处置' },
  { key: '2', time: '10:24:05', level: '预警', content: '污泥回流泵电流异常', location: '污泥回流泵2#', status: '未处置' },
  { key: '3', time: '10:16:48', level: '信息', content: '控制策略切换: PID自动→AI优化自动', location: '系统', status: '已完成' },
  { key: '4', time: '10:05:12', level: '信息', content: '模型重训练完成,模型版本 v2.3.6', location: 'AI引擎', status: '已完成' },
  { key: '5', time: '09:52:37', level: '预警', content: '二沉池液位高于上限', location: '二沉池', status: '已处置' },
]

const aerationZones = [
  { zone: '1区', do: '2.12', valve: '60', freq: '45.0', status: '运行', energy: '12%' },
  { zone: '2区', do: '2.05', valve: '58', freq: '44.0', status: '运行', energy: '11%' },
  { zone: '3区', do: '2.18', valve: '62', freq: '46.0', status: '运行', energy: '13%' },
  { zone: '4区', do: '2.01', valve: '55', freq: '43.0', status: '运行', energy: '10%' },
  { zone: '5区', do: '2.22', valve: '64', freq: '47.0', status: '运行', energy: '13%' },
  { zone: '6区', do: '2.17', valve: '61', freq: '45.5', status: '运行', energy: '12%' },
  { zone: '7区', do: '2.11', valve: '59', freq: '44.5', status: '运行', energy: '10%' },
  { zone: '8区', do: '2.09', valve: '57', freq: '43.5', status: '运行', energy: '9%' },
]

// ─── Water Quality Chart Option ─────────────────────────
function useWaterQualityOption() {
  const hours = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00']
  const codData = [280, 275, 268, 260, 250, 245, 240, 235, 230, 225, 220, 218, 215, 212, 210, 208, 205, 202, 200, 198, 195, 192, 190, 188, 185]
  const nhData = [22, 21.5, 21, 20.2, 19.5, 19, 18.8, 18.5, 18.2, 18, 17.8, 17.5, 17.2, 17, 16.8, 16.5, 16.2, 16, 15.8, 15.5, 15.2, 15, 14.8, 14.5, 14.2]
  const tpData = [1.8, 1.75, 1.7, 1.65, 1.6, 1.55, 1.5, 1.48, 1.45, 1.42, 1.4, 1.38, 1.36, 1.34, 1.32, 1.3, 1.28, 1.26, 1.24, 1.22, 1.2, 1.18, 1.16, 1.14, 1.12]
  const doData = [1.8, 1.85, 1.9, 1.95, 2.0, 2.05, 2.1, 2.12, 2.14, 2.15, 2.16, 2.15, 2.14, 2.13, 2.12, 2.1, 2.08, 2.06, 2.05, 2.04, 2.03, 2.02, 2.01, 2.0, 1.98]

  return {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'rgba(5, 14, 26, 0.95)',
      borderColor: '#00c8ff',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 12 },
      axisPointer: { type: 'cross' as const, crossStyle: { color: '#1a3a5c' } },
    },
    legend: {
      data: ['COD (mg/L)', '氨氮 (mg/L)', '总磷 (mg/L)', 'DO (mg/L)'],
      top: 0,
      textStyle: { color: '#a0b4c8', fontSize: 11 },
      itemWidth: 14,
      itemHeight: 6,
      itemGap: 14,
    },
    grid: { left: 40, right: 20, top: 36, bottom: 24, containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: hours,
      axisLine: { lineStyle: { color: '#1a3a5c' } },
      axisLabel: { color: '#5a7a94', fontSize: 10, interval: 4 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: 400,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#5a7a94', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)', type: 'dashed' as const } },
    },
    series: [
      { name: 'COD (mg/L)', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2, color: '#00e5ff' }, itemStyle: { color: '#00e5ff' }, data: codData },
      { name: '氨氮 (mg/L)', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2, color: '#ffcc00' }, itemStyle: { color: '#ffcc00' }, data: nhData },
      { name: '总磷 (mg/L)', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2, color: '#4488ff' }, itemStyle: { color: '#4488ff' }, data: tpData },
      { name: 'DO (mg/L)', type: 'line', smooth: true, showSymbol: false, lineStyle: { width: 2, color: '#00ff88' }, itemStyle: { color: '#00ff88' }, data: doData },
    ],
  }
}

// ─── 3D Plant Overview ──────────────────────────────────
function PlantOverview3D() {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ perspective: 800 }}>
      {/* GIS-style dark satellite background */}
      <div className="absolute inset-0 opacity-40">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="gisGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="#07182d"/>
              <path d="M 0 30 L 60 30 M 30 0 L 30 60" stroke="#0a2a4a" strokeWidth="0.5" fill="none"/>
              <rect x="0" y="0" width="30" height="30" fill="#081e35" opacity="0.3"/>
              <rect x="30" y="30" width="30" height="30" fill="#081e35" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gisGrid)"/>
        </svg>
      </div>

      {/* Dark overlay for depth */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 40%, transparent 0%, rgba(5,14,26,0.7) 70%, rgba(5,14,26,0.95) 100%)'
      }}/>

      {/* Water body effect */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 600px 400px at 50% 55%, rgba(0,100,180,0.08) 0%, transparent 70%)'
      }}/>

      {/* Grid floor */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
        <defs>
          <pattern id="grid3d" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00e5ff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid3d)" />
      </svg>

      {/* Plant layout - simplified isometric view using CSS */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Central plant diagram - using SVG */}
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full"
          style={{ maxWidth: '95%', maxHeight: '95%' }}
        >
          <defs>
            <linearGradient id="poolGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0a2a50" />
              <stop offset="100%" stopColor="#061830" />
            </linearGradient>
            <linearGradient id="hlPoolGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0a3a60" />
              <stop offset="100%" stopColor="#062040" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowStrong">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection lines (roads/pipes) */}
          <line x1="120" y1="80" x2="250" y2="140" stroke="#1a3a5c" strokeWidth="6" strokeLinecap="round" />
          <line x1="250" y1="140" x2="400" y2="200" stroke="#1a3a5c" strokeWidth="6" strokeLinecap="round" />
          <line x1="400" y1="200" x2="550" y2="260" stroke="#1a3a5c" strokeWidth="6" strokeLinecap="round" />
          <line x1="400" y1="200" x2="300" y2="320" stroke="#1a3a5c" strokeWidth="6" strokeLinecap="round" />
          <line x1="550" y1="260" x2="650" y2="380" stroke="#1a3a5c" strokeWidth="6" strokeLinecap="round" />
          <line x1="300" y1="320" x2="180" y2="350" stroke="#1a3a5c" strokeWidth="6" strokeLinecap="round" />
          <line x1="180" y1="350" x2="100" y2="280" stroke="#1a3a5c" strokeWidth="6" strokeLinecap="round" />
          <line x1="300" y1="320" x2="350" y2="420" stroke="#1a3a5c" strokeWidth="6" strokeLinecap="round" />

          {/* Flow direction indicators (animated) */}
          {[0, 1, 2].map((i) => (
            <circle key={`f1-${i}`} cx={140 + i * 40} cy={92 + i * 22} r="3" fill="#00e5ff" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
            </circle>
          ))}

          {/* Buildings / Pools */}
          {/* Inlet pump */}
          <rect x="80" y="50" width="80" height="60" rx="4" fill="#0d2240" stroke="#1a5a8c" strokeWidth="1.5" />
          <text x="120" y="85" textAnchor="middle" fill="#a0b4c8" fontSize="10" fontWeight="500">进水泵房</text>

          {/* Pre-treatment */}
          <rect x="210" y="110" width="90" height="65" rx="4" fill="#0d2240" stroke="#1a5a8c" strokeWidth="1.5" />
          <text x="255" y="145" textAnchor="middle" fill="#a0b4c8" fontSize="10" fontWeight="500">预处理</text>

          {/* Primary settling */}
          <rect x="350" y="165" width="100" height="70" rx="35" fill="url(#poolGrad)" stroke="#1a5a8c" strokeWidth="1.5" />
          <text x="400" y="205" textAnchor="middle" fill="#a0b4c8" fontSize="10" fontWeight="500">初沉池</text>

          {/* Biochemical pool - highlighted */}
          <rect x="250" y="290" width="120" height="80" rx="6" fill="url(#hlPoolGrad)" stroke="#00e5ff" strokeWidth="2" filter="url(#glow)" />
          <text x="310" y="320" textAnchor="middle" fill="#00e5ff" fontSize="11" fontWeight="600">生化池</text>
          <text x="310" y="338" textAnchor="middle" fill="#00e5ff" fontSize="9" opacity="0.8">精准曝气区</text>
          <text x="310" y="355" textAnchor="middle" fill="#00ff88" fontSize="10" fontFamily="monospace">DO: 2.15</text>

          {/* Secondary settling */}
          <rect x="500" y="230" width="100" height="70" rx="35" fill="url(#poolGrad)" stroke="#1a5a8c" strokeWidth="1.5" />
          <text x="550" y="270" textAnchor="middle" fill="#a0b4c8" fontSize="10" fontWeight="500">二沉池</text>

          {/* Blower room */}
          <rect x="50" y="250" width="90" height="65" rx="4" fill="#0d2240" stroke="#1a5a8c" strokeWidth="1.5" />
          <text x="95" y="285" textAnchor="middle" fill="#a0b4c8" fontSize="10" fontWeight="500">鼓风机房</text>

          {/* Sludge */}
          <rect x="300" y="400" width="100" height="60" rx="4" fill="#0d2240" stroke="#1a5a8c" strokeWidth="1.5" />
          <text x="350" y="435" textAnchor="middle" fill="#a0b4c8" fontSize="10" fontWeight="500">污泥处理</text>

          {/* Outlet */}
          <rect x="600" y="360" width="90" height="50" rx="4" fill="#0a2d20" stroke="#00aa66" strokeWidth="1.5" />
          <text x="645" y="390" textAnchor="middle" fill="#00ff88" fontSize="10" fontWeight="500">出水口</text>

          {/* Chemical */}
          <rect x="130" y="330" width="80" height="55" rx="4" fill="#0d2240" stroke="#1a5a8c" strokeWidth="1.5" />
          <text x="170" y="362" textAnchor="middle" fill="#a0b4c8" fontSize="10" fontWeight="500">加药间</text>

          {/* Pulsing status dots at each facility */}
          {[
            { cx: 160, cy: 55 },
            { cx: 300, cy: 115 },
            { cx: 450, cy: 172 },
            { cx: 370, cy: 296 },
            { cx: 600, cy: 237 },
            { cx: 140, cy: 257 },
            { cx: 400, cy: 407 },
            { cx: 690, cy: 367 },
          ].map((pos, i) => (
            <g key={`dot-${i}`}>
              <circle cx={pos.cx} cy={pos.cy} r="4" fill="#00ff88" opacity="0.3">
                <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" begin={`${i * 0.25}s`} />
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" begin={`${i * 0.25}s`} />
              </circle>
              <circle cx={pos.cx} cy={pos.cy} r="2.5" fill="#00ff88" />
            </g>
          ))}
        </svg>
      </div>

      {/* Zone info cards positioned absolutely over the SVG */}
      {plantZones.map((zone) => (
        <ZoneInfoCard key={zone.id} zone={zone} />
      ))}
    </div>
  )
}

function ZoneInfoCard({ zone }: { zone: PlantZone }) {
  return (
    <div
      className="absolute px-2 py-1.5 rounded border backdrop-blur-sm pointer-events-none"
      style={{
        left: `${zone.x}%`,
        top: `${zone.y}%`,
        transform: 'translate(-50%, -50%)',
        backgroundColor: zone.highlighted ? 'rgba(0, 229, 255, 0.12)' : 'rgba(10, 26, 46, 0.85)',
        borderColor: zone.highlighted ? '#00e5ff' : '#1a3a5c',
        boxShadow: zone.highlighted ? '0 0 12px rgba(0, 229, 255, 0.25)' : 'none',
        zIndex: zone.highlighted ? 10 : 1,
        minWidth: zone.highlighted ? 130 : 100,
      }}
    >
      <div className={`text-xs font-semibold mb-0.5 ${zone.highlighted ? 'text-accent-cyan' : 'text-text-primary'}`}>
        {zone.name}
      </div>
      {zone.params.map((p, i) => (
        <div key={i} className="text-[10px] text-text-secondary leading-tight">
          {p.label}: <span className="text-text-primary font-data">{p.value}</span>
        </div>
      ))}
      <div className="flex items-center gap-1 mt-0.5">
        <StatusLight status="normal" size="sm" />
        <span className="text-[10px] text-status-normal">运行</span>
      </div>
    </div>
  )
}

// ─── Left Panel: 全厂运行概况 ───────────────────────────
function LeftControlPanel() {
  const [controlMode, setControlMode] = useState<'manual' | 'pid' | 'ai'>('ai')

  const modes = [
    { key: 'manual' as const, label: '手动', icon: <Hand size={14} /> },
    { key: 'pid' as const, label: 'PID自动', icon: <Cpu size={14} /> },
    { key: 'ai' as const, label: 'AI优化自动', icon: <BrainCircuit size={14} /> },
  ]

  return (
    <Panel title="全厂运行概况" className="h-full">
      <div className="flex flex-col gap-4 py-2">
        {/* Control Strategy Mode */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-secondary">控制策略模式</span>
            <span className="text-[10px] text-text-tertiary">点击模式可切换控制策略</span>
          </div>
          <div className="flex gap-2">
            {modes.map((m) => {
              const isActive = controlMode === m.key
              return (
                <button
                  key={m.key}
                  onClick={() => setControlMode(m.key)}
                  className={`flex flex-col items-center gap-1 flex-1 py-2 rounded border transition-all duration-200 ${
                    isActive
                      ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan shadow-glow-cyan'
                      : 'border-border-primary bg-transparent text-text-tertiary hover:text-text-secondary hover:border-border-primary'
                  }`}
                >
                  {m.icon}
                  <span className="text-[10px] font-medium">{m.label}</span>
                </button>
              )
            })}
          </div>
          <div className="mt-2 text-center">
            <span className="text-xs text-accent-cyan">当前模式：AI优化自动</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-subtle" />

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: '68项', label: '全量参数接入' },
            { value: '20项', label: '关键优化参数' },
            { value: '236台', label: '在线设备数' },
            { value: '2条', label: '当前告警数', highlight: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`text-lg font-bold font-data ${item.highlight ? 'text-status-warning' : 'text-text-primary'}`}>
                {item.value}
              </span>
              <span className="text-[10px] text-text-tertiary leading-tight">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-border-subtle" />

        {/* Status Summary */}
        <div>
          <span className="text-xs font-medium text-text-secondary block mb-2">运行状态摘要</span>
          <div className="flex flex-col gap-2">
            {[
              { label: '进水流量', value: '12,680 m³/h' },
              { label: '进水水质', value: 'COD 256 mg/L' },
              { label: '天气状况', value: '晴 22°C' },
              { label: '负荷率', value: '72%' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-text-tertiary">{item.label}</span>
                <span className="text-text-primary font-data">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
}

// ─── Right Panel: AI优化建议与执行结果 ──────────────────
function RightAIPanel() {
  return (
    <Panel title="AI优化建议与执行结果" className="h-full">
      <div className="flex flex-col gap-3 py-2 h-full overflow-auto custom-scrollbar">
        {/* AI Suggestions */}
        <div className="flex flex-col gap-2">
          {aiSuggestions.map((s) => (
            <div
              key={s.title}
              className="rounded bg-white/[0.03] border border-border-subtle p-2"
            >
              <div className="text-xs font-medium text-text-primary mb-1">{s.title}</div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-tertiary">当前: <span className="text-text-secondary">{s.current}</span></span>
                <span className="text-accent-cyan">AI: {s.aiValue}</span>
              </div>
              <div className="text-[11px] text-text-success mt-0.5">
                预计节电: ↓ {s.saving}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-border-subtle" />

        {/* Expected savings */}
        <div>
          <span className="text-[11px] text-text-tertiary block mb-1.5">预计节能收益（今日）</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <Zap size={14} className="text-chart-yellow" />, value: '2,860', unit: 'kWh', label: '节约电量' },
              { icon: <span className="text-sm text-chart-green font-bold">¥</span>, value: '4,580', unit: '', label: '节约费用' },
              { icon: <Leaf size={14} className="text-status-normal" />, value: '2.18', unit: '吨', label: '碳减排量' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1 py-1.5 rounded bg-white/[0.03]">
                {item.icon}
                <span className="text-xs font-bold font-data text-text-primary">{item.value}{item.unit}</span>
                <span className="text-[9px] text-text-tertiary">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-subtle" />

        {/* Water quality risk */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-status-normal" />
            <div>
              <div className="text-sm font-semibold text-status-normal">低风险</div>
              <div className="text-[10px] text-text-tertiary">出水风险评估</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <RiskMiniChart />
            <span className="text-xs text-text-secondary mt-1">综合评分 <span className="text-status-normal font-bold font-data">92</span>分</span>
          </div>
        </div>
      </div>
    </Panel>
  )
}

function RiskMiniChart() {
  // Small sparkline for risk score
  const points = [85, 87, 86, 88, 89, 90, 89, 91, 90, 92]
  const w = 60
  const h = 24
  const min = 80
  const max = 95
  const range = max - min
  const pts = points
    .map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / range) * h}`)
    .join(' ')
  const fillPts = `0,${h} ${pts} ${w},${h}`

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polygon points={fillPts} fill="rgba(0, 255, 136, 0.15)" />
      <polyline points={pts} fill="none" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Bottom: Water Quality Trend ────────────────────────
function WaterQualityTrend() {
  const option = useWaterQualityOption()
  return (
    <Panel
      title="关键水质趋势"
      className="h-full"
      rightAction={
        <span className="flex items-center gap-1 text-[11px] text-text-tertiary cursor-pointer hover:text-text-secondary transition-colors">
          最近24小时 <ChevronDown size={12} />
        </span>
      }
    >
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        style={{ height: '100%', width: '100%' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </Panel>
  )
}

// ─── Bottom: Aeration Zone Status ───────────────────────
function AerationZoneStatus() {
  return (
    <Panel
      title="曝气分区状态"
      className="h-full"
      rightAction={
        <span className="text-[10px] text-text-tertiary">点击分区查看详情</span>
      }
    >
      <div className="overflow-auto custom-scrollbar h-full">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[rgba(15,37,64,0.8)]">
              <th className="text-left px-1.5 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle">参数</th>
              {aerationZones.map((z) => (
                <th key={z.zone} className="text-center px-1 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle whitespace-nowrap">
                  {z.zone}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* DO row */}
            <tr className="bg-[#0a1a2e]">
              <td className="px-1.5 py-1 text-[10px] text-text-tertiary border-b border-border-subtle">DO (mg/L)</td>
              {aerationZones.map((z) => (
                <td key={z.zone} className="text-center px-1 py-1 text-[11px] font-data text-status-normal border-b border-border-subtle">
                  {z.do}
                </td>
              ))}
            </tr>
            {/* Valve row */}
            <tr className="bg-[#0d1f35]">
              <td className="px-1.5 py-1 text-[10px] text-text-tertiary border-b border-border-subtle">阀门开度(%)</td>
              {aerationZones.map((z) => (
                <td key={z.zone} className="text-center px-1 py-1 text-[11px] font-data text-text-data border-b border-border-subtle">
                  {z.valve}
                </td>
              ))}
            </tr>
            {/* Frequency row */}
            <tr className="bg-[#0a1a2e]">
              <td className="px-1.5 py-1 text-[10px] text-text-tertiary border-b border-border-subtle">风机频率(Hz)</td>
              {aerationZones.map((z) => (
                <td key={z.zone} className="text-center px-1 py-1 text-[11px] font-data text-text-primary border-b border-border-subtle">
                  {z.freq}
                </td>
              ))}
            </tr>
            {/* Status row */}
            <tr className="bg-[#0d1f35]">
              <td className="px-1.5 py-1 text-[10px] text-text-tertiary border-b border-border-subtle">状态</td>
              {aerationZones.map((z) => (
                <td key={z.zone} className="text-center px-1 py-1 border-b border-border-subtle">
                  <span className="inline-flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-normal" />
                    <span className="text-[10px] text-text-secondary">{z.status}</span>
                  </span>
                </td>
              ))}
            </tr>
            {/* Energy row */}
            <tr className="bg-[#0a1a2e]">
              <td className="px-1.5 py-1 text-[10px] text-text-tertiary">能耗占比(%)</td>
              {aerationZones.map((z) => (
                <td key={z.zone} className="text-center px-1 py-1 text-[10px] font-data text-text-tertiary">
                  {z.energy}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

// ─── Bottom: Alarm & Events ─────────────────────────────
function AlarmEvents() {
  return (
    <Panel
      title="告警与事件"
      className="h-full"
      rightAction={
        <span className="flex items-center gap-1 text-[11px] text-accent-cyan cursor-pointer hover:text-accent-cyan-dim transition-colors">
          查看全部 <ArrowRight size={12} />
        </span>
      }
    >
      <div className="overflow-auto custom-scrollbar h-full">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[rgba(15,37,64,0.8)]">
              <th className="text-left px-2 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle">时间</th>
              <th className="text-left px-2 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle">级别</th>
              <th className="text-left px-2 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle">事件内容</th>
              <th className="text-left px-2 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle">位置</th>
              <th className="text-left px-2 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle">状态</th>
            </tr>
          </thead>
          <tbody>
            {alarmData.map((row, idx) => (
              <tr
                key={row.key}
                className={`transition-colors duration-200 hover:bg-bg-panel-hover ${
                  idx % 2 === 0 ? 'bg-[#0a1a2e]' : 'bg-[#0d1f35]'
                }`}
                style={{ height: 32 }}
              >
                <td className="px-2 py-1 text-[11px] font-data text-text-secondary whitespace-nowrap">{row.time}</td>
                <td className="px-2 py-1 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 text-[11px] ${
                    row.level === '预警' ? 'text-status-warning' : 'text-status-info'
                  }`}>
                    {row.level === '预警' ? <AlertTriangle size={10} /> : <Info size={10} />}
                    {row.level}
                  </span>
                </td>
                <td className="px-2 py-1 text-[11px] text-text-primary truncate max-w-[140px]" title={row.content}>{row.content}</td>
                <td className="px-2 py-1 text-[11px] text-text-secondary whitespace-nowrap">{row.location}</td>
                <td className="px-2 py-1 whitespace-nowrap">
                  <span className={`text-[11px] ${
                    row.status === '未处置' ? 'text-status-warning' : 'text-text-tertiary'
                  }`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

// ─── Main Overview Page ─────────────────────────────────
export default function Overview() {
  return (
    <div className="flex flex-col h-full gap-3 px-4 pb-3 pt-1">
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-6 gap-3 flex-shrink-0 animate-slideUp">
        {kpiData.map((kpi, i) => (
          <div key={i} className="animate-fadeIn" style={{ animationDelay: `${i * 0.08}s` }}>
            <KPICard {...kpi} />
          </div>
        ))}
      </div>

      {/* Row 2: Left Panel + 3D Plant + Right Panel */}
      <div className="flex gap-3 flex-1 min-h-0">
        {/* Left */}
        <div className="w-[260px] flex-shrink-0 animate-slideInLeft">
          <LeftControlPanel />
        </div>

        {/* Center: 3D Plant Overview */}
        <div className="flex-1 min-w-0 rounded-md border border-border-primary overflow-hidden animate-fadeIn">
          <PlantOverview3D />
        </div>

        {/* Right */}
        <div className="w-[280px] flex-shrink-0 animate-slideInRight">
          <RightAIPanel />
        </div>
      </div>

      {/* Row 3: Bottom panels */}
      <div className="grid grid-cols-3 gap-3 flex-shrink-0" style={{ height: 220 }}>
        <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <WaterQualityTrend />
        </div>
        <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <AerationZoneStatus />
        </div>
        <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <AlarmEvents />
        </div>
      </div>
    </div>
  )
}
