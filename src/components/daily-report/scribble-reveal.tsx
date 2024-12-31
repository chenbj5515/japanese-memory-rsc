'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ScribbleRevealProps {
  content: string
  className?: string
}

export function ScribbleReveal({ content, className = "" }: ScribbleRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div className={`relative inline-block ${className} h-6`} >
      <motion.div
        initial={false}
        animate={{
          opacity: isRevealed ? 0 : 1,
          scale: isRevealed ? 0.8 : 1,
        }}
        className="cursor-pointer"
        onClick={() => setIsRevealed(true)}
      >
        {!isRevealed && (
          <div className="bg-[url('/scribble.svg')] bg-cover min-w-[100px] h-6 inline-block" />
        )}
      </motion.div>
      <div
        className="text-purple-600 font-medium h-6"
        style={{ display: isRevealed ? 'block' : 'none' }}
      >
        {content}
      </div>
    </div>
  )
}

