import { cn } from '@/lib/utils'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  GitBranch,
  Monitor,
  Zap,
  Droplet,
  BarChart3,
  Settings2,
} from 'lucide-react'

const navItems = [
  { key: '/', label: '全厂总览', icon: LayoutDashboard },
  { key: '/process', label: '工艺流程', icon: GitBranch },
  { key: '/equipment', label: '设备监控', icon: Monitor },
  { key: '/energy', label: '能效管理', icon: Zap },
  { key: '/water-quality', label: '水质管理', icon: Droplet },
  { key: '/reports', label: '智能报表', icon: BarChart3 },
  { key: '/system', label: '系统管理', icon: Settings2 },
]

export default function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="relative flex items-center justify-around h-[52px] flex-shrink-0 border-t border-border-primary"
      style={{ backgroundColor: '#040d18' }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.key
        const Icon = item.icon
        return (
          <button
            key={item.key}
            onClick={() => navigate(item.key)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded transition-all duration-200',
              'hover:text-text-secondary',
              isActive ? 'text-accent-cyan' : 'text-text-tertiary'
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{item.label}</span>
            {isActive && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-12 rounded-full"
                style={{ backgroundColor: '#00e5ff' }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
