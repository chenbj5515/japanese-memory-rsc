import { Prisma } from '@prisma/client';
import { prisma } from "@/prisma";
import { Translation } from "@/components";

export default async function App() {
    // 指定返回类型为包含 count 属性的对象数组
    const countResult = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) as count FROM memo_card WHERE LENGTH(original_text) < 80
    `;
    const count = Number(countResult[0].count);

    // 获取最新的10条记录
    const latestCardsPromise = prisma.$queryRaw<Prisma.memo_cardGetPayload<{}>[]>`
        SELECT * FROM memo_card 
        WHERE LENGTH(original_text) < 80 
        ORDER BY create_time DESC 
        LIMIT 10
    `;

    // 计算随机偏移量
    const randomSkip = Math.max(0, Math.floor(Math.random() * Math.max(1, count - 10)));

    // 获取随机的10条记录
    const randomCardsPromise = prisma.$queryRaw<Prisma.memo_cardGetPayload<{}>[]>`
        SELECT * FROM memo_card 
        WHERE LENGTH(original_text) < 80 
        OFFSET ${randomSkip} 
        LIMIT 10
    `;

    // 并行执行查询
    const [latestCards, randomCards] = await Promise.all([latestCardsPromise, randomCardsPromise]);

    // 合并结果
    const memoCards = [...latestCards, ...randomCards];

    return (
        <div className="pl-5 pb-10 pr-5">
            {
                memoCards.map(card => (
                    <Translation key={card.id} {...card} />
                ))
            }
        </div>
    );
}
