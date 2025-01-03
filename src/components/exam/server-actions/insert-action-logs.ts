"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { $Enums } from "@prisma/client";

export async function insertActionLogs(
    related_id: string,
    action_type: $Enums.action_type_enum,
    related_type: $Enums.related_type_enum,
) {
    const session = await auth();

    if (!session?.userId) {
        throw new Error('ユーザー未登録');
    }

    // 既存のログを確認
    const existingLog = await prisma.user_action_logs.findFirst({
        where: {
            user_id: session.userId,
            action_type,
            related_id,
            related_type
        }
    });

    // 既存のログがない場合のみ新規作成
    if (!existingLog) {
        await prisma.user_action_logs.create({
            data: {
                user_id: session.userId,
                action_type,
                related_id,
                related_type
            }
        });
    }

    return null;
}
