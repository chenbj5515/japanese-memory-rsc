'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { MemoCard as MemoCardComponent } from '../card/memo-card'
import { motion } from 'framer-motion'
import { SkeuomorphicCard } from './skeuomorphic-card'
import { Button } from '../ui/button'
import { CompletionMessage } from './completion-message'
import { ScribbleReveal } from './scribble-reveal'
import { AudioPlayer } from './audio-player'
import { AnimatedCheckbox } from './animated-checkbox'
import { useTranslations } from 'next-intl'
import { getLocalizedMockData } from '@/utils/i18n-helpers'

// 定义类型接口
interface MemoCardData {
  id: string;
  translation: string;
  create_time: string;
  update_time: string;
  record_file_path: string | null;
  original_text: string;
  review_times: number;
  forget_count: number; 
  user_id: string;
  kana_pronunciation: string;
  context_url: string | null;
}

interface StudyItem {
  id: number;
  type: string;
  question: string;
  answer: string;
  memo_card: MemoCardData;
}

interface MockData {
  date: string;
  stats: {
    flashcards: number;
    words: number;
    score: number;
  };
  studyItems: StudyItem[];
}

// 将MemoCardData转换为MemoCard组件需要的格式
function convertMemoCardFormat(memoCard: MemoCardData) {
  return {
    ...memoCard,
    // 转换字符串日期为Date对象
    create_time: new Date(memoCard.create_time),
    update_time: new Date(memoCard.update_time),
    // 确保可为null的字段符合要求
    original_text: memoCard.original_text || null,
    review_times: memoCard.review_times ?? null,
    kana_pronunciation: memoCard.kana_pronunciation || null
  };
}

// 原始的mock数据，作为模板
const mockDataTemplate: MockData = {
    "date": "Feb 27, 2025",
    "stats": {
        "flashcards": 0,
        "words": 2,
        "score": 0
    },
    "studyItems": [
        {
            "id": 0,
            "type": "meaning",
            "question": "「ハーレム」の意味を忘れました、今覚えていますか？",
            "answer": "后宫",
            "memo_card": {
                "id": "",
                "translation": "我要打造一个全是我喜欢的专属女仆的后宫……",
                "create_time": "2025-01-27T13:05:39.128Z",
                "update_time": "2025-01-27T13:05:49.294Z",
                "record_file_path": "",
                "original_text": "俺好みの専属メイドで、ハーレムを作るなんてことも…",
                "review_times": 0,
                "forget_count": 1,
                "user_id": "",
                "kana_pronunciation": "おれすきのせんぞくめいどで、はーれむをつくるなんてことも…",
                "context_url": "https://www.netflix.com/watch/81402908?trackId=155573558&t=659"
            }
        },
        {
            "id": 1,
            "type": "meaning",
            "question": "「しらばっくれる」の意味を忘れました、今覚えていますか？",
            "answer": "装傻",
            "memo_card": {
                "id": "",
                "translation": "你还在装傻吗！",
                "create_time": "2025-02-08T13:52:36.929Z",
                "update_time": "2025-02-08T13:52:49.879Z",
                "record_file_path": "",
                "original_text": "まだしらばっくれるか！",
                "review_times": 0,
                "forget_count": 1,
                "user_id": "",
                "kana_pronunciation": "まだしらばっくれるか！",
                "context_url": "https://www.youtube.com/watch?v=QrwxVi9hWJg&t=14"
            }
        },
        {
            "id": 2,
            "type": "meaning",
            "question": "「しかねます」の意味を忘れました、今覚えていますか？",
            "answer": "无法",
            "memo_card": {
                "id": "",
                "translation": "关于先前您提出的请求，我们无法承接。",
                "create_time": "2024-03-01T04:50:37.906Z",
                "update_time": "2024-03-04T02:09:22.835Z",
                "record_file_path": null,
                "original_text": "先日、ご依頼いただいた件ですが、私どもではお引き受けしかねます。",
                "review_times": 4,
                "forget_count": 2,
                "user_id": "",
                "kana_pronunciation": "せんじつ、ごいらいいただいたけんですが、わたくしどもではおひきうけしかねます。",
                "context_url": null
            }
        },
        {
            "id": 3,
            "type": "meaning",
            "question": "「挙げ句の果てに」の意味を忘れました、今覚えていますか？",
            "answer": "最后结果是",
            "memo_card": {
                "id": "",
                "translation": "到头来连自己的罪行也不承认。",
                "create_time": "2025-02-08T13:53:34.156Z",
                "update_time": "2025-02-08T13:53:40.159Z",
                "record_file_path": "",
                "original_text": "挙げ句の果てに自分の罪も認められない",
                "review_times": 0,
                "forget_count": 1,
                "user_id": "",
                "kana_pronunciation": "あげくのはてにじぶんのつみもみとめられない",
                "context_url": "https://www.youtube.com/watch?v=QrwxVi9hWJg&t=21"
            }
        },
        {
            "id": 4,
            "type": "meaning",
            "question": "「引き下がれない」の意味を忘れました、今覚えていますか？",
            "answer": "退让不了",
            "memo_card": {
                "id": "",
                "translation": "既然来到这一步，我也无法退缩了。",
                "create_time": "2025-02-08T14:04:34.760Z",
                "update_time": "2025-02-08T14:04:39.753Z",
                "record_file_path": "",
                "original_text": "ここまできたら俺も引き下がれない",
                "review_times": 0,
                "forget_count": 1,
                "user_id": "",
                "kana_pronunciation": "ここまできたらおれもひきさがれない，",
                "context_url": "https://www.youtube.com/watch?v=QrwxVi9hWJg&t=426"
            }
        }
    ]
}

