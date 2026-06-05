import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AlarmRecord {
  key: string
  time: string
  object: string
  content: string
  level: 'important' | 'general'
  status: 'unconfirmed' | 'confirmed'
}

const alarmData: AlarmRecord[] = [
  {
    key: '1',
    time: '10:31:22',
    object: '生化池 3区 DO探头',
    content: 'DO低于设定值(<2.0mg/L)',
    level: 'important',
    status: 'unconfirmed',
  },
  {
    key: '2',
    time: '10:28:45',
    object: '鼓风机 #2',
    content: '电流超限(>105A)',
    level: 'important',
    status: 'unconfirmed',
  },
  {
    key: '3',
    time: '10:26:13',
    object: '生化池 6区 液位',
    content: '液位偏高(>4.2m)',
    level: 'important',
    status: 'unconfirmed',
  },
  {
    key: '4',
    time: '10:18:37',
    object: '二沉池 出水SS',
    content: '出水SS超标(>15mg/L)',
    level: 'important',
    status: 'confirmed',
  },
  {
    key: '5',
    time: '09:56:11',
    object: '加药泵 PAC',
    content: '药剂剩余量不足',
    level: 'general',
    status: 'confirmed',
  },
]

const tabs = [
  { key: 'realtime' as const, label: '实时告警' },
  { key: 'confirmed' as const, label: '已确认(3)' },
  { key: 'all' as const, label: '全部(8)' },
]

type TabKey = (typeof tabs)[number]['key']

export default function AlarmTable() {
  const [activeTab, setActiveTab] = useState<TabKey>('realtime')

  const filteredData = alarmData.filter((record) => {
    if (activeTab === 'realtime') return record.status === 'unconfirmed'
    if (activeTab === 'confirmed') return record.status === 'confirmed'
    return true
  })

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-2 py-0.5 rounded text-[11px] font-medium transition-all duration-200',
              activeTab === tab.key
                ? 'bg-accent-cyan text-bg-primary'
                : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-panel-hover'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[rgba(15,37,64,0.8)]">
              <th className="text-left px-2 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle w-[52px]">
                告警时间
              </th>
              <th className="text-left px-2 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle w-[80px]">
                告警对象
              </th>
              <th className="text-left px-2 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle">
                告警内容
              </th>
              <th className="text-left px-2 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle w-[44px]">
                级别
              </th>
              <th className="text-left px-2 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle w-[44px]">
                状态
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record, idx) => (
              <tr
                key={record.key}
                className={cn(
                  'transition-colors duration-200 hover:bg-bg-panel-hover',
                  idx % 2 === 0 ? 'bg-[#0a1a2e]' : 'bg-[#0d1f35]'
                )}
                style={{ height: 32 }}
              >
                <td className="px-2 py-1 text-[10px] text-text-secondary font-data whitespace-nowrap">
                  {record.time}
                </td>
                <td className="px-2 py-1 text-[10px] text-text-primary whitespace-nowrap">
                  {record.object}
                </td>
                <td className="px-2 py-1 text-[10px] text-text-secondary truncate max-w-[120px]">
                  {record.content}
                </td>
                <td className="px-2 py-1 whitespace-nowrap">
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-[10px]',
                      record.level === 'important' ? 'text-status-warning' : 'text-status-danger'
                    )}
                  >
                    <span className="text-xs">▲</span>
                    {record.level === 'important' ? '重要' : '一般'}
                  </span>
                </td>
                <td className="px-2 py-1 whitespace-nowrap">
                  <span
                    className={cn(
                      'text-[10px]',
                      record.status === 'unconfirmed' ? 'text-status-danger' : 'text-text-tertiary'
                    )}
                  >
                    {record.status === 'unconfirmed' ? '未确认' : '已确认'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
