"use client"
import React from "react";
import { useRouter, usePathname } from 'next/navigation';
// import LiveIsland from "react-live-island";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { clearLocalCards } from "@/store/local-cards-slice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    const dispatch = useDispatch();
    const pathName = usePathname();

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

    function handleRouteChange(nextRoute: string) {
        dispatch(
            clearLocalCards()
        );
        router.push(nextRoute)
    }

    return (
        <>
            <header className="p-[12px] justify-between items-center w-full fixed z-[200] top-0 flex">
                <Popover>
                    <PopoverTrigger asChild>
                        <Avatar className="h-10 w-10 cursor-pointer">
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
                <Tabs defaultValue={pathName.replace(/\//g, '').replace(/-/g, ' ')} className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="latest">
                            <Link prefetch href="/latest">latest</Link>
                        </TabsTrigger>
                        <TabsTrigger value="random">
                            <Link prefetch href="/random">random</Link>
                        </TabsTrigger>
                        <TabsTrigger value="word cards">
                            <Link prefetch href="/word-cards">word cards</Link>
                        </TabsTrigger>
                        <TabsTrigger value="translation">
                            <Link prefetch href="/translation">translation</Link>
                        </TabsTrigger>
                    </TabsList>
                </Tabs >
                <label className="text-base relative inline-block w-[56px] h-[28px]">
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
            <main className="mt-[64px]">
                {children}
            </main>
        </>
    )
}