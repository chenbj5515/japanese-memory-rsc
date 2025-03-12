"use client"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useLocale, useTranslations } from 'next-intl'
import { useState } from "react"
import UserPanel from "@/components/user-panel"

export default function LoginedHeader() {
  const { data } = useSession()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('LoginedHeader')
  const [theme, setTheme] = useState("light")

  function handleToggle() {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark") 
    }
    document.body.classList.toggle("dark")
  }

  return (
    <header className="p-[12px] backdrop-blur-[3px] backdrop-saturate-[180%] justify-between items-center w-full fixed z-[200] top-0 flex">
      <UserPanel />
      <nav className="w-[620px]">
        <ul className="flex items-center justify-between">
          <li>
            <Link prefetch href={`/${locale}/memo-cards`} className={`text-[15px] font-medium px-4 py-2 rounded-full ${pathname === `/${locale}/memo-cards` ? 'text-[#a9aaab]' : 'hover:text-[#a9aaab]'}`}>{t('memoCards')}</Link>
          </li>
          <li>
            <Link prefetch href={`/${locale}/word-cards`} className={`text-[15px] font-medium px-4 py-2 rounded-full ${pathname === `/${locale}/word-cards` ? 'text-[#a9aaab]' : 'hover:text-[#a9aaab]'}`}>{t('wordCards')}</Link>
          </li>
          <li className="sm:block hidden">
            <Link prefetch href={`/${locale}/exam-preparation`} className={`text-[15px] font-medium px-4 py-2 rounded-full ${pathname === `/${locale}/exam-preparation` ? 'text-[#a9aaab]' : 'hover:text-[#a9aaab]'}`}>{t('exam')}</Link>
          </li>
          <li className="sm:block hidden">
            <Link prefetch href={`/${locale}/daily-report`} className={`text-[15px] font-medium px-4 py-2 rounded-full ${pathname.startsWith(`/${locale}/daily-report`) ? 'text-[#a9aaab]' : 'hover:text-[#a9aaab]'}`}>{t('dailyReport')}</Link>
          </li>
        </ul>
      </nav>
      <label className="hidden md:inline-block text-base relative w-[56px] h-[28px]">
        <input
          onChange={handleToggle}
          checked={theme === "light"}
          className="peer opacity-0 w-0 h-0"
          type="checkbox"
        />
        <span className="transition duration-300 ease-in-out peer-checked:translate-x-5 peer-checked:shadow-full-moon left-2 top-1 rounded-full shadow-crescent absolute h-5 w-5 z-[1]"></span>
        <span className="peer-checked:bg-blue absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-black transition duration-500 rounded-3xl"></span>
      </label>
    </header>
  )
}
