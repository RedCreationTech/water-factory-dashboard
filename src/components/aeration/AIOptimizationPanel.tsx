interface FanRow {
  id: string
  current: number
  aiSet: number
  change: number
}

interface ValveRow {
  zone: string
  current: number
  aiSet: number
  change: number
}

const fanData: FanRow[] = [
  { id: '#1', current: 46.5, aiSet: 42.0, change: -4.5 },
  { id: '#2', current: 46.0, aiSet: 41.5, change: -4.5 },
  { id: '#3', current: 47.0, aiSet: 43.5, change: -3.5 },
  { id: '#4', current: 45.2, aiSet: 41.0, change: -4.2 },
]

const valveData: ValveRow[] = [
  { zone: '1区', current: 58, aiSet: 60, change: +2 },
  { zone: '2区', current: 64, aiSet: 62, change: -2 },
  { zone: '3区', current: 72, aiSet: 68, change: -4 },
  { zone: '4区', current: 53, aiSet: 55, change: +2 },
  { zone: '5区', current: 70, aiSet: 66, change: -4 },
  { zone: '6区', current: 60, aiSet: 62, change: +2 },
  { zone: '7区', current: 55, aiSet: 56, change: +1 },
  { zone: '8区', current: 62, aiSet: 60, change: -2 },
]

export default function AIOptimizationPanel() {
  return (
    <div
      className="w-[280px] flex flex-col gap-2 rounded-md border border-border-primary overflow-hidden flex-shrink-0"
      style={{ backgroundColor: 'rgba(10, 26, 46, 0.85)' }}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1 flex-shrink-0">
        <div className="panel-title text-sm">AI优化输出设定值</div>
      </div>
      <div className="px-3 pb-1 text-[10px] text-text-tertiary">点击建议值确认下发</div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3 flex flex-col gap-3">
        {/* Fan Frequency Table */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-secondary">风机最优频率设定 (Hz)</span>
          <div className="w-full overflow-hidden rounded border border-border-subtle">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr style={{ backgroundColor: 'rgba(15, 37, 64, 0.8)' }}>
                  <th className="text-left px-2 py-1 text-text-tertiary font-medium">风机</th>
                  <th className="text-right px-2 py-1 text-text-tertiary font-medium">当前值</th>
                  <th className="text-right px-2 py-1 text-text-tertiary font-medium">AI设定</th>
                  <th className="text-right px-2 py-1 text-text-tertiary font-medium">变化</th>
                </tr>
              </thead>
              <tbody>
                {fanData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-bg-panel-hover"
                    style={{ backgroundColor: idx % 2 === 0 ? '#0a1a2e' : '#0d1f35', height: 28 }}
                  >
                    <td className="px-2 py-0.5 text-text-secondary font-mono-data">{row.id}</td>
                    <td className="px-2 py-0.5 text-right text-text-secondary font-mono-data">{row.current.toFixed(1)}</td>
                    <td className="px-2 py-0.5 text-right text-accent-cyan font-semibold font-mono-data">{row.aiSet.toFixed(1)}</td>
                    <td className="px-2 py-0.5 text-right text-status-success font-mono-data">
                      ↓ {row.change.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Valve Opening Table */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-secondary">分区阀门最优开度 (%)</span>
          <div className="w-full overflow-hidden rounded border border-border-subtle">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr style={{ backgroundColor: 'rgba(15, 37, 64, 0.8)' }}>
                  <th className="text-left px-2 py-1 text-text-tertiary font-medium">分区</th>
                  <th className="text-right px-2 py-1 text-text-tertiary font-medium">当前值</th>
                  <th className="text-right px-2 py-1 text-text-tertiary font-medium">AI设定</th>
                  <th className="text-right px-2 py-1 text-text-tertiary font-medium">变化</th>
                </tr>
              </thead>
              <tbody>
                {valveData.map((row, idx) => (
                  <tr
                    key={row.zone}
                    className="transition-colors hover:bg-bg-panel-hover"
                    style={{ backgroundColor: idx % 2 === 0 ? '#0a1a2e' : '#0d1f35', height: 28 }}
                  >
                    <td className="px-2 py-0.5 text-text-secondary">{row.zone}</td>
                    <td className="px-2 py-0.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className="w-8 h-1 rounded-full bg-bg-primary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-text-tertiary"
                            style={{ width: `${row.current}%` }}
                          />
                        </div>
                        <span className="text-text-secondary font-mono-data w-6">{row.current}</span>
                      </div>
                    </td>
                    <td className="px-2 py-0.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className="w-8 h-1 rounded-full bg-bg-primary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent-cyan"
                            style={{ width: `${row.aiSet}%` }}
                          />
                        </div>
                        <span className="text-accent-cyan font-semibold font-mono-data w-6">{row.aiSet}</span>
                      </div>
                    </td>
                    <td
                      className="px-2 py-0.5 text-right font-mono-data"
                      style={{ color: row.change > 0 ? '#ff4444' : '#00ff88' }}
                    >
                      {row.change > 0 ? '↑' : '↓'} {row.change > 0 ? '+' : ''}{row.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Other recommendations */}
        <div className="flex flex-col gap-2 rounded border border-border-subtle p-2" style={{ backgroundColor: 'rgba(10, 26, 46, 0.6)' }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-secondary">回流泵频率建议</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-accent-cyan font-mono-data">38.0</span>
              <span className="text-[10px] text-text-tertiary">Hz</span>
              <span className="text-[10px] text-text-tertiary">(当前 36.5)</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-text-secondary">碳源投加建议</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-accent-cyan font-mono-data">24.5</span>
              <span className="text-[10px] text-text-tertiary">L/h</span>
              <span className="text-[10px] text-text-tertiary">(当前 22.0)</span>
            </div>
          </div>
        </div>

        {/* Revert button */}
        <button
          className="w-full py-2.5 rounded-md text-sm font-medium text-text-primary transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          style={{
            backgroundColor: '#1a3a5c',
            border: '1px solid #2a5a7c',
          }}
        >
          一键回退PID自动
        </button>

        {/* Safety status */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-status-normal text-xs">✓</span>
          <span className="text-xs text-status-normal font-medium">安全限幅状态：正常</span>
        </div>
      </div>
    </div>
  )
}
