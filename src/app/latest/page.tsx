import React from "react"
import { redirect } from "next/navigation"
import { signOut, auth } from "@/auth"
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
      </div>
      <div className="fixed z-[12] width-80-680 left-[50%] -translate-x-1/2 bottom-2 h-[50px] w-[100%]">
        <InputBox />
      </div>
      <WordCardAdder />
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