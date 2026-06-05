import { useState, useMemo } from 'react'
import {
  Users,
  UserCheck,
  Shield,
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import UserListPanel from './users/UserListPanel'
import UserDetailPanel from './users/UserDetailPanel'
import RecentOperationsPanel from './users/RecentOperationsPanel'
import { mockUsers } from './users/mockData'
import type { User } from './users/mockData'

export default function UserManagementTab() {
  const [selectedUser, setSelectedUser] = useState<User>(mockUsers[0])

  const totalUsers = mockUsers.length
  const onlineUsers = mockUsers.filter((u) => u.status === 'online').length
  const enabledUsers = mockUsers.filter((u) => u.enabled).length
  const onlineRate = ((onlineUsers / totalUsers) * 100).toFixed(1)
  const enabledRate = ((enabledUsers / totalUsers) * 100).toFixed(1)

  const kpiCards = useMemo(
    () => [
      {
        icon: <Users size={16} />,
        iconBg: '#004488',
        label: '用户总数',
        value: totalUsers,
        unit: '人',
        changePercent: '3',
        positive: true,
      },
      {
        icon: <UserCheck size={16} />,
        iconBg: '#006644',
        label: '在线用户',
        value: onlineUsers,
        unit: '人',
        changePercent: `在线率 ${onlineRate}%`,
        positive: true,
      },
      {
        icon: <Shield size={16} />,
        iconBg: '#557700',
        label: '启用率',
        value: enabledRate,
        unit: '%',
        changePercent: `启用 ${enabledUsers}/总数 ${totalUsers}`,
        positive: true,
      },
    ],
    [totalUsers, onlineUsers, enabledUsers, onlineRate, enabledRate]
  )

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* Top KPI Row */}
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        {kpiCards.map((kpi, idx) => (
          <KPICard
            key={idx}
            icon={kpi.icon}
            iconBg={kpi.iconBg}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            changePercent={kpi.changePercent}
            positive={kpi.positive}
          />
        ))}
      </div>

      {/* Middle Row: User List + User Detail */}
      <div className="flex gap-3 flex-1 min-h-0">
        <UserListPanel
          users={mockUsers}
          selectedKey={selectedUser?.key ?? ''}
          onSelect={setSelectedUser}
        />
        <UserDetailPanel user={selectedUser} />
      </div>

      {/* Bottom Row: Recent Operations */}
      <div className="flex-shrink-0">
        <RecentOperationsPanel />
      </div>
    </div>
  )
}
