"use server"

import { auth } from "@/auth";
import { prisma } from "@/prisma";

enum QuestionType {
    KanaFromJapanese = "kana_from_japanese",
    TranslationFromJapanese = "translation_from_japanese",
    JapaneseFromChinese = "japanese_from_chinese",
    TranscriptionFromAudio = "transcription_from_audio"
}

interface ExamResult {
    result_id: string | null; // UUID or null before saving
    exam_id: string | null; // UUID or null before associating with an exam
    question_type: QuestionType; // Type of question
    question_ref: string; // Reference to word_card or memo_card ID
    question: string; // The question text
    reference_answer: string; // The correct answer
    user_answer: string; // The user's answer
    is_correct: boolean; // Whether the answer is correct
    score: number; // The score for the question
    create_time: string | null; // ISO timestamp or null before saving
}

export async function insertExamResults(results: ExamResult[]) {
    // 获取用户会话
    const session = await auth();
    const user_id = session?.userId;

    if (!user_id) {
        return { success: false, message: "User not authenticated" };
    }

    // 获取当前考试信息或创建新考试
    const exam = await prisma.exams.create({
        data: {
            exam_name: "New Exam",
            user_id,
            create_time: new Date(),
        },
    });

    const exam_id = exam.exam_id;

    // 将结果插入到 exam_results 表
    const formattedResults = results.map((result) => ({
        result_id: result.result_id ?? undefined, // 如果为空，Prisma将生成UUID
        exam_id, // 关联考试ID
        question_type: result.question_type,
        question_ref: result.question_ref,
        user_answer: result.user_answer,
        is_correct: result.is_correct,
        score: result.score,
        create_time: result.create_time ?? new Date(),
    }));

    try {
        const insertedResults = await Promise.all(
            formattedResults.map(result => prisma.exam_results.create({ data: result }))
        );

        return { success: true, message: "Results inserted successfully", insertedResults: insertedResults };
    } catch (error) {
        console.error("Error inserting exam results:", error);
        return { success: false, message: "Failed to insert exam results" };
    }
}
