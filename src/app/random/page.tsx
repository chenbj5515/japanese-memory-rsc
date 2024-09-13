
import React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/prisma"
import { MemoCards, LocalCards, InputBox, WordCardAdder } from "@/components";
// import { createCaller } from '@/server'

export default async function Home() {
    const session = await auth()
    if (!session?.userId) {
        redirect("/api/auth/signin")
    }

    const count = await prisma.memo_card.count();

    // 生成随机偏移量，确保偏移不会超过数据的总数 - 20
    const randomOffset = Math.floor(Math.random() * (count - 20));

    // 查询带有 OFFSET 的 20 条记录
    const memoCards = await prisma.memo_card.findMany({
        skip: randomOffset,
        take: 20,
    });


    return (
        <>
            <div className="pb-[86px]">
                <MemoCards memoCardsInitial={memoCards} />
                <LocalCards />
            </div>
            <div className="fixed z-[12] width-80-680 left-[50%] -translate-x-1/2 bottom-2 h-[50px] w-[100%]">
                <InputBox />
            </div>
            <WordCardAdder />
        </>
    )
}