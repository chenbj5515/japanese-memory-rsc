"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function updatePronunciation(id: string, kana_pronunciation: string) {
    const session = await auth();

    if (!session?.user_id) {
        throw new Error('用户未登录');
    }

    const updatedMemoCard = await prisma.memo_card.updateMany({
        where: {
            id: id,
            user_id: session.user_id
        },
        data: {
            kana_pronunciation
        },
    });

    return JSON.stringify(updatedMemoCard);
}
