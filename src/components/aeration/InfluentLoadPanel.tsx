import Panel from '@/components/Panel'
import MiniSparkline from './MiniSparkline'

interface InfluentParam {
  label: string
  value: string
  unit: string
  data: number[]
  positive?: boolean
}

const params: InfluentParam[] = [
  { label: '进水流量', value: '12,680', unit: 'm³/h', data: [12000, 12100, 12200, 12300, 12400, 12500, 12680], positive: true },
  { label: 'COD', value: '256', unit: 'mg/L', data: [240, 245, 248, 250, 252, 254, 256], positive: false },
  { label: '氨氮', value: '28.6', unit: 'mg/L', data: [26, 27, 27.5, 28, 28.2, 28.4, 28.6], positive: false },
  { label: '总氮', value: '36.4', unit: 'mg/L', data: [34, 35, 35.2, 35.5, 35.8, 36.0, 36.4], positive: false },
  { label: '水温', value: '22.1', unit: '°C', data: [21, 21.2, 21.5, 21.7, 21.9, 22.0, 22.1], positive: true },
  { label: '负荷变化率', value: '+8.2', unit: '%/h', data: [5, 5.5, 6.2, 6.8, 7.3, 7.8, 8.2], positive: true },
]

export default function InfluentLoadPanel() {
  return (
    <Panel title="进水负荷与模型输入" className="flex-1">
      <div className="flex flex-col gap-2 pt-1">
        {params.map((p) => (
          <div
            key={p.label}
            className="flex items-center justify-between px-2 py-1.5 rounded"
            style={{ backgroundColor: 'rgba(10, 26, 46, 0.6)' }}
          >
            <span className="text-xs text-text-secondary w-16">{p.label}</span>
            <span className="flex items-baseline gap-0.5">
              <span className="text-sm font-semibold text-text-primary font-mono-data">
                {p.value}
              </span>
              <span className="text-[10px] text-text-tertiary">{p.unit}</span>
            </span>
            <MiniSparkline
              data={p.data}
              width={30}
              height={16}
              positive={p.positive ?? true}
            />
          </div>
        ))}
      </div>
    </Panel>
  )
}
