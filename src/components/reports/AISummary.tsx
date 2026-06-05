import { CheckCircle, Sparkles } from 'lucide-react';

const insights = [
  '出水达标率稳定在99%以上，水质整体优良，氨氮和总氮指标波动较小。',
  '综合能耗下降2.9%，节电率提升18.6%，节能成效显著。',
  '碳减排量同比增长18.3%，低碳运行趋势明显。',
  '异常事件16起，环比下降12.5%，已完成处置率93.8%。',
];

export default function AISummary() {
  return (
    <div className="flex flex-col gap-3 h-full">
      {/* AI Badge */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent-cyan" />
        <span className="text-sm font-medium text-accent-cyan">AI 智能总结</span>
      </div>

      {/* Insight items */}
      <div className="flex flex-col gap-2.5 flex-1">
        {insights.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-status-normal flex-shrink-0 mt-0.5" />
            <span className="text-xs text-text-secondary leading-relaxed">{item}</span>
          </div>
        ))}
      </div>

      {/* AI Score */}
      <div className="flex items-center gap-3 pt-2 border-t border-border-subtle">
        <span className="text-xs text-text-tertiary">AI综合评分</span>
        <span className="text-xl font-bold text-text-primary font-mono-data">92.6</span>
        <span className="text-xs text-text-secondary">分</span>
        <span className="text-xs font-medium text-status-normal">(良好)</span>
        {/* Progress bar */}
        <div className="flex-1 h-2 rounded-full bg-bg-panel overflow-hidden ml-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-status-normal to-accent-cyan"
            style={{ width: '92.6%' }}
          />
        </div>
      </div>
    </div>
  );
}
