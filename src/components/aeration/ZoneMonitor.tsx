import { useMemo } from 'react'

interface ZoneData {
  id: number
  do: number
  valve: number
  airflow: number
  energyPercent: number
  status: 'normal' | 'warning'
  doTrend: 'down' | 'stable'
}

const zoneData: ZoneData[] = [
  { id: 1, do: 2.05, valve: 58, airflow: 2150, energyPercent: 11.2, status: 'normal', doTrend: 'stable' },
  { id: 2, do: 2.10, valve: 64, airflow: 2320, energyPercent: 12.3, status: 'normal', doTrend: 'stable' },
  { id: 3, do: 1.88, valve: 72, airflow: 2680, energyPercent: 15.6, status: 'warning', doTrend: 'down' },
  { id: 4, do: 2.34, valve: 53, airflow: 1980, energyPercent: 9.8, status: 'normal', doTrend: 'stable' },
  { id: 5, do: 1.98, valve: 70, airflow: 2520, energyPercent: 14.9, status: 'warning', doTrend: 'down' },
  { id: 6, do: 2.28, valve: 60, airflow: 2100, energyPercent: 11.6, status: 'normal', doTrend: 'stable' },
  { id: 7, do: 2.31, valve: 55, airflow: 2020, energyPercent: 10.3, status: 'normal', doTrend: 'stable' },
  { id: 8, do: 2.16, valve: 62, airflow: 2210, energyPercent: 13.3, status: 'normal', doTrend: 'stable' },
]

const doColors: Record<string, string> = {
  normal: '#00ff88',
  low: '#ffcc00',
}

export default function ZoneMonitor() {
  const zones = useMemo(() => zoneData, [])

  return (
    <div
      className="flex-1 flex flex-col rounded-md border border-border-primary overflow-hidden"
      style={{
        backgroundColor: 'rgba(10, 26, 46, 0.85)',
      }}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
        <div className="panel-title text-sm">
          生化池 / 曝气池分区监控
        </div>
        <span className="text-[10px] text-text-tertiary">点击分区查看联动设备</span>
      </div>

      {/* Water pool background with zones */}
      <div
        className="flex-1 relative p-3 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0a1a2e 0%, #0a2a3e 30%, #0a2035 70%, #0a1a2e 100%)',
        }}
      >
        {/* Water ripple effect overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 60%, rgba(0, 229, 255, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 40%, rgba(0, 100, 180, 0.1) 0%, transparent 50%)',
          }}
        />

        {/* Inflow/Outflow labels */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 pointer-events-none z-10">
          <span className="text-[10px] text-accent-cyan font-medium">进水</span>
          <svg width="12" height="20" viewBox="0 0 12 20">
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="#00e5ff" />
              </marker>
            </defs>
            <line x1="6" y1="0" x2="6" y2="16" stroke="#00e5ff" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
          </svg>
        </div>

        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 pointer-events-none z-10">
          <span className="text-[10px] text-accent-cyan font-medium">出水</span>
          <svg width="12" height="20" viewBox="0 0 12 20">
            <defs>
              <marker id="arrowhead-out" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="#00e5ff" />
              </marker>
            </defs>
            <line x1="6" y1="20" x2="6" y2="4" stroke="#00e5ff" strokeWidth="1.5" markerEnd="url(#arrowhead-out)" />
          </svg>
        </div>

        {/* 4x2 Zone grid */}
        <div className="relative z-10 grid grid-cols-4 grid-rows-2 gap-2 h-full mx-6">
          {zones.map((zone) => {
            const isWarning = zone.status === 'warning'
            const doColor = zone.do < 2.0 ? doColors.low : doColors.normal

            return (
              <div
                key={zone.id}
                className="rounded-md p-2 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:brightness-110"
                style={{
                  backgroundColor: isWarning
                    ? 'rgba(255, 204, 0, 0.08)'
                    : 'rgba(0, 80, 100, 0.25)',
                  border: isWarning
                    ? '1px solid rgba(255, 204, 0, 0.5)'
                    : '1px solid rgba(0, 100, 140, 0.3)',
                  boxShadow: isWarning
                    ? '0 0 8px rgba(255, 204, 0, 0.15)'
                    : '0 0 4px rgba(0, 100, 140, 0.1)',
                }}
              >
                {/* Zone number */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-secondary">
                    {zone.id}区
                  </span>
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: isWarning ? '#ffcc00' : '#00ff88',
                      boxShadow: isWarning
                        ? '0 0 4px #ffcc00'
                        : '0 0 4px #00ff88',
                    }}
                  />
                </div>

                {/* DO value */}
                <div className="flex items-baseline gap-0.5">
                  <span
                    className="text-lg font-bold font-mono-data"
                    style={{ color: doColor }}
                  >
                    {zone.do.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-text-tertiary">mg/L</span>
                  {zone.doTrend === 'down' && (
                    <span className="text-[10px] text-status-warning ml-auto">↓</span>
                  )}
                </div>

                {/* Valve + Airflow */}
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-text-data">阀 {zone.valve}%</span>
                  <span className="text-text-secondary">{zone.airflow.toLocaleString()} m³/h</span>
                </div>

                {/* Energy percent */}
                <div className="flex items-center gap-1">
                  <div className="flex-1 h-1 rounded-full bg-bg-primary overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(zone.energyPercent / 20) * 100}%`,
                        backgroundColor: isWarning ? '#ffcc00' : '#00e5ff',
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-text-tertiary w-8 text-right">{zone.energyPercent}%</span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: isWarning ? '#ffcc00' : '#00ff88',
                    }}
                  />
                  <span
                    className="text-[10px]"
                    style={{ color: isWarning ? '#ffcc00' : '#00ff88' }}
                  >
                    {isWarning ? '需关注' : '正常'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Time range slider */}
        <div className="relative z-10 mt-2 px-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-text-tertiary">拖动时间窗查看历史波动</span>
            <span className="text-[10px] text-text-tertiary font-mono-data">06:00 - 18:00</span>
          </div>
          <div className="relative w-full h-4">
            {/* Track */}
            <div className="absolute top-1.5 left-0 right-0 h-1 rounded-full bg-bg-primary" />
            {/* Selected range */}
            <div
              className="absolute top-1.5 h-1 rounded-full"
              style={{
                left: '25%',
                right: '25%',
                backgroundColor: '#00e5ff',
                boxShadow: '0 0 6px rgba(0, 229, 255, 0.4)',
              }}
            />
            {/* Left handle */}
            <div
              className="absolute top-0.5 w-3 h-3 rounded-full border-2 cursor-pointer"
              style={{
                left: '25%',
                transform: 'translateX(-50%)',
                borderColor: '#00e5ff',
                backgroundColor: '#0a1a2e',
                boxShadow: '0 0 6px rgba(0, 229, 255, 0.5)',
              }}
            />
            {/* Right handle */}
            <div
              className="absolute top-0.5 w-3 h-3 rounded-full border-2 cursor-pointer"
              style={{
                right: '25%',
                transform: 'translateX(50%)',
                borderColor: '#00e5ff',
                backgroundColor: '#0a1a2e',
                boxShadow: '0 0 6px rgba(0, 229, 255, 0.5)',
              }}
            />
            {/* Time ticks */}
            <div className="absolute top-4 left-0 right-0 flex justify-between text-[9px] text-text-tertiary font-mono-data">
              {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
