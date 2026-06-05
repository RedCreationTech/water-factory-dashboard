import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  FileText,
  ShieldAlert,
  CheckCircle,
  Search,
  Download,
  RotateCcw,
  X,
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import Panel from '@/components/Panel'
import DataTable from '@/components/DataTable'
import ReactECharts from 'echarts-for-react'

/* ─────────── types ─────────── */
interface AuditLog {
  key: string
  time: string
  user: string
  org: string
  module: string
  opType: '新增' | '修改' | '删除'
  content: string
  result: '成功' | '失败'
  ip: string
  terminal: string
  browser: string
  requestId: string
  riskLevel: '低风险' | '中风险' | '高风险'
  changes: Array<{ field: string; before: string; after: string }>
}

/* ─────────── demo data ─────────── */
const auditLogData: AuditLog[] = [
  { key: 'l1', time: '2025-05-15 14:32:18', user: 'admin', org: '总部管理部', module: '用户管理', opType: '修改', content: '编辑用户信息: 张工', result: '成功', ip: '192.168.1.105', terminal: 'Web浏览器', browser: 'Chrome 124.0', requestId: 'req-8f3a2c1d', riskLevel: '中风险', changes: [{ field: '手机号', before: '138****1234', after: '139****5678' }, { field: '邮箱', before: 'zhang@old.com', after: 'zhang@new.com' }, { field: '角色', before: '工艺工程师', after: '厂区管理员' }, { field: '状态', before: '正常', after: '冻结' }] },
  { key: 'l2', time: '2025-05-15 13:15:42', user: 'sys01', org: '信息中心', module: '点位配置', opType: '新增', content: '新增监测点位: 二沉池出口浊度', result: '成功', ip: '192.168.1.112', terminal: 'Web浏览器', browser: 'Edge 123.0', requestId: 'req-7e2b1a0c', riskLevel: '低风险', changes: [{ field: '点位编号', before: '-', after: 'PT-2025-089' }, { field: '点位名称', before: '-', after: '二沉池出口浊度' }, { field: '数据类型', before: '-', after: '模拟量' }, { field: '量程上限', before: '-', after: '100 NTU' }] },
  { key: 'l3', time: '2025-05-15 11:48:25', user: 'admin', org: '总部管理部', module: '告警规则', opType: '修改', content: '修改告警阈值: 进水COD超标告警', result: '成功', ip: '192.168.1.105', terminal: 'Web浏览器', browser: 'Chrome 124.0', requestId: 'req-6d1c9b8e', riskLevel: '中风险', changes: [{ field: '告警阈值', before: '> 450 mg/L', after: '> 500 mg/L' }, { field: '持续时长', before: '5分钟', after: '10分钟' }, { field: '通知方式', before: '站内信、短信', after: '站内信、短信、邮件' }, { field: '自动工单', before: '关闭', after: '开启' }] },
  { key: 'l4', time: '2025-05-15 10:22:10', user: 'mgr01', org: '城南水厂', module: 'AI模型管理', opType: '删除', content: '删除旧版本模型: 能耗预测模型 v1.1.0', result: '成功', ip: '192.168.2.45', terminal: 'Web浏览器', browser: 'Chrome 123.0', requestId: 'req-5a0f7e6d', riskLevel: '高风险', changes: [{ field: '模型名称', before: '能耗预测模型 v1.1.0', after: '-' }, { field: '发布状态', before: '已停止', after: '-' }, { field: '训练样本数', before: '45,000', after: '-' }, { field: '部署环境', before: '测试环境', after: '-' }] },
  { key: 'l5', time: '2025-05-15 09:55:33', user: 'eng02', org: '城东水厂', module: '点位配置', opType: '修改', content: '修改采集频率: 曝气池DO', result: '成功', ip: '192.168.3.78', terminal: 'Web浏览器', browser: 'Firefox 125.0', requestId: 'req-4e9d8c7b', riskLevel: '低风险', changes: [{ field: '采集周期', before: '5分钟', after: '1分钟' }, { field: '上报方式', before: '定时上报', after: '变化上报' }, { field: '死区范围', before: '0.1 mg/L', after: '0.05 mg/L' }, { field: '量程上限', before: '10 mg/L', after: '15 mg/L' }] },
  { key: 'l6', time: '2025-05-15 08:40:17', user: 'admin', org: '总部管理部', module: '系统设置', opType: '修改', content: '修改安全策略: 密码复杂度要求', result: '成功', ip: '192.168.1.105', terminal: 'Web浏览器', browser: 'Chrome 124.0', requestId: 'req-3c8b7a5f', riskLevel: '高风险', changes: [{ field: '最小长度', before: '8位', after: '12位' }, { field: '复杂度要求', before: '字母+数字', after: '大写+小写+数字+特殊字符' }, { field: '有效期', before: '90天', after: '60天' }, { field: '历史密码', before: '3次', after: '5次' }] },
  { key: 'l7', time: '2025-05-15 07:25:50', user: 'sys02', org: '信息中心', module: '角色权限', opType: '新增', content: '新增角色: 数据审计员', result: '成功', ip: '192.168.1.118', terminal: 'Web浏览器', browser: 'Chrome 124.0', requestId: 'req-2b7a6e4d', riskLevel: '中风险', changes: [{ field: '角色名称', before: '-', after: '数据审计员' }, { field: '数据范围', before: '-', after: '全厂数据' }, { field: '权限级别', before: '-', after: 'L4' }, { field: '状态', before: '-', after: '启用' }] },
  { key: 'l8', time: '2025-05-14 22:10:05', user: 'duty05', org: '城北水厂', module: '告警规则', opType: '修改', content: '临时屏蔽告警: 鼓风机高温告警', result: '成功', ip: '192.168.4.92', terminal: 'Web浏览器', browser: 'Chrome 122.0', requestId: 'req-1a69d3c2', riskLevel: '中风险', changes: [{ field: '屏蔽时段', before: '无', after: '2025-05-14 22:00 ~ 06:00' }, { field: '屏蔽原因', before: '-', after: '计划维保' }, { field: '操作人确认', before: '-', after: 'duty05' }, { field: '状态', before: '启用', after: '屏蔽中' }] },
  { key: 'l9', time: '2025-05-14 20:45:38', user: 'analyst02', org: '信息中心', module: 'AI模型管理', opType: '新增', content: '创建训练任务: 污泥浓度模型增量训练', result: '成功', ip: '192.168.1.125', terminal: 'Web浏览器', browser: 'Edge 123.0', requestId: 'req-0f58c2b1', riskLevel: '低风险', changes: [{ field: '任务名称', before: '-', after: '污泥浓度模型增量训练' }, { field: '数据规模', before: '-', after: '6,800条' }, { field: '模型版本', before: '-', after: 'v2.1.0' }, { field: '执行时间', before: '-', after: '2025-05-12 02:00' }] },
  { key: 'l10', time: '2025-05-14 18:30:22', user: 'admin', org: '总部管理部', module: '用户管理', opType: '删除', content: '删除用户: 离职员工李XX', result: '成功', ip: '192.168.1.105', terminal: 'Web浏览器', browser: 'Chrome 124.0', requestId: 'req-9e47b1a0', riskLevel: '高风险', changes: [{ field: '用户名', before: 'lixx', after: '-' }, { field: '所属组织', before: '城南水厂', after: '-' }, { field: '角色', before: '值班人员', after: '-' }, { field: '状态', before: '正常', after: '-' }] },
]

