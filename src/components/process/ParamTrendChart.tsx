import { useState, useCallback } from 'react'
import ReactECharts from 'echarts-for-react'
import { cn } from '@/lib/utils'

const timeRanges = ['1h', '2h', '8h', '24h', '7d'] as const
type TimeRange = (typeof timeRanges)[number]

function generateTimeLabels(range: TimeRange): string[] {
  const now = new Date()
  const labels: string[] = []
  let points = 12
  let hoursBack = 1

  switch (range) {
    case '1h':
      points = 12
      hoursBack = 1
      break
    case '2h':
      points = 12
      hoursBack = 2
      break
    case '8h':
      points = 16
      hoursBack = 8
      break
    case '24h':
      points = 24
      hoursBack = 24
      break
    case '7d':
      points = 14
      hoursBack = 24 * 7
      break
  }

  for (let i = points; i >= 0; i--) {
    const t = new Date(now.getTime() - (hoursBack * 3600000 * i) / points)
    const h = t.getHours().toString().padStart(2, '0')
    const m = t.getMinutes().toString().padStart(2, '0')
    labels.push(`${h}:${m}`)
  }
  return labels
}

function generateSeriesData(points: number, base: number, variance: number): number[] {
  return Array.from({ length: points + 1 }, (_, i) => {
    return base + Math.sin(i * 0.5) * variance + (Math.random() - 0.5) * variance * 0.5
  })
}

export default function ParamTrendChart() {
  const [activeRange, setActiveRange] = useState<TimeRange>('24h')

  const getChartOption = useCallback(() => {
    const xLabels = generateTimeLabels(activeRange)
    const pointsCount = xLabels.length - 1

    const inletFlow = generateSeriesData(pointsCount, 12500, 800)
    const doData = generateSeriesData(pointsCount, 2.1, 0.3)
    const mlssData = generateSeriesData(pointsCount, 3600, 200)
    const ammoniaData = generateSeriesData(pointsCount, 4.5, 1.5)

    return {
      backgroundColor: 'transparent',
      grid: {
        top: 40,
        right: 60,
        bottom: 30,
        left: 60,
      },
      legend: {
        data: ['进水流量(m³/h)', 'DO(mg/L)', 'MLSS(mg/L)', '出水氨氮(mg/L)'],
        top: 8,
        textStyle: {
          color: '#a0b4c8',
          fontSize: 10,
        },
        itemWidth: 14,
        itemHeight: 6,
        itemGap: 12,
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        axisLine: { lineStyle: { color: '#1a3a5c' } },
        axisLabel: {
          color: '#5a7a94',
          fontSize: 10,
          interval: Math.floor(pointsCount / 6),
        },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: 'value',
          name: '流量',
          min: 0,
          max: 14000,
          nameTextStyle: {
            color: '#5a7a94',
            fontSize: 10,
            padding: [0, 40, 0, 0],
          },
          axisLine: { show: false },
          axisLabel: {
            color: '#5a7a94',
            fontSize: 10,
            formatter: (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`),
          },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)', type: 'dashed' } },
        },
        {
          type: 'value',
          name: '水质',
          min: 0,
          max: 10,
          nameTextStyle: {
            color: '#5a7a94',
            fontSize: 10,
            padding: [0, 0, 0, 40],
          },
          axisLine: { show: false },
          axisLabel: {
            color: '#5a7a94',
            fontSize: 10,
          },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: '进水流量(m³/h)',
          type: 'line',
          data: inletFlow,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#00e5ff', width: 1.5 },
          itemStyle: { color: '#00e5ff' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(0,229,255,0.15)' },
                { offset: 1, color: 'rgba(0,229,255,0)' },
              ],
            },
          },
        },
        {
          name: 'DO(mg/L)',
          type: 'line',
          yAxisIndex: 1,
          data: doData,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#00ff88', width: 1.5 },
          itemStyle: { color: '#00ff88' },
        },
        {
          name: 'MLSS(mg/L)',
          type: 'line',
          yAxisIndex: 1,
          data: mlssData.map((v) => v / 1000),
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#ffcc00', width: 1.5 },
          itemStyle: { color: '#ffcc00' },
        },
        {
          name: '出水氨氮(mg/L)',
          type: 'line',
          yAxisIndex: 1,
          data: ammoniaData,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#ff8833', width: 1.5 },
          itemStyle: { color: '#ff8833' },
        },
      ],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(5,14,26,0.95)',
        borderColor: '#00c8ff',
        borderWidth: 1,
        textStyle: { color: '#ffffff', fontSize: 11 },
        axisPointer: {
          type: 'cross',
          crossStyle: { color: 'rgba(0,229,255,0.3)' },
        },
      },
    }
  }, [activeRange])

  return (
    <div className="flex flex-col h-full">
      {/* Time range selector */}
      <div className="flex items-center justify-end gap-1 mb-1">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setActiveRange(range)}
            className={cn(
              'px-2 py-0.5 rounded text-[11px] font-medium transition-all duration-200',
              range === activeRange
                ? 'bg-accent-cyan text-bg-primary'
                : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-panel-hover'
            )}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ReactECharts
          option={getChartOption()}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  )
}
