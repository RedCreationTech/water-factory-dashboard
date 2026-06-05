import { cn } from '@/lib/utils'
import { memo } from 'react'

interface ParamItem {
  label: string
  value: string | number
  unit: string
}

const defaultParams: ParamItem[] = [
  { label: 'DO', value: '2.15', unit: 'mg/L' },
  { label: 'MLSS', value: '3,620', unit: 'mg/L' },
  { label: 'ORP', value: '-152', unit: 'mV' },
  { label: '水温', value: '22.8', unit: '°C' },
  { label: '液位', value: '3.45', unit: 'm' },
  { label: '风压', value: '62.3', unit: 'kPa' },
  { label: '回流流量', value: '2,860', unit: 'm³/h' },
  { label: '回流比', value: '1.65', unit: 'm/g' },
  { label: '污泥龄', value: '7.45', unit: 'd' },
]

interface EquipmentItem {
  name: string
  running: number
  total: number
}

const defaultEquipments: EquipmentItem[] = [
  { name: '曝气风机', running: 2, total: 3 },
  { name: '搅拌机', running: 28, total: 32 },
  { name: '回流泵', running: 2, total: 3 },
  { name: '在线监测', running: 8, total: 8 },
  { name: '在线仪表', running: 24, total: 24 },
]

// Mini sparkline for each param
const MiniSparkline = memo(function MiniSparkline({ seed }: { seed: number }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const base = 15 + seed * 3
    return base + Math.sin(i * 0.8 + seed) * 8 + Math.random() * 4
  })
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const w = 40
  const h = 18
  const pts = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - 2 - ((p - min) / range) * (h - 4)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0">
      <polyline
        points={pts}
        fill="none"
        stroke="#00e5ff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  )
})

interface NodeDetailPanelProps {
  nodeName?: string
}

function NodeDetailPanel({ nodeName = '生化池' }: NodeDetailPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Node title */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{nodeName}</h3>
          <p className="text-[11px] text-text-tertiary">实时参数</p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-status-normal/10 text-status-normal border border-status-normal/30">
          <span className="w-1.5 h-1.5 rounded-full bg-status-normal" />
          正常运行
        </span>
      </div>

      {/* Params list */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="space-y-1">
          {defaultParams.map((param, idx) => (
            <div
              key={param.label}
              className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-bg-panel-hover transition-colors"
            >
              <span className="text-xs text-text-secondary w-16">{param.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-data text-text-primary">{param.value}</span>
                <span className="text-[10px] text-text-tertiary w-8">{param.unit}</span>
                <MiniSparkline seed={idx} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Associated equipment */}
      <div className="mt-3 pt-2 border-t border-border-subtle">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs text-text-secondary font-medium">关联设备</span>
          <span className="text-[10px] text-text-tertiary">运行 / 总数</span>
        </div>
        <div className="space-y-1">
          {defaultEquipments.map((eq) => {
            const isFull = eq.running === eq.total
            return (
              <div key={eq.name} className="flex items-center justify-between px-2 py-1">
                <span className="text-xs text-text-secondary">{eq.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className={cn('w-2 h-2 rounded-full', isFull ? 'bg-status-normal' : 'bg-status-warning')} />
                  <span className="text-xs font-data text-text-primary">
                    {eq.running}/{eq.total}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default memo(NodeDetailPanel)
