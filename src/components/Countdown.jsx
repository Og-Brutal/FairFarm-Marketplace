import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

const Countdown = ({ endTime, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const diff = endTime - Date.now()
    if (diff <= 0) return null
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const left = calculateTimeLeft()
      setTimeLeft(left)
      if (!left && onEnd) {
        onEnd()
        clearInterval(timer)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [endTime])

  if (!timeLeft) {
    return (
      <span className="text-xs font-medium text-red-500 flex items-center gap-1">
        <Clock size={12} /> Ended
      </span>
    )
  }

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <span className="text-sm font-mono font-semibold text-rust-400 flex items-center gap-1">
      <Clock size={14} className="text-rust-400/70" />
      {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
    </span>
  )
}

export default Countdown
