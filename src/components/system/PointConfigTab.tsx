import { useState } from 'react'
import {
  Wifi,
  Signal,
  AlertTriangle,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  FolderOpen,
  Folder,
  HardDrive,
  Edit,
  Play,
  Clock,
  CheckCircle2,
  MapPin,
  Database,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import KPICard from '@/components/KPICard'
import Panel from '@/components/Panel'

/* ─── types ─── */
interface TreeNode {
  id: string
  label: string
  type: 'root' | 'system' | 'device'
  children?: TreeNode[]
}

interface Point {
  id: string
  code: string
  name: string
  device: string
  area: string
  dataType: string
  unit: string
  cycle: string
  status: 'online' | 'abnormal'
  protocol: string
  slaveAddr: string
  regAddr: string
  upperLimit: string
  lowerLimit: string
  rwMode: string
  mapped: boolean
  updatedAt: string
}

interface ChangeRecord {
  time: string
  operator: string
  type: '新增' | '编辑' | '删除'
  pointCode: string
  pointName: string
  content: string
  note: string
}

/* ─── demo data ─── */
const TREE_DATA: TreeNode[] = [
  {
    id: 'root',
    label: '城南污水处理厂',
    type: 'root',
    children: [
      {
        id: 'inflow',
        label: '进水系统',
        type: 'system',
        children: [
          { id: 'd01', label: '粗格栅间', type: 'device' },
          { id: 'd02', label: '进水泵房', type: 'device' },
        ],
      },
      {
        id: 'bio',
        label: '生化处理系统',
        type: 'system',
        children: [
          { id: 'd03', label: '厌氧池', type: 'device' },
          { id: 'd04', label: '缺氧池', type: 'device' },
          { id: 'd05', label: '好氧池', type: 'device' },
        ],
      },
      {
        id: 'sediment',
        label: '二沉池系统',
        type: 'system',
        children: [
          { id: 'd06', label: '二沉池1#', type: 'device' },
          { id: 'd07', label: '二沉池2#', type: 'device' },
        ],
      },
      {
        id: 'deep',
        label: '深度处理系统',
        type: 'system',
        children: [
          { id: 'd08', label: '高效沉淀池', type: 'device' },
          { id: 'd09', label: '滤布滤池', type: 'device' },
        ],
      },
      {
        id: 'sludge',
        label: '污泥处理系统',
        type: 'system',
        children: [
          { id: 'd10', label: '污泥浓缩池', type: 'device' },
          { id: 'd11', label: '污泥脱水间', type: 'device' },
        ],
      },
      {
        id: 'outflow',
        label: '出水系统',
        type: 'system',
        children: [
          { id: 'd12', label: '消毒池', type: 'device' },
          { id: 'd13', label: '出水计量槽', type: 'device' },
        ],
      },
    ],
  },
]

const POINTS: Point[] = [
  { id: '1', code: 'PT010101', name: '进水流量', device: '进水泵房', area: '进水系统', dataType: '瞬时值', unit: 'm³/h', cycle: '5s', status: 'online', protocol: 'Modbus TCP', slaveAddr: '1', regAddr: '40001', upperLimit: '50000', lowerLimit: '0', rwMode: '只读', mapped: true, updatedAt: '2024-06-15 14:30:00' },
  { id: '2', code: 'PT010102', name: '进水COD', device: '进水泵房', area: '进水系统', dataType: '瞬时值', unit: 'mg/L', cycle: '30s', status: 'online', protocol: 'Modbus TCP', slaveAddr: '1', regAddr: '40002', upperLimit: '800', lowerLimit: '0', rwMode: '只读', mapped: true, updatedAt: '2024-06-15 14:29:55' },
  { id: '3', code: 'PT010103', name: '进水氨氮', device: '进水泵房', area: '进水系统', dataType: '瞬时值', unit: 'mg/L', cycle: '30s', status: 'online', protocol: 'Modbus TCP', slaveAddr: '1', regAddr: '40003', upperLimit: '100', lowerLimit: '0', rwMode: '只读', mapped: true, updatedAt: '2024-06-15 14:29:50' },
  { id: '4', code: 'LT020101', name: '厌氧池液位', device: '厌氧池', area: '生化处理系统', dataType: '瞬时值', unit: 'm', cycle: '10s', status: 'online', protocol: 'Modbus TCP', slaveAddr: '2', regAddr: '40010', upperLimit: '8.5', lowerLimit: '2.0', rwMode: '只读', mapped: true, updatedAt: '2024-06-15 14:30:05' },
  { id: '5', code: 'DO020201', name: '好氧池DO', device: '好氧池', area: '生化处理系统', dataType: '瞬时值', unit: 'mg/L', cycle: '5s', status: 'online', protocol: 'Modbus TCP', slaveAddr: '2', regAddr: '40020', upperLimit: '6.0', lowerLimit: '1.0', rwMode: '读写', mapped: true, updatedAt: '2024-06-15 14:30:08' },
  { id: '6', code: 'PH020201', name: '好氧池pH', device: '好氧池', area: '生化处理系统', dataType: '瞬时值', unit: '-', cycle: '10s', status: 'online', protocol: 'Modbus TCP', slaveAddr: '2', regAddr: '40021', upperLimit: '9.0', lowerLimit: '6.0', rwMode: '只读', mapped: true, updatedAt: '2024-06-15 14:30:02' },
  { id: '7', code: 'MLSS020201', name: '好氧池MLSS', device: '好氧池', area: '生化处理系统', dataType: '瞬时值', unit: 'mg/L', cycle: '30s', status: 'abnormal', protocol: 'Modbus TCP', slaveAddr: '2', regAddr: '40022', upperLimit: '5000', lowerLimit: '1500', rwMode: '只读', mapped: true, updatedAt: '2024-06-15 14:25:30' },
  { id: '8', code: 'LT030101', name: '二沉池液位', device: '二沉池1#', area: '二沉池系统', dataType: '瞬时值', unit: 'm', cycle: '10s', status: 'online', protocol: 'Modbus TCP', slaveAddr: '3', regAddr: '40030', upperLimit: '5.0', lowerLimit: '1.0', rwMode: '只读', mapped: true, updatedAt: '2024-06-15 14:30:01' },
  { id: '9', code: 'NT030102', name: '二沉池浓度', device: '二沉池1#', area: '二沉池系统', dataType: '瞬时值', unit: 'mg/L', cycle: '30s', status: 'online', protocol: 'Modbus TCP', slaveAddr: '3', regAddr: '40031', upperLimit: '30', lowerLimit: '5', rwMode: '只读', mapped: true, updatedAt: '2024-06-15 14:29:45' },
  { id: '10', code: 'OQ030201', name: '出水流量', device: '出水计量槽', area: '出水系统', dataType: '瞬时值', unit: 'm³/h', cycle: '5s', status: 'online', protocol: 'Modbus TCP', slaveAddr: '4', regAddr: '40040', upperLimit: '50000', lowerLimit: '0', rwMode: '只读', mapped: true, updatedAt: '2024-06-15 14:30:10' },
  { id: '11', code: 'COD030202', name: '出水COD', device: '出水计量槽', area: '出水系统', dataType: '瞬时值', unit: 'mg/L', cycle: '30s', status: 'online', protocol: 'Modbus TCP', slaveAddr: '4', regAddr: '40041', upperLimit: '50', lowerLimit: '0', rwMode: '只读', mapped: true, updatedAt: '2024-06-15 14:29:40' },
  { id: '12', code: 'UV030301', name: '消毒紫外强度', device: '消毒池', area: '出水系统', dataType: '瞬时值', unit: 'mW/cm²', cycle: '10s', status: 'abnormal', protocol: 'Modbus TCP', slaveAddr: '4', regAddr: '40050', upperLimit: '40', lowerLimit: '20', rwMode: '只读', mapped: true, updatedAt: '2024-06-15 14:20:15' },
]

const CHANGE_RECORDS: ChangeRecord[] = [
  { time: '2024-06-15 14:30:00', operator: 'admin', type: '编辑', pointCode: 'DO020201', pointName: '好氧池DO', content: '上限值从5.0调整为6.0', note: '工艺优化需求' },
  { time: '2024-06-15 11:15:22', operator: 'eng01', type: '新增', pointCode: 'UV030301', pointName: '消毒紫外强度', content: '新增点位配置', note: '新增消毒监测点' },
  { time: '2024-06-14 16:45:10', operator: 'admin', type: '删除', pointCode: 'TMP010201', pointName: '进水温度', content: '删除冗余点位', note: '传感器已拆除' },
]

/* ─── component ─── */
export default function PointConfigTab() {
  const [selectedPointId, setSelectedPointId] = useState<string>('5')
  const [treeSearch, setTreeSearch] = useState('')
  const [pointSearch, setPointSearch] = useState('')
  const [areaFilter, setAreaFilter] = useState('全部')
  const [typeFilter, setTypeFilter] = useState('全部')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['root', 'inflow', 'bio', 'sediment']))
  const [pointPage, setPointPage] = useState(1)

  const selectedPoint = POINTS.find((p) => p.id === selectedPointId) || POINTS[0]

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedIds(next)
  }

  /* filter points */
  const filteredPoints = POINTS.filter((p) => {
    const matchSearch =
      pointSearch === '' ||
      p.code.toLowerCase().includes(pointSearch.toLowerCase()) ||
      p.name.includes(pointSearch)
    const matchArea = areaFilter === '全部' || p.area === areaFilter
    const matchType = typeFilter === '全部' || p.dataType === typeFilter
    return matchSearch && matchArea && matchType
  })

  /* tree render */
  const renderTreeNode = (node: TreeNode, depth = 0) => {
    const isExpanded = expandedIds.has(node.id)
    const hasChildren = !!node.children && node.children.length > 0
    const isRoot = node.type === 'root'
    const indent = depth * 14

    /* filter: if search term, show matching nodes */
    const matchesSearch =
      treeSearch === '' || node.label.includes(treeSearch)

    /* if a parent matches, show all children */
    const shouldRender = matchesSearch || (hasChildren && node.children!.some((c) => c.label.includes(treeSearch) || (c.children && c.children.some((gc) => gc.label.includes(treeSearch)))))

    if (!shouldRender && treeSearch !== '') return null

    return (
      <div key={node.id}>
        <button
          onClick={() => {
            if (hasChildren) toggleExpand(node.id)
          }}
          className={cn(
            'w-full flex items-center gap-1 py-1.5 px-2 rounded transition-colors text-left',
            isRoot ? 'text-text-primary font-medium' : 'text-text-secondary',
            'hover:bg-bg-panel-hover'
          )}
          style={{ paddingLeft: 8 + indent }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-3 h-3 text-text-tertiary flex-shrink-0" />
            ) : (
              <ChevronRightIcon className="w-3 h-3 text-text-tertiary flex-shrink-0" />
            )
          ) : (
            <span className="w-3 flex-shrink-0" />
          )}

          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="w-3.5 h-3.5 text-accent-cyan flex-shrink-0" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-accent-cyan-dim flex-shrink-0" />
            )
          ) : (
            <HardDrive className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
          )}

          <span className="text-xs truncate">{node.label}</span>
        </button>

        {hasChildren && isExpanded && node.children!.map((child) => renderTreeNode(child, depth + 1))}
      </div>
    )
  }

  const areaOptions = ['全部', ...Array.from(new Set(POINTS.map((p) => p.area)))]
  const typeOptions = ['全部', ...Array.from(new Set(POINTS.map((p) => p.dataType)))]

  return (
    <div className="flex flex-col h-full gap-3 p-4 overflow-hidden">
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        <KPICard
          icon={<Database className="w-4 h-4 text-white" />}
          iconBg="rgba(0, 229, 255, 0.2)"
          label="采集点总数"
          value={256}
          unit="个"
          changePercent="0"
          positive={true}
        />
        <KPICard
          icon={<Wifi className="w-4 h-4 text-white" />}
          iconBg="rgba(0, 255, 136, 0.2)"
          label="在线点位"
          value={221}
          unit="个"
          changePercent="86.3%"
          positive={true}
        />
        <KPICard
          icon={<AlertTriangle className="w-4 h-4 text-white" />}
          iconBg="rgba(255, 68, 68, 0.2)"
          label="异常点位"
          value={35}
          unit="个"
          changePercent="13.7%"
          positive={false}
        />
      </div>

      {/* ── 3-column layout ── */}
      <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Left: Plant Structure Tree */}
        <div className="col-span-3 flex flex-col gap-3 min-h-0">
          <Panel title="厂区结构" className="flex-1 min-h-0">
            {/* search */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center flex-1 gap-1.5 px-2 py-1.5 rounded border border-border-primary bg-bg-primary">
                <Search className="w-3 h-3 text-text-tertiary flex-shrink-0" />
                <input
                  type="text"
                  value={treeSearch}
                  onChange={(e) => setTreeSearch(e.target.value)}
                  placeholder="搜索区域或设备"
                  className="bg-transparent text-xs text-text-primary placeholder:text-text-tertiary outline-none w-full"
                />
              </div>
            </div>

            {/* tree */}
            <div className="flex-1 overflow-auto custom-scrollbar">
              {TREE_DATA.map((node) => renderTreeNode(node))}
            </div>
          </Panel>
        </div>

        {/* Middle: Point List */}
        <div className="col-span-5 flex flex-col gap-3 min-h-0">
          <Panel
            title="点位列表"
            rightAction={
              <button className="flex items-center gap-1 px-2.5 py-1 rounded bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs hover:bg-accent-cyan/20 transition-colors">
                <Plus className="w-3 h-3" />
                新增点位
              </button>
            }
            className="flex-1 min-h-0"
          >
            {/* filters */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center flex-1 gap-1.5 px-2 py-1.5 rounded border border-border-primary bg-bg-primary">
                <Search className="w-3 h-3 text-text-tertiary flex-shrink-0" />
                <input
                  type="text"
                  value={pointSearch}
                  onChange={(e) => setPointSearch(e.target.value)}
                  placeholder="搜索点位编码/名称"
                  className="bg-transparent text-xs text-text-primary placeholder:text-text-tertiary outline-none w-full"
                />
              </div>
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="px-2 py-1.5 rounded border border-border-primary bg-bg-primary text-xs text-text-primary outline-none cursor-pointer"
              >
                {areaOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2 py-1.5 rounded border border-border-primary bg-bg-primary text-xs text-text-primary outline-none cursor-pointer"
              >
                {typeOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* point table */}
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full border-collapse text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[rgba(15,37,64,0.8)]">
                    {['点位编码', '点位名称', '所属设备', '数据类型', '采集周期', '状态'].map((h) => (
                      <th key={h} className="text-left px-2 py-1.5 text-text-secondary font-medium border-b border-border-subtle whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPoints.map((pt, idx) => (
                    <tr
                      key={pt.id}
                      onClick={() => setSelectedPointId(pt.id)}
                      className={cn(
                        'transition-colors duration-200 cursor-pointer',
                        selectedPointId === pt.id ? 'bg-bg-active' : idx % 2 === 0 ? 'bg-[#0a1a2e]' : 'bg-[#0d1f35]',
                        selectedPointId !== pt.id && 'hover:bg-bg-panel-hover'
                      )}
                      style={{ height: 36 }}
                    >
                      <td className="px-2 py-1.5 text-accent-cyan font-mono-data whitespace-nowrap">{pt.code}</td>
                      <td className="px-2 py-1.5 text-text-primary whitespace-nowrap">{pt.name}</td>
                      <td className="px-2 py-1.5 text-text-secondary whitespace-nowrap">{pt.device}</td>
                      <td className="px-2 py-1.5 text-text-secondary whitespace-nowrap">{pt.dataType}</td>
                      <td className="px-2 py-1.5 text-text-secondary whitespace-nowrap">{pt.cycle}</td>
                      <td className="px-2 py-1.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <Activity className={cn('w-3 h-3', pt.status === 'online' ? 'text-status-normal' : 'text-status-danger')} />
                          <span className={pt.status === 'online' ? 'text-status-normal' : 'text-status-danger'}>
                            {pt.status === 'online' ? '在线' : '异常'}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="flex items-center justify-between pt-2 border-t border-border-subtle mt-2">
              <span className="text-[10px] text-text-tertiary">共256条</span>
              <div className="flex items-center gap-1">
                <button className="p-0.5 rounded hover:bg-white/5 text-text-tertiary"><ChevronLeft className="w-3 h-3" /></button>
                <button className="p-0.5 rounded hover:bg-white/5 text-text-tertiary"><ChevronLeft className="w-3 h-3" /></button>
                {[1, 2, 3, 4, 5].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPointPage(p)}
                    className={cn(
                      'w-5 h-5 rounded text-[10px] font-medium transition-colors',
                      pointPage === p ? 'bg-accent-cyan/20 text-accent-cyan' : 'text-text-secondary hover:bg-white/5'
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button className="p-0.5 rounded hover:bg-white/5 text-text-tertiary"><ChevronRight className="w-3 h-3" /></button>
                <button className="p-0.5 rounded hover:bg-white/5 text-text-tertiary"><ChevronRight className="w-3 h-3" /></button>
                <span className="text-[10px] text-text-tertiary ml-1">10条/页</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right: Point Detail */}
        <div className="col-span-4 flex flex-col gap-3 min-h-0">
          <Panel title="点位详情" className="flex-1 min-h-0">
            <div className="flex flex-col h-full overflow-auto custom-scrollbar">
              {/* header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border-subtle">
                <div className="w-10 h-10 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center flex-shrink-0">
                  <Signal className="w-5 h-5 text-accent-cyan" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary font-mono-data">{selectedPoint.code}</span>
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded text-[10px] font-medium border',
                        selectedPoint.status === 'online'
                          ? 'bg-status-normal/10 text-status-normal border-status-normal/20'
                          : 'bg-status-danger/10 text-status-danger border-status-danger/20'
                      )}
                    >
                      {selectedPoint.status === 'online' ? '在线' : '异常'}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary">{selectedPoint.name}</span>
                </div>
              </div>

              {/* detail fields */}
              <div className="space-y-1.5">
                {[
                  { label: '点位编码', value: selectedPoint.code, icon: <Database className="w-3 h-3" /> },
                  { label: '点位名称', value: selectedPoint.name, icon: <TagIcon /> },
                  { label: '所属设备', value: selectedPoint.device, icon: <HardDrive className="w-3 h-3" /> },
                  { label: '所属区域', value: selectedPoint.area, icon: <MapPin className="w-3 h-3" /> },
                  { label: '数据类型', value: selectedPoint.dataType, icon: <Activity className="w-3 h-3" /> },
                  { label: '数据单位', value: selectedPoint.unit, icon: <UnitIcon /> },
                  { label: '数据来源协议', value: selectedPoint.protocol, icon: <Wifi className="w-3 h-3" /> },
                  { label: '从站地址', value: selectedPoint.slaveAddr, icon: <AddrIcon /> },
                  { label: '寄存器地址', value: selectedPoint.regAddr, icon: <AddrIcon /> },
                  { label: '上限值', value: selectedPoint.upperLimit, icon: <LimitIcon upper /> },
                  { label: '下限值', value: selectedPoint.lowerLimit, icon: <LimitIcon /> },
                  { label: '读写模式', value: selectedPoint.rwMode, icon: <Edit className="w-3 h-3" /> },
                  {
                    label: '映射状态',
                    value: (
                      <span className="inline-flex items-center gap-1 text-status-normal">
                        <CheckCircle2 className="w-3 h-3" />
                        {selectedPoint.mapped ? '已映射' : '未映射'}
                      </span>
                    ),
                    icon: <CheckCircle2 className="w-3 h-3" />,
                  },
                  { label: '更新时间', value: selectedPoint.updatedAt, icon: <Clock className="w-3 h-3" /> },
                ].map((field) => (
                  <div key={field.label} className="flex items-start justify-between py-1">
                    <span className="inline-flex items-center gap-1 text-xs text-text-tertiary flex-shrink-0">
                      <span className="text-text-tertiary">{field.icon}</span>
                      {field.label}
                    </span>
                    <span className="text-xs text-text-primary text-right ml-2">
                      {typeof field.value === 'string' ? field.value : field.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* action buttons */}
              <div className="flex items-center gap-2 mt-auto pt-3">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs hover:bg-accent-cyan/20 transition-colors flex-1 justify-center">
                  <Edit className="w-3 h-3" /> 编辑点位
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-bg-panel-hover border border-border-primary text-text-secondary text-xs hover:bg-bg-active transition-colors flex-1 justify-center">
                  <Play className="w-3 h-3" /> 测试连接
                </button>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Bottom: Change Records ── */}
      <div className="flex-shrink-0" style={{ height: 160 }}>
        <Panel title="点位配置变更记录" className="h-full">
          <div className="overflow-auto custom-scrollbar h-full">
            <table className="w-full border-collapse text-xs">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[rgba(15,37,64,0.8)]">
                  {['变更时间', '操作人', '操作类型', '点位编码', '点位名称', '变更内容', '备注'].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-text-secondary font-medium border-b border-border-subtle whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHANGE_RECORDS.map((rec, idx) => (
                  <tr
                    key={idx}
                    className={cn(
                      'transition-colors duration-200 hover:bg-bg-panel-hover',
                      idx % 2 === 0 ? 'bg-[#0a1a2e]' : 'bg-[#0d1f35]'
                    )}
                    style={{ height: 36 }}
                  >
                    <td className="px-3 py-1.5 text-text-secondary whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-text-tertiary" />
                        {rec.time}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-text-primary whitespace-nowrap">{rec.operator}</td>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[10px] font-medium border',
                          rec.type === '新增'
                            ? 'bg-status-normal/10 text-status-normal border-status-normal/20'
                            : rec.type === '编辑'
                            ? 'bg-status-warning/10 text-status-warning border-status-warning/20'
                            : 'bg-status-danger/10 text-status-danger border-status-danger/20'
                        )}
                      >
                        {rec.type}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-accent-cyan font-mono-data whitespace-nowrap">{rec.pointCode}</td>
                    <td className="px-3 py-1.5 text-text-primary whitespace-nowrap">{rec.pointName}</td>
                    <td className="px-3 py-1.5 text-text-secondary whitespace-nowrap">{rec.content}</td>
                    <td className="px-3 py-1.5 text-text-tertiary whitespace-nowrap">{rec.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  )
}

/* ─── mini icon helpers ─── */
function TagIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  )
}
function UnitIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
    </svg>
  )
}
function AddrIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  )
}
function LimitIcon({ upper }: { upper?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {upper ? (
        <>
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </>
      ) : (
        <>
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </>
      )}
    </svg>
  )
}
