"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function updateReviewTimes(id: string) {
    // 获取当前用户的 session
    const session = await auth();

    // 确保用户已登录
    if (!session?.userId) {
        throw new Error('用户未登录');
    }

    // 更新 memo_card 表中指定 ID 的记录的 review_times 字段，增加 1
    const updatedMemoCard = await prisma.memo_card.updateMany({
        where: {
            id: id,
            user_id: session.userId // 确保只能更新属于当前用户的记录
        },
        data: {
            review_times: {
                increment: 1 // review_times 字段在当前基础上加 1
            }
        }
    });

    // 返回更新的结果，包含被更新的记录数量
    return JSON.stringify(updatedMemoCard);
}