/* ─────────── trend data ─────────── */
const trendData24h = {
  categories: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
  total: [45, 32, 28, 55, 128, 142, 118, 135, 98, 85, 72, 58],
  highRisk: [1, 0, 0, 2, 3, 4, 2, 3, 1, 2, 1, 1],
}

const trendData7d = {
  categories: ['05-09', '05-10', '05-11', '05-12', '05-13', '05-14', '05-15'],
  total: [856, 912, 789, 1024, 1156, 1089, 1248],
  highRisk: [6, 8, 5, 9, 11, 10, 12],
}

const trendData30d = {
  categories: ['04-15', '04-20', '04-25', '04-30', '05-05', '05-10', '05-15'],
  total: [18500, 21200, 19800, 23500, 25800, 24100, 26400],
  highRisk: [98, 112, 105, 128, 135, 110, 125],
}

/* ─────────── helpers ─────────── */
const opTypeBadge = (type: string) => {
  switch (type) {
    case '新增': return 'bg-[#00ff88]/15 text-[#00ff88] border-[#00ff88]/30'
    case '修改': return 'bg-[#00aaff]/15 text-[#00aaff] border-[#00aaff]/30'
    case '删除': return 'bg-[#ff4444]/15 text-[#ff4444] border-[#ff4444]/30'
    default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30'
  }
}

