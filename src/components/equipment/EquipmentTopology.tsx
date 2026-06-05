import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Fan,
  RotateCcw,
  Database,
  Pill,
  Zap,
  Activity,
  Droplets,
  Filter,
  Waves,
  ArrowRight,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

/* ---------- Types ---------- */
export interface EquipmentArea {
  id: string;
  name: string;
  running: number;
  total: number;
  status: 'normal' | 'warning' | 'danger' | 'offline';
  icon: 'fan' | 'rotate' | 'database' | 'pill' | 'zap' | 'activity' | 'droplets' | 'filter' | 'waves' | 'arrowRight';
  equipmentList: string[];
  x: number;
  y: number;
  width: number;
  height: number;
}

/* ---------- Data ---------- */
const areas: EquipmentArea[] = [
  {
    id: 'inlet',
    name: '进水系统',
    running: 8,
    total: 8,
    status: 'normal',
    icon: 'droplets',
    equipmentList: ['粗格栅', '细格栅', '进水泵#1~#4'],
    x: 30,
    y: 30,
    width: 120,
    height: 100,
  },
  {
    id: 'pretreatment',
    name: '预处理',
    running: 6,
    total: 6,
    status: 'normal',
    icon: 'filter',
    equipmentList: ['旋流沉砂器', '砂水分离器'],
    x: 170,
    y: 30,
    width: 120,
    height: 100,
  },
  {
    id: 'blower',
    name: '鼓风机房',
    running: 12,
    total: 12,
    status: 'normal',
    icon: 'fan',
    equipmentList: ['鼓风机#1~#4'],
    x: 310,
    y: 30,
    width: 130,
    height: 100,
  },
  {
    id: 'biochemical',
    name: '生化池',
    running: 1,
    total: 1,
    status: 'normal',
    icon: 'waves',
    equipmentList: ['曝气器', '搅拌器', 'DO仪', 'MLSS仪'],
    x: 460,
    y: 30,
    width: 200,
    height: 100,
  },
  {
    id: 'sedimentation',
    name: '二沉池',
    running: 8,
    total: 8,
    status: 'normal',
    icon: 'database',
    equipmentList: ['刮泥机', '污泥泵'],
    x: 680,
    y: 30,
    width: 120,
    height: 100,
  },
  {
    id: 'pump',
    name: '回流泵',
    running: 18,
    total: 20,
    status: 'warning',
    icon: 'rotate',
    equipmentList: ['回流泵#1~#6', '剩余污泥泵'],
    x: 660,
    y: 180,
    width: 140,
    height: 90,
  },
  {
    id: 'dosing',
    name: '加药间',
    running: 14,
    total: 15,
    status: 'normal',
    icon: 'pill',
    equipmentList: ['PAC加药泵', 'PAM加药泵', '次氯酸钠加药泵'],
    x: 30,
    y: 180,
    width: 140,
    height: 90,
  },
  {
    id: 'instrument',
    name: '在线仪表',
    running: 382,
    total: 410,
    status: 'warning',
    icon: 'activity',
    equipmentList: ['COD分析仪', '氨氮分析仪', 'pH计', '流量计'],
    x: 190,
    y: 180,
    width: 150,
    height: 90,
  },
  {
    id: 'power',
    name: '配电室',
    running: 20,
    total: 20,
    status: 'normal',
    icon: 'zap',
    equipmentList: ['高压柜', '低压柜', '变压器'],
    x: 360,
    y: 180,
    width: 130,
    height: 90,
  },
  {
    id: 'sludge',
    name: '污泥处理',
    running: 5,
    total: 5,
    status: 'normal',
    icon: 'database',
    equipmentList: ['脱水机', '浓缩机', '污泥泵'],
    x: 510,
    y: 180,
    width: 130,
    height: 90,
  },
  {
    id: 'outlet',
    name: '出水系统',
    running: 4,
    total: 4,
    status: 'normal',
    icon: 'arrowRight',
    equipmentList: ['消毒池', '出水泵', '巴氏计量槽'],
    x: 660,
    y: 290,
    width: 120,
    height: 80,
  },
];

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  fan: Fan,
  rotate: RotateCcw,
  database: Database,
  pill: Pill,
  zap: Zap,
  activity: Activity,
  droplets: Droplets,
  filter: Filter,
  waves: Waves,
  arrowRight: ArrowRight,
};

const statusColorMap: Record<string, string> = {
  normal: '#00ff88',
  warning: '#ffcc00',
  danger: '#ff4444',
  offline: '#888888',
};

