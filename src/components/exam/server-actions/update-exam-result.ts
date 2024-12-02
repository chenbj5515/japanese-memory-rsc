"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";

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

enum QuestionType {
    KanaFromJapanese = "kana_from_japanese",
    TranslationFromJapanese = "translation_from_japanese",
    JapaneseFromChinese = "japanese_from_chinese",
    TranscriptionFromAudio = "transcription_from_audio"
}

export async function updateExamResult(result: ExamResult) {
    // 获取用户会话
    const session = await auth();
    const user_id = session?.userId;

    if (!user_id) {
        return { success: false, message: "User not authenticated" };
    }

    // 检查是否有 result_id
    if (!result.result_id) {
        return { success: false, message: "result_id is required for updating a record" };
    }

    try {
        // 更新指定的 exam_results 数据
        const updatedResult = await prisma.exam_results.update({
            where: { result_id: result.result_id },
            data: {
                exam_id: result.exam_id ?? undefined,
                question_type: result.question_type,
                question_ref: result.question_ref,
                user_answer: result.user_answer,
                is_correct: result.is_correct,
                score: result.score,
                create_time: result.create_time ? new Date(result.create_time) : undefined,
            },
        });

        return { success: true, message: "Result updated successfully", updatedResult };
    } catch (error) {
        console.error("Error updating exam result:", error);
        return { success: false, message: "Failed to update exam result" };
    }
}
