import React from "react"
import { redirect } from "next/navigation"
import { signOut, auth } from "@/auth"
import { CardInHistory, Loading } from "@/components"
import { prisma } from "@/prisma"
// import { createCaller } from '@/server'

export default async function Home() {
  const session = await auth()
  console.log(session, "session============")
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
      <div>
        {memoCards.map(({ translation, kana_pronunciation, original_text, record_file_path, create_time, id }) => (
          <CardInHistory
            key={id}
            translation={translation}
            kanaPronunciation={kana_pronunciation}
            originalText={original_text}
            recorderPath={record_file_path}
            createTime={create_time.toString()}
            cardID={id}
          />
        ))}
      </div>
      <form action={async () => {
        "use server"
        await signOut({
          redirectTo: "/"
        })
      }}>
        <button>Sign out</button>
      </form>
    </>
  )
}