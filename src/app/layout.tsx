"use client"
import './globals.css';
import { Inter } from "next/font/google";
import LiveIsland from "react-live-island";
import React from "react";
import { useCookies } from "react-cookie";
import { usePathname } from 'next/navigation'; // 正确的导入方式

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = React.useState("light");
  const pathname = usePathname();

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
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col dark:bg-bgDark bg-[#fff] overflow-scroll">
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
              <header className="w-[100vw] p-[12px] justify-end items-center top-0 flex">
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
            </>
          ) : null}
          {children}
        </main>
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic";
