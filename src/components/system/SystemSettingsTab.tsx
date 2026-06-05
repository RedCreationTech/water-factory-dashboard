import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Shield,
  Database,
  Wifi,
  Sliders,
  Lock,
  Radio,
  Archive,
  Bell,
  CheckCircle2,
  Server,
  Clock,
  Save,
  RotateCcw,
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import Panel from '@/components/Panel'
import DataTable from '@/components/DataTable'

/* ─────────── types ─────────── */
type SettingsMenuKey = 'basic' | 'security' | 'comm' | 'backup' | 'notification'

interface ChangeRecord {
  key: string
  time: string
  item: string
  content: string
  operator: string
}

/* ─────────── demo data ─────────── */
const changeRecords: ChangeRecord[] = [
  { key: 'c1', time: '2025-05-15 14:22:18', item: '安全策略', content: '密码最小长度由8位调整为12位', operator: 'admin' },
  { key: 'c2', time: '2025-05-14 09:15:33', item: '通讯设置', content: 'MQTT服务器地址变更为 192.168.1.200', operator: 'sys01' },
  { key: 'c3', time: '2025-05-13 16:40:05', item: '基础配置', content: '会话超时时间由30分钟调整为45分钟', operator: 'admin' },
]

/* ─────────── menu items ─────────── */
const menuItems: Array<{ key: SettingsMenuKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: 'basic', label: '基础配置', icon: Sliders },
  { key: 'security', label: '安全策略', icon: Lock },
  { key: 'comm', label: '通讯设置', icon: Radio },
  { key: 'backup', label: '备份恢复', icon: Archive },
  { key: 'notification', label: '通知设置', icon: Bell },
]

