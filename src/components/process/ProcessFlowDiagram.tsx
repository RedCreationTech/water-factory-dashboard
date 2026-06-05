import { memo } from 'react'

interface ProcessNode {
  id: string
  name: string
  params: { label: string; value: string }[]
  isFocused?: boolean
}

const topNodes: ProcessNode[] = [
  { id: 'inlet', name: '进水泵房', params: [{ label: '流量', value: '12,580 m³/h' }, { label: '液位', value: '3.25 m' }] },
  { id: 'pretreatment', name: '预处理', params: [{ label: '流量', value: '12,280 m³/h' }, { label: 'SS', value: '186 mg/L' }] },
  { id: 'primary', name: '初沉池', params: [{ label: '流量', value: '11,680 m³/h' }, { label: 'SS去除率', value: '52.6%' }] },
  { id: 'biochemical', name: '生化池', params: [{ label: 'DO', value: '2.15 mg/L' }, { label: 'MLSS', value: '3,620 mg/L' }, { label: 'ORP', value: '-152 mV' }], isFocused: true },
]

const bottomNodes: ProcessNode[] = [
  { id: 'secondary', name: '二沉池', params: [{ label: '流量', value: '9,860 m³/h' }, { label: 'SS', value: '12 mg/L' }] },
  { id: 'dosing', name: '加药', params: [{ label: 'PAC', value: '45.0 L/h' }, { label: 'PAM', value: '12.6 L/h' }] },
  { id: 'disinfection', name: '消毒/出水', params: [{ label: '流量', value: '9,860 m³/h' }, { label: '余氯', value: '0.56 mg/L' }, { label: '达标率', value: '99.32%' }] },
  { id: 'sludge', name: '污泥处理', params: [{ label: '含水率', value: '78.6%' }, { label: '浓度', value: '3.25%' }] },
]

// Static horizontal arrow with CSS animation only
const HArrow = memo(function HArrow() {
  return (
    <div className="flex items-center justify-center w-10 flex-shrink-0">
      <svg width="36" height="16" viewBox="0 0 36 16">
        <defs>
          <linearGradient id="hGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00a3b3" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00a3b3" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <line x1="0" y1="8" x2="30" y2="8" stroke="url(#hGrad)" strokeWidth="2" strokeDasharray="4 3" className="animate-flow-dash" />
        <polygon points="30,4 36,8 30,12" fill="#00e5ff" opacity="0.8" />
      </svg>
    </div>
  )
})

// Static vertical arrow
const VArrow = memo(function VArrow() {
  return (
    <div className="flex items-center justify-center h-6">
      <svg width="16" height="28" viewBox="0 0 16 28">
        <defs>
          <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00a3b3" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00a3b3" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <line x1="8" y1="0" x2="8" y2="22" stroke="url(#vGrad)" strokeWidth="2" strokeDasharray="4 3" className="animate-flow-dash" />
        <polygon points="4,22 8,28 12,22" fill="#00e5ff" opacity="0.8" />
      </svg>
    </div>
  )
})

function NodeCard({ node, onSelectNode }: { node: ProcessNode; onSelectNode?: (name: string) => void }) {
  const isFocused = node.isFocused
  return (
    <button
      onClick={() => onSelectNode?.(node.name)}
      className={
        'relative flex flex-col items-center rounded-xl cursor-pointer transition-all duration-200 ' +
        (isFocused
          ? 'border-2 border-accent-cyan bg-accent-cyan/10 w-[140px] p-3 '
          : 'border border-border-primary bg-bg-panel min-w-[110px] p-2 hover:border-border-glow ')
      }
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={isFocused ? 'w-2.5 h-2.5 rounded-full bg-accent-cyan' : 'w-2 h-2 rounded-full bg-status-normal'} />
        <span className={isFocused ? 'text-xs font-semibold text-accent-cyan' : 'text-[11px] font-medium text-text-primary'}>
          {node.name}
        </span>
      </div>
      <div className="flex flex-col items-center gap-0.5 w-full">
        {node.params.map((p) => (
          <div key={p.label} className="flex items-center gap-1 text-[10px]">
            <span className="text-text-tertiary">{p.label}</span>
            <span className="font-data text-text-primary">{p.value}</span>
          </div>
        ))}
      </div>
    </button>
  )
}

interface Props { onSelectNode?: (nodeName: string) => void }

function ProcessFlowDiagram({ onSelectNode }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-1 gap-0">
      {/* Top row */}
      <div className="flex items-center justify-center">
        {topNodes.map((node, idx) => (
          <div key={node.id} className="flex items-center">
            <NodeCard node={node} onSelectNode={onSelectNode} />
            {idx < topNodes.length - 1 && <HArrow />}
          </div>
        ))}
      </div>
      {/* Vertical connector - positioned under 生化池 (4th node) */}
      <div className="flex justify-center w-full" style={{ paddingLeft: 'calc(3 * 150px + 18px)' }}>
        <VArrow />
      </div>
      {/* Bottom row */}
      <div className="flex items-center justify-center">
        {bottomNodes.map((node, idx) => (
          <div key={node.id} className="flex items-center">
            <NodeCard node={node} onSelectNode={onSelectNode} />
            {idx < bottomNodes.length - 1 && <HArrow />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(ProcessFlowDiagram)
