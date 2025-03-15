"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function updateMemoCardTranslation(id: string, translation: string) {
    const session = await auth();

    if (!session?.user_id) {
        throw new Error('ユーザー未登録');
    }

    const updatedMemoCard = await prisma.memo_card.updateMany({
        where: {
            id: id,
            user_id: session.user_id
        },
        data: {
            translation: translation
        },
    });

    return JSON.stringify(updatedMemoCard);
}
