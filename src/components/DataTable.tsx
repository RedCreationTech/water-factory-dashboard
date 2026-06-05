import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface Column<T = Record<string, unknown>> {
  key: string
  title: string
  width?: string
  render?: (row: T) => ReactNode
  dataIndex?: string
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  rowKey?: string
  className?: string
  style?: React.CSSProperties
  maxHeight?: number | string
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey = 'key',
  className,
  style,
  maxHeight,
}: DataTableProps<T>) {
  return (
    <div
      className={cn('w-full overflow-auto custom-scrollbar', className)}
      style={{ ...style, maxHeight }}
    >
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="bg-[rgba(15,37,64,0.8)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-3 py-2 text-xs text-text-secondary font-medium border-b border-border-subtle whitespace-nowrap"
                style={{ width: col.width }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={String(row[rowKey] ?? idx)}
              className={cn(
                'transition-colors duration-200 hover:bg-bg-panel-hover',
                idx % 2 === 0 ? 'bg-[#0a1a2e]' : 'bg-[#0d1f35]'
              )}
              style={{ height: 36 }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-3 py-1.5 text-xs whitespace-nowrap"
                >
                  {col.render
                    ? col.render(row)
                    : String((col.dataIndex ? row[col.dataIndex] : row[col.key]) ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
