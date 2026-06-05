import { memo, useState } from 'react'
import { cn } from '@/lib/utils'

interface RowData {
  indicator: string
  influent: string | number
  primary: string | number
  biochemical: string | number
  secondary: string | number
  effluent: string | number
  standard: string
  unit: string
}

const data: RowData[] = [
  { indicator: 'COD', influent: 268, primary: 96.3, biochemical: 38.2, secondary: 28.7, effluent: 32.6, standard: '≤50', unit: 'mg/L' },
  { indicator: '氨氮', influent: 32.8, primary: 18.7, biochemical: 2.85, secondary: 1.42, effluent: 0.482, standard: '≤5', unit: 'mg/L' },
  { indicator: '总磷', influent: 4.2, primary: 2.1, biochemical: 0.85, secondary: 0.35, effluent: 0.23, standard: '≤0.5', unit: 'mg/L' },
  { indicator: '总氮', influent: 45, primary: 32, biochemical: 12.5, secondary: 9.8, effluent: 8.46, standard: '≤15', unit: 'mg/L' },
  { indicator: 'pH', influent: 7.2, primary: 7.1, biochemical: 7.0, secondary: 7.1, effluent: 7.05, standard: '6-9', unit: '' },
  { indicator: 'DO', influent: '-', primary: '-', biochemical: 2.15, secondary: '-', effluent: 5.8, standard: '≥2', unit: 'mg/L' },
]

function getCellColor(
  indicator: string,
  value: string | number,
  colKey: string,
): string {
  if (colKey === 'influent') return 'text-text-secondary'
  if (value === '-' || value === '') return 'text-text-tertiary'

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return 'text-text-secondary'

  switch (indicator) {
    case 'COD':
      if (colKey === 'effluent') return num <= 50 ? 'text-status-normal' : num <= 60 ? 'text-status-warning' : 'text-status-danger'
      if (colKey === 'secondary') return num <= 30 ? 'text-status-normal' : 'text-status-warning'
      return 'text-text-secondary'
    case '氨氮':
      if (colKey === 'effluent') return num <= 5 ? 'text-status-normal' : num <= 8 ? 'text-status-warning' : 'text-status-danger'
      return 'text-text-secondary'
    case '总磷':
      if (colKey === 'effluent') return num <= 0.5 ? 'text-status-normal' : num <= 1 ? 'text-status-warning' : 'text-status-danger'
      return 'text-text-secondary'
    case '总氮':
      if (colKey === 'effluent') return num <= 15 ? 'text-status-normal' : num <= 20 ? 'text-status-warning' : 'text-status-danger'
      return 'text-text-secondary'
    case 'pH':
      if (colKey === 'effluent') return num >= 6 && num <= 9 ? 'text-status-normal' : 'text-status-warning'
      return 'text-text-secondary'
    case 'DO':
      if (colKey === 'effluent') return num >= 2 ? 'text-status-normal' : 'text-status-warning'
      if (colKey === 'biochemical') return num >= 2 ? 'text-status-normal' : 'text-status-warning'
      return 'text-text-secondary'
    default:
      return 'text-text-secondary'
  }
}

const columns = [
  { key: 'indicator', title: '指标', width: '60px' },
  { key: 'influent', title: '进水口', width: '65px' },
  { key: 'primary', title: '初沉池', width: '65px' },
  { key: 'biochemical', title: '生化池', width: '65px' },
  { key: 'secondary', title: '二沉池', width: '65px' },
  { key: 'effluent', title: '出水口', width: '65px' },
  { key: 'standard', title: '标准限值', width: '70px' },
]

const ComparisonTable = memo(function ComparisonTable() {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: string } | null>(null)

  return (
    <div className="w-full overflow-auto custom-scrollbar" style={{ maxHeight: 220 }}>
      <table className="w-full border-collapse text-xs">
        <thead className="sticky top-0 z-10">
          <tr style={{ backgroundColor: 'rgba(15, 37, 64, 0.8)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-center px-1.5 py-1.5 text-[10px] text-text-secondary font-medium border-b border-border-subtle whitespace-nowrap"
                style={{ width: col.width }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row.indicator}
              className={cn(
                'transition-colors duration-150',
                rowIdx % 2 === 0 ? 'bg-[#0a1a2e]' : 'bg-[#0d1f35]'
              )}
              style={{ height: 32 }}
            >
              {columns.map((col) => {
                const cellKey = `${rowIdx}-${col.key}`
                const isHovered = hoveredCell?.row === rowIdx && hoveredCell?.col === col.key
                const rawValue = row[col.key as keyof RowData]
                const value = rawValue ?? '-'

                return (
                  <td
                    key={cellKey}
                    className={cn(
                      'px-1.5 py-1 text-center font-data transition-all duration-150 cursor-default whitespace-nowrap',
                      getCellColor(row.indicator, value, col.key)
                    )}
                    style={{
                      backgroundColor: isHovered ? 'rgba(15, 37, 64, 0.6)' : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredCell({ row: rowIdx, col: col.key })}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={`${row.indicator}: ${value}${row.unit ? ' ' + row.unit : ''}`}
                  >
                    {value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default ComparisonTable
