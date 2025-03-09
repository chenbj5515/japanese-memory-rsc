'use client'

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function StartJourneyButton() {
    const router = useRouter()

    return (
        <Button
            className="mt-[40px] group w-full bg-black text-white transition-opacity duration-300 hover:opacity-90"
            size="lg"
            onClick={() => router.push('/')}
        >
            <span className="flex items-center">
                立即开始和Bunn的学习之旅
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </span>
        </Button>
    )
} 