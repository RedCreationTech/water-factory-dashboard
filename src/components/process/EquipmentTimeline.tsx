import { memo } from 'react'

type StatusType = 'run' | 'stop' | 'alarm' | 'offline'

interface TimelineSegment {
  status: StatusType
  width: number // percentage
}

interface EquipmentRow {
  name: string
  segments: TimelineSegment[]
}

const statusColors: Record<StatusType, string> = {
  run: '#00ff88',
  stop: '#5a7a94',
  alarm: '#ffcc00',
  offline: '#888888',
}

const statusLabels: Record<StatusType, string> = {
  run: '运行',
  stop: '停止',
  alarm: '报警',
  offline: '离线',
}

const equipmentRows: EquipmentRow[] = [
  {
    name: '鼓风机#1',
    segments: [
      { status: 'run', width: 45 },
      { status: 'stop', width: 10 },
      { status: 'run', width: 35 },
      { status: 'alarm', width: 10 },
    ],
  },
  {
    name: '鼓风机#2',
    segments: [
      { status: 'run', width: 30 },
      { status: 'run', width: 50 },
      { status: 'stop', width: 20 },
    ],
  },
  {
    name: '回流泵#1',
    segments: [
      { status: 'run', width: 80 },
      { status: 'offline', width: 20 },
    ],
  },
  {
    name: '回流泵#2',
    segments: [
      { status: 'run', width: 100 },
    ],
  },
  {
    name: '搅拌机#1',
    segments: [
      { status: 'run', width: 60 },
      { status: 'stop', width: 15 },
      { status: 'run', width: 25 },
    ],
  },
  {
    name: '搅拌机#2',
    segments: [
      { status: 'run', width: 40 },
      { status: 'alarm', width: 8 },
      { status: 'run', width: 52 },
    ],
  },
]

const timeLabels = ['10:30', '14:30', '18:30', '22:30', '02:30', '06:30', '10:30']

const TimelineBar = memo(function TimelineBar({ segments }: { segments: TimelineSegment[] }) {
  return (
    <div className="flex h-[18px] rounded-sm overflow-hidden w-full">
      {segments.map((seg, idx) => (
        <div
          key={idx}
          className="h-full transition-all duration-500"
          style={{
            width: `${seg.width}%`,
            backgroundColor: statusColors[seg.status],
            opacity: 0.8,
            marginRight: idx < segments.length - 1 ? '1px' : '0',
          }}
          title={`${statusLabels[seg.status]} ${seg.width}%`}
        />
      ))}
    </div>
  )
})

function EquipmentTimeline() {
  return (
    <div className="flex flex-col h-full">
      {/* Legend */}
      <div className="flex items-center gap-3 mb-2 px-1">
        {(Object.keys(statusColors) as StatusType[]).map((status) => (
          <span key={status} className="inline-flex items-center gap-1 text-[10px] text-text-tertiary">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: statusColors[status] }} />
            {statusLabels[status]}
          </span>
        ))}
      </div>

      {/* Time axis labels */}
      <div className="flex items-center mb-1 pl-[72px]">
        {timeLabels.map((t, i) => (
          <span key={i} className="flex-1 text-[9px] text-text-tertiary text-center">
            {t}
          </span>
        ))}
      </div>

      {/* Equipment rows */}
      <div className="flex-1 overflow-auto custom-scrollbar space-y-1.5">
        {equipmentRows.map((row) => (
          <div key={row.name} className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-text-secondary flex-shrink-0 truncate">{row.name}</span>
            <div className="flex-1">
              <TimelineBar segments={row.segments} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(EquipmentTimeline)
