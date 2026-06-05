import { useState, useCallback } from 'react'
import {
  Droplets,
  ShieldCheck,
  Zap,
  Cpu,
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import Panel from '@/components/Panel'
import NodeNavTree from '@/components/process/NodeNavTree'
import EquipmentOverview from '@/components/process/EquipmentOverview'
import ProcessFlowDiagram from '@/components/process/ProcessFlowDiagram'
import AerationZones from '@/components/process/AerationZones'
import NodeDetailPanel from '@/components/process/NodeDetailPanel'
import ParamTrendChart from '@/components/process/ParamTrendChart'
import EquipmentTimeline from '@/components/process/EquipmentTimeline'
import AlarmTable from '@/components/process/AlarmTable'
import InteractionBar from '@/components/process/InteractionBar'

const kpiData = [
  {
    icon: <Droplets className="w-4 h-4 text-white" />,
    iconBg: 'rgba(0, 170, 255, 0.25)',
    label: '进水流量',
    value: '12,580',
    unit: 'm³/h',
    changePercent: '5.2%',
    positive: true,
  },
  {
    icon: <Droplets className="w-4 h-4 text-white" style={{ transform: 'rotate(180deg)' }} />,
    iconBg: 'rgba(0, 229, 255, 0.25)',
    label: '出水流量',
    value: '9,860',
    unit: 'm³/h',
    changePercent: '3.7%',
    positive: true,
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-white" />,
    iconBg: 'rgba(0, 255, 136, 0.25)',
    label: '出水达标率',
    value: '99.32',
    unit: '%',
    changePercent: '0.82%',
    positive: true,
  },
  {
    icon: <Zap className="w-4 h-4 text-white" />,
    iconBg: 'rgba(255, 204, 0, 0.25)',
    label: '当日总能耗',
    value: '16,820',
    unit: 'kWh',
    changePercent: '2.4%',
    positive: true,
  },
  {
    icon: <Cpu className="w-4 h-4 text-white" />,
    iconBg: 'rgba(0, 229, 255, 0.25)',
    label: 'AI优化介入率',
    value: '62',
    unit: '%',
    changePercent: '6.3%',
    positive: true,
  },
]

export default function Process() {
  const [selectedNode, setSelectedNode] = useState('生化池')

  const handleSelectNode = useCallback((nodeName: string) => {
    setSelectedNode(nodeName)
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Section 1: KPI Row */}
      <div className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0">
        {kpiData.map((kpi) => (
          <div
            key={kpi.label}
            className="flex-1"
          >
            <KPICard {...kpi} />
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div className="flex flex-1 min-h-0 gap-3 px-4 pb-3">
        {/* Left Column: 220px */}
        <div className="w-[220px] flex flex-col gap-3 flex-shrink-0">
          {/* Node Navigation Tree */}
          <Panel title="节点导航树" className="flex-1">
            <NodeNavTree
              selectedNode={selectedNode}
              onSelectNode={handleSelectNode}
            />
          </Panel>

          {/* Equipment Overview */}
          <Panel title="设备联动概况" className="flex-1">
            <EquipmentOverview />
          </Panel>
        </div>

        {/* Center: Process Flow Diagram */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Process Flow Panel - takes 55% height */}
          <div className="h-[55%]">
            <Panel title="工艺流程图" className="h-full">
              <ProcessFlowDiagram onSelectNode={handleSelectNode} />
            </Panel>
          </div>
          {/* Aeration Zones Panel - takes remaining 45% */}
          <div className="flex-1">
            <Panel title="生化池曝气分区" className="h-full">
              <AerationZones />
            </Panel>
          </div>
        </div>

        {/* Right Column: 280px */}
        <div className="w-[280px] flex-shrink-0">
          <Panel
            title="当前选中节点详情"
            className="h-full"
            rightAction={
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-status-normal/10 text-status-normal border border-status-normal/30">
                <span className="w-1.5 h-1.5 rounded-full bg-status-normal animate-pulse" />
                正常运行
              </span>
            }
          >
            <NodeDetailPanel nodeName={selectedNode} />
          </Panel>
        </div>
      </div>

      {/* Bottom Section: 3 panels */}
      <div className="flex gap-3 px-4 pb-2 h-[220px] flex-shrink-0">
        {/* A: 工艺参数趋势 */}
        <Panel
          title="A. 工艺参数趋势"
          className="flex-1"
        >
          <ParamTrendChart />
        </Panel>

        {/* B: 设备状态时间轴 */}
        <Panel
          title="B. 设备状态时间轴"
          className="w-[320px] flex-shrink-0"
        >
          <EquipmentTimeline />
        </Panel>

        {/* C: 仪表与阀门告警 */}
        <Panel
          title="C. 仪表与阀门告警"
          className="w-[340px] flex-shrink-0"
        >
          <AlarmTable />
        </Panel>
      </div>

      {/* Interaction hint bar */}
      <div className="flex-shrink-0">
        <InteractionBar />
      </div>
    </div>
  )
}
