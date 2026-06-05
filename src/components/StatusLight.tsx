import { cn } from '@/lib/utils'

interface StatusLightProps {
  status: 'normal' | 'warning' | 'danger' | 'offline'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  pulse?: boolean
}

export default function StatusLight({ status, size = 'sm', label, pulse = false }: StatusLightProps) {
  const sizeMap = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  const colorMap = {
    normal: pulse ? 'bg-status-normal animate-pulse-glow' : 'bg-status-normal',
    warning: 'bg-status-warning',
    danger: pulse ? 'bg-status-danger animate-blink' : 'bg-status-danger',
    offline: 'bg-status-offline',
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          'inline-block rounded-full flex-shrink-0',
          sizeMap[size],
          colorMap[status]
        )}
      />
      {label && (
        <span className="text-xs text-text-secondary">{label}</span>
      )}
    </span>
  )
}
