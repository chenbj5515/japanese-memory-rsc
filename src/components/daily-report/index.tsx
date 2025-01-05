'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SkeuomorphicCard } from './skeuomorphic-card'
import { StudyCard } from './study-card'
import { useState } from 'react'
import { CompletionMessage } from './completion-message'
import { Button } from '../ui/button'

interface ReportData {
  date: string
  stats: {
    flashcards: number
    words: number
    score: number
  }
  studyItems: Array<{
    id: number
    type: string
    question: string
    answer: string
  }>
}

export default function DailyReport({ data }: { data: ReportData }) {
  const [activeItems, setActiveItems] = useState(data.studyItems)
  const router = useRouter()

  const handleComplete = (id: number) => {
    setActiveItems(prev => prev.filter(item => item.id !== id))
  }

  const isAllCompleted = activeItems.length === 0;
  const noStudyRecord = data.stats.flashcards === 0 && data.stats.words === 0 && data.stats.score === 0;

  return (
    <div className="font-NewYork pb-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <header className="text-center mb-12 ">
          <p className="text-xl text-gray-600 tracking-[2px]">{data.date}</p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SkeuomorphicCard>
            <div className="grid grid-cols-3 divide-x">
              <div className="px-6 py-4 text-center">
                <h3 className="text-sm text-gray-600 mb-1">文</h3>
                <p className="text-2xl font-bold text-gray-900">{data.stats.flashcards}</p>
              </div>
              <div className="px-6 py-4 text-center">
                <h3 className="text-sm text-gray-600 mb-1">単語</h3>
                <p className="text-2xl font-bold text-gray-900">{data.stats.words}</p>
              </div>
              <div className="px-6 py-4 text-center">
                <h3 className="text-sm text-gray-600 mb-1">テスト</h3>
                <p className="text-2xl font-bold text-gray-900">{data.stats.score}</p>
              </div>
            </div>
          </SkeuomorphicCard>
        </motion.div>

        <motion.div layout className="space-y-2">
          <AnimatePresence mode="sync">
            {noStudyRecord ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-6">
                  今日はまだ学習記録がありません。最近学んだ文を復習してみませんか？
                </p>
                <Button onClick={() => router.push('/latest')}>
                  復習を始める
                </Button>
              </div>
            ) : !isAllCompleted ? (
              activeItems.map((item) => (
                <StudyCard
                  key={item.id}
                  {...item}
                  onComplete={() => handleComplete(item.id)}
                />
              ))
            ) : (
              <CompletionMessage key="completion" />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}
