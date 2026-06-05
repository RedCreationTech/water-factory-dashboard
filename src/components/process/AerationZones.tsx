import { memo } from 'react'

interface ZoneData {
  id: number
  do: number
  fan: number
}

const zones: ZoneData[] = [
  { id: 1, do: 2.12, fan: 62 },
  { id: 2, do: 2.05, fan: 58 },
  { id: 3, do: 2.18, fan: 64 },
  { id: 4, do: 2.01, fan: 54 },
  { id: 5, do: 2.17, fan: 61 },
  { id: 6, do: 2.22, fan: 69 },
  { id: 7, do: 2.11, fan: 55 },
  { id: 8, do: 2.07, fan: 53 },
]

const ZoneCard = memo(function ZoneCard({ zone }: { zone: ZoneData }) {
  return (
    <div className="flex flex-col items-center rounded border border-border-primary bg-bg-panel p-1.5 hover:border-border-glow hover:bg-[rgba(0,229,255,0.05)] transition-all duration-200 cursor-pointer">
      <div className="flex items-center gap-1 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-status-normal" />
        <span className="text-[11px] text-text-secondary">{zone.id}区</span>
      </div>
      <div className="text-xs font-data text-status-normal">{zone.do.toFixed(2)}</div>
      <div className="text-[10px] text-text-tertiary">DO mg/L</div>
      <div className="text-xs font-data text-accent-cyan mt-0.5">{zone.fan}%</div>
      <div className="text-[10px] text-text-tertiary">风机</div>
    </div>
  )
})

function AerationZones() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs text-text-secondary font-medium">生化池曝气分区（8区）</span>
        <span className="text-[10px] text-text-tertiary">点击分区查看设备参数</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {zones.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>
    </div>
  )
}

export default memo(AerationZones)
