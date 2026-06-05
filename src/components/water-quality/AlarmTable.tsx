import { memo } from 'react'
import { cn } from '@/lib/utils'

interface AlarmItem {
  time: string
  point: string
  factor: string
  value: string
  threshold: string
  level: string
  status: '未处理' | '已处理'
}

const alarmData: AlarmItem[] = [
  {
    time: '10:21:34',
    point: '紫外消毒出水',
    factor: '余氯',
    value: '0.15mg/L',
    threshold: '≥0.3',
    level: '预警',
    status: '未处理',
  },
  {
    time: '09:47:12',
    point: '进水口',
    factor: '氨氮',
    value: '36.2mg/L',
    threshold: '≤35',
    level: '预警',
    status: '未处理',
  },
  {
    time: '08:32:55',
    point: '初沉池',
    factor: 'SS',
    value: '62mg/L',
    threshold: '≤60',
    level: '预警',
    status: '已处理',
  },
]

const columns = [
  { key: 'time', title: '时间', width: '70px' },
  { key: 'point', title: '监测点', width: '100px' },
  { key: 'factor', title: '因子', width: '55px' },
  { key: 'value', title: '实测值', width: '80px' },
  { key: 'threshold', title: '阈值', width: '60px' },
  { key: 'level', title: '级别', width: '55px' },
  { key: 'status', title: '状态', width: '65px' },
]

const AlarmTable = memo(function AlarmTable() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10">
            <tr style={{ backgroundColor: 'rgba(15, 37, 64, 0.8)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-center px-1.5 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle whitespace-nowrap"
                  style={{ width: col.width }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alarmData.map((row, idx) => (
              <tr
                key={idx}
                className={cn(
                  'transition-colors duration-150 hover:bg-bg-panel-hover',
                  idx % 2 === 0 ? 'bg-[#0a1a2e]' : 'bg-[#0d1f35]'
                )}
                style={{ height: 36 }}
              >
                <td className="px-1.5 py-1 text-center text-[11px] text-text-secondary whitespace-nowrap font-data">
                  {row.time}
                </td>
                <td className="px-1.5 py-1 text-center text-[11px] text-text-secondary whitespace-nowrap">
                  {row.point}
                </td>
                <td className="px-1.5 py-1 text-center text-[11px] text-text-primary whitespace-nowrap">
                  {row.factor}
                </td>
                <td className="px-1.5 py-1 text-center text-[11px] text-status-danger whitespace-nowrap font-data">
                  {row.value}
                </td>
                <td className="px-1.5 py-1 text-center text-[11px] text-text-tertiary whitespace-nowrap font-data">
                  {row.threshold}
                </td>
                <td className="px-1.5 py-1 text-center whitespace-nowrap">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-status-warning/15 text-status-warning">
                    {row.level}
                  </span>
                </td>
                <td className="px-1.5 py-1 text-center whitespace-nowrap">
                  <span
                    className={cn(
                      'text-[11px] font-medium',
                      row.status === '未处理' ? 'text-status-danger' : 'text-status-normal'
                    )}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View more link */}
      <div className="flex justify-end pt-2 pb-1">
        <button className="text-[11px] text-accent-cyan hover:text-accent-cyan-dim transition-colors duration-200 flex items-center gap-0.5">
          查看更多
          <span className="text-xs">&gt;</span>
        </button>
      </div>
    </div>
  )
})

export default AlarmTable
