import { Eye } from 'lucide-react'

const events = [
  { time: '10:31', name: '风机变频优化', target: '鼓风机房', saving: '2,860', cost: '¥2,145' },
  { time: '10:12', name: '阀门开度优化', target: '回流系统', saving: '1,160', cost: '¥870' },
  { time: '09:58', name: '加药量优化', target: '加药系统', saving: '860', cost: '¥645' },
  { time: '09:42', name: '回流泵启停优化', target: '回流系统', saving: '1,260', cost: '¥945' },
  { time: '09:21', name: '曝气DO闭环控制', target: '生化池', saving: '2,310', cost: '¥1,733' },
  { time: '08:55', name: '污泥脱水节能', target: '污泥处理', saving: '1,140', cost: '¥855' },
]

export default function EventTable() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="panel-title text-[14px] mb-2">节能事件 / 策略执行记录</div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[rgba(15,37,64,0.8)]">
              <th className="text-left px-2 py-1.5 text-[11px] text-text-secondary font-medium border-b border-border-subtle w-10">
                时间
              </th>
              <th className="text-left px-2 py-1.5 text-[11px] text-text-secondary font-medium border-b border-border-subtle">
                策略名称
              </th>
              <th className="text-left px-2 py-1.5 text-[11px] text-text-secondary font-medium border-b border-border-subtle">
                执行对象
              </th>
              <th className="text-left px-2 py-1.5 text-[11px] text-text-secondary font-medium border-b border-border-subtle w-16">
                节电量
              </th>
              <th className="text-left px-2 py-1.5 text-[11px] text-text-secondary font-medium border-b border-border-subtle w-14">
                节省费用
              </th>
              <th className="text-left px-2 py-1.5 text-[11px] text-text-secondary font-medium border-b border-border-subtle w-10">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((row, idx) => (
              <tr
                key={idx}
                className="transition-colors duration-200 hover:bg-bg-panel-hover"
                style={{ height: 30, backgroundColor: idx % 2 === 0 ? '#0a1a2e' : '#0d1f35' }}
              >
                <td className="px-2 py-1 text-[11px] text-text-tertiary font-mono-data">
                  {row.time}
                </td>
                <td className="px-2 py-1 text-[11px] text-text-primary">{row.name}</td>
                <td className="px-2 py-1 text-[11px] text-text-secondary">{row.target}</td>
                <td className="px-2 py-1 text-[11px] text-accent-cyan font-mono-data">
                  {row.saving}
                </td>
                <td className="px-2 py-1 text-[11px] text-text-success font-mono-data">
                  {row.cost}
                </td>
                <td className="px-2 py-1">
                  <button className="flex items-center gap-0.5 text-[11px] text-accent-cyan hover:text-accent-cyan-dim transition-colors">
                    <Eye className="w-3 h-3" />
                    查看
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[10px] text-text-tertiary mt-1">
        交互说明: 点击策略查看收益来源
      </div>
    </div>
  )
}
