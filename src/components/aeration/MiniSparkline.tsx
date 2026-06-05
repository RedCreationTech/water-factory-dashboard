interface MiniSparklineProps {
  data: number[]
  color?: string
  width?: number
  height?: number
  positive?: boolean
}

export default function MiniSparkline({
  data,
  color,
  width = 40,
  height = 20,
  positive = true,
}: MiniSparklineProps) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pad = 2

  const pts = data
    .map((p, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - pad - ((p - min) / range) * (height - pad * 2)
      return `${x},${y}`
    })
    .join(' ')

  const fillPts = `0,${height} ${pts} ${width},${height}`
  const strokeColor = color || (positive ? '#00ff88' : '#ffcc00')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="flex-shrink-0">
      <defs>
        <linearGradient id={`spark-grad-${positive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#spark-grad-${positive})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
