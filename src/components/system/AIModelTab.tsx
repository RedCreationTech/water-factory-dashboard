import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Brain,
  Cpu,
  TrendingUp,
  ChevronRight,
  Play,
  RotateCcw,
  BarChart3,
  Check,
  Layers,
  Database,
  Server,
  Tag,
  GitBranch,
  Beaker,
  ShieldCheck,
  AlertTriangle,
  Award,
  FileCheck,
  Activity,
  List,
  BarChart4,
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import Panel from '@/components/Panel'
import DataTable from '@/components/DataTable'
import ReactECharts from 'echarts-for-react'

/* ─────────── types ─────────── */
interface AIModel {
  key: string
  name: string
  scene: string
  version: string
  status: '运行中' | '已停止'
  accuracy: string
  accuracyValue: number
  updateTime: string
  purpose?: string
  trainSamples?: number
  inputFeatures?: string
  outputParams?: string
  deployEnv?: string
  rollbackVersion?: string
}

interface TrainTask {
  key: string
  taskName: string
  modelVersion: string
  dataSize: string
  startTime: string
  duration: string
  status: '成功' | '失败' | '运行中'
}

/* ─────────── demo data ─────────── */
const modelData: AIModel[] = [
  { key: 'm1', name: '进水水质预测模型', scene: '进水预测', version: 'v2.3.1', status: '运行中', accuracy: '94.2%', accuracyValue: 94.2, updateTime: '2025-05-15 10:30:22', purpose: '预测进水水质变化趋势，为工艺调整提供提前量', trainSamples: 125000, inputFeatures: '流量、pH、温度、电导率、TOC、降雨量等18项', outputParams: 'COD、氨氮、总磷、SS、浊度等5项', deployEnv: '生产环境(主站集群)', rollbackVersion: 'v2.3.0' },
  { key: 'm2', name: '曝气优化控制模型', scene: '曝气控制', version: 'v1.8.0', status: '运行中', accuracy: '92.7%', accuracyValue: 92.7, updateTime: '2025-05-15 09:15:48', purpose: '优化曝气池DO控制策略，降低能耗', trainSamples: 98000, inputFeatures: 'DO、MLSS、进水COD、温度、风量等15项', outputParams: '最优曝气量、风机频率设定值等3项', deployEnv: '生产环境(主站集群)', rollbackVersion: 'v1.7.2' },
  { key: 'm3', name: '污泥浓度预测模型', scene: '污泥管理', version: 'v2.1.0', status: '运行中', accuracy: '93.1%', accuracyValue: 93.1, updateTime: '2025-05-15 08:45:07', purpose: '预测MLSS/MLVSS变化，辅助排泥决策', trainSamples: 86000, inputFeatures: '进水SS、回流比、DO、pH、温度等14项', outputParams: 'MLSS、MLVSS、SVI等3项', deployEnv: '生产环境(主站集群)', rollbackVersion: 'v2.0.1' },
  { key: 'm4', name: '出水水质预测模型', scene: '出水预测', version: 'v1.5.2', status: '运行中', accuracy: '95.0%', accuracyValue: 95.0, updateTime: '2025-05-14 17:23:11', purpose: '预测出水各项指标，确保达标排放', trainSamples: 110000, inputFeatures: '各工艺段参数、药剂投加量、回流比等20项', outputParams: '出水COD、氨氮、总磷、总氮、SS等5项', deployEnv: '生产环境(主站集群)', rollbackVersion: 'v1.5.1' },
  { key: 'm5', name: '药剂投加优化模型', scene: '药剂投加', version: 'v1.3.0', status: '已停止', accuracy: '91.3%', accuracyValue: 91.3, updateTime: '2025-05-13 16:42:19', purpose: '优化PAC/PAM投加量，降低药剂成本', trainSamples: 72000, inputFeatures: '进水浊度、流量、TP、投加量反馈等12项', outputParams: 'PAC投加量、PAM投加量等2项', deployEnv: '测试环境', rollbackVersion: 'v1.2.0' },
  { key: 'm6', name: '能耗预测模型', scene: '能耗管理', version: 'v1.2.1', status: '已停止', accuracy: '90.8%', accuracyValue: 90.8, updateTime: '2025-05-13 11:05:22', purpose: '预测全厂能耗趋势，辅助能效管理', trainSamples: 65000, inputFeatures: '处理量、设备运行状态、气温、进水水质等16项', outputParams: '总电耗、单耗、碳排放等3项', deployEnv: '测试环境', rollbackVersion: 'v1.2.0' },
]

