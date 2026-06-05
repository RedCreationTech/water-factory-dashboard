import { cn } from '@/lib/utils'

interface EquipmentItem {
  name: string
  onlinePercent: number
  abnormalCount: number
}

const equipmentList: EquipmentItem[] = [
  { name: '进水泵系', onlinePercent: 98, abnormalCount: 2 },
  { name: '鼓风机', onlinePercent: 96, abnormalCount: 2 },
  { name: '回流泵', onlinePercent: 95, abnormalCount: 1 },
  { name: '搅拌机', onlinePercent: 97, abnormalCount: 1 },
  { name: '二沉池', onlinePercent: 100, abnormalCount: 0 },
  { name: '加药', onlinePercent: 100, abnormalCount: 0 },
  { name: '消毒/出水', onlinePercent: 100, abnormalCount: 0 },
  { name: '污泥处理', onlinePercent: 95, abnormalCount: 1 },
]

export default function EquipmentOverview() {
  return (
    <div className="flex flex-col h-full">
      {/* Legend */}
      <div className="flex items-center gap-3 px-3 py-1.5 text-[11px] text-text-tertiary">
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-status-normal" />
          在线设备
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-status-danger" />
          异常设备
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto custom-scrollbar px-3">
        {equipmentList.map((item, idx) => (
          <div
            key={item.name}
            className="flex items-center gap-2 py-1.5 border-b border-border-subtle/50 last:border-0"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <span className="w-16 text-xs text-text-secondary flex-shrink-0">{item.name}</span>

            {/* Progress bar */}
            <div className="flex-1 h-1.5 bg-bg-panel rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  item.onlinePercent >= 98 ? 'bg-status-normal' : item.onlinePercent >= 95 ? 'bg-status-warning' : 'bg-status-danger'
                )}
                style={{ width: `${item.onlinePercent}%` }}
              />
            </div>

            <span className="w-8 text-right text-xs font-data text-text-primary">{item.onlinePercent}%</span>

            {item.abnormalCount > 0 ? (
              <span className="w-6 text-right text-xs font-data text-status-danger">{item.abnormalCount}</span>
            ) : (
              <span className="w-6 text-right text-xs font-data text-text-tertiary">-</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
