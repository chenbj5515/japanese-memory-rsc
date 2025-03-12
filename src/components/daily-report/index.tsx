'use client'

import React, { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { History } from 'lucide-react'
import { SkeuomorphicCard } from './skeuomorphic-card'
import { StudyCard } from './study-card'
import { CompletionMessage } from './completion-message'
import { Button } from '../ui/button'
import { MemoCard } from '@/components/card/memo-card'

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
    memo_card?: any
  }>
}

export default function DailyReport({ data }: { data: ReportData }) {
  console.log(data, "data=============")
  const [activeItems, setActiveItems] = useState(data.studyItems)
  const [showMemoCard, setShowMemoCard] = useState(false)
  const [currentMemoCard, setCurrentMemoCard] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleComplete = (id: number) => {
    setActiveItems(prev => prev.filter(item => item.id !== id))
  }

  const handleShowMemoCard = (memoCard: any) => {
    if (memoCard) {
      setCurrentMemoCard(memoCard)
      setShowMemoCard(true)
    }
  }

  // 添加点击外部关闭弹窗的效果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Node) {
        if (containerRef.current && !containerRef.current.contains(target as Node)) {
          setShowMemoCard(false);
        }
      }
    };
    
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, []);

  const isAllCompleted = activeItems.length === 0;
  const noStudyRecord = data.stats.flashcards === 0 && data.stats.words === 0 && data.stats.score === 0;

  return (
    <div className="font-NewYork pb-[14px]">
      {showMemoCard && currentMemoCard ? (
        <div className="fixed w-[100vw] h-[100vh] left-[0] top-[0] backdrop-blur-[3px] backdrop-saturate-[180%] overflow-scroll z-[10000]">
          <div ref={containerRef} className="sm:w-[auto] sm:min-w-[46vw] w-full p-[22px] absolute max-h-[92%] overflow-auto left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 transform">
            <MemoCard {...currentMemoCard} />
          </div>
        </div>
      ) : null}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <header className="text-center mb-12 flex justify-between items-center relative">
          <div className="absolute left-1/2 -translate-x-1/2">
            <p className="text-xl text-gray-600 tracking-[2px]">{data.date}</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-base font-medium">
            <Link href="/daily-report/history" className="flex items-center gap-2">
              <History className="h-5 w-5" />
              履歴
            </Link>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SkeuomorphicCard className='boder border-[#1d283a]'>
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

        <motion.div className={`${!noStudyRecord && !isAllCompleted ? '' : 'mt-[14px]'}`}>
          <AnimatePresence mode="sync">
            {noStudyRecord ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-6 font-sans">
                  今日はまだ学習記録がありません。最近学んだ文を復習してみませんか？
                </p>
                <Button onClick={() => router.push('/memo-cards')}>
                  復習を始める
                </Button>
              </div>
            ) : !isAllCompleted ? (
              activeItems.map((item) => (
                <StudyCard
                  key={item.id}
                  {...item}
                  onComplete={() => handleComplete(item.id)}
                  onShowMemoCard={() => handleShowMemoCard(item.memo_card)}
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
