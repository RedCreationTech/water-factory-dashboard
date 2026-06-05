import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface KPICardProps {
  icon: ReactNode
  iconBg: string
  label: string
  value: string | number
  unit: string
  changePercent: string
  positive?: boolean
  className?: string
}

export default function KPICard({
  icon,
  iconBg,
  label,
  value,
  unit,
  changePercent,
  positive = true,
  className,
}: KPICardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-border-primary bg-bg-card backdrop-blur-sm',
        'p-3 flex flex-col justify-between gap-2',
        'transition-all duration-250 hover:border-border-glow hover:shadow-glow-cyan',
        'cursor-default select-none',
        className
      )}
    >
      {/* Top: icon + label */}
      <div className="flex items-center gap-2">
        <span
          className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <span className="text-white text-sm">{icon}</span>
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

      {/* Bottom: change percent */}
      <div className="flex items-center justify-between px-1">
        <span className={cn('text-xs font-medium', positive ? 'text-text-success' : 'text-text-danger')}>
          同比 {positive ? '↑' : '↓'} {changePercent}
        </span>
        {/* Sparkline placeholder */}
        <Sparkline positive={positive} />
      </div>
    </div>
  )
}

function Sparkline({ positive }: { positive: boolean }) {
  // Generate a simple SVG sparkline
  const points = positive
    ? [20, 18, 22, 15, 25, 20, 28, 22, 26, 24]
    : [25, 28, 22, 30, 20, 26, 18, 24, 20, 22]
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const w = 60
  const h = 24
  const pad = 2

  const pts = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - pad - ((p - min) / range) * (h - pad * 2)
      return `${x},${y}`
    })
    .join(' ')

  const fillPts = `0,${h} ${pts} ${w},${h}`

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0">
      <defs>
        <linearGradient id={`grad-${positive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? '#00ff88' : '#ff4444'} stopOpacity="0.4" />
          <stop offset="100%" stopColor={positive ? '#00ff88' : '#ff4444'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#grad-${positive})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={positive ? '#00ff88' : '#ff4444'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
