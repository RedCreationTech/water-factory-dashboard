import { useState } from 'react'
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  FolderOpen,
  Folder,
  Edit,
  Copy,
  Ban,
  Clock,
  UserCircle,
  Link2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import KPICard from '@/components/KPICard'
import Panel from '@/components/Panel'

/* ─── data types ─── */
interface Role {
  id: number
  name: string
  description: string
  userCount: number
  dataScope: string
  status: 'enabled' | 'disabled'
  level: string
  createdAt: string
  creator: string
  approvalStatus: string
  lastUpdated: string
  users: string[]
}

interface RoleChangeLog {
  time: string
  operator: string
  roleName: string
  change: string
  scope: string
  result: string
}

/* ─── demo data ─── */
const ROLES: Role[] = [
  { id: 1, name: '超级管理员', description: '系统最高权限，可管理所有模块', userCount: 2, dataScope: '全部数据', status: 'enabled', level: 'L1', createdAt: '2023-01-10', creator: 'system', approvalStatus: '已审批', lastUpdated: '2024-06-15', users: ['admin', 'boss'] },
  { id: 2, name: '系统管理员', description: '负责系统配置与用户管理', userCount: 4, dataScope: '全部数据', status: 'enabled', level: 'L2', createdAt: '2023-02-05', creator: 'admin', approvalStatus: '已审批', lastUpdated: '2024-06-10', users: ['sys01', 'sys02', 'sys03', 'sys04'] },
  { id: 3, name: '厂区管理员', description: '管理指定厂区的全部业务', userCount: 6, dataScope: '城南污水处理厂', status: 'enabled', level: 'L3', createdAt: '2023-03-12', creator: 'admin', approvalStatus: '已审批', lastUpdated: '2024-06-14', users: ['mgr01', 'mgr02', 'mgr03', 'mgr04', 'mgr05', 'mgr06'] },
  { id: 4, name: '工艺工程师', description: '工艺参数优化与调整', userCount: 8, dataScope: '工艺相关数据', status: 'enabled', level: 'L4', createdAt: '2023-04-20', creator: 'admin', approvalStatus: '已审批', lastUpdated: '2024-06-12', users: ['eng01', 'eng02', 'eng03', 'eng04', 'eng05', 'eng06', 'eng07', 'eng08'] },
  { id: 5, name: '设备工程师', description: '设备运维与故障处理', userCount: 7, dataScope: '设备相关数据', status: 'enabled', level: 'L4', createdAt: '2023-05-08', creator: 'admin', approvalStatus: '已审批', lastUpdated: '2024-06-13', users: ['dev01', 'dev02', 'dev03', 'dev04', 'dev05', 'dev06', 'dev07'] },
  { id: 6, name: '值班人员', description: '日常监控与巡检', userCount: 12, dataScope: '本班次数据', status: 'enabled', level: 'L5', createdAt: '2023-06-01', creator: 'mgr01', approvalStatus: '已审批', lastUpdated: '2024-06-14', users: ['duty01', 'duty02', 'duty03', 'duty04', 'duty05', 'duty06', 'duty07', 'duty08', 'duty09', 'duty10', 'duty11', 'duty12'] },
  { id: 7, name: '数据分析员', description: '数据统计与报表分析', userCount: 4, dataScope: '报表中心数据', status: 'enabled', level: 'L5', createdAt: '2023-07-15', creator: 'mgr01', approvalStatus: '已审批', lastUpdated: '2024-06-11', users: ['analyst01', 'analyst02', 'analyst03', 'analyst04'] },
  { id: 8, name: '访客', description: '只读访问权限', userCount: 3, dataScope: '公开数据', status: 'disabled', level: 'L6', createdAt: '2023-08-01', creator: 'admin', approvalStatus: '已审批', lastUpdated: '2024-05-20', users: ['guest01', 'guest02', 'guest03'] },
]

