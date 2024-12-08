import { prisma } from "@/prisma";
import { auth } from "@/auth";
import NewExam, { ExamInfo } from "@/components/exam";
import { $Enums, Prisma } from '@prisma/client';
import { containsKanji, getDiff } from "@/utils";

export default async function App({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
    const { id } = await searchParams;

    const session = await auth()

    if (!session?.userId) {
        return null;
    }

    const exam = await prisma.exams.findUnique({
        where: { exam_id: id, user_id: session.userId },
        select: { exam_id: true, status: true },
    });

    if (exam?.status !== "initial") {
        const examResults = await prisma.exam_results.findMany({
            where: { exam_id: id },
            select: {
                result_id: true,
                exam_id: true,
                question: true,
                question_type: true,
                question_ref: true,
                user_answer: true,
                is_correct: true,
                question_score: true,
                create_time: true,
            },
        });

        let no = 0;
        const initialResults: ExamInfo[] = await Promise.all(examResults.map(async (result) => {
            if (result.question_type === $Enums.question_type_enum.transcription_from_audio) {
                const memoCard = await prisma.memo_card.findUnique({
                    where: { id: result.question_ref },
                    // 根据实际字段需求去选择
                    select: {
                        id: true,
                        translation: true,
                        create_time: true,
                        update_time: true,
                        record_file_path: true,
                        original_text: true,
                        review_times: true,
                        user_id: true,
                        kana_pronunciation: true,
                    },
                });
                return {
                    ...result,
                    no: no++,
                    cardInfo: memoCard,
                    reference_answer: memoCard?.original_text || "",
                    completed: true,
                    judge_result: getDiff(memoCard?.original_text || "", result.user_answer).htmlString
                };
            } else {
                const wordCard = await prisma.word_card.findUnique({
                    where: {
                        id: result.question_ref,
                        user_id: session.userId
                    },
                    // 根据实际字段需求去选择
                    select: {
                        id: true,
                        word: true,
                        meaning: true,
                        create_time: true,
                        user_id: true,
                        review_times: true,
                        memo_card_id: true,
                        memo_card: true
                    },
                });
                return {
                    ...result,
                    no: no++,
                    wordCard,
                    reference_answer: result.question_type === $Enums.question_type_enum.kana_from_japanese ? "" : wordCard?.meaning?.replace("意味：", "") || "",
                    completed: true
                }
            }
            
        }))

        return <NewExam initialResults={initialResults} id={id} />;
    } else {
        const count = await prisma.word_card.count({
            where: {
                user_id: session?.userId, // 添加 user_id 条件
            },
        });

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
                AND user_id = ${session?.userId}
            ORDER BY RANDOM()
            LIMIT 5
        `;

        const initialResults: ExamInfo[] = [];
        let no = 0;
        // 日本語から中国語等
        wordCards.slice(0, 10).forEach((wordCard) => {
            if (containsKanji(wordCard.word)) {
                initialResults.push({
                    no: no++,
                    result_id: "",
                    exam_id: id,
                    question_type: $Enums.question_type_enum.kana_from_japanese,
                    question_ref: wordCard.id,
                    question: wordCard.word,
                    reference_answer: '',
                    user_answer: '',
                    is_correct: false,
                    wordCard,
                    question_score: 2,
                    judging: false,
                    completed: false
                });
                initialResults.push({
                    no: no++,
                    result_id: "",
                    exam_id: id,
                    question_type: $Enums.question_type_enum.translation_from_japanese,
                    question_ref: wordCard.id,
                    question: wordCard.word,
                    reference_answer: wordCard.meaning.replace("意味：", ""),
                    user_answer: '',
                    is_correct: false,
                    wordCard,
                    question_score: 2,
                    judging: false,
                    completed: false
                });
            } else {
                initialResults.push({
                    no: no++,
                    result_id: "",
                    exam_id: id,
                    question_type: $Enums.question_type_enum.translation_from_japanese,
                    question_ref: wordCard.id,
                    question: wordCard.word,
                    reference_answer: wordCard.meaning.replace("意味：", ""),
                    user_answer: '',
                    is_correct: false,
                    wordCard,
                    question_score: 4,
                    judging: false,
                    completed: false
                });
            }
        });

        // 中国語から日本語
        wordCards.slice(10).forEach((wordCard) => {
            initialResults.push({
                no: no++,
                result_id: "",
                exam_id: id,
                question_type: $Enums.question_type_enum.japanese_from_chinese,
                question_ref: wordCard.id,
                question: wordCard.meaning.replace("意味：", ""),
                reference_answer: wordCard.word,
                user_answer: '',
                is_correct: false,
                wordCard,
                question_score: 4,
                judging: false,
                completed: false
            });
        });

        // 聴解問題
        randomShortCards.forEach((cardInfo) => {
            initialResults.push({
                no: no++,
                result_id: "",
                exam_id: id,
                question_type: $Enums.question_type_enum.transcription_from_audio,
                question_ref: cardInfo.id as string,
                question: cardInfo.original_text || '',
                reference_answer: cardInfo.original_text || '',
                user_answer: '',
                is_correct: false,
                cardInfo,
                question_score: 4,
                judging: false,
                completed: false
            });
        });
        return <NewExam initialResults={initialResults} id={id} />;
    }
}

