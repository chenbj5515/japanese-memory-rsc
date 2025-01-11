"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          {/* <Button variant="default" className="bg-[#18181B] text-white hover:bg-[#27272A]">
            Log in
          </Button> */}
        </div>
      </nav>

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
                description: "Translation, pronunciation, shadowing, and dictation - all in one elegant card." 
              },
              { 
                title: "Word Card", 
                img: "/assets/slogans/word_card.png",
                description: "Highlight and save key words from any sentence with a single tap."
              },
              { 
                title: "Exam", 
                img: "/assets/slogans/exam.png",
                description: "Test your knowledge and ensure true mastery of what you've learned."
              },
              { 
                title: "Daily Report", 
                img: "/assets/slogans/daily_report.png",
                description: "5 minutes before bed. Review what you've forgotten. Stay on track."
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
                  <div className="flex justify-center mt-8">
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