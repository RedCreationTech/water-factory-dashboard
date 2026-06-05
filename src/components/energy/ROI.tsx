export default function ROI() {
  return (
    <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-border-primary">
      <div className="panel-title text-[14px]">ROI评估（本月累计）</div>
      <div className="flex items-center gap-4">
        {/* Big ROI number */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-[36px] font-bold text-accent-cyan font-mono-data leading-none">
            3.42
          </span>
          <span className="text-[11px] text-text-secondary mt-1">投资回报率</span>
        </div>

        {/* Detail list */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-text-secondary">节省费用</span>
            <span className="text-[13px] font-semibold text-text-success font-mono-data">
              ¥268,450
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-text-secondary">投资成本</span>
            <span className="text-[13px] font-semibold text-text-danger font-mono-data">
              ¥78,500
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-text-secondary">回收周期</span>
            <span className="text-[13px] font-semibold text-accent-cyan font-mono-data">
              0.9月
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
