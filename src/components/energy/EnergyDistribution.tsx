import { Fan, Droplets, Repeat, Factory, Beaker, Settings } from 'lucide-react'
import { useMemo } from 'react'

interface ZoneData {
  name: string
  icon: React.ElementType
  value: number
  percent: string
  position: { x: number; y: number }
  isLargest?: boolean
  color: string
}

const zones: ZoneData[] = [
  { name: '鼓风机房', icon: Fan, value: 29320, percent: '42.8%', position: { x: 50, y: 8 }, isLargest: true, color: '#ff8833' },
  { name: '生化池', icon: Droplets, value: 17860, percent: '26.1%', position: { x: 8, y: 25 }, color: '#00e5ff' },
  { name: '回流系统', icon: Repeat, value: 8640, percent: '12.6%', position: { x: 72, y: 20 }, color: '#00ff88' },
  { name: '污泥处理', icon: Factory, value: 7680, percent: '11.2%', position: { x: 5, y: 65 }, color: '#4488ff' },
  { name: '加药系统', icon: Beaker, value: 5950, percent: '8.7%', position: { x: 75, y: 60 }, color: '#ffcc00' },
  { name: '其他设备', icon: Settings, value: 1000, percent: '1.5%', position: { x: 50, y: 82 }, color: '#aa66ff' },
]

const maxValue = Math.max(...zones.map((z) => z.value))

function FlowLine({
  from,
  to,
  thickness,
  delay,
}: {
  from: { x: number; y: number }
  to: { x: number; y: number }
  thickness: number
  delay: number
}) {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  const path = `M ${from.x} ${from.y} Q ${midX} ${from.y} ${midX} ${midY} T ${to.x} ${to.y}`

  return (
    <g>
      {/* Glow line */}
      <path
        d={path}
        fill="none"
        stroke="rgba(0, 229, 255, 0.15)"
        strokeWidth={thickness * 2}
        strokeLinecap="round"
      />
      {/* Main line */}
      <path
        d={path}
        fill="none"
        stroke="rgba(0, 229, 255, 0.4)"
        strokeWidth={thickness}
        strokeLinecap="round"
      />
      {/* Animated energy flow particle */}
      <circle r={Math.max(2, thickness * 0.6)} fill="#00e5ff" filter="url(#glow)">
        <animateMotion dur="2s" repeatCount="indefinite" begin={`${delay}s`} path={path} />
      </circle>
      {/* Second particle with offset */}
      <circle r={Math.max(1.5, thickness * 0.4)} fill="#00e5ff" opacity="0.6" filter="url(#glow)">
        <animateMotion dur="2.5s" repeatCount="indefinite" begin={`${delay + 0.8}s`} path={path} />
      </circle>
    </g>
  )
}

