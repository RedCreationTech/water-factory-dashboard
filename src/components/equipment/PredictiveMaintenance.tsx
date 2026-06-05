import { useState } from 'react';
import { Fan, RotateCcw, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaintenanceItem {
  id: string;
  name: string;
  label: string;
  risk: 'high' | 'medium' | 'low';
  days: number;
  progress: number;
  icon: 'fan' | 'rotate' | 'arrow';
}

const items: MaintenanceItem[] = [
  {
    id: 'b-02',
    name: '鼓风机',
    label: '#B-02',
    risk: 'medium',
    days: 28,
    progress: 52,
    icon: 'fan',
  },
  {
    id: 'r-07',
    name: '回流泵',
    label: '#R-07',
    risk: 'medium',
    days: 36,
    progress: 61,
    icon: 'rotate',
  },
  {
    id: 'p-03',
    name: '提升泵',
    label: '#P-03',
    risk: 'low',
    days: 58,
    progress: 74,
    icon: 'arrow',
  },
];

const riskColorMap = {
  high: { bg: 'bg-[#ff4444]/10', text: 'text-[#ff4444]', border: 'border-[#ff4444]/40', label: '高风险' },
  medium: { bg: 'bg-[#ffcc00]/10', text: 'text-[#ffcc00]', border: 'border-[#ffcc00]/40', label: '中风险' },
  low: { bg: 'bg-[#00ff88]/10', text: 'text-[#00ff88]', border: 'border-[#00ff88]/40', label: '低风险' },
} as const;

const progressColorMap: Record<string, string> = {
  high: '#ff4444',
  medium: '#ffcc00',
  low: '#00ff88',
};

const iconMap: Record<string, React.ElementType> = {
  fan: Fan,
  rotate: RotateCcw,
  arrow: ArrowUp,
};

interface Props {
  onViewAll?: () => void;
}

export default function PredictiveMaintenance({ onViewAll }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-secondary">待预测维护</span>
          <span className="text-[11px] font-data text-text-tertiary">(12)</span>
        </div>
        <button
          onClick={onViewAll}
          className="text-[11px] text-accent-cyan hover:text-accent-cyan-dim transition-colors cursor-pointer flex items-center gap-0.5"
        >
          查看全部预测维护 &gt;
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 flex flex-col gap-2">
        {items.map((item) => {
          const IconComp = iconMap[item.icon as keyof typeof iconMap] as any;
          const riskStyle = riskColorMap[item.risk as keyof typeof riskColorMap];
          const isHovered = hoveredId === item.id;

          return (
            <div
              key={item.id}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md border transition-all duration-200 cursor-default',
                isHovered ? 'border-border-glow bg-bg-panel-hover' : 'border-border-subtle bg-[rgba(10,26,46,0.5)]'
              )}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Icon */}
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0',
                  riskStyle.bg
                )}
              >
                <IconComp className={cn('w-4 h-4')} style={{ color: (riskStyle.text as string) === 'text-[#ff4444]' ? '#ff4444' : (riskStyle.text as string) === 'text-[#ffcc00]' ? '#ffcc00' : '#00ff88' }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] text-text-primary font-medium">
                    {item.name} {item.label}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded border',
                      riskStyle.bg,
                      riskStyle.text,
                      riskStyle.border
                    )}
                  >
                    {riskStyle.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#0f2540' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.progress}%`,
                        backgroundColor: progressColorMap[item.risk],
                        boxShadow: `0 0 6px ${progressColorMap[item.risk]}40`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-text-tertiary font-data w-16 text-right flex-shrink-0">
                    {item.days}天
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
