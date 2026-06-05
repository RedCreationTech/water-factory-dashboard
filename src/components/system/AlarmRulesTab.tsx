import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  Plus,
  Bell,
  MessageSquare,
  Mail,
  Smartphone,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  PauseCircle,
  ClipboardList,
  AlertCircle,
  Clock,
  Activity,
  ShieldAlert,
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import Panel from '@/components/Panel'
import DataTable from '@/components/DataTable'
import StatusLight from '@/components/StatusLight'

/* ─────────── types ─────────── */
interface AlarmRule {
  key: string
  name: string
  target: string
  condition: string
  level: '严重' | '重要' | '次要'
  notify: string[]
  status: '启用' | '禁用'
  recovery?: string
  silent?: string
  createTime?: string
  updateTime?: string
  autoWorkOrder?: boolean
}

interface TriggerEvent {
  key: string
  time: string
  ruleName: string
  target: string
  result: string
}

/* ─────────── demo data ─────────── */
const alarmRulesData: AlarmRule[] = [
  { key: 'r1', name: '进水COD超标告警', target: '进水COD', condition: '数值>500mg/L持续10分钟', level: '严重', notify: ['站内信','短信','邮件'], status: '启用', recovery: '进水COD 数值≤450mg/L 持续5分钟', silent: '00:00-06:00(每天)', createTime: '2024-03-15 09:30:22', updateTime: '2025-05-15 14:22:18', autoWorkOrder: true },
  { key: 'r2', name: '出水氨氮超标告警', target: '出水氨氮', condition: '数值>5mg/L持续10分钟', level: '严重', notify: ['站内信','短信','邮件'], status: '启用', recovery: '出水氨氮 数值≤4mg/L 持续5分钟', silent: '00:00-06:00(每天)', createTime: '2024-03-15 10:15:08', updateTime: '2025-04-20 11:08:45', autoWorkOrder: true },
  { key: 'r3', name: '曝气池DO过低告警', target: '曝气池DO', condition: '数值<1.5mg/L持续15分钟', level: '重要', notify: ['站内信','短信'], status: '启用', recovery: '曝气池DO 数值≥2.0mg/L 持续10分钟', silent: '00:00-06:00(每天)', createTime: '2024-04-01 08:45:33', updateTime: '2025-03-12 16:55:29', autoWorkOrder: false },
  { key: 'r4', name: '污泥回流泵故障告警', target: '污泥回流泵', condition: '设备状态=故障持续1分钟', level: '重要', notify: ['站内信','短信'], status: '启用', recovery: '设备状态=正常 持续3分钟', silent: '无', createTime: '2024-04-10 13:20:15', updateTime: '2025-02-28 09:40:11', autoWorkOrder: true },
  { key: 'r5', name: '鼓风机高温告警', target: '鼓风机温度', condition: '数值>85℃持续5分钟', level: '次要', notify: ['站内信'], status: '启用', recovery: '数值≤80℃ 持续5分钟', silent: '00:00-06:00(每天)', createTime: '2024-05-20 11:10:42', updateTime: '2025-01-15 15:30:55', autoWorkOrder: false },
  { key: 'r6', name: '液位过高告警', target: '调节池液位', condition: '数值>4.0m持续10分钟', level: '重要', notify: ['站内信','短信'], status: '启用', recovery: '数值≤3.5m 持续10分钟', silent: '00:00-06:00(每天)', createTime: '2024-06-01 07:50:18', updateTime: '2025-05-10 10:12:38', autoWorkOrder: true },
  { key: 'r7', name: '药剂库存不足告警', target: 'PAC药剂库存', condition: '数值<500kg', level: '次要', notify: ['站内信','邮件'], status: '启用', recovery: '数值≥1000kg', silent: '无', createTime: '2024-06-15 09:25:30', updateTime: '2025-04-28 14:05:22', autoWorkOrder: false },
  { key: 'r8', name: '设备离线告警', target: '所有在线设备', condition: '设备状态=离线持续3分钟', level: '重要', notify: ['站内信','短信'], status: '禁用', recovery: '设备状态=在线 持续1分钟', silent: '无', createTime: '2024-07-01 16:40:05', updateTime: '2025-03-20 08:55:47', autoWorkOrder: true },
]