export default function DemoDailyReport() {
    const router = useRouter()
    const t = useTranslations('dailyReport');
    
    // 使用t函数本地化mock数据
    const mockData = getLocalizedMockData(t, mockDataTemplate);
    
    // 模拟数据
    const [activeItems, setActiveItems] = useState<StudyItem[]>(mockData.studyItems)
    const [showMemoCard, setShowMemoCard] = useState(false)
    const [currentMemoCard, setCurrentMemoCard] = useState<MemoCardData | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleComplete = (id: number) => {
        setActiveItems(prev => prev.filter(item => item.id !== id))
    }

    const handleShowMemoCard = (memoCard: MemoCardData) => {
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
    const noStudyRecord = mockData.stats.flashcards === 0 && mockData.stats.words === 0 && mockData.stats.score === 0;

    return (
        <div className="container mx-auto pl-[32px] pr-[32px] pt-[42px]">
            <div className="font-NewYork pb-[14px]">
                {showMemoCard && currentMemoCard ? (
                    <div className="fixed w-[100%] h-[100vh] left-[0] top-[0] backdrop-blur-[3px] backdrop-saturate-[180%] overflow-scroll z-[10000]">
                        <div ref={containerRef} className="sm:w-[auto] sm:min-w-[46vw] w-full p-[22px] absolute max-h-[92%] overflow-auto left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 transform">
                            <MemoCardComponent {...convertMemoCardFormat(currentMemoCard)} />
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
                            <p className="text-xl text-gray-600 tracking-[2px]">{mockData.date}</p>
                        </div>
                    </header>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <SkeuomorphicCard className='boder border-[#1d283a]'>
                            <div className="grid grid-cols-1 gap-2">
                                {/* <div className="px-6 text-center">
                                    <h2 className="text-lg font-medium text-gray-800">完了した学習</h2>
                                </div> */}
                                <div className="grid grid-cols-3 divide-x">
                                    <div className="px-6 py-4 text-center">
                                        <h3 className="text-[16px] font-mono font-semibold mb-1">{t('sentences')}</h3>
                                        <p className="text-2xl font-bold text-gray-900">{mockData.stats.flashcards}</p>
                                    </div>
                                    <div className="px-6 py-4 text-center">
                                        <h3 className="text-[16px] font-mono font-semibold mb-1">{t('words')}</h3>
                                        <p className="text-2xl font-bold text-gray-900">{mockData.stats.words}</p>
                                    </div>
                                    <div className="px-6 py-4 text-center">
                                        <h3 className="text-[16px] font-mono font-semibold mb-1">{t('test')}</h3>
                                        <p className="text-2xl font-bold text-gray-900">{mockData.stats.score}</p>
                                    </div>
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
        </div>
    )
}


interface StudyCardProps {
    id: number
    type: string
    question: string
    answer: string
    onComplete: (id: number) => void
    onShowMemoCard?: () => void
}

export function StudyCard({
    id,
    type,
    question,
    answer,
    onComplete,
    onShowMemoCard,
}: StudyCardProps) {
    const [isChecked, setIsChecked] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    const handleCheck = () => {
        setIsChecked(true)
        // 先触发动画，然后再调用onComplete
        setTimeout(() => setIsVisible(false), 100)
        // 确保在动画完成后调用onComplete
        setTimeout(() => onComplete(id), 600)
    }

    return (
        <div>
            <AnimatePresence mode="sync">
                {isVisible && (
                    <motion.div
                        layout
                        initial={{ opacity: 1, x: 0, height: 'auto' }}
                        exit={{
                            opacity: 0,
                            x: -100,
                            height: 0,
                            marginTop: 0,
                            transition: {
                                opacity: { duration: 0.4, ease: "easeOut" },
                                x: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
                                height: { duration: 0.3, delay: 0.1 },
                                marginTop: { duration: 0.3, delay: 0.1 }
                            }
                        }}
                        className="group mt-[24px]"
                    >
                        <motion.div
                            className="border border-[#1d283a] bg-white dark:bg-black rounded-xl shadow-sm px-4 py-6 flex items-center gap-4"
                            initial={{ y: 0 }}
                            exit={{ y: 0 }}
                        >
                            <AnimatedCheckbox checked={isChecked} onChange={handleCheck} />

                            <div className="flex-1 min-w-0 text-[18px]">
                                <div className="flex items-center gap-4">
                                    {type === 'listening' && <AudioPlayer originalText={answer} />}
                                    <p className="text-gray-700 text-[15px] truncate">{question}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <ScribbleReveal content={answer} onContentClick={onShowMemoCard} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}