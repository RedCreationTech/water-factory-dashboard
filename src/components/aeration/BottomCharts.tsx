import ReactEChartsCore from 'echarts-for-react'
import * as echarts from 'echarts'

// ─── Generate 24h time labels ───────────────────────────
const hours = Array.from({ length: 25 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

// ─── Chart A: DO Trends ─────────────────────────────────
const doColors = ['#00e5ff', '#00ff88', '#ffcc00', '#ff8833', '#4488ff', '#aa66ff', '#00ffcc', '#ff4444']

const doSeriesData = [
  // Zone 1-8 DO data over 24h
  [1.8, 1.82, 1.85, 1.88, 1.9, 1.92, 1.95, 1.98, 2.0, 2.02, 2.05, 2.08, 2.1, 2.08, 2.06, 2.05, 2.04, 2.03, 2.02, 2.0, 1.98, 1.95, 1.92, 1.9, 1.88],
  [1.85, 1.87, 1.9, 1.92, 1.95, 1.98, 2.0, 2.02, 2.05, 2.08, 2.1, 2.12, 2.14, 2.12, 2.1, 2.08, 2.06, 2.05, 2.04, 2.02, 2.0, 1.98, 1.95, 1.92, 1.9],
  [1.65, 1.68, 1.7, 1.72, 1.75, 1.78, 1.8, 1.82, 1.85, 1.88, 1.9, 1.88, 1.86, 1.85, 1.84, 1.83, 1.82, 1.8, 1.78, 1.76, 1.74, 1.72, 1.7, 1.68, 1.66],
  [2.1, 2.12, 2.15, 2.18, 2.2, 2.22, 2.25, 2.28, 2.3, 2.32, 2.34, 2.35, 2.34, 2.33, 2.32, 2.3, 2.28, 2.26, 2.24, 2.22, 2.2, 2.18, 2.15, 2.12, 2.1],
  [1.78, 1.8, 1.82, 1.85, 1.88, 1.9, 1.92, 1.95, 1.98, 2.0, 2.02, 2.0, 1.98, 1.97, 1.96, 1.95, 1.93, 1.91, 1.89, 1.87, 1.85, 1.83, 1.81, 1.79, 1.77],
  [2.05, 2.08, 2.1, 2.12, 2.15, 2.18, 2.2, 2.22, 2.25, 2.28, 2.3, 2.28, 2.26, 2.25, 2.24, 2.22, 2.2, 2.18, 2.16, 2.14, 2.12, 2.1, 2.08, 2.06, 2.04],
  [2.08, 2.1, 2.12, 2.15, 2.18, 2.2, 2.22, 2.25, 2.28, 2.3, 2.31, 2.3, 2.28, 2.27, 2.26, 2.24, 2.22, 2.2, 2.18, 2.16, 2.14, 2.12, 2.1, 2.08, 2.06],
  [1.95, 1.97, 2.0, 2.02, 2.05, 2.08, 2.1, 2.12, 2.15, 2.18, 2.2, 2.18, 2.16, 2.15, 2.14, 2.12, 2.1, 2.08, 2.06, 2.04, 2.02, 2.0, 1.98, 1.96, 1.94],
]

const doSeries = doSeriesData.map((data, i) => ({
  name: `${i + 1}区`,
  type: 'line',
  smooth: true,
  symbol: 'none',
  lineStyle: { width: 1.5, color: doColors[i] },
  itemStyle: { color: doColors[i] },
  data,
}))

// Add target range as markArea
const doOption = {
  backgroundColor: 'transparent',
  grid: { top: 28, right: 10, bottom: 24, left: 36 },
  legend: {
    data: [...Array(8)].map((_, i) => `${i + 1}区`),
    top: 4,
    textStyle: { color: '#5a7a94', fontSize: 9 },
    itemWidth: 12,
    itemHeight: 6,
    itemGap: 6,
  },
  xAxis: {
    type: 'category',
    data: hours,
    axisLabel: { color: '#5a7a94', fontSize: 9, interval: 4 },
    axisLine: { lineStyle: { color: '#0f2540' } },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 4,
    axisLabel: { color: '#5a7a94', fontSize: 9 },
    splitLine: { lineStyle: { color: '#0f2540', type: 'dashed' } },
  },
  series: [
    ...doSeries,
    {
      name: '目标范围',
      type: 'line',
      data: [],
      markArea: {
        silent: true,
        itemStyle: { color: 'rgba(255, 255, 255, 0.04)' },
        data: [[{ yAxis: 2.0 }, { yAxis: 3.0 }]],
      },
    } as any,
  ],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(5, 14, 26, 0.95)',
    borderColor: '#00c8ff',
    textStyle: { color: '#ffffff', fontSize: 11 },
  },
}

// ─── Chart B: Fan Frequency ─────────────────────────────
const fanFreqData = [
  [42, 43, 44, 45, 46, 47, 48, 49, 50, 49, 48, 47, 46, 47, 48, 49, 50, 49, 48, 47, 46, 45, 44, 43, 42],
  [41, 42, 43, 44, 45, 46, 47, 48, 49, 48, 47, 46, 45, 46, 47, 48, 49, 48, 47, 46, 45, 44, 43, 42, 41],
  [43, 44, 45, 46, 47, 48, 49, 50, 51, 50, 49, 48, 47, 48, 49, 50, 51, 50, 49, 48, 47, 46, 45, 44, 43],
  [40, 41, 42, 43, 44, 45, 46, 47, 48, 47, 46, 45, 44, 45, 46, 47, 48, 47, 46, 45, 44, 43, 42, 41, 40],
]

const aiSetLine = [42, 42.5, 43, 43.5, 44, 44.5, 45, 45.5, 46, 45.5, 45, 44.5, 44, 44.5, 45, 45.5, 46, 45.5, 45, 44.5, 44, 43.5, 43, 42.5, 42]

const fanColors = ['#00e5ff', '#00ff88', '#ffcc00', '#4488ff']

const fanOption = {
  backgroundColor: 'transparent',
  grid: { top: 28, right: 10, bottom: 24, left: 36 },
  legend: {
    data: ['#1', '#2', '#3', '#4', 'AI设定值'],
    top: 4,
    textStyle: { color: '#5a7a94', fontSize: 9 },
    itemWidth: 12,
    itemHeight: 6,
    itemGap: 6,
  },
  xAxis: {
    type: 'category',
    data: hours,
    axisLabel: { color: '#5a7a94', fontSize: 9, interval: 4 },
    axisLine: { lineStyle: { color: '#0f2540' } },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 80,
    axisLabel: { color: '#5a7a94', fontSize: 9 },
    splitLine: { lineStyle: { color: '#0f2540', type: 'dashed' } },
  },
  series: [
    ...fanFreqData.map((data, i) => ({
      name: `#${i + 1}`,
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 1.5, color: fanColors[i] },
      itemStyle: { color: fanColors[i] },
      data,
    })),
    {
      name: 'AI设定值',
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, color: '#ffcc00', type: 'dashed' },
      itemStyle: { color: '#ffcc00' },
      data: aiSetLine,
    },
  ],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(5, 14, 26, 0.95)',
    borderColor: '#00c8ff',
    textStyle: { color: '#ffffff', fontSize: 11 },
  },
}

