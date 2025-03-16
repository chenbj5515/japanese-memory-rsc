import { getSession } from '@/lib/auth';
import ExamPreparation from '@/components/exam/exam-preparation';
import { prisma } from '@/prisma';
import { getLocaleServer } from '@/server-actions/get-locale-server';
import { Prisma } from '@prisma/client';
import { headers } from 'next/headers';

interface Exam {
    id: string
    date: string
    score: number
    duration: number
}

interface ExamMonth {
    month: string
    exams: Exam[]
}

export default async function App() {
    const session = await getSession()

    if (!session?.user?.id) {
        return null;
    }

    const count = await prisma.word_card.count({
        where: {
            user_id: session?.user?.id,
        },
    });
    const randomShortCards = await prisma.$queryRaw<Prisma.memo_cardGetPayload<{}>[]>`
        SELECT *
        FROM memo_card
        WHERE LENGTH(original_text) < 50
                AND user_id = ${session?.user?.id}
        ORDER BY RANDOM()
        LIMIT 5
    `;

    if (count < 30 || randomShortCards.length < 5) {
        return <ExamPreparation examHistory={[]} dataEnough={false} /> 
    }

    const exams = await prisma.exams.findMany({
        where: { user_id: session?.user?.id },
        orderBy: {
            create_time: 'desc',
        },
    });

    // 使用 Map 对结果进行分组
    const groupedByMonth = new Map<string, Exam[]>();

    for (const exam of exams) {
        const d = new Date(exam.create_time);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

        // 根据不同的语言环境设置不同格式的monthKey
        let monthKey;
        const locale = await getLocaleServer();
        switch (locale) {
            case 'zh':
                monthKey = `${year}年${Number(month)}月`;
                break;
            case 'zh-TW':
                monthKey = `${year}年${Number(month)}月`;
                break;
            default: // 'en'
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                                  'July', 'August', 'September', 'October', 'November', 'December'];
                monthKey = `${monthNames[Number(month) - 1]} ${year}`;
                break;
        }

        if (!groupedByMonth.has(monthKey)) {
            groupedByMonth.set(monthKey, []);
        }

        groupedByMonth.get(monthKey)!.push({
            id: exam.exam_id,
            date: formattedDate,
            score: exam.total_score,
            duration: Math.floor((exam.duration_seconds || 25 * 60) / 60),
        });
    }

    // 将 Map 转换为数组
    const examHistory: ExamMonth[] = Array.from(groupedByMonth.entries()).map(([month, exams]) => ({
        month,
        exams,
    }));

    return <ExamPreparation examHistory={examHistory} dataEnough />
}