const riskBadge = (level: string) => {
  switch (level) {
    case '低风险': return 'bg-[#00ff88]/15 text-[#00ff88] border-[#00ff88]/30'
    case '中风险': return 'bg-[#ffcc00]/15 text-[#ffcc00] border-[#ffcc00]/30'
    case '高风险': return 'bg-[#ff4444]/15 text-[#ff4444] border-[#ff4444]/30'
    default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30'
  }
}

/* ─────────── component ─────────── */
export default function LogAuditTab() {
  const [selectedKey, setSelectedKey] = useState<string>('l1')
  const [searchText, setSearchText] = useState('')
  const [userFilter, setUserFilter] = useState('全部用户')
  const [moduleFilter, setModuleFilter] = useState('全部模块')
  const [opTypeFilter, setOpTypeFilter] = useState('全部类型')
  const [resultFilter, setResultFilter] = useState('全部结果')
  const [currentPage, setCurrentPage] = useState(1)
  const [trendTab, setTrendTab] = useState<'24h' | '7d' | '30d'>('24h')

  const totalPages = 5

  const filteredLogs = auditLogData.filter((r) => {
    const matchSearch = searchText === '' || r.content.includes(searchText) || r.user.includes(searchText)
    const matchUser = userFilter === '全部用户' || r.user === userFilter
    const matchModule = moduleFilter === '全部模块' || r.module === moduleFilter
    const matchOpType = opTypeFilter === '全部类型' || r.opType === opTypeFilter
    const matchResult = resultFilter === '全部结果' || r.result === resultFilter
    return matchSearch && matchUser && matchModule && matchOpType && matchResult
  })

  const selectedLog = auditLogData.find((r) => r.key === selectedKey) ?? auditLogData[0]

  /* trend chart option */
  const trendChartOption = useMemo(() => {
    const data = trendTab === '24h' ? trendData24h : trendTab === '7d' ? trendData7d : trendData30d
    return {
      grid: { top: 30, right: 20, bottom: 30, left: 50 },
      xAxis: {
        type: 'category' as const,
        data: data.categories,
        axisLine: { lineStyle: { color: '#1a3a5c' } },
        axisLabel: { color: '#5a7a94', fontSize: 11 },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: 'value' as const,
          axisLine: { show: false },
          splitLine: { lineStyle: { color: '#0f2540', type: 'dashed' as const } },
          axisLabel: { color: '#5a7a94', fontSize: 11 },
        },
        {
          type: 'value' as const,
          axisLine: { show: false },
          splitLine: { show: false },
          axisLabel: { color: '#5a7a94', fontSize: 11 },
        },
      ],
      tooltip: {
        trigger: 'axis' as const,
        backgroundColor: 'rgba(5, 14, 26, 0.95)',
        borderColor: '#00c8ff',
        borderWidth: 1,
        textStyle: { color: '#ffffff', fontSize: 12 },
      },
      legend: {
        data: ['日志总数', '高风险操作'],
        textStyle: { color: '#5a7a94', fontSize: 11 },
        top: 0,
        right: 10,
      },
      series: [
        {
          name: '日志总数',
          data: data.total,
          type: 'line' as const,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#4488ff', width: 2 },
          itemStyle: { color: '#4488ff', borderColor: '#0a1a2e', borderWidth: 2 },
          areaStyle: {
            color: {
              type: 'linear' as const,
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(68, 136, 255, 0.25)' },
                { offset: 1, color: 'rgba(68, 136, 255, 0.02)' },
              ],
            },
          },
        },
        {
          name: '高风险操作',
          data: data.highRisk,
          type: 'line' as const,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          yAxisIndex: 1,
          lineStyle: { color: '#ff4444', width: 2 },
          itemStyle: { color: '#ff4444', borderColor: '#0a1a2e', borderWidth: 2 },
        },
      ],
    }
  }, [trendTab])

  const logRows = filteredLogs as unknown as Record<string, unknown>[]

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        <KPICard
          icon={<FileText className="w-4 h-4" />}
          iconBg="rgba(68,136,255,0.15)"
          label="今日日志"
          value="1,248"
          unit="条"
          changePercent="18.6"
          positive={true}
        />
        <KPICard
          icon={<ShieldAlert className="w-4 h-4" />}
          iconBg="rgba(255,68,68,0.15)"
          label="高风险操作"
          value="12"
          unit="条"
          changePercent="9.1"
          positive={false}
        />
        <KPICard
          icon={<CheckCircle className="w-4 h-4" />}
          iconBg="rgba(0,255,136,0.15)"
          label="审计通过率"
          value="98.7"
          unit="%"
          changePercent="1.2"
          positive={true}
        />
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
        {/* Left: Operation Log Panel */}
        <Panel title="操作日志" className="col-span-3 flex flex-col">
          {/* Multi-filter bar */}
          <div className="flex flex-wrap items-center gap-2 mb-3 flex-shrink-0">
            <div className="flex items-center gap-1 px-2 h-8 rounded bg-bg-panel border border-border-primary">
              <span className="text-xs text-text-tertiary">时间</span>
              <input
                type="text"
                defaultValue="2025-05-14"
                className="w-[88px] bg-transparent text-xs text-text-primary focus:outline-none text-center"
              />
              <span className="text-xs text-text-tertiary">~</span>
              <input
                type="text"
                defaultValue="2025-05-15"
                className="w-[88px] bg-transparent text-xs text-text-primary focus:outline-none text-center"
              />
            </div>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="h-8 px-2 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary focus:outline-none focus:border-border-glow cursor-pointer"
            >
              <option>全部用户</option>
              <option>admin</option>
              <option>sys01</option>
              <option>mgr01</option>
              <option>eng02</option>
              <option>sys02</option>
              <option>duty05</option>
              <option>analyst02</option>
            </select>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="h-8 px-2 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary focus:outline-none focus:border-border-glow cursor-pointer"
            >
              <option>全部模块</option>
              <option>用户管理</option>
              <option>点位配置</option>
              <option>告警规则</option>
              <option>AI模型管理</option>
              <option>系统设置</option>
              <option>角色权限</option>
            </select>
            <select
              value={opTypeFilter}
              onChange={(e) => setOpTypeFilter(e.target.value)}
              className="h-8 px-2 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary focus:outline-none focus:border-border-glow cursor-pointer"
            >
              <option>全部类型</option>
              <option>新增</option>
              <option>修改</option>
              <option>删除</option>
            </select>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="h-8 px-2 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary focus:outline-none focus:border-border-glow cursor-pointer"
            >
              <option>全部结果</option>
              <option>成功</option>
              <option>失败</option>
            </select>
            <div className="relative flex-1 min-w-[120px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
              <input
                type="text"
                placeholder="搜索操作内容"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded bg-bg-panel border border-border-primary text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-glow transition-colors"
              />
            </div>
            <button
              onClick={() => { setSearchText(''); setUserFilter('全部用户'); setModuleFilter('全部模块'); setOpTypeFilter('全部类型'); setResultFilter('全部结果'); }}
              className="flex items-center gap-1 px-2 h-8 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary hover:text-text-primary hover:border-border-glow transition-colors flex-shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              重置
            </button>
            <button
              onClick={() => console.log('导出日志')}
              className="flex items-center gap-1 px-2 h-8 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-xs text-accent-cyan hover:bg-accent-cyan/25 transition-colors flex-shrink-0"
            >
              <Download className="w-3 h-3" />
              导出
            </button>
          </div>

          {/* Table */}
          <div
            className="flex-1 min-h-0"
            onClick={(e) => {
              const tr = (e.target as HTMLElement).closest('tr')
              if (tr) {
                const idx = Array.from(tr.parentElement?.children ?? []).indexOf(tr)
                const row = filteredLogs[idx]
                if (row) setSelectedKey(row.key)
              }
            }}
          >
            <DataTable
              columns={[
                {
                  key: 'select',
                  title: '',
                  width: '32px',
                  render: (row) => {
                    const r = row as unknown as AuditLog
                    const checked = selectedKey === r.key
                    return (
                      <div className="flex items-center justify-center">
                        <span className={cn(
                          'w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors',
                          checked ? 'border-accent-cyan bg-accent-cyan' : 'border-border-primary'
                        )}>
                          {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </div>
                    )
                  },
                },
                { key: 'time', title: '时间', dataIndex: 'time' },
                { key: 'user', title: '用户', dataIndex: 'user' },
                { key: 'org', title: '所属组织', dataIndex: 'org' },
                { key: 'module', title: '模块', dataIndex: 'module' },
                {
                  key: 'opType',
                  title: '操作类型',
                  render: (row) => {
                    const r = row as unknown as AuditLog
                    return (
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium border', opTypeBadge(r.opType))}>
                        {r.opType}
                      </span>
                    )
                  },
                },
                { key: 'content', title: '操作内容', dataIndex: 'content', width: '30%' },
                {
                  key: 'result',
                  title: '结果',
                  render: (row) => {
                    const r = row as unknown as AuditLog
                    return (
                      <span className="flex items-center gap-1.5">
                        <span className={cn('w-2 h-2 rounded-full', r.result === '成功' ? 'bg-status-normal' : 'bg-status-danger')} />
                        <span className="text-xs text-text-secondary">{r.result}</span>
                      </span>
                    )
                  },
                },
                { key: 'ip', title: 'IP地址', dataIndex: 'ip' },
              ]}
              data={logRows}
              rowKey="key"
              maxHeight="100%"
              className="cursor-pointer"
            />
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-2 flex-shrink-0">
            <span className="text-xs text-text-tertiary">共12,456条</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 h-7 rounded border border-border-primary text-xs text-text-secondary hover:text-text-primary hover:border-border-glow transition-colors disabled:opacity-50"
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={cn(
                    'w-7 h-7 rounded text-xs font-medium transition-colors',
                    currentPage === p
                      ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30'
                      : 'text-text-secondary hover:text-text-primary border border-transparent hover:border-border-primary'
                  )}
                >
                  {p}
                </button>
              ))}
              <span className="text-xs text-text-tertiary px-1">...</span>
              <button
                onClick={() => setCurrentPage(125)}
                className={cn(
                  'w-10 h-7 rounded text-xs font-medium transition-colors',
                  currentPage === 125
                    ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30'
                    : 'text-text-secondary hover:text-text-primary border border-transparent hover:border-border-primary'
                )}
              >
                125
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 h-7 rounded border border-border-primary text-xs text-text-secondary hover:text-text-primary hover:border-border-glow transition-colors disabled:opacity-50"
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
              <select className="ml-2 h-7 px-1 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary focus:outline-none cursor-pointer">
                <option>10条/页</option>
                <option>20条/页</option>
                <option>50条/页</option>
              </select>
            </div>
          </div>
        </Panel>

        {/* Right: Log Detail Panel */}
        <Panel
          title="日志详情"
          className="col-span-2 flex flex-col"
          rightAction={
            <button
              onClick={() => setSelectedKey('')}
              className="p-1 rounded hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4 text-text-tertiary hover:text-text-primary" />
            </button>
          }
        >
          <div className="flex flex-col gap-3 overflow-auto custom-scrollbar pr-1">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-2">
              <InfoField label="时间" value={selectedLog.time} />
              <InfoField label="用户" value={selectedLog.user} />
              <InfoField label="所属组织" value={selectedLog.org} />
              <InfoField label="模块" value={selectedLog.module} />
              <InfoField label="操作类型" value={
                <span className={cn('px-2 py-0.5 rounded text-xs font-medium border', opTypeBadge(selectedLog.opType))}>
                  {selectedLog.opType}
                </span>
              } />
              <InfoField label="结果" value={
                <span className="flex items-center gap-1.5">
                  <span className={cn('w-2 h-2 rounded-full', selectedLog.result === '成功' ? 'bg-status-normal' : 'bg-status-danger')} />
                  <span className="text-xs text-text-secondary">{selectedLog.result}</span>
                </span>
              } />
              <InfoField label="风险等级" value={
                <span className={cn('px-2 py-0.5 rounded text-xs font-medium border', riskBadge(selectedLog.riskLevel))}>
                  {selectedLog.riskLevel}
                </span>
              } />
            </div>

            {/* Divider */}
            <div className="border-t border-border-subtle" />

            {/* Request Source */}
            <div>
              <h4 className="text-xs font-medium text-text-secondary mb-2">请求来源</h4>
              <div className="grid grid-cols-2 gap-2">
                <InfoField label="IP地址" value={selectedLog.ip} />
                <InfoField label="终端类型" value={selectedLog.terminal} />
                <InfoField label="浏览器版本" value={selectedLog.browser} />
                <InfoField label="请求ID" value={selectedLog.requestId} />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border-subtle" />

            {/* Changes Table */}
            <div>
              <h4 className="text-xs font-medium text-text-secondary mb-2">变更内容</h4>
              <div className="overflow-auto custom-scrollbar">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-[rgba(15,37,64,0.8)]">
                      <th className="text-left px-2 py-1.5 text-text-secondary font-medium border-b border-border-subtle">字段名称</th>
                      <th className="text-left px-2 py-1.5 text-text-secondary font-medium border-b border-border-subtle">变更前</th>
                      <th className="text-left px-2 py-1.5 text-text-secondary font-medium border-b border-border-subtle">变更后</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedLog.changes.map((change, idx) => (
                      <tr
                        key={idx}
                        className={cn(
                          'transition-colors',
                          idx % 2 === 0 ? 'bg-[#0a1a2e]' : 'bg-[#0d1f35]'
                        )}
                      >
                        <td className="px-2 py-1.5 text-text-secondary">{change.field}</td>
                        <td className="px-2 py-1.5 text-status-danger">{change.before}</td>
                        <td className="px-2 py-1.5 text-status-normal">{change.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Risk Warning */}
            {selectedLog.riskLevel !== '低风险' && (
              <div className="flex items-start gap-2 p-2.5 rounded bg-status-danger/10 border border-status-danger/20">
                <ShieldAlert className="w-4 h-4 text-status-danger flex-shrink-0 mt-0.5" />
                <p className="text-xs text-status-danger leading-relaxed">
                  该操作被标记为{selectedLog.riskLevel}。{selectedLog.opType === '删除' ? '数据删除操作不可恢复，请确认是否为授权操作。' : selectedLog.opType === '修改' ? '关键配置变更可能影响系统正常运行，建议复核变更内容。' : '涉及敏感数据的新增操作，请确认数据来源合法性。'}
                </p>
              </div>
            )}
          </div>
        </Panel>
      </div>

      {/* ── Bottom: Audit Event Trend ── */}
      <Panel
        title="审计事件趋势"
        className="flex-shrink-0 h-[220px]"
        rightAction={
          <div className="flex items-center gap-1">
            {([
              { key: '24h' as const, label: '近24小时' },
              { key: '7d' as const, label: '近7天' },
              { key: '30d' as const, label: '近30天' },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTrendTab(t.key)}
                className={cn(
                  'px-3 py-1 rounded text-xs font-medium transition-colors',
                  trendTab === t.key
                    ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30'
                    : 'text-text-tertiary hover:text-text-secondary border border-transparent'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        }
      >
        <ReactECharts option={trendChartOption} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
      </Panel>
    </div>
  )
}

/* ─────────── helper: info field ─────────── */
function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-text-tertiary">{label}</span>
      <span className="text-xs text-text-primary">{value}</span>
    </div>
  )
}