// ─── Chart C: Energy Distribution ───────────────────────
const zones = ['1区', '2区', '3区', '4区', '5区', '6区', '7区', '8区']
const currentEnergy = [11.2, 12.3, 15.6, 9.8, 14.9, 11.6, 10.3, 13.3]
const yesterdayEnergy = [12.5, 13.1, 16.2, 10.5, 15.3, 12.0, 10.8, 13.8]

const energyOption = {
  backgroundColor: 'transparent',
  grid: { top: 28, right: 10, bottom: 28, left: 36 },
  legend: {
    data: ['当前占比', '昨日占比'],
    top: 4,
    textStyle: { color: '#5a7a94', fontSize: 9 },
    itemWidth: 12,
    itemHeight: 6,
    itemGap: 6,
  },
  xAxis: {
    type: 'category',
    data: zones,
    axisLabel: { color: '#5a7a94', fontSize: 9 },
    axisLine: { lineStyle: { color: '#0f2540' } },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    max: 25,
    axisLabel: { color: '#5a7a94', fontSize: 9, formatter: '{value}%' },
    splitLine: { lineStyle: { color: '#0f2540', type: 'dashed' } },
  },
  series: [
    {
      name: '当前占比',
      type: 'bar',
      barWidth: 12,
      itemStyle: { color: '#00e5ff', borderRadius: [2, 2, 0, 0] },
      label: { show: true, position: 'top', color: '#00e5ff', fontSize: 9, formatter: '{c}%' },
      data: currentEnergy,
    },
    {
      name: '昨日占比',
      type: 'bar',
      barWidth: 12,
      itemStyle: { color: 'rgba(255, 255, 255, 0.2)', borderRadius: [2, 2, 0, 0] },
      data: yesterdayEnergy,
    },
  ],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(5, 14, 26, 0.95)',
    borderColor: '#00c8ff',
    textStyle: { color: '#ffffff', fontSize: 11 },
  },
}