/* ─────────── component ─────────── */
export default function SystemSettingsTab() {
  const [activeMenu, setActiveMenu] = useState<SettingsMenuKey>('basic')

  /* Basic config state */
  const [platformName, setPlatformName] = useState('智慧水务·污水处理AI优化平台')
  const [timezone, setTimezone] = useState('(GMT+08:00) 北京，重庆，香港特别行政区，乌鲁木齐')
  const [namingMode, setNamingMode] = useState('自定义名称')
  const [themeMode, setThemeMode] = useState('深色模式')
  const [sessionTimeout, setSessionTimeout] = useState(30)

  /* Security state */
  const [minPwdLength, setMinPwdLength] = useState(12)
  const [requireUppercase, setRequireUppercase] = useState(true)
  const [requireLowercase, setRequireLowercase] = useState(true)
  const [requireNumber, setRequireNumber] = useState(true)
  const [requireSpecial, setRequireSpecial] = useState(true)
  const [pwdExpiryDays, setPwdExpiryDays] = useState(60)
  const [loginFailLock, setLoginFailLock] = useState(5)

  /* Comm state */
  const [protocol, setProtocol] = useState('MQTT')
  const [serverAddr, setServerAddr] = useState('192.168.1.200')
  const [serverPort, setServerPort] = useState(1883)
  const [heartbeatInterval, setHeartbeatInterval] = useState(30)

  /* Backup state */
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupSchedule, setBackupSchedule] = useState('每天 02:00')
  const [retentionDays, setRetentionDays] = useState(30)

  /* Notification state */
  const [enableStationMsg, setEnableStationMsg] = useState(true)
  const [enableSms, setEnableSms] = useState(true)
  const [enableEmail, setEnableEmail] = useState(true)
  const [enableWebhook, setEnableWebhook] = useState(false)

  const changeRows = changeRecords as unknown as Record<string, unknown>[]

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        <KPICard
          icon={<Shield className="w-4 h-4" />}
          iconBg="rgba(0,229,255,0.15)"
          label="系统健康度"
          value="98"
          unit="分"
          changePercent="运行良好"
          positive={true}
        />
        <KPICard
          icon={<Database className="w-4 h-4" />}
          iconBg="rgba(0,255,136,0.15)"
          label="备份状态"
          value="正常"
          unit=""
          changePercent="最近备份: 2025-05-15 02:00:00"
          positive={true}
        />
        <KPICard
          icon={<Wifi className="w-4 h-4" />}
          iconBg="rgba(0,170,255,0.15)"
          label="通讯在线率"
          value="99.2"
          unit="%"
          changePercent="在线设备 124/125"
          positive={true}
        />
      </div>

      {/* ── Main 3-column layout ── */}
      <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
        {/* Left: Settings Menu */}
        <div className="col-span-1 flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenu === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded text-sm font-medium transition-all text-left',
                  isActive
                    ? 'text-accent-cyan bg-bg-panel border-l-2 border-accent-cyan'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-panel/50 border-l-2 border-transparent'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Middle: Content Panel */}
        <Panel title={menuItems.find((m) => m.key === activeMenu)?.label ?? '设置'} className="col-span-3 flex flex-col">
          <div className="flex-1 overflow-auto custom-scrollbar pr-1">
            {activeMenu === 'basic' && (
              <div className="flex flex-col gap-4">
                <FormRow label="平台名称">
                  <input
                    type="text"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full h-8 px-3 rounded bg-bg-panel border border-border-primary text-xs text-text-primary focus:outline-none focus:border-border-glow transition-colors"
                  />
                </FormRow>
                <FormRow label="时区设置">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-8 px-3 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary focus:outline-none focus:border-border-glow cursor-pointer"
                  >
                    <option>(GMT+08:00) 北京，重庆，香港特别行政区，乌鲁木齐</option>
                    <option>(GMT+09:00) 大阪，札幌，东京</option>
                    <option>(GMT+00:00) 伦敦，爱丁堡</option>
                  </select>
                </FormRow>
                <FormRow label="水厂命名方式">
                  <select
                    value={namingMode}
                    onChange={(e) => setNamingMode(e.target.value)}
                    className="w-full h-8 px-3 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary focus:outline-none focus:border-border-glow cursor-pointer"
                  >
                    <option>自定义名称</option>
                    <option>行政区域+类型</option>
                    <option>编号体系</option>
                  </select>
                </FormRow>
                <FormRow label="主题模式">
                  <select
                    value={themeMode}
                    onChange={(e) => setThemeMode(e.target.value)}
                    className="w-full h-8 px-3 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary focus:outline-none focus:border-border-glow cursor-pointer"
                  >
                    <option>深色模式</option>
                    <option>浅色模式</option>
                    <option>跟随系统</option>
                  </select>
                </FormRow>
                <FormRow label="会话超时时间">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(Number(e.target.value))}
                      className="w-20 h-8 px-3 rounded bg-bg-panel border border-border-primary text-xs text-text-primary focus:outline-none focus:border-border-glow transition-colors"
                    />
                    <span className="text-xs text-text-secondary">分钟 (范围: 5-120)</span>
                  </div>
                </FormRow>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => console.log('保存基础配置')}
                    className="flex items-center gap-1.5 px-4 h-8 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-xs text-accent-cyan hover:bg-accent-cyan/25 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    保存
                  </button>
                  <button
                    onClick={() => console.log('重置基础配置')}
                    className="flex items-center gap-1.5 px-4 h-8 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary hover:text-text-primary hover:border-border-glow transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    重置
                  </button>
                </div>
              </div>
            )}

            {activeMenu === 'security' && (
              <div className="flex flex-col gap-4">
                <FormRow label="密码最小长度">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={6}
                      max={32}
                      value={minPwdLength}
                      onChange={(e) => setMinPwdLength(Number(e.target.value))}
                      className="w-40 accent-accent-cyan"
                    />
                    <span className="text-xs text-text-data font-mono-data w-6">{minPwdLength}</span>
                    <span className="text-xs text-text-secondary">位</span>
                  </div>
                </FormRow>
                <FormRow label="复杂度要求">
                  <div className="flex flex-col gap-2">
                    <Checkbox label="大写字母 (A-Z)" checked={requireUppercase} onChange={setRequireUppercase} />
                    <Checkbox label="小写字母 (a-z)" checked={requireLowercase} onChange={setRequireLowercase} />
                    <Checkbox label="数字 (0-9)" checked={requireNumber} onChange={setRequireNumber} />
                    <Checkbox label="特殊字符 (!@#$...)" checked={requireSpecial} onChange={setRequireSpecial} />
                  </div>
                </FormRow>
                <FormRow label="密码有效期">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={pwdExpiryDays}
                      onChange={(e) => setPwdExpiryDays(Number(e.target.value))}
                      className="w-20 h-8 px-3 rounded bg-bg-panel border border-border-primary text-xs text-text-primary focus:outline-none focus:border-border-glow transition-colors"
                    />
                    <span className="text-xs text-text-secondary">天</span>
                  </div>
                </FormRow>
                <FormRow label="登录失败锁定">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={loginFailLock}
                      onChange={(e) => setLoginFailLock(Number(e.target.value))}
                      className="w-20 h-8 px-3 rounded bg-bg-panel border border-border-primary text-xs text-text-primary focus:outline-none focus:border-border-glow transition-colors"
                    />
                    <span className="text-xs text-text-secondary">次失败后锁定账户30分钟</span>
                  </div>
                </FormRow>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => console.log('保存安全策略')}
                    className="flex items-center gap-1.5 px-4 h-8 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-xs text-accent-cyan hover:bg-accent-cyan/25 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    保存
                  </button>
                  <button
                    onClick={() => console.log('重置安全策略')}
                    className="flex items-center gap-1.5 px-4 h-8 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary hover:text-text-primary hover:border-border-glow transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    重置
                  </button>
                </div>
              </div>
            )}

            {activeMenu === 'comm' && (
              <div className="flex flex-col gap-4">
                <FormRow label="通讯协议">
                  <select
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    className="w-full h-8 px-3 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary focus:outline-none focus:border-border-glow cursor-pointer"
                  >
                    <option>MQTT</option>
                    <option>Modbus TCP</option>
                    <option>OPC UA</option>
                    <option>HTTP REST</option>
                  </select>
                </FormRow>
                <FormRow label="服务器地址">
                  <input
                    type="text"
                    value={serverAddr}
                    onChange={(e) => setServerAddr(e.target.value)}
                    className="w-full h-8 px-3 rounded bg-bg-panel border border-border-primary text-xs text-text-primary focus:outline-none focus:border-border-glow transition-colors"
                  />
                </FormRow>
                <FormRow label="端口号">
                  <input
                    type="number"
                    value={serverPort}
                    onChange={(e) => setServerPort(Number(e.target.value))}
                    className="w-28 h-8 px-3 rounded bg-bg-panel border border-border-primary text-xs text-text-primary focus:outline-none focus:border-border-glow transition-colors"
                  />
                </FormRow>
                <FormRow label="心跳间隔">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={heartbeatInterval}
                      onChange={(e) => setHeartbeatInterval(Number(e.target.value))}
                      className="w-20 h-8 px-3 rounded bg-bg-panel border border-border-primary text-xs text-text-primary focus:outline-none focus:border-border-glow transition-colors"
                    />
                    <span className="text-xs text-text-secondary">秒</span>
                  </div>
                </FormRow>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => console.log('保存通讯设置')}
                    className="flex items-center gap-1.5 px-4 h-8 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-xs text-accent-cyan hover:bg-accent-cyan/25 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    保存
                  </button>
                  <button
                    onClick={() => console.log('测试连接')}
                    className="flex items-center gap-1.5 px-4 h-8 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary hover:text-text-primary hover:border-border-glow transition-colors"
                  >
                    <Wifi className="w-3.5 h-3.5" />
                    测试连接
                  </button>
                </div>
              </div>
            )}

            {activeMenu === 'backup' && (
              <div className="flex flex-col gap-4">
                <FormRow label="自动备份">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAutoBackup((v) => !v)}
                      className={cn(
                        'w-10 h-5 rounded-full transition-colors relative',
                        autoBackup ? 'bg-accent-cyan' : 'bg-bg-panel border border-border-primary'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                          autoBackup ? 'left-5' : 'left-0.5'
                        )}
                      />
                    </button>
                    <span className="text-xs text-text-secondary">{autoBackup ? '已启用' : '已禁用'}</span>
                  </div>
                </FormRow>
                <FormRow label="备份计划">
                  <select
                    value={backupSchedule}
                    onChange={(e) => setBackupSchedule(e.target.value)}
                    className="w-full h-8 px-3 rounded bg-bg-panel border border-border-primary text-xs text-text-secondary focus:outline-none focus:border-border-glow cursor-pointer"
                  >
                    <option>每天 02:00</option>
                    <option>每周一 02:00</option>
                    <option>每月1日 02:00</option>
                  </select>
                </FormRow>
                <FormRow label="保留天数">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={7}
                      max={365}
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(Number(e.target.value))}
                      className="w-20 h-8 px-3 rounded bg-bg-panel border border-border-primary text-xs text-text-primary focus:outline-none focus:border-border-glow transition-colors"
                    />
                    <span className="text-xs text-text-secondary">天</span>
                  </div>
                </FormRow>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => console.log('立即备份')}
                    className="flex items-center gap-1.5 px-4 h-8 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-xs text-accent-cyan hover:bg-accent-cyan/25 transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    立即备份
                  </button>
                  <button
                    onClick={() => console.log('恢复数据')}
                    className="flex items-center gap-1.5 px-4 h-8 rounded bg-status-danger/15 border border-status-danger/30 text-xs text-status-danger hover:bg-status-danger/25 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    恢复数据
                  </button>
                </div>
              </div>
            )}

            {activeMenu === 'notification' && (
              <div className="flex flex-col gap-4">
                <FormRow label="通知渠道">
                  <div className="flex flex-col gap-2">
                    <Checkbox label="站内信通知" checked={enableStationMsg} onChange={setEnableStationMsg} />
                    <Checkbox label="短信通知" checked={enableSms} onChange={setEnableSms} />
                    <Checkbox label="邮件通知" checked={enableEmail} onChange={setEnableEmail} />
                    <Checkbox label="Webhook推送" checked={enableWebhook} onChange={setEnableWebhook} />
                  </div>
                </FormRow>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => console.log('保存通知设置')}
                    className="flex items-center gap-1.5 px-4 h-8 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-xs text-accent-cyan hover:bg-accent-cyan/25 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    保存
                  </button>
                </div>
              </div>
            )}
          </div>
        </Panel>

        {/* Right: Running Status Panel */}
        <Panel title="运行状态" className="col-span-1 flex flex-col">
          <div className="flex flex-col gap-2.5">
            <StatusCard
              icon={<Server className="w-4 h-4" />}
              label="当前版本"
              value="V2.3.1"
              sub="最新版本"
              color="text-accent-cyan"
            />
            <StatusCard
              icon={<Database className="w-4 h-4" />}
              label="数据库状态"
              value="正常"
              sub="响应 12ms"
              color="text-status-normal"
            />
            <StatusCard
              icon={<CheckCircle2 className="w-4 h-4" />}
              label="服务状态"
              value="运行中"
              sub="18个服务"
              color="text-status-normal"
            />
            <StatusCard
              icon={<Clock className="w-4 h-4" />}
              label="最后备份时间"
              value="2025-05-15"
              sub="02:00:00"
              color="text-accent-cyan"
            />
          </div>
        </Panel>
      </div>

      {/* ── Bottom: Config Change Record ── */}
      <Panel title="配置变更记录" className="flex-shrink-0">
        <DataTable
          columns={[
            { key: 'time', title: '变更时间', dataIndex: 'time' },
            { key: 'item', title: '配置项', dataIndex: 'item' },
            { key: 'content', title: '变更内容', dataIndex: 'content', width: '40%' },
            { key: 'operator', title: '变更人', dataIndex: 'operator' },
            {
              key: 'action',
              title: '操作',
              render: (row) => {
                const r = row as unknown as ChangeRecord
                return (
                  <button
                    onClick={() => console.log('查看变更详情', r.key)}
                    className="text-xs text-accent-cyan hover:underline"
                  >
                    查看
                  </button>
                )
              },
            },
          ]}
          data={changeRows}
          rowKey="key"
          maxHeight="100%"
        />
      </Panel>
    </div>
  )
}

/* ─────────── helper: form row ─────────── */
function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <label className="w-28 flex-shrink-0 text-xs text-text-secondary pt-1.5 text-right">{label}</label>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

/* ─────────── helper: checkbox ─────────── */
function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-left"
    >
      <span className={cn(
        'w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0',
        checked ? 'bg-accent-cyan border-accent-cyan' : 'border-border-primary bg-bg-panel'
      )}>
        {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
      </span>
      <span className="text-xs text-text-secondary">{label}</span>
    </button>
  )
}

/* ─────────── helper: status card ─────────── */
function StatusCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  color: string
}) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded bg-bg-panel border border-border-subtle">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-cyan/10 flex-shrink-0">
        <span className="text-accent-cyan">{icon}</span>
      </span>
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] text-text-tertiary truncate">{label}</span>
        <span className={cn('text-sm font-semibold font-mono-data', color)}>{value}</span>
        <span className="text-[11px] text-text-tertiary">{sub}</span>
      </div>
    </div>
  )
}
