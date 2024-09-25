import { Prisma } from '@prisma/client';
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";
import { auth } from "@/auth"
import { Translation } from "@/components";

export default async function App() {
    const session = await auth();
    if (!session?.userId) {
        redirect("/api/auth/signin")
    }

    const countResult = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) as count FROM memo_card WHERE LENGTH(original_text) < 80
    `;
    const count = Number(countResult[0].count);

    const latestCardsPromise = prisma.$queryRaw<Prisma.memo_cardGetPayload<{}>[]>`
        SELECT * FROM memo_card 
        WHERE LENGTH(original_text) < 80 AND user_id = ${session.userId}
        ORDER BY create_time DESC 
        LIMIT 10
    `;

    const randomSkip = Math.max(0, Math.floor(Math.random() * Math.max(1, count - 10)));

    const randomCardsPromise = prisma.$queryRaw<Prisma.memo_cardGetPayload<{}>[]>`
        SELECT * FROM memo_card 
        WHERE LENGTH(original_text) < 80 AND user_id = ${session.userId}
        OFFSET ${randomSkip} 
        LIMIT 10
    `;

    const [latestCards, randomCards] = await Promise.all([latestCardsPromise, randomCardsPromise]);

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
