import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface PanelProps {
  children: ReactNode
  title?: string
  className?: string
  style?: React.CSSProperties
  rightAction?: ReactNode
}

export default function Panel({ children, title, className, style, rightAction }: PanelProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-border-primary bg-bg-card backdrop-blur-sm',
        'flex flex-col overflow-hidden',
        className
      )}
      style={style}
    >
      {title && (
        <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
          <div className="panel-title">{title}</div>
          {rightAction && <div>{rightAction}</div>}
        </div>
      )}
      <div className="flex-1 overflow-hidden px-4 pb-3">
        {children}
      </div>
    </div>
  )
}
