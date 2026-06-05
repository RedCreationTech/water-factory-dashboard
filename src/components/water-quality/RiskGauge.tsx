import { memo, useMemo } from 'react'
import ReactEChartsCore from 'echarts-for-react'

interface RiskGaugeProps {
  value?: number
}

const RiskGauge = memo(function RiskGauge({ value = 18 }: RiskGaugeProps) {
  const option = useMemo(() => ({
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        radius: '100%',
        center: ['50%', '70%'],
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.3, '#00ff88'],
              [0.7, '#ffcc00'],
              [1, '#ff4444'],
            ],
          },
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '50%',
          width: 8,
          offsetCenter: [0, '-10%'],
          itemStyle: {
            color: '#00e5ff',
          },
        },
        axisTick: {
          length: 8,
          lineStyle: {
            color: 'auto',
            width: 1,
          },
        },
        splitLine: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2,
          },
        },
        axisLabel: {
          color: '#5a7a94',
          fontSize: 10,
          distance: 30,
          formatter: (v: number) => {
            if (v === 0 || v === 50 || v === 100) return String(v)
            return ''
          },
        },
        title: {
          offsetCenter: [0, '-30%'],
          fontSize: 12,
          color: '#a0b4c8',
        },
        detail: {
          fontSize: 28,
          offsetCenter: [0, '5%'],
          valueAnimation: true,
          formatter: (v: number) => `${v}`,
          color: '#00e5ff',
          fontFamily: 'Roboto Mono, JetBrains Mono, monospace',
          fontWeight: 'bold',
        },
        data: [
          {
            value: value,
            name: '风险指数',
          },
        ],
      },
    ],
  }), [value])

  return (
    <div className="relative w-full" style={{ height: 160 }}>
      <ReactEChartsCore
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
        notMerge={true}
      />
    </div>
  )
})

export default RiskGauge
