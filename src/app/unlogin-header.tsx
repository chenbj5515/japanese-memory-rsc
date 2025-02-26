"use client"
import { useRouter } from "next/navigation"
import BrandIcon from "@/components/brand-icon"

export default function UnloginHeader() {
  const router = useRouter()

  return (
    <nav className="flex fixed top-0 items-center justify-between w-full px-0 h-[86px]">
      <div className="flex items-center pl-4">
        <BrandIcon size="large" />
      </div>
      <div className="flex items-center gap-8 font-medium pr-6">
        <button 
          onClick={() => router.push('/guide')}
          className="text-black hover:text-[#595a5d] transition-colors"
        >
          Design Philosophy
        </button>
        <button 
          onClick={() => router.push('/pricing')}
          className="text-black hover:text-[#595a5d] transition-colors"
        >
          Pricing
        </button>
        <button 
          onClick={() => window.location.href = 'mailto:chenbj55150220@gmail.com'}
          className="text-black hover:text-[#595a5d] transition-colors"
        >
          Contact
        </button>
      </div>
    </nav>
  )
}