import { auth } from '@/auth';
import ExamPreparation from '@/components/exam/exam-preparation';
import { prisma } from '@/prisma';

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
    const session = await auth()

    if (!session?.userId) {
        return null;
    }

    const exams = await prisma.exams.findMany({
        orderBy: {
            create_time: 'desc', // 根据需要排序
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

        const monthKey = `${year}年${Number(month)}月`;

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

    return <ExamPreparation examHistory={examHistory} />
}
