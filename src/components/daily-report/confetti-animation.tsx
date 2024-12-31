'use client'

import { useEffect, useRef } from 'react'
import confetti, { Shape } from 'canvas-confetti'

export function ConfettiAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = (rect.left + rect.right) / 2 / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    const defaults = { 
      startVelocity: 15, 
      spread: 360, 
      ticks: 100, 
      zIndex: 0,
      particleCount: 50,
      origin: { x, y },
      colors: ['#FFB6C1', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C'],
      shapes: ['circle', 'square'] as Shape[],
      scalar: 1,
      gravity: 0.5,
    }

    function triggerConfetti(delay: number) {
      setTimeout(() => {
        confetti(defaults)
      }, delay)
    }

    // Trigger confetti 3 times with delays
    triggerConfetti(0)    // Immediate
    triggerConfetti(1500) // After 1.5 seconds
    triggerConfetti(3000) // After 3 seconds

    return () => {
      confetti.reset()
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" />
}