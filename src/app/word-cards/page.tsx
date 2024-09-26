import { redirect } from "next/navigation";
import { prisma } from "@/prisma";
import { Prisma } from '@prisma/client';
import { auth } from "@/auth";
import { WordCards } from "./_components/word-cards";

export type TWordCard = Prisma.word_cardGetPayload<{}> & {
    memo_card: Prisma.memo_cardGetPayload<{}>
};

export default async function App() {
    const count = await prisma.word_card.count();
    const session = await auth()
    if (!session?.userId) {
        redirect("/api/auth/signin")
    }

    const latestCardsPromise = prisma.word_card.findMany({
        where: {
            user_id: session.userId,
        },
        orderBy: {
            create_time: 'desc',
        },
        take: 10,
        include: {
            memo_card: true,
        },
    });

    const randomSkip = Math.max(0, Math.floor(Math.random() * (count - 10)));
    const randomCardsPromise = prisma.word_card.findMany({
        where: {
            user_id: session.userId,
        },
        skip: randomSkip,
        take: 10,
        include: {
            memo_card: true,
        },
    });

    const results = await Promise.all([latestCardsPromise, randomCardsPromise])

    const wordCards = results.flat(Infinity) as TWordCard[];

    return (
        <div className="w-full pl-[20px] pb-10 pr-[20px]">
            {
                wordCards.length ? (
                    <div className="flex mt-[80px] items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-blue-800">
                        <div className="px-4 mx-auto text-center lg:px-8 sm:py-24 lg:py-32">
                            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
                                データが見つかりません
                            </h1>
                        </div>
                    </div>
                ) : <WordCards wordCards={wordCards} />
            }
        </div>
    );
}

export const dynamic = 'force-dynamic';