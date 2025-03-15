"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { TWordCard } from "../page";

export async function updateReviewTimes(wordCardInfo: TWordCard) {
    const session = await auth();

    if (!session?.user_id) {
        throw new Error('ユーザー未登録');
    }

    const updatedMemoCard = await prisma.word_card.update({
        where: {
            id: wordCardInfo.id,
            user_id: session?.user_id
        },
        data: {
            review_times: {
                increment: 1
            },
        },
        select: {
            id: true,
            review_times: true,
        },
    });

    return JSON.stringify(updatedMemoCard);
}