const trainTasksData: TrainTask[] = [
  { key: 't1', taskName: '进水水质模型定期训练', modelVersion: 'v2.3.1', dataSize: '12,500', startTime: '2025-05-15 02:00:00', duration: '2h 18m', status: '成功' },
  { key: 't2', taskName: '曝气优化模型微调', modelVersion: 'v1.8.0', dataSize: '8,600', startTime: '2025-05-14 01:30:00', duration: '1h 45m', status: '成功' },
  { key: 't3', taskName: '出水水质模型全量训练', modelVersion: 'v1.5.2', dataSize: '15,200', startTime: '2025-05-13 00:00:00', duration: '3h 12m', status: '成功' },
  { key: 't4', taskName: '污泥浓度模型增量训练', modelVersion: 'v2.1.0', dataSize: '6,800', startTime: '2025-05-12 02:00:00', duration: '1h 28m', status: '成功' },
]

/* ─────────── accuracy trend data ─────────── */
const accuracyTrendDates = ['05-09', '05-10', '05-11', '05-12', '05-13', '05-14', '05-15']
const accuracyTrendValues = [91.2, 91.8, 92.5, 93.1, 93.0, 93.4, 93.6]

/* ─────────── status helpers ─────────── */
const statusBadge = (status: string) => {
  switch (status) {
    case '运行中': return 'bg-[#00ff88]/15 text-[#00ff88] border-[#00ff88]/30'
    case '已停止': return 'bg-[#ff8833]/15 text-[#ff8833] border-[#ff8833]/30'
    default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30'
  }
}

const taskStatusColor = (status: string) => {
  switch (status) {
    case '成功': return 'text-status-normal'
    case '失败': return 'text-status-danger'
    case '运行中': return 'text-accent-cyan'
    default: return 'text-text-tertiary'
  }
}