const triggerEventsData: TriggerEvent[] = [
  { key: 'e1', time: '2025-05-15 14:32:18', ruleName: '进水COD超标告警', target: '进水COD', result: '已通知(站内信、短信、邮件)，已创建工单' },
  { key: 'e2', time: '2025-05-15 11:05:42', ruleName: '液位过高告警', target: '调节池液位', result: '已通知(站内信、短信)，已创建工单' },
  { key: 'e3', time: '2025-05-15 08:18:25', ruleName: '鼓风机高温告警', target: '鼓风机温度', result: '已通知(站内信)，已创建工单' },
  { key: 'e4', time: '2025-05-14 22:45:10', ruleName: '出水氨氮超标告警', target: '出水氨氮', result: '已通知(站内信、短信、邮件)，已创建工单' },
]

/* ─────────── level / status helpers ─────────── */
const levelColor = (level: string) => {
  switch (level) {
    case '严重': return 'bg-[#ff4444]/15 text-[#ff4444] border-[#ff4444]/30'
    case '重要': return 'bg-[#ff8833]/15 text-[#ff8833] border-[#ff8833]/30'
    case '次要': return 'bg-[#ffcc00]/15 text-[#ffcc00] border-[#ffcc00]/30'
    default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30'
  }
}

const statusColor = (status: string) => {
  switch (status) {
    case '启用': return 'normal'
    case '禁用': return 'offline'
    default: return 'offline'
  }
}

