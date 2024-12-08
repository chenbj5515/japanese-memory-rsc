"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { ExamInfo } from "..";

export async function updateExamResult(exam_id: string, result_id: string, total_score: number) {
    // 获取用户会话
    const session = await auth();
    const user_id = session?.userId;

    if (!user_id) {
        return { success: false, message: "User not authenticated" };
    }

    // 检查是否有 result_id
    if (!result_id) {
        return { success: false, message: "result_id is required for updating a record" };
    }

    try {
        console.log(exam_id, total_score, "total_score===")
        const updatedExam = await prisma.exams.update({
            where: { exam_id },
            data: {
                total_score,
            },
        });

        console.log(updatedExam, "updatedExam===")

        // 更新指定的 exam_results 数据
        const updatedResult = await prisma.exam_results.update({
            where: { result_id },
            data: {
                is_correct: true,
            },
        });

        return { success: true, message: "Result updated successfully", updatedResult };
    } catch (error) {
        console.error("Error updating exam result:", error);
        return { success: false, message: "Failed to update exam result" };
    }
}