const CHANGE_LOGS: RoleChangeLog[] = [
  { time: '2024-06-15 14:32:05', operator: 'admin', roleName: '值班人员', change: '移除设备管理查看权限', scope: '模块权限', result: '成功' },
  { time: '2024-06-15 10:18:22', operator: 'mgr01', roleName: '工艺工程师', change: '新增数据导出权限', scope: '操作权限', result: '成功' },
  { time: '2024-06-14 16:45:10', operator: 'admin', roleName: '厂区管理员', change: '数据范围调整为城南+城东', scope: '数据权限', result: '成功' },
  { time: '2024-06-14 09:30:00', operator: 'system', roleName: '数据分析员', change: '新增智能报表查看权限', scope: '模块权限', result: '成功' },
  { time: '2024-06-13 11:20:35', operator: 'admin', roleName: '访客', change: '停用角色', scope: '角色状态', result: '成功' },
]

/* ─── module permission tree data ─── */
interface PermNode {
  key: string
  label: string
  checked?: boolean
  children?: PermNode[]
  perms?: { view: boolean; add: boolean; edit: boolean; del: boolean; export: boolean }
}

const MODULE_PERMS: PermNode[] = [
  { key: 'home', label: '系统首页', checked: true, perms: { view: true, add: false, edit: false, del: false, export: false } },
  { key: 'monitor', label: '实时监控', checked: true, perms: { view: true, add: false, edit: false, del: false, export: true } },
  {
    key: 'process', label: '工艺管理', checked: true, children: [
      { key: 'p1', label: '工艺运行总览', checked: true, perms: { view: true, add: false, edit: false, del: false, export: true } },
      { key: 'p2', label: '工艺指标监控', checked: true, perms: { view: true, add: false, edit: true, del: false, export: true } },
      { key: 'p3', label: '工艺报表分析', checked: true, perms: { view: true, add: false, edit: false, del: false, export: true } },
      { key: 'p4', label: '工艺优化建议', checked: true, perms: { view: true, add: true, edit: true, del: true, export: true } },
    ],
  },
  {
    key: 'equip', label: '设备管理', checked: true, children: [
      { key: 'e1', label: '设备运行监控', checked: true, perms: { view: true, add: false, edit: false, del: false, export: true } },
      { key: 'e2', label: '设备台账管理', checked: true, perms: { view: true, add: true, edit: true, del: false, export: true } },
      { key: 'e3', label: '设备维保管理', checked: true, perms: { view: true, add: true, edit: true, del: true, export: true } },
    ],
  },
  { key: 'alarm', label: '告警管理', checked: true, perms: { view: true, add: true, edit: true, del: true, export: true } },
  { key: 'report', label: '报表中心', checked: true, perms: { view: true, add: true, edit: true, del: false, export: true } },
]

/* ─── helper: permission matrix for leaf nodes ─── */
const PERM_LABELS = [
  { key: 'view', label: '查看' },
  { key: 'add', label: '新增' },
  { key: 'edit', label: '编辑' },
  { key: 'del', label: '删除' },
  { key: 'export', label: '导出' },
] as const

