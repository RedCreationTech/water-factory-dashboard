import { useState, memo } from 'react'
import MonitoringPointBadge from './MonitoringPointBadge'
import FlowStyles from './FlowStyles'

const monitoringPoints = [
  {
    number: 1,
    title: '① 进水口',
    position: { left: '8%', top: '50%' },
    params: [
      { label: 'COD', value: 268, unit: 'mg/L' },
      { label: '氨氮', value: 32.8, unit: 'mg/L' },
      { label: '流量', value: '12,480', unit: 'm³/h' },
    ],
  },
  {
    number: 2,
    title: '② 初沉池',
    position: { left: '28%', top: '30%' },
    params: [
      { label: 'COD', value: 96.3, unit: 'mg/L' },
      { label: '氨氮', value: 18.7, unit: 'mg/L' },
      { label: 'SS', value: 45, unit: 'mg/L' },
    ],
  },
  {
    number: 3,
    title: '③ 生化池',
    position: { left: '50%', top: '50%' },
    params: [
      { label: 'COD', value: 38.2, unit: 'mg/L' },
      { label: '氨氮', value: 2.85, unit: 'mg/L' },
      { label: 'DO', value: 2.15, unit: 'mg/L' },
    ],
  },
  {
    number: 4,
    title: '④ 二沉池',
    position: { left: '72%', top: '30%' },
    params: [
      { label: 'COD', value: 28.7, unit: 'mg/L' },
      { label: '氨氮', value: 1.42, unit: 'mg/L' },
      { label: 'SS', value: 8, unit: 'mg/L' },
    ],
  },
  {
    number: 5,
    title: '⑤ 出水口',
    position: { left: '92%', top: '50%' },
    params: [
      { label: 'COD', value: 32.6, unit: 'mg/L' },
      { label: '氨氮', value: 0.482, unit: 'mg/L' },
      { label: '流量', value: '12,450', unit: 'm³/h' },
    ],
  },
]

const flowPaths = [
  { d: 'M 60 150 L 210 100', from: 1, to: 2 },
  { d: 'M 210 100 L 375 150', from: 2, to: 3 },
  { d: 'M 375 150 L 540 100', from: 3, to: 4 },
  { d: 'M 540 100 L 690 150', from: 4, to: 5 },
]

const PlantDiagram = memo(function PlantDiagram() {
  const [activePoint, setActivePoint] = useState<number | null>(null)

  return (
    <div className="relative w-full h-full overflow-hidden rounded-md" style={{ minHeight: 260 }}>
      <FlowStyles />

      {/* GIS-style dark aerial background */}
      <div
        className="absolute inset-0 rounded-md"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(0, 80, 60, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(0, 60, 80, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(0, 100, 80, 0.1) 0%, transparent 40%),
            linear-gradient(180deg, #081420 0%, #0a1a2e 50%, #081828 100%)
          `,
        }}
      />

      {/* SVG flow lines and tank shapes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 750 200" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="tankGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f2540" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0a1a2e" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tank shapes */}
        {/* Inlet tank */}
        <rect x="35" y="115" width="50" height="70" rx="4" fill="url(#tankGrad)" stroke="#1a3a5c" strokeWidth="1" />
        <text x="60" y="200" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">进水泵房</text>

        {/* Primary sedimentation */}
        <rect x="175" y="65" width="70" height="70" rx="35" fill="url(#tankGrad)" stroke="#1a3a5c" strokeWidth="1" />
        <text x="210" y="155" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">初沉池</text>

        {/* Biochemical pool */}
        <rect x="330" y="115" width="90" height="70" rx="4" fill="url(#tankGrad)" stroke="#1a3a5c" strokeWidth="1" />
        <text x="375" y="200" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">生化池</text>

        {/* Secondary sedimentation */}
        <rect x="505" y="65" width="70" height="70" rx="35" fill="url(#tankGrad)" stroke="#1a3a5c" strokeWidth="1" />
        <text x="540" y="155" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">二沉池</text>

        {/* Outlet */}
        <rect x="665" y="115" width="50" height="70" rx="4" fill="url(#tankGrad)" stroke="#1a3a5c" strokeWidth="1" />
        <text x="690" y="200" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">出水口</text>

        {/* Flow lines */}
        {flowPaths.map((flow, i) => (
          <g key={i}>
            <path
              d={flow.d}
              fill="none"
              stroke="#1a3a5c"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d={flow.d}
              fill="none"
              stroke="url(#flowGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="8 6"
              className="animate-flow-dash"
            />
            {/* Flow direction arrow */}
            <polygon
              points={`${flow.d.includes('L 690') ? '690,145 680,150 680,140' :
                flow.d.includes('L 540') ? '540,95 530,100 530,90' :
                flow.d.includes('L 375') ? '375,145 365,150 365,140' :
                '210,95 200,100 200,90'
              }`}
              fill="#00e5ff"
              fillOpacity="0.5"
            />
          </g>
        ))}

        {/* Connecting lines between tanks */}
        <line x1="85" y1="150" x2="175" y2="100" stroke="#0f2540" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="245" y1="100" x2="330" y2="150" stroke="#0f2540" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="420" y1="150" x2="505" y2="100" stroke="#0f2540" strokeWidth="1.5" strokeDasharray="4 3" />
        <line x1="575" y1="100" x2="665" y2="150" stroke="#0f2540" strokeWidth="1.5" strokeDasharray="4 3" />
      </svg>

      {/* Monitoring point badges */}
      {monitoringPoints.map((point) => (
        <MonitoringPointBadge
          key={point.number}
          number={point.number}
          title={point.title}
          params={point.params}
          position={point.position}
          isActive={activePoint === point.number}
          onClick={() => setActivePoint(activePoint === point.number ? null : point.number)}
        />
      ))}

      {/* Legend */}
      <div className="absolute bottom-2 left-3 flex items-center gap-3 text-[10px] text-text-tertiary">
        <span className="flex items-center gap-1">
          <span className="w-4 h-[2px] bg-accent-cyan inline-block" />
          水流方向
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full border border-accent-cyan inline-block" />
          监测点
        </span>
      </div>
    </div>
  )
})

export default PlantDiagram
