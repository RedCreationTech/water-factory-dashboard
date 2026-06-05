import { useState } from 'react'
import { Zap, Beaker, Leaf, DollarSign } from 'lucide-react'

const tabData = {
  today: {
    savings: [
      { icon: Zap, label: '节电量', value: '18,650', unit: 'kWh', change: '9.2%', up: false },
      { icon: Beaker, label: '节药量', value: '125.6', unit: 'kg', change: '6.8%', up: false },
      { icon: Leaf, label: '碳减排量', value: '8.92', unit: 'tCO₂e', change: '8.4%', up: false },
      { icon: DollarSign, label: '折算费用', value: '¥12,680', unit: '', change: '15.1%', up: true },
    ],
  },
  week: {
    savings: [
      { icon: Zap, label: '节电量', value: '128,500', unit: 'kWh', change: '12.3%', up: true },
      { icon: Beaker, label: '节药量', value: '892.4', unit: 'kg', change: '5.6%', up: false },
      { icon: Leaf, label: '碳减排量', value: '62.15', unit: 'tCO₂e', change: '10.2%', up: true },
      { icon: DollarSign, label: '折算费用', value: '¥88,760', unit: '', change: '11.8%', up: true },
    ],
  },
  month: {
    savings: [
      { icon: Zap, label: '节电量', value: '536,200', unit: 'kWh', change: '8.6%', up: true },
      { icon: Beaker, label: '节药量', value: '3,845.6', unit: 'kg', change: '3.2%', up: false },
      { icon: Leaf, label: '碳减排量', value: '268.45', unit: 'tCO₂e', change: '9.8%', up: true },
      { icon: DollarSign, label: '折算费用', value: '¥268,450', unit: '', change: '8.6%', up: true },
    ],
  },
}

type TabKey = keyof typeof tabData

export default function SavingsPanel() {
  const [activeTab, setActiveTab] = useState<TabKey>('today')
  const data = tabData[activeTab]
  const tabLabels: { key: TabKey; label: string }[] = [
    { key: 'today', label: '今日' },
    { key: 'week', label: '本周' },
    { key: 'month', label: '本月' },
  ]

  return (
    <div className="flex flex-col gap-3">
      {/* Tab toggle */}
      <div className="flex gap-1">
        {tabLabels.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              activeTab === t.key
                ? 'bg-accent-cyan text-[#050e1a]'
                : 'bg-transparent text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Savings items */}
      <div className="flex flex-col gap-3">
        {data.savings.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-2 rounded border border-border-primary bg-[rgba(5,14,26,0.5)]"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#0f2540]">
                <Icon className="w-4 h-4 text-accent-cyan" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-text-secondary">{item.label}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[16px] font-bold text-text-primary font-mono-data">
                    {item.value}
                  </span>
                  {item.unit && (
                    <span className="text-[11px] text-text-tertiary">{item.unit}</span>
                  )}
                </div>
              </div>
              <div
                className={`text-[11px] font-medium ${
                  item.up ? 'text-text-success' : 'text-text-danger'
                }`}
              >
                {item.up ? '↑' : '↓'} {item.change}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
