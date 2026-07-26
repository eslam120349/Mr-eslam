import { useMemo } from 'react'

const MATH_SYMBOLS = ['+', '−', '×', '÷', '√', 'π', '∫', 'x²', 'sin', 'cos', '∑', '∞', 'θ', '∆', '≠']

export default function FloatingMathBg() {
  const items = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      symbol: MATH_SYMBOLS[i % MATH_SYMBOLS.length],
      left: `${Math.floor(Math.random() * 95)}%`,
      top: `${Math.floor(Math.random() * 95)}%`,
      size: `${Math.floor(Math.random() * 24) + 16}px`,
      duration: `${Math.floor(Math.random() * 12) + 10}s`,
      delay: `${(Math.random() * 5).toFixed(1)}s`,
      opacity: (Math.random() * 0.12 + 0.04).toFixed(2),
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {items.map((item) => (
        <span
          key={item.id}
          className="absolute font-bold text-dodger-600 dark:text-dodger-300 animate-float"
          style={{
            left: item.left,
            top: item.top,
            fontSize: item.size,
            opacity: item.opacity,
            animationDuration: item.duration,
            animationDelay: item.delay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  )
}
