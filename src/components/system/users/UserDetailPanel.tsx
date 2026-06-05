import {
  UserCircle,
  Building2,
  FolderOpen,
  Phone,
  Mail,
  Shield,
  Clock,
  Globe,
  Edit3,
  KeyRound,
  Ban,
  Database,
  Lock,
  Menu,
} from 'lucide-react'
import Panel from '@/components/Panel'
import type { User } from './mockData'
import { detailPermissionsForUser } from './mockData'

interface UserDetailPanelProps {
  user: User | null
}

export default function UserDetailPanel({ user }: UserDetailPanelProps) {
  if (!user) {
    return (
      <Panel title="用户详情" className="w-[320px] flex-shrink-0">
        <div className="flex flex-col items-center justify-center h-full text-text-tertiary text-sm">
          <UserCircle className="w-12 h-12 mb-2 opacity-30" />
          <span>请选择用户查看详情</span>
        </div>
      </Panel>
    )
  }

  const perms = detailPermissionsForUser(user)
  const isOnline = user.status === 'online'

  return (
    <Panel title="用户详情" className="w-[320px] flex-shrink-0 flex flex-col gap-3">
      {/* Avatar + username + role */}
      <div className="flex items-center gap-3 pb-3 border-b border-border-subtle">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-accent-cyan/15 border border-accent-cyan/40 flex items-center justify-center">
            <UserCircle className="w-7 h-7 text-accent-cyan" />
          </div>
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-bg-card ${isOnline ? 'bg-status-normal' : 'bg-status-offline'}`}
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-text-primary truncate">{user.username}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${isOnline ? 'bg-status-normal/10 text-status-normal border-status-normal/30' : 'bg-status-offline/10 text-text-tertiary border-status-offline/30'}`}>
              {isOnline ? '在线' : '离线'}
            </span>
          </div>
          <span className="text-xs text-text-secondary">{user.role}</span>
        </div>
      </div>

      {/* Detail fields */}
      <div className="flex flex-col gap-2">
        <DetailRow icon={<Building2 className="w-3.5 h-3.5" />} label="所属水厂" value={user.plant} />
        <DetailRow icon={<FolderOpen className="w-3.5 h-3.5" />} label="所属部门" value={user.department} />
        <DetailRow icon={<Phone className="w-3.5 h-3.5" />} label="手机号码" value={user.phone} />
        <DetailRow icon={<Mail className="w-3.5 h-3.5" />} label="邮箱地址" value={user.email} />
        <DetailRow
          icon={<Shield className="w-3.5 h-3.5" />}
          label="账号状态"
          value={user.enabled ? '已启用' : '已禁用'}
          valueColor={user.enabled ? 'text-status-normal' : 'text-status-danger'}
        />
        <DetailRow icon={<Clock className="w-3.5 h-3.5" />} label="最近登录" value={user.lastLogin} valueClass="font-data" />
        <DetailRow icon={<Globe className="w-3.5 h-3.5" />} label="登录IP" value={user.loginIp} valueClass="font-data" />
      </div>

      {/* Permission overview */}
      <div className="pt-2 border-t border-border-subtle">
        <div className="text-xs text-text-secondary mb-2 font-medium">权限概览</div>
        <div className="grid grid-cols-3 gap-2">
          <PermissionCard icon={<Database className="w-4 h-4" />} label="数据权限" value={perms.dataPermission} />
          <PermissionCard icon={<Lock className="w-4 h-4" />} label="功能权限" value={`${perms.funcPermission}项`} />
          <PermissionCard icon={<Menu className="w-4 h-4" />} label="菜单权限" value={`${perms.menuPermission}项`} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="pt-2 border-t border-border-subtle">
        <div className="text-xs text-text-secondary mb-2 font-medium">快捷操作</div>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => console.log('编辑用户', user.username)}
            className="flex items-center justify-center gap-1.5 w-full h-8 rounded border border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan text-xs font-medium hover:bg-accent-cyan/20 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            编辑用户
          </button>
          <button
            onClick={() => console.log('重置密码', user.username)}
            className="flex items-center justify-center gap-1.5 w-full h-8 rounded border border-border-primary bg-bg-panel text-text-secondary text-xs font-medium hover:bg-bg-panel-hover hover:text-text-primary transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            重置密码
          </button>
          <button
            onClick={() => console.log('禁用用户', user.username)}
            className="flex items-center justify-center gap-1.5 w-full h-8 rounded border border-status-danger/40 bg-status-danger/10 text-status-danger text-xs font-medium hover:bg-status-danger/20 transition-colors"
          >
            <Ban className="w-3.5 h-3.5" />
            禁用用户
          </button>
        </div>
      </div>
    </Panel>
  )
}

function DetailRow({
  icon,
  label,
  value,
  valueColor,
  valueClass,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueColor?: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-text-tertiary flex-shrink-0 w-4 flex justify-center">{icon}</span>
      <span className="text-text-tertiary flex-shrink-0 w-16">{label}</span>
      <span className={`text-text-primary truncate ${valueColor || ''} ${valueClass || ''}`}>{value}</span>
    </div>
  )
}

function PermissionCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded border border-border-primary bg-bg-panel p-2 text-center">
      <span className="text-text-tertiary">{icon}</span>
      <span className="text-[10px] text-text-tertiary">{label}</span>
      <span className="text-xs font-semibold text-accent-cyan">{value}</span>
    </div>
  )
}
