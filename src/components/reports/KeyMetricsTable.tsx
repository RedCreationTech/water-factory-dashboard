import { cn } from '@/lib/utils';

interface MetricRow {
  name: string;
  current: string;
  previous: string;
  yoy: string;
  positive: boolean;
}

const metrics: MetricRow[] = [
  { name: '处理量(m³)', current: '1,183,420', previous: '1,062,380', yoy: '▲11.4%', positive: true },
  { name: '出水达标率(%)', current: '99.32', previous: '98.71', yoy: '▲0.61%', positive: true },
  { name: '综合能耗(kWh/m³)', current: '0.332', previous: '0.342', yoy: '▼2.9%', positive: true },
  { name: '节电率(%)', current: '18.6', previous: '16.3', yoy: '▲2.3%', positive: true },
  { name: '碳减排量(tCO2e)', current: '35.62', previous: '30.11', yoy: '▲18.3%', positive: true },
  { name: '平均出水COD(mg/L)', current: '256', previous: '238', yoy: '▲7.6%', positive: false },
  { name: '平均出水氨氮(mg/L)', current: '18.6', previous: '19.2', yoy: '▼3.1%', positive: true },
];

function MiniSparkline({ positive }: { positive: boolean }) {
  const points = positive
    ? [20, 22, 18, 25, 20, 28, 24, 30, 26, 28]
    : [30, 28, 32, 25, 28, 22, 26, 20, 24, 22];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 60;
  const h = 20;
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
        stroke={positive ? '#00ff88' : '#ff4444'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function KeyMetricsTable() {
  return (
    <div className="overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="text-left py-1.5 px-2 text-xs text-text-tertiary font-medium">指标</th>
            <th className="text-right py-1.5 px-2 text-xs text-text-tertiary font-medium">本期</th>
            <th className="text-right py-1.5 px-2 text-xs text-text-tertiary font-medium">上期</th>
            <th className="text-right py-1.5 px-2 text-xs text-text-tertiary font-medium">同比</th>
            <th className="text-center py-1.5 px-2 text-xs text-text-tertiary font-medium">趋势</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((row, idx) => (
            <tr
              key={row.name}
              className={cn(
                'border-b border-border-subtle/50 transition-colors hover:bg-bg-panel-hover',
                idx % 2 === 0 ? 'bg-transparent' : 'bg-bg-panel/30'
              )}
            >
              <td className="py-1.5 px-2 text-xs text-text-secondary">{row.name}</td>
              <td className="py-1.5 px-2 text-xs text-text-primary font-mono-data text-right">
                {row.current}
              </td>
              <td className="py-1.5 px-2 text-xs text-text-tertiary font-mono-data text-right">
                {row.previous}
              </td>
              <td
                className={cn(
                  'py-1.5 px-2 text-xs font-mono-data text-right font-medium',
                  row.positive ? 'text-text-success' : 'text-text-danger'
                )}
              >
                {row.yoy}
              </td>
              <td className="py-1.5 px-2 flex justify-center">
                <MiniSparkline positive={row.positive} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
