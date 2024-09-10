import React from "react"
import { redirect } from "next/navigation"
import { signOut, auth } from "@/auth"
import { MemoCard } from "@/components"
import { prisma } from "@/prisma"
import { InputBox } from "@/components";
// import { createCaller } from '@/server'

export default async function Home() {
  const session = await auth()
  if (!session?.userId) {
    redirect("/api/auth/signin")
  }

  const memoCards = await prisma.memo_card.findMany({
    where: {
      user_id: session.userId,  // 根据 session 中的 user_id 进行过滤
    },
    orderBy: {
      create_time: 'desc',  // 假设使用 create_time 字段排序
    },
    take: 20,  // 获取最新的20条数据
  });

  return (
    <>
      <div className="pb-[50px]">
        {memoCards.map(memoCard => (
          <div className="mb-[48px]" key={memoCard.id}>
            <MemoCard {...memoCard} />
          </div>
        ))}
      </div>
      <div className="fixed z-[12] width-80-680 left-[50%] -translate-x-1/2 bottom-2 h-[50px] w-[100%]">
        <InputBox />
      </div>
      {/* <form action={async () => {
        "use server"
        await signOut({
          redirectTo: "/"
        })
      }}>
        <button>Sign out</button>
      </form> */}
    </>
  )
}