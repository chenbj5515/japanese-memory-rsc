import { prisma } from "@/prisma";
import { WordCards } from "./word-cards";

export default async function App() {
    const count = await prisma.word_card.count();

    // 按照 update_time 获取最新的10条
    const latestCardsPromise = prisma.word_card.findMany({
        orderBy: {
            create_time: 'desc',
        },
        take: 10,
        include: {
            memo_card: true, // 关联查询 memo_card 表的数据
        },
    });

    // 随机获取10条
    const randomSkip = Math.max(0, Math.floor(Math.random() * (count - 10)));
    const randomCardsPromise = prisma.word_card.findMany({
        skip: randomSkip,
        take: 10,
        include: {
            memo_card: true, // 关联查询 memo_card 表的数据
        },
    });

    const results = await Promise.all([latestCardsPromise, randomCardsPromise])

    const wordCards = results.flat(Infinity);

    return (
        <div className="pl-5 pb-10 pr-5">
           <WordCards wordCards={wordCards} /> 
        </div>
    );
}
