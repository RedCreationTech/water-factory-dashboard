import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Legend,
} from 'recharts'

// Generate 30 days of data
const generateData = () => {
  const data = []
  const baseDate = new Date(2024, 3, 15)
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const actual = 65000 + Math.sin(i * 0.3) * 8000 + Math.random() * 5000
    const baseline = 78000 + Math.sin(i * 0.2) * 3000
    const predicted = actual * 1.02 + Math.random() * 2000
    data.push({
      date: `${month}-${day}`,
      actual: Math.round(actual),
      baseline: Math.round(baseline),
      predicted: Math.round(predicted),
      saved: Math.round(baseline - actual),
      saveRate: ((baseline - actual) / baseline * 100).toFixed(1),
    })
  }
  return data
}

const chartData = generateData()

type TabKey = 'day' | 'week' | 'month'

export default function PowerTrendChart() {
  const [activeTab, setActiveTab] = useState<TabKey>('day')
  const tabLabels: { key: TabKey; label: string }[] = [
    { key: 'day', label: '日' },
    { key: 'week', label: '周' },
    { key: 'month', label: '月' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="panel-title text-[14px]">近30日电耗趋势</div>
        <div className="flex gap-1">
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
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff88" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f2540" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#5a7a94', fontSize: 10 }}
              axisLine={{ stroke: '#1a3a5c' }}
              tickLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fill: '#5a7a94', fontSize: 10 }}
              axisLine={{ stroke: '#1a3a5c' }}
              tickLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              domain={[40000, 90000]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(5, 14, 26, 0.95)',
                border: '1px solid #00c8ff',
                borderRadius: 4,
                padding: '8px 12px',
                fontSize: 12,
              }}
              labelStyle={{ color: '#a0b4c8', marginBottom: 4 }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  actual: '实际电耗',
                  baseline: '基准电耗',
                  predicted: '预测电耗',
                }
                return [`${value.toLocaleString()} kWh`, labels[name] || name]
              }}
            />
            <Legend
              verticalAlign="top"
              height={24}
              iconSize={8}
              iconType="line"
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  actual: '实际电耗',
                  baseline: '基准电耗',
                  predicted: '预测电耗',
                }
                return <span style={{ color: '#a0b4c8', fontSize: 11 }}>{labels[value] || value}</span>
              }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#00e5ff"
              strokeWidth={1.5}
              fill="url(#actualGrad)"
              dot={false}
              activeDot={{ r: 3, fill: '#00e5ff' }}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#5a7a94"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#00ff88"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="url(#predGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[10px] text-text-tertiary mt-1">
        交互说明: 框选区间进行对比分析
      </div>
    </div>
  )
}
