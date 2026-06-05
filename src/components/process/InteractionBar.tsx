const hints = [
  '点击节点切换右侧详情',
  '双击节点进入设备画面',
  '点击曝气分区查看联动参数',
  '点击曲线切换 24h / 7d',
  '点击告警可快速定位',
]

export default function InteractionBar() {
  return (
    <div className="flex items-center gap-4 px-4 py-2 text-[11px] text-text-tertiary bg-bg-card border-t border-border-subtle">
      <span className="text-text-secondary font-medium flex-shrink-0">交互说明:</span>
      {hints.map((hint, idx) => (
        <span key={idx} className="inline-flex items-center gap-1 flex-shrink-0">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-bg-panel text-[9px] text-accent-cyan border border-border-primary flex-shrink-0">
            {idx + 1}
          </span>
          <span>{hint}</span>
        </span>
      ))}
    </div>
  )
}
