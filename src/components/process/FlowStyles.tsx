import { memo } from 'react'

// Inject flow animation styles as a component since we can't modify global CSS
const FlowStyles = memo(function FlowStyles() {
  return (
    <style>{`
      @keyframes flow-dash {
        0% {
          stroke-dashoffset: 0;
        }
        100% {
          stroke-dashoffset: -14;
        }
      }
      .animate-flow-dash {
        animation: flow-dash 1.5s linear infinite;
      }
      @keyframes flow-particle {
        0% {
          transform: translateX(-16px);
          opacity: 0;
        }
        20% {
          opacity: 0.6;
        }
        80% {
          opacity: 0.6;
        }
        100% {
          transform: translateX(16px);
          opacity: 0;
        }
      }
    `}</style>
  )
})

export default FlowStyles
