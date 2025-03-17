import { prisma } from "@/prisma";
import { Prisma } from '@prisma/client';
import { getSession } from "@/lib/auth";
import { WordCards } from "./_components/word-cards";

export type TWordCard = Prisma.word_cardGetPayload<{}> & {
    memo_card: Prisma.memo_cardGetPayload<{}>
};

export default async function WordCardsApp() {
    const session = await getSession()
    
    if (!session) {
        return new Error("Unauthorized")
    }

    const newCardsCount = await prisma.word_card.count({
        where: {
            user_id: session?.user?.id,
            review_times: 0
        }
    });

    const newCardsPromise = prisma.word_card.findMany({
        where: {
            user_id: session?.user?.id,
            review_times: 0
        },
        orderBy: {
            create_time: 'desc',
        },
        take: 10,
        include: {
            memo_card: true,
        },
    });

    const remainingCount = Math.max(0, 10 - newCardsCount);

    const reviewCardsPromise = remainingCount > 0 ? prisma.word_card.findMany({
        where: {
            user_id: session?.user?.id,
            review_times: {
                gt: 0
            }
        },
        orderBy: {
            forget_count: 'desc',
        },
        take: remainingCount,
        include: {
            memo_card: true,
        },
    }) : Promise.resolve([]);

    return (
        <div className="w-full pl-[20px] pb-10 pr-[20px]">
            <WordCards 
                newCardsPromise={newCardsPromise}
                reviewCardsPromise={reviewCardsPromise}
            />
        </div>
    );
}

// export const dynamic = 'force-dynamic';