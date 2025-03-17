"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma";
import { insertActionLogs } from "./insert-action-logs";
import { $Enums } from "@prisma/client";

export async function updateExamResult(exam_id: string, result_id: string, total_score: number) {
    // 获取用户会话
    const session = await getSession();
    const userId = session?.user.id;

    if (!userId) {
        return { success: false, message: "User not authenticated" };
    }

    // 检查是否有 result_id
    if (!result_id) {
        return { success: false, message: "result_id is required for updating a record" };
    }

    try {
        await prisma.exams.update({
            where: {
                exam_id,
                userId: session?.user?.id
            },
            data: {
                total_score,
            },
        });

        // 更新指定的 exam_results 数据
        const updatedResult = await prisma.exam_results.update({
            where: {
                result_id,
            },
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
