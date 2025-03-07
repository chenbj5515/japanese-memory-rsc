"use client"

import { useTranslations } from "next-intl"

export function Footer() {
    const t = useTranslations('common.footer');

    return (
        <footer className="w-full absolute bottom-0 mt-8 mx-auto px-4 pb-16">
            {/* 底部链接 */}
            <div className="flex justify-center items-center space-x-6 text-gray-800">
                <p className="hover:text-gray-600">{t('copyright')}</p>
                <span className="text-gray-400">•</span>
                <a href="/terms-of-service" className="text-gray-400 hover:opacity-90">{t('termsOfService')}</a>
                <a href="/privacy-policy" className="text-gray-400 hover:opacity-90">{t('privacyPolicy')}</a>
                <a href="/business-disclosure" className="text-gray-400 hover:opacity-90">{t('businessDisclosure')}</a>
            </div>
        </footer>
    )
}