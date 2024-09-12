"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function updateReviewTimes(id: string) {
    // 获取当前用户的session
    const session = await auth();

    // 更新memo_card表中指定ID的review_times字段为原值加1
    const updatedMemoCard = await prisma.memo_card.updateMany({
        where: {
            id: id,
            user_id: session?.userId // 确保只能更新属于当前用户的记录
        },
        data: {
            review_times: {
                increment: 1 // review_times字段加1
            },
        },
    });

    // 返回更新的结果，包含被更新的记录数量
    return JSON.stringify(updatedMemoCard);
}
