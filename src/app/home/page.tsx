import React from "react"
import { redirect } from "next/navigation"
import { signOut, auth } from "@/auth"
import { CardInHistory, Loading } from "@/components"
import { prisma } from "@/prisma"
import { createCaller } from '@/server'


export default async function Home() {
  const session = await auth()
  const caller = createCaller({})
  const data = await caller.hello()
  console.log(data);

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <>
      <React.Suspense fallback={<Loading />}>  {/* Suspenseを利用して */}
        <MemoCards />
      </React.Suspense>
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

async function MemoCards() {
  const memoCards = await prisma.memo_card.findMany({
    orderBy: {
      create_time: 'desc', // 假设使用 'id' 字段来排序
    },
    take: 20, // 获取最新的20条数据
  });

  return (
    <div>
      {memoCards.map(({ translation, kana_pronunciation, original_text, record_file_path, create_time, id }) => (
        <CardInHistory
          translation={translation}
          kanaPronunciation={kana_pronunciation}
          originalText={original_text}
          recorderPath={record_file_path}
          createTime={create_time.toString()}
          cardID={id}
        />
      ))}
    </div>
  )
}