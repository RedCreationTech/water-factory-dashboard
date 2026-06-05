import { MousePointer, Timer, Cpu, CheckCircle } from 'lucide-react'
import Panel from '@/components/Panel'

const interactionHints = [
  { icon: <MousePointer size={10} />, text: '点击分区查看联动设备与历史曲线' },
  { icon: <Timer size={10} />, text: '拖动底部时间窗查看历史趋势' },
  { icon: <Cpu size={10} />, text: '一键切换手动/PID/AI模式' },
  { icon: <CheckCircle size={10} />, text: '点击建议值确认下发至PLC' },
]

export default function ModelStatusPanel() {
  return (
    <div className="flex flex-col gap-2">
      <Panel title="模型运行状态" className="flex-shrink-0">
        <div className="flex flex-col gap-2.5 pt-1">
          {/* Model Version */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-text-secondary">模型版本</span>
            <span className="text-xs font-semibold text-text-primary font-mono-data">v3.2.8</span>
          </div>

          {/* Confidence */}
          <div className="flex flex-col gap-1 px-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">置信度</span>
              <span className="text-xs font-semibold text-status-normal font-mono-data">94.6%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-bg-panel overflow-hidden">
              <div
                className="h-full rounded-full bg-status-normal"
                style={{ width: '94.6%' }}
              />
            </div>
          </div>

          {/* Last Training */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-text-secondary">最近训练时间</span>
            <span className="text-xs text-text-primary font-mono-data">2025-05-14 22:18</span>
          </div>

          {/* Inference Cycle */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-text-secondary">推理周期</span>
            <span className="text-xs text-text-primary font-mono-data">60 s</span>
          </div>

          {/* Control Mode */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-text-secondary">当前控制模式</span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-medium text-status-normal"
              style={{ backgroundColor: 'rgba(0, 255, 136, 0.15)', border: '1px solid rgba(0, 255, 136, 0.3)' }}
            >
              AI优化自动
            </span>
          </div>
        </div>
      </Panel>

      {/* Interaction Hints */}
      <div
        className="rounded-md border border-border-primary p-3 flex flex-col gap-1.5"
        style={{ backgroundColor: 'rgba(10, 26, 46, 0.6)' }}
      >
        <div className="panel-title text-xs mb-0.5">交互说明</div>
        {interactionHints.map((h, i) => (
          <div key={i} className="flex items-start gap-1.5 text-[10px] text-text-tertiary leading-tight">
            <span className="text-accent-cyan mt-0.5 flex-shrink-0">{h.icon}</span>
            <span>{h.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
