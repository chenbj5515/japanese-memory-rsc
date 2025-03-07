"use client"
import * as React from "react"
import { Globe } from "lucide-react"
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function LanguageSelector() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const handleLanguageChange = (value: string) => {
        const currentRoute = pathname.split('/').pop() || '';
        Cookies.set('NEXT_LOCALE', value, {
            path: '/',
            expires: 365, // 一年有效期
            sameSite: 'lax'
        });
        router.push(`/${value}/${currentRoute}`);
        setIsOpen(false);
    }

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                className="flex items-center space-x-1 hover:text-gray-600"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Globe className="h-5 w-5" />
                <span>{locale === 'zh' ? '中文' : 'English'}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <button
                            className={`block px-4 py-2 text-sm w-full text-left ${locale === 'zh' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                            onClick={() => handleLanguageChange('zh')}
                        >
                            中文
                        </button>
                        <button
                            className={`block px-4 py-2 text-sm w-full text-left ${locale === 'en' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                            onClick={() => handleLanguageChange('en')}
                        >
                            English
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}