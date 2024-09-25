import React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/prisma"
import { MemoCards, LocalCards, InputBox, WordCardAdder } from "@/components";

export default async function Home() {
  const session = await auth()
  if (!session?.userId) {
    redirect("/api/auth/signin")
  }

  const memoCards = await prisma.memo_card.findMany({
    where: {
      user_id: session.userId,
    },
    orderBy: {
      create_time: 'desc',
    },
    take: 20,
  });

  return (
    <>
      <div className="pb-[86px]">
        <MemoCards memoCardsInitial={memoCards} />
        <LocalCards />
        {
          memoCards.length === 0 ? (
            <div className="flex mt-[80px] items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-blue-800">
              <div className="px-4 mx-auto text-center lg:px-8 sm:py-24 lg:py-32">
                <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
                  データが見つかりません
                </h1>
                <p className="mt-6 text-base leading-7 text-black dark:text-white">
                  気になる日本語を入力してください
                </p>
              </div>
            </div>
          ) : null
        }
      </div>
      <div className="fixed z-[12] width-80-680 left-[50%] -translate-x-1/2 bottom-2 h-[50px] w-[100%]">
        <InputBox />
      </div>
      <WordCardAdder />
    </>
  )
}