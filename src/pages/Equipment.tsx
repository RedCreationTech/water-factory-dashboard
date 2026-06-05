import { useState, useCallback, lazy, Suspense } from 'react';
import {
  Monitor,
  Activity,
  AlertTriangle,
  Zap,
  Fan,
} from 'lucide-react';
import KPICard from '@/components/KPICard';
import Panel from '@/components/Panel';
import StatusLight from '@/components/StatusLight';
import EquipmentTopology, { type EquipmentArea } from '@/components/equipment/EquipmentTopology';
import GanttTimeline from '@/components/equipment/GanttTimeline';
import PredictiveMaintenance from '@/components/equipment/PredictiveMaintenance';
import AlarmEventTable from '@/components/equipment/AlarmEventTable';

/* Lazy-load the heavy 3D component */
const DeviceModel3D = lazy(() => import('@/components/equipment/DeviceModel3D'));

/* ---------- equipment detail data ---------- */
const deviceDetailsMap: Record<string, {
  name: string;
  type: string;
  location: string;
  installDate: string;
  runtime: string;
  params: { label: string; value: string; unit: string; highlight?: boolean }[];
}> = {
  blower: {
    name: '鼓风机 #B-02',
    type: '鼓风机',
    location: '鼓风机房 2#',
    installDate: '2023-06-18',
    runtime: '3,856 h',
    params: [
      { label: '出口压力', value: '58.6', unit: 'kPa' },
      { label: '出口流量', value: '26.3', unit: 'm³/min' },
      { label: '转速', value: '1,485', unit: 'rpm' },
      { label: '电机电流', value: '42.3', unit: 'A' },
      { label: '电机功率', value: '45.6', unit: 'kW' },
      { label: '轴承温度', value: '63.2', unit: '°C' },
      { label: '振动值', value: '2.8', unit: 'mm/s' },
      { label: '设备状态', value: '运行正常', unit: '', highlight: true },
    ],
  },
  sedimentation: {
    name: '刮泥机 #S-01',
    type: '刮泥机',
    location: '二沉池 A区',
    installDate: '2022-11-05',
    runtime: '8,920 h',
    params: [
      { label: '扭矩', value: '32.5', unit: 'N·m' },
      { label: '转速', value: '1.2', unit: 'rpm' },
      { label: '泥位', value: '1.8', unit: 'm' },
      { label: '电机电流', value: '8.6', unit: 'A' },
      { label: '电机功率', value: '4.2', unit: 'kW' },
      { label: '轴承温度', value: '45.3', unit: '°C' },
      { label: '振动值', value: '1.5', unit: 'mm/s' },
      { label: '设备状态', value: '运行正常', unit: '', highlight: true },
    ],
  },
  pump: {
    name: '回流泵 #R-01',
    type: '回流泵',
    location: '泵房 A区',
    installDate: '2023-03-12',
    runtime: '5,240 h',
    params: [
      { label: '出口压力', value: '12.5', unit: 'kPa' },
      { label: '出口流量', value: '450', unit: 'm³/h' },
      { label: '转速', value: '980', unit: 'rpm' },
      { label: '电机电流', value: '28.6', unit: 'A' },
      { label: '电机功率', value: '18.5', unit: 'kW' },
      { label: '轴承温度', value: '52.1', unit: '°C' },
      { label: '振动值', value: '3.2', unit: 'mm/s' },
      { label: '设备状态', value: '运行正常', unit: '', highlight: true },
    ],
  },
  dosing: {
    name: '加药泵 #D-01',
    type: '计量泵',
    location: '加药间 B区',
    installDate: '2023-08-20',
    runtime: '2,680 h',
    params: [
      { label: '出口压力', value: '0.25', unit: 'MPa' },
      { label: '出口流量', value: '120', unit: 'L/h' },
      { label: '冲程', value: '68', unit: '%' },
      { label: '电机电流', value: '3.2', unit: 'A' },
      { label: '电机功率', value: '1.5', unit: 'kW' },
      { label: '轴承温度', value: '38.6', unit: '°C' },
      { label: '振动值', value: '1.2', unit: 'mm/s' },
      { label: '设备状态', value: '运行正常', unit: '', highlight: true },
    ],
  },
  instrument: {
    name: '在线仪表 #PH-08',
    type: 'pH分析仪',
    location: '生化池出口',
    installDate: '2022-09-10',
    runtime: '12,400 h',
    params: [
      { label: '测量值', value: '7.2', unit: 'pH' },
      { label: '温度', value: '22.5', unit: '°C' },
      { label: '信号强度', value: '92', unit: '%' },
      { label: '校准偏差', value: '0.03', unit: 'pH' },
      { label: '响应时间', value: '8.5', unit: 's' },
      { label: '电极寿命', value: '78', unit: '%' },
      { label: '零点漂移', value: '0.01', unit: 'pH' },
      { label: '设备状态', value: '运行正常', unit: '', highlight: true },
    ],
  },
  power: {
    name: '变压器 #T-01',
    type: '干式变压器',
    location: '配电室 A区',
    installDate: '2021-05-15',
    runtime: '23,600 h',
    params: [
      { label: 'A相温度', value: '62.5', unit: '°C' },
      { label: 'B相温度', value: '61.8', unit: '°C' },
      { label: 'C相温度', value: '63.1', unit: '°C' },
      { label: '高压侧电流', value: '156.2', unit: 'A' },
      { label: '低压侧电流', value: '425.6', unit: 'A' },
      { label: '有功功率', value: '285.6', unit: 'kW' },
      { label: '无功功率', value: '42.3', unit: 'kvar' },
      { label: '设备状态', value: '运行正常', unit: '', highlight: true },
    ],
  },
};

