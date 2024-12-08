"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { $Enums } from "@prisma/client";

// 假定 $Enums.exam_status_enum 是从 prisma 自动生成的枚举类型

export async function updateExamStatus(exam_id: string, new_status: $Enums.exam_status_enum) {
    // 获取用户会话
    const session = await auth();
    const user_id = session?.userId;

    if (!user_id) {
        return { success: false, message: "User not authenticated" };
    }

    if (!exam_id) {
        return { success: false, message: "exam_id is required" };
    }

    try {
        // 更新指定的 exams 数据
        const updatedExam = await prisma.exams.update({
            where: { exam_id },
            data: {
                status: new_status,
            },
        });

        return { success: true, message: "Exam status updated successfully", updatedExam };
    } catch (error) {
        return { success: false, message: "Failed to update exam status" };
    }
}