/* ---------- Pipe definitions ---------- */
interface PipeDef {
  id: string;
  path: string;
  animateDuration: number;
  arrowPositions: Array<{ x: number; y: number; rotation: number }>;
}

const pipes: PipeDef[] = [
  // Inlet -> Pretreatment
  {
    id: 'pipe1',
    path: 'M 150 80 L 170 80',
    animateDuration: 3,
    arrowPositions: [{ x: 160, y: 80, rotation: 0 }],
  },
  // Pretreatment -> Blower room (indirect via biochemical, so pipe to biochem)
  {
    id: 'pipe2',
    path: 'M 290 80 L 310 80',
    animateDuration: 2.5,
    arrowPositions: [{ x: 300, y: 80, rotation: 0 }],
  },
  // Blower room -> Biochemical (air supply)
  {
    id: 'pipe3a',
    path: 'M 375 130 L 375 160 L 560 160 L 560 130',
    animateDuration: 4,
    arrowPositions: [{ x: 375, y: 145, rotation: 90 }, { x: 468, y: 160, rotation: 0 }, { x: 560, y: 145, rotation: -90 }],
  },
  // Biochemical -> Secondary clarifier
  {
    id: 'pipe4',
    path: 'M 660 80 L 680 80',
    animateDuration: 3,
    arrowPositions: [{ x: 670, y: 80, rotation: 0 }],
  },
  // Secondary clarifier -> Return pump
  {
    id: 'pipe5',
    path: 'M 740 130 L 740 180',
    animateDuration: 2.5,
    arrowPositions: [{ x: 740, y: 155, rotation: 90 }],
  },
  // Return pump -> Biochemical (sludge return)
  {
    id: 'pipe6',
    path: 'M 660 225 L 560 225',
    animateDuration: 3.5,
    arrowPositions: [{ x: 610, y: 225, rotation: 180 }],
  },
  // Sludge -> Outlet
  {
    id: 'pipe7',
    path: 'M 640 270 L 660 270 L 660 290 L 720 290 L 720 330',
    animateDuration: 3,
    arrowPositions: [{ x: 650, y: 270, rotation: 0 }, { x: 660, y: 280, rotation: 90 }, { x: 690, y: 290, rotation: 0 }, { x: 720, y: 310, rotation: 90 }],
  },
  // Vertical pipe: Pretreatment -> Dosing
  {
    id: 'pipe8',
    path: 'M 230 130 L 230 180',
    animateDuration: 2.8,
    arrowPositions: [{ x: 230, y: 155, rotation: 90 }],
  },
  // Dosing -> Instrument room
  {
    id: 'pipe9',
    path: 'M 170 225 L 190 225',
    animateDuration: 3.2,
    arrowPositions: [{ x: 180, y: 225, rotation: 0 }],
  },
  // Instrument -> Power
  {
    id: 'pipe10',
    path: 'M 340 225 L 360 225',
    animateDuration: 2.5,
    arrowPositions: [{ x: 350, y: 225, rotation: 0 }],
  },
  // Power -> Sludge
  {
    id: 'pipe11',
    path: 'M 490 225 L 510 225',
    animateDuration: 3,
    arrowPositions: [{ x: 500, y: 225, rotation: 0 }],
  },
];

/* ---------- Component ---------- */
interface Props {
  onSelectArea?: (area: EquipmentArea) => void;
  selectedId?: string;
}