const defaultDetail = deviceDetailsMap.blower;

/* ---------- page component ---------- */
export default function Equipment() {
  const [selectedAreaId, setSelectedAreaId] = useState<string>('blower');

  const handleSelectArea = useCallback((area: EquipmentArea) => {
    setSelectedAreaId(area.id);
  }, []);

  const currentDetail = deviceDetailsMap[selectedAreaId] || defaultDetail;

  return (
    <div className="flex flex-col h-full gap-2 p-2 overflow-hidden">
      {/* Top KPI Row (5 cards) */}
      <div className="grid grid-cols-5 gap-2 flex-shrink-0">
        <KPICard
          icon={<Monitor className="w-4 h-4" />}
          iconBg="rgba(0, 229, 255, 0.2)"
          label="在线设备数"
          value="568"
          unit="台"
          changePercent="92.6%"
          positive={true}
        />
        <KPICard
          icon={<Activity className="w-4 h-4" />}
          iconBg="rgba(0, 255, 136, 0.2)"
          label="正常运行率"
          value="96.8"
          unit="%"
          changePercent="1.8%"
          positive={true}
        />
        <KPICard
          icon={<AlertTriangle className="w-4 h-4" />}
          iconBg="rgba(255, 68, 68, 0.2)"
          label="关键设备告警"
          value="5"
          unit="条"
          changePercent="28.6%"
          positive={false}
        />
        <KPICard
          icon={<Zap className="w-4 h-4" />}
          iconBg="rgba(255, 136, 51, 0.2)"
          label="今日总电耗"
          value="68,450"
          unit="kWh"
          changePercent="8.6%"
          positive={true}
        />
        <KPICard
          icon={<Fan className="w-4 h-4" />}
          iconBg="rgba(68, 136, 255, 0.2)"
          label="风机可用率"
          value="68.3"
          unit="%"
          changePercent="4.2%"
          positive={true}
        />
      </div>

      {/* Middle Row: Topology + Device Details */}
      <div className="flex gap-2 flex-1 min-h-0">
        {/* Left: Equipment Topology */}
        <Panel
          title="设备分布与拓扑"
          className="flex-[3] min-w-0"
        >
          <div className="w-full h-full">
            <EquipmentTopology
              onSelectArea={handleSelectArea}
              selectedId={selectedAreaId}
            />
          </div>
        </Panel>

        {/* Right: Device Details */}
        <Panel
          title="设备详情"
          className="flex-[2] min-w-0"
          rightAction={
            <div className="flex items-center gap-1.5">
              <StatusLight status="normal" size="sm" />
              <span className="text-[11px] text-text-secondary">运行中</span>
            </div>
          }
        >
          <div className="flex flex-col gap-2 h-full overflow-auto custom-scrollbar">
            {/* 3D Model */}
            <Suspense
              fallback={
                <div
                  className="w-full h-[200px] rounded-md flex items-center justify-center"
                  style={{ backgroundColor: '#060e18' }}
                >
                  <span className="text-[12px] text-text-tertiary">加载3D模型中...</span>
                </div>
              }
            >
              <DeviceModel3D />
            </Suspense>

            {/* Equipment Info */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-1">
              <InfoRow label="设备名称" value={currentDetail.name} />
              <InfoRow label="设备类型" value={currentDetail.type} />
              <InfoRow label="安装位置" value={currentDetail.location} />
              <InfoRow label="投运时间" value={currentDetail.installDate} />
              <InfoRow label="运行时长" value={currentDetail.runtime} valueClass="font-data text-text-data" />
            </div>

            {/* Parameter Grid (2x4) */}
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              {currentDetail.params.map((param) => (
                <div
                  key={param.label}
                  className="flex items-center justify-between px-2 py-1.5 rounded"
                  style={{ backgroundColor: 'rgba(15, 37, 64, 0.5)' }}
                >
                  <span className="text-[11px] text-text-secondary">{param.label}</span>
                  <span
                    className={`text-[11px] font-data font-medium ${
                      param.highlight ? 'text-status-normal' : 'text-text-primary'
                    }`}
                  >
                    {param.value}
                    {param.unit && (
                      <span className="text-[10px] text-text-tertiary ml-0.5">{param.unit}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Bottom Row: 3 panels */}
      <div className="grid grid-cols-3 gap-2 flex-shrink-0" style={{ height: '220px' }}>
        {/* A: Gantt Timeline */}
        <Panel
          title="设备运行时序（近24小时）"
          className="min-w-0"
        >
          <div className="w-full h-full">
            <GanttTimeline />
          </div>
        </Panel>

        {/* B: Predictive Maintenance */}
        <Panel
          title="预测性维护"
          className="min-w-0"
          rightAction={
            <button className="text-[11px] text-accent-cyan hover:text-accent-cyan-dim transition-colors cursor-pointer">
              查看全部预测维护(12) &gt;
            </button>
          }
        >
          <div className="w-full h-full">
            <PredictiveMaintenance />
          </div>
        </Panel>

        {/* C: Alarm Events */}
        <Panel
          title="告警与事件"
          className="min-w-0"
        >
          <div className="w-full h-full">
            <AlarmEventTable />
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function InfoRow({
  label,
  value,
  valueClass = 'text-text-primary',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-[11px] text-text-tertiary flex-shrink-0">{label}:</span>
      <span className={`text-[11px] truncate ${valueClass}`}>{value}</span>
    </div>
  );
}
