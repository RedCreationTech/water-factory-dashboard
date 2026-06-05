import { useState, useEffect, useRef } from 'react'

/**
 * Simulates realistic data fluctuation around a base value.
 * @param baseValue - The base numeric value
 * @param variance - Max fluctuation amount (default: 2% of base)
 * @param intervalMs - Update interval in ms (default: 3000)
 */
export function useFluctuation(
  baseValue: number,
  variance?: number,
  intervalMs: number = 3000
): number {
  const [value, setValue] = useState(baseValue)
  const baseRef = useRef(baseValue)
  const varRef = useRef(variance ?? baseValue * 0.02)

  useEffect(() => {
    baseRef.current = baseValue
    varRef.current = variance ?? baseValue * 0.02
  }, [baseValue, variance])

  useEffect(() => {
    const tick = () => {
      const v = varRef.current
      const delta = (Math.random() - 0.5) * 2 * v
      setValue(Number((baseRef.current + delta).toFixed(2)))
    }

    tick() // initial
    const id = setInterval(tick, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return value
}

/**
 * Formats a fluctuating value with commas
 */
export function formatFluctuation(value: number, decimals: number = 0): string {
  if (decimals === 0) return Math.round(value).toLocaleString('en-US')
  return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}
