"use client"
import React from "react";
import { usePathname } from 'next/navigation';
import LiveIsland from "react-live-island";
import { useSession } from "next-auth/react";

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [theme, setTheme] = React.useState("light");
    const pathname = usePathname();
    const { data } = useSession();
    console.log(data, "data==========")

    async function handleLastestClick() {
    }

    async function handleRandomClick() {
    }

    function handleWordCards() {
    }

    function handleToggle() {
        if (theme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
        document.body.classList.toggle("dark");
    }

    function handleTranslateCLick() {
    }

    function handleArticleCLick() {
    }

    return (
        <>
            {pathname !== "/welcome" ? (
                <>
                    <LiveIsland
                        className="flex justify-center items-center uppercase"
                        smallClassName="text-xs"
                        largeClassName="text-7xl"
                        initialAnimation
                    >
                        {(isSmall) =>
                            isSmall ? (
                                ""
                            ) : (
                                <div className="flex space-x-2 p-4">
                                    <div
                                        className=" w-[72px] h-[72px] text-white text-center p-2 rounded-lg text-[12px] cursor-pointer"
                                        onClick={handleLastestClick}
                                    >
                                        <div>latest</div>
                                        <div className="mt-2">20</div>
                                    </div>
                                    <div
                                        className=" w-[72px] h-[72px] text-white text-center p-2 rounded-lg text-[12px] cursor-pointer"
                                        onClick={handleRandomClick}
                                    >
                                        <div>random</div>
                                        <div className="mt-2">20</div>
                                    </div>
                                    <div
                                        className=" w-[72px] h-[72px] text-white text-center p-2 rounded-lg text-[12px] cursor-pointer"
                                        onClick={handleWordCards}
                                    >
                                        <div>Word</div>
                                        <div className="mt-2">Cards</div>
                                    </div>
                                    <div
                                        className=" w-[72px] h-[72px] text-white text-center p-2 rounded-lg text-[12px] cursor-pointer"
                                        onClick={handleTranslateCLick}
                                    >
                                        <div>translate</div>
                                    </div>
                                    <div
                                        className=" w-[72px] h-[72px] text-white text-center p-2 rounded-lg text-[12px] cursor-pointer"
                                        onClick={handleArticleCLick}
                                    >
                                        <div>articles</div>
                                    </div>
                                </div>
                            )
                        }
                    </LiveIsland>
                    <header className="p-[12px] justify-between items-center top-0 flex">
                        {
                            data?.user?.image ? (
                                <img className="w-[36px] h-[36px] rounded-full" src={data?.user?.image} alt="" />
                            ) : null
                        }
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
                    {children}
                </>
            ) : null}
        </>
    )
}