export default function EquipmentTopology({ onSelectArea, selectedId }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgSize, setSvgSize] = useState({ width: 800, height: 400 });

  const handleClick = useCallback((area: EquipmentArea) => {
    onSelectArea?.(area);
  }, [onSelectArea]);

  // Measure SVG size for absolute positioning
  useEffect(() => {
    const measure = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setSvgSize({ width: rect.width, height: rect.height });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const viewBoxWidth = 800;
  const viewBoxHeight = 400;

  const toScreenX = (vbX: number) => (vbX / viewBoxWidth) * svgSize.width;
  const toScreenY = (vbY: number) => (vbY / viewBoxHeight) * svgSize.height;

  return (
    <div className="relative w-full h-full flex">
      {/* Status legend */}
      <div className="flex flex-col gap-2 pr-3 flex-shrink-0 self-center">
        {[
          { key: 'normal', label: '运行中', color: '#00ff88' },
          { key: 'warning', label: '报警', color: '#ffcc00' },
          { key: 'danger', label: '故障', color: '#ff4444' },
          { key: 'offline', label: '离线', color: '#888888' },
        ].map((item) => (
          <div key={item.key} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: item.color,
                boxShadow: item.key !== 'offline' ? `0 0 4px ${item.color}` : 'none',
              }}
            />
            <span className="text-[11px] text-text-secondary">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Plant diagram with SVG + overlaid badges */}
      <div className="flex-1 relative" style={{ minWidth: 0 }}>
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Blueprint grid pattern */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f2540" strokeWidth="0.5" />
            </pattern>
            {/* Major grid pattern */}
            <pattern id="majorGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="url(#grid)" />
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#153050" strokeWidth="0.8" />
            </pattern>
            {/* Pipe glow gradient */}
            <linearGradient id="pipeGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00c8ff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00c8ff" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="pipeGlowVertical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00c8ff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00c8ff" stopOpacity="0.3" />
            </linearGradient>
            {/* Glow filter for selected/hovered areas */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Arrow marker */}
            <marker id="arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 8 4 L 0 8 L 2 4 Z" fill="#00c8ff" fillOpacity="0.8" />
            </marker>
          </defs>

          {/* Background */}
          <rect width="100%" height="100%" fill="#081828" rx="4" />
          <rect width="100%" height="100%" fill="url(#majorGrid)" rx="4" />

          {/* Border */}
          <rect
            x="1"
            y="1"
            width={viewBoxWidth - 2}
            height={viewBoxHeight - 2}
            rx="4"
            fill="none"
            stroke="#1a3a5c"
            strokeWidth="1"
          />

          {/* Outer wall outline */}
          <rect
            x="15"
            y="15"
            width={viewBoxWidth - 30}
            height={viewBoxHeight - 30}
            rx="2"
            fill="none"
            stroke="#1a3a5c"
            strokeWidth="1.5"
            strokeDasharray="8 4"
          />

          {/* Plant title */}
          <text x="400" y="14" textAnchor="middle" fill="#5a7a94" fontSize="10" fontFamily="PingFang SC, sans-serif">
            污水处理厂工艺流程拓扑图
          </text>

          {/* ===== Building areas ===== */}

          {/* 1. 进水系统 - top left */}
          <rect x="30" y="30" width="120" height="100" rx="4" fill="#0d1f35" stroke={hoveredId === 'inlet' || selectedId === 'inlet' ? '#00e5ff' : '#1a3a5c'} strokeWidth={selectedId === 'inlet' ? '2' : '1'} filter={hoveredId === 'inlet' ? 'url(#glow)' : undefined} />
          <text x="90" y="50" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">进水系统</text>
          <text x="90" y="65" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">粗格栅 / 细格栅</text>
          <text x="90" y="78" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">进水泵#1~#4</text>

          {/* 2. 预处理 - top left, next to inlet */}
          <rect x="170" y="30" width="120" height="100" rx="4" fill="#0d1f35" stroke={hoveredId === 'pretreatment' || selectedId === 'pretreatment' ? '#00e5ff' : '#1a3a5c'} strokeWidth={selectedId === 'pretreatment' ? '2' : '1'} filter={hoveredId === 'pretreatment' ? 'url(#glow)' : undefined} />
          <text x="230" y="50" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">预处理</text>
          <text x="230" y="65" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">旋流沉砂器</text>
          <text x="230" y="78" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">砂水分离器</text>

          {/* 3. 鼓风机房 - top */}
          <rect x="310" y="30" width="130" height="100" rx="4" fill="#0d1f35" stroke={hoveredId === 'blower' || selectedId === 'blower' ? '#00e5ff' : '#1a3a5c'} strokeWidth={selectedId === 'blower' ? '2' : '1'} filter={hoveredId === 'blower' ? 'url(#glow)' : undefined} />
          <text x="375" y="50" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">鼓风机房</text>
          <text x="375" y="65" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">鼓风机#1~#4</text>
          <text x="375" y="78" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">风量: 26.3 m³/min</text>

          {/* 4. 生化池 - large center */}
          <rect x="460" y="30" width="200" height="100" rx="4" fill="#0d1f35" stroke={hoveredId === 'biochemical' || selectedId === 'biochemical' ? '#00e5ff' : '#1a3a5c'} strokeWidth={selectedId === 'biochemical' ? '2' : '1'} filter={hoveredId === 'biochemical' ? 'url(#glow)' : undefined} />
          <text x="560" y="50" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">生化池区域</text>
          <text x="560" y="65" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">曝气器 / 搅拌器</text>
          <text x="560" y="78" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">DO仪 / MLSS仪</text>
          {/* Internal divisions */}
          <line x1="513" y1="30" x2="513" y2="130" stroke="#1a3a5c" strokeWidth="0.5" strokeDasharray="4 2" />
          <line x1="607" y1="30" x2="607" y2="130" stroke="#1a3a5c" strokeWidth="0.5" strokeDasharray="4 2" />
          <text x="487" y="118" textAnchor="middle" fill="#2a4a64" fontSize="6" fontFamily="PingFang SC, sans-serif">厌氧区</text>
          <text x="560" y="118" textAnchor="middle" fill="#2a4a64" fontSize="6" fontFamily="PingFang SC, sans-serif">缺氧区</text>
          <text x="633" y="118" textAnchor="middle" fill="#2a4a64" fontSize="6" fontFamily="PingFang SC, sans-serif">好氧区</text>

          {/* 5. 二沉池 - top right */}
          <rect x="680" y="30" width="120" height="100" rx="4" fill="#0d1f35" stroke={hoveredId === 'sedimentation' || selectedId === 'sedimentation' ? '#00e5ff' : '#1a3a5c'} strokeWidth={selectedId === 'sedimentation' ? '2' : '1'} filter={hoveredId === 'sedimentation' ? 'url(#glow)' : undefined} />
          <text x="740" y="50" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">二沉池</text>
          <text x="740" y="65" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">刮泥机</text>
          <text x="740" y="78" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">污泥泵</text>

          {/* 6. 回流泵 - middle right */}
          <rect x="660" y="180" width="140" height="90" rx="4" fill="#0d1f35" stroke={hoveredId === 'pump' || selectedId === 'pump' ? '#00e5ff' : '#1a3a5c'} strokeWidth={selectedId === 'pump' ? '2' : '1'} filter={hoveredId === 'pump' ? 'url(#glow)' : undefined} />
          <text x="730" y="200" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">回流泵房</text>
          <text x="730" y="215" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">回流泵#1~#6</text>
          <text x="730" y="228" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">剩余污泥泵</text>

          {/* 7. 加药间 - bottom left */}
          <rect x="30" y="180" width="140" height="90" rx="4" fill="#0d1f35" stroke={hoveredId === 'dosing' || selectedId === 'dosing' ? '#00e5ff' : '#1a3a5c'} strokeWidth={selectedId === 'dosing' ? '2' : '1'} filter={hoveredId === 'dosing' ? 'url(#glow)' : undefined} />
          <text x="100" y="200" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">加药间</text>
          <text x="100" y="215" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">PAC/PAM加药泵</text>
          <text x="100" y="228" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">次氯酸钠加药泵</text>

          {/* 8. 在线仪表 - bottom */}
          <rect x="190" y="180" width="150" height="90" rx="4" fill="#0d1f35" stroke={hoveredId === 'instrument' || selectedId === 'instrument' ? '#00e5ff' : '#1a3a5c'} strokeWidth={selectedId === 'instrument' ? '2' : '1'} filter={hoveredId === 'instrument' ? 'url(#glow)' : undefined} />
          <text x="265" y="200" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">在线仪表</text>
          <text x="265" y="215" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">COD / 氨氮分析仪</text>
          <text x="265" y="228" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">pH计 / 流量计</text>

          {/* 9. 配电室 - bottom */}
          <rect x="360" y="180" width="130" height="90" rx="4" fill="#0d1f35" stroke={hoveredId === 'power' || selectedId === 'power' ? '#00e5ff' : '#1a3a5c'} strokeWidth={selectedId === 'power' ? '2' : '1'} filter={hoveredId === 'power' ? 'url(#glow)' : undefined} />
          <text x="425" y="200" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">配电室</text>
          <text x="425" y="215" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">高压柜 / 低压柜</text>
          <text x="425" y="228" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">变压器</text>

          {/* 10. 污泥处理 - bottom */}
          <rect x="510" y="180" width="130" height="90" rx="4" fill="#0d1f35" stroke={hoveredId === 'sludge' || selectedId === 'sludge' ? '#00e5ff' : '#1a3a5c'} strokeWidth={selectedId === 'sludge' ? '2' : '1'} filter={hoveredId === 'sludge' ? 'url(#glow)' : undefined} />
          <text x="575" y="200" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">污泥处理</text>
          <text x="575" y="215" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">脱水机 / 浓缩机</text>
          <text x="575" y="228" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">污泥泵</text>

          {/* 11. 出水系统 - far right bottom */}
          <rect x="660" y="290" width="120" height="80" rx="4" fill="#0d1f35" stroke={hoveredId === 'outlet' || selectedId === 'outlet' ? '#00e5ff' : '#1a3a5c'} strokeWidth={selectedId === 'outlet' ? '2' : '1'} filter={hoveredId === 'outlet' ? 'url(#glow)' : undefined} />
          <text x="720" y="310" textAnchor="middle" fill="#5a7a94" fontSize="9" fontFamily="PingFang SC, sans-serif">出水系统</text>
          <text x="720" y="325" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">消毒池 / 出水泵</text>
          <text x="720" y="338" textAnchor="middle" fill="#3a5a74" fontSize="7" fontFamily="PingFang SC, sans-serif">巴氏计量槽</text>

          {/* ===== Connecting pipes ===== */}
          {pipes.map((pipe) => (
            <g key={pipe.id}>
              <path
                d={pipe.path}
                fill="none"
                stroke="url(#pipeGlow)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="6 4"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;-20;0"
                  dur={`${pipe.animateDuration}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  values="0.5;0.9;0.5"
                  dur={`${pipe.animateDuration}s`}
                  repeatCount="indefinite"
                />
              </path>
              {/* Arrow markers */}
              {pipe.arrowPositions.map((arrow, idx) => (
                <g key={idx} transform={`translate(${arrow.x}, ${arrow.y}) rotate(${arrow.rotation})`}>
                  <polygon points="-3,-3 3,0 -3,3" fill="#00c8ff" fillOpacity="0.9">
                    <animate
                      attributeName="fill-opacity"
                      values="0.5;1;0.5"
                      dur={`${pipe.animateDuration}s`}
                      repeatCount="indefinite"
                    />
                  </polygon>
                </g>
              ))}
            </g>
          ))}

          {/* Flow direction labels */}
          <text x="160" y="72" fill="#00c8ff" fontSize="6" fontFamily="PingFang SC, sans-serif" fillOpacity="0.5">进水</text>
          <text x="300" y="72" fill="#00c8ff" fontSize="6" fontFamily="PingFang SC, sans-serif" fillOpacity="0.5">沉砂</text>
          <text x="540" y="72" fill="#00c8ff" fontSize="6" fontFamily="PingFang SC, sans-serif" fillOpacity="0.5">曝气</text>
          <text x="670" y="72" fill="#00c8ff" fontSize="6" fontFamily="PingFang SC, sans-serif" fillOpacity="0.5">沉淀</text>
          <text x="610" y="218" fill="#00c8ff" fontSize="6" fontFamily="PingFang SC, sans-serif" fillOpacity="0.5">污泥回流</text>
          <text x="225" y="148" fill="#00c8ff" fontSize="6" fontFamily="PingFang SC, sans-serif" fillOpacity="0.5">加药</text>
          <text x="680" y="310" fill="#00c8ff" fontSize="6" fontFamily="PingFang SC, sans-serif" fillOpacity="0.5">排放</text>
        </svg>

        {/* ===== Equipment badges positioned absolutely over the SVG ===== */}
        {areas.map((area) => {
          const IconComp = iconMap[area.icon];
          const isSelected = selectedId === area.id;
          const isHovered = hoveredId === area.id;
          const color = statusColorMap[area.status];

          // Calculate screen position from viewBox coordinates
          const screenX = toScreenX(area.x);
          const screenY = toScreenY(area.y);

          return (
            <button
              key={area.id}
              onClick={() => handleClick(area)}
              onMouseEnter={() => setHoveredId(area.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="absolute flex flex-col items-center gap-0.5 transition-all duration-200"
              style={{
                left: `${screenX}px`,
                top: `${screenY - 14}px`,
                transform: 'translate(-50%, 0)',
                zIndex: isHovered || isSelected ? 10 : 1,
                cursor: 'pointer',
              }}
            >
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-full border transition-all duration-200"
                style={{
                  backgroundColor: isSelected || isHovered ? 'rgba(10, 26, 46, 0.95)' : 'rgba(10, 26, 46, 0.88)',
                  borderColor: isSelected ? '#00e5ff' : isHovered ? '#00c8ff' : color,
                  boxShadow: isSelected
                    ? `0 0 12px ${color}60, inset 0 0 6px ${color}30`
                    : isHovered
                    ? `0 0 10px ${color}40, inset 0 0 4px ${color}20`
                    : `0 0 4px ${color}20`,
                  minWidth: area.width * 0.6,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 4px ${color}`,
                  }}
                />
                <IconComp className="w-3 h-3 flex-shrink-0" style={{ color }} />
                <span className="text-[10px] text-text-primary whitespace-nowrap">{area.name}</span>
                <span className="text-[10px] font-data ml-auto" style={{ color }}>
                  {area.running}/{area.total}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
