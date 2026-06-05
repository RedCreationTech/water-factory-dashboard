import { memo, useMemo } from 'react'
import ReactEChartsCore from 'echarts-for-react'

const TrendChart = memo(function TrendChart() {
  const hours = ['10:00', '14:00', '18:00', '22:00', '02:00', '06:00', '10:00']

  const option = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(5, 14, 26, 0.95)',
      borderColor: '#00c8ff',
      borderWidth: 1,
      textStyle: {
        color: '#ffffff',
        fontSize: 11,
      },
      axisPointer: {
        type: 'cross',
        crossStyle: { color: '#1a3a5c' },
      },
    },
    legend: {
      data: ['进水COD(mg/L)', '出水氨氮(mg/L)', '出水总磷(mg/L)', '出水总氮(mg/L)'],
      top: 0,
      textStyle: {
        color: '#a0b4c8',
        fontSize: 10,
      },
      itemWidth: 14,
      itemHeight: 4,
      itemGap: 12,
    },
    grid: {
      top: 36,
      right: 50,
      bottom: 24,
      left: 48,
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLine: { lineStyle: { color: '#1a3a5c' } },
      axisLabel: { color: '#5a7a94', fontSize: 10 },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        name: '',
        min: 0,
        max: 450,
        interval: 90,
        axisLine: { show: false },
        axisLabel: { color: '#5a7a94', fontSize: 10 },
        splitLine: { lineStyle: { color: '#0f2540', type: 'dashed' } },
      },
      {
        type: 'value',
        name: '',
        min: 0,
        max: 12,
        interval: 2,
        axisLine: { show: false },
        axisLabel: { color: '#5a7a94', fontSize: 10 },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '进水COD(mg/L)',
        type: 'line',
        data: [245, 268, 285, 260, 240, 255, 268],
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { color: '#4488ff', width: 2 },
        itemStyle: { color: '#4488ff' },
        yAxisIndex: 0,
      },
      {
        name: '出水氨氮(mg/L)',
        type: 'line',
        data: [0.52, 0.48, 0.55, 0.42, 0.38, 0.45, 0.482],
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { color: '#00ff88', width: 2 },
        itemStyle: { color: '#00ff88' },
        yAxisIndex: 1,
      },
      {
        name: '出水总磷(mg/L)',
        type: 'line',
        data: [0.28, 0.23, 0.26, 0.20, 0.18, 0.22, 0.23],
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { color: '#ffcc00', width: 2 },
        itemStyle: { color: '#ffcc00' },
        yAxisIndex: 1,
      },
      {
        name: '出水总氮(mg/L)',
        type: 'line',
        data: [9.2, 8.46, 9.8, 7.5, 7.1, 8.0, 8.46],
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { color: '#aa66ff', width: 2 },
        itemStyle: { color: '#aa66ff' },
        yAxisIndex: 1,
      },
    ],
  }), [])

  return (
    <div className="w-full h-full" style={{ minHeight: 220 }}>
      <ReactEChartsCore
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
        notMerge={true}
      />
    </div>
  )
})

export default TrendChart