/* ─────────── Data Quality View ─────────── */
function DataQualityView() {
  const kpiCards = [
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      iconBg: 'rgba(0,229,255,0.15)',
      label: '数据完整性',
      value: '97.8',
      unit: '%',
      extra: '同比 ▲1.2%',
      extraColor: 'text-status-normal',
    },
    {
      icon: <AlertTriangle className="w-4 h-4" />,
      iconBg: 'rgba(255,136,68,0.15)',
      label: '异常过滤率',
      value: '3.2',
      unit: '%',
      extra: '今日过滤 1,248条',
      extraColor: 'text-text-secondary',
    },
    {
      icon: <Award className="w-4 h-4" />,
      iconBg: 'rgba(170,102,255,0.15)',
      label: '训练数据评分',
      value: '92.6',
      unit: '分',
      extra: '质量: 优良',
      extraColor: 'text-status-normal',
    },
  ]

  const progressItems = [
    { label: '空值处理', value: 97.8, color: '#00ff88' },
    { label: '跳变异常过滤', value: 99.1, color: '#00ff88' },
    { label: '停机数据剔除', value: 100, color: '#00ff88' },
    { label: '数据归一化', value: 96.5, color: '#00e5ff' },
  ]

  const ruleColumns = [
    { key: 'ruleName', title: '规则名称', dataIndex: 'ruleName' },
    { key: 'status', title: '执行状态', dataIndex: 'status' },
    { key: 'processCount', title: '处理量', dataIndex: 'processCount' },
    { key: 'passRate', title: '通过率', dataIndex: 'passRate' },
    { key: 'lastRun', title: '最后执行', dataIndex: 'lastRun' },
  ]

  const ruleData: Record<string, unknown>[] = [
    { key: 'r1', ruleName: '空值自动填充', status: '已启用', processCount: '45,320条', passRate: '97.8%', lastRun: '2025-06-05 11:30:22' },
    { key: 'r2', ruleName: '跳变异常检测', status: '已启用', processCount: '1,248条', passRate: '99.1%', lastRun: '2025-06-05 11:28:15' },
    { key: 'r3', ruleName: '检修期数据剔除', status: '已启用', processCount: '3,860条', passRate: '100%', lastRun: '2025-06-05 11:25:00' },
    { key: 'r4', ruleName: '极端进水数据标记', status: '已启用', processCount: '286条', passRate: '95.2%', lastRun: '2025-06-05 11:20:45' },
    { key: 'r5', ruleName: '数据归一化处理', status: '已启用', processCount: '128,450条', passRate: '96.5%', lastRun: '2025-06-05 11:15:30' },
  ]

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="rounded-md border border-border-primary bg-bg-card backdrop-blur-sm p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: kpi.iconBg }}>
                {kpi.icon}
              </span>
              <span className="text-label text-text-secondary">{kpi.label}</span>
            </div>
            <div className="flex items-baseline gap-1.5 px-1">
              <span className="text-[28px] font-bold leading-tight tracking-tight text-text-primary font-mono-data">{kpi.value}</span>
              <span className="text-sm text-text-secondary">{kpi.unit}</span>
            </div>
            <div className="px-1">
              <span className={cn('text-[11px]', kpi.extraColor)}>{kpi.extra}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle: Progress Cards */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        {progressItems.map((item) => (
          <div key={item.label} className="rounded-md border border-border-primary bg-bg-card backdrop-blur-sm p-3 flex flex-col gap-2">
            <span className="text-xs text-text-secondary">{item.label}</span>
            <span className="text-xl font-bold text-text-primary font-mono-data">{item.value}%</span>
            <div className="w-full h-1.5 rounded-full bg-[#0f2540] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: Math.min(item.value, 100) + '%', backgroundColor: item.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: Rules Table */}
      <Panel title="预处理规则状态" className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0">
          <DataTable columns={ruleColumns} data={ruleData} rowKey="key" maxHeight="100%" />
        </div>
      </Panel>
    </div>
  )
}

/* ─────────── component ─────────── */
export default function AIModelTab() {
  const [activeTab, setActiveTab] = useState<'modelList' | 'modelDetail' | 'dataQuality'>('modelList')
  const [selectedKey, setSelectedKey] = useState<string>('m1')

  const selectedModel = modelData.find((m) => m.key === selectedKey) ?? modelData[0]

  /* ECharts option for accuracy trend */
  const accuracyChartOption = useMemo(() => ({
    grid: { top: 30, right: 20, bottom: 30, left: 50 },
    xAxis: {
      type: 'category' as const,
      data: accuracyTrendDates,
      axisLine: { lineStyle: { color: '#1a3a5c' } },
      axisLabel: { color: '#5a7a94', fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value' as const,
      min: 90,
      max: 95,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#0f2540', type: 'dashed' as const } },
      axisLabel: { color: '#5a7a94', fontSize: 11, formatter: '{value}%' },
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'rgba(5, 14, 26, 0.95)',
      borderColor: '#00c8ff',
      borderWidth: 1,
      textStyle: { color: '#ffffff', fontSize: 12 },
      formatter: (params: unknown) => {
        const p = Array.isArray(params) ? params[0] : params
        const name = (p as Record<string, unknown>)?.name ?? ''
        const value = (p as Record<string, unknown>)?.value ?? ''
        return `${name}<br/>准确率: <span style="color:#00e5ff;font-weight:bold">${value}%</span>`
      },
    },
    series: [
      {
        data: accuracyTrendValues,
        type: 'line' as const,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#00e5ff', width: 2 },
        itemStyle: { color: '#00e5ff', borderColor: '#0a1a2e', borderWidth: 2 },
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 229, 255, 0.3)' },
              { offset: 1, color: 'rgba(0, 229, 255, 0.02)' },
            ],
          },
        },
        markPoint: {
          data: [
            { type: 'max' as const, name: '最高', itemStyle: { color: '#00ff88' } },
          ],
          label: { color: '#ffffff', fontSize: 10 },
        },
      },
    ],
  }), [])

  // Type helpers for DataTable
  const modelRows = modelData as unknown as Record<string, unknown>[]
  const taskRows = trainTasksData as unknown as Record<string, unknown>[]

  const tabs = [
    { key: 'modelList' as const, label: '模型列表', icon: <List className="w-3.5 h-3.5" /> },
    { key: 'modelDetail' as const, label: '模型详情', icon: <BarChart4 className="w-3.5 h-3.5" /> },
    { key: 'dataQuality' as const, label: '数据质量', icon: <Activity className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        <KPICard
          icon={<Brain className="w-4 h-4" />}
          iconBg="rgba(0,229,255,0.15)"
          label="模型总数"
          value={18}
          unit="个"
          changePercent="2"
          positive={true}
        />
        <KPICard
          icon={<Cpu className="w-4 h-4" />}
          iconBg="rgba(0,255,136,0.15)"
          label="运行中模型"
          value={12}
          unit="个"
          changePercent="1"
          positive={true}
        />
        <KPICard
          icon={<TrendingUp className="w-4 h-4" />}
          iconBg="rgba(170,102,255,0.15)"
          label="平均准确率"
          value={93.6}
          unit="%"
          changePercent="1.2"
          positive={true}
        />
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex items-center gap-1 bg-bg-card border border-border-primary rounded-md p-1 flex-shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all flex-1 justify-center',
              activeTab === tab.key
                ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-panel border border-transparent'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'modelList' && (
          <div className="flex flex-col gap-3 h-full overflow-hidden">
            {/* Main: Model List */}
            <Panel title="模型列表" className="flex-1 min-h-0 flex flex-col">
              <div
                className="flex-1 min-h-0"
                onClick={(e) => {
                  const tr = (e.target as HTMLElement).closest('tr')
                  if (tr) {
                    const idx = Array.from(tr.parentElement?.children ?? []).indexOf(tr)
                    const row = modelData[idx]
                    if (row) {
                      setSelectedKey(row.key)
                      setActiveTab('modelDetail')
                    }
                  }
                }}
              >
                <DataTable
                  columns={[
                    { key: 'name', title: '模型名称', dataIndex: 'name' },
                    { key: 'scene', title: '场景', dataIndex: 'scene' },
                    { key: 'version', title: '当前版本', dataIndex: 'version' },
                    {
                      key: 'status',
                      title: '发布状态',
                      render: (row) => {
                        const m = row as unknown as AIModel
                        return (
                          <span className={cn('px-2 py-0.5 rounded text-xs font-medium border', statusBadge(m.status))}>
                            {m.status}
                          </span>
                        )
                      },
                    },
                    {
                      key: 'accuracy',
                      title: '准确率',
                      render: (row) => {
                        const m = row as unknown as AIModel
                        return <span className="text-xs text-text-data font-mono-data font-semibold">{m.accuracy}</span>
                      },
                    },
                    { key: 'updateTime', title: '更新时间', dataIndex: 'updateTime' },
                  ]}
                  data={modelRows}
                  rowKey="key"
                  maxHeight="100%"
                  className="cursor-pointer"
                />
              </div>
            </Panel>

            {/* Bottom Row */}
            <div className="grid grid-cols-2 gap-3 flex-shrink-0" style={{ maxHeight: 260 }}>
              <Panel title="模型效果趋势" className="flex flex-col">
                <div className="flex-1 min-h-0">
                  <ReactECharts option={accuracyChartOption} style={{ width: '100%', height: '100%' }} opts={{ renderer: 'canvas' }} />
                </div>
              </Panel>
              <Panel
                title="训练任务记录"
                className="flex flex-col"
                rightAction={
                  <button className="flex items-center gap-0.5 text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors">
                    查看更多
                    <ChevronRight className="w-3 h-3" />
                  </button>
                }
              >
                <div className="flex-1 min-h-0">
                  <DataTable
                    columns={[
                      { key: 'taskName', title: '任务名称', dataIndex: 'taskName' },
                      { key: 'modelVersion', title: '模型版本', dataIndex: 'modelVersion' },
                      { key: 'dataSize', title: '训练数据量', dataIndex: 'dataSize' },
                      { key: 'startTime', title: '开始时间', dataIndex: 'startTime' },
                      { key: 'duration', title: '耗时', dataIndex: 'duration' },
                      {
                        key: 'status',
                        title: '状态',
                        render: (row) => {
                          const t = row as unknown as TrainTask
                          return (
                            <span className={cn('flex items-center gap-1.5', taskStatusColor(t.status))}>
                              <Check className="w-3 h-3" />
                              <span className="text-xs font-medium">{t.status}</span>
                            </span>
                          )
                        },
                      },
                    ]}
                    data={taskRows}
                    rowKey="key"
                    maxHeight="100%"
                  />
                </div>
              </Panel>
            </div>
          </div>
        )}

        {activeTab === 'modelDetail' && (
          <div className="flex flex-col gap-3 h-full overflow-hidden">
            <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
              {/* Left: model list (compact) */}
              <Panel title="模型列表" className="col-span-2 flex flex-col">
                <div
                  className="flex-1 min-h-0"
                  onClick={(e) => {
                    const tr = (e.target as HTMLElement).closest('tr')
                    if (tr) {
                      const idx = Array.from(tr.parentElement?.children ?? []).indexOf(tr)
                      const row = modelData[idx]
                      if (row) setSelectedKey(row.key)
                    }
                  }}
                >
                  <DataTable
                    columns={[
                      { key: 'name', title: '模型名称', dataIndex: 'name' },
                      {
                        key: 'status',
                        title: '状态',
                        render: (row) => {
                          const m = row as unknown as AIModel
                          return (
                            <span className={cn('px-2 py-0.5 rounded text-xs font-medium border', statusBadge(m.status))}>
                              {m.status}
                            </span>
                          )
                        },
                      },
                      {
                        key: 'accuracy',
                        title: '准确率',
                        render: (row) => {
                          const m = row as unknown as AIModel
                          return <span className="text-xs text-text-data font-mono-data font-semibold">{m.accuracy}</span>
                        },
                      },
                    ]}
                    data={modelRows}
                    rowKey="key"
                    maxHeight="100%"
                    className="cursor-pointer"
                  />
                </div>
              </Panel>

              {/* Right: Model Detail */}
              <Panel title="模型详情" className="col-span-3 flex flex-col">
                <div className="flex flex-col gap-2.5 overflow-auto custom-scrollbar pr-1">
                  <div className="flex items-center gap-3 bg-bg-panel rounded p-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20">
                      <Brain className="w-5 h-5 text-accent-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text-primary truncate">{selectedModel.name}</h3>
                      <span className="text-xs text-text-tertiary">{selectedModel.scene}</span>
                    </div>
                    <span className={cn('px-2 py-0.5 rounded text-xs font-medium border flex-shrink-0', statusBadge(selectedModel.status))}>
                      {selectedModel.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2 bg-bg-panel rounded p-2.5">
                      <Beaker className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
                      <span className="text-xs text-text-tertiary w-20 flex-shrink-0">模型用途</span>
                      <span className="text-xs text-text-primary">{selectedModel.purpose}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-bg-panel rounded p-2.5">
                      <Database className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
                      <span className="text-xs text-text-tertiary w-20 flex-shrink-0">训练样本数</span>
                      <span className="text-xs text-text-primary font-mono-data">{selectedModel.trainSamples?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-start gap-2 bg-bg-panel rounded p-2.5">
                      <Layers className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-text-tertiary w-20 flex-shrink-0">输入特征</span>
                      <span className="text-xs text-text-primary leading-relaxed">{selectedModel.inputFeatures}</span>
                    </div>
                    <div className="flex items-start gap-2 bg-bg-panel rounded p-2.5">
                      <Tag className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-text-tertiary w-20 flex-shrink-0">输出参数</span>
                      <span className="text-xs text-text-primary leading-relaxed">{selectedModel.outputParams}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-bg-panel rounded p-2.5">
                      <Server className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
                      <span className="text-xs text-text-tertiary w-20 flex-shrink-0">部署环境</span>
                      <span className="text-xs text-text-primary">{selectedModel.deployEnv}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-bg-panel rounded p-2.5">
                      <FileCheck className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
                      <span className="text-xs text-text-tertiary w-20 flex-shrink-0">当前版本</span>
                      <span className="text-xs text-text-data font-mono-data font-medium">{selectedModel.version}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-bg-panel rounded p-2.5">
                      <GitBranch className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
                      <span className="text-xs text-text-tertiary w-20 flex-shrink-0">可回滚版本</span>
                      <span className="text-xs text-text-secondary font-mono-data">{selectedModel.rollbackVersion}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-sm text-accent-cyan hover:bg-accent-cyan/25 transition-colors">
                      <Play className="w-3.5 h-3.5" />
                      发布模型
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-bg-panel border border-border-primary text-sm text-text-secondary hover:border-border-glow hover:text-text-primary transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" />
                      回滚版本
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-bg-panel border border-border-primary text-sm text-text-secondary hover:border-border-glow hover:text-text-primary transition-colors">
                      <BarChart3 className="w-3.5 h-3.5" />
                      查看评估
                    </button>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        )}

        {activeTab === 'dataQuality' && <DataQualityView />}
      </div>
    </div>
  )
}
