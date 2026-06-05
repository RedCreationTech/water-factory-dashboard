import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

const months = ['2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05'];

const option = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(5, 14, 26, 0.95)',
    borderColor: '#00c8ff',
    borderWidth: 1,
    textStyle: { color: '#ffffff', fontSize: 12 },
    axisPointer: {
      type: 'cross',
      crossStyle: { color: '#5a7a94' },
    },
  },
  legend: {
    data: ['处理量(万m³)', '综合能耗(kWh/m³)', '出水达标率(%)'],
    top: 4,
    right: 8,
    textStyle: { color: '#a0b4c8', fontSize: 11 },
    itemWidth: 14,
    itemHeight: 8,
    itemGap: 12,
  },
  grid: {
    top: 40,
    right: 60,
    bottom: 28,
    left: 48,
  },
  xAxis: {
    type: 'category',
    data: months,
    axisLine: { lineStyle: { color: '#1a3a5c' } },
    axisLabel: { color: '#5a7a94', fontSize: 11 },
    axisTick: { show: false },
  },
  yAxis: [
    {
      type: 'value',
      name: '',
      min: 0,
      max: 150,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#5a7a94', fontSize: 11 },
      splitLine: { lineStyle: { color: '#0f2540', type: 'dashed' } },
    },
    {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#5a7a94', fontSize: 11, formatter: '{value}%' },
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: '处理量(万m³)',
      type: 'bar',
      barWidth: '35%',
      itemStyle: {
        color: '#4488ff',
        borderRadius: [3, 3, 0, 0],
      },
      data: [108, 112, 118, 115, 122, 128, 125, 131],
    },
    {
      name: '综合能耗(kWh/m³)',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: '#00ff88', width: 2 },
      itemStyle: { color: '#00ff88' },
      data: [0.358, 0.352, 0.348, 0.345, 0.340, 0.336, 0.334, 0.332],
    },
    {
      name: '出水达标率(%)',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: '#ff8833', width: 2 },
      itemStyle: { color: '#ff8833' },
      data: [98.5, 98.7, 98.9, 99.0, 99.05, 99.15, 99.25, 99.32],
    },
  ],
};

export default function TrendChart() {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
