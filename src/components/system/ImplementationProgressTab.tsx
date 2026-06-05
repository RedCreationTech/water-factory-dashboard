import { useMemo } from 'react'
import {
  Target,
  CheckCircle,
  Calendar,
  Clock,
  ChevronRight,
} from 'lucide-react'
import KPICard from '@/components/KPICard'
import Panel from '@/components/Panel'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Milestone {
  name: string
  done: boolean
}

interface Phase {
  number: number
  name: string
  duration: string
  timeRange: string
  progress: number
  status: string
  statusType: 'completed' | 'in-progress' | 'pending'
  milestones: Milestone[]
  color: string
  bgColor: string
  barColor: string
}

interface Task {
  name: string
  owner: string
  deadline: string
  priority: string
  priorityType: 'high' | 'medium' | 'normal'
  status: string
  statusType: 'completed' | 'in-progress' | 'pending'
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PHASES: Phase[] = [
  {
    number: 1,
    name: '第一阶段：现场摸底与改造筹备',
    duration: '1-2周',
    timeRange: '2025-05-01 ~ 2025-05-15',
    progress: 100,
    status: '已完成',
    statusType: 'completed',
    milestones: [
      { name: '点位梳理', done: true },
      { name: '仪表补齐', done: true },
      { name: '网关部署', done: true },
      { name: '数据调试', done: true },
    ],
    color: '#00ff88',
    bgColor: 'rgba(0, 255, 136, 0.15)',
    barColor: '#00ff88',
  },
  {
    number: 2,
    name: '第二阶段：数据积累与模型训练',
    duration: '4-8周',
    timeRange: '2025-05-15 ~ 2025-06-30',
    progress: 85,
    status: '进行中',
    statusType: 'in-progress',
    milestones: [
      { name: '数据采集', done: true },
      { name: '基础模型', done: true },
      { name: '机理约束', done: true },
      { name: '仿真验证', done: false },
    ],
    color: '#00e5ff',
    bgColor: 'rgba(0, 229, 255, 0.15)',
    barColor: '#00e5ff',
  },
  {
    number: 3,
    name: '第三阶段：小范围试点投用',
    duration: '2周',
    timeRange: '2025-07-01 ~ 2025-07-15',
    progress: 40,
    status: '进行中',
    statusType: 'in-progress',
    milestones: [
      { name: '曝气试点', done: false },
      { name: '对比验证', done: false },
      { name: '参数微调', done: false },
      { name: '达标确认', done: false },
    ],
    color: '#ffcc00',
    bgColor: 'rgba(255, 204, 0, 0.15)',
    barColor: '#ffcc00',
  },
  {
    number: 4,
    name: '第四阶段：全功能上线与持续迭代',
    duration: '长期',
    timeRange: '2025-07-15 ~ 2025-08-15',
    progress: 15,
    status: '待启动',
    statusType: 'pending',
    milestones: [
      { name: '加药优化', done: false },
      { name: '回流优化', done: false },
      { name: '碳排报表', done: false },
      { name: '持续迭代', done: false },
    ],
    color: '#4488ff',
    bgColor: 'rgba(68, 136, 255, 0.15)',
    barColor: '#4488ff',
  },
]

const WEEKLY_TASKS: Task[] = [
  {
    name: '完成仿真验证模型部署与初步测试',
    owner: '张伟',
    deadline: '2025-06-05',
    priority: '高',
    priorityType: 'high',
    status: '进行中',
    statusType: 'in-progress',
  },
  {
    name: '曝气池试点现场设备校准',
    owner: '李娜',
    deadline: '2025-06-06',
    priority: '高',
    priorityType: 'high',
    status: '进行中',
    statusType: 'in-progress',
  },
  {
    name: '第三阶段试点方案评审',
    owner: '王强',
    deadline: '2025-06-10',
    priority: '中',
    priorityType: 'medium',
    status: '待启动',
    statusType: 'pending',
  },
  {
    name: '全功能上线部署环境准备',
    owner: '赵敏',
    deadline: '2025-06-12',
    priority: '中',
    priorityType: 'medium',
    status: '待启动',
    statusType: 'pending',
  },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getStatusBadgeClasses(statusType: string) {
  switch (statusType) {
    case 'completed':
      return 'bg-[rgba(0,255,136,0.15)] text-[#00ff88] border-[#00ff88]'
    case 'in-progress':
      return 'bg-[rgba(0,229,255,0.15)] text-[#00e5ff] border-[#00e5ff]'
    case 'pending':
      return 'bg-[rgba(136,136,136,0.15)] text-[#888888] border-[#888888]'
    default:
      return 'bg-[rgba(136,136,136,0.15)] text-[#888888] border-[#888888]'
  }
}

function getPriorityClasses(priorityType: string) {
  switch (priorityType) {
    case 'high':
      return 'bg-[rgba(255,68,68,0.15)] text-[#ff4444]'
    case 'medium':
      return 'bg-[rgba(255,204,0,0.15)] text-[#ffcc00]'
    default:
      return 'bg-[rgba(0,229,255,0.15)] text-[#00e5ff]'
  }
}

function getTaskStatusClasses(statusType: string) {
  switch (statusType) {
    case 'completed':
      return 'bg-[rgba(0,255,136,0.15)] text-[#00ff88]'
    case 'in-progress':
      return 'bg-[rgba(0,229,255,0.15)] text-[#00e5ff]'
    default:
      return 'bg-[rgba(136,136,136,0.15)] text-[#888888]'
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ImplementationProgressTab() {
  const kpiCards = useMemo(
    () => [
      {
        icon: <Target size={16} />,
        iconBg: '#004488',
        label: '项目总体进度',
        value: 68,
        unit: '%',
        changePercent: '当前阶段: 第三阶段',
        positive: true,
      },
      {
        icon: <CheckCircle size={16} />,
        iconBg: '#006644',
        label: '已完成里程碑',
        value: '12/18',
        unit: '',
        changePercent: '完成率 66.7%',
        positive: true,
      },
      {
        icon: <Calendar size={16} />,
        iconBg: '#557700',
        label: '预计上线时间',
        value: 71,
        unit: '天',
        changePercent: '预计上线: 2025-08-15',
        positive: true,
      },
    ],
    []
  )

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* Top KPI Row */}
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        {kpiCards.map((kpi, idx) => (
          <KPICard
            key={idx}
            icon={kpi.icon}
            iconBg={kpi.iconBg}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            changePercent={kpi.changePercent}
            positive={kpi.positive}
          />
        ))}
      </div>

      {/* Main: 4-phase Gantt-style progress */}
      <Panel title="项目四阶段实施进度" className="flex-1 min-h-0">
        <div className="flex flex-col gap-3 h-full overflow-y-auto custom-scrollbar pr-1">
          {PHASES.map((phase) => (
            <div
              key={phase.number}
              className="rounded-md border border-border-primary bg-bg-panel p-4 flex flex-col gap-3"
            >
              {/* Phase header row */}
              <div className="flex items-center gap-3">
                {/* Phase number circle */}
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0"
                  style={{
                    backgroundColor: phase.bgColor,
                    color: phase.color,
                    border: `1px solid ${phase.color}`,
                  }}
                >
                  {phase.number}
                </span>

                {/* Phase name */}
                <span className="text-[15px] font-semibold text-text-primary flex-1 truncate">
                  {phase.name}
                </span>

                {/* Duration badge */}
                <span className="flex items-center gap-1 text-xs text-text-tertiary flex-shrink-0 mr-2">
                  <Clock size={12} />
                  {phase.duration}
                </span>

                {/* Status badge */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClasses(phase.statusType)}`}
                >
                  {phase.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">阶段进度</span>
                  <span
                    className="font-mono-data font-bold"
                    style={{ color: phase.color }}
                  >
                    {phase.progress}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#0a1a2e] overflow-hidden border border-border-primary">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${phase.progress}%`,
                      backgroundColor: phase.barColor,
                      boxShadow: `0 0 8px ${phase.barColor}`,
                    }}
                  />
                </div>
              </div>

              {/* Time range + milestones */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <Calendar size={12} />
                  <span>{phase.timeRange}</span>
                </div>

                {/* Milestones */}
                <div className="flex items-center gap-3">
                  {phase.milestones.map((m) => (
                    <span
                      key={m.name}
                      className="flex items-center gap-1 text-xs"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[10px]"
                        style={{
                          backgroundColor: m.done
                            ? 'rgba(0, 255, 136, 0.2)'
                            : 'rgba(255, 204, 0, 0.15)',
                          color: m.done ? '#00ff88' : '#ffcc00',
                        }}
                      >
                        {m.done ? '\u2713' : '\u23F3'}
                      </span>
                      <span
                        className={
                          m.done
                            ? 'text-text-secondary'
                            : 'text-text-tertiary'
                        }
                      >
                        {m.name}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Bottom: Weekly tasks table */}
      <Panel
        title="本周关键任务"
        className="flex-shrink-0"
        rightAction={
          <span className="flex items-center gap-1 text-xs text-text-tertiary cursor-pointer hover:text-accent-cyan transition-colors">
            查看全部
            <ChevronRight size={14} />
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-primary text-text-tertiary text-xs">
                <th className="text-left py-2 px-3 font-medium">任务</th>
                <th className="text-left py-2 px-3 font-medium w-[100px]">
                  负责人
                </th>
                <th className="text-left py-2 px-3 font-medium w-[110px]">
                  截止时间
                </th>
                <th className="text-center py-2 px-3 font-medium w-[80px]">
                  优先级
                </th>
                <th className="text-center py-2 px-3 font-medium w-[90px]">
                  状态
                </th>
              </tr>
            </thead>
            <tbody>
              {WEEKLY_TASKS.map((task, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border-primary last:border-b-0 hover:bg-bg-panel-hover transition-colors"
                >
                  <td className="py-2.5 px-3 text-text-primary">
                    {task.name}
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary">
                    {task.owner}
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary">
                    {task.deadline}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityClasses(task.priorityType)}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getTaskStatusClasses(task.statusType)}`}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
