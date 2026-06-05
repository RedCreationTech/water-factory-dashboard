import { memo } from 'react'

const FlowStyles = memo(function FlowStyles() {
  return (
    <style>{`
      @keyframes flow-dash {
        0% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: -20; }
      }
      .animate-flow-dash {
        animation: flow-dash 1.2s linear infinite;
      }
      @keyframes pulse-glow-point {
        0%, 100% { box-shadow: 0 0 4px rgba(0, 229, 255, 0.6); }
        50% { box-shadow: 0 0 12px rgba(0, 229, 255, 0.9); }
      }
      .animate-pulse-point {
        animation: pulse-glow-point 2s ease-in-out infinite;
      }
    `}</style>
  )
})

export default FlowStyles
