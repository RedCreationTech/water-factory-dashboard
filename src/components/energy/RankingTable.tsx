const rankingData = [
  { rank: 1, name: '生化处理车间', saving: 58420, rate: '21.6%' },
  { rank: 2, name: '污泥处理车间', saving: 32760, rate: '17.8%' },
  { rank: 3, name: '预处理车间', saving: 18950, rate: '14.2%' },
  { rank: 4, name: '深度处理车间', saving: 15680, rate: '12.6%' },
  { rank: 5, name: '辅助生产车间', saving: 9830, rate: '9.8%' },
  { rank: 6, name: '办公生活区', saving: 4560, rate: '6.2%' },
]

const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']
const maxSaving = Math.max(...rankingData.map((d) => d.saving))

export default function RankingTable() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="panel-title text-[14px]">月度节能排名</div>
        <select className="bg-[#0f2540] text-text-secondary text-[11px] rounded px-2 py-0.5 border border-border-primary outline-none">
          <option>本月</option>
          <option>上月</option>
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[rgba(15,37,64,0.8)]">
              <th className="text-left px-2 py-1.5 text-[11px] text-text-secondary font-medium border-b border-border-subtle w-10">
                排名
              </th>
              <th className="text-left px-2 py-1.5 text-[11px] text-text-secondary font-medium border-b border-border-subtle">
                车间/工段
              </th>
              <th className="text-left px-2 py-1.5 text-[11px] text-text-secondary font-medium border-b border-border-subtle w-24">
                节电量
              </th>
              <th className="text-left px-2 py-1.5 text-[11px] text-text-secondary font-medium border-b border-border-subtle w-16">
                节能率
              </th>
            </tr>
          </thead>
          <tbody>
            {rankingData.map((row, idx) => (
              <tr
                key={idx}
                className="transition-colors duration-200 hover:bg-bg-panel-hover"
                style={{ height: 30, backgroundColor: idx % 2 === 0 ? '#0a1a2e' : '#0d1f35' }}
              >
                <td className="px-2 py-1">
                  {row.rank <= 3 ? (
                    <span
                      className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: rankColors[row.rank - 1],
                        color: row.rank === 1 ? '#1a1a00' : '#1a1a1a',
                      }}
                    >
                      {row.rank}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1a3a5c] text-[10px] text-text-tertiary">
                      {row.rank}
                    </span>
                  )}
                </td>
                <td className="px-2 py-1 text-[11px] text-text-primary">{row.name}</td>
                <td className="px-2 py-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 rounded-full bg-[#0f2540] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-chart-cyan"
                        style={{ width: `${(row.saving / maxSaving) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-accent-cyan font-mono-data">
                      {row.saving.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-1 text-[11px] text-accent-cyan font-mono-data">{row.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[10px] text-text-tertiary mt-1">
        交互说明: 点击策略查看收益来源
      </div>
    </div>
  )
}
