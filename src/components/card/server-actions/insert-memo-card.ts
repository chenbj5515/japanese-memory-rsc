"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma"
import { checkLimit } from "@/server-actions/check-limit";
import { $Enums } from "@prisma/client";

export async function insertMemoCard(originalText: string, translation: string, pronunciation: string, url: string) {
    const session = await auth();
    if (!session?.user_id) {
        return null;
    }

    if (!checkLimit("memo_card")) {
        throw new Error("Daily limit reached");
    }

    const newMemoCard = await prisma.memo_card.create({
        data: {
            record_file_path: "",
            original_text: originalText,
            review_times: 0,
            translation: translation,
            user_id: session?.user_id,
            kana_pronunciation: pronunciation,
            create_time: new Date(),
            update_time: new Date(),
            context_url: url
        },
    });

    // 创建用户行为日志
    await prisma.user_action_logs.create({
        data: {
            user_id: session.user_id,
            action_type: $Enums.action_type_enum.CREATE_MEMO,
            related_id: newMemoCard.id,
            related_type: $Enums.related_type_enum.memo_card
        }
    });

    return JSON.stringify(newMemoCard);
}
