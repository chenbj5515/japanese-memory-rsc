'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal, MessageCircle } from 'lucide-react'
import { AnimatedCheckbox } from './animated-checkbox'
import { ScribbleReveal } from './scribble-reveal'
import { AudioPlayer } from './audio-player'

interface StudyCardProps {
  id: number
  type: string
  question: string
  answer: string
  audioSrc?: string
  onComplete: (id: number) => void
}

export function StudyCard({
  id,
  type,
  question,
  answer,
  audioSrc,
  onComplete,
}: StudyCardProps) {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheck = () => {
    setIsChecked(true)
    // Reduced delay to 400ms for faster disappearance
    setTimeout(() => onComplete(id), 400)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 1, height: 'auto' }}
      exit={{
        opacity: 0,
        height: 0,
        transition: {
          height: { duration: 0.15 }, // Faster height animation
          opacity: { duration: 0.15 }  // Faster opacity animation
        }
      }}
      className="group"
    >
      <div className="bg-white dark:bg-black rounded-xl shadow-sm px-4 py-6 flex items-center gap-4">
        <AnimatedCheckbox checked={isChecked} onChange={handleCheck} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4">
            {type === 'listening' && <AudioPlayer src={audioSrc!} />}
            <p className="text-gray-700 text-sm truncate">{question}</p>
          </div>
        </div>

        <div className="flex items-center">
          <ScribbleReveal content={answer} />
        </div>
      </div>
    </motion.div>
  )
}

