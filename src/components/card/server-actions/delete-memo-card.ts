"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function deleteMemoCard(id: string) {
    // 获取当前用户的session
    const session = await auth();

    // 通过ID删除memo_card表中的记录
    const deletedMemoCard = await prisma.memo_card.deleteMany({
        where: {
            id: id,
            user_id: session?.userId // 确保只能删除属于当前用户的记录
        },
    });
    console.log(deletedMemoCard, "deletedMemoCard======")

    // 返回删除的结果，包含被删除的记录数量
    return JSON.stringify(deletedMemoCard);
}