/* ─────────── component ─────────── */
export default function AlarmRulesTab() {
  const [selectedKey, setSelectedKey] = useState<string>('r1')
  const [searchText, setSearchText] = useState('')
  const [levelFilter, setLevelFilter] = useState('全部级别')
  const [statusFilter, setStatusFilter] = useState('全部状态')
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 9

  const filteredRules = alarmRulesData.filter((r) => {
    const matchSearch = searchText === '' || r.name.includes(searchText) || r.target.includes(searchText)
    const matchLevel = levelFilter === '全部级别' || r.level === levelFilter
    const matchStatus = statusFilter === '全部状态' || r.status === statusFilter
    return matchSearch && matchLevel && matchStatus
  })

  const selectedRule = alarmRulesData.find((r) => r.key === selectedKey) ?? alarmRulesData[0]

  // Use any-typed wrappers to satisfy DataTable generic constraint
  const ruleRows = filteredRules as unknown as Record<string, unknown>[]
  const eventRows = triggerEventsData as unknown as Record<string, unknown>[]

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        <KPICard
          icon={<Bell className="w-4 h-4" />}
          iconBg="rgba(0,170,255,0.15)"
          label="规则总数"
          value={86}
          unit="条"
          changePercent="3"
          positive={true}
        />
        <KPICard
          icon={<ShieldAlert className="w-4 h-4" />}
          iconBg="rgba(0,255,136,0.15)"
          label="启用规则"
          value={68}
          unit="条"
          changePercent="2"
          positive={true}
        />
        <KPICard
          icon={<Activity className="w-4 h-4" />}
          iconBg="rgba(255,68,68,0.15)"
          label="今日触发"
          value={12}
          unit="条"
          changePercent="4"
          positive={true}
        />
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
        {/* Left: Alarm Rule List */}
        <Panel title="告警规则列表" className="col-span-3 flex flex-col">
          {/* Filters */}
          <div className="flex items-center gap-2 mb-3 flex-shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
              <input
                type="text"
                placeholder="搜索规则名称"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded bg-bg-panel border border-border-primary text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-glow transition-colors"
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="h-8 px-2 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary focus:outline-none focus:border-border-glow cursor-pointer"
            >
              <option>全部级别</option>
              <option>严重</option>
              <option>重要</option>
              <option>次要</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary focus:outline-none focus:border-border-glow cursor-pointer"
            >
              <option>全部状态</option>
              <option>启用</option>
              <option>禁用</option>
            </select>
            <button className="flex items-center gap-1 px-3 h-8 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-xs text-accent-cyan hover:bg-accent-cyan/25 transition-colors flex-shrink-0">
              <Plus className="w-3.5 h-3.5" />
              新建规则
            </button>
          </div>

          {/* Table */}
          <div
            className="flex-1 min-h-0"
            onClick={(e) => {
              const tr = (e.target as HTMLElement).closest('tr')
              if (tr) {
                const idx = Array.from(tr.parentElement?.children ?? []).indexOf(tr)
                const row = filteredRules[idx]
                if (row) setSelectedKey(row.key)
              }
            }}
          >
            <DataTable
              columns={[
                { key: 'name', title: '规则名称', dataIndex: 'name' },
                { key: 'target', title: '监控对象', dataIndex: 'target' },
                { key: 'condition', title: '条件', dataIndex: 'condition', width: '30%' },
                {
                  key: 'level',
                  title: '告警级别',
                  render: (row) => {
                    const r = row as unknown as AlarmRule
                    return (
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium border', levelColor(r.level))}>
                        {r.level}
                      </span>
                    )
                  },
                },
                {
                  key: 'notify',
                  title: '通知方式',
                  render: (row) => {
                    const r = row as unknown as AlarmRule
                    return <span className="text-xs text-text-secondary">{r.notify.join('、')}</span>
                  },
                },
                {
                  key: 'status',
                  title: '状态',
                  render: (row) => {
                    const r = row as unknown as AlarmRule
                    return (
                      <span className="flex items-center gap-1.5">
                        <StatusLight status={statusColor(r.status)} size="sm" />
                        <span className={cn('text-xs', r.status === '启用' ? 'text-text-success' : 'text-text-tertiary')}>
                          {r.status}
                        </span>
                      </span>
                    )
                  },
                },
              ]}
              data={ruleRows}
              rowKey="key"
              maxHeight="100%"
              className="cursor-pointer"
            />
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-2 flex-shrink-0">
            <span className="text-xs text-text-tertiary">共 {alarmRulesData.length} 条规则</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="p-1 rounded hover:bg-white/5 text-text-secondary transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={cn(
                    'w-6 h-6 rounded text-xs transition-colors',
                    currentPage === p
                      ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30'
                      : 'text-text-secondary hover:bg-white/5'
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className="p-1 rounded hover:bg-white/5 text-text-secondary transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Panel>

        {/* Right: Rule Detail */}
        <Panel title="规则详情" className="col-span-2 flex flex-col">
          <div className="flex flex-col gap-3 overflow-auto custom-scrollbar pr-1">
            {/* Basic fields */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-bg-panel rounded p-2.5">
                <span className="text-xs text-text-tertiary block mb-1">规则名称</span>
                <span className="text-sm text-text-primary font-medium">{selectedRule.name}</span>
              </div>
              <div className="bg-bg-panel rounded p-2.5">
                <span className="text-xs text-text-tertiary block mb-1">监控对象</span>
                <span className="text-sm text-text-primary font-medium">{selectedRule.target}</span>
              </div>
              <div className="bg-bg-panel rounded p-2.5">
                <span className="text-xs text-text-tertiary block mb-1">状态</span>
                <span className="flex items-center gap-1.5">
                  <StatusLight status={statusColor(selectedRule.status)} size="sm" />
                  <span className={cn('text-sm', selectedRule.status === '启用' ? 'text-text-success' : 'text-text-tertiary')}>
                    {selectedRule.status}
                  </span>
                </span>
              </div>
              <div className="bg-bg-panel rounded p-2.5">
                <span className="text-xs text-text-tertiary block mb-1">告警级别</span>
                <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-medium border', levelColor(selectedRule.level))}>
                  {selectedRule.level}
                </span>
              </div>
              <div className="bg-bg-panel rounded p-2.5">
                <span className="text-xs text-text-tertiary block mb-1">创建时间</span>
                <span className="text-sm text-text-primary font-data">{selectedRule.createTime}</span>
              </div>
              <div className="bg-bg-panel rounded p-2.5">
                <span className="text-xs text-text-tertiary block mb-1">更新时间</span>
                <span className="text-sm text-text-primary font-data">{selectedRule.updateTime}</span>
              </div>
            </div>

            {/* Trigger condition */}
            <div className="bg-bg-panel rounded border border-border-primary p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-status-danger" />
                <span className="text-sm font-medium text-text-primary">触发条件</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {selectedRule.target} <span className="text-status-danger font-medium">{selectedRule.condition.replace(selectedRule.target, '').trim()}</span>
              </p>
            </div>

            {/* Recovery condition */}
            <div className="bg-bg-panel rounded border border-border-primary p-3">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-3.5 h-3.5 text-status-normal" />
                <span className="text-sm font-medium text-text-primary">恢复条件</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {selectedRule.recovery || `${selectedRule.target} 恢复正常范围`}
              </p>
            </div>

            {/* Silent period */}
            <div className="flex items-center gap-2 bg-bg-panel rounded p-3">
              <Clock className="w-3.5 h-3.5 text-text-tertiary" />
              <span className="text-xs text-text-secondary">静默周期：</span>
              <span className="text-xs text-text-primary font-medium">{selectedRule.silent || '无'}</span>
              <span title="静默周期内不重复触发告警" className="ml-1 cursor-help">
                <AlertCircle className="w-3 h-3 text-text-tertiary" />
              </span>
            </div>

            {/* Notification channels */}
            <div className="bg-bg-panel rounded p-3">
              <span className="text-sm font-medium text-text-primary block mb-2">通知渠道</span>
              <div className="flex items-center gap-3">
                {[
                  { key: '站内信', icon: MessageSquare },
                  { key: '短信', icon: Smartphone },
                  { key: '邮件', icon: Mail },
                ].map(({ key, icon: Icon }) => {
                  const checked = selectedRule.notify.includes(key)
                  return (
                    <button
                      key={key}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs transition-all',
                        checked
                          ? 'border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan'
                          : 'border-border-primary bg-transparent text-text-tertiary'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{key}</span>
                      {checked && <Check className="w-3 h-3" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Work order */}
            <div className="flex items-center justify-between bg-bg-panel rounded p-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-3.5 h-3.5 text-text-secondary" />
                <span className="text-xs text-text-secondary">触发后自动创建工单</span>
              </div>
              <button className="relative w-10 h-5 rounded-full transition-colors bg-accent-cyan/30 border border-accent-cyan/50">
                <span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-accent-cyan shadow-sm transition-transform" />
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-1">
              <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-sm text-accent-cyan hover:bg-accent-cyan/25 transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
                编辑规则
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-status-danger/15 border border-status-danger/30 text-sm text-status-danger hover:bg-status-danger/25 transition-colors">
                <PauseCircle className="w-3.5 h-3.5" />
                停用规则
              </button>
            </div>
          </div>
        </Panel>
      </div>

      {/* ── Bottom: Recent trigger events ── */}
      <Panel title="最近触发事件" className="flex-shrink-0" style={{ maxHeight: 220 }}>
        <DataTable
          columns={[
            { key: 'time', title: '触发时间', dataIndex: 'time' },
            { key: 'ruleName', title: '规则名称', dataIndex: 'ruleName' },
            { key: 'target', title: '监控对象', dataIndex: 'target' },
            {
              key: 'result',
              title: '触发结果',
              render: (row) => {
                const r = row as unknown as TriggerEvent
                return <span className="text-xs text-text-success">{r.result}</span>
              },
            },
          ]}
          data={eventRows}
          rowKey="key"
        />
      </Panel>
    </div>
  )
}