export default function EnergyDistribution() {
  const center = { x: 50, y: 48 }

  // Create plant-like background shapes
  const buildingShapes = useMemo(
    () => [
      { x: 35, y: 5, w: 30, h: 20, label: '鼓风机房' },
      { x: 5, y: 20, w: 25, h: 18, label: '生化池' },
      { x: 68, y: 15, w: 27, h: 16, label: '回流系统' },
      { x: 3, y: 58, w: 22, h: 16, label: '污泥处理' },
      { x: 68, y: 52, w: 28, h: 18, label: '加药系统' },
      { x: 35, y: 78, w: 30, h: 14, label: '其他设备' },
    ],
    []
  )

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Title bar */}
      <div className="flex-shrink-0 px-3 py-1.5 mb-1 rounded bg-bg-panel border border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-accent-cyan" />
            <span className="text-white font-semibold text-sm">能耗分布总览</span>
          </div>
          <span className="text-xs text-text-tertiary">(单位:kWh, 占比:%)</span>
        </div>
      </div>

      {/* Main diagram area */}
      <div className="flex-1 relative min-h-0">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glow filter for particles */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Glow filter for center circle */}
            <filter id="centerGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Zone gradient fills */}
            {zones.map((z, i) => (
              <linearGradient key={`grad-${i}`} id={`zoneGrad-${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={z.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={z.color} stopOpacity="0.08" />
              </linearGradient>
            ))}
            <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0a2a4a" />
              <stop offset="70%" stopColor="#0a1a2e" />
              <stop offset="100%" stopColor="#0a1a2e" stopOpacity="0.8" />
            </radialGradient>
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Plant building shapes with gradient fills */}
          {buildingShapes.map((shape, idx) => (
            <g key={idx}>
              <rect
                x={shape.x}
                y={shape.y}
                width={shape.w}
                height={shape.h}
                rx={2}
                fill={`url(#zoneGrad-${idx})`}
                stroke={zones[idx]?.color || '#1a3a5c'}
                strokeWidth={0.5}
                strokeOpacity={0.4}
              />
              <text
                x={shape.x + shape.w / 2}
                y={shape.y + shape.h / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#5a7a94"
                fontSize={3.5}
                fontFamily="PingFang SC, Microsoft YaHei, sans-serif"
              >
                {shape.label}
              </text>
            </g>
          ))}

          {/* Flow lines from zones to center */}
          {zones.map((zone, idx) => {
            const zoneCenterX = zone.position.x + 14
            const zoneCenterY = zone.position.y + 6
            const thickness = Math.max(0.8, (zone.value / maxValue) * 2.5)
            return (
              <FlowLine
                key={idx}
                from={{
                  x: zoneCenterX > center.x ? zone.position.x + 2 : zoneCenterX + 10,
                  y: zoneCenterY,
                }}
                to={center}
                thickness={thickness}
                delay={idx * 0.3}
              />
            )
          })}

          {/* Center circle with glow */}
          <circle
            cx={center.x}
            cy={center.y}
            r={16}
            fill="#0a1a2e"
            stroke="#00e5ff"
            strokeWidth={2}
            filter="url(#centerGlow)"
          />
          <circle
            cx={center.x}
            cy={center.y}
            r={14}
            fill="url(#centerGrad)"
          />
          {/* Rotating dashed ring */}
          <circle
            cx={center.x}
            cy={center.y}
            r={12}
            fill="none"
            stroke="rgba(0, 229, 255, 0.3)"
            strokeWidth={0.3}
            strokeDasharray="2 2"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${center.x} ${center.y}`}
              to={`360 ${center.x} ${center.y}`}
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Center text */}
          <text
            x={center.x}
            y={center.y - 3}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#a0b4c8"
            fontSize={3.5}
            fontFamily="PingFang SC, Microsoft YaHei, sans-serif"
          >
            今日总电耗
          </text>
          <text
            x={center.x}
            y={center.y + 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontSize={5.5}
            fontWeight={700}
            fontFamily="Roboto Mono, monospace"
          >
            68,450
          </text>
          <text
            x={center.x}
            y={center.y + 7}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#00e5ff"
            fontSize={3}
            fontFamily="Roboto Mono, monospace"
          >
            100%
          </text>

          {/* Zone cards with semi-transparent backgrounds */}
          {zones.map((zone, idx) => {
            return (
              <g key={idx}>
                {/* Card background */}
                <rect
                  x={zone.position.x}
                  y={zone.position.y}
                  width={28}
                  height={12}
                  rx={1.5}
                  fill="rgba(10, 26, 46, 0.9)"
                  stroke={zone.isLargest ? '#ff8833' : '#1a3a5c'}
                  strokeWidth={zone.isLargest ? 0.8 : 0.4}
                />
                {/* Icon background */}
                <circle
                  cx={zone.position.x + 6}
                  cy={zone.position.y + 6}
                  r={3.5}
                  fill="#0f2540"
                  stroke={zone.color}
                  strokeWidth={0.3}
                  strokeOpacity={0.6}
                />
                {/* Value */}
                <text
                  x={zone.position.x + 11}
                  y={zone.position.y + 5}
                  dominantBaseline="middle"
                  fill="#ffffff"
                  fontSize={4}
                  fontWeight={700}
                  fontFamily="Roboto Mono, monospace"
                >
                  {zone.value.toLocaleString()}
                </text>
                {/* Unit */}
                <text
                  x={zone.position.x + 11}
                  y={zone.position.y + 9.5}
                  dominantBaseline="middle"
                  fill="#5a7a94"
                  fontSize={2.5}
                  fontFamily="Roboto Mono, monospace"
                >
                  kWh
                </text>
                {/* Name */}
                <text
                  x={zone.position.x + 11}
                  y={zone.position.y + 9.5}
                  dominantBaseline="middle"
                  fill="#a0b4c8"
                  fontSize={3}
                  fontFamily="PingFang SC, Microsoft YaHei, sans-serif"
                >
                  {zone.name}
                </text>
                {/* Percent */}
                <text
                  x={zone.position.x + 24}
                  y={zone.position.y + 9.5}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill={zone.isLargest ? '#ff8833' : zone.color}
                  fontSize={3.5}
                  fontWeight={700}
                  fontFamily="Roboto Mono, monospace"
                >
                  {zone.percent}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Bottom hint */}
      <div className="text-center text-[10px] text-text-tertiary flex-shrink-0 pb-1">
        点击节点查看能耗明细
      </div>
    </div>
  )
}
