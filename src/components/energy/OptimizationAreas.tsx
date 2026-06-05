import { ArrowUp } from 'lucide-react'

const areas = [
  { rank: 1, name: '生化池曝气系统', space: '12.3%', saving: '2,680 kWh/d' },
  { rank: 2, name: '回流系统泵组', space: '8.7%', saving: '1,890 kWh/d' },
  { rank: 3, name: '污泥脱水系统', space: '6.5%', saving: '1,420 kWh/d' },
]

const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']

export default function OptimizationAreas() {
  return (
    <div className="flex flex-col gap-2 mt-3">
      <div className="panel-title text-[14px]">建议进一步优化区域</div>
      <div className="flex flex-col gap-2">
        {areas.map((area, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 p-2 rounded bg-[rgba(5,14,26,0.4)]"
          >
            {/* Rank badge */}
            <div
              className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold flex-shrink-0"
              style={{
                backgroundColor: rankColors[idx],
                color: idx === 0 ? '#1a1a00' : '#1a1a1a',
              }}
            >
              {area.rank}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-text-primary truncate">{area.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-text-tertiary">可优化空间 {area.space}</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <ArrowUp className="w-3 h-3 text-accent-cyan" />
              <span className="text-[11px] font-semibold text-accent-cyan font-mono-data">
                {area.saving}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI prediction note */}
      <div className="mt-1 text-[11px] text-text-secondary italic">
        依据AI模型预测，优化后预计可降低电耗
        <span className="text-accent-cyan font-semibold"> 10.2%</span>
      </div>
    </div>
  )
}
