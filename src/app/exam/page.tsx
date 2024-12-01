import { prisma } from "@/prisma";
import { auth } from "@/auth";
import NewExam from "@/components/exam";
import { Prisma } from '@prisma/client';
import CompletedExam from "@/components/exam/completed-exam";

export default async function App({ searchParams }: { searchParams: { [key: string]: string } }) {
    const { id } = await searchParams;
    console.log(id, "id===")

    const session = await auth()
    const exam = await prisma.exams.findUnique({
        where: { exam_id: id },
        select: { exam_id: true, status: true },
    });

    if (exam?.status !== "initial") {
        return null
        // return <CompletedExam resultData={exam.result_data} />;
    } else {
        const count = await prisma.word_card.count();

        const randomSkip = Math.max(0, Math.floor(Math.random() * (count - 10)));
        const wordCards = await prisma.word_card.findMany({
            where: {
                user_id: session?.userId,
            },
            skip: randomSkip,
            take: 20,
            include: {
                memo_card: true,
            },
        });

        const randomShortCards = await prisma.$queryRaw<Prisma.memo_cardGetPayload<{}>[]>`
            SELECT *
            FROM memo_card
            WHERE LENGTH(original_text) < 50
            ORDER BY RANDOM()
            LIMIT 5
        `;
        return <NewExam wordCards={wordCards} randomShortCards={randomShortCards} />;
    }
}

