import { BarChart3, Zap, Droplets, AlertTriangle } from 'lucide-react';

interface ReportCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  status: string;
}

const reportCards: ReportCard[] = [
  {
    title: '运行日报',
    description: '每日运行指标与关键数据汇总',
    icon: <BarChart3 className="w-5 h-5" />,
    iconBg: '#00aaff',
    status: '今日生成 1/1',
  },
  {
    title: '能耗月报',
    description: '能耗分析与节能评估及用电分析',
    icon: <Zap className="w-5 h-5" />,
    iconBg: '#ffcc00',
    status: '本月生成 1/1',
  },
  {
    title: '水质月报',
    description: '水质达标与趋势分析及异常预警',
    icon: <Droplets className="w-5 h-5" />,
    iconBg: '#00e5ff',
    status: '本月生成 1/1',
  },
  {
    title: '异常事件报表',
    description: '异常事件统计与诊断及处置跟踪',
    icon: <AlertTriangle className="w-5 h-5" />,
    iconBg: '#ff8833',
    status: '本月生成 1/1',
  },
];

export default function ReportOverview() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {reportCards.map((card) => (
        <button
          key={card.title}
          className="flex flex-col gap-2.5 p-3 rounded-md border border-border-primary bg-bg-panel hover:border-border-glow transition-all duration-250 text-left group cursor-pointer"
        >
          {/* Icon + Title row */}
          <div className="flex items-center gap-2.5">
            <span
              className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 text-white"
              style={{ backgroundColor: card.iconBg }}
            >
              {card.icon}
            </span>
            <span className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
              {card.title}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-text-tertiary leading-relaxed line-clamp-2">
            {card.description}
          </p>

          {/* Status badge */}
          <div className="flex justify-end">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-status-normal/10 text-status-normal border border-status-normal/20">
              {card.status}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
