"use server"
import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma"
import { checkSubscription } from "@/server-actions/check-subscription";
import { $Enums } from "@prisma/client";

export type CardType = 'memo_card' | 'word_card';

export async function checkLimit(cardType: CardType): Promise<boolean> {
    const session = await getSession();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // 检查用户是否是订阅用户
    const { isSubscribed } = await checkSubscription();
    
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
        try {
            console.log("用户ID:", session.user.id, "类型:", typeof session.user.id);
            
            const result = await prisma.$queryRaw`
                SELECT COUNT(*) as count
                FROM user_action_logs
                WHERE user_id = ${session.user.id}
                AND action_type = ${actionType}::action_type_enum
                AND create_time >= ${today}
                AND create_time < ${tomorrow}
            `;
            
            console.log("SQL查询结果:", result);
            // @ts-ignore - 忽略类型检查
            const count = Number(result[0]?.count || 0);
            console.log("计数结果:", count, "限制:", dailyLimit);
            return count >= dailyLimit;
        } catch (error) {
            console.error("检查使用限制时出错:", error);
            // 出错时保守处理，假设已达到限制
            return true;
        }
    }

    return false;
}