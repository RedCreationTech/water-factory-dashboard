import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import {
  Droplets,
  Maximize,
  Minimize,
  Bell,
  Settings,
  Wifi,
} from 'lucide-react'

export default function Header() {
  const [now, setNow] = useState(new Date())
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const dateStr = format(now, 'yyyy-MM-dd HH:mm:ss')
  const weekStr = weekDays[now.getDay()]

  return (
    <header
      className="relative flex items-center justify-between px-5 h-[56px] flex-shrink-0"
      style={{ backgroundColor: '#061220' }}
    >
      {/* Cyan gradient bottom border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #00e5ff 30%, #00e5ff 70%, transparent 100%)',
        }}
      />

      {/* Left: Logo + title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-cyan/10 border border-accent-cyan/30">
          <Droplets className="w-4 h-4 text-accent-cyan" />
        </div>
        <h1 className="text-lg font-semibold tracking-wide text-text-primary" style={{ letterSpacing: '0.02em' }}>
          HC-智慧水厂
        </h1>
      </div>

      {/* Right: datetime + status + icons */}
      <div className="flex items-center gap-5">
        {/* DateTime */}
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="font-data">{dateStr}</span>
          <span className="text-text-tertiary">{weekStr}</span>
        </div>

        {/* Vertical divider */}
        <div className="w-px h-5 bg-border-primary" />

        {/* System status */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-status-normal animate-pulse-glow" />
          <span className="text-xs text-text-secondary">运行中</span>
        </div>

        {/* Comm status */}
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-status-normal" />
          <span className="text-xs text-text-secondary">通讯正常</span>
        </div>

        {/* Vertical divider */}
        <div className="w-px h-5 bg-border-primary" />

        {/* Fullscreen icon */}
        <button
          className="p-1.5 rounded hover:bg-white/5 transition-colors"
          title={isFullscreen ? '退出全屏' : '全屏'}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4 text-text-secondary hover:text-text-primary" />
          ) : (
            <Maximize className="w-4 h-4 text-text-secondary hover:text-text-primary" />
          )}
        </button>

        {/* Notification bell */}
        <button className="relative p-1.5 rounded hover:bg-white/5 transition-colors" title="通知">
          <Bell className="w-4 h-4 text-text-secondary hover:text-text-primary" />
          <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[14px] h-[14px] px-0.5 rounded-full bg-status-danger text-[9px] text-white font-medium leading-none">
            3
          </span>
        </button>

        {/* Settings */}
        <button className="p-1.5 rounded hover:bg-white/5 transition-colors" title="设置">
          <Settings className="w-4 h-4 text-text-secondary hover:text-text-primary" />
        </button>
      </div>
    </header>
  )
}
