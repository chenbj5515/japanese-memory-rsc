"use server"
import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma";

export async function deleteMemoCard(id: string) {
    const session = await getSession();

    const deletedMemoCard = await prisma.memo_card.deleteMany({
        where: {
            id: id,
            user_id: session?.user?.id // 确保只能删除属于当前用户的记录
        },
    });

    return JSON.stringify(deletedMemoCard);
}
