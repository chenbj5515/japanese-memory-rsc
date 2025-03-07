"use client"
import Image from "next/image"
import { useTranslations, useLocale } from 'next-intl';
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import React from "react"
import { DemoCard } from "@/components/card/demo-card"
import { DemoWordCard, defaultWordCardInfo } from "@/components/word-card/demo-word-card"
import { MemoCard } from "@/components/card/memo-card"
import DemoExam from "@/components/exam/demo-exam"
import DemoDailyReport from "@/components/daily-report/demo-daily-report"

export default function LandingPage() {
  const router = useRouter()
  const t = useTranslations();
  const locale = useLocale();

  // 添加状态管理
  const [showDemo, setShowDemo] = React.useState<null | 'memo' | 'word' | 'exam' | 'daily'>(null)
  // 添加MemoCard状态
  const [showMemoCard, setShowMemoCard] = React.useState(false)
  // 引用容器元素
  const containerRef = React.useRef<HTMLDivElement>(null)

  // 添加点击外部关闭弹窗的效果
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Node) {
        // 检查点击是否在Demo卡片之外
        const demoCardElement = document.querySelector('.demo-card-container');
        if (demoCardElement && !demoCardElement.contains(target as Node)) {
          setShowDemo(null);
          setShowMemoCard(false);
        }
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, []);

  // 添加滚动锁定效果
  React.useEffect(() => {
    if (showDemo) {
      // 锁定body滚动
      document.body.style.overflow = 'hidden';
    } else {
      // 恢复body滚动
      document.body.style.overflow = 'auto';
    }

    // 组件卸载时恢复滚动
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showDemo]);

  // 处理卡片点击事件
  const handleCardClick = (cardType: 'memo' | 'word' | 'exam' | 'daily') => {
    setShowDemo(cardType);
    setShowMemoCard(false);
  };

  // 处理WordCard的"不认识"按钮点击事件
  const handleUnRecognize = () => {
    setShowMemoCard(true);
  };

  // 处理WordCard的"认识"按钮点击事件
  const handleRecognize = () => {
    setShowDemo(null);
  };

  // return <div className="w-[680px] border border-[#1d283a] h-[calc(100vh-6px)] m-auto rounded-[12px]">
  //   <DemoExam />
  // </div>

  return (
    <div className="min-h-screen bg-white">
      {/* 添加毛玻璃弹窗 */}
      {showDemo ? (
        <div className="fixed w-[100vw] h-[100vh] left-[0] top-[0] backdrop-blur-[3px] backdrop-saturate-[180%] z-[10] flex items-center justify-center">
          <div
            ref={containerRef}
            className={`demo-card-container ${showDemo === 'word' && !showMemoCard ? 'w-auto min-w-[228px]' : showDemo === 'exam' || showDemo === 'daily' ? 'border border-[#1d283a] rounded-[12px] bg-[#fcfcfd] w-[740px] h-[calc(100vh-2px)] overflow-hidden scrollbar-hide' : 'w-[628px]'} relative transform`}
            style={{
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none', /* IE and Edge */
            }}
          >
            <style jsx global>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {
              showDemo === 'memo'
                ? <DemoCard />
                : showDemo === 'exam'
                  ? <DemoExam />
                  : showDemo === 'daily'
                    ? <DemoDailyReport />
                    : showMemoCard
                      ? <MemoCard {...defaultWordCardInfo.memo_card} onDelete={() => { }} />
                      : (
                        <DemoWordCard
                          onUnRecognize={handleUnRecognize}
                          onRecognize={handleRecognize}
                        />
                      )
            }
          </div>
        </div>
      ) : null}

      {/* Hero Section */}
      <div className="px-4 pt-16 pb-24 text-center max-w-7xl mx-auto relative">
        {/* Hero content */}
        <h1 className="text-6xl font-bold mb-6 tracking-tight leading-[1.2]">
          {locale === 'en' ? (
            <>
              Your Personal Japanese
              <br />
              Learning Journey
            </>
          ) : (
            t('home.personalJourney')
          )}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('home.stopScattering')}
          <br />
          {t('home.bunnWillHeloYou')}
        </p>
        <Button
          className="bg-[#18181B] text-white hover:bg-[#27272A] px-8 py-6 text-lg"
          onClick={() => router.push('/login')}
        >
          {t('home.getStartedFree')}
        </Button>

        {/* Feature Cards */}
        <div className="font-NewYork mt-16 relative h-[420px] max-w-6xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 flex -space-x-4 rotate-[-5deg] group">
            {/* 第一张卡片：Memo Card */}
            <div
              className="w-[300px] h-[400px] rounded-2xl shadow-lg bg-white 
                transform transition-all duration-500 ease-out
                hover:scale-110 hover:-translate-y-4 hover:rotate-0 hover:z-10
                group-hover:translate-x-[0px]
                hover:shadow-xl"
              style={{
                transform: 'rotate(0deg)',
                transformOrigin: 'center center'
              }}
            >
              <div className="p-6 h-[100%] border border-[#1d283a] rounded-[12px]">
                <h3 className="text-lg font-medium">{t('home.cards.memoCard.title')}</h3>
                <div
                  className="flex max-h-[236px] justify-center mt-8 cursor-pointer"
                  onClick={() => handleCardClick('memo')}
                >
                  <Image
                    src="/assets/slogans/memo_card.png"
                    alt="Memo Card"
                    width={260}
                    height={260}
                    className="object-contain transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <p className="text-sm text-[#49494b] mt-10 leading-snug">
                  {t('home.cards.memoCard.description')}
                </p>
              </div>
            </div>

            {/* 第二张卡片：Word Card */}
            <div
              className="w-[300px] h-[400px] rounded-2xl shadow-lg bg-white 
                transform transition-all duration-500 ease-out
                hover:scale-110 hover:-translate-y-4 hover:rotate-0 hover:z-10
                group-hover:translate-x-[40px]
                hover:shadow-xl"
              style={{
                transform: 'rotate(5deg)',
                transformOrigin: 'center center'
              }}
            >
              <div className="p-6 h-[100%] border border-[#1d283a] rounded-[12px]">
                <h3 className="text-lg font-medium">{t('home.cards.wordCard.title')}</h3>
                <div
                  className="flex max-h-[236px] justify-center mt-8 cursor-pointer"
                  onClick={() => handleCardClick('word')}
                >
                  <Image
                    src="/assets/slogans/word_card.png"
                    alt="Word Card"
                    width={260}
                    height={260}
                    className="object-contain transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <p className="text-sm text-[#49494b] mt-10 leading-snug">
                  {t('home.cards.wordCard.description')}
                </p>
              </div>
            </div>

            {/* 第三张卡片：Exam */}
            <div
              className="w-[300px] h-[400px] rounded-2xl shadow-lg bg-white 
                transform transition-all duration-500 ease-out
                hover:scale-110 hover:-translate-y-4 hover:rotate-0 hover:z-10
                group-hover:translate-x-[80px]
                hover:shadow-xl"
              style={{
                transform: 'rotate(10deg)',
                transformOrigin: 'center center'
              }}
            >
              <div className="p-6 h-[100%] border border-[#1d283a] rounded-[12px]">
                <h3 className="text-lg font-medium">{t('home.cards.exam.title')}</h3>
                <div
                  className="flex max-h-[236px] justify-center mt-4 cursor-pointer"
                  onClick={() => handleCardClick('exam')}
                >
                  <Image
                    src="/assets/slogans/exam.png"
                    alt="Exam"
                    width={260}
                    height={260}
                    className="object-contain transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <p className="text-sm text-[#49494b] mt-4 leading-snug">
                  {t('home.cards.exam.description')}
                </p>
              </div>
            </div>

            {/* 第四张卡片：Daily Report */}
            <div
              className="w-[300px] h-[400px] rounded-2xl shadow-lg bg-white 
                transform transition-all duration-500 ease-out
                hover:scale-110 hover:-translate-y-4 hover:rotate-0 hover:z-10
                group-hover:translate-x-[120px]
                hover:shadow-xl"
              style={{
                transform: 'rotate(15deg)',
                transformOrigin: 'center center'
              }}
            >
              <div className="p-6 h-[100%] border border-[#1d283a] rounded-[12px]">
                <h3 className="text-lg font-medium">{t('home.cards.dailyReport.title')}</h3>
                <div
                  className="flex max-h-[236px] justify-center mt-8 cursor-pointer"
                  onClick={() => handleCardClick('daily')}
                >
                  <Image
                    src="/assets/slogans/daily_report.png"
                    alt="Daily Report"
                    width={260}
                    height={260}
                    className="object-contain transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <p className="text-sm text-[#49494b] mt-4 leading-snug">
                  {t('home.cards.dailyReport.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}