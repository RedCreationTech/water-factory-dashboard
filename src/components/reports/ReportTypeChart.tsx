import ReactEChartsCore from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import {
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  PieChart,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

const data = [
  { value: 28, name: '运行日报', itemStyle: { color: '#4488ff' } },
  { value: 22, name: '能耗月报', itemStyle: { color: '#00ff88' } },
  { value: 18, name: '水质月报', itemStyle: { color: '#00e5ff' } },
  { value: 16, name: '异常事件报表', itemStyle: { color: '#ffcc00' } },
  { value: 24, name: 'AI优化成效报告', itemStyle: { color: '#aa66ff' } },
  { value: 20, name: '自定义报表', itemStyle: { color: '#ff8844' } },
];

const option = {
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(5, 14, 26, 0.95)',
    borderColor: '#00c8ff',
    borderWidth: 1,
    textStyle: { color: '#ffffff', fontSize: 12 },
    formatter: '{b}: {c}份 ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: { color: '#a0b4c8', fontSize: 11 },
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 10,
    formatter: (name: string) => {
      const item = data.find((d) => d.name === name);
      return item ? `${name}  ${item.value}份` : name;
    },
  },
  series: [
    {
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['38%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#0a1a2e',
        borderWidth: 2,
      },
      label: {
        show: true,
        formatter: '{b}\n{d}%',
        color: '#a0b4c8',
        fontSize: 10,
      },
      labelLine: {
        lineStyle: { color: '#1a3a5c' },
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold',
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 229, 255, 0.5)',
        },
      },
      data,
    },
  ],
  graphic: [
    {
      type: 'text',
      left: '30%',
      top: '46%',
      style: {
        text: '总报表数',
        textAlign: 'center',
        fill: '#a0b4c8',
        fontSize: 11,
      },
    },
    {
      type: 'text',
      left: '29%',
      top: '52%',
      style: {
        text: '128份',
        textAlign: 'center',
        fill: '#00e5ff',
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
  ],
};

export default function ReportTypeChart() {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
