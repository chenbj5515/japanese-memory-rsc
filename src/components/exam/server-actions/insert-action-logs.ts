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

    await prisma.user_action_logs.create({
        data: {
            user_id: session?.userId,
            action_type,
            related_id,
            related_type
        }
    });

    return null;
}
