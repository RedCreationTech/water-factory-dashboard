import { cn } from '@/lib/utils'
import { useState } from 'react'

interface NodeItem {
  name: string
  normal: number
  abnormal: number
  offline: number
}

const nodes: NodeItem[] = [
  { name: '进水及提升', normal: 12, abnormal: 18, offline: 0 },
  { name: '预处理', normal: 18, abnormal: 26, offline: 2 },
  { name: '初沉池', normal: 16, abnormal: 22, offline: 1 },
  { name: '生化池', normal: 24, abnormal: 32, offline: 1 },
  { name: '二沉池', normal: 16, abnormal: 20, offline: 0 },
  { name: '加药', normal: 10, abnormal: 14, offline: 0 },
  { name: '消毒/出水', normal: 10, abnormal: 14, offline: 0 },
  { name: '污泥处理', normal: 14, abnormal: 18, offline: 1 },
]

interface NodeNavTreeProps {
  selectedNode: string
  onSelectNode: (name: string) => void
}

export default function NodeNavTree({ selectedNode, onSelectNode }: NodeNavTreeProps) {
  const [selected, setSelected] = useState(selectedNode)

  const handleClick = (name: string) => {
    setSelected(name)
    onSelectNode(name)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-text-secondary border-b border-border-subtle">
        <span className="flex-1">节点名称</span>
        <span className="w-8 text-center text-status-normal">正常</span>
        <span className="w-8 text-center text-status-warning">异常</span>
        <span className="w-8 text-center text-status-offline">离线</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {nodes.map((node, idx) => {
          const isSelected = node.name === selected
          return (
            <button
              key={node.name}
              onClick={() => handleClick(node.name)}
              className={cn(
                'w-full flex items-center gap-1 px-3 py-2 text-xs transition-all duration-200 text-left',
                isSelected
                  ? 'bg-bg-active text-text-primary border-l-[2px] border-accent-cyan'
                  : 'text-text-secondary hover:bg-bg-panel-hover border-l-[2px] border-transparent'
              )}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  isSelected ? 'bg-accent-cyan' : 'bg-status-normal'
                )}
              />
              <span className="flex-1 truncate">{node.name}</span>
              <span className="w-8 text-center font-data text-status-normal">{node.normal}</span>
              <span className="w-8 text-center font-data text-status-warning">{node.abnormal}</span>
              <span className="w-8 text-center font-data text-status-offline">{node.offline}</span>
            </button>
          )
        })}
      </div>

      {/* Hint */}
      <div className="px-3 py-2 text-[11px] text-text-tertiary border-t border-border-subtle">
        提示: 点击节点切换详情，双击进入设备视图
      </div>
    </div>
  )
}
