"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { $Enums } from "@prisma/client";

export async function updateReviewTimes(id: string) {
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
            review_times: {
                increment: 1
            }
        }
    });

    // ログは非同期で記録
    prisma.user_action_logs.create({
        data: {
            user_id: session.user_id,
            action_type: $Enums.action_type_enum.COMPLETE_SENTENCE_REVIEW,
            related_id: id,
            related_type: 'memo_card'
        }
    }).catch(error => {
        console.error('Failed to create action log:', error);
    });

    return JSON.stringify(updatedMemoCard);
}


