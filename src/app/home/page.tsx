import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function Home() {
  // const memoCards = await res.json();
  const memoCards = await prisma.memo_card.findMany({
    orderBy: {
        create_time: 'desc', // 假设使用 'id' 字段来排序
    },
    take: 20, // 获取最新的20条数据
  });

  return (
    <div>
      <h1>Memo Cards</h1>
      <div>
        {memoCards.map((card: any) => (
          <div key={card.id}>
            <h2>{card.translation}</h2>
            <p>Review Times: {card.review_times}</p>
            {card.kana_pronunciation && <p>Kana: {card.kana_pronunciation}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
