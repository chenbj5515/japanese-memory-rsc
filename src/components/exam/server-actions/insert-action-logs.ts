"use server"
import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma";
import { $Enums } from "@prisma/client";

export async function insertActionLogs(
    related_id: string,
    action_type: $Enums.action_type_enum,
    related_type: $Enums.related_type_enum,
) {
    const session = await getSession();

    if (!session?.user.id) {
        throw new Error('ユーザー未登録');
    }

    // 既存のログを確認
    const existingLog = await prisma.user_action_logs.findFirst({
        where: {
            userId: session?.user?.id,
            action_type,
            related_id,
            related_type
        }
    });

    if (existingLog) {
        // 既存のログがある場合は createTime を更新
        await prisma.user_action_logs.update({
            where: {
                id: existingLog.id
            },
            data: {
                create_time: new Date()
            }
        });
    } else {
        // 既存のログがない場合は新規作成
        await prisma.user_action_logs.create({
            data: {
                user_id: session.user.id,
                action_type,
                related_id,
                related_type
            }
        });
    }

    return null;
}
