import { prisma } from "@/prisma";
import { Prisma } from '@prisma/client';
import { WordCards } from "./word-cards";

export type TWordCard = Prisma.word_cardGetPayload<{}> & {
    memo_card: Prisma.memo_cardGetPayload<{}>
};

export default async function App() {
    const count = await prisma.word_card.count();

    const latestCardsPromise = prisma.word_card.findMany({
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
        skip: randomSkip,
        take: 10,
        include: {
            memo_card: true,
        },
    });

    const results = await Promise.all([latestCardsPromise, randomCardsPromise])

    const wordCards = results.flat(Infinity) as TWordCard[];

    return (
        <div className="pl-5 pb-10 pr-5">
            <WordCards wordCards={wordCards} />
        </div>
    );
}