export default function RolePermissionTab() {
  const [selectedRoleId, setSelectedRoleId] = useState<number>(3)
  const [roleSearch, setRoleSearch] = useState('')
  const [permTab, setPermTab] = useState<'module' | 'data' | 'operation'>('module')
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(['process', 'equip']))
  const [page, setPage] = useState(1)

  const selectedRole = ROLES.find((r) => r.id === selectedRoleId) || ROLES[0]

  const filteredRoles = ROLES.filter(
    (r) =>
      r.name.includes(roleSearch) || r.description.includes(roleSearch)
  )

  const toggleExpand = (key: string) => {
    const next = new Set(expandedKeys)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setExpandedKeys(next)
  }

  /* ─── expand all for render ─── */
  const renderPermNode = (node: PermNode, depth = 0) => {
    const isExpanded = expandedKeys.has(node.key)
    const hasChildren = !!node.children && node.children.length > 0
    const indent = depth * 18

    return (
      <div key={node.key}>
        {/* node row */}
        <div
          className={cn(
            'flex items-center gap-1 py-1.5 px-2 rounded transition-colors hover:bg-bg-panel-hover',
            depth === 0 && 'font-medium'
          )}
          style={{ paddingLeft: 8 + indent }}
        >
          {/* expand toggle */}
          <button
            onClick={() => hasChildren && toggleExpand(node.key)}
            className={cn(
              'w-4 h-4 flex items-center justify-center text-text-tertiary transition-transform',
              !hasChildren && 'invisible'
            )}
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRightIcon className="w-3 h-3" />}
          </button>

          {/* folder / checkbox icon */}
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="w-3.5 h-3.5 text-accent-cyan flex-shrink-0" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-accent-cyan-dim flex-shrink-0" />
            )
          ) : node.checked ? (
            <Check className="w-3.5 h-3.5 text-accent-cyan flex-shrink-0" />
          ) : (
            <Minus className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
          )}

          <span className={cn('text-xs flex-1', node.checked ? 'text-text-primary' : 'text-text-secondary')}>
            {node.label}
          </span>

          {/* permission cells for leaf nodes */}
          {!hasChildren && node.perms && (
            <div className="flex items-center gap-0">
              {PERM_LABELS.map((p) => {
                const val = node.perms![p.key as keyof typeof node.perms]
                return (
                  <span
                    key={p.key}
                    className={cn(
                      'w-8 text-center text-[10px] select-none',
                      val ? 'text-accent-cyan' : 'text-text-tertiary'
                    )}
                    title={p.label}
                  >
                    {val ? '✓' : '-'}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* children */}
        {hasChildren && isExpanded && node.children!.map((child) => renderPermNode(child, depth + 1))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-3 p-4 overflow-hidden">
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        <KPICard
          icon={<Users className="w-4 h-4 text-white" />}
          iconBg="rgba(0, 229, 255, 0.2)"
          label="角色总数"
          value={8}
          unit="个"
          changePercent="1"
          positive={true}
        />
        <KPICard
          icon={<ShieldCheck className="w-4 h-4 text-white" />}
          iconBg="rgba(0, 255, 136, 0.2)"
          label="已分配用户"
          value={36}
          unit="人"
          changePercent="4"
          positive={true}
        />
        <KPICard
          icon={<ShieldAlert className="w-4 h-4 text-white" />}
          iconBg="rgba(255, 68, 68, 0.2)"
          label="高权限角色"
          value={2}
          unit="个"
          changePercent="25%"
          positive={false}
        />
      </div>

      {/* ── 3-column layout ── */}
      <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Left: Role List */}
        <div className="col-span-4 flex flex-col gap-3 min-h-0">
          <Panel
            title="角色列表"
            rightAction={
              <button className="flex items-center gap-1 px-2.5 py-1 rounded bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs hover:bg-accent-cyan/20 transition-colors">
                <Plus className="w-3 h-3" />
                新建角色
              </button>
            }
            className="flex-1 min-h-0"
          >
            {/* search */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center flex-1 gap-1.5 px-2 py-1.5 rounded border border-border-primary bg-bg-primary">
                <Search className="w-3 h-3 text-text-tertiary flex-shrink-0" />
                <input
                  type="text"
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  placeholder="搜索角色名称"
                  className="bg-transparent text-xs text-text-primary placeholder:text-text-tertiary outline-none w-full"
                />
              </div>
            </div>

            {/* role table */}
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full border-collapse text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[rgba(15,37,64,0.8)]">
                    {['角色名称', '角色描述', '用户数', '数据范围', '状态'].map((h) => (
                      <th key={h} className="text-left px-2 py-1.5 text-text-secondary font-medium border-b border-border-subtle whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.map((role, idx) => (
                    <tr
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={cn(
                        'transition-colors duration-200 cursor-pointer',
                        selectedRoleId === role.id ? 'bg-bg-active' : idx % 2 === 0 ? 'bg-[#0a1a2e]' : 'bg-[#0d1f35]',
                        selectedRoleId !== role.id && 'hover:bg-bg-panel-hover'
                      )}
                      style={{ height: 36 }}
                    >
                      <td className="px-2 py-1.5 text-text-primary font-medium whitespace-nowrap">{role.name}</td>
                      <td className="px-2 py-1.5 text-text-secondary whitespace-nowrap max-w-[100px] truncate">{role.description}</td>
                      <td className="px-2 py-1.5 text-text-data font-mono-data whitespace-nowrap">{role.userCount}</td>
                      <td className="px-2 py-1.5 text-text-secondary whitespace-nowrap max-w-[100px] truncate">{role.dataScope}</td>
                      <td className="px-2 py-1.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              role.status === 'enabled' ? 'bg-status-normal' : 'bg-status-offline'
                            )}
                          />
                          <span className={role.status === 'enabled' ? 'text-status-normal' : 'text-status-offline'}>
                            {role.status === 'enabled' ? '启用' : '停用'}
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
              <span className="text-[10px] text-text-tertiary">共 {filteredRoles.length} 条</span>
              <div className="flex items-center gap-1">
                <button className="p-0.5 rounded hover:bg-white/5 text-text-tertiary"><ChevronLeft className="w-3 h-3" /></button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-5 h-5 rounded text-[10px] font-medium transition-colors',
                      page === p ? 'bg-accent-cyan/20 text-accent-cyan' : 'text-text-secondary hover:bg-white/5'
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button className="p-0.5 rounded hover:bg-white/5 text-text-tertiary"><ChevronRight className="w-3 h-3" /></button>
                <span className="text-[10px] text-text-tertiary ml-1">10条/页</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* Middle: Permission Config */}
        <div className="col-span-4 flex flex-col gap-3 min-h-0">
          <Panel
            title="权限配置"
            rightAction={
              <span className="text-xs text-text-secondary">
                已选择角色:
                <span className="text-accent-cyan ml-1 font-medium">{selectedRole.name}</span>
              </span>
            }
            className="flex-1 min-h-0"
          >
            {/* sub-tabs */}
            <div className="flex items-center gap-1 mb-2 border-b border-border-subtle">
              {([
                { key: 'module', label: '模块权限' },
                { key: 'data', label: '数据权限' },
                { key: 'operation', label: '操作权限' },
              ] as const).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setPermTab(t.key)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium transition-colors relative',
                    permTab === t.key ? 'text-accent-cyan' : 'text-text-tertiary hover:text-text-secondary'
                  )}
                >
                  {t.label}
                  {permTab === t.key && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-10 bg-accent-cyan rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* permission tree */}
            {permTab === 'module' && (
              <div className="flex-1 overflow-auto custom-scrollbar">
                {/* header row */}
                <div className="flex items-center gap-1 py-1 px-2 text-[10px] text-text-tertiary border-b border-border-subtle">
                  <span className="flex-1 pl-6">模块名称</span>
                  <div className="flex items-center gap-0">
                    {PERM_LABELS.map((p) => (
                      <span key={p.key} className="w-8 text-center">{p.label}</span>
                    ))}
                  </div>
                </div>
                {MODULE_PERMS.map((node) => renderPermNode(node))}

                {/* note */}
                <div className="mt-2 px-2 py-1.5 rounded bg-bg-primary/60 border border-border-subtle">
                  <p className="text-[10px] text-text-tertiary leading-relaxed">
                    说明：蓝色 ✓ 为已授权，灰色 - 为未授权，部分权限受数据范围限制。
                  </p>
                </div>
              </div>
            )}

            {permTab === 'data' && (
              <div className="flex-1 overflow-auto custom-scrollbar px-2">
                <div className="space-y-2 py-2">
                  <div className="flex items-center justify-between py-2 px-3 rounded bg-bg-panel-hover">
                    <span className="text-xs text-text-primary">数据范围</span>
                    <span className="text-xs text-accent-cyan">{selectedRole.dataScope}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 rounded bg-bg-panel-hover">
                    <span className="text-xs text-text-primary">跨厂区访问</span>
                    <span className="text-xs text-status-danger">禁止</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 rounded bg-bg-panel-hover">
                    <span className="text-xs text-text-primary">历史数据范围</span>
                    <span className="text-xs text-text-secondary">最近 90 天</span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 rounded bg-bg-panel-hover">
                    <span className="text-xs text-text-primary">敏感数据脱敏</span>
                    <span className="text-xs text-status-normal">启用</span>
                  </div>
                </div>
              </div>
            )}

            {permTab === 'operation' && (
              <div className="flex-1 overflow-auto custom-scrollbar px-2">
                <div className="space-y-2 py-2">
                  {['参数设定', '远程控制', '批量导出', '系统配置', '用户管理', '审批操作'].map((op) => (
                    <div key={op} className="flex items-center justify-between py-2 px-3 rounded bg-bg-panel-hover">
                      <span className="text-xs text-text-primary">{op}</span>
                      <span className={cn(
                        'text-xs',
                        ['参数设定', '远程控制', '系统配置'].includes(op)
                          ? (selectedRole.level <= 'L3' ? 'text-status-normal' : 'text-status-danger')
                          : (selectedRole.level <= 'L4' ? 'text-status-normal' : 'text-status-danger')
                      )}>
                        {(['参数设定', '远程控制', '系统配置'].includes(op)
                          ? (selectedRole.level <= 'L3' ? '允许' : '禁止')
                          : (selectedRole.level <= 'L4' ? '允许' : '禁止')
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Panel>
        </div>

        {/* Right: Role Details */}
        <div className="col-span-4 flex flex-col gap-3 min-h-0">
          <Panel title="角色详情" className="flex-1 min-h-0">
            <div className="flex flex-col h-full overflow-auto custom-scrollbar">
              {/* avatar + name */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border-subtle">
                <div className="w-12 h-12 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center flex-shrink-0">
                  <UserCircle className="w-6 h-6 text-accent-cyan" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-text-primary">{selectedRole.name}</span>
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded text-[10px] font-medium',
                        selectedRole.status === 'enabled'
                          ? 'bg-status-normal/10 text-status-normal border border-status-normal/20'
                          : 'bg-status-offline/10 text-status-offline border border-status-offline/20'
                      )}
                    >
                      {selectedRole.status === 'enabled' ? '启用' : '停用'}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary">{selectedRole.description}</span>
                </div>
              </div>

              {/* detail fields */}
              <div className="space-y-2">
                {[
                  { label: '角色描述', value: selectedRole.description },
                  { label: '角色等级', value: selectedRole.level },
                  { label: '创建时间', value: selectedRole.createdAt },
                  { label: '创建人', value: selectedRole.creator },
                  {
                    label: '分配用户',
                    value: (
                      <span className="inline-flex items-center gap-1 text-accent-cyan cursor-pointer hover:underline">
                        {selectedRole.userCount} 人 <Link2 className="w-3 h-3" />
                      </span>
                    ),
                  },
                  {
                    label: '数据范围',
                    value: (
                      <span className="inline-flex items-center gap-1 text-accent-cyan cursor-pointer hover:underline">
                        {selectedRole.dataScope} <Link2 className="w-3 h-3" />
                      </span>
                    ),
                  },
                  {
                    label: '审批状态',
                    value: (
                      <span className="inline-flex items-center gap-1 text-status-normal">
                        <CheckCircle2 className="w-3 h-3" />
                        {selectedRole.approvalStatus}
                      </span>
                    ),
                  },
                  { label: '最近更新', value: selectedRole.lastUpdated },
                ].map((field) => (
                  <div key={field.label} className="flex items-start justify-between py-1.5">
                    <span className="text-xs text-text-tertiary flex-shrink-0">{field.label}</span>
                    <span className="text-xs text-text-primary text-right ml-2">
                      {typeof field.value === 'string' ? field.value : field.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* action buttons */}
              <div className="flex items-center gap-2 mt-auto pt-3">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs hover:bg-accent-cyan/20 transition-colors flex-1 justify-center">
                  <Edit className="w-3 h-3" /> 编辑角色
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-bg-panel-hover border border-border-primary text-text-secondary text-xs hover:bg-bg-active transition-colors flex-1 justify-center">
                  <Copy className="w-3 h-3" /> 复制角色
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs hover:bg-status-danger/20 transition-colors flex-1 justify-center">
                  <Ban className="w-3 h-3" /> 停用角色
                </button>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Bottom: Recent Auth Changes ── */}
      <div className="flex-shrink-0" style={{ height: 160 }}>
        <Panel title="最近授权变更" className="h-full">
          <div className="overflow-auto custom-scrollbar h-full">
            <table className="w-full border-collapse text-xs">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[rgba(15,37,64,0.8)]">
                  {['时间', '操作人', '角色名称', '变更内容', '变更范围', '结果'].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-text-secondary font-medium border-b border-border-subtle whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHANGE_LOGS.map((log, idx) => (
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
                        {log.time}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-text-primary whitespace-nowrap">{log.operator}</td>
                    <td className="px-3 py-1.5 text-accent-cyan whitespace-nowrap">{log.roleName}</td>
                    <td className="px-3 py-1.5 text-text-secondary whitespace-nowrap">{log.change}</td>
                    <td className="px-3 py-1.5 text-text-secondary whitespace-nowrap">{log.scope}</td>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-status-normal">
                        <CheckCircle2 className="w-3 h-3" />
                        {log.result}
                      </span>
                    </td>
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
