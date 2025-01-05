import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="default" className="bg-[#18181B] text-white hover:bg-[#27272A]">
            Log in
          </Button>
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
        <Button className="bg-[#18181B] text-white hover:bg-[#27272A] px-8 py-6 text-lg">
          Get Started for free
        </Button>

        {/* Feature Cards */}
        <div className="mt-16 relative h-[300px] max-w-4xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 flex -space-x-4 rotate-[-5deg]">
            {[
              { title: "Interactive Components", color: "bg-purple-100" },
              { title: "Accessible Prototypes", color: "bg-yellow-100" },
              { title: "Plugin Playground", color: "bg-pink-100" },
              { title: "Accessible Prototypes", color: "bg-green-100" },
              { title: "Seamless Variables", color: "bg-blue-100" },
            ].map((card, index) => (
              <div
                key={index}
                className={`w-64 h-80 ${card.color} rounded-2xl shadow-lg transform rotate-${
                  index * 5
                } hover:-translate-y-2 transition-transform duration-200`}
                style={{
                  transform: `rotate(${index * 5}deg)`,
                }}
              >
                <div className="p-6">
                  <h3 className="text-sm font-medium">{card.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}