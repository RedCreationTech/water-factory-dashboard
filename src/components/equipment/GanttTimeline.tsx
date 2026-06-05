import { useState, useCallback } from 'react';

interface TimeSegment {
  start: number; // 0-1 normalized
  end: number;   // 0-1 normalized
  status: 'normal' | 'standby' | 'warning' | 'danger' | 'offline';
}

interface EquipmentRow {
  name: string;
  segments: TimeSegment[];
}

const equipmentRows: EquipmentRow[] = [
  {
    name: '鼓风机#B-02',
    segments: [
      { start: 0.0, end: 0.15, status: 'normal' },
      { start: 0.15, end: 0.18, status: 'standby' },
      { start: 0.18, end: 0.42, status: 'normal' },
      { start: 0.42, end: 0.45, status: 'warning' },
      { start: 0.45, end: 0.72, status: 'normal' },
      { start: 0.72, end: 0.78, status: 'standby' },
      { start: 0.78, end: 1.0, status: 'normal' },
    ],
  },
  {
    name: '回流泵#R-01',
    segments: [
      { start: 0.0, end: 0.25, status: 'normal' },
      { start: 0.25, end: 0.30, status: 'warning' },
      { start: 0.30, end: 0.55, status: 'normal' },
      { start: 0.55, end: 0.62, status: 'danger' },
      { start: 0.62, end: 0.85, status: 'normal' },
      { start: 0.85, end: 0.90, status: 'standby' },
      { start: 0.90, end: 1.0, status: 'normal' },
    ],
  },
  {
    name: '提升泵#P-01',
    segments: [
      { start: 0.0, end: 0.08, status: 'standby' },
      { start: 0.08, end: 0.35, status: 'normal' },
      { start: 0.35, end: 0.40, status: 'standby' },
      { start: 0.40, end: 0.65, status: 'normal' },
      { start: 0.65, end: 0.70, status: 'warning' },
      { start: 0.70, end: 0.92, status: 'normal' },
      { start: 0.92, end: 1.0, status: 'normal' },
    ],
  },
  {
    name: '加药泵#D-01',
    segments: [
      { start: 0.0, end: 0.20, status: 'normal' },
      { start: 0.20, end: 0.28, status: 'offline' },
      { start: 0.28, end: 0.50, status: 'normal' },
      { start: 0.50, end: 0.58, status: 'standby' },
      { start: 0.58, end: 0.82, status: 'normal' },
      { start: 0.82, end: 0.88, status: 'warning' },
      { start: 0.88, end: 1.0, status: 'normal' },
    ],
  },
  {
    name: '在线仪表',
    segments: [
      { start: 0.0, end: 0.38, status: 'normal' },
      { start: 0.38, end: 0.43, status: 'warning' },
      { start: 0.43, end: 0.68, status: 'normal' },
      { start: 0.68, end: 0.73, status: 'standby' },
      { start: 0.73, end: 0.95, status: 'normal' },
      { start: 0.95, end: 0.97, status: 'warning' },
      { start: 0.97, end: 1.0, status: 'normal' },
    ],
  },
];

const statusColorMap: Record<string, string> = {
  normal: '#00ff88',
  standby: '#4488ff',
  warning: '#ffcc00',
  danger: '#ff4444',
  offline: '#888888',
};

const statusLabelMap: Record<string, string> = {
  normal: '运行中',
  standby: '待机',
  warning: '报警',
  danger: '故障',
  offline: '离线',
};

const timeLabels = ['10:00', '14:00', '18:00', '22:00', '02:00', '06:00', '10:00'];

export default function GanttTimeline() {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    rowName: string;
    segment: TimeSegment;
  } | null>(null);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, rowName: string, segment: TimeSegment) => {
      const rect = (e.currentTarget as HTMLElement).closest('.gantt-container')?.getBoundingClientRect();
      if (!rect) return;
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        rowName,
        segment,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <div className="gantt-container relative w-full h-full flex flex-col">
      {/* Header: time labels */}
      <div className="flex items-center mb-1 pl-[90px]">
        {timeLabels.map((label, i) => (
          <div
            key={i}
            className="flex-1 text-[10px] text-text-tertiary font-data text-center"
            style={{ marginLeft: i === 0 ? 0 : undefined }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 flex flex-col gap-1.5 justify-center">
        {equipmentRows.map((row) => (
          <div key={row.name} className="flex items-center gap-2">
            {/* Y-axis label */}
            <div className="w-[90px] text-[11px] text-text-secondary text-right flex-shrink-0 truncate">
              {row.name}
            </div>

            {/* Bar track */}
            <div className="flex-1 h-[20px] relative rounded-sm overflow-hidden" style={{ backgroundColor: '#0a1a2e' }}>
              {/* Vertical grid lines */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px"
                  style={{
                    left: `${((i + 1) / 6) * 100}%`,
                    backgroundColor: '#1a3a5c',
                  }}
                />
              ))}

              {/* Segments */}
              {row.segments.map((seg, idx) => {
                const left = seg.start * 100;
                const width = (seg.end - seg.start) * 100;
                return (
                  <div
                    key={idx}
                    className="absolute top-0.5 bottom-0.5 rounded-sm cursor-pointer transition-opacity duration-150 hover:opacity-80"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: statusColorMap[seg.status],
                      opacity: 0.85,
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, row.name, seg)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 pointer-events-none px-3 py-2 rounded border"
          style={{
            left: Math.min(tooltip.x + 10, 280),
            top: tooltip.y - 40,
            backgroundColor: 'rgba(5, 14, 26, 0.95)',
            borderColor: '#00c8ff',
            boxShadow: '0 0 12px rgba(0, 229, 255, 0.3)',
          }}
        >
          <div className="text-[11px] text-text-secondary mb-0.5">{tooltip.rowName}</div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: statusColorMap[tooltip.segment.status],
                boxShadow: `0 0 4px ${statusColorMap[tooltip.segment.status]}`,
              }}
            />
            <span className="text-[12px] text-text-primary font-medium">
              {statusLabelMap[tooltip.segment.status]}
            </span>
            <span className="text-[11px] text-text-tertiary">
              ({Math.round(tooltip.segment.start * 100)}% - {Math.round(tooltip.segment.end * 100)}%)
            </span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-3 mt-1 pl-[90px]">
        {Object.entries(statusLabelMap).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: statusColorMap[key] }}
            />
            <span className="text-[10px] text-text-tertiary">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
