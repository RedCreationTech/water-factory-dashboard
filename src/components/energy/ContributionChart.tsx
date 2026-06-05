import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const tabData = {
  today: [
    { name: '风机优化', value: 5850, percent: 46.2, color: '#00e5ff' },
    { name: '阀门优化', value: 2350, percent: 18.6, color: '#4488ff' },
    { name: '加药优化', value: 2060, percent: 16.3, color: '#00ff88' },
    { name: '回流优化', value: 1860, percent: 14.7, color: '#ffcc00' },
    { name: '其他优化', value: 560, percent: 4.2, color: '#5a7a94' },
  ],
  week: [
    { name: '风机优化', value: 42150, percent: 47.1, color: '#00e5ff' },
    { name: '阀门优化', value: 16250, percent: 18.2, color: '#4488ff' },
    { name: '加药优化', value: 14860, percent: 16.6, color: '#00ff88' },
    { name: '回流优化', value: 13250, percent: 14.8, color: '#ffcc00' },
    { name: '其他优化', value: 2950, percent: 3.3, color: '#5a7a94' },
  ],
  month: [
    { name: '风机优化', value: 168450, percent: 46.8, color: '#00e5ff' },
    { name: '阀门优化', value: 64850, percent: 18.0, color: '#4488ff' },
    { name: '加药优化', value: 58960, percent: 16.4, color: '#00ff88' },
    { name: '回流优化', value: 53250, percent: 14.8, color: '#ffcc00' },
    { name: '其他优化', value: 14550, percent: 4.0, color: '#5a7a94' },
  ],
}

type TabKey = keyof typeof tabData

export default function ContributionChart() {
  const [activeTab, setActiveTab] = useState<TabKey>('today')
  const data = tabData[activeTab]
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data])
  const totalPercent = useMemo(
    () => (data.reduce((s, d) => s + d.percent * (d.value / total), 0)).toFixed(1),
    [data, total]
  )

  const tabLabels: { key: TabKey; label: string }[] = [
    { key: 'today', label: '今日' },
    { key: 'week', label: '本周' },
    { key: 'month', label: '本月' },
  ]

  return (
    <div className="flex flex-col gap-2">
      {/* Tab toggle */}
      <div className="flex justify-end gap-1">
        {tabLabels.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              activeTab === t.key
                ? 'bg-accent-cyan text-[#050e1a]'
                : 'bg-transparent text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Donut chart */}
      <div className="relative" style={{ height: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[16px] font-bold text-text-primary font-mono-data">
            {total.toLocaleString()}
          </span>
          <span className="text-[10px] text-text-tertiary">kWh</span>
          <span className="text-[11px] text-accent-cyan font-mono-data">{totalPercent}%</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] text-text-secondary">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-text-tertiary font-mono-data">
                {item.value.toLocaleString()} kWh
              </span>
              <span
                className="text-[11px] font-medium font-mono-data w-10 text-right"
                style={{ color: item.color }}
              >
                {item.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
