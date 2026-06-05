import Panel from '@/components/Panel'
import { operationRecords } from './mockData'

export default function RecentOperationsPanel() {
  const records = operationRecords

  return (
    <Panel title="最近操作记录" className="flex-1">
      <div className="overflow-auto custom-scrollbar" style={{ maxHeight: 160 }}>
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10">
            <tr style={{ backgroundColor: 'rgba(15, 37, 64, 0.8)' }}>
              {[
                { key: 'time', title: '操作时间', width: '140px' },
                { key: 'operator', title: '操作人', width: '80px' },
                { key: 'type', title: '操作类型', width: '90px' },
                { key: 'target', title: '操作对象', width: '80px' },
                { key: 'content', title: '操作内容', width: 'auto' },
                { key: 'result', title: '结果', width: '60px' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left px-3 py-2 text-xs text-text-secondary font-medium border-b border-border-subtle whitespace-nowrap"
                  style={{ width: col.width }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, idx) => (
              <tr
                key={record.key}
                className={idx % 2 === 0 ? 'bg-[#0a1a2e]' : 'bg-[#0d1f35]'}
                style={{ height: 32 }}
              >
                <td className="px-3 py-1.5 text-xs text-text-tertiary font-data whitespace-nowrap">
                  {record.time}
                </td>
                <td className="px-3 py-1.5 text-xs text-text-primary whitespace-nowrap">
                  {record.operator}
                </td>
                <td className="px-3 py-1.5 text-xs text-text-secondary whitespace-nowrap">
                  {record.type}
                </td>
                <td className="px-3 py-1.5 text-xs text-text-secondary whitespace-nowrap">
                  {record.target}
                </td>
                <td className="px-3 py-1.5 text-xs text-text-secondary whitespace-nowrap">
                  {record.content}
                </td>
                <td className="px-3 py-1.5 text-xs whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-normal" />
                    <span className="text-status-normal">成功</span>
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
