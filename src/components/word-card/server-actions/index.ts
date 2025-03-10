"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { $Enums } from "@prisma/client";

export async function updateReviewTimes(id: string) {
    const session = await auth();

    if (!session?.userId) {
        throw new Error('ユーザー未登録');
    }

    const updatedWordCard = await prisma.word_card.updateMany({
        where: {
            id: id,
            user_id: session?.userId
        },
        data: {
            review_times: {
                increment: 1
            }
        }
    });

    prisma.user_action_logs.create({
        data: {
            user_id: session?.userId,
            action_type: $Enums.action_type_enum.COMPLETE_WORD_REVIEW,
            related_id: id,
            related_type: 'word_card'
        }
    });

    return JSON.stringify(updatedWordCard);
}
