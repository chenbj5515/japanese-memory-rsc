"use client"
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useDispatch } from 'react-redux';
import { clearLocalCards } from '@/store/local-cards-slice';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Logout } from "@/server-actions";
import "remixicon/fonts/remixicon.css";

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [theme, setTheme] = React.useState("light");
    const { data } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const noNav = pathname === "/home" || pathname === "/exam";

    function handleToggle() {
        if (theme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
        document.body.classList.toggle("dark");
    }

    async function handleLogout() {
        await Logout();
        router.push('/');
    }

    useEffect(() => {
        dispatch(
            clearLocalCards()
        );
    }, [pathname]);

    useEffect(() => {
        router.prefetch("/exam");
    }, [router]);


    return (
        <>
            {
                !noNav ? (
                    <header className="p-[12px] backdrop-blur-[3px] backdrop-saturate-[180%] justify-between items-center w-full fixed z-[200] top-0 flex">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="hidden sm:block  h-10 w-10 cursor-pointer">
                                    <AvatarImage src={data?.profile} alt="profile" />
                                    <AvatarFallback>user</AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-sm"
                                    onClick={handleLogout}
                                >
                                    ログアウト
                                </Button>
                            </PopoverContent>
                        </Popover>
                        <nav className="w-[620px]">
                            <ul className="flex items-center justify-between">
                                <li>
                                    <Link prefetch href="/latest" className={`text-[15px] font-medium px-4 py-2 rounded-full ${pathname === '/latest' ? 'text-[#a9aaab]' : 'hover:text-[#a9aaab]'}`}>最新</Link>
                                </li>
                                <li>
                                    <Link prefetch href="/random" className={`text-[15px] font-medium px-4 py-2 rounded-full ${pathname === '/random' ? 'text-[#a9aaab]' : 'hover:text-[#a9aaab]'}`}>ランダム</Link>
                                </li>
                                <li>
                                    <Link prefetch href="/word-cards" className={`text-[15px] font-medium px-4 py-2 rounded-full ${pathname === '/word-cards' ? 'text-[#a9aaab]' : 'hover:text-[#a9aaab]'}`}>単語帳</Link>
                                </li>
                                <li className="sm:block hidden">
                                    <Link prefetch href="/exam-preparation" className={`text-[15px] font-medium px-4 py-2 rounded-full ${pathname === '/exam-preparation' ? 'text-[#a9aaab]' : 'hover:text-[#a9aaab]'}`}>試験</Link>
                                </li>
                                <li className="sm:block hidden">
                                    <Link prefetch href="/daily-report" className={`text-[15px] font-medium px-4 py-2 rounded-full ${pathname === '/daily-report' ? 'text-[#a9aaab]' : 'hover:text-[#a9aaab]'}`}>デイリーレポート</Link>
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
                ) : null
            }
            <main style={{
                paddingTop: noNav ? 0 : "86px"
            }}>
                {children}
            </main>
        </>
    )
}