"use server"
import { auth } from "@/auth";
import { prisma } from "@/prisma"
import { checkSubscription } from "@/server-actions/check-subscription";
import { $Enums } from "@prisma/client";

export type CardType = 'memo_card' | 'word_card';

export async function checkLimit(cardType: CardType): Promise<boolean> {
    const session = await auth();

    if (!session?.user_id) {
        throw new Error("Unauthorized");
    }

    // 检查用户是否是订阅用户
    const isSubscribed = await checkSubscription();
    
    if (!isSubscribed) {
        // 如果不是订阅用户，检查使用限制
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // 设置每日使用限制
        const dailyLimit = 20;

        // 根据卡片类型选择对应的action type
        const actionType = cardType === 'memo_card' 
            ? $Enums.action_type_enum.CREATE_MEMO 
            : $Enums.action_type_enum.CREATE_WORD;

        // 获取今天创建的卡片数量
        const todayCount = await prisma.user_action_logs.count({
            where: {
                user_id: session.user_id,
                action_type: actionType,
                create_time: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });

        return todayCount >= dailyLimit;
    }

    return false;
}