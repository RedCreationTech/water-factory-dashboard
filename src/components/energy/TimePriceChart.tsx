import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// Generate 24h data
const generateData = () => {
  const data = []
  for (let hour = 0; hour <= 24; hour++) {
    let price: number
    if (hour < 8) price = 0.3
    else if (hour < 12) price = 0.62
    else if (hour < 14) price = 1.02
    else if (hour < 19) price = 0.62
    else if (hour < 22) price = 1.02
    else price = 0.3

    const baseLoad = 2500 + Math.sin((hour - 6) * Math.PI / 12) * 800
    const actualLoad = baseLoad + Math.random() * 300
    const optimizedLoad = actualLoad * 0.85 + Math.random() * 150

    data.push({
      hour: `${String(hour).padStart(2, '0')}:00`,
      price,
      actualLoad: Math.round(actualLoad),
      optimizedLoad: Math.round(optimizedLoad),
    })
  }
  return data
}

export default function TimePriceChart() {
  const data = useMemo(() => generateData(), [])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="panel-title text-[14px]">分时电价与负荷响应</div>
        <span className="text-[11px] text-text-tertiary">单位: 元/kWh</span>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="actualLoadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="optLoadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff88" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f2540" />
            <XAxis
              dataKey="hour"
              tick={{ fill: '#5a7a94', fontSize: 9 }}
              axisLine={{ stroke: '#1a3a5c' }}
              tickLine={false}
              interval={2}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#5a7a94', fontSize: 10 }}
              axisLine={{ stroke: '#1a3a5c' }}
              tickLine={false}
              domain={[0, 1.2]}
              tickFormatter={(v: number) => v.toFixed(2)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#5a7a94', fontSize: 10 }}
              axisLine={{ stroke: '#1a3a5c' }}
              tickLine={false}
              domain={[0, 4000]}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
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
                  price: '分时电价',
                  actualLoad: '实际负荷',
                  optimizedLoad: '优化后负荷',
                }
                const unit = name === 'price' ? '元/kWh' : 'kW'
                return [`${value.toLocaleString()} ${unit}`, labels[name] || name]
              }}
            />
            <Legend
              verticalAlign="top"
              height={24}
              iconSize={8}
              iconType="line"
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  price: '分时电价',
                  actualLoad: '实际负荷',
                  optimizedLoad: '优化后负荷',
                }
                return <span style={{ color: '#a0b4c8', fontSize: 11 }}>{labels[value] || value}</span>
              }}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="actualLoad"
              stroke="#00e5ff"
              strokeWidth={1.5}
              fill="url(#actualLoadGrad)"
              dot={false}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="optimizedLoad"
              stroke="#00ff88"
              strokeWidth={1.5}
              fill="url(#optLoadGrad)"
              dot={false}
            />
            <Area
              yAxisId="left"
              type="stepAfter"
              dataKey="price"
              stroke="#ffcc00"
              strokeWidth={1.5}
              fill="none"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Price labels */}
      <div className="flex justify-between px-1 mt-0.5">
        <span className="text-[9px] text-text-tertiary">谷 0.30</span>
        <span className="text-[9px] text-text-tertiary">平 0.62</span>
        <span className="text-[9px] text-status-warning">峰 1.02</span>
        <span className="text-[9px] text-text-tertiary">平 0.62</span>
        <span className="text-[9px] text-text-tertiary">谷 0.30</span>
      </div>

      <div className="text-[10px] text-text-tertiary mt-0.5">
        交互说明: 切换日/周/月维度
      </div>
    </div>
  )
}
