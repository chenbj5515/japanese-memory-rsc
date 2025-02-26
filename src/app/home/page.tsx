"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import React from "react"
import { DemoCard } from "@/components/card/demo-card"
import { DemoWordCard, defaultWordCardInfo } from "@/components/word-card/demo-word-card"
import { MemoCard } from "@/components/card/memo-card"
import DemoExam from "@/components/exam/demo-exam"

export default function LandingPage() {
  const router = useRouter()
  
  // 添加状态管理
  const [showDemo, setShowDemo] = React.useState<null | 'memo' | 'word' | 'exam'>(null)
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
  const handleCardClick = (cardType: 'memo' | 'word' | 'exam') => {
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

  return (
    <div className="min-h-screen bg-white">
      {/* 添加毛玻璃弹窗 */}
      {showDemo ? (
        <div className="fixed w-[100vw] h-[100vh] left-[0] top-[0] backdrop-blur-[3px] backdrop-saturate-[180%] z-[10] flex items-center justify-center">
          <div 
            ref={containerRef}
            className={`demo-card-container ${showDemo === 'word' && !showMemoCard ? 'w-auto min-w-[228px]' : showDemo === 'exam' ? 'border border-black bg-[#fcfcfd] w-[880px] h-[calc(100vh-2px)] overflow-hidden scrollbar-hide' : 'w-[628px]'} relative transform`}
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
                  : showMemoCard
                    ? <MemoCard {...defaultWordCardInfo.memo_card} onDelete={() => {}} />
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
      <main className="px-4 pt-16 pb-24 text-center max-w-7xl mx-auto relative">
        {/* Hero content */}
        <h1 className="text-6xl font-bold mb-6 tracking-tight leading-[1.2]">
          Your Personal Japanese<br/>
          Learning Journey
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Stop scattering your notes everywhere. Centralize, organize, and master Japanese - all in one powerful place.
        </p>
        <Button 
          className="bg-[#18181B] text-white hover:bg-[#27272A] px-8 py-6 text-lg"
          onClick={() => router.push('/api/auth/signin')}
        >
          Get Started for free
        </Button>

        {/* Feature Cards */}
        <div className="font-NewYork mt-16 relative h-[420px] max-w-6xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 flex -space-x-4 rotate-[-5deg] group">
            {[
              { 
                title: "Memo Card", 
                img: "/assets/slogans/memo_card.png",
                description: "Translation, pronunciation, shadowing, and dictation - all in one elegant card.",
                type: 'memo' as const
              },
              { 
                title: "Word Card", 
                img: "/assets/slogans/word_card.png",
                description: "Recall which sentence a word appeared in, and check with a single tap if you can't remember.",
                type: 'word' as const
              },
              { 
                title: "Exam", 
                img: "/assets/slogans/exam.png",
                description: "Test your knowledge and ensure true mastery of what you've learned.",
                type: 'exam' as const
              },
              { 
                title: "Daily Report", 
                img: "/assets/slogans/daily_report.png",
                description: "5 minutes before bed. Review what you've forgotten. Stay on track.",
                type: null
              },
            ].map((card, index) => (
              <div
                key={index}
                className={`w-[300px] h-[400px] rounded-2xl shadow-lg bg-white 
                  transform transition-all duration-500 ease-out
                  hover:scale-110 hover:-translate-y-4 hover:rotate-0 hover:z-10
                  group-hover:translate-x-[${index * 40}px]
                  hover:shadow-xl`}
                style={{
                  transform: `rotate(${index * 5}deg)`,
                  transformOrigin: 'center center'
                }}
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium">{card.title}</h3>
                  <div 
                    className="flex justify-center mt-8 cursor-pointer"
                    onClick={card.type ? () => handleCardClick(card.type) : undefined}
                  >
                    <Image 
                      src={card.img}
                      alt={card.title}
                      width={260}
                      height={260}
                      className="object-contain transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <p className="text-sm text-[#49494b] mt-4 leading-snug">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}