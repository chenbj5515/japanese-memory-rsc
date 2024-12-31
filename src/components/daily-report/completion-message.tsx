'use client'

import { motion } from 'framer-motion'
import { ConfettiAnimation } from './confetti-animation'

export function CompletionMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative dark:bg-black bg-white rounded-xl shadow-sm px-6 py-12 text-center"
    >
      <ConfettiAnimation />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          おめでとうございます！
        </h3>
        <p className="text-gray-600">
          今日の学習の振り返りが全て完了しました。
          <br />
          明日も頑張りましょう！
        </p>
      </motion.div>
    </motion.div>
  )
}