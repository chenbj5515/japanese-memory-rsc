import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// export default async function Home() {
//   // const memoCards = await res.json();
//   const memoCards = await prisma.memo_card.findMany({
//     orderBy: {
//         create_time: 'desc', // 假设使用 'id' 字段来排序
//     },
//     take: 20, // 获取最新的20条数据
//   });

//   return (
//     <div>
//       <h1>Memo Cards</h1>
//       <div>
//         {memoCards.map((card: any) => (
//           <div key={card.id}>
//             <h2>{card.translation}</h2>
//             <p>Review Times: {card.review_times}</p>
//             {card.kana_pronunciation && <p>Kana: {card.kana_pronunciation}</p>}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { signOut, auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function LogoutButton() {
  const session = await auth()
  const memoCards = await prisma.memo_card.findMany({
    orderBy: {
      create_time: 'desc', // 假设使用 'id' 字段来排序
    },
    take: 20, // 获取最新的20条数据
  });

  console.log(memoCards, "memoCards=====")

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <>
      <div>
        {memoCards.map((card: any) => (
          <div key={card.id}>
            <h2>{card.translation}</h2>
            <p>Review Times: {card.review_times}</p>
            {card.kana_pronunciation && <p>Kana: {card.kana_pronunciation}</p>}
          </div>
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