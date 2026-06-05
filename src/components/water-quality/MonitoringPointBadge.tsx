import { useState, memo } from 'react'

interface ParamData {
  label: string
  value: string | number
  unit: string
}

interface MonitoringPointBadgeProps {
  number: number
  title: string
  params: ParamData[]
  position: { left: string; top: string }
  isActive?: boolean
  onClick?: () => void
}

const MonitoringPointBadge = memo(function MonitoringPointBadge({
  number,
  title,
  params,
  position,
  isActive = false,
  onClick,
}: MonitoringPointBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const showPopup = isHovered || isActive

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: position.left, top: position.top, transform: 'translate(-50%, -50%)', zIndex: showPopup ? 20 : 10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popup card */}
      {showPopup && (
        <div
          className="absolute bottom-full mb-2 rounded-md border border-border-glow bg-bg-overlay backdrop-blur-sm px-3 py-2 whitespace-nowrap animate-in fade-in duration-200"
          style={{ minWidth: 160 }}
        >
          <div className="text-xs font-semibold text-text-primary mb-1.5">{title}</div>
          {params.map((p, i) => (
            <div key={i} className="flex items-center justify-between gap-4 text-[11px] py-0.5">
              <span className="text-text-secondary">{p.label}</span>
              <span className="font-data text-text-data">
                {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
                <span className="text-text-tertiary ml-0.5">{p.unit}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Badge circle */}
      <button
        onClick={onClick}
        className={`
          flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold font-data
          border-2 transition-all duration-200 cursor-pointer
          animate-pulse-point
          ${isActive
            ? 'bg-accent-cyan border-accent-cyan text-bg-primary shadow-glow-cyan-strong'
            : 'bg-bg-overlay border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary'
          }
        `}
      >
        {number}
      </button>
    </div>
  )
})

export default MonitoringPointBadge
