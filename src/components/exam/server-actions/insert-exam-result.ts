"use server"

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { ExamInfo } from "..";

export async function insertExamResults(results: ExamInfo[], total_score: number) {
    // 获取用户会话
    const session = await auth();
    const user_id = session?.userId;

    if (!user_id) {
        return { success: false, message: "User not authenticated" };
    }

    // 将结果插入到 exam_results 表
    const formattedResults = results.map((result) => ({
        exam_id: result.exam_id, // 关联考试ID
        question: result.question,
        question_type: result.question_type,
        question_ref: result.question_ref,
        user_answer: result.user_answer,
        reference_answer: result.reference_answer,
        is_correct: result.is_correct,
        question_score: result.question_score,
        create_time: new Date(),
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
