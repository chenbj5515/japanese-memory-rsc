"use server"
import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma";

export async function updateOriginalText(id: string, original_text: string) {
    const session = await getSession();

    if (!session?.user.id) {
        throw new Error('用户未登录');
    }

    const updatedMemoCard = await prisma.memo_card.updateMany({
        where: {
            id: id,
            user_id: session?.user?.id
        },
        data: {
            original_text
        },
    });

    return JSON.stringify(updatedMemoCard);
}
