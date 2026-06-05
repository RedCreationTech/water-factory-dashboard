import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Users,
  ShieldCheck,
  MapPin,
  Bell,
  Brain,
  FileText,
  Settings,
  Target,
} from 'lucide-react'
import UserManagementTab from '@/components/system/UserManagementTab'
import RolePermissionTab from '@/components/system/RolePermissionTab'
import PointConfigTab from '@/components/system/PointConfigTab'
import AlarmRulesTab from '@/components/system/AlarmRulesTab'
import AIModelTab from '@/components/system/AIModelTab'
import LogAuditTab from '@/components/system/LogAuditTab'
import SystemSettingsTab from '@/components/system/SystemSettingsTab'
import ImplementationProgressTab from '@/components/system/ImplementationProgressTab'

const TABS = [
  { key: 'users', label: '用户管理', icon: Users },
  { key: 'roles', label: '角色权限', icon: ShieldCheck },
  { key: 'points', label: '点位配置', icon: MapPin },
  { key: 'alarms', label: '告警规则', icon: Bell },
  { key: 'aimodel', label: 'AI模型管理', icon: Brain },
  { key: 'logs', label: '日志审计', icon: FileText },
  { key: 'settings', label: '系统设置', icon: Settings },
  { key: 'progress', label: '实施进度', icon: Target },
] as const

type TabKey = typeof TABS[number]['key']

export default function System() {
  const [activeTab, setActiveTab] = useState<TabKey>('users')

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-0 flex-shrink-0">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all rounded-t-md border-t border-x',
                isActive
                  ? 'text-accent-cyan bg-bg-card border-border-primary'
                  : 'text-text-tertiary border-transparent hover:text-text-secondary hover:bg-bg-panel/50'
              )}
            >
              <Icon className="w-4 h-4" />
              {t.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-cyan" />
              )}
            </button>
          )
        })}
        {/* Filler to extend bottom border */}
        <div className="flex-1 border-b border-border-primary self-stretch" />
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden p-3">
        {activeTab === 'users' && <UserManagementTab />}
        {activeTab === 'roles' && <RolePermissionTab />}
        {activeTab === 'points' && <PointConfigTab />}
        {activeTab === 'alarms' && <AlarmRulesTab />}
        {activeTab === 'aimodel' && <AIModelTab />}
        {activeTab === 'logs' && <LogAuditTab />}
        {activeTab === 'settings' && <SystemSettingsTab />}
        {activeTab === 'progress' && <ImplementationProgressTab />}
      </div>
    </div>
  )
}
