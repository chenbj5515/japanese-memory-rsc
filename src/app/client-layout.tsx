"use client"
import React from "react";
import { useRouter } from 'next/navigation';
// import LiveIsland from "react-live-island";
import { useSession } from "next-auth/react";
import { Provider } from "react-redux";
import store from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { actionSignOut } from "@/server-actions";
import "remixicon/fonts/remixicon.css";

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [theme, setTheme] = React.useState("light");
    const { data } = useSession();
    const router = useRouter();

    function handleToggle() {
        if (theme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
        document.body.classList.toggle("dark");
    }

    function handleArticleCLick() {
    }

    async function handleLogout() {
        await actionSignOut();
        router.push('/');
    }

    return (
        <>
            <header className="p-[12px] justify-between items-center w-full fixed z-[200] top-0 flex">
                <Popover>
                    <PopoverTrigger asChild>
                        <Avatar className="h-10 w-10 cursor-pointer">
                            <AvatarImage src={data?.user?.image || ""} alt="profile" />
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
                <Tabs defaultValue="latest" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="latest" onClick={() => router.push('/latest')}>
                            latest
                        </TabsTrigger>
                        <TabsTrigger value="random" onClick={() => router.push('/random')}>
                            random
                        </TabsTrigger>
                        <TabsTrigger value="word cards" onClick={() => router.push('/word-cards')}>
                            word cards
                        </TabsTrigger>
                        <TabsTrigger value="translation" onClick={() => router.push('/translation')}>
                            translation
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
            <Provider store={store}>
                <main className="mt-[64px]">
                    {children}
                </main>
            </Provider>
        </>
    )
}