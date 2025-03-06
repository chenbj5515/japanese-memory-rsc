"use client"
import { useRouter } from "next/navigation"
import BrandIcon from "@/components/brand-icon"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslations } from "next-intl"

export function UnloginHeader() {
  const router = useRouter()
  const t = useTranslations();

  return (
    <nav className="flex fixed top-0 items-center justify-between w-full px-0 h-[86px] z-10">
      <div className="flex items-center gap-4 pl-4">
        <BrandIcon size="large" />
      </div>
      <div className="flex items-center gap-8 font-medium pr-14">
        <LanguageSelector />
        <button
          onClick={() => router.push('/guide')}
          className="text-black hover:text-[#595a5d] transition-colors"
        >
          {t('common.guide')}
        </button>
        <button
          onClick={() => router.push('/pricing')}
          className="text-black hover:text-[#595a5d] transition-colors"
        >
          {t('common.pricing')}
        </button>
        <button
          onClick={() => window.location.href = 'mailto:chenbj55150220@gmail.com'}
          className="text-black hover:text-[#595a5d] transition-colors"
        >
          {t('common.contact')}
        </button>
      </div>
    </nav>
  )
}