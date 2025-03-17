"use server"
import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma";

export async function updatePronunciation(id: string, kana_pronunciation: string) {
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
            kana_pronunciation
        },
    });

    return JSON.stringify(updatedMemoCard);
}