// ─── Chart D: AI Optimization Comparison ─────────────────
const optHours = Array.from({ length: 13 }, (_, i) => `${String(i * 2).padStart(2, '0')}:00`)
const beforeOpt = [85, 83, 80, 78, 76, 75, 77, 79, 81, 82, 84, 85, 86]
const afterOpt = [72, 70, 68, 66, 64, 65, 67, 68, 70, 71, 72, 73, 74]

const comparisonOption = {
  backgroundColor: 'transparent',
  grid: { top: 8, right: 10, bottom: 20, left: 36 },
  xAxis: {
    type: 'category',
    data: optHours,
    axisLabel: { color: '#5a7a94', fontSize: 8 },
    axisLine: { lineStyle: { color: '#0f2540' } },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    show: false,
  },
  series: [
    {
      name: '优化前',
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 1.5, color: '#5a7a94', type: 'dashed' },
      data: beforeOpt,
    },
    {
      name: '优化后',
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, color: '#00ff88' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
          { offset: 1, color: 'rgba(0, 255, 136, 0)' },
        ]),
      },
      data: afterOpt,
    },
  ],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(5, 14, 26, 0.95)',
    borderColor: '#00c8ff',
    textStyle: { color: '#ffffff', fontSize: 11 },
  },
}

export default function BottomCharts() {
  return (
    <div className="grid grid-cols-4 gap-2 h-[220px]">
      {/* A. DO Trend */}
      <div
        className="rounded-md border border-border-primary flex flex-col overflow-hidden"
        style={{ backgroundColor: 'rgba(10, 26, 46, 0.85)' }}
      >
        <div className="flex items-center px-3 pt-2 pb-0 flex-shrink-0">
          <div className="panel-title text-xs">A. DO趋势 (mg/L)</div>
        </div>
        <div className="flex-1 min-h-0">
          <ReactEChartsCore
            option={doOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      </div>

      {/* B. Fan Frequency */}
      <div
        className="rounded-md border border-border-primary flex flex-col overflow-hidden"
        style={{ backgroundColor: 'rgba(10, 26, 46, 0.85)' }}
      >
        <div className="flex items-center px-3 pt-2 pb-0 flex-shrink-0">
          <div className="panel-title text-xs">B. 风机频率曲线 (Hz)</div>
        </div>
        <div className="flex-1 min-h-0">
          <ReactEChartsCore
            option={fanOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      </div>

      {/* C. Energy Distribution */}
      <div
        className="rounded-md border border-border-primary flex flex-col overflow-hidden"
        style={{ backgroundColor: 'rgba(10, 26, 46, 0.85)' }}
      >
        <div className="flex items-center px-3 pt-2 pb-0 flex-shrink-0">
          <div className="panel-title text-xs">C. 分区能耗占比 (今日)</div>
        </div>
        <div className="flex-1 min-h-0">
          <ReactEChartsCore
            option={energyOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      </div>

      {/* D. AI Optimization Comparison */}
      <div
        className="rounded-md border border-border-primary flex flex-col overflow-hidden"
        style={{ backgroundColor: 'rgba(10, 26, 46, 0.85)' }}
      >
        <div className="flex items-center px-3 pt-2 pb-0 flex-shrink-0">
          <div className="panel-title text-xs">D. AI优化前后对比 (今日)</div>
        </div>
        {/* Summary cards */}
        <div className="flex items-center justify-around px-2 pt-1.5 pb-0.5 flex-shrink-0">
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-status-success font-mono-data">18.6%</span>
            <span className="text-[9px] text-text-tertiary">节电率</span>
            <span className="text-[9px] text-status-success">▲6.2%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-status-success font-mono-data">98.2%</span>
            <span className="text-[9px] text-text-tertiary">达标率</span>
            <span className="text-[9px] text-status-success">▲4.1%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-accent-cyan font-mono-data">42.7%</span>
            <span className="text-[9px] text-text-tertiary">波动降低</span>
            <span className="text-[9px] text-accent-cyan">▼10.3%</span>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ReactEChartsCore
            option={comparisonOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      </div>
    </div>
  )
}
