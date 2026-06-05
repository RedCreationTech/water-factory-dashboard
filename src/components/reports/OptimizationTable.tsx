import { cn } from '@/lib/utils';

interface OptRow {
  name: string;
  value: string;
  numValue: number;
  maxValue: number;
}

const strategies: OptRow[] = [
  { name: '智能曝气优化', value: '58,420', numValue: 58420, maxValue: 58420 },
  { name: '回流比优化', value: '27,360', numValue: 27360, maxValue: 58420 },
  { name: '空曝时间优化', value: '18,950', numValue: 18950, maxValue: 58420 },
  { name: '水泵变频优化', value: '16,860', numValue: 16860, maxValue: 58420 },
  { name: '加药联动优化', value: '8,780', numValue: 8780, maxValue: 58420 },
  { name: '其他优化策略', value: '7,240', numValue: 7240, maxValue: 58420 },
];

function MiniTrendSparkline({ seed }: { seed: number }) {
  const points = [
    15 + seed * 3,
    18 + seed * 2,
    14 + seed * 4,
    22 + seed * 2,
    19 + seed * 3,
    25 + seed,
    21 + seed * 3,
    28 + seed,
  ];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 50;
  const h = 18;
  const pad = 2;

  const pts = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - pad - ((p - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0">
      <polyline
        points={pts}
        fill="none"
        stroke="#00e5ff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function OptimizationTable() {
  const total = strategies.reduce((s, r) => s + r.numValue, 0);

  return (
    <div className="overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="text-left py-1.5 px-1 text-xs text-text-tertiary font-medium">优化策略</th>
            <th className="text-right py-1.5 px-1 text-xs text-text-tertiary font-medium">节电量(kWh)</th>
            <th className="text-center py-1.5 px-1 text-xs text-text-tertiary font-medium">占比</th>
            <th className="text-center py-1.5 px-1 text-xs text-text-tertiary font-medium">贡献趋势</th>
          </tr>
        </thead>
        <tbody>
          {strategies.map((row, idx) => {
            const pct = ((row.numValue / total) * 100).toFixed(1);
            const barWidth = (row.numValue / row.maxValue) * 100;
            return (
              <tr
                key={row.name}
                className={cn(
                  'border-b border-border-subtle/50 transition-colors hover:bg-bg-panel-hover',
                  idx % 2 === 0 ? 'bg-transparent' : 'bg-bg-panel/30'
                )}
              >
                <td className="py-1 px-1 text-xs text-text-secondary">{row.name}</td>
                <td className="py-1 px-1">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Progress bar background */}
                    <div className="w-16 h-1.5 rounded-full bg-bg-panel overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-status-normal"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-primary font-mono-data w-14 text-right">
                      {row.value}
                    </span>
                  </div>
                </td>
                <td className="py-1 px-1 text-xs text-text-tertiary font-mono-data text-center">
                  {pct}%
                </td>
                <td className="py-1 px-1 flex justify-center">
                  <MiniTrendSparkline seed={idx * 2} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